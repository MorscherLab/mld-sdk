<script setup>
import AuditTrailDemo from '../.vitepress/showcase/AuditTrailDemo.vue'
</script>

# AuditTrail

Timestamped event log for change history and compliance tracking with vertical timeline visualization.

## Demo

<ClientOnly>
  <AuditTrailDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entries` | `AuditEntry[]` | - | Log entries to display |
| `maxHeight` | `string` | - | Max height for scrollable list |
| `showFilters` | `boolean` | `false` | Show type/user filter dropdowns |
| `emptyMessage` | `string` | `'No activity yet'` | Message for empty state |
| `order` | `'newest' \| 'oldest'` | `'newest'` | Sort order |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `entry-click` | `AuditEntry` | Entry clicked |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `entry` | `{ entry }` | Custom entry rendering |
| `empty` | - | Custom empty state |

## Usage

```vue
<script setup lang="ts">
import { AuditTrail } from '@morscherlab/mld-sdk'

const entries = [
  {
    id: '1',
    type: 'create',
    action: 'Created experiment',
    user: 'Jane Doe',
    timestamp: new Date(),
  },
]
</script>

<template>
  <AuditTrail :entries="entries" :show-filters="true" />
</template>
```
