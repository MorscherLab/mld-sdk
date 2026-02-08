<script setup>
import DividerDemo from '../.vitepress/showcase/DividerDemo.vue'
</script>

# Divider

A visual separator for dividing content sections. Supports horizontal and vertical orientations, optional labels, and configurable spacing.

## Demo

<ClientOnly>
  <DividerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Render as a vertical divider |
| `label` | `string` | - | Optional text label centered on the divider |
| `spacing` | `'sm' \| 'md' \| 'lg'` | `'md'` | Vertical spacing around the divider |

## Usage

```vue
<script setup lang="ts">
import { Divider } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- Basic horizontal divider -->
  <Divider />

  <!-- With centered label -->
  <Divider label="OR" />

  <!-- Compact spacing -->
  <Divider spacing="sm" />

  <!-- Vertical divider between flex items -->
  <div style="display: flex; align-items: center;">
    <span>Left</span>
    <Divider vertical />
    <span>Right</span>
  </div>
</template>
```
