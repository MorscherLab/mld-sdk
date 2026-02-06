import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

// Mock vue lifecycle hooks since we're not in a component
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onMounted: vi.fn((cb: () => void) => cb()),
    onUnmounted: vi.fn(),
  }
})

import { useAuth } from '../../composables/useAuth'
import { useAuthStore } from '../../stores/auth'
import { useSettingsStore } from '../../stores/settings'

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()

    // Mock settings store
    const settingsStore = useSettingsStore()
    settingsStore.getApiBaseUrl = vi.fn(() => 'http://localhost:8000')

    // Mock localStorage
    const storage: Record<string, string> = {}
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, val: string) => { storage[key] = val }),
      removeItem: vi.fn((key: string) => { delete storage[key] }),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('login', () => {
    it('should set token on successful login', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { access_token: 'test-token', expires_in: 3600, token_type: 'bearer' },
      })
      mockedAxios.get.mockResolvedValueOnce({
        data: { id: '1', username: 'test', shortname: null, email: null, role: 'user', is_active: true },
      })

      const { login } = useAuth()
      const result = await login('test', 'password')

      expect(result).toBe(true)
      const authStore = useAuthStore()
      expect(authStore.token).toBe('test-token')
    })

    it('should return false on failed login', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: { data: { detail: 'Invalid credentials' }, status: 401 },
      })
      // @ts-expect-error -- vitest mock assignment
      mockedAxios.isAxiosError = vi.fn(() => true)

      const { login } = useAuth()
      const result = await login('test', 'wrong')

      expect(result).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear token on logout', async () => {
      const authStore = useAuthStore()
      authStore.setToken('test-token', 3600)

      const { logout } = useAuth()
      logout()

      expect(authStore.token).toBeNull()
    })
  })

  describe('refreshToken - race condition', () => {
    it('should deduplicate concurrent refresh calls', async () => {
      const authStore = useAuthStore()
      authStore.setToken('old-token', 3600)

      let resolveRefresh: (value: unknown) => void
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve
      })

      mockedAxios.post.mockImplementation(() => refreshPromise as Promise<unknown>)

      const { refreshToken } = useAuth()

      // Fire two concurrent refreshes
      const p1 = refreshToken()
      const p2 = refreshToken()

      // Both should return the same promise
      resolveRefresh!({
        data: { access_token: 'new-token', expires_in: 3600, token_type: 'bearer' },
      })

      const [r1, r2] = await Promise.all([p1, p2])
      expect(r1).toBe(true)
      expect(r2).toBe(true)

      // axios.post should have been called only once
      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('verifyToken', () => {
    it('should return false when no token', async () => {
      const { verifyToken } = useAuth()
      const result = await verifyToken()
      expect(result).toBe(false)
    })

    it('should return true on valid token', async () => {
      const authStore = useAuthStore()
      authStore.setToken('valid-token', 3600)

      mockedAxios.get.mockResolvedValueOnce({
        data: { valid: true, username: 'testuser' },
      })

      const { verifyToken } = useAuth()
      const result = await verifyToken()
      expect(result).toBe(true)
    })
  })
})
