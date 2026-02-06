<script setup>
import DropdownButtonDemo from '../.vitepress/showcase/DropdownButtonDemo.vue'
</script>

# DropdownButton

Button-style select with dropdown menu for option selection. Supports all button variants and sizes, option descriptions, and loading state.

## Demo

<ClientOnly>
  <DropdownButtonDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | — | Selected option value (v-model) |
| `options` | `SelectOption[]` | — | Available options |
| `placeholder` | `string` | `'Select...'` | Text when no option is selected |
| `variant` | `ButtonVariant` | `'secondary'` | Button style variant |
| `size` | `ButtonSize` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable interaction |
| `loading` | `boolean` | `false` | Show loading spinner |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted when an option is selected |
| `select` | `SelectOption` | Emitted with the full selected option object |

## Usage

```vue
<template>
  <DropdownButton
    v-model="format"
    :options="[
      { value: 'csv', label: 'CSV' },
      { value: 'xlsx', label: 'Excel', description: 'With formatting' },
      { value: 'json', label: 'JSON' },
    ]"
    variant="primary"
    placeholder="Export as..."
  />
</template>
```
