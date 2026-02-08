<script setup>
import DateTimePickerDemo from '../.vitepress/showcase/DateTimePickerDemo.vue'
</script>

# DateTimePicker

A combined date and time selection input supporting ISO datetime strings, configurable time formats, and min/max constraints.

## Demo

<ClientOnly>
  <DateTimePickerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Selected datetime as ISO string (v-model) |
| `placeholder` | `string` | `'Select date and time'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `string` | - | Error message to display |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `min` | `string` | - | Minimum selectable datetime (ISO string) |
| `max` | `string` | - | Maximum selectable datetime (ISO string) |
| `timeStep` | `number` | `15` | Time step interval in minutes |
| `timeFormat` | `'12h' \| '24h'` | `'24h'` | Time display format |
| `clearable` | `boolean` | `false` | Show clear button when value is set |
| `locale` | `string` | `'en-US'` | Locale for date formatting |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Datetime value changed |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateTimePicker } from '@morscherlab/mld-sdk'

const datetime = ref('')
</script>

<template>
  <DateTimePicker v-model="datetime" time-format="12h" :time-step="30" />
</template>
```
