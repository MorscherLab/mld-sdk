<script setup>
import ConfirmDialogDemo from '../.vitepress/showcase/ConfirmDialogDemo.vue'
</script>

# ConfirmDialog

A confirmation dialog built on top of BaseModal. Provides danger, warning, and info variants with customizable labels, a loading state for async operations, and an icon slot for custom visuals.

## Demo

<ClientOnly>
  <ConfirmDialogDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | Required | Dialog visibility (v-model) |
| `title` | `string` | `'Confirm'` | Dialog title |
| `message` | `string` | - | Optional message text |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'danger'` | Visual variant affecting icon and button color |
| `confirmLabel` | `string` | `'Confirm'` | Label for the confirm button |
| `cancelLabel` | `string` | `'Cancel'` | Label for the cancel button |
| `loading` | `boolean` | `false` | Show loading spinner on the confirm button and prevent closing |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when visibility changes |
| `confirm` | - | Emitted when the confirm button is clicked |
| `cancel` | - | Emitted when the cancel button is clicked or dialog is dismissed |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Additional content below the message |
| `icon` | Custom icon to replace the default variant icon |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ConfirmDialog, BaseButton } from '@morscherlab/mld-sdk'

const showConfirm = ref(false)
const loading = ref(false)

async function handleConfirm() {
  loading.value = true
  await deleteItem()
  loading.value = false
  showConfirm.value = false
}
</script>

<template>
  <BaseButton variant="danger" @click="showConfirm = true">
    Delete
  </BaseButton>

  <ConfirmDialog
    v-model="showConfirm"
    title="Delete Experiment"
    message="This action cannot be undone."
    variant="danger"
    confirm-label="Yes, delete it"
    cancel-label="No, keep it"
    :loading="loading"
    @confirm="handleConfirm"
  />
</template>
```
