<script setup>
import SidebarDemo from '../.vitepress/showcase/SidebarDemo.vue'
</script>

# AppSidebar

A sidebar navigation component with collapsible sections, badges, collapse/expand state, and custom header/footer slots. Parent items with children render as collapsible `CollapsibleCard` sections. Can be used in floating (fixed position with shadow) or inline mode.

## Demo

<ClientOnly>
  <SidebarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SidebarItem[]` | `[]` | Navigation items |
| `activeId` | `string` | - | Currently active item ID |
| `collapsed` | `boolean` | `false` | Collapse sidebar (v-model) |
| `floating` | `boolean` | `true` | Floating style with fixed position, rounded corners and shadow |
| `width` | `string` | `'240px'` | Expanded width |
| `collapsedWidth` | `string` | `'64px'` | Collapsed width |
| `side` | `'left' \| 'right'` | `'left'` | Which side the sidebar appears on |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `SidebarItem` | Emitted when an item is clicked |
| `update:collapsed` | `boolean` | Emitted when collapse state changes |

## Slots

| Slot | Description |
|------|-------------|
| `header` | Header content above navigation |
| `footer` | Footer content above collapse toggle |
| `icon-{id}` | Custom icon for specific item |
| `default` | Optional content area (when no items provided) |

## Types

```ts
interface SidebarItem {
  id: string
  label: string
  icon?: string
  to?: string
  href?: string
  children?: SidebarItem[]
  badge?: string | number
  disabled?: boolean
  defaultOpen?: boolean  // Whether collapsible section starts open (default: true)
}
```

## Collapsible Sections

Parent items with `children` render as collapsible sections using `CollapsibleCard`. By default sections start open. Set `defaultOpen: false` to start collapsed:

```ts
const items: SidebarItem[] = [
  {
    id: 'experiments',
    label: 'Experiments',
    defaultOpen: true,  // starts open (default)
    children: [
      { id: 'exp-list', label: 'All Experiments' },
      { id: 'exp-new', label: 'New Experiment' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis',
    defaultOpen: false,  // starts collapsed
    children: [
      { id: 'results', label: 'Results' },
      { id: 'reports', label: 'Reports' },
    ],
  },
]
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppSidebar, type SidebarItem } from '@morscherlab/mld-sdk'

const items: SidebarItem[] = [
  { id: 'home', label: 'Home', to: '/' },
  {
    id: 'experiments',
    label: 'Experiments',
    children: [
      { id: 'exp-list', label: 'All', to: '/experiments' },
      { id: 'exp-new', label: 'New', to: '/experiments/new' },
    ],
  },
  { id: 'settings', label: 'Settings', badge: 3 },
]

const activeItem = ref('home')
const isCollapsed = ref(false)
</script>

<template>
  <AppSidebar
    floating
    :items="items"
    :active-id="activeItem"
    v-model:collapsed="isCollapsed"
    @select="(item) => activeItem = item.id"
  >
    <template #header>
      <Logo />
    </template>
    <template #footer>
      <UserProfile />
    </template>
  </AppSidebar>
</template>
```
