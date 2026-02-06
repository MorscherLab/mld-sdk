<script setup>
import CollapsibleCardDemo from '../.vitepress/showcase/CollapsibleCardDemo.vue'
</script>

# CollapsibleCard

An expandable card component with a clickable header. Supports icon badges, subtitles, inline toggle switches for feature toggles, and disabled state. Cards can be stacked to create accordion-style layouts.

## Demo

<ClientOnly>
  <CollapsibleCardDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Card header title |
| `subtitle` | `string` | - | Optional subtitle below title |
| `defaultOpen` | `boolean` | `false` | Start in expanded state |
| `disabled` | `boolean` | `false` | Prevent toggling |
| `icon` | `string` | - | SVG path content for icon badge |
| `iconColor` | `string` | `var(--color-primary)` | Icon stroke/fill color |
| `iconBg` | `string` | `var(--color-primary-soft)` | Icon badge background color |
| `showToggle` | `boolean` | `false` | Show toggle switch in header |
| `toggleValue` | `boolean` | `false` | Toggle state (v-model:toggle-value) |
| `toggleColor` | `string` | - | Custom color for toggle when active |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:toggleValue` | `boolean` | Emitted when toggle state changes |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Card body content |

## Behavior

- Click anywhere on the header to toggle (except the toggle switch)
- Toggle switch operates independently from collapse/expand
- Smooth expand/collapse animation
- Chevron rotates to indicate state
- Supports keyboard navigation (Enter/Space)
- Uses `aria-expanded` for accessibility

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CollapsibleCard } from '@morscherlab/mld-sdk'

const enabled = ref(true)
</script>

<template>
  <!-- Basic usage -->
  <CollapsibleCard
    title="Advanced Options"
    subtitle="Optional configuration"
    default-open
  >
    <p>Collapsible content goes here...</p>
  </CollapsibleCard>

  <!-- With icon badge -->
  <CollapsibleCard
    title="Settings"
    subtitle="Configure preferences"
    :icon="settingsIcon"
    icon-color="#3B82F6"
    icon-bg="rgba(59, 130, 246, 0.1)"
  >
    Content here...
  </CollapsibleCard>

  <!-- With toggle switch -->
  <CollapsibleCard
    title="Auto-save"
    subtitle="Save changes automatically"
    show-toggle
    v-model:toggle-value="enabled"
  >
    <p>Auto-save is {{ enabled ? 'on' : 'off' }}</p>
  </CollapsibleCard>
</template>
```
