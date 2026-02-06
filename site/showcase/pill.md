<script setup>
import PillDemo from '../.vitepress/showcase/PillDemo.vue'
</script>

# BasePill

Compact label component for tags, status indicators, and badges. Supports 7 variants, 3 sizes, removable mode, and icon slots.

## Demo

<ClientOnly>
  <PillDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `PillVariant` | `'default'` | Visual style variant |
| `size` | `PillSize` | `'md'` | Pill size |
| `removable` | `boolean` | `false` | Show remove button |
| `disabled` | `boolean` | `false` | Disable interaction |
| `icon` | `boolean` | `false` | Show icon slot |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `remove` | — | Emitted when the remove button is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Pill label content |
| `icon` | Icon displayed before the label (requires `icon` prop) |

## Usage

```vue
<template>
  <BasePill variant="success">Active</BasePill>

  <BasePill variant="warning" removable @remove="handleRemove">
    Pending
  </BasePill>

  <BasePill variant="info" :icon="true">
    <template #icon><CheckIcon /></template>
    Verified
  </BasePill>
</template>
```
