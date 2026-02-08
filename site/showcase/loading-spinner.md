<script setup>
import LoadingSpinnerDemo from '../.vitepress/showcase/LoadingSpinnerDemo.vue'
</script>

# LoadingSpinner

An animated spinner for indicating loading or processing states. Available in multiple sizes and color variants.

## Demo

<ClientOnly>
  <LoadingSpinnerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size |
| `variant` | `'primary' \| 'cta' \| 'muted'` | `'primary'` | Color variant |
| `label` | `string` | `'Loading'` | Accessible label for screen readers |

## Usage

```vue
<script setup lang="ts">
import { LoadingSpinner } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- Basic spinner -->
  <LoadingSpinner />

  <!-- Small muted spinner with visible label -->
  <div style="display: flex; align-items: center; gap: 8px;">
    <LoadingSpinner size="sm" variant="muted" />
    <span>Loading data...</span>
  </div>

  <!-- Large CTA spinner -->
  <LoadingSpinner size="lg" variant="cta" />
</template>
```
