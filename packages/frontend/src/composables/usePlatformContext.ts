import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { PlatformContext, PlatformContextOptions, PlatformEvent } from '../types'

const platformContext = ref<PlatformContext>({
  isIntegrated: false,
  theme: 'system',
})

// Track allowed origins for postMessage security
let allowedOrigins: Set<string> = new Set()
let allowAnyOrigin = false
let initialized = false

/**
 * Derive origin from URL (protocol + host)
 */
function getOriginFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.origin
  } catch {
    return null
  }
}

/**
 * Check if an origin is allowed for postMessage communication
 */
function isOriginAllowed(origin: string): boolean {
  // Development mode: allow any origin (must be explicitly enabled)
  if (allowAnyOrigin) {
    console.warn('[MLD SDK] postMessage origin validation disabled - only use in development')
    return true
  }

  // Same origin is always allowed
  if (origin === window.location.origin) {
    return true
  }

  // Check against allowed origins list
  return allowedOrigins.has(origin)
}

/**
 * Platform context composable for plugin integration with MLD Platform.
 *
 * Provides secure communication with the parent platform via postMessage.
 *
 * @param options - Configuration options
 * @param options.allowedOrigins - List of allowed origins for postMessage
 * @param options.allowAnyOrigin - Allow any origin (UNSAFE, development only)
 *
 * @example
 * ```typescript
 * // Basic usage - derives origin from platform injection
 * const { isIntegrated, user, theme } = usePlatformContext()
 *
 * // With explicit allowed origins
 * const { isIntegrated } = usePlatformContext({
 *   allowedOrigins: ['https://mld.example.com']
 * })
 *
 * // Development mode (UNSAFE)
 * const { isIntegrated } = usePlatformContext({
 *   allowAnyOrigin: import.meta.env.DEV
 * })
 * ```
 */
export function usePlatformContext(options: PlatformContextOptions = {}) {
  function detectPlatform(): void {
    // Check if running under MLD Platform by looking for platform-injected global
    const platformData = (window as unknown as { __MLD_PLATFORM__?: PlatformContext }).__MLD_PLATFORM__

    if (platformData) {
      platformContext.value = {
        ...platformData,
        isIntegrated: true,
      }

      // Derive platform origin from injected data
      if (platformData.platformOrigin) {
        allowedOrigins.add(platformData.platformOrigin)
      } else if (platformData.platformApiUrl) {
        const origin = getOriginFromUrl(platformData.platformApiUrl)
        if (origin) {
          allowedOrigins.add(origin)
        }
      }
    } else {
      // Check for platform indicator in URL or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      const hasPluginParam = urlParams.has('mld-plugin')

      // Try to get platform origin from URL parameter
      const platformOrigin = urlParams.get('mld-origin')
      if (platformOrigin) {
        const origin = getOriginFromUrl(platformOrigin)
        if (origin) {
          allowedOrigins.add(origin)
        }
      }

      platformContext.value = {
        isIntegrated: hasPluginParam,
        theme: (localStorage.getItem('mld-theme') as 'light' | 'dark' | 'system') || 'system',
        platformOrigin: platformOrigin || undefined,
      }
    }

    // Add user-provided allowed origins
    if (options.allowedOrigins) {
      for (const origin of options.allowedOrigins) {
        const normalized = getOriginFromUrl(origin) || origin
        allowedOrigins.add(normalized)
      }
    }

    // Set development mode flag
    if (options.allowAnyOrigin) {
      allowAnyOrigin = true
    }
  }

  function handlePlatformMessage(event: MessageEvent): void {
    // Only accept messages from parent window (platform)
    if (event.source !== window.parent) return

    // Validate origin for security
    if (!isOriginAllowed(event.origin)) {
      console.warn(`[MLD SDK] Rejected postMessage from untrusted origin: ${event.origin}`)
      return
    }

    try {
      const platformEvent = event.data as PlatformEvent
      if (!platformEvent.type?.startsWith('mld:')) return

      switch (platformEvent.type) {
        case 'mld:theme-changed':
          platformContext.value.theme = platformEvent.payload as 'light' | 'dark' | 'system'
          break
        case 'mld:user-changed':
          platformContext.value.user = platformEvent.payload as PlatformContext['user']
          break
      }
    } catch {
      // Ignore invalid messages
    }
  }

  /**
   * Send a message to the parent platform.
   * Uses validated target origin for security.
   */
  function sendToPlatform(event: PlatformEvent): void {
    if (!platformContext.value.isIntegrated || window.parent === window) {
      return
    }

    // Determine target origin
    let targetOrigin: string

    if (platformContext.value.platformOrigin) {
      // Use explicitly configured platform origin
      targetOrigin = platformContext.value.platformOrigin
    } else if (allowedOrigins.size > 0) {
      // Use first allowed origin (typically the platform)
      targetOrigin = allowedOrigins.values().next().value as string
    } else if (allowAnyOrigin) {
      // Development mode fallback
      targetOrigin = '*'
      console.warn('[MLD SDK] Using wildcard origin for postMessage - only use in development')
    } else {
      // Safety: if no origin is configured, log warning and don't send
      console.warn('[MLD SDK] Cannot send postMessage: no platform origin configured')
      return
    }

    window.parent.postMessage(event, targetOrigin)
  }

  /**
   * Request navigation to a path in the platform.
   */
  function navigate(path: string): void {
    sendToPlatform({
      type: 'mld:navigate',
      payload: path,
    })
  }

  /**
   * Show a notification in the platform.
   */
  function notify(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    sendToPlatform({
      type: 'mld:notification',
      payload: { message, type },
    })
  }

  onMounted(() => {
    if (!initialized) {
      detectPlatform()
      window.addEventListener('message', handlePlatformMessage)
      initialized = true
    }
  })

  onUnmounted(() => {
    // Don't remove listener as other components may still need it
  })

  const isIntegrated = computed(() => platformContext.value.isIntegrated)
  const plugin = computed(() => platformContext.value.plugin)
  const user = computed(() => platformContext.value.user)
  const theme = computed(() => platformContext.value.theme)
  const features = computed(() => platformContext.value.features)

  return {
    context: platformContext,
    isIntegrated,
    plugin,
    user,
    theme,
    features,
    navigate,
    notify,
    sendToPlatform,
  }
}
