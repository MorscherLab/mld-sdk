// Authentication configuration
export interface AuthConfig {
  authRequired: boolean
  passkeyEnabled: boolean
  passkeyRegistered: boolean
  registrationEnabled: boolean
  databaseMode: string
}

// User information
export interface UserInfo {
  id: string
  username: string
  shortname: string | null
  email: string | null
  role: string
  isActive: boolean
}

// Login response from API
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

// Token verification response
export interface TokenVerifyResponse {
  valid: boolean
  username: string | null
  expires_at: string | null
}

// Registration request
export interface RegisterRequest {
  username: string
  password: string
  email?: string
  shortname?: string
}

// Profile update request
export interface UpdateProfileRequest {
  email?: string
  shortname?: string
  current_password?: string
  new_password?: string
}

// Passkey credential info
export interface CredentialInfo {
  credential_id: string
  device_name: string | null
  created_at: string
}
