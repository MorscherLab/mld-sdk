<script setup>
import SelectDemo from '../.vitepress/showcase/SelectDemo.vue'
</script>

# BaseSelect

A dropdown select component with support for option descriptions, disabled options, multiple sizes, and error states. Supports both string and numeric values.

## Demo

<ClientOnly>
  <SelectDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | - | Selected value (v-model) |
| `options` | `SelectOption[]` | Required | Array of options to display |
| `placeholder` | `string` | - | Placeholder text when no selection |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Select size |
| `disabled` | `boolean` | `false` | Disable the select |
| `error` | `boolean` | `false` | Show error state styling |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted when the selection changes |

## Types

```ts
interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  description?: string
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BaseSelect, type SelectOption } from '@morscherlab/mld-sdk'

const options: SelectOption[] = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular', disabled: true },
]

const selected = ref('')
</script>

<template>
  <BaseSelect
    v-model="selected"
    :options="options"
    placeholder="Choose a framework"
  />
</template>
```
