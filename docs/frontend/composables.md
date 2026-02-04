# Composables Reference

Detailed documentation for all MLD SDK composables.

## useApi

Generic API client with automatic auth token injection.

```typescript
import { useApi, type ApiClientOptions } from '@morscherlab/mld-sdk'
```

### Configuration

```typescript
interface ApiClientOptions {
  baseUrl?: string     // Override API base URL
  timeout?: number     // Request timeout in milliseconds
  withAuth?: boolean   // Include auth header (default: true)
}
```

### Basic Usage

```typescript
const api = useApi()

// Simple GET
const users = await api.get<User[]>('/users')

// GET with query params
const filtered = await api.get<User[]>('/users', {
  params: { role: 'admin', active: true }
})

// POST with body
const created = await api.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com'
})

// PUT update
await api.put<User>(`/users/${id}`, { name: 'Jane Doe' })

// PATCH partial update
await api.patch<User>(`/users/${id}`, { role: 'admin' })

// DELETE
await api.delete(`/users/${id}`)
```

### File Operations

```typescript
// Upload file
const result = await api.upload<UploadResponse>(
  '/upload',
  file,
  'document',  // field name
  { category: 'reports' }  // additional form data
)

// Download file
const blobUrl = await api.download('/files/123/export')

// Download and trigger browser download
await api.download('/files/123/export', 'report.csv')
```

### URL Building

```typescript
// Build full API URL for external use (e.g., <a href>)
const downloadUrl = api.buildUrl('/files/123/download')
// Result: "http://localhost:8000/api/files/123/download"

// Build WebSocket URL
const wsUrl = api.buildWsUrl('/ws/notifications')
// Result: "ws://localhost:8000/api/ws/notifications"
```

### Without Auth

```typescript
// Create client without auth header
const publicApi = useApi({ withAuth: false })
const config = await publicApi.get('/setup/config/public')
```

---

## useAuth

Complete authentication management with automatic token refresh.

```typescript
import { useAuth } from '@morscherlab/mld-sdk'
```

### Initialization

Always call `initializeAuth()` when your app mounts:

```typescript
const auth = useAuth()

onMounted(async () => {
  await auth.initializeAuth()
})
```

This will:
1. Load tokens from localStorage
2. Fetch platform auth configuration
3. Verify existing tokens
4. Start automatic token refresh

### Login Flow

```typescript
const auth = useAuth()

async function handleLogin(username: string, password: string) {
  const success = await auth.login(username, password)

  if (success) {
    const user = await auth.getCurrentUser()
    console.log('Welcome,', user?.username)
    router.push('/dashboard')
  }
  // Error is available in authStore.error
}
```

### Registration

```typescript
async function handleRegister(username: string, password: string, email?: string) {
  const success = await auth.register(username, password, email)
  // On success, user is automatically logged in
}
```

### Profile Management

```typescript
// Update profile
const result = await auth.updateProfile({
  email: 'new@example.com',
  shortname: 'JD',
})

if (!result.success) {
  console.error(result.error)
}

// Change password
const passwordResult = await auth.updateProfile({
  currentPassword: 'oldpass',
  newPassword: 'newpass',
})
```

### Logout

```typescript
function handleLogout() {
  auth.logout()
  router.push('/login')
}
```

### Token Refresh

Token refresh happens automatically 5 minutes before expiration. You can also refresh manually:

```typescript
const refreshed = await auth.refreshToken()
```

### Auth State

Access auth state through the auth store:

```typescript
import { useAuthStore } from '@morscherlab/mld-sdk'

const authStore = useAuthStore()

// Reactive state
authStore.isAuthenticated  // boolean
authStore.userInfo         // UserInfo | null
authStore.isAdmin          // boolean
authStore.needsAuth        // authRequired && !isAuthenticated
```

---

## usePasskey

WebAuthn/FIDO2 passkey authentication for passwordless login.

```typescript
import { usePasskey } from '@morscherlab/mld-sdk'
```

### Check Support

```typescript
const passkey = usePasskey()

if (!passkey.isSupported()) {
  console.log('WebAuthn not supported in this browser')
}
```

### Register Passkey

User must be logged in to register a passkey:

```typescript
async function registerPasskey() {
  const success = await passkey.registerPasskey('MacBook Pro')

  if (success) {
    toast.success('Passkey registered!')
  }
  // Error available in authStore.error
}
```

### Login with Passkey

```typescript
async function loginWithPasskey() {
  const success = await passkey.loginWithPasskey()

  if (success) {
    router.push('/dashboard')
  }
}
```

### Manage Credentials

```typescript
// List all passkeys
const credentials = await passkey.listCredentials()
// [{ credential_id, device_name, created_at }, ...]

// Delete specific passkey
await passkey.deleteCredential(credential.credential_id)

// Delete all passkeys
await passkey.deleteAllCredentials()
```

---

## useTheme

Theme management with system preference detection.

```typescript
import { useTheme } from '@morscherlab/mld-sdk'
```

### Basic Usage

```typescript
const { isDark, toggleTheme, setTheme } = useTheme()

// Toggle between light and dark
toggleTheme()

// Set specific theme
setTheme('dark')
setTheme('light')

// Reactive access
console.log(isDark.value)  // true or false
```

### In Templates

```vue
<template>
  <button @click="toggleTheme">
    {{ isDark ? 'Switch to Light' : 'Switch to Dark' }}
  </button>
</template>
```

### System Preference

The composable automatically detects system preference on mount if no preference is saved.

```typescript
// On mount, checks in order:
// 1. localStorage 'mld-theme'
// 2. System preference via matchMedia
```

---

## useToast

Toast notification system.

```typescript
import { useToast } from '@morscherlab/mld-sdk'
```

### Show Toasts

```typescript
const toast = useToast()

// Success (3500ms default)
toast.success('Operation completed!')

// Error (5000ms default - longer for errors)
toast.error('Something went wrong')

// Warning (4000ms default)
toast.warning('Please review your input')

// Info (3500ms default)
toast.info('New update available')

// Custom duration
toast.success('Quick message', 2000)
toast.error('Important error', 10000)
```

### Generic Show

```typescript
toast.show('Custom message', 'success', 5000)
toast.show('Another message', 'warning')
```

### Manage Toasts

```typescript
// Dismiss specific toast
toast.dismiss(toastId)

// Clear all toasts
toast.clear()

// Access active toasts
console.log(toast.toasts.value)
```

### Setup

Add `ToastNotification` component once in your app:

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <router-view />
    <ToastNotification />
  </div>
</template>
```

---

## usePlatformContext

Integration with MLD Platform when running as a plugin.

```typescript
import { usePlatformContext } from '@morscherlab/mld-sdk'
```

### Configuration

```typescript
interface PlatformContextOptions {
  allowedOrigins?: string[]    // Allowed postMessage origins
  allowAnyOrigin?: boolean     // Allow any origin (dev only!)
}
```

### Basic Usage

```typescript
const {
  isIntegrated,
  plugin,
  user,
  theme,
  features,
  navigate,
  notify,
} = usePlatformContext()

// Check if running under platform
if (isIntegrated.value) {
  console.log('Plugin name:', plugin.value?.name)
  console.log('Current user:', user.value?.username)
}
```

### Navigation

Request navigation in the parent platform:

```typescript
// Navigate to platform route
navigate('/experiments')
navigate('/experiments/123')
```

### Notifications

Show notifications in the platform:

```typescript
notify('Analysis complete!', 'success')
notify('Error occurred', 'error')
notify('Please review', 'warning')
notify('New data available', 'info')
```

### Custom Events

Send custom events to the platform:

```typescript
import { usePlatformContext } from '@morscherlab/mld-sdk'

const { sendToPlatform } = usePlatformContext()

sendToPlatform({
  type: 'mld:custom-event',
  payload: { data: 'value' }
})
```

### Security

For production, specify allowed origins:

```typescript
const context = usePlatformContext({
  allowedOrigins: ['https://mld.example.com']
})

// Development only - allows any origin
const devContext = usePlatformContext({
  allowAnyOrigin: import.meta.env.DEV
})
```

---

## useForm

Form state management with built-in validation.

```typescript
import { useForm, type FieldRules } from '@morscherlab/mld-sdk'
```

### Basic Form

```typescript
const { data, errors, isValid, handleSubmit } = useForm(
  // Initial values
  { email: '', password: '' },
  // Validation rules
  {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
  }
)

async function onSubmit(formData: typeof data) {
  await api.post('/login', formData)
}
```

### Validation Rules

```typescript
interface FieldRules<T = unknown> {
  // Required field
  required?: boolean | string  // true or custom message

  // String length
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }

  // Number range
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }

  // Pattern matching
  pattern?: RegExp | { value: RegExp; message: string }

  // Email validation
  email?: boolean | string

  // Custom validators
  custom?: ValidationRule<T> | ValidationRule<T>[]
}

// Custom validator type
type ValidationRule<T> = (value: T, formData: Record<string, unknown>) => string | undefined | null
```

### Custom Validators

```typescript
const { data, errors } = useForm(
  { password: '', confirmPassword: '' },
  {
    password: { required: true, minLength: 8 },
    confirmPassword: {
      required: true,
      custom: (value, formData) => {
        if (value !== formData.password) {
          return 'Passwords do not match'
        }
      }
    }
  }
)
```

### Field Props Helper

Use `getFieldProps()` for easy v-bind:

```vue
<template>
  <BaseInput v-bind="getFieldProps('email')" label="Email" />
  <BaseInput v-bind="getFieldProps('password')" type="password" label="Password" />
</template>
```

This provides:
- `modelValue` - current value
- `onUpdate:modelValue` - value setter
- `onBlur` - marks field as touched
- `error` - error message (only if touched)

### Form State

```typescript
const {
  data,          // Reactive form data
  errors,        // Field errors (string | null for each field)
  touched,       // Fields that have been blurred
  dirty,         // Fields that changed from initial
  isValid,       // All fields valid
  isDirty,       // Any field changed
  isSubmitting,  // Submission in progress
} = useForm(...)
```

### Manual Control

```typescript
const form = useForm(...)

// Set value programmatically
form.setFieldValue('email', 'new@example.com')

// Set error manually
form.setFieldError('email', 'Email already exists')

// Mark as touched
form.setFieldTouched('email')

// Validate single field
const isEmailValid = form.validateField('email')

// Validate all
const isFormValid = form.validate()

// Reset form
form.reset()
form.reset({ email: 'prefilled@example.com' })
```

---

## useAsync

Async operation state management.

```typescript
import { useAsync, type UseAsyncOptions } from '@morscherlab/mld-sdk'
```

### Basic Usage

```typescript
const { data, isLoading, error, execute } = useAsync(
  async (userId: string) => {
    const response = await api.get<User>(`/users/${userId}`)
    return response
  }
)

// Execute
await execute('user-123')

// Access result
console.log(data.value)  // User object or null
```

### With Options

```typescript
const { data, execute } = useAsync(
  fetchUser,
  {
    // Initial data
    initialData: null,

    // Execute immediately
    immediate: true,
    immediateArgs: ['default-user-id'],

    // Callbacks
    onSuccess: (user) => {
      toast.success(`Loaded ${user.name}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },

    // Reset data when executing again
    resetOnExecute: true,
  }
)
```

### State Access

```typescript
const { state, isIdle, isLoading, isSuccess, isError } = useAsync(...)

// state.value is 'idle' | 'loading' | 'success' | 'error'

// Computed booleans
if (isLoading.value) {
  // Show spinner
}

if (isError.value) {
  // Show error message
}
```

### Manual State Control

```typescript
const { setData, setError, reset } = useAsync(...)

// Set data manually
setData(someData)

// Set error manually
setError({ message: 'Custom error' })

// Reset to initial state
reset()
```

### Batch Operations

Execute multiple async operations in parallel:

```typescript
import { useAsyncBatch } from '@morscherlab/mld-sdk'

const { results, errors, isLoading, execute } = useAsyncBatch([
  () => fetchUser(userId),
  () => fetchPosts(userId),
  () => fetchComments(userId),
])

await execute()

// results.value = [user, posts, comments]
// errors.value = [null, null, null] or error objects
```

---

## useWellPlateEditor

Complete well plate editor state management with undo/redo.

```typescript
import { useWellPlateEditor, type UseWellPlateEditorOptions } from '@morscherlab/mld-sdk'
```

### Initialization

```typescript
const editor = useWellPlateEditor(
  // Optional initial state
  {
    plates: [...],
    samples: [...],
  },
  // Options
  {
    maxHistory: 50,      // Undo/redo history limit
    defaultFormat: 96,   // Default plate format
  }
)
```

### Working with Plates

```typescript
const { plates, activePlate, addPlate, removePlate, setActivePlate } = editor

// Add new plate
const newPlate = addPlate('My Plate', 96)

// Switch active plate
setActivePlate(newPlate.id)

// Remove plate
removePlate(plateId)

// Access plates
console.log(plates.value)       // All plates
console.log(activePlate.value)  // Current plate
```

### Working with Samples

```typescript
const { samples, addSample, removeSample, setActiveSample, activeSampleId } = editor

// Add sample type
const sample = addSample('Control', '#3B82F6')

// Set active for assignment
setActiveSample(sample.id)

// Remove sample (clears from all wells)
removeSample(sample.id)
```

### Well Selection & Assignment

```typescript
const { selectedWells, setSelectedWells, assignSample, clearWells } = editor

// Set selection
setSelectedWells(['A1', 'A2', 'A3'])

// Assign active sample to selected wells
assignSample(selectedWells.value, activeSampleId.value)

// Clear wells
clearWells(['A1', 'A2'])
```

### Undo/Redo

```typescript
const { canUndo, canRedo, undo, redo } = editor

if (canUndo.value) {
  undo()
}

if (canRedo.value) {
  redo()
}
```

### Import/Export

```typescript
const { exportData, importData } = editor

// Export as JSON
const jsonData = exportData('json')

// Export as CSV
const csvData = exportData('csv')

// Import from JSON
const success = importData(jsonData, 'json')

// Import from CSV
const success = importData(csvData, 'csv')
```

### Reset

```typescript
const { reset } = editor

// Reset to empty state
reset()
```

### Full State Access

```typescript
const { state } = editor

// state.value contains:
// {
//   plates: PlateMap[],
//   activePlateId: string,
//   samples: SampleType[],
//   selectedWells: string[],
//   activeSampleId?: string,
// }
```

---

## useConcentrationUnits

Concentration unit handling with conversion between molarity, mass/volume, and percentage units.

```typescript
import { useConcentrationUnits, type ConcentrationValue } from '@morscherlab/mld-sdk'
```

### Basic Usage

```typescript
const {
  unitCategories,
  molarityUnits,
  massVolumeUnits,
  percentageUnits,
  convert,
  formatWithUnit,
  parseConcentration,
} = useConcentrationUnits()

// Convert between units in same category
const result = convert(100, 'µM', 'mM')  // 0.1

// Convert with molecular weight (cross-category)
const massConc = convert(100, 'µM', 'µg/mL', 180.16)  // 18.016

// Format with unit
formatWithUnit({ value: 0.5, unit: 'mM' })  // "0.5 mM"

// Parse string input
parseConcentration('10 µM')  // { value: 10, unit: 'µM' }
```

### Available Units

| Category | Units |
|----------|-------|
| Molarity | `pM`, `nM`, `µM`, `mM`, `M` |
| Mass/Volume | `pg/mL`, `ng/mL`, `µg/mL`, `mg/mL`, `g/mL` |
| Percentage | `% v/v`, `% w/v`, `% w/w` |

### Utility Functions

```typescript
const { isMolarity, isMassVolume, isPercentage, getBaseUnit, getConversionHint } = useConcentrationUnits()

// Check unit category
isMolarity('µM')      // true
isMassVolume('mg/mL') // true
isPercentage('% v/v') // true

// Get base unit for category
getBaseUnit('µM')     // 'M'
getBaseUnit('µg/mL')  // 'g/mL'

// Get conversion hint (suggests next unit scale)
getConversionHint({ value: 1500, unit: 'µM' })  // "1.5 mM"
```

---

## useDoseCalculator

Dilution and serial dilution calculations with volume handling.

```typescript
import { useDoseCalculator, type DilutionParams, type SerialDilutionParams } from '@morscherlab/mld-sdk'
```

### Dilution Calculation

Calculate stock and diluent volumes using C1V1 = C2V2:

```typescript
const { calculateDilution, formatVolume } = useDoseCalculator()

const result = calculateDilution({
  stockConcentration: { value: 10, unit: 'mM' },
  finalConcentration: { value: 100, unit: 'µM' },
  finalVolume: { value: 1, unit: 'mL' },
})

if (result.valid) {
  console.log('Stock:', formatVolume(result.stockVolume))    // "10 µL"
  console.log('Diluent:', formatVolume(result.diluentVolume)) // "990 µL"
  console.log('Factor:', result.dilutionFactor)               // 100
}
```

### Serial Dilution

Generate a dilution series:

```typescript
const { calculateSerialDilution } = useDoseCalculator()

const result = calculateSerialDilution({
  startingConcentration: { value: 100, unit: 'µM' },
  dilutionFactor: 3,
  numberOfDilutions: 8,
  volumePerWell: { value: 100, unit: 'µL' },
})

if (result.valid) {
  result.steps.forEach(step => {
    console.log(`Step ${step.stepNumber}: ${step.concentration.value} ${step.concentration.unit}`)
  })
  // Step 1: 100 µM
  // Step 2: 33.33 µM
  // Step 3: 11.11 µM
  // ...
}
```

### Mass ↔ Molarity Conversion

```typescript
const { convertMassToMolar, convertMolarToMass } = useDoseCalculator()

// Mass to Molar (requires molecular weight)
const molar = convertMassToMolar(10, 'µg/mL', 180.16)  // { value: 55.5, unit: 'µM' }

// Molar to Mass
const mass = convertMolarToMass(100, 'µM', 180.16)  // { value: 18.016, unit: 'µg/mL' }
```

### Well Plate Integration

Generate concentrations for wells:

```typescript
const { calculateSerialDilution, generateWellConcentrations } = useDoseCalculator()

const dilutionResult = calculateSerialDilution({...})
const wellIds = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']

const wellConcentrations = generateWellConcentrations(dilutionResult, wellIds)
// [{ wellId: 'A1', concentration: {...}, volume: {...} }, ...]
```

---

## useProtocolTemplates

Protocol step template management with built-in templates and custom template persistence.

```typescript
import { useProtocolTemplates, type StepTemplate, type ProtocolStep } from '@morscherlab/mld-sdk'
```

### Basic Usage

```typescript
const {
  builtInTemplates,
  customTemplates,
  allTemplates,
  getTemplate,
  createStepFromTemplate,
  validateStep,
} = useProtocolTemplates()

// Get template by type
const incubationTemplate = getTemplate('incubation')

// Create step from template
const step = createStepFromTemplate(incubationTemplate, {
  temperature: 37,
  duration: 60,
  co2: 5,
  humidity: 95,
})

// Validate step against template
const validation = validateStep(step, incubationTemplate)
if (!validation.valid) {
  console.log(validation.errors)
}
```

### Built-in Templates

| Type | Parameters |
|------|------------|
| `incubation` | temperature (°C), duration (min), CO2 (%), humidity (%) |
| `wash` | buffer (select), volume (µL), cycles |
| `addition` | reagent, volume (µL), concentration |
| `measurement` | instrument (select), parameters (text) |
| `centrifuge` | RPM, duration (min), temperature (°C) |
| `transfer` | source, destination, volume (µL) |
| `mix` | method (select), duration (sec), speed |
| `custom` | name, description |

### Custom Templates

```typescript
const { addCustomTemplate, updateCustomTemplate, removeCustomTemplate } = useProtocolTemplates()

// Add custom template
addCustomTemplate({
  id: 'my-assay-step',
  type: 'custom',
  name: 'My Assay Step',
  parameters: [
    { key: 'reagent', label: 'Reagent', type: 'text', required: true },
    { key: 'volume', label: 'Volume', type: 'number', unit: 'µL', min: 0 },
  ],
})

// Update template
updateCustomTemplate('my-assay-step', { name: 'Updated Name' })

// Remove template
removeCustomTemplate('my-assay-step')
```

### Parameter Definition

```typescript
interface ParameterDefinition {
  key: string
  label: string
  type: 'number' | 'text' | 'select' | 'concentration' | 'temperature' | 'duration' | 'reagent'
  unit?: string
  options?: Array<{ value: string; label: string }>
  required?: boolean
  default?: unknown
  min?: number
  max?: number
  placeholder?: string
}
```

Custom templates are automatically persisted to localStorage.
