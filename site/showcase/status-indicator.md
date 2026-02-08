<script setup>
import StatusIndicatorDemo from '../.vitepress/showcase/StatusIndicatorDemo.vue'
</script>

# StatusIndicator

A small colored dot with an optional label for displaying status. Supports pulsing animations and custom colors.

## Demo

<ClientOnly>
  <StatusIndicatorDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'success' \| 'warning' \| 'error' \| 'info' \| 'muted'` | `'muted'` | Status type determining the dot color |
| `label` | `string` | - | Optional text label displayed next to the dot |
| `pulse` | `boolean` | `false` | Enable pulsing animation |
| `color` | `string` | - | Custom CSS color (overrides status color) |

## Usage

```vue
<script setup lang="ts">
import { StatusIndicator } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- Basic status -->
  <StatusIndicator status="success" label="Online" />

  <!-- Pulsing alert -->
  <StatusIndicator status="error" pulse label="Critical" />

  <!-- Custom color -->
  <StatusIndicator color="#8B5CF6" label="Custom Status" />

  <!-- Dot only, no label -->
  <StatusIndicator status="warning" />
</template>
```
