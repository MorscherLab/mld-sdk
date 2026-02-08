<script setup>
import TimeRangeInputDemo from '../.vitepress/showcase/TimeRangeInputDemo.vue'
</script>

# TimeRangeInput

A paired start/end time input with optional duration display, step intervals, and time range constraints.

## Demo

<ClientOnly>
  <TimeRangeInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `TimeRange` | - | Selected time range with start/end (v-model) |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `string` | - | Error message to display |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `min` | `string` | - | Minimum selectable time (HH:mm) |
| `max` | `string` | - | Maximum selectable time (HH:mm) |
| `step` | `number` | `15` | Step interval in minutes |
| `format` | `'12h' \| '24h'` | `'24h'` | Time display format |
| `showDuration` | `boolean` | `true` | Show duration badge between inputs |
| `blockedRanges` | `TimeRange[]` | `[]` | Ranges that cannot be selected |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `TimeRange` | Time range changed |

## Types

```ts
interface TimeRange {
  start: string  // HH:mm format
  end: string    // HH:mm format
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TimeRangeInput } from '@morscherlab/mld-sdk'
import type { TimeRange } from '@morscherlab/mld-sdk'

const range = ref<TimeRange>({ start: '09:00', end: '12:00' })
</script>

<template>
  <TimeRangeInput v-model="range" min="08:00" max="18:00" :step="30" />
</template>
```
