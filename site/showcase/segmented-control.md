<script setup>
import SegmentedControlDemo from '../.vitepress/showcase/SegmentedControlDemo.vue'
</script>

# SegmentedControl

A button group for single selection with support for simple and card variants.

## Demo

<ClientOnly>
  <SegmentedControlDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | required | Currently selected value (v-model) |
| `options` | `SegmentedOption[]` | required | Available options to select from |
| `variant` | `'simple' \| 'card'` | `'simple'` | Visual variant. Card shows descriptions. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `fullWidth` | `boolean` | `true` | Stretch to fill container width |
| `disabled` | `boolean` | `false` | Disable the entire control |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted when selection changes |

## Types

```typescript
interface SegmentedOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

type SegmentedControlVariant = 'simple' | 'card'
type SegmentedControlSize = 'sm' | 'md' | 'lg'
```

## Usage

```vue
<SegmentedControl
  v-model="selected"
  :options="[
    { value: 'neg', label: 'NEG' },
    { value: 'pos', label: 'POS' },
  ]"
  variant="simple"
/>
```
