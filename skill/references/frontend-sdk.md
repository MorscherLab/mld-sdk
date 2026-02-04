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

## Component Catalog (38 total)

| Category | Components |
|----------|------------|
| **Base Inputs** | BaseButton, BaseInput, BaseSelect, BaseTabs, BaseTextarea, BaseCheckbox, BaseRadioGroup, BaseToggle, BaseSlider, BaseModal, NumberInput, TagsInput, DatePicker, ColorSlider, FileUploader |
| **Layout** | AppTopBar, AppSidebar, CollapsibleCard, FormField, Skeleton |
| **Feedback** | AlertBox, ToastNotification, IconButton, ThemeToggle, SettingsButton |
| **Lab/Domain** | WellPlate, PlateMapEditor, SampleLegend, ExperimentTimeline, SampleSelector, GroupAssigner, GroupingModal, MoleculeInput, ConcentrationInput, DoseCalculator, ReagentList, SampleHierarchyTree, ProtocolStepEditor |

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

### MoleculeInput

Chemical structure sketcher using JSME for drawing and editing molecular structures.

```vue
<template>
  <MoleculeInput
    v-model="molecule"
    :disabled="false"
    :readonly="false"
    :height="400"
    :show-smiles="true"
    placeholder="Click to draw structure"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MoleculeInput } from '@morscherlab/mld-sdk/components'
import type { MoleculeData } from '@morscherlab/mld-sdk/types'

const molecule = ref<MoleculeData>({
  smiles: '',
  molfile: '',
})
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `MoleculeData` | `{smiles: '', molfile: ''}` | Molecule data (v-model) |
| `disabled` | `boolean` | `false` | Disable interactions |
| `readonly` | `boolean` | `false` | Read-only mode (display only) |
| `height` | `number` | `400` | Height of the sketcher in pixels |
| `showSmiles` | `boolean` | `true` | Show SMILES string below sketcher |
| `placeholder` | `string` | `'Click to draw structure'` | Placeholder text |

**MoleculeData Type:**

```typescript
interface MoleculeData {
  smiles: string       // SMILES notation
  molfile: string      // MOL file format
  name?: string        // Optional compound name
  formula?: string     // Molecular formula (computed)
  weight?: number      // Molecular weight (computed)
}
```

---

### ConcentrationInput

Numeric input with unit selector for entering concentrations with automatic unit conversion.

```vue
<template>
  <ConcentrationInput
    v-model="concentration"
    :allowed-units="['M', 'mM', 'uM', 'nM', 'mg/mL', 'ug/mL']"
    :show-conversion="true"
    :molecular-weight="342.3"
    :min="0"
    :max="1000"
    :disabled="false"
    size="md"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ConcentrationInput } from '@morscherlab/mld-sdk/components'
import type { ConcentrationValue } from '@morscherlab/mld-sdk/types'

const concentration = ref<ConcentrationValue>({
  value: 10,
  unit: 'mM',
})
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ConcentrationValue` | - | Concentration with unit (v-model) |
| `allowedUnits` | `string[]` | `['M','mM','uM','nM']` | Available unit options |
| `showConversion` | `boolean` | `false` | Show converted value in alternate units |
| `molecularWeight` | `number` | - | MW for mass/molar conversion |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | - | Maximum value |
| `disabled` | `boolean` | `false` | Disable input |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Size preset |

**ConcentrationValue Type:**

```typescript
interface ConcentrationValue {
  value: number
  unit: string  // 'M' | 'mM' | 'uM' | 'nM' | 'mg/mL' | 'ug/mL' | etc.
}
```

---

### DoseCalculator

Multi-mode calculator for dilutions, serial dilutions, and concentration conversions.

```vue
<template>
  <DoseCalculator
    :mode="calculatorMode"
    :molecular-weight="342.3"
    :target-wells="selectedWells"
    :disabled="false"
    @apply-to-wells="handleApplyToWells"
    @calculate="handleCalculate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DoseCalculator } from '@morscherlab/mld-sdk/components'
import type { DilutionResult, SerialDilutionResult } from '@morscherlab/mld-sdk/types'

const calculatorMode = ref<'dilution' | 'serial' | 'conversion' | 'auto'>('auto')
const selectedWells = ref<string[]>(['A1', 'A2', 'A3'])

function handleApplyToWells(wellConcentrations: Record<string, ConcentrationValue>) {
  console.log('Apply to wells:', wellConcentrations)
}

function handleCalculate(result: DilutionResult | SerialDilutionResult) {
  console.log('Calculation result:', result)
}
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'dilution'\|'serial'\|'conversion'\|'auto'` | `'auto'` | Calculator mode |
| `molecularWeight` | `number` | - | MW for mass/molar conversions |
| `targetWells` | `string[]` | `[]` | Wells to apply calculated concentrations |
| `disabled` | `boolean` | `false` | Disable calculator |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `apply-to-wells` | `Record<string, ConcentrationValue>` | Apply calculated doses to wells |
| `calculate` | `DilutionResult \| SerialDilutionResult` | Calculation completed |

**Calculator Modes:**

| Mode | Description |
|------|-------------|
| `dilution` | Single dilution (C1V1 = C2V2) |
| `serial` | Serial dilution series |
| `conversion` | Mass to molar conversion |
| `auto` | Auto-detect based on input |

---

### ReagentList

Inventory table for displaying and managing reagents with stock level indicators.

```vue
<template>
  <ReagentList
    v-model="reagents"
    :readonly="false"
    :show-stock-level="true"
    :low-stock-threshold="10"
    :columns="['name', 'concentration', 'volume', 'stockLevel']"
    :sortable="true"
    :searchable="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReagentList } from '@morscherlab/mld-sdk/components'
import type { Reagent } from '@morscherlab/mld-sdk/types'

const reagents = ref<Reagent[]>([
  {
    id: '1',
    name: 'DMSO',
    concentration: { value: 100, unit: '%' },
    volume: { value: 500, unit: 'mL' },
    stockLevel: 85,
    location: 'Freezer A',
  },
  {
    id: '2',
    name: 'PBS',
    concentration: { value: 1, unit: 'X' },
    volume: { value: 1000, unit: 'mL' },
    stockLevel: 45,
    location: 'Shelf B',
  },
])
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Reagent[]` | `[]` | Reagent list (v-model) |
| `readonly` | `boolean` | `false` | Read-only mode |
| `showStockLevel` | `boolean` | `true` | Show stock level indicators |
| `lowStockThreshold` | `number` | `20` | Percentage threshold for low stock warning |
| `columns` | `string[]` | `['name','concentration','volume']` | Visible columns |
| `sortable` | `boolean` | `true` | Enable column sorting |
| `searchable` | `boolean` | `true` | Enable search filter |

**Reagent Type:**

```typescript
interface Reagent {
  id: string
  name: string
  concentration?: ConcentrationValue
  volume?: { value: number; unit: string }
  stockLevel?: number           // 0-100 percentage
  location?: string
  expirationDate?: Date
  notes?: string
}
```

---

### SampleHierarchyTree

Tree display for visualizing hierarchical sample relationships.

```vue
<template>
  <SampleHierarchyTree
    :nodes="treeNodes"
    :default-expanded-ids="['root', 'parent-1']"
    :expand-all="false"
    :show-icons="true"
    :show-counts="true"
    :max-depth="5"
    size="md"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SampleHierarchyTree } from '@morscherlab/mld-sdk/components'
import type { TreeNode } from '@morscherlab/mld-sdk/types'

const treeNodes = ref<TreeNode[]>([
  {
    id: 'root',
    label: 'Experiment 001',
    type: 'experiment',
    children: [
      {
        id: 'parent-1',
        label: 'Plate 1',
        type: 'plate',
        children: [
          { id: 'sample-1', label: 'Sample A1', type: 'sample', count: 3 },
          { id: 'sample-2', label: 'Sample A2', type: 'sample', count: 2 },
        ],
      },
      {
        id: 'parent-2',
        label: 'Plate 2',
        type: 'plate',
        children: [
          { id: 'sample-3', label: 'Sample B1', type: 'sample', count: 4 },
        ],
      },
    ],
  },
])
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | `[]` | Tree structure data |
| `defaultExpandedIds` | `string[]` | `[]` | Initially expanded node IDs |
| `expandAll` | `boolean` | `false` | Expand all nodes by default |
| `showIcons` | `boolean` | `true` | Show type icons |
| `showCounts` | `boolean` | `false` | Show count badges |
| `maxDepth` | `number` | - | Maximum visible depth |
| `size` | `'sm'\|'md'\|'lg'` | `'md'` | Size preset |

**TreeNode Type:**

```typescript
interface TreeNode {
  id: string
  label: string
  type?: string              // 'experiment' | 'plate' | 'sample' | custom
  icon?: string              // Custom icon override
  children?: TreeNode[]
  count?: number             // Optional count badge
  metadata?: Record<string, unknown>
}
```

---

### ProtocolStepEditor

Editor for creating and modifying protocol steps with template support.

```vue
<template>
  <ProtocolStepEditor
    v-model="currentStep"
    :templates="builtInTemplates"
    :custom-templates="userTemplates"
    mode="edit"
    :show-preview="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProtocolStepEditor } from '@morscherlab/mld-sdk/components'
import { useProtocolTemplates } from '@morscherlab/mld-sdk/composables'
import type { ProtocolStep, ProtocolTemplate } from '@morscherlab/mld-sdk/types'

const { builtInTemplates } = useProtocolTemplates()

const userTemplates = ref<ProtocolTemplate[]>([
  {
    id: 'custom-wash',
    name: 'Custom Wash Protocol',
    type: 'wash',
    defaultDuration: 10,
    parameters: { buffer: 'PBS', volume: '200uL' },
  },
])

const currentStep = ref<ProtocolStep>({
  id: '1',
  type: 'incubation',
  name: 'Cell incubation',
  description: 'Incubate cells at 37C with 5% CO2',
  duration: 60,
  status: 'pending',
  parameters: {
    temperature: '37C',
    humidity: '95%',
    co2: '5%',
  },
  order: 0,
})
</script>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ProtocolStep` | - | Step being edited (v-model) |
| `templates` | `ProtocolTemplate[]` | `[]` | Built-in step templates |
| `customTemplates` | `ProtocolTemplate[]` | `[]` | User-defined templates |
| `mode` | `'create'\|'edit'\|'view'` | `'edit'` | Editor mode |
| `showPreview` | `boolean` | `false` | Show live preview |

**ProtocolTemplate Type:**

```typescript
interface ProtocolTemplate {
  id: string
  name: string
  type: ProtocolStepType
  description?: string
  defaultDuration?: number
  parameters?: Record<string, string | number | boolean>
}
```

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

### useConcentrationUnits

Unit conversion and formatting utilities for concentration values.

```typescript
import { useConcentrationUnits } from '@morscherlab/mld-sdk/composables'
import type { ConcentrationValue } from '@morscherlab/mld-sdk/types'

const {
  convert,           // Convert between units
  formatWithUnit,    // Format value with unit string
  parseConcentration, // Parse string to ConcentrationValue
  getConversionFactor, // Get conversion factor between units
  supportedUnits,    // List of all supported units
} = useConcentrationUnits()

// Convert 10 mM to uM
const converted = convert(
  { value: 10, unit: 'mM' },
  'uM'
)  // { value: 10000, unit: 'uM' }

// Format for display
const formatted = formatWithUnit({ value: 10, unit: 'mM' })  // "10 mM"

// Parse user input
const parsed = parseConcentration('5 uM')  // { value: 5, unit: 'uM' }

// Mass/molar conversion (requires molecular weight)
const molar = convert(
  { value: 10, unit: 'mg/mL' },
  'mM',
  { molecularWeight: 342.3 }
)  // { value: 29.21, unit: 'mM' }
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `convert` | `(value: ConcentrationValue, toUnit: string, options?: { molecularWeight?: number }) => ConcentrationValue` | Convert between units |
| `formatWithUnit` | `(value: ConcentrationValue, options?: { precision?: number }) => string` | Format for display |
| `parseConcentration` | `(input: string) => ConcentrationValue \| null` | Parse string input |
| `getConversionFactor` | `(fromUnit: string, toUnit: string) => number` | Get conversion multiplier |

**Supported Units:** `M`, `mM`, `uM`, `nM`, `pM`, `mg/mL`, `ug/mL`, `ng/mL`, `%`

---

### useDoseCalculator

Calculator functions for dilutions, serial dilutions, and concentration conversions.

```typescript
import { useDoseCalculator } from '@morscherlab/mld-sdk/composables'
import type { ConcentrationValue, DilutionResult, SerialDilutionResult } from '@morscherlab/mld-sdk/types'

const {
  calculateDilution,        // Single dilution (C1V1 = C2V2)
  calculateSerialDilution,  // Serial dilution series
  convertMassToMolar,       // mg/mL to M
  convertMolarToMass,       // M to mg/mL
} = useDoseCalculator()

// Single dilution: what volume of stock to add?
const dilution = calculateDilution({
  stockConcentration: { value: 10, unit: 'mM' },
  finalConcentration: { value: 1, unit: 'mM' },
  finalVolume: { value: 100, unit: 'uL' },
})
// Returns: { stockVolume: { value: 10, unit: 'uL' }, diluentVolume: { value: 90, unit: 'uL' } }

// Serial dilution: 1:2 dilution series, 8 points
const series = calculateSerialDilution({
  startConcentration: { value: 100, unit: 'uM' },
  dilutionFactor: 2,
  numberOfPoints: 8,
  finalVolume: { value: 100, unit: 'uL' },
})
// Returns: Array of { concentration, stockVolume, diluentVolume } for each point

// Mass to molar conversion
const molar = convertMassToMolar(
  { value: 10, unit: 'mg/mL' },
  342.3  // molecular weight
)  // { value: 29.21, unit: 'mM' }

// Molar to mass conversion
const mass = convertMolarToMass(
  { value: 10, unit: 'mM' },
  342.3  // molecular weight
)  // { value: 3.423, unit: 'mg/mL' }
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `calculateDilution` | `(params: DilutionParams) => DilutionResult` | Calculate single dilution |
| `calculateSerialDilution` | `(params: SerialDilutionParams) => SerialDilutionResult` | Calculate serial dilution series |
| `convertMassToMolar` | `(conc: ConcentrationValue, mw: number) => ConcentrationValue` | Convert mass to molar |
| `convertMolarToMass` | `(conc: ConcentrationValue, mw: number) => ConcentrationValue` | Convert molar to mass |

**DilutionParams Type:**

```typescript
interface DilutionParams {
  stockConcentration: ConcentrationValue
  finalConcentration: ConcentrationValue
  finalVolume: { value: number; unit: string }
}
```

**SerialDilutionParams Type:**

```typescript
interface SerialDilutionParams {
  startConcentration: ConcentrationValue
  dilutionFactor: number       // e.g., 2 for 1:2 dilution
  numberOfPoints: number
  finalVolume: { value: number; unit: string }
  includeBlank?: boolean       // Add blank at end
}
```

---

### useProtocolTemplates

Manage built-in and custom protocol step templates with validation.

```typescript
import { useProtocolTemplates } from '@morscherlab/mld-sdk/composables'
import type { ProtocolTemplate, ProtocolStep } from '@morscherlab/mld-sdk/types'

const {
  builtInTemplates,      // Ref<ProtocolTemplate[]> - read-only built-in templates
  customTemplates,       // Ref<ProtocolTemplate[]> - user templates
  allTemplates,          // ComputedRef<ProtocolTemplate[]> - combined list
  addCustomTemplate,     // Add new custom template
  updateCustomTemplate,  // Update existing custom template
  removeCustomTemplate,  // Remove custom template
  getTemplate,           // Get template by ID
  createStepFromTemplate, // Create new step from template
  validateStep,          // Validate step data
} = useProtocolTemplates()

// Built-in templates include common step types
console.log(builtInTemplates.value)
// [
//   { id: 'incubation', name: 'Incubation', type: 'incubation', defaultDuration: 60 },
//   { id: 'wash', name: 'Wash', type: 'wash', defaultDuration: 5 },
//   { id: 'addition', name: 'Addition', type: 'addition', defaultDuration: 2 },
//   ...
// ]

// Add custom template
addCustomTemplate({
  id: 'my-custom-step',
  name: 'Custom Incubation',
  type: 'incubation',
  defaultDuration: 30,
  parameters: { temperature: '25C', shaking: true },
})

// Create step from template
const newStep = createStepFromTemplate('wash', {
  name: 'PBS Wash Step',
  description: 'Wash 3x with PBS',
})

// Validate step data
const validation = validateStep(newStep)
if (!validation.valid) {
  console.error('Invalid step:', validation.errors)
}
```

**Methods:**

| Method | Signature | Description |
|--------|-----------|-------------|
| `addCustomTemplate` | `(template: ProtocolTemplate) => void` | Add custom template |
| `updateCustomTemplate` | `(id: string, updates: Partial<ProtocolTemplate>) => void` | Update custom template |
| `removeCustomTemplate` | `(id: string) => void` | Remove custom template |
| `getTemplate` | `(id: string) => ProtocolTemplate \| undefined` | Get template by ID |
| `createStepFromTemplate` | `(templateId: string, overrides?: Partial<ProtocolStep>) => ProtocolStep` | Create step from template |
| `validateStep` | `(step: ProtocolStep) => { valid: boolean; errors: string[] }` | Validate step |

**Built-in Template Types:**

| Type | Default Duration | Description |
|------|------------------|-------------|
| `incubation` | 60 min | Temperature-controlled incubation |
| `wash` | 5 min | Buffer wash step |
| `addition` | 2 min | Reagent addition |
| `measurement` | 15 min | Instrument measurement |
| `transfer` | 5 min | Sample transfer |
| `centrifuge` | 10 min | Centrifugation step |
| `mix` | 2 min | Mixing/vortexing |

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

  // Molecule Input
  MoleculeData,

  // Concentration Input / Dose Calculator
  ConcentrationValue, DilutionParams, DilutionResult,
  SerialDilutionParams, SerialDilutionResult,

  // Reagent List
  Reagent,

  // Sample Hierarchy Tree
  TreeNode,

  // Protocol Step Editor
  ProtocolTemplate,

  // Auth
  AuthConfig, UserInfo, LoginResponse,

  // Platform
  PluginInfo, PlatformContext, ThemeMode,
} from '@morscherlab/mld-sdk/types'
```
