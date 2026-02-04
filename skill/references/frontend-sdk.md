# Frontend SDK Reference

Complete reference for the MLD Frontend SDK (`@morscherlab/mld-sdk`).

**Package name:** `@morscherlab/mld-sdk` (GitHub Packages)
**Local dev alias:** Use `@estrellaxd/mld-sdk` with `file:` reference for monorepo development

## Package Exports

```typescript
// Main entry - imports everything
import { BaseButton, useToast, useAuthStore } from '@morscherlab/mld-sdk'

// Specific exports (recommended)
import { BaseButton, BaseInput } from '@morscherlab/mld-sdk/components'
import { useApi, useAuth } from '@morscherlab/mld-sdk/composables'
import { useAuthStore, useSettingsStore } from '@morscherlab/mld-sdk/stores'
import type { ButtonVariant, UserInfo } from '@morscherlab/mld-sdk/types'

// Styles (CSS variables)
import '@morscherlab/mld-sdk/styles'
```

---

## Component Catalog (32 total)

| Category | Components |
|----------|------------|
| **Base Inputs** | BaseButton, BaseInput, BaseSelect, BaseTabs, BaseTextarea, BaseCheckbox, BaseRadioGroup, BaseToggle, BaseSlider, BaseModal, NumberInput, TagsInput, DatePicker, ColorSlider, FileUploader |
| **Layout** | AppTopBar, AppSidebar, CollapsibleCard, FormField, Skeleton |
| **Feedback** | AlertBox, ToastNotification, IconButton, ThemeToggle, SettingsButton |
| **Lab/Domain** | WellPlate, PlateMapEditor, SampleLegend, ExperimentTimeline, SampleSelector, GroupAssigner, GroupingModal |

---

## Lab-Specific Components

### WellPlate

Interactive well plate visualization with selection, heatmaps, and sample type coloring.

```vue
<template>
  <WellPlate
    v-model="selectedWells"
    :format="96"
    :wells="wellData"
    :sample-colors="sampleColors"
    :heatmap="heatmapConfig"
    selection-mode="rectangle"
    size="md"
    well-shape="rounded"
    show-labels
    show-sample-type-indicator
    @well-click="handleWellClick"
    @well-hover="handleWellHover"
    @selection-change="handleSelectionChange"
    @context-menu="handleContextMenu"
    @well-move="handleWellMove"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { WellPlate } from '@morscherlab/mld-sdk/components'
import type { Well, HeatmapConfig } from '@morscherlab/mld-sdk/types'

const selectedWells = ref<string[]>([])

const wellData = ref<Record<string, Partial<Well>>>({
  A1: { sampleType: 'sample', value: 0.85 },
  A2: { sampleType: 'control', value: 0.92 },
  A3: { sampleType: 'blank' },
  B1: { sampleType: 'qc', value: 0.78 },
})

const sampleColors = ref<Record<string, string>>({
  sample: '#10B981',
  control: '#3B82F6',
  blank: '#F97316',
  qc: '#8B5CF6',
})

const heatmapConfig = ref<HeatmapConfig>({
  enabled: true,
  min: 0,
  max: 1,
  colorScale: 'viridis',  // viridis | plasma | turbo | custom
  showLegend: true,
})

function handleWellClick(wellId: string, event: MouseEvent) {
  console.log('Clicked:', wellId)
}

function handleSelectionChange(wellIds: string[]) {
  selectedWells.value = wellIds
}
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[]` | `[]` | Selected well IDs (v-model) |
| `format` | `6\|12\|24\|48\|54\|96\|384` | `96` | Plate format |
| `wells` | `Record<string, Partial<Well>>` | `{}` | Well data by ID |
| `selectionMode` | `'none'\|'single'\|'multiple'\|'rectangle'\|'drag'` | `'multiple'` | Selection behavior |
| `showLabels` | `boolean` | `true` | Show row/column labels |
| `showWellIds` | `boolean` | `false` | Show well ID in each well |
| `showSampleTypeIndicator` | `boolean` | `false` | Show S/C/B/Q indicators |
| `heatmap` | `HeatmapConfig` | `{enabled: false}` | Heatmap configuration |
| `sampleColors` | `Record<string, string>` | `{}` | Custom colors per sample type |
| `size` | `'sm'\|'md'\|'lg'\|'xl'\|'fill'` | `'md'` | Well size preset |
| `wellShape` | `'circle'\|'rounded'` | `'rounded'` | Well shape |
| `zoom` | `number` | `1` | Zoom level |
| `disabled` | `boolean` | `false` | Disable interactions |
| `readonly` | `boolean` | `false` | Read-only mode |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string[]` | Selection changed |
| `well-click` | `(wellId, event)` | Well clicked |
| `well-hover` | `(wellId \| null, event?)` | Mouse enter/leave well |
| `selection-change` | `string[]` | Selection finalized |
| `context-menu` | `(wellId, event)` | Right-click on well |
| `well-move` | `(sourceId, targetId)` | Drag move in 'drag' mode |

**Selection Modes:**

| Mode | Behavior |
|------|----------|
| `none` | No selection |
| `single` | Click selects one well |
| `multiple` | Click toggles, Shift/Ctrl for multi |
| `rectangle` | Click-drag to select rectangular region |
| `drag` | Drag wells to move contents |

---

### PlateMapEditor

Full-featured plate map editing with multiple plates, sample types, undo/redo.

```vue
<template>
  <PlateMapEditor
    v-model="editorState"
    :format="96"
    :max-plates="10"
    :samples="initialSamples"
    show-toolbar
    show-sidebar
    allow-add-plates
    allow-add-samples
    size="md"
    @plate-add="handlePlateAdd"
    @plate-remove="handlePlateRemove"
    @sample-assign="handleSampleAssign"
    @wells-clear="handleWellsClear"
    @undo="handleUndo"
    @redo="handleRedo"
    @export="handleExport"
    @import="handleImport"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlateMapEditor } from '@morscherlab/mld-sdk/components'
import type { PlateMapEditorState, SampleType } from '@morscherlab/mld-sdk/types'

const initialSamples: SampleType[] = [
  { id: 'sample', name: 'Sample', color: '#10B981' },
  { id: 'control', name: 'Control', color: '#3B82F6' },
  { id: 'blank', name: 'Blank', color: '#F97316' },
]

const editorState = ref<PlateMapEditorState | undefined>()

function handleSampleAssign(wellIds: string[], sampleId: string | undefined) {
  console.log('Assigned', sampleId, 'to', wellIds)
}

function handleExport(data: string, format: 'json' | 'csv') {
  console.log('Exported:', format, data)
}
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `PlateMapEditorState` | - | Editor state (v-model) |
| `format` | `WellPlateFormat` | `96` | Default plate format |
| `maxPlates` | `number` | `10` | Maximum plates allowed |
| `samples` | `SampleType[]` | `[]` | Initial sample types |
| `showToolbar` | `boolean` | `true` | Show toolbar |
| `showSidebar` | `boolean` | `true` | Show sample sidebar |
| `allowAddPlates` | `boolean` | `true` | Allow adding plates |
| `allowAddSamples` | `boolean` | `true` | Allow adding samples |
| `size` | `'sm'\|'md'\|'lg'\|'xl'\|'fill'` | `'md'` | Well size |

**Keyboard Shortcuts:**

| Key | Action |
|-----|--------|
| `1-9` | Quick assign sample type |
| `Delete/Backspace` | Clear selected wells |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+A` | Select all wells |
| `Escape` | Clear selection |

**State Structure:**

```typescript
interface PlateMapEditorState {
  plates: PlateMap[]
  activePlateId: string
  samples: SampleType[]
  selectedWells: string[]
  activeSampleId?: string
}

interface PlateMap {
  id: string
  name: string
  format: WellPlateFormat
  wells: Record<string, Well>
}
```

---

### ExperimentTimeline

Visualize protocol steps with status, drag-to-reorder, and expandable details.

```vue
<template>
  <ExperimentTimeline
    v-model="steps"
    orientation="vertical"
    size="md"
    show-duration
    editable
    collapsible
    color-by-status
    @step-click="handleStepClick"
    @step-add="handleStepAdd"
    @step-remove="handleStepRemove"
    @step-status-change="handleStatusChange"
    @step-reorder="handleReorder"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ExperimentTimeline } from '@morscherlab/mld-sdk/components'
import type { ProtocolStep, ProtocolStepStatus } from '@morscherlab/mld-sdk/types'

const steps = ref<ProtocolStep[]>([
  {
    id: '1',
    type: 'incubation',
    name: 'Initial incubation',
    description: 'Incubate at 37C',
    duration: 60,
    status: 'completed',
    parameters: { temperature: '37C', humidity: '95%' },
    order: 0,
  },
  {
    id: '2',
    type: 'wash',
    name: 'PBS wash',
    duration: 5,
    status: 'in_progress',
    order: 1,
  },
  {
    id: '3',
    type: 'measurement',
    name: 'Absorbance reading',
    duration: 15,
    status: 'pending',
    order: 2,
  },
])

function handleStatusChange(stepId: string, status: ProtocolStepStatus) {
  const step = steps.value.find(s => s.id === stepId)
  if (step) step.status = status
}

function handleStepAdd(afterStepId?: string) {
  // Add new step logic
}
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ProtocolStep[]` | `[]` | Protocol steps (v-model) |
| `orientation` | `'horizontal'\|'vertical'` | `'vertical'` | Layout direction |
| `showDuration` | `boolean` | `true` | Show duration badge |
| `showTime` | `boolean` | `false` | Show timestamps |
| `editable` | `boolean` | `false` | Enable editing |
| `collapsible` | `boolean` | `true` | Steps can expand |
| `expandedStepId` | `string` | - | Controlled expanded step |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Size preset |
| `colorByStatus` | `boolean` | `true` | Color by step status |
| `colorByType` | `boolean` | `false` | Color by step type |

**Step Types:**

| Type | Icon | Color |
|------|------|-------|
| `incubation` | Sun | Amber |
| `wash` | Water | Cyan |
| `addition` | Plus circle | Emerald |
| `measurement` | Chart | Purple |
| `transfer` | Arrow | Blue |
| `centrifuge` | Spin | Gray |
| `mix` | Play | Orange |
| `custom` | Cog | Pink |

**Step Status:**

| Status | Visual |
|--------|--------|
| `pending` | Gray |
| `in_progress` | Blue, animated |
| `completed` | Green |
| `failed` | Red |
| `skipped` | Gray, dimmed |

---

### SampleLegend

Display and manage sample types with selection and color swatches.

```vue
<template>
  <SampleLegend
    v-model="activeSampleId"
    :samples="samples"
    :editable="true"
    :show-counts="true"
    size="md"
    orientation="vertical"
    @sample-click="handleSampleClick"
    @sample-add="handleSampleAdd"
    @sample-remove="handleSampleRemove"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SampleLegend } from '@morscherlab/mld-sdk/components'
import type { SampleType } from '@morscherlab/mld-sdk/types'

const activeSampleId = ref<string>()

const samples = ref<SampleType[]>([
  { id: 'sample', name: 'Sample', color: '#10B981', count: 48 },
  { id: 'control', name: 'Control', color: '#3B82F6', count: 8 },
  { id: 'blank', name: 'Blank', color: '#F97316', count: 4 },
])
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Active sample ID (v-model) |
| `samples` | `SampleType[]` | `[]` | Sample type definitions |
| `showCounts` | `boolean` | `true` | Show count badges |
| `editable` | `boolean` | `false` | Allow add/remove |
| `colorPalette` | `string[]` | Default palette | Auto-assign colors |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Size preset |
| `orientation` | `'vertical'\|'horizontal'` | `'vertical'` | Layout |

---

## Base Components Reference

### BaseButton

```vue
<BaseButton
  variant="primary"  <!-- primary | secondary | cta | danger | success | ghost -->
  size="md"          <!-- sm | md | lg -->
  :disabled="false"
  :loading="false"
  :fullWidth="false"
  type="button"      <!-- button | submit | reset -->
  @click="handleClick"
>
  Click me
</BaseButton>
```

### BaseInput

```vue
<BaseInput
  v-model="value"
  type="text"        <!-- text | password | email | number | search | tel | url -->
  placeholder="Enter value"
  size="md"          <!-- sm | md | lg -->
  :disabled="false"
  :readonly="false"
  :error="false"
  :min="0"           <!-- for number type -->
  :max="100"
  :step="1"
  @focus="onFocus"
  @blur="onBlur"
/>
```

### BaseSelect

```vue
<script setup lang="ts">
import type { SelectOption } from '@morscherlab/mld-sdk/types'

const options: SelectOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B', disabled: true },
]
</script>

<BaseSelect
  v-model="selected"
  :options="options"
  placeholder="Select..."
  size="md"
  :disabled="false"
  :error="false"
/>
```

### BaseModal

```vue
<BaseModal
  v-model="isOpen"
  title="Modal Title"
  size="md"            <!-- sm | md | lg | xl | full -->
  :closable="true"
  :closeOnOverlay="true"
  :closeOnEscape="true"
  @close="onClose"
>
  <p>Modal content</p>

  <template #footer>
    <BaseButton @click="isOpen = false">Close</BaseButton>
  </template>
</BaseModal>
```

### BaseTabs

```vue
<script setup lang="ts">
import type { TabItem } from '@morscherlab/mld-sdk/types'

const tabs: TabItem[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2', badge: 5 },
  { id: 'tab3', label: 'Tab 3', disabled: true },
]
</script>

<BaseTabs
  v-model="activeTab"
  :tabs="tabs"
  variant="underline"  <!-- underline | pills | bordered -->
/>
```

### FormField

```vue
<FormField
  label="Email"
  :required="true"
  error="Invalid email"
  hint="We'll never share your email"
  htmlFor="email-input"
>
  <BaseInput id="email-input" v-model="email" type="email" :error="!!error" />
</FormField>
```

### AlertBox

```vue
<AlertBox
  type="success"      <!-- success | error | warning | info -->
  title="Success!"
  :dismissible="true"
  @dismiss="onDismiss"
>
  Your changes have been saved.
</AlertBox>
```

### CollapsibleCard

```vue
<CollapsibleCard
  title="Section Title"
  subtitle="Optional subtitle"
  :defaultOpen="false"
  :disabled="false"
>
  <p>Expandable content</p>
</CollapsibleCard>
```

### AppTopBar

```vue
<AppTopBar
  title="My App"
  :showLogo="true"
  :sticky="true"
>
  <template #logo>
    <img src="/logo.svg" alt="Logo" />
  </template>

  <template #nav>
    <nav>...</nav>
  </template>

  <template #actions>
    <ThemeToggle />
    <BaseButton>Login</BaseButton>
  </template>
</AppTopBar>
```

### ToastNotification

```vue
<!-- Add once at app root -->
<template>
  <div id="app">
    <router-view />
    <ToastNotification />
  </div>
</template>
```

---

## Composables Reference

### useApi

```typescript
const api = useApi({
  baseUrl?: string,      // Override API base URL
  timeout?: number,      // Request timeout (ms)
  withAuth?: boolean,    // Include auth header (default: true)
})

// Methods
await api.get<T>(url, config?)
await api.post<T>(url, data?, config?)
await api.put<T>(url, data?, config?)
await api.patch<T>(url, data?, config?)
await api.delete<T>(url, config?)

// File upload
await api.upload<T>(url, file, fieldName?, additionalData?)

// Download (returns blob URL)
const blobUrl = await api.download(url, filename?)

// URL builders
api.buildUrl('/path')      // Full API URL
api.buildWsUrl('/ws/path') // WebSocket URL

// Raw client access
api.client  // AxiosInstance
```

### useAuth

```typescript
const {
  login,           // (username, password) => Promise<boolean>
  logout,          // () => void
  register,        // (username, password, email?) => Promise<boolean>
  verifyToken,     // () => Promise<boolean>
  fetchAuthConfig, // () => Promise<AuthConfig>
  initializeAuth,  // () => Promise<void>
  getCurrentUser,  // () => Promise<UserInfo | null>
  getAuthHeader,   // () => Record<string, string>
  updateProfile,   // (data) => Promise<{success, error?}>
} = useAuth()

// Initialize on app mount
onMounted(async () => {
  await initializeAuth()
})
```

### useToast

```typescript
const {
  toasts,   // Ref<Toast[]>
  show,     // (message, type?, duration?) => void
  success,  // (message, duration?) => void
  error,    // (message, duration?) => void
  warning,  // (message, duration?) => void
  info,     // (message, duration?) => void
  dismiss,  // (id) => void
  clear,    // () => void
} = useToast()

success('Saved!', 3500)  // 3.5s duration
error('Failed', 5000)    // 5s duration
```

### usePlatformContext

```typescript
const {
  context,      // Ref<PlatformContext>
  isIntegrated, // ComputedRef<boolean>
  plugin,       // ComputedRef<PluginInfo | undefined>
  user,         // ComputedRef<{id, username, role} | undefined>
  theme,        // ComputedRef<'light' | 'dark' | 'system'>
  features,     // ComputedRef<{experiments?, passkey?, multiUser?}>
  navigate,     // (path) => void - Navigate within platform
  notify,       // (message, type?) => void - Send notification to platform
  sendToPlatform, // (event) => void - Send custom event
} = usePlatformContext()
```

### useTheme

```typescript
const {
  isDark,      // Ref<boolean>
  toggleTheme, // () => void
  setTheme,    // (dark: boolean) => void
} = useTheme()
```

---

## Stores Reference

### useAuthStore

```typescript
const authStore = useAuthStore()

// State
authStore.token          // string | null
authStore.tokenExpires   // Date | null
authStore.username       // string | null
authStore.userInfo       // UserInfo | null
authStore.isInitialized  // boolean
authStore.isLoading      // boolean

// Computed
authStore.isAuthenticated  // boolean
authStore.needsAuth        // boolean
authStore.isAdmin          // boolean
```

### useSettingsStore

```typescript
const settingsStore = useSettingsStore()

// State
settingsStore.theme              // 'light' | 'dark' | 'system'
settingsStore.colorPalette       // 'default' | 'colorblind' | 'viridis' | 'pastel'
settingsStore.tableDensity       // 'compact' | 'normal' | 'comfortable'

// Methods
settingsStore.applyTheme()
settingsStore.getApiBaseUrl()
settingsStore.getWsBaseUrl()
```

---

## CSS Variables

```css
/* Light mode (default) */
:root {
  --bg-primary: #F8FAFC;
  --bg-secondary: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-hover: #F1F5F9;
  --bg-tertiary: #F1F5F9;
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --border-color: #E2E8F0;
  --color-primary: #3B82F6;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
}

/* Dark mode */
html.dark {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-card: #1E293B;
  --bg-hover: #334155;
  --bg-tertiary: #334155;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #64748B;
  --border-color: #334155;
}
```

---

## Types Reference

```typescript
import type {
  // Components
  ButtonVariant, ButtonSize, ModalSize, AlertType, Toast, TabItem, SelectOption,

  // Well Plate
  WellPlateFormat, WellState, WellPlateSelectionMode, WellPlateSize, WellShape,
  Well, HeatmapConfig, HeatmapColorScale,

  // Sample Legend
  SampleType,

  // Plate Map Editor
  PlateMap, PlateMapEditorState,

  // Experiment Timeline
  ProtocolStepType, ProtocolStepStatus, ProtocolStep,

  // Auth
  AuthConfig, UserInfo, LoginResponse,

  // Platform
  PluginInfo, PlatformContext, ThemeMode,
} from '@morscherlab/mld-sdk/types'
```
