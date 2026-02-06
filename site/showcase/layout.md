<script setup>
import LayoutDemo from '../.vitepress/showcase/LayoutDemo.vue'
</script>

# AppLayout

A page layout shell that combines a topbar, sidebar, and main content area. Supports a `floating` variant where all sections render as separate cards with rounded corners, shadows, and gaps. Handles sidebar width transitions and left/right positioning.

## Demo

<ClientOnly>
  <LayoutDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebarPosition` | `'left' \| 'right'` | `'left'` | Which side the sidebar appears on |
| `sidebarWidth` | `string` | `'240px'` | Sidebar width when expanded |
| `sidebarCollapsedWidth` | `string` | `'64px'` | Sidebar width when collapsed |
| `sidebarCollapsed` | `boolean` | `false` | Sidebar collapsed state (v-model) |
| `floating` | `boolean` | `false` | Floating style: all sections as separate cards with gaps |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:sidebarCollapsed` | `boolean` | Emitted when sidebar collapsed state changes |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `topbar` | - | Top bar area (optional) |
| `sidebar` | `{ collapsed: boolean, toggle: () => void }` | Sidebar area with scoped props |
| `default` | - | Main content area |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppLayout, AppSidebar, AppTopBar, type SidebarItem } from '@morscherlab/mld-sdk'

const items: SidebarItem[] = [
  { id: 'home', label: 'Home' },
  {
    id: 'experiments',
    label: 'Experiments',
    children: [
      { id: 'exp-list', label: 'All' },
      { id: 'exp-new', label: 'New' },
    ],
  },
]

const activeItem = ref('home')
const collapsed = ref(false)
</script>

<template>
  <AppLayout floating v-model:sidebar-collapsed="collapsed">
    <template #topbar>
      <AppTopBar variant="default">
        <template #logo>My App</template>
      </AppTopBar>
    </template>

    <template #sidebar="{ collapsed: isCollapsed }">
      <AppSidebar
        :floating="false"
        :items="items"
        :active-id="activeItem"
        :collapsed="isCollapsed"
        @select="(item) => activeItem = item.id"
        @update:collapsed="collapsed = $event"
      />
    </template>

    <main class="p-6">
      <h1>Page content here</h1>
    </main>
  </AppLayout>
</template>
```
