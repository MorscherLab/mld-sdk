<script setup>
import AlertDemo from '../.vitepress/showcase/AlertDemo.vue'
</script>

# AlertBox

An alert component for displaying important messages with different severity levels. Supports optional titles, dismissible behavior, and rich content via the default slot.

## Demo

<ClientOnly>
  <AlertDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Alert severity type |
| `title` | `string` | - | Optional alert title |
| `dismissible` | `boolean` | `false` | Show dismiss button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | - | Emitted when the dismiss button is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Alert content |

## Usage

```vue
<script setup lang="ts">
import { AlertBox } from '@morscherlab/mld-sdk'
</script>

<template>
  <AlertBox type="success" title="Saved!">
    Your changes have been saved successfully.
  </AlertBox>

  <AlertBox
    type="error"
    title="Error"
    dismissible
    @dismiss="handleDismiss"
  >
    Failed to load data. Please try again.
  </AlertBox>
</template>
```
