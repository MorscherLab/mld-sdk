<script setup>
import SampleLegendDemo from '../.vitepress/showcase/SampleLegendDemo.vue'
</script>

# SampleLegend

Color-coded legend for sample types with optional counts and editing capabilities.

## Demo

<ClientOnly>
  <SampleLegendDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `undefined` | Active sample type ID (v-model) |
| `samples` | `SampleType[]` | `[]` | Array of sample types to display |
| `showCounts` | `boolean` | `true` | Show well count badges |
| `editable` | `boolean` | `false` | Allow adding/removing samples |
| `colorPalette` | `string[]` | SDK palette | Default colors for new samples |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout orientation |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| undefined` | Active sample changed |
| `sample-click` | `SampleType` | Sample item clicked |
| `sample-add` | none | Add button clicked |
| `sample-remove` | `string` | Remove button clicked |
| `color-change` | `sampleId, color` | Sample color changed |

## Types

```typescript
interface SampleType {
  id: string
  name: string
  color?: string
  count?: number
}
```

## Usage

```vue
<SampleLegend
  v-model="activeSample"
  :samples="[
    { id: 'control', name: 'Control', color: '#3B82F6', count: 8 },
    { id: 'treatment', name: 'Treatment', color: '#10B981', count: 16 },
  ]"
  editable
  @sample-add="handleAdd"
  @sample-remove="handleRemove"
/>
```
