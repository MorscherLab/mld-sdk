<script setup>
import TooltipDemo from '../.vitepress/showcase/TooltipDemo.vue'
</script>

# Tooltip

A lightweight tooltip component that appears on hover or focus. Supports four positions and configurable show delay.

## Demo

<ClientOnly>
  <TooltipDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | Required | Tooltip text to display |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tooltip relative to the trigger |
| `delay` | `number` | `200` | Delay in milliseconds before showing the tooltip |

## Slots

| Slot | Description |
|------|-------------|
| `default` | The trigger element that the tooltip wraps |

## Usage

```vue
<script setup lang="ts">
import { Tooltip, BaseButton } from '@morscherlab/mld-sdk'
</script>

<template>
  <Tooltip text="Save changes" position="bottom">
    <BaseButton>Save</BaseButton>
  </Tooltip>

  <Tooltip text="Instant feedback" :delay="0">
    <span>Hover me</span>
  </Tooltip>
</template>
```
