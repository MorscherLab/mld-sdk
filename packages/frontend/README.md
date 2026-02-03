# @morscherlab/mld-sdk (Frontend)

Vue 3 SDK for MLD Platform plugin development. Provides reusable components, composables, stores, and types for building consistent, well-integrated plugins.

> **Full Documentation:** See the [comprehensive docs](../../docs/index.md) for detailed API reference and guides.
> - [API Reference](../../docs/frontend/api-reference.md)
> - [Component Catalog](../../docs/frontend/components.md) - All 32 components with props/events
> - [Composables Reference](../../docs/frontend/composables.md) - All 9 composables with examples
> - [Theming Guide](../../docs/frontend/theming.md) - CSS variables and customization

## Installation

```bash
npm install @estrellaxd/mld-sdk
```

## Requirements

- Vue 3.4+
- Pinia 2.1+
- Tailwind CSS 4.0+ (optional - SDK includes pre-built utility classes)

## Quick Start

### 1. Import Styles

Import the SDK styles in your main entry point:

```typescript
// main.ts
import '@estrellaxd/mld-sdk/styles'
```

The SDK includes all necessary CSS utility classes pre-built, so **Tailwind CSS is optional**. The styles work standalone or alongside Tailwind.

### 2. (Optional) Configure Tailwind

If you're using Tailwind CSS and want to extend the MLD theme:

```typescript
import mldPreset from '@estrellaxd/mld-sdk/tailwind.preset'

export default {
  presets: [mldPreset],
  content: [
    './src/**/*.vue',
    './node_modules/@estrellaxd/mld-sdk/**/*.vue',
  ],
}
```

### 3. Use Components

```vue
<script setup lang="ts">
import { BaseButton, BaseInput, FormField } from '@estrellaxd/mld-sdk'
import { useToast, useAuth } from '@estrellaxd/mld-sdk'
import type { ButtonVariant } from '@estrellaxd/mld-sdk'

const { success } = useToast()
const { login } = useAuth()

async function handleSubmit() {
  const result = await login(username, password)
  if (result) {
    success('Login successful!')
  }
}
</script>

<template>
  <FormField label="Username" required>
    <BaseInput v-model="username" placeholder="Enter username" />
  </FormField>

  <BaseButton variant="primary" @click="handleSubmit">
    Login
  </BaseButton>
</template>
```

## Components

### Base Components
- `BaseButton` - Button with variants (primary, secondary, cta, danger, success, ghost)
- `BaseInput` - Text input with validation states
- `BaseSelect` - Dropdown select with generic typing
- `BaseTabs` - Tab navigation with underline/pills/bordered variants
- `BaseModal` - Modal dialog with Teleport

### Form Components
- `FormField` - Form field wrapper with label, error, and hint

### Feedback Components
- `AlertBox` - Alert messages (success, error, warning, info)
- `ToastNotification` - Toast notification container

### Action Components
- `IconButton` - Icon-only button with accessibility
- `ThemeToggle` - Light/dark mode toggle

### Layout Components
- `CollapsibleCard` - Expandable card sections with optional icon badge and toggle switch
- `AppTopBar` - Application header with slots
- `AppSidebar` - Sidebar navigation

### File & Data Components
- `FileUploader` - Drag-and-drop file upload with file/folder mode support

### Sample Management Components
- `SampleSelector` - Hierarchical sample grouping with auto-group and CSV metadata import
- `GroupingModal` - Modal for CSV-based metadata grouping
- `GroupAssigner` - Drag-and-drop group assignment for comparisons (e.g., Control vs Treatment)

## Composables

### `useApi(options?)`
Generic API client with auth interceptor.

```typescript
const api = useApi()

// GET request
const data = await api.get<User[]>('/users')

// POST with body
const created = await api.post<User>('/users', { name: 'John' })

// File upload
const result = await api.upload<UploadResponse>('/upload', file)

// Build URLs for external use
const downloadUrl = api.buildUrl('/files/123/download')
```

### `useAuth()`
Authentication methods.

```typescript
const { login, logout, initializeAuth, getCurrentUser } = useAuth()

// Initialize on app mount
await initializeAuth()

// Login
const success = await login(username, password)

// Get current user
const user = await getCurrentUser()
```

### `usePasskey()`
WebAuthn/FIDO2 passkey support.

```typescript
const { isSupported, registerPasskey, loginWithPasskey } = usePasskey()

if (isSupported()) {
  await registerPasskey('My Device')
  // or
  await loginWithPasskey()
}
```

### `useTheme()`
Theme switching.

```typescript
const { isDark, toggleTheme, setTheme } = useTheme()

toggleTheme()
setTheme(true) // dark mode
```

### `useToast()`
Toast notification management.

```typescript
const { success, error, warning, info } = useToast()

success('Operation completed!')
error('Something went wrong')
warning('Please review your input')
info('New update available')
```

### `usePlatformContext()`
Detect and interact with MLD Platform when running as a plugin.

```typescript
const { isIntegrated, plugin, user, navigate, notify } = usePlatformContext()

if (isIntegrated.value) {
  // Running under MLD Platform
  console.log('Plugin:', plugin.value?.name)
  notify('Hello from plugin!', 'info')
}
```

## Stores

### `useAuthStore`
Pinia store for authentication state.

```typescript
const authStore = useAuthStore()

// State
authStore.token
authStore.userInfo
authStore.isAuthenticated
authStore.isAdmin

// Actions
authStore.initialize()
authStore.setToken(token, expiresIn)
authStore.logout()
```

### `useSettingsStore`
Pinia store for app settings.

```typescript
const settingsStore = useSettingsStore()

// State
settingsStore.theme // 'light' | 'dark' | 'system'
settingsStore.colorPalette

// Methods
settingsStore.getApiBaseUrl()
settingsStore.getWsBaseUrl()
settingsStore.isDark()
```

## TypeScript Types

All types are exported from `@estrellaxd/mld-sdk`:

```typescript
import type {
  // Components
  ButtonVariant,
  ButtonSize,
  ModalSize,
  AlertType,
  Toast,
  TabItem,
  SelectOption,

  // Sample Management
  SampleGroup,      // { name, color, samples[] }
  GroupItem,        // { name, color, count }
  FileUploaderMode, // 'file' | 'folder'

  // Auth
  AuthConfig,
  UserInfo,
  LoginResponse,

  // Platform
  PluginInfo,
  PlatformContext,
  ThemeMode,
} from '@estrellaxd/mld-sdk'
```

## CSS Utility Classes

The SDK provides ready-to-use CSS classes:

### Buttons
- `.btn-primary` - Blue primary button
- `.btn-secondary` - Outlined/bordered button
- `.btn-cta` - Orange call-to-action button
- `.btn-success` - Green success button
- `.btn-danger` - Red danger button

### Inputs
- `.input-modern` - Styled text input
- `.select-modern` - Styled dropdown select
- `.label-modern` - Uppercase label

### Cards & Containers
- `.card` - Card with border and shadow
- `.card-hover` - Card with hover effect
- `.floating-card` - Floating container pattern

### Alerts
- `.alert-success` - Green success alert
- `.alert-error` - Red error alert
- `.alert-warning` - Yellow warning alert
- `.alert-info` - Blue info alert

### Form Controls
- `.toggle-switch` - Toggle switch
- `.checkbox-modern` - Styled checkbox

## Theming

The SDK uses CSS variables for theming. Override them to customize:

```css
:root {
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F1F5F9;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --border-color: #E5E7EB;
  --color-primary: #3B82F6;
}

html.dark {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --border-color: #334155;
}
```

## License

MIT
