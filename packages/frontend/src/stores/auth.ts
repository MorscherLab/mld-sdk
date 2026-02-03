import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthConfig, UserInfo } from '../types'

const AUTH_TOKEN_KEY = 'mld-auth-token'
const AUTH_EXPIRES_KEY = 'mld-auth-expires'

export const useAuthStore = defineStore('mld-auth', () => {
  // State
  const token = ref<string | null>(null)
  const tokenExpires = ref<Date | null>(null)
  const username = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)
  const authConfig = ref<AuthConfig>({
    authRequired: true,
    passkeyEnabled: false,
    passkeyRegistered: false,
    registrationEnabled: false,
    databaseMode: 'none',
  })
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => {
    if (!authConfig.value.authRequired) {
      return true
    }
    if (!token.value) {
      return false
    }
    if (tokenExpires.value && tokenExpires.value < new Date()) {
      return false
    }
    return true
  })

  const needsAuth = computed(() => {
    return authConfig.value.authRequired && !isAuthenticated.value
  })

  const isAdmin = computed(() => {
    return userInfo.value?.role === 'admin'
  })

  const canRegister = computed(() => {
    return authConfig.value.registrationEnabled
  })

  // Actions
  function initialize() {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const storedExpires = localStorage.getItem(AUTH_EXPIRES_KEY)

    if (storedToken) {
      token.value = storedToken

      if (storedExpires) {
        const expires = new Date(storedExpires)
        if (expires > new Date()) {
          tokenExpires.value = expires
        } else {
          clearToken()
        }
      }
    }

    isInitialized.value = true
  }

  function setToken(accessToken: string, expiresIn: number) {
    token.value = accessToken
    const expires = new Date(Date.now() + expiresIn * 1000)
    tokenExpires.value = expires

    localStorage.setItem(AUTH_TOKEN_KEY, accessToken)
    localStorage.setItem(AUTH_EXPIRES_KEY, expires.toISOString())
  }

  function clearToken() {
    token.value = null
    tokenExpires.value = null
    username.value = null
    userInfo.value = null

    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_EXPIRES_KEY)
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    username.value = info.username
  }

  function setAuthConfig(config: AuthConfig) {
    authConfig.value = config
  }

  function setUsername(name: string) {
    username.value = name
  }

  function setError(message: string | null) {
    error.value = message
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function logout() {
    clearToken()
  }

  return {
    // State
    token,
    tokenExpires,
    username,
    userInfo,
    authConfig,
    isInitialized,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    needsAuth,
    isAdmin,
    canRegister,

    // Actions
    initialize,
    setToken,
    clearToken,
    setAuthConfig,
    setUsername,
    setUserInfo,
    setError,
    setLoading,
    logout,
  }
})
