<script setup>
import FormFieldDemo from '../.vitepress/showcase/FormFieldDemo.vue'
</script>

# FormField

A wrapper component that adds labels, hints, and error messages to form inputs. Use it to provide consistent field labeling and validation feedback across your forms.

## Demo

<ClientOnly>
  <FormFieldDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Field label text |
| `error` | `string` | - | Error message to display |
| `hint` | `string` | - | Hint text (hidden when error is shown) |
| `required` | `boolean` | `false` | Show required asterisk |
| `htmlFor` | `string` | - | ID of the input for label association |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The form input element (BaseInput, BaseSelect, etc.) |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FormField, BaseInput } from '@morscherlab/mld-sdk'

const email = ref('')
const emailError = ref('')
</script>

<template>
  <FormField
    label="Email"
    :error="emailError"
    hint="We'll never share your email"
    required
  >
    <BaseInput
      v-model="email"
      type="email"
      :error="!!emailError"
    />
  </FormField>
</template>
```
