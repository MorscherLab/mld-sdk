<script setup>
import RadioDemo from '../.vitepress/showcase/RadioDemo.vue'
</script>

# BaseRadioGroup

A radio group component for mutually exclusive option selection. Supports descriptions, multiple sizes, and both horizontal and vertical layouts.

## Demo

<ClientOnly>
  <RadioDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | - | Selected value (v-model) |
| `options` | `RadioOption[]` | required | Array of radio options |
| `name` | `string` | required | HTML name attribute for radio group |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Radio button size |
| `disabled` | `boolean` | `false` | Disable entire group |

## Types

```ts
interface RadioOption {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BaseRadioGroup, type RadioOption } from '@morscherlab/mld-sdk'

const selected = ref('option1')

const options: RadioOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', description: 'With description' },
  { value: 'option3', label: 'Option 3', disabled: true },
]
</script>

<template>
  <BaseRadioGroup
    v-model="selected"
    :options="options"
    name="my-radio-group"
    direction="vertical"
  />
</template>
```
