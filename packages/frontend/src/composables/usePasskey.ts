import axios from 'axios'
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types'
import { useAuthStore } from '../stores/auth'
import { useSettingsStore } from '../stores/settings'
import type { CredentialInfo } from '../types'

interface PasskeyLoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export function usePasskey() {
  const authStore = useAuthStore()
  const settingsStore = useSettingsStore()

  function getApiBaseUrl(): string {
    return settingsStore.getApiBaseUrl()
  }

  function isSupported(): boolean {
    return browserSupportsWebAuthn()
  }

  async function registerPasskey(deviceName?: string): Promise<boolean> {
    if (!isSupported()) {
      authStore.setError('WebAuthn is not supported in this browser')
      return false
    }

    authStore.setLoading(true)
    authStore.setError(null)

    try {
      const optionsResponse = await axios.get<{ options: string }>(
        `${getApiBaseUrl()}/auth/passkey/register/options`,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
          withCredentials: true,
        }
      )

      const options: PublicKeyCredentialCreationOptionsJSON = JSON.parse(
        optionsResponse.data.options
      )

      const credential = await startRegistration(options)

      await axios.post(
        `${getApiBaseUrl()}/auth/passkey/register/verify`,
        {
          credential: JSON.stringify(credential),
          device_name: deviceName,
        },
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
          withCredentials: true,
        }
      )

      authStore.setAuthConfig({
        ...authStore.authConfig,
        passkeyRegistered: true,
      })

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        authStore.setError(error.response.data.detail || 'Passkey registration failed')
      } else if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          authStore.setError('Registration was cancelled or timed out')
        } else if (error.name === 'InvalidStateError') {
          authStore.setError('This authenticator is already registered')
        } else {
          authStore.setError(error.message)
        }
      } else {
        authStore.setError('Passkey registration failed')
      }
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  async function loginWithPasskey(): Promise<boolean> {
    if (!isSupported()) {
      authStore.setError('WebAuthn is not supported in this browser')
      return false
    }

    authStore.setLoading(true)
    authStore.setError(null)

    try {
      const optionsResponse = await axios.get<{ options: string }>(
        `${getApiBaseUrl()}/auth/passkey/login/options`,
        { withCredentials: true }
      )

      const options: PublicKeyCredentialRequestOptionsJSON = JSON.parse(
        optionsResponse.data.options
      )

      const credential = await startAuthentication(options)

      const response = await axios.post<PasskeyLoginResponse>(
        `${getApiBaseUrl()}/auth/passkey/login/verify`,
        { credential: JSON.stringify(credential) },
        { withCredentials: true }
      )

      authStore.setToken(response.data.access_token, response.data.expires_in)

      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          authStore.setError('No passkeys registered. Please login with password first.')
        } else {
          authStore.setError(error.response.data.detail || 'Passkey login failed')
        }
      } else if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          authStore.setError('Authentication was cancelled or timed out')
        } else {
          authStore.setError(error.message)
        }
      } else {
        authStore.setError('Passkey login failed')
      }
      return false
    } finally {
      authStore.setLoading(false)
    }
  }

  async function listCredentials(): Promise<CredentialInfo[]> {
    try {
      const response = await axios.get<{ credentials: CredentialInfo[] }>(
        `${getApiBaseUrl()}/auth/passkey/credentials`,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      )
      return response.data.credentials
    } catch {
      return []
    }
  }

  async function deleteCredential(credentialId: string): Promise<boolean> {
    try {
      await axios.delete(
        `${getApiBaseUrl()}/auth/passkey/credentials/${encodeURIComponent(credentialId)}`,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        }
      )

      const remaining = await listCredentials()
      if (remaining.length === 0) {
        authStore.setAuthConfig({
          ...authStore.authConfig,
          passkeyRegistered: false,
        })
      }

      return true
    } catch {
      return false
    }
  }

  async function deleteAllCredentials(): Promise<boolean> {
    try {
      await axios.delete(`${getApiBaseUrl()}/auth/passkey/credentials`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      })

      authStore.setAuthConfig({
        ...authStore.authConfig,
        passkeyRegistered: false,
      })

      return true
    } catch {
      return false
    }
  }

  return {
    isSupported,
    registerPasskey,
    loginWithPasskey,
    listCredentials,
    deleteCredential,
    deleteAllCredentials,
  }
}
