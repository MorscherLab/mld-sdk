<script setup>
import TabsDemo from '../.vitepress/showcase/TabsDemo.vue'
</script>

# BaseTabs

A tab navigation component with multiple style variants and support for badges, icons, and disabled tabs. Available in underline, pills, and bordered variants.

## Demo

<ClientOnly>
  <TabsDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | Required | Active tab ID (v-model) |
| `tabs` | `TabItem[]` | Required | Array of tab definitions |
| `variant` | `'underline' \| 'pills' \| 'bordered'` | `'underline'` | Tab style variant |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when a tab is selected |

## Types

```ts
interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: string | number
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BaseTabs, type TabItem } from '@morscherlab/mld-sdk'

const tabs: TabItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12 },
  { id: 'sent', label: 'Sent' },
  { id: 'drafts', label: 'Drafts', badge: 3 },
]

const activeTab = ref('inbox')
</script>

<template>
  <BaseTabs
    v-model="activeTab"
    :tabs="tabs"
    variant="pills"
  />

  <div v-if="activeTab === 'inbox'">
    Inbox content...
  </div>
</template>
```
