# Component Catalog

Complete reference for all MLD SDK Vue 3 components.

## Base Components

### BaseButton

Button component with multiple variants and states.

```vue
<BaseButton variant="primary" size="md" :loading="false" :disabled="false">
  Click me
</BaseButton>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'primary'` | Visual style |
| `size` | `ButtonSize` | `'md'` | Button size |
| `type` | `string` | `'button'` | HTML button type |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |

#### Variants

- `primary` - Blue primary action
- `secondary` - Bordered secondary action
- `cta` - Orange call-to-action
- `danger` - Red destructive action
- `success` - Green success action
- `ghost` - Minimal/text button

#### Sizes

- `sm` - Small (h-8, text-sm)
- `md` - Medium (h-10, text-sm)
- `lg` - Large (h-12, text-base)

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Button clicked |

---

### BaseInput

Text input with label, error state, and validation support.

```vue
<BaseInput
  v-model="value"
  type="text"
  label="Username"
  placeholder="Enter username"
  :error="errorMessage"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | `''` | Input value (v-model) |
| `type` | `InputType` | `'text'` | Input type |
| `label` | `string` | - | Label text |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable input |
| `required` | `boolean` | `false` | Show required indicator |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Value changed |
| `blur` | `FocusEvent` | Input blurred |
| `focus` | `FocusEvent` | Input focused |

---

### BaseTextarea

Multi-line text input.

```vue
<BaseTextarea
  v-model="content"
  label="Description"
  :rows="4"
  placeholder="Enter description..."
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Textarea value |
| `label` | `string` | - | Label text |
| `placeholder` | `string` | - | Placeholder text |
| `rows` | `number` | `3` | Number of rows |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable textarea |
| `required` | `boolean` | `false` | Show required indicator |

---

### BaseSelect

Dropdown select with generic typing.

```vue
<BaseSelect
  v-model="selected"
  :options="options"
  label="Country"
  placeholder="Select a country"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `T` | - | Selected value |
| `options` | `SelectOption<T>[]` | `[]` | Available options |
| `label` | `string` | - | Label text |
| `placeholder` | `string` | - | Placeholder text |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable select |
| `required` | `boolean` | `false` | Show required indicator |

#### Option Type

```typescript
interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
}
```

---

### BaseCheckbox

Checkbox with label.

```vue
<BaseCheckbox v-model="agreed" label="I agree to the terms" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Checked state |
| `label` | `string` | - | Label text |
| `disabled` | `boolean` | `false` | Disable checkbox |

---

### BaseToggle

Toggle switch component.

```vue
<BaseToggle v-model="enabled" label="Enable notifications" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Toggle state |
| `label` | `string` | - | Label text |
| `disabled` | `boolean` | `false` | Disable toggle |

---

### BaseRadioGroup

Radio button group.

```vue
<BaseRadioGroup
  v-model="selected"
  :options="options"
  label="Select an option"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | - | Selected value |
| `options` | `RadioOption[]` | `[]` | Available options |
| `label` | `string` | - | Group label |
| `disabled` | `boolean` | `false` | Disable all options |

---

### BaseSlider

Range slider input.

```vue
<BaseSlider v-model="value" :min="0" :max="100" :step="1" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `0` | Slider value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disable slider |

---

### BaseTabs

Tab navigation component.

```vue
<BaseTabs v-model="activeTab" :tabs="tabs">
  <template #content-tab1>Tab 1 content</template>
  <template #content-tab2>Tab 2 content</template>
</BaseTabs>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Active tab ID |
| `tabs` | `TabItem[]` | `[]` | Tab definitions |

#### Tab Item

```typescript
interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: string | number
}
```

---

### BaseModal

Modal dialog with Teleport.

```vue
<BaseModal v-model="isOpen" title="Confirm Action" size="md">
  <p>Are you sure you want to continue?</p>

  <template #footer>
    <BaseButton variant="secondary" @click="isOpen = false">Cancel</BaseButton>
    <BaseButton variant="primary" @click="confirm">Confirm</BaseButton>
  </template>
</BaseModal>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Open state |
| `title` | `string` | - | Modal title |
| `size` | `ModalSize` | `'md'` | Modal size |
| `closable` | `boolean` | `true` | Show close button |
| `closeOnOverlay` | `boolean` | `true` | Close on overlay click |

#### Sizes

- `sm` - 400px max width
- `md` - 500px max width
- `lg` - 640px max width
- `xl` - 800px max width
- `full` - Full screen

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Modal body content |
| `footer` | Footer with actions |

---

## Form Components

### FormField

Form field wrapper with label, error, and hint.

```vue
<FormField label="Email" :error="errors.email" hint="We'll never share your email" required>
  <BaseInput v-model="email" type="email" />
</FormField>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Field label |
| `error` | `string` | - | Error message |
| `hint` | `string` | - | Help text |
| `required` | `boolean` | `false` | Show required indicator |

---

### FileUploader

Drag-and-drop file upload.

```vue
<FileUploader
  v-model="files"
  :accept="['.csv', '.xlsx']"
  :multiple="true"
  :mode="'file'"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `File[]` | `[]` | Selected files |
| `accept` | `string[]` | `[]` | Accepted file types |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `mode` | `FileUploaderMode` | `'file'` | 'file' or 'folder' |
| `disabled` | `boolean` | `false` | Disable uploader |

---

### DatePicker

Date selection input.

```vue
<DatePicker v-model="date" label="Start Date" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Date \| string` | - | Selected date |
| `label` | `string` | - | Label text |
| `min` | `Date \| string` | - | Minimum date |
| `max` | `Date \| string` | - | Maximum date |
| `disabled` | `boolean` | `false` | Disable picker |

---

### TagsInput

Multi-tag input.

```vue
<TagsInput v-model="tags" placeholder="Add tag..." />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[]` | `[]` | Current tags |
| `placeholder` | `string` | - | Input placeholder |
| `disabled` | `boolean` | `false` | Disable input |

---

### NumberInput

Numeric input with increment/decrement buttons.

```vue
<NumberInput v-model="quantity" :min="0" :max="100" :step="1" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `0` | Current value |
| `min` | `number` | - | Minimum value |
| `max` | `number` | - | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disable input |

---

## Feedback Components

### AlertBox

Alert message box.

```vue
<AlertBox type="success" title="Success!" dismissible>
  Your changes have been saved.
</AlertBox>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `AlertType` | `'info'` | Alert type |
| `title` | `string` | - | Alert title |
| `dismissible` | `boolean` | `false` | Show dismiss button |

#### Types

- `success` - Green success alert
- `error` - Red error alert
- `warning` - Yellow warning alert
- `info` - Blue info alert

---

### ToastNotification

Toast notification container. Place once in your app.

```vue
<template>
  <div id="app">
    <router-view />
    <ToastNotification />
  </div>
</template>
```

This component renders all active toasts from `useToast()`.

---

## Layout Components

### CollapsibleCard

Expandable card section.

```vue
<CollapsibleCard title="Advanced Settings" :default-open="false">
  <p>Card content here</p>
</CollapsibleCard>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title |
| `defaultOpen` | `boolean` | `true` | Initially open |
| `disabled` | `boolean` | `false` | Disable toggle |
| `icon` | `string` | - | Title icon |
| `badge` | `string \| number` | - | Badge value |
| `toggleEnabled` | `boolean` | `false` | Show toggle switch |
| `toggleValue` | `boolean` | `false` | Toggle state |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:toggleValue` | `boolean` | Toggle changed |

---

### AppTopBar

Application header bar.

```vue
<AppTopBar :pages="pages" :tabs="tabs" variant="floating">
  <template #logo>
    <img src="/logo.svg" alt="Logo" />
  </template>
  <template #actions>
    <ThemeToggle />
  </template>
</AppTopBar>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pages` | `TopBarPage[]` | `[]` | Page navigation items |
| `tabs` | `TopBarTab[]` | `[]` | Tab navigation items |
| `variant` | `TopBarVariant` | `'default'` | Visual variant |
| `showThemeToggle` | `boolean` | `false` | Show theme toggle |

---

### AppSidebar

Sidebar navigation with collapsible sections. Parent items with `children` render as collapsible `CollapsibleCard` sections.

```vue
<AppSidebar
  :items="navItems"
  :active-id="activeId"
  v-model:collapsed="isCollapsed"
  @select="(item) => activeId = item.id"
>
  <template #header>
    <Logo />
  </template>
</AppSidebar>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SidebarItem[]` | `[]` | Navigation items |
| `activeId` | `string` | - | Currently active item ID |
| `collapsed` | `boolean` | `false` | Collapsed state (v-model) |
| `floating` | `boolean` | `true` | Floating style with fixed position |
| `width` | `string` | `'240px'` | Expanded width |
| `collapsedWidth` | `string` | `'64px'` | Collapsed width |
| `side` | `'left' \| 'right'` | `'left'` | Sidebar side |
| `topOffset` | `string` | - | Top offset when floating |

#### SidebarItem Type

```typescript
interface SidebarItem {
  id: string
  label: string
  icon?: string
  to?: string
  href?: string
  children?: SidebarItem[]
  badge?: string | number
  disabled?: boolean
  defaultOpen?: boolean  // Whether section starts open (default: true)
}
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `SidebarItem` | Item clicked |
| `update:collapsed` | `boolean` | Collapse state changed |

---

### AppLayout

Page layout shell combining topbar, sidebar, and main content area.

```vue
<AppLayout v-model:sidebar-collapsed="collapsed">
  <template #topbar>
    <AppTopBar variant="default" />
  </template>
  <template #sidebar="{ collapsed: isCollapsed }">
    <AppSidebar :floating="false" :collapsed="isCollapsed" :items="items" />
  </template>
  <main>Page content</main>
</AppLayout>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebarPosition` | `'left' \| 'right'` | `'left'` | Sidebar side |
| `sidebarWidth` | `string` | `'240px'` | Expanded sidebar width |
| `sidebarCollapsedWidth` | `string` | `'64px'` | Collapsed sidebar width |
| `sidebarCollapsed` | `boolean` | `false` | Collapsed state (v-model) |
| `floating` | `boolean` | `false` | Floating style: sections as separate cards |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `topbar` | - | Top bar area (optional) |
| `sidebar` | `{ collapsed, toggle }` | Sidebar with scoped props |
| `default` | - | Main content area |

---

### Skeleton

Loading placeholder.

```vue
<Skeleton width="100%" height="20px" :rounded="true" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `'100%'` | Skeleton width |
| `height` | `string` | `'1rem'` | Skeleton height |
| `rounded` | `boolean` | `true` | Rounded corners |

---

## Biological Experiment Components

### WellPlate

Well plate visualization with selection support.

```vue
<WellPlate
  :format="96"
  :wells="wells"
  :selected-wells="selectedWells"
  selection-mode="multiple"
  @select="handleSelect"
  @clear="handleClear"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `WellPlateFormat` | `96` | Plate format (6, 12, 24, 48, 54, 96, 384) |
| `wells` | `Record<string, Well>` | `{}` | Well data |
| `selectedWells` | `string[]` | `[]` | Selected well IDs |
| `selectionMode` | `WellPlateSelectionMode` | `'none'` | Selection mode |
| `size` | `WellPlateSize` | `'md'` | Display size |
| `wellShape` | `WellShape` | `'circle'` | Well shape |
| `showLabels` | `boolean` | `true` | Show row/column labels |
| `heatmap` | `HeatmapConfig` | - | Heatmap configuration |
| `disabled` | `boolean` | `false` | Disable interaction |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `string[]` | Wells selected |
| `clear` | `string[]` | Wells cleared |
| `hover` | `string \| null` | Well hovered |

---

### SampleLegend

Sample type legend with color indicators.

```vue
<SampleLegend
  :samples="samples"
  :active-sample-id="activeSampleId"
  @select="setActiveSample"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `samples` | `SampleType[]` | `[]` | Sample types |
| `activeSampleId` | `string` | - | Currently active sample |
| `editable` | `boolean` | `false` | Allow editing |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `string` | Sample selected |
| `add` | - | Add button clicked |
| `remove` | `string` | Remove sample |
| `update` | `SampleType` | Sample updated |

---

### PlateMapEditor

Complete plate map editor with sample assignment.

```vue
<PlateMapEditor
  v-model:plates="plates"
  v-model:samples="samples"
  v-model:active-plate-id="activePlateId"
  v-model:selected-wells="selectedWells"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `plates` | `PlateMap[]` | `[]` | Plate data |
| `samples` | `SampleType[]` | `[]` | Sample types |
| `activePlateId` | `string` | - | Active plate |
| `selectedWells` | `string[]` | `[]` | Selected wells |

---

### ExperimentTimeline

Protocol step timeline visualization.

```vue
<ExperimentTimeline :steps="steps" :current-step="currentStep" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `ProtocolStep[]` | `[]` | Protocol steps |
| `currentStep` | `string` | - | Current step ID |
| `editable` | `boolean` | `false` | Allow editing |

---

## Sample Management Components

### SampleSelector

Hierarchical sample grouping with auto-group and CSV metadata import.

```vue
<SampleSelector
  v-model="groups"
  :samples="sampleNames"
  :allow-auto-group="true"
  :allow-csv-import="true"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `SampleGroup[]` | `[]` | Sample groups |
| `samples` | `string[]` | `[]` | Available sample names |
| `allowAutoGroup` | `boolean` | `true` | Enable auto-group button |
| `allowCsvImport` | `boolean` | `true` | Enable CSV import |

---

### GroupingModal

Modal for CSV-based metadata grouping.

```vue
<GroupingModal
  v-model="isOpen"
  :samples="samples"
  @confirm="handleGrouping"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | `false` | Open state |
| `samples` | `string[]` | `[]` | Sample names |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `confirm` | `SampleGroup[]` | Grouping confirmed |

---

### GroupAssigner

Drag-and-drop group assignment for comparisons.

```vue
<GroupAssigner
  v-model:group1="controlGroup"
  v-model:group2="treatmentGroup"
  :available-items="availableGroups"
  group1-label="Control"
  group2-label="Treatment"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `group1` | `GroupItem[]` | `[]` | First group items |
| `group2` | `GroupItem[]` | `[]` | Second group items |
| `availableItems` | `GroupItem[]` | `[]` | Unassigned items |
| `group1Label` | `string` | `'Group 1'` | First group label |
| `group2Label` | `string` | `'Group 2'` | Second group label |

---

## Lab/Chemistry Components

### MoleculeInput

Chemical structure sketcher using JSME editor with SMILES and MOL output.

```vue
<MoleculeInput
  v-model="molecule"
  :height="350"
  :show-smiles="true"
  placeholder="Draw a structure..."
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `MoleculeData` | - | Molecule data (v-model) |
| `disabled` | `boolean` | `false` | Disable editor |
| `readonly` | `boolean` | `false` | Readonly mode |
| `height` | `number` | `300` | Editor height in pixels |
| `showSmiles` | `boolean` | `true` | Show SMILES string below editor |
| `placeholder` | `string` | - | Empty state placeholder |

#### MoleculeData Type

```typescript
interface MoleculeData {
  smiles: string   // SMILES string representation
  molfile: string  // MOL file format
}
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `MoleculeData \| undefined` | Structure changed |
| `error` | `string` | JSME error occurred |

---

### ConcentrationInput

Numeric input with unit selector and auto-conversion between concentration units.

```vue
<ConcentrationInput
  v-model="concentration"
  :show-conversion="true"
  :molecular-weight="180.16"
  size="md"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ConcentrationValue` | - | Concentration value (v-model) |
| `allowedUnits` | `ConcentrationUnit[]` | - | Restrict available units |
| `showConversion` | `boolean` | `false` | Show conversion hint |
| `molecularWeight` | `number` | - | MW for mass↔molarity conversion |
| `min` | `number` | - | Minimum value |
| `max` | `number` | - | Maximum value |
| `disabled` | `boolean` | `false` | Disable input |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |

#### ConcentrationValue Type

```typescript
interface ConcentrationValue {
  value: number
  unit: ConcentrationUnit
}

type ConcentrationUnit =
  | 'pM' | 'nM' | 'µM' | 'mM' | 'M'           // Molarity
  | 'pg/mL' | 'ng/mL' | 'µg/mL' | 'mg/mL' | 'g/mL'  // Mass/Volume
  | '% v/v' | '% w/v' | '% w/w'              // Percentage
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `ConcentrationValue` | Value changed |

---

### DoseCalculator

Multi-mode calculation panel for dilutions, serial dilutions, and unit conversions.

```vue
<DoseCalculator
  mode="auto"
  :molecular-weight="342.3"
  :target-wells="selectedWells"
  @apply-to-wells="handleApply"
  @calculate="handleResult"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'dilution' \| 'serial' \| 'conversion' \| 'auto'` | `'auto'` | Calculator mode |
| `molecularWeight` | `number` | - | MW for mass↔molarity conversion |
| `targetWells` | `string[]` | - | Wells to receive results |
| `disabled` | `boolean` | `false` | Disable calculator |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `apply-to-wells` | `WellConcentration[]` | Apply results to wells |
| `calculate` | `DilutionResult \| SerialDilutionResult` | Calculation completed |

#### Modes

- `dilution` - Single dilution calculation (C1V1 = C2V2)
- `serial` - Serial dilution series
- `conversion` - Mass↔Molarity conversion
- `auto` - Tabbed interface with all modes

---

### ReagentList

Inventory table with stock level indicators and expiry warnings.

```vue
<ReagentList
  v-model="reagents"
  :show-stock-level="true"
  :low-stock-threshold="10"
  :sortable="true"
  :searchable="true"
  @add="openAddDialog"
  @edit="openEditDialog"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Reagent[]` | `[]` | Reagent list (v-model) |
| `readonly` | `boolean` | `false` | Readonly mode |
| `showStockLevel` | `boolean` | `true` | Show stock level bars |
| `lowStockThreshold` | `number` | `10` | Low stock percentage |
| `columns` | `ReagentColumn[]` | all | Visible columns |
| `sortable` | `boolean` | `true` | Enable sorting |
| `searchable` | `boolean` | `true` | Enable search |

#### Reagent Type

```typescript
interface Reagent {
  id: string
  name: string
  catalogNumber?: string
  lotNumber?: string
  expiryDate?: Date | string
  storageCondition?: 'RT' | '4C' | '-20C' | '-80C'
  location?: string
  stockLevel?: number        // 0-100 percentage
  stockUnit?: string
  supplier?: string
  url?: string
}

type ReagentColumn = 'name' | 'catalog' | 'lot' | 'expiry' | 'storage' | 'location' | 'stock' | 'supplier'
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Reagent[]` | List changed |
| `add` | - | Add button clicked |
| `edit` | `Reagent` | Edit reagent |
| `remove` | `string` | Remove reagent ID |

---

### SampleHierarchyTree

Flexible hierarchy display for biological or organizational data.

```vue
<SampleHierarchyTree
  :nodes="hierarchyNodes"
  :default-expanded-ids="['study-1']"
  :show-icons="true"
  :show-counts="true"
  @node-click="handleNodeClick"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | `[]` | Tree nodes |
| `defaultExpandedIds` | `string[]` | `[]` | Initially expanded nodes |
| `expandAll` | `boolean` | `false` | Expand all nodes |
| `showIcons` | `boolean` | `true` | Show type icons |
| `showCounts` | `boolean` | `true` | Show child counts |
| `maxDepth` | `number` | - | Maximum display depth |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Node size |

#### TreeNode Type

```typescript
interface TreeNode {
  id: string
  label: string
  type?: TreeNodeType
  icon?: string                          // Override default icon
  children?: TreeNode[]
  metadata?: Record<string, unknown>
  badge?: string | number
  badgeVariant?: 'default' | 'success' | 'warning' | 'error'
}

type TreeNodeType =
  | 'study' | 'experiment' | 'plate' | 'sample'        // Organizational
  | 'cell_line' | 'passage' | 'clone' | 'treatment'    // Biological
  | 'folder' | 'custom'
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `node-click` | `TreeNode` | Node clicked |
| `expand` | `string` | Node expanded |
| `collapse` | `string` | Node collapsed |

---

### ProtocolStepEditor

Template-based protocol step creation and editing.

```vue
<ProtocolStepEditor
  v-model="currentStep"
  :templates="customTemplates"
  mode="create"
  :show-preview="true"
  @save="handleSave"
  @save-template="handleSaveTemplate"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ProtocolStep` | - | Current step (v-model) |
| `templates` | `StepTemplate[]` | built-in | Available templates |
| `customTemplates` | `StepTemplate[]` | `[]` | User custom templates |
| `mode` | `'create' \| 'edit'` | `'create'` | Editor mode |
| `showPreview` | `boolean` | `true` | Show step preview |

#### ProtocolStep Type

```typescript
interface ProtocolStep {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  duration?: number             // Duration in minutes
  status: ProtocolStepStatus
  parameters?: Record<string, unknown>
  order: number
}

type ProtocolStepType = 'incubation' | 'wash' | 'addition' | 'measurement' | 'transfer' | 'centrifuge' | 'mix' | 'custom'
type ProtocolStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `ProtocolStep` | Step changed |
| `save` | `ProtocolStep` | Save step |
| `save-template` | `StepTemplate` | Save as template |
| `cancel` | - | Cancel editing |

---

## Utility Components

### LoadingSpinner

Standalone reusable spinner/loading indicator.

```vue
<LoadingSpinner size="md" variant="primary" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size |
| `variant` | `'primary' \| 'cta' \| 'muted'` | `'primary'` | Color variant |
| `label` | `string` | `'Loading'` | Screen-reader label |

---

### Divider

Horizontal or vertical separator line with optional label text.

```vue
<Divider />
<Divider label="OR" />
<Divider vertical />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Render as vertical line |
| `label` | `string` | - | Centered label text |
| `spacing` | `'sm' \| 'md' \| 'lg'` | `'md'` | Margin spacing |

---

### StatusIndicator

Colored dot with optional label for showing status.

```vue
<StatusIndicator status="success" label="Active" pulse />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'success' \| 'warning' \| 'error' \| 'info' \| 'muted'` | `'muted'` | Status type |
| `label` | `string` | - | Label text |
| `pulse` | `boolean` | `false` | Pulsing animation |
| `color` | `string` | - | CSS color override |

---

### ProgressBar

Determinate or indeterminate progress indicator.

```vue
<ProgressBar :value="75" label="Upload" showValue />
<ProgressBar indeterminate label="Loading..." />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress 0-100 |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track height |
| `label` | `string` | - | Label above bar |
| `showValue` | `boolean` | `false` | Show percentage |
| `indeterminate` | `boolean` | `false` | Animated indeterminate mode |

---

### Avatar

Circular badge with initials, image, or fallback icon.

```vue
<Avatar name="Jane Doe" size="md" />
<Avatar src="/avatar.jpg" alt="Jane" />
<Avatar initials="MLD" color="#3B82F6" />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Full name (auto-generates initials and color) |
| `initials` | `string` | - | Override initials |
| `src` | `string` | - | Image URL |
| `alt` | `string` | `''` | Alt text |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `color` | `string` | - | Background color override |

---

### EmptyState

Placeholder display when no data is available.

```vue
<EmptyState
  title="No experiments found"
  description="Create your first experiment to get started."
  actionLabel="Create Experiment"
  @action="handleCreate"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Heading text |
| `description` | `string` | - | Description text |
| `iconPath` | `string` | - | SVG path d attribute |
| `color` | `'primary' \| 'cta' \| 'success' \| 'warning' \| 'error' \| 'muted'` | `'muted'` | Color theme |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Content size |
| `actionLabel` | `string` | - | Action button text |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | - | Action button clicked |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Extra content below description |
| `icon` | Override default icon |

---

### Breadcrumb

Navigation breadcrumb trail.

```vue
<Breadcrumb
  :items="[
    { label: 'Home' },
    { label: 'Experiments' },
    { label: 'EXP-001' }
  ]"
  @navigate="handleNav"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | - | Breadcrumb items |
| `separator` | `string` | `'/'` | Separator character |

#### BreadcrumbItem Type

```typescript
interface BreadcrumbItem {
  label: string
  to?: string
  href?: string
}
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `navigate` | `BreadcrumbItem` | Item clicked |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `separator` | - | Custom separator |
| `item` | `{ item, index, isLast }` | Custom item rendering |

---

### Tooltip

Lightweight hover tooltip.

```vue
<Tooltip text="Save changes" position="top">
  <BaseButton variant="primary">Save</BaseButton>
</Tooltip>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Tooltip text |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position |
| `delay` | `number` | `200` | Show delay in ms |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Trigger element |

---

### ConfirmDialog

Confirmation modal for destructive or important actions. Wraps `BaseModal`.

```vue
<ConfirmDialog
  v-model="showConfirm"
  title="Delete experiment?"
  message="This action cannot be undone."
  variant="danger"
  @confirm="handleDelete"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | - | Open state (v-model) |
| `title` | `string` | `'Confirm'` | Dialog title |
| `message` | `string` | - | Message text |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'danger'` | Color variant |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `loading` | `boolean` | `false` | Loading state |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Open state changed |
| `confirm` | - | Confirm clicked |
| `cancel` | - | Cancel clicked |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Extra content below message |
| `icon` | Override default icon |

---

### ChartContainer

Generic wrapper for chart/visualization content.

```vue
<ChartContainer
  title="Revenue"
  description="Monthly revenue in USD"
  :loading="isLoading"
  :empty="!hasData"
>
  <template #toolbar>
    <BaseButton variant="secondary" size="sm">Export</BaseButton>
  </template>
  <MyChart :data="chartData" />
  <template #legend>
    <span>Legend content</span>
  </template>
</ChartContainer>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Card title |
| `description` | `string` | - | Description text |
| `loading` | `boolean` | `false` | Show loading overlay |
| `empty` | `boolean` | `false` | Show empty state |
| `emptyMessage` | `string` | `'No data available'` | Empty state message |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Chart content |
| `toolbar` | Controls above chart |
| `legend` | Content below chart |
| `empty` | Custom empty state |

---

### SettingsModal

Tab-based settings modal with built-in appearance settings. Wraps `BaseModal`.

```vue
<SettingsModal
  v-model="showSettings"
  :tabs="[
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
  ]"
>
  <template #tab-general>
    General settings content
  </template>
  <template #tab-notifications>
    Notification settings content
  </template>
</SettingsModal>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | - | Open state (v-model) |
| `title` | `string` | `'Settings'` | Modal title |
| `tabs` | `SettingsTab[]` | `[]` | Custom tab definitions |
| `showAppearance` | `boolean` | `true` | Show built-in appearance tab |
| `size` | `'md' \| 'lg' \| 'xl'` | `'lg'` | Modal size |

#### SettingsTab Type

```typescript
interface SettingsTab {
  id: string
  label: string
  icon?: string
}
```

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Open state changed |
| `close` | - | Modal closed |

#### Slots

| Slot | Description |
|------|-------------|
| `tab-{id}` | Content for each custom tab |
| `appearance` | Extend built-in appearance tab |
