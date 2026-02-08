<script setup>
import ChartContainerDemo from '../.vitepress/showcase/ChartContainerDemo.vue'
</script>

# ChartContainer

A wrapper component for chart visualizations that provides a consistent header, toolbar area, loading overlay, empty state, and legend slot. Designed to be used with any charting library.

## Demo

<ClientOnly>
  <ChartContainerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Chart title |
| `description` | `string` | - | Subtitle or description below the title |
| `loading` | `boolean` | `false` | Show a loading spinner overlay |
| `empty` | `boolean` | `false` | Show the empty state instead of chart content |
| `emptyMessage` | `string` | `'No data available'` | Message displayed in the empty state |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The chart content (any visualization library) |
| `toolbar` | Action buttons displayed in the header, aligned to the right |
| `legend` | Legend content displayed below the chart |
| `empty` | Custom empty state content (overrides the default EmptyState) |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ChartContainer, BaseButton } from '@morscherlab/mld-sdk'

const loading = ref(false)
</script>

<template>
  <ChartContainer
    title="Dose Response"
    description="IC50 curves for selected compounds"
    :loading="loading"
  >
    <template #toolbar>
      <BaseButton variant="secondary" size="sm">Export</BaseButton>
    </template>

    <MyChart :data="chartData" />

    <template #legend>
      <div class="flex gap-4">
        <span>Group A</span>
        <span>Group B</span>
      </div>
    </template>
  </ChartContainer>
</template>
```
