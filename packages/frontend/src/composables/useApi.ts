import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useSettingsStore } from '../stores/settings'
import { useAuthStore } from '../stores/auth'

let apiClientInstance: AxiosInstance | null = null
let interceptorAttached = false

function getApiClient(): AxiosInstance {
  if (!apiClientInstance) {
    apiClientInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  return apiClientInstance
}

export interface ApiClientOptions {
  baseUrl?: string
  timeout?: number
  withAuth?: boolean
}

export function useApi(options: ApiClientOptions = {}) {
  const settingsStore = useSettingsStore()
  const authStore = useAuthStore()
  const apiClient = getApiClient()

  // Attach interceptor only once
  if (!interceptorAttached) {
    apiClient.interceptors.request.use((config) => {
      // Set base URL from settings or options
      config.baseURL = options.baseUrl ?? settingsStore.getApiBaseUrl()
      config.timeout = options.timeout ?? settingsStore.requestTimeout

      // Add Authorization header if token exists and auth is not explicitly disabled
      if (options.withAuth !== false && authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }

      return config
    })
    interceptorAttached = true
  }

  // Generic request methods
  async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config)
    return response.data
  }

  async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config)
    return response.data
  }

  async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config)
    return response.data
  }

  async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config)
    return response.data
  }

  async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config)
    return response.data
  }

  // File upload helper
  async function upload<T>(url: string, file: File, fieldName = 'file', additionalData?: Record<string, unknown>): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
        }
      })
    }

    const response = await apiClient.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  // Download helper - returns blob URL
  async function download(url: string, filename?: string): Promise<string> {
    const response = await apiClient.get(url, { responseType: 'blob' })
    const blob = new Blob([response.data])
    const blobUrl = URL.createObjectURL(blob)

    // Optionally trigger download
    if (filename) {
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      link.click()
    }

    return blobUrl
  }

  // Build full URL for external use (e.g., <a href="...">)
  function buildUrl(path: string): string {
    const baseUrl = options.baseUrl ?? settingsStore.getApiBaseUrl()
    return `${baseUrl}${path}`
  }

  // WebSocket URL builder
  function buildWsUrl(path: string): string {
    return `${settingsStore.getWsBaseUrl()}${path}`
  }

  return {
    client: apiClient,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    download,
    buildUrl,
    buildWsUrl,
  }
}
