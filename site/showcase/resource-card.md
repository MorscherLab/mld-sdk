<script setup>
import ResourceCardDemo from '../.vitepress/showcase/ResourceCardDemo.vue'
</script>

# ResourceCard

A card component for displaying lab resources such as instruments and equipment, with status indicators, specifications, tags, and booking actions.

## Demo

<ClientOnly>
  <ResourceCardDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Resource name |
| `description` | `string` | - | Resource description |
| `status` | `ResourceStatus` | `'available'` | Current availability status |
| `image` | `string` | - | Resource image URL |
| `location` | `string` | - | Physical location |
| `specs` | `ResourceSpec[]` | `[]` | Technical specifications |
| `tags` | `string[]` | `[]` | Categorization tags |
| `nextAvailable` | `string` | - | Next available time (shown when in-use) |
| `showBookAction` | `boolean` | `false` | Show booking action button |
| `compact` | `boolean` | `false` | Compact list row variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `statusLabel` | `string` | - | Custom status label text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `book` | - | Book button clicked |
| `click` | - | Card clicked |

## Types

```ts
type ResourceStatus = 'available' | 'in-use' | 'maintenance' | 'offline'

interface ResourceSpec {
  label: string
  value: string
}
```

## Usage

```vue
<script setup lang="ts">
import { ResourceCard } from '@morscherlab/mld-sdk'
import type { ResourceSpec } from '@morscherlab/mld-sdk'

const specs: ResourceSpec[] = [
  { label: 'Resolution', value: '240,000 FWHM' },
  { label: 'Mass Range', value: '50-6,000 m/z' },
]
</script>

<template>
  <ResourceCard
    name="Orbitrap Q-Exactive HF"
    description="High-resolution mass spectrometer"
    status="available"
    location="Lab A, Bench 1"
    :specs="specs"
    :tags="['LC-MS', 'High-Res']"
    show-book-action
    @book="handleBook"
  />
</template>
```
