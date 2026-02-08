<script setup>
import EmptyStateDemo from '../.vitepress/showcase/EmptyStateDemo.vue'
</script>

# EmptyState

A placeholder component for empty content areas. Displays an icon, title, description, and an optional action button. Useful for zero-state screens like empty lists, search results, or first-time experiences.

## Demo

<ClientOnly>
  <EmptyStateDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Heading text |
| `description` | `string` | - | Supporting description text |
| `iconPath` | `string` | - | Custom SVG path data for the icon |
| `color` | `'primary' \| 'cta' \| 'success' \| 'warning' \| 'error' \| 'muted'` | `'muted'` | Color theme for the icon and action button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls icon and text sizing |
| `actionLabel` | `string` | - | Label for the action button (hidden if not provided) |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | - | Emitted when the action button is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Custom content below the description |
| `icon` | Custom icon content (replaces the default SVG icon) |

## Usage

```vue
<script setup lang="ts">
import { EmptyState } from '@morscherlab/mld-sdk'

function handleCreate() {
  // Navigate or open creation dialog
}
</script>

<template>
  <!-- Basic empty state with action -->
  <EmptyState
    title="No experiments found"
    description="Create your first experiment to get started."
    actionLabel="Create Experiment"
    @action="handleCreate"
  />

  <!-- Warning color with custom icon -->
  <EmptyState
    color="warning"
    title="Attention needed"
    description="Some items require your review."
    iconPath="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
  />
</template>
```
