<script setup>
import BreadcrumbDemo from '../.vitepress/showcase/BreadcrumbDemo.vue'
</script>

# Breadcrumb

A navigation breadcrumb component that displays the user's current location in a hierarchy. Supports custom separators, click navigation, and slotted content for full customization.

## Demo

<ClientOnly>
  <BreadcrumbDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | Required | Array of breadcrumb items to display |
| `separator` | `string` | `'/'` | Separator character between items |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `navigate` | `BreadcrumbItem` | Emitted when a breadcrumb item without `href` is clicked |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `separator` | - | Custom separator content |
| `item` | `{ item: BreadcrumbItem, index: number, isLast: boolean }` | Custom rendering for each breadcrumb item |

## Types

```ts
interface BreadcrumbItem {
  label: string
  to?: string
  href?: string
}
```

## Usage

```vue
<script setup lang="ts">
import { Breadcrumb } from '@morscherlab/mld-sdk'

const items = [
  { label: 'Home' },
  { label: 'Experiments' },
  { label: 'EXP-001' },
]
</script>

<template>
  <Breadcrumb
    :items="items"
    separator=">"
    @navigate="handleNavigate"
  />
</template>
```
