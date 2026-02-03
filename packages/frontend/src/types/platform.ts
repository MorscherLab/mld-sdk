// Plugin information provided by the platform
export interface PluginInfo {
  id: string
  name: string
  version: string
  description?: string
  icon?: string
  route_prefix: string
  api_prefix: string
  nav_items?: PluginNavItem[]
  settings?: PluginSettings
}

// Plugin navigation item
export interface PluginNavItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: PluginNavItem[]
}

// Plugin settings schema
export interface PluginSettings {
  [key: string]: PluginSettingField
}

export interface PluginSettingField {
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect'
  label: string
  description?: string
  default?: unknown
  options?: Array<{ value: string; label: string }>
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: string
  }
}

// Platform context - available to plugins when running under MLD Platform
export interface PlatformContext {
  // Is running under the MLD Platform
  isIntegrated: boolean

  // Plugin info (only available when integrated)
  plugin?: PluginInfo

  // Platform API base URL
  platformApiUrl?: string

  // Platform origin for message validation
  // Used to verify postMessage sources and targets
  platformOrigin?: string

  // Current user info (if authenticated)
  user?: {
    id: string
    username: string
    role: string
  }

  // Theme preference
  theme: 'light' | 'dark' | 'system'

  // Features enabled in platform
  features?: {
    experiments?: boolean
    passkey?: boolean
    multiUser?: boolean
  }
}

// Configuration options for usePlatformContext
export interface PlatformContextOptions {
  // Allowed origins for postMessage communication
  // If not specified, derives from platformApiUrl or uses same-origin only
  allowedOrigins?: string[]

  // Whether to allow messages from any origin (UNSAFE - only for development)
  // Default: false
  allowAnyOrigin?: boolean
}

// Platform event types for communication between plugin and platform
export type PlatformEventType =
  | 'mld:theme-changed'
  | 'mld:user-changed'
  | 'mld:navigate'
  | 'mld:notification'

export interface PlatformEvent<T = unknown> {
  type: PlatformEventType
  payload: T
}

// Settings state types
export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorPalette = 'default' | 'colorblind' | 'viridis' | 'pastel'
export type TableDensity = 'compact' | 'normal' | 'comfortable'
