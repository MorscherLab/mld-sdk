<script setup>
import TimePickerDemo from '../.vitepress/showcase/TimePickerDemo.vue'
</script>

# TimePicker

A time selection input supporting 12-hour and 24-hour formats, configurable step intervals, and min/max constraints.

## Demo

<ClientOnly>
  <TimePickerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Selected time in HH:mm format (v-model) |
| `placeholder` | `string` | `'Select time'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `string` | - | Error message to display |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `min` | `string` | - | Minimum selectable time (HH:mm) |
| `max` | `string` | - | Maximum selectable time (HH:mm) |
| `step` | `number` | `15` | Step interval in minutes |
| `format` | `'12h' \| '24h'` | `'24h'` | Time display format |
| `clearable` | `boolean` | `false` | Show clear button when value is set |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Time value changed |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from '@morscherlab/mld-sdk'

const time = ref('14:30')
</script>

<template>
  <TimePicker v-model="time" format="12h" :step="30" />
</template>
```
