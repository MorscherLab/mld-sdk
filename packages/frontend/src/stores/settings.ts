import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode, ColorPalette, TableDensity } from '../types'

export interface SettingsState {
  serverHost: string
  serverPort: number
  requestTimeout: number
  wsAutoReconnect: boolean
  wsReconnectInterval: number
  theme: ThemeMode
  colorPalette: ColorPalette
  tableDensity: TableDensity
}

const STORAGE_KEY = 'mld-settings'

function getDefaultServerHost(): string {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.hostname
  }
  return 'localhost'
}

function getDefaultServerPort(): number {
  if (typeof window !== 'undefined' && window.location.port) {
    return parseInt(window.location.port, 10)
  }
  return 8000
}

const defaultSettings: SettingsState = {
  serverHost: getDefaultServerHost(),
  serverPort: getDefaultServerPort(),
  requestTimeout: 120000,
  wsAutoReconnect: true,
  wsReconnectInterval: 5000,
  theme: 'system',
  colorPalette: 'default',
  tableDensity: 'normal',
}

export const colorPalettes: Record<ColorPalette, { name: string; hues: [number, number] }> = {
  default: { name: 'Default (Cyan-Pink)', hues: [180, 320] },
  colorblind: { name: 'Colorblind-friendly', hues: [45, 260] },
  viridis: { name: 'Viridis', hues: [280, 80] },
  pastel: { name: 'Pastel', hues: [200, 340] },
}

function loadSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultSettings, ...parsed }
    }
  } catch (e) {
    console.warn('Failed to load settings from localStorage:', e)
  }
  return { ...defaultSettings }
}

function saveSettings(settings: SettingsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.warn('Failed to save settings to localStorage:', e)
  }
}

export const useSettingsStore = defineStore('mld-settings', () => {
  // State
  const serverHost = ref(defaultSettings.serverHost)
  const serverPort = ref(defaultSettings.serverPort)
  const requestTimeout = ref(defaultSettings.requestTimeout)
  const wsAutoReconnect = ref(defaultSettings.wsAutoReconnect)
  const wsReconnectInterval = ref(defaultSettings.wsReconnectInterval)
  const theme = ref<ThemeMode>(defaultSettings.theme)
  const colorPalette = ref<ColorPalette>(defaultSettings.colorPalette)
  const tableDensity = ref<TableDensity>(defaultSettings.tableDensity)

  // API prefix - can be configured via env variable VITE_API_PREFIX
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const importMeta = import.meta as any
  const apiPrefix: string = importMeta.env?.VITE_API_PREFIX ?? '/api'

  function getApiBaseUrl(): string {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const currentPort = typeof window !== 'undefined' ? window.location.port : '8000'

    if (serverHost.value === currentHost && String(serverPort.value) === currentPort) {
      return apiPrefix
    }

    if (serverHost.value === 'localhost' && currentHost !== 'localhost') {
      return apiPrefix
    }

    return `http://${serverHost.value}:${serverPort.value}${apiPrefix}`
  }

  function getWsBaseUrl(): string {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const currentPort = typeof window !== 'undefined' ? window.location.port : '8000'
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'

    if (serverHost.value === currentHost && String(serverPort.value) === currentPort) {
      return `${protocol}//${currentHost}:${currentPort}${apiPrefix}`
    }

    if (serverHost.value === 'localhost' && currentHost !== 'localhost') {
      return `${protocol}//${currentHost}:${currentPort}${apiPrefix}`
    }

    return `ws://${serverHost.value}:${serverPort.value}${apiPrefix}`
  }

  function initialize() {
    const loaded = loadSettings()
    serverHost.value = loaded.serverHost
    serverPort.value = loaded.serverPort
    requestTimeout.value = loaded.requestTimeout
    wsAutoReconnect.value = loaded.wsAutoReconnect
    wsReconnectInterval.value = loaded.wsReconnectInterval
    theme.value = loaded.theme
    colorPalette.value = loaded.colorPalette
    tableDensity.value = loaded.tableDensity

    applyTheme()
  }

  function applyTheme() {
    let isDark = false

    if (theme.value === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark = theme.value === 'dark'
    }

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  watch(theme, () => {
    applyTheme()
    persistSettings()
  })

  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }

  function persistSettings() {
    saveSettings({
      serverHost: serverHost.value,
      serverPort: serverPort.value,
      requestTimeout: requestTimeout.value,
      wsAutoReconnect: wsAutoReconnect.value,
      wsReconnectInterval: wsReconnectInterval.value,
      theme: theme.value,
      colorPalette: colorPalette.value,
      tableDensity: tableDensity.value,
    })
  }

  watch([serverHost, serverPort, requestTimeout, wsAutoReconnect, wsReconnectInterval, colorPalette, tableDensity], () => {
    persistSettings()
  })

  function resetToDefaults() {
    serverHost.value = defaultSettings.serverHost
    serverPort.value = defaultSettings.serverPort
    requestTimeout.value = defaultSettings.requestTimeout
    wsAutoReconnect.value = defaultSettings.wsAutoReconnect
    wsReconnectInterval.value = defaultSettings.wsReconnectInterval
    theme.value = defaultSettings.theme
    colorPalette.value = defaultSettings.colorPalette
    tableDensity.value = defaultSettings.tableDensity
  }

  function getPaletteHues(): [number, number] {
    return colorPalettes[colorPalette.value].hues
  }

  function isDark(): boolean {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  }

  return {
    // State
    serverHost,
    serverPort,
    requestTimeout,
    wsAutoReconnect,
    wsReconnectInterval,
    theme,
    colorPalette,
    tableDensity,

    // Actions
    initialize,
    applyTheme,
    persistSettings,
    resetToDefaults,
    getPaletteHues,
    isDark,
    getApiBaseUrl,
    getWsBaseUrl,
  }
})
