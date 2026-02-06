<script setup>
import WellPlateDemo from '../.vitepress/showcase/WellPlateDemo.vue'
</script>

# WellPlate

Interactive microplate display component supporting 6 to 384-well formats with multiple selection modes, heatmap visualization, and drag-and-drop well movement.

## Demo

<ClientOnly>
  <WellPlateDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[]` | `[]` | Selected well IDs (v-model) |
| `format` | `6 \| 12 \| 24 \| 48 \| 54 \| 96 \| 384` | `96` | Plate format |
| `wells` | `Record<string, Partial<Well>>` | `{}` | Well data by ID |
| `selectionMode` | `'none' \| 'single' \| 'multiple' \| 'rectangle' \| 'drag'` | `'multiple'` | Selection behavior. `'drag'` mode allows moving well contents. |
| `showLabels` | `boolean` | `true` | Show row/column labels |
| `showWellIds` | `boolean` | `false` | Show well ID text inside wells |
| `showSampleTypeIndicator` | `boolean` | `false` | Show sample type letter (S/B/Q/C) in wells |
| `heatmap` | `HeatmapConfig` | `{ enabled: false }` | Heatmap visualization settings |
| `sampleColors` | `Record<string, string>` | `{}` | Color mapping for sample types |
| `zoom` | `number` | `1` | Zoom level (0.5 - 2.0) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fill'` | `'md'` | Well size preset. Use `'fill'` to make plate fill parent container width. |
| `wellShape` | `'circle' \| 'rounded'` | `'rounded'` | Shape of well elements |
| `showWellLabels` | `boolean` | `false` | Show `metadata.label` text inside wells |
| `showBadges` | `boolean` | `false` | Show injection count or custom method badge on wells |
| `editable` | `boolean` | `false` | Enable click-to-edit popup for well data entry |
| `editFields` | `WellEditField[]` | All fields | Which fields to show in the edit popup |
| `defaultInjectionVolume` | `number` | `5` | Default injection volume for new entries |
| `showLegend` | `boolean` | `false` | Show sample type legend bar below the plate |
| `legendItems` | `WellLegendItem[]` | Sample/Blank/QC | Custom legend items |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string[]` | Emitted when selection changes |
| `well-click` | `wellId, event` | Single well clicked |
| `well-hover` | `wellId \| null, event` | Mouse enters/leaves a well |
| `selection-change` | `string[]` | Selection completed (after drag) |
| `context-menu` | `wellId, event` | Right-click on a well |
| `well-move` | `sourceWellId, targetWellId` | Well content dragged to another well (drag mode only) |
| `well-edit` | `wellId, WellEditData` | Well data saved via edit popup |
| `well-clear` | `wellId` | Well cleared via edit popup |

## Editing Mode

When `editable` is true, clicking a well opens an edit popup instead of modifying selection. The popup allows setting:

- **Sample name** -- Text label displayed in the well
- **Sample type** -- Sample (S), Blank (B), or QC (Q) classification
- **Injection volume** -- Volume in microliters
- **Injection count** -- Number of injections (1-5x)
- **Custom method** -- Optional override method name

Control which fields appear with the `editFields` prop:

```vue
<WellPlate
  :editable="true"
  :edit-fields="['label', 'sampleType', 'injectionVolume']"
  @well-edit="handleEdit"
  @well-clear="handleClear"
/>
```

## Usage

```vue
<WellPlate
  v-model="selectedWells"
  :format="96"
  :wells="wellData"
  :sample-colors="{ control: '#3B82F6', treatment: '#10B981' }"
  selection-mode="rectangle"
  @well-click="handleClick"
/>
```

### With Editing

```vue
<WellPlate
  :format="54"
  :wells="wells"
  :editable="true"
  :show-well-labels="true"
  :show-badges="true"
  :show-legend="true"
  @well-edit="(wellId, data) => console.log('Edited:', wellId, data)"
  @well-clear="(wellId) => console.log('Cleared:', wellId)"
/>
```
