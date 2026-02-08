<script setup>
import SettingsModalDemo from '../.vitepress/showcase/SettingsModalDemo.vue'
</script>

# SettingsModal

A settings modal with a built-in appearance tab (theme, color palette, table density) and support for custom tabs. Built on top of BaseModal with a tabbed interface for organizing settings sections.

## Demo

<ClientOnly>
  <SettingsModalDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | Required | Modal visibility (v-model) |
| `title` | `string` | `'Settings'` | Modal title |
| `tabs` | `SettingsTab[]` | `[]` | Custom tab definitions |
| `showAppearance` | `boolean` | `true` | Show the built-in appearance tab |
| `size` | `'md' \| 'lg' \| 'xl'` | `'lg'` | Modal width |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when visibility changes |
| `close` | - | Emitted when the modal is closed |

## Slots

| Slot | Description |
|------|-------------|
| `tab-{id}` | Content for a custom tab, where `{id}` matches the tab's `id` property |
| `appearance` | Additional content appended to the built-in appearance tab |

## Types

```ts
interface SettingsTab {
  id: string
  label: string
  icon?: string
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SettingsModal, BaseButton } from '@morscherlab/mld-sdk'

const showSettings = ref(false)

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
]
</script>

<template>
  <BaseButton @click="showSettings = true">Settings</BaseButton>

  <SettingsModal v-model="showSettings" :tabs="tabs">
    <template #tab-general>
      <p>General settings go here.</p>
    </template>

    <template #tab-notifications>
      <p>Notification preferences go here.</p>
    </template>
  </SettingsModal>
</template>
```
