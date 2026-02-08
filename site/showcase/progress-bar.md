<script setup>
import ProgressBarDemo from '../.vitepress/showcase/ProgressBarDemo.vue'
</script>

# ProgressBar

A horizontal bar for displaying progress or completion state. Supports multiple color variants, sizes, value display, and an indeterminate mode for unknown durations.

## Demo

<ClientOnly>
  <ProgressBarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Progress value from 0 to 100 |
| `variant` | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar height size |
| `label` | `string` | - | Accessible label for the progress bar |
| `showValue` | `boolean` | `false` | Display the percentage value |
| `indeterminate` | `boolean` | `false` | Show an animated indeterminate state |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProgressBar } from '@morscherlab/mld-sdk'

const progress = ref(45)
</script>

<template>
  <!-- Basic progress -->
  <ProgressBar :value="progress" label="Upload" showValue />

  <!-- Success variant at 100% -->
  <ProgressBar :value="100" variant="success" label="Complete" />

  <!-- Indeterminate loading -->
  <ProgressBar indeterminate label="Processing..." />
</template>
```
