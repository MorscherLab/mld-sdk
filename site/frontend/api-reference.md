# Frontend SDK API Reference

Complete API reference for the MLD Frontend SDK.

## Installation

```bash
npm install @morscherlab/mld-sdk
```

## Imports

```typescript
// Components
import { BaseButton, BaseInput, BaseModal } from '@morscherlab/mld-sdk'

// Composables
import { useApi, useAuth, useToast } from '@morscherlab/mld-sdk'

// Stores
import { useAuthStore, useSettingsStore } from '@morscherlab/mld-sdk'

// Types
import type { ButtonVariant, UserInfo, PlatformContext } from '@morscherlab/mld-sdk'

// Styles (import once in main.ts)
import '@morscherlab/mld-sdk/styles'
```

## Components

### Base Components

| Component | Description |
|-----------|-------------|
| `BaseButton` | Button with variants (primary, secondary, cta, danger, success, ghost) |
| `BaseInput` | Text input with validation states |
| `BaseTextarea` | Multi-line text input |
| `BaseSelect` | Dropdown select with generic typing |
| `BaseCheckbox` | Checkbox with label |
| `BaseToggle` | Toggle switch |
| `BaseRadioGroup` | Radio button group |
| `BaseSlider` | Range slider |
| `ColorSlider` | Color-based slider |
| `BaseTabs` | Tab navigation |
| `BaseModal` | Modal dialog with Teleport |

### Form Components

| Component | Description |
|-----------|-------------|
| `FormField` | Form field wrapper with label, error, and hint |
| `DatePicker` | Date selection input |
| `TagsInput` | Multi-tag input |
| `NumberInput` | Numeric input with increment/decrement |
| `FileUploader` | Drag-and-drop file upload |

### Feedback Components

| Component | Description |
|-----------|-------------|
| `AlertBox` | Alert messages (success, error, warning, info) |
| `ToastNotification` | Toast notification container |

### Action Components

| Component | Description |
|-----------|-------------|
| `IconButton` | Icon-only button with accessibility |
| `ThemeToggle` | Light/dark mode toggle |
| `SettingsButton` | Settings panel trigger |

### Layout Components

| Component | Description |
|-----------|-------------|
| `CollapsibleCard` | Expandable card sections |
| `AppTopBar` | Application header |
| `AppSidebar` | Sidebar navigation |
| `Skeleton` | Loading placeholder |

### Biological Experiment Components

| Component | Description |
|-----------|-------------|
| `WellPlate` | Well plate visualization, interaction, and editing |
| `RackEditor` | Multi-rack management with tabbed navigation and well editing |
| `SampleLegend` | Sample type legend |
| `PlateMapEditor` | Plate map editor with sample assignment |
| `ExperimentTimeline` | Protocol step timeline |

### Sample Management Components

| Component | Description |
|-----------|-------------|
| `SampleSelector` | Hierarchical sample grouping |
| `GroupingModal` | CSV-based metadata grouping |
| `GroupAssigner` | Drag-and-drop group assignment |

---

## Composables

### useApi

Generic API client with auth interceptor.

```typescript
import { useApi, type ApiClientOptions } from '@morscherlab/mld-sdk'
```

#### Options

```typescript
interface ApiClientOptions {
  baseUrl?: string     // Override API base URL
  timeout?: number     // Request timeout in ms
  withAuth?: boolean   // Include auth header (default: true)
}
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `client` | `AxiosInstance` | Raw Axios client |
| `get<T>(url, config?)` | `Promise<T>` | GET request |
| `post<T>(url, data?, config?)` | `Promise<T>` | POST request |
| `put<T>(url, data?, config?)` | `Promise<T>` | PUT request |
| `patch<T>(url, data?, config?)` | `Promise<T>` | PATCH request |
| `delete<T>(url, config?)` | `Promise<T>` | DELETE request |
| `upload<T>(url, file, fieldName?, additionalData?)` | `Promise<T>` | File upload |
| `download(url, filename?)` | `Promise<string>` | Download file, returns blob URL |
| `buildUrl(path)` | `string` | Build full API URL |
| `buildWsUrl(path)` | `string` | Build WebSocket URL |

#### Example

```typescript
const api = useApi()

// GET request
const users = await api.get<User[]>('/users')

// POST with body
const created = await api.post<User>('/users', { name: 'John' })

// File upload
const result = await api.upload<UploadResponse>('/upload', file, 'document')

// Download
const blobUrl = await api.download('/files/123/export', 'data.csv')
```

---

### useAuth

Authentication composable with automatic token refresh.

```typescript
import { useAuth } from '@morscherlab/mld-sdk'
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `login(username, password)` | `Promise<boolean>` | Login with credentials |
| `logout()` | `void` | Clear auth state |
| `register(username, password, email?)` | `Promise<boolean>` | Register new user |
| `verifyToken()` | `Promise<boolean>` | Verify current token |
| `fetchAuthConfig()` | `Promise<AuthConfig>` | Fetch platform auth config |
| `initializeAuth()` | `Promise<void>` | Initialize auth on app mount |
| `getCurrentUser()` | `Promise<UserInfo \| null>` | Get current user info |
| `getAuthHeader()` | `Record<string, string>` | Get auth header object |
| `updateProfile(data)` | `Promise<{ success, error? }>` | Update user profile |
| `refreshToken()` | `Promise<boolean>` | Manually refresh token |
| `isRefreshing` | `Ref<boolean>` | Token refresh in progress |

#### Example

```typescript
const auth = useAuth()

// Initialize on app mount
await auth.initializeAuth()

// Login
const success = await auth.login('username', 'password')
if (success) {
  const user = await auth.getCurrentUser()
}

// Logout
auth.logout()
```

---

### usePasskey

WebAuthn/FIDO2 passkey authentication.

```typescript
import { usePasskey } from '@morscherlab/mld-sdk'
```

#### Returns

| Method | Type | Description |
|--------|------|-------------|
| `isSupported()` | `boolean` | Check browser WebAuthn support |
| `registerPasskey(deviceName?)` | `Promise<boolean>` | Register new passkey |
| `loginWithPasskey()` | `Promise<boolean>` | Login with passkey |
| `listCredentials()` | `Promise<CredentialInfo[]>` | List registered passkeys |
| `deleteCredential(credentialId)` | `Promise<boolean>` | Delete specific passkey |
| `deleteAllCredentials()` | `Promise<boolean>` | Delete all passkeys |

#### Example

```typescript
const passkey = usePasskey()

if (passkey.isSupported()) {
  // Register a new passkey
  await passkey.registerPasskey('MacBook Pro')

  // Or login with existing passkey
  const success = await passkey.loginWithPasskey()
}
```

---

### useTheme

Theme switching composable.

```typescript
import { useTheme } from '@morscherlab/mld-sdk'
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isDark` | `Ref<boolean>` | Current dark mode state |
| `toggleTheme()` | `void` | Toggle between light/dark |
| `setTheme(theme)` | `void` | Set specific theme ('light' \| 'dark') |

#### Example

```typescript
const { isDark, toggleTheme, setTheme } = useTheme()

// Toggle
toggleTheme()

// Set specific
setTheme('dark')

// Reactive access
console.log(isDark.value) // true or false
```

---

### useToast

Toast notification management.

```typescript
import { useToast } from '@morscherlab/mld-sdk'
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `toasts` | `Ref<Toast[]>` | Active toasts |
| `show(message, type?, duration?)` | `void` | Show generic toast |
| `success(message, duration?)` | `void` | Success toast (3500ms default) |
| `error(message, duration?)` | `void` | Error toast (5000ms default) |
| `warning(message, duration?)` | `void` | Warning toast (4000ms default) |
| `info(message, duration?)` | `void` | Info toast (3500ms default) |
| `dismiss(id)` | `void` | Dismiss specific toast |
| `clear()` | `void` | Clear all toasts |

#### Example

```typescript
const toast = useToast()

toast.success('Operation completed!')
toast.error('Something went wrong')
toast.warning('Please review your input')
toast.info('New update available')
```

---

### usePlatformContext

Platform integration for plugins running under MLD Platform.

```typescript
import { usePlatformContext } from '@morscherlab/mld-sdk'
```

#### Options

```typescript
interface PlatformContextOptions {
  allowedOrigins?: string[]    // Allowed postMessage origins
  allowAnyOrigin?: boolean     // Allow any origin (dev only)
}
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `context` | `Ref<PlatformContext>` | Full context object |
| `isIntegrated` | `ComputedRef<boolean>` | Running under platform |
| `plugin` | `ComputedRef<PluginInfo \| undefined>` | Plugin info |
| `user` | `ComputedRef<{ id, username, role } \| undefined>` | Current user |
| `theme` | `ComputedRef<'light' \| 'dark' \| 'system'>` | Theme preference |
| `features` | `ComputedRef<object \| undefined>` | Platform features |
| `navigate(path)` | `void` | Navigate in platform |
| `notify(message, type?)` | `void` | Show platform notification |
| `sendToPlatform(event)` | `void` | Send custom event |

#### Example

```typescript
const { isIntegrated, plugin, user, navigate, notify } = usePlatformContext()

if (isIntegrated.value) {
  console.log('Plugin:', plugin.value?.name)
  console.log('User:', user.value?.username)

  // Navigate in platform
  navigate('/experiments')

  // Show notification
  notify('Analysis complete!', 'success')
}
```

---

### useForm

Form state management with validation.

```typescript
import { useForm, type FieldRules } from '@morscherlab/mld-sdk'
```

#### Parameters

```typescript
useForm<T>(
  initialValues: T,
  rules?: Partial<Record<keyof T, FieldRules>>
)
```

#### Field Rules

```typescript
interface FieldRules<T = unknown> {
  required?: boolean | string
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  pattern?: RegExp | { value: RegExp; message: string }
  email?: boolean | string
  custom?: ValidationRule<T> | ValidationRule<T>[]
}
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `data` | `T` | Reactive form data |
| `errors` | `Record<string, string \| null>` | Field errors |
| `touched` | `Record<string, boolean>` | Touched state |
| `dirty` | `Record<string, boolean>` | Dirty state |
| `isValid` | `Ref<boolean>` | Form validity |
| `isDirty` | `Ref<boolean>` | Any field changed |
| `isSubmitting` | `Ref<boolean>` | Submission in progress |
| `setFieldValue(field, value)` | `void` | Set field value |
| `setFieldError(field, error)` | `void` | Set field error |
| `setFieldTouched(field, touched?)` | `void` | Mark field touched |
| `validateField(field)` | `boolean` | Validate single field |
| `validate()` | `boolean` | Validate all fields |
| `reset(values?)` | `void` | Reset form |
| `handleSubmit(onSubmit)` | `(e?) => Promise<void>` | Submit handler |
| `getFieldProps(field)` | `object` | Props for v-bind |

#### Example

```typescript
const { data, errors, isValid, handleSubmit, getFieldProps } = useForm(
  { email: '', password: '' },
  {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
  }
)

const onSubmit = async (formData) => {
  await api.post('/login', formData)
}
```

```vue
<template>
  <form @submit.prevent="handleSubmit(onSubmit)">
    <BaseInput v-bind="getFieldProps('email')" label="Email" />
    <BaseInput v-bind="getFieldProps('password')" type="password" label="Password" />
    <BaseButton :disabled="!isValid">Submit</BaseButton>
  </form>
</template>
```

---

### useAsync

Async operation state management.

```typescript
import { useAsync, type UseAsyncOptions } from '@morscherlab/mld-sdk'
```

#### Options

```typescript
interface UseAsyncOptions<T> {
  initialData?: T | null
  immediate?: boolean
  immediateArgs?: unknown[]
  transformError?: (error: unknown) => AsyncError
  onSuccess?: (data: T) => void
  onError?: (error: AsyncError) => void
  resetOnExecute?: boolean
}
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `data` | `Ref<T \| null>` | Result data |
| `error` | `Ref<AsyncError \| null>` | Error if any |
| `state` | `Ref<AsyncState>` | 'idle' \| 'loading' \| 'success' \| 'error' |
| `isIdle` | `ComputedRef<boolean>` | State is idle |
| `isLoading` | `ComputedRef<boolean>` | State is loading |
| `isSuccess` | `ComputedRef<boolean>` | State is success |
| `isError` | `ComputedRef<boolean>` | State is error |
| `execute(...args)` | `Promise<T \| null>` | Execute async function |
| `reset()` | `void` | Reset to initial state |
| `setData(data)` | `void` | Manually set data |
| `setError(error)` | `void` | Manually set error |

#### Example

```typescript
const { data, isLoading, error, execute } = useAsync(
  async (id: string) => {
    const response = await api.get(`/users/${id}`)
    return response
  },
  {
    onSuccess: (user) => toast.success(`Loaded ${user.name}`),
    onError: (err) => toast.error(err.message),
  }
)

// Execute
await execute('user-123')
```

---

### useRackEditor

Multi-rack state management for LCMS sequence workflows.

```typescript
import { useRackEditor, type UseRackEditorOptions } from '@morscherlab/mld-sdk'
```

#### Options

```typescript
interface UseRackEditorOptions {
  defaultFormat?: WellPlateFormat    // default: 54
  defaultInjectionVolume?: number    // default: 5
  maxRacks?: number                  // default: 10
  minRacks?: number                  // default: 1
}
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `racks` | `Ref<Rack[]>` | All racks |
| `activeRack` | `ComputedRef<Rack \| undefined>` | Currently active rack |
| `activeRackId` | `Ref<string>` | Active rack ID |
| `addRack(name?)` | `Rack` | Add new rack (slot auto-cycles R/G/B/Y) |
| `removeRack(rackId)` | `void` | Remove rack |
| `reorderRacks(from, to)` | `void` | Reorder racks by index |
| `updateRack(rackId, data)` | `void` | Update rack properties |
| `setActiveRack(rackId)` | `void` | Set active rack |
| `setWellData(rackId, wellId, data)` | `void` | Set well data |
| `clearWell(rackId, wellId)` | `void` | Clear single well |
| `clearAllWells(rackId)` | `void` | Clear all wells in rack |
| `fillSeries(rackId, prefix?)` | `void` | Auto-fill empty wells (S001, S002...) |
| `getAllWells()` | `Array<{rackId, wellId, well}>` | Get all wells across racks |
| `totalSampleCount` | `ComputedRef<number>` | Total filled wells |
| `reset()` | `void` | Reset to single empty rack |

#### Example

```typescript
const editor = useRackEditor(undefined, { defaultFormat: 54 })

const rack = editor.addRack('My Rack')
editor.fillSeries(rack.id, 'S')
console.log(editor.totalSampleCount.value)
```

---

### useWellPlateEditor

Well plate editor state management.

```typescript
import { useWellPlateEditor, type UseWellPlateEditorOptions } from '@morscherlab/mld-sdk'
```

#### Options

```typescript
interface UseWellPlateEditorOptions {
  maxHistory?: number          // Undo/redo history limit (default: 50)
  defaultFormat?: WellPlateFormat  // Default plate format (default: 96)
}
```

#### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `state` | `ComputedRef<PlateMapEditorState>` | Full editor state |
| `plates` | `ComputedRef<PlateMap[]>` | All plates |
| `activePlate` | `ComputedRef<PlateMap \| undefined>` | Current plate |
| `samples` | `ComputedRef<SampleType[]>` | Sample types |
| `selectedWells` | `ComputedRef<string[]>` | Selected well IDs |
| `activeSampleId` | `ComputedRef<string \| undefined>` | Active sample |
| `canUndo` | `ComputedRef<boolean>` | Undo available |
| `canRedo` | `ComputedRef<boolean>` | Redo available |
| `setActivePlate(plateId)` | `void` | Set active plate |
| `setActiveSample(sampleId)` | `void` | Set active sample |
| `setSelectedWells(wellIds)` | `void` | Set selection |
| `addPlate(name?, format?)` | `PlateMap` | Add new plate |
| `removePlate(plateId)` | `void` | Remove plate |
| `addSample(name, color?)` | `SampleType` | Add sample type |
| `removeSample(sampleId)` | `void` | Remove sample |
| `assignSample(wellIds, sampleId)` | `void` | Assign sample to wells |
| `clearWells(wellIds)` | `void` | Clear well assignments |
| `undo()` | `void` | Undo last action |
| `redo()` | `void` | Redo undone action |
| `exportData(format)` | `string` | Export as JSON or CSV |
| `importData(data, format)` | `boolean` | Import from JSON or CSV |
| `reset()` | `void` | Reset editor |

---

## Stores

### useAuthStore

Pinia store for authentication state.

```typescript
import { useAuthStore } from '@morscherlab/mld-sdk'
```

#### State

| Property | Type | Description |
|----------|------|-------------|
| `token` | `string \| null` | JWT token |
| `tokenExpires` | `Date \| null` | Token expiration |
| `username` | `string \| null` | Current username |
| `userInfo` | `UserInfo \| null` | Full user info |
| `authConfig` | `AuthConfig` | Platform auth config |
| `isInitialized` | `boolean` | Store initialized |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |

#### Computed

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | `boolean` | User is authenticated |
| `needsAuth` | `boolean` | Auth required but not authenticated |
| `isAdmin` | `boolean` | User has admin role |
| `canRegister` | `boolean` | Registration enabled |

#### Actions

| Method | Description |
|--------|-------------|
| `initialize()` | Load from localStorage |
| `setToken(token, expiresIn)` | Set auth token |
| `clearToken()` | Clear token and user |
| `setAuthConfig(config)` | Set auth configuration |
| `setUsername(username)` | Set username |
| `setUserInfo(info)` | Set full user info |
| `setError(message)` | Set error message |
| `setLoading(loading)` | Set loading state |
| `logout()` | Clear all auth state |

---

### useSettingsStore

Pinia store for app settings.

```typescript
import { useSettingsStore, colorPalettes, type SettingsState } from '@morscherlab/mld-sdk'
```

#### State

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `serverHost` | `string` | Auto-detect | API server host |
| `serverPort` | `number` | Auto-detect | API server port |
| `requestTimeout` | `number` | `120000` | Request timeout (ms) |
| `wsAutoReconnect` | `boolean` | `true` | Auto-reconnect WebSocket |
| `wsReconnectInterval` | `number` | `5000` | Reconnect interval (ms) |
| `theme` | `ThemeMode` | `'system'` | 'light' \| 'dark' \| 'system' |
| `colorPalette` | `ColorPalette` | `'default'` | Color palette name |
| `tableDensity` | `TableDensity` | `'normal'` | 'compact' \| 'normal' \| 'comfortable' |

#### Actions

| Method | Returns | Description |
|--------|---------|-------------|
| `initialize()` | `void` | Load settings from localStorage |
| `applyTheme()` | `void` | Apply current theme to DOM |
| `persistSettings()` | `void` | Save to localStorage |
| `resetToDefaults()` | `void` | Reset all settings |
| `getPaletteHues()` | `[number, number]` | Get color palette hue range |
| `isDark()` | `boolean` | Check if currently dark mode |
| `getApiBaseUrl()` | `string` | Get API base URL |
| `getWsBaseUrl()` | `string` | Get WebSocket base URL |

#### Color Palettes

```typescript
import { colorPalettes } from '@morscherlab/mld-sdk'

// Available palettes:
// - 'default': Cyan-Pink
// - 'colorblind': Colorblind-friendly
// - 'viridis': Viridis
// - 'pastel': Pastel
```

---

## Types

### Component Types

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'cta' | 'danger' | 'success' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'
type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type AlertType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: string | number
}

interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
}

interface RadioOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

interface SidebarItem {
  id: string
  label: string
  icon?: string
  to?: string
  href?: string
  children?: SidebarItem[]
  badge?: string | number
  disabled?: boolean
}
```

### Well Plate Types

```typescript
type WellPlateFormat = 6 | 12 | 24 | 48 | 54 | 96 | 384
type WellState = 'empty' | 'filled' | 'selected' | 'disabled'
type WellPlateSelectionMode = 'none' | 'single' | 'multiple' | 'rectangle' | 'drag'
type WellPlateSize = 'sm' | 'md' | 'lg' | 'xl' | 'fill'
type WellShape = 'circle' | 'rounded'

interface Well {
  id: string
  row: number
  col: number
  state: WellState
  sampleType?: string
  value?: number
  metadata?: Record<string, unknown>
}

interface HeatmapConfig {
  enabled: boolean
  min?: number
  max?: number
  colorScale?: 'viridis' | 'plasma' | 'turbo' | 'custom'
  customColors?: string[]
  showLegend?: boolean
}

// Rack and well editing types
type SlotPosition = 'R' | 'G' | 'B' | 'Y'
type WellEditField = 'label' | 'sampleType' | 'injectionVolume' | 'injectionCount' | 'customMethod'

interface WellEditData {
  wellId: string
  label: string
  sampleType: string
  injectionVolume: number
  injectionCount: number
  customMethod: string
}

interface WellLegendItem {
  type: string
  label: string
  color: string
}

interface Rack {
  id: string
  name: string
  format: WellPlateFormat
  slot: SlotPosition
  injectionVolume: number
  wells: Record<string, Partial<Well>>
}

interface SampleType {
  id: string
  name: string
  color?: string
  count?: number
  description?: string
}

interface PlateMap {
  id: string
  name: string
  format: WellPlateFormat
  wells: Record<string, Well>
}
```

### Auth Types

```typescript
interface AuthConfig {
  authRequired: boolean
  passkeyEnabled: boolean
  passkeyRegistered: boolean
  registrationEnabled: boolean
  databaseMode: string
}

interface UserInfo {
  id: string
  username: string
  shortname: string | null
  email: string | null
  role: string
  isActive: boolean
}

interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface CredentialInfo {
  credential_id: string
  device_name: string | null
  created_at: string
}
```

### Platform Types

```typescript
interface PluginInfo {
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

interface PlatformContext {
  isIntegrated: boolean
  plugin?: PluginInfo
  platformApiUrl?: string
  platformOrigin?: string
  user?: { id: string; username: string; role: string }
  theme: 'light' | 'dark' | 'system'
  features?: { experiments?: boolean; passkey?: boolean; multiUser?: boolean }
}

type ThemeMode = 'light' | 'dark' | 'system'
type ColorPalette = 'default' | 'colorblind' | 'viridis' | 'pastel'
type TableDensity = 'compact' | 'normal' | 'comfortable'
```
