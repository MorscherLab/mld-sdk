<script setup>
import BatchProgressListDemo from '../.vitepress/showcase/BatchProgressListDemo.vue'
</script>

# BatchProgressList

Multi-item progress tracking with individual status, overall progress bar, and action buttons.

## Demo

<ClientOnly>
  <BatchProgressListDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BatchItem[]` | - | Items to track |
| `showSummary` | `boolean` | `true` | Show summary counts |
| `title` | `string` | - | Title text |
| `maxHeight` | `string` | - | Max height for scrollable list |
| `autoScroll` | `boolean` | `true` | Auto-scroll to processing items |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `retry` | `string` | Retry clicked for item ID |
| `cancel` | `string` | Cancel clicked for item ID |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `item` | `{ item }` | Custom item rendering |
| `summary` | `{ summary }` | Custom summary |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BatchProgressList } from '@morscherlab/mld-sdk'

const items = ref([
  { id: '1', label: 'File 1', status: 'completed' },
  { id: '2', label: 'File 2', status: 'processing', progress: 50 },
  { id: '3', label: 'File 3', status: 'pending' },
])
</script>

<template>
  <BatchProgressList :items="items" title="Processing files" @retry="handleRetry" />
</template>
```
