<script setup>
import MultiSelectDemo from '../.vitepress/showcase/MultiSelectDemo.vue'
</script>

# MultiSelect

A chip-based component for selecting multiple values from a set of options.

## Demo

<ClientOnly>
  <MultiSelectDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `(string \| number)[]` | required | Selected values (v-model) |
| `options` | `MultiSelectOption[]` | required | Available options to select from |
| `placeholder` | `string` | `'Select options...'` | Placeholder text when no selection |
| `disabled` | `boolean` | `false` | Disable the entire component |
| `maxSelections` | `number` | `undefined` | Maximum number of allowed selections |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `(string \| number)[]` | Emitted when selection changes |

## Types

```typescript
interface MultiSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

type MultiSelectSize = 'sm' | 'md' | 'lg'
```

## Usage

```vue
<MultiSelect
  v-model="selectedValues"
  :options="[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C', disabled: true },
  ]"
  :max-selections="3"
  placeholder="Choose options..."
/>
```
