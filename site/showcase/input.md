<script setup>
import InputDemo from '../.vitepress/showcase/InputDemo.vue'
</script>

# BaseInput

A flexible input component supporting various types and states. Handles text, password, email, number, search, tel, and url input types with consistent styling.

## Demo

<ClientOnly>
  <InputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | - | Input value (v-model) |
| `type` | `InputType` | `'text'` | HTML input type |
| `placeholder` | `string` | - | Placeholder text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `disabled` | `boolean` | `false` | Disable the input |
| `readonly` | `boolean` | `false` | Make input read-only |
| `error` | `boolean` | `false` | Show error state styling |
| `min` | `number` | - | Minimum value (for number type) |
| `max` | `number` | - | Maximum value (for number type) |
| `step` | `number` | - | Step increment (for number type) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Emitted on input (for v-model) |
| `focus` | `FocusEvent` | Emitted when input gains focus |
| `blur` | `FocusEvent` | Emitted when input loses focus |
| `keydown` | `KeyboardEvent` | Emitted on keydown |

## Usage

```vue
<template>
  <BaseInput
    v-model="email"
    type="email"
    placeholder="Enter email"
    :error="hasError"
  />

  <BaseInput
    v-model="count"
    type="number"
    :min="0"
    :max="100"
    :step="5"
  />
</template>
```
