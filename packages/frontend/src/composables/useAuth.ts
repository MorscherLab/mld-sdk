import axios from 'axios'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSettingsStore } from '../stores/settings'
import type { AuthConfig, UserInfo, LoginResponse, TokenVerifyResponse, UpdateProfileRequest } from '../types'

interface UserResponse {
  id: string
  username: string
  shortname: string | null
  email: string | null
  role: string
  is_active: boolean
}

interface RefreshResponse {
  access_token: string
  expires_in: number
  token_type: string
}

// Token refresh configuration
const TOKEN_REFRESH_MARGIN_MS = 5 * 60 * 1000 // Refresh 5 minutes before expiry
const TOKEN_REFRESH_CHECK_INTERVAL_MS = 60 * 1000 // Check every minute

/**
 * Authentication composable with automatic token refresh.
 *
 * Features:
 * - Automatic token refresh before expiration
 * - Login/logout/register functionality
 * - Token verification on startup
 * - User profile management
 *
 * @example
 * ```typescript
 * const { login, logout, isAuthenticated, user } = useAuth()
 *
 * // Login
 * const success = await login('username', 'password')
 *
 * // Automatic refresh is enabled by default
 * // Tokens are refreshed 5 minutes before expiration
 * ```
 */
export function useAuth() {
  const authStore = useAuthStore()
  const settingsStore = useSettingsStore()

  // Track refresh timer
  const refreshTimerId = ref<number | null>(null)
  const isRefreshing = ref(false)

  function getApiBaseUrl(): string {
    return settingsStore.getApiBaseUrl()
  }

  async function fetchAuthConfig(): Promise<AuthConfig> {
    try {
      const response = await axios.get<{
        auth_required: boolean
        passkey_enabled: boolean
        passkey_registered?: boolean
        registration_enabled?: boolean
        database_mode?: string
      }>(`${getApiBaseUrl()}/setup/config/public`)

      const config: AuthConfig = {
        authRequired: response.data.auth_required,
        passkeyEnabled: response.data.passkey_enabled,
        passkeyRegistered: response.data.passkey_registered ?? false,
        registrationEnabled: response.data.registration_enabled ?? false,
        databaseMode: response.data.database_mode ?? 'none',
      }

      authStore.setAuthConfig(config)
      return config
    } catch (error) {
      console.error('Failed to fetch auth config:', error)
      return {
        authRequired: false,
        passkeyEnabled: false,
        passkeyRegistered: false,
        registrationEnabled: false,
        databaseMode: 'none',
      }
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    authStore.setLoading(true)
    authStore.setError(null)

    try {
      const response = await axios.post<LoginResponse>(
        `${getApiBaseUrl()}/auth/login`,
        { username, password }
      )

      authStore.setToken(response.data.access_token, response.data.expires_in)
      authStore.setUsername(username)

      await getCurrentUser()

      // Start auto-refresh after successful login
      scheduleTokenRefresh()

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        authStore.setError(error.response.data.detail || 'Login failed')
      } else {
        authStore.setError('Network error. Please try again.')
      }
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  async function register(username: string, password: string, email?: string): Promise<boolean> {
    authStore.setLoading(true)
    authStore.setError(null)

    try {
      await axios.post<UserResponse>(
        `${getApiBaseUrl()}/users/register`,
        { username, password, email }
      )

      return await login(username, password)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        authStore.setError(error.response.data.detail || 'Registration failed')
      } else {
        authStore.setError('Network error. Please try again.')
      }
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  async function getCurrentUser(): Promise<UserInfo | null> {
    if (!authStore.token) {
      return null
    }

    try {
      const response = await axios.get<UserResponse>(
        `${getApiBaseUrl()}/users/me`,
        { headers: getAuthHeader() }
      )

      const userInfo: UserInfo = {
        id: response.data.id,
        username: response.data.username,
        shortname: response.data.shortname,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.is_active,
      }

      authStore.setUserInfo(userInfo)
      return userInfo
    } catch {
      return null
    }
  }

  async function verifyToken(): Promise<boolean> {
    if (!authStore.token) {
      return false
    }

    try {
      const response = await axios.get<TokenVerifyResponse>(
        `${getApiBaseUrl()}/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      )

      if (response.data.valid && response.data.username) {
        authStore.setUsername(response.data.username)
        return true
      }

      authStore.clearToken()
      return false
    } catch {
      authStore.clearToken()
      return false
    }
  }

  /**
   * Refresh the authentication token.
   * Called automatically before token expiration.
   * Uses promise caching to prevent concurrent refresh requests.
   */
  let refreshPromise: Promise<boolean> | null = null

  async function refreshToken(): Promise<boolean> {
    if (!authStore.token) return false
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      isRefreshing.value = true

      try {
        const response = await axios.post<RefreshResponse>(
          `${getApiBaseUrl()}/auth/refresh`,
          {},
          { headers: getAuthHeader() }
        )

        authStore.setToken(response.data.access_token, response.data.expires_in)

        // Reschedule next refresh
        scheduleTokenRefresh()

        return true
      } catch (error) {
        // If refresh fails, the token may have been revoked
        // Clear auth state and let user re-login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.warn('[Auth] Token refresh failed - session expired')
          authStore.clearToken()
          stopTokenRefresh()
        }
        return false
      } finally {
        isRefreshing.value = false
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  /**
   * Schedule automatic token refresh before expiration.
   */
  function scheduleTokenRefresh(): void {
    // Clear any existing timer
    stopTokenRefresh()

    if (!authStore.tokenExpires) {
      return
    }

    const expiresAt = authStore.tokenExpires.getTime()
    const refreshAt = expiresAt - TOKEN_REFRESH_MARGIN_MS
    const now = Date.now()

    if (refreshAt <= now) {
      // Token is already close to expiring or expired, refresh now
      refreshToken()
      return
    }

    // Schedule refresh
    const delay = refreshAt - now
    refreshTimerId.value = window.setTimeout(() => {
      refreshToken()
    }, delay)
  }

  /**
   * Stop automatic token refresh.
   */
  function stopTokenRefresh(): void {
    if (refreshTimerId.value !== null) {
      window.clearTimeout(refreshTimerId.value)
      refreshTimerId.value = null
    }
  }

  /**
   * Check if token needs refresh and refresh if necessary.
   * Called periodically as a safety net.
   */
  function checkAndRefreshIfNeeded(): void {
    if (!authStore.token || !authStore.tokenExpires) {
      return
    }

    const expiresAt = authStore.tokenExpires.getTime()
    const refreshAt = expiresAt - TOKEN_REFRESH_MARGIN_MS
    const now = Date.now()

    if (now >= refreshAt) {
      refreshToken()
    }
  }

  async function initializeAuth(): Promise<void> {
    authStore.initialize()
    await fetchAuthConfig()

    if (authStore.token) {
      const valid = await verifyToken()
      if (valid) {
        await getCurrentUser()
        // Start auto-refresh for existing session
        scheduleTokenRefresh()
      }
    }
  }

  function logout(): void {
    stopTokenRefresh()
    authStore.logout()
  }

  function getAuthHeader(): Record<string, string> {
    if (authStore.token) {
      return { Authorization: `Bearer ${authStore.token}` }
    }
    return {}
  }

  async function updateProfile(data: {
    email?: string
    shortname?: string
    currentPassword?: string
    newPassword?: string
  }): Promise<{ success: boolean; error?: string }> {
    if (!authStore.token) {
      return { success: false, error: 'Not authenticated' }
    }

    try {
      const requestData: UpdateProfileRequest = {}
      if (data.email !== undefined) requestData.email = data.email
      if (data.shortname !== undefined) requestData.shortname = data.shortname
      if (data.currentPassword) requestData.current_password = data.currentPassword
      if (data.newPassword) requestData.new_password = data.newPassword

      const response = await axios.put<UserResponse>(
        `${getApiBaseUrl()}/users/me`,
        requestData,
        { headers: getAuthHeader() }
      )

      const userInfo: UserInfo = {
        id: response.data.id,
        username: response.data.username,
        shortname: response.data.shortname,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.is_active,
      }
      authStore.setUserInfo(userInfo)

      return { success: true }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { success: false, error: error.response.data.detail || 'Update failed' }
      }
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Set up periodic check as safety net
  let checkInterval: number | null = null

  onMounted(() => {
    // Start periodic check
    checkInterval = window.setInterval(checkAndRefreshIfNeeded, TOKEN_REFRESH_CHECK_INTERVAL_MS)
  })

  onUnmounted(() => {
    // Clean up on unmount
    stopTokenRefresh()
    if (checkInterval !== null) {
      window.clearInterval(checkInterval)
      checkInterval = null
    }
  })

  // Watch for token changes to reschedule refresh
  watch(
    () => authStore.tokenExpires,
    (newExpires) => {
      if (newExpires) {
        scheduleTokenRefresh()
      } else {
        stopTokenRefresh()
      }
    }
  )

  return {
    // Core auth methods
    login,
    logout,
    register,
    verifyToken,
    fetchAuthConfig,
    initializeAuth,
    getCurrentUser,
    getAuthHeader,
    updateProfile,

    // Token refresh
    refreshToken,
    isRefreshing,
  }
}
