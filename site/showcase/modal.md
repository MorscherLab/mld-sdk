<script setup>
import ModalDemo from '../.vitepress/showcase/ModalDemo.vue'
</script>

# BaseModal

A modal dialog component with multiple sizes, customizable close behavior, and support for footer action buttons. Includes overlay click-to-close, escape key handling, and non-closable mode.

## Demo

<ClientOnly>
  <ModalDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | Required | Modal visibility (v-model) |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal width |
| `closable` | `boolean` | `true` | Show close button |
| `closeOnOverlay` | `boolean` | `true` | Close when clicking overlay |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when visibility changes |
| `close` | - | Emitted when modal is closed |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Modal body content |
| `footer` | Footer with action buttons |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BaseModal, BaseButton } from '@morscherlab/mld-sdk'

const isOpen = ref(false)
</script>

<template>
  <BaseButton @click="isOpen = true">Open</BaseButton>

  <BaseModal v-model="isOpen" title="Confirm" size="sm">
    <p>Are you sure?</p>

    <template #footer>
      <BaseButton variant="ghost" @click="isOpen = false">
        Cancel
      </BaseButton>
      <BaseButton variant="danger" @click="handleConfirm">
        Delete
      </BaseButton>
    </template>
  </BaseModal>
</template>
```
