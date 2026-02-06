<script setup>
import ToastDemo from '../.vitepress/showcase/ToastDemo.vue'
</script>

# ToastNotification

A toast notification system using the `useToast()` composable. Toasts appear in the top-right corner and auto-dismiss after 3 seconds. Click a toast to dismiss it immediately. Multiple toasts stack vertically.

## Demo

<ClientOnly>
  <ToastDemo />
</ClientOnly>

## Setup

Add the `ToastNotification` component to your app root (usually `App.vue`):

```vue
<script setup>
import { ToastNotification } from '@morscherlab/mld-sdk'
</script>

<template>
  <div>
    <router-view />
    <ToastNotification />
  </div>
</template>
```

## useToast() API

### Methods

| Method | Arguments | Description |
|--------|-----------|-------------|
| `success()` | `message: string` | Show a success toast |
| `error()` | `message: string` | Show an error toast |
| `warning()` | `message: string` | Show a warning toast |
| `info()` | `message: string` | Show an info toast |
| `dismiss()` | `id: number` | Dismiss a specific toast by ID |

### Reactive Properties

| Property | Type | Description |
|----------|------|-------------|
| `toasts` | `Ref<Toast[]>` | Array of currently active toasts |

## Types

```ts
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}
```

## Behavior

- Toasts auto-dismiss after 3 seconds
- Click a toast to dismiss it immediately
- Multiple toasts stack vertically
- Toasts use Teleport to render at the body root
- Animated entrance and exit transitions

## Usage

```vue
<script setup lang="ts">
import { useToast } from '@morscherlab/mld-sdk'

const { success, error, warning, info, toasts, dismiss } = useToast()

success('Saved successfully!')
error('Failed to save')
warning('Unsaved changes')
info('Tip: Press Ctrl+S to save')
</script>
```
