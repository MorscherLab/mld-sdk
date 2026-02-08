<script setup>
import UnitInputDemo from '../.vitepress/showcase/UnitInputDemo.vue'
</script>

# UnitInput

Generic number input with switchable unit dropdown and optional auto-conversion.

## Demo

<ClientOnly>
  <UnitInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | - | Numeric value (v-model) |
| `unit` | `string` | - | Current unit value (v-model:unit) |
| `units` | `UnitOption[]` | - | Available unit options |
| `precision` | `number` | - | Decimal precision for conversions |
| `min` | `number` | - | Minimum value |
| `max` | `number` | - | Maximum value |
| `step` | `number` | - | Step increment |
| `placeholder` | `string` | `'Enter value'` | Input placeholder |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `boolean` | `false` | Error state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `convertOnUnitChange` | `boolean` | `false` | Auto-convert value on unit change |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number \| undefined` | Value changed |
| `update:unit` | `string` | Unit changed |
| `change` | `{ value, unit }` | Either value or unit changed |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UnitInput } from '@morscherlab/mld-sdk'

const value = ref(500)
const unit = ref('mg')
const units = [
  { value: 'mg', label: 'mg', factor: 1e-3, group: 'Mass' },
  { value: 'g', label: 'g', factor: 1, group: 'Mass' },
]
</script>

<template>
  <UnitInput v-model="value" v-model:unit="unit" :units="units" :convert-on-unit-change="true" />
</template>
```
