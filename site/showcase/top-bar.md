<script setup>
import TopBarDemo from '../.vitepress/showcase/TopBarDemo.vue'
</script>

# AppTopBar

A header component with logo, navigation breadcrumb, page dropdown, center tabs, and action slots. Supports floating and sticky modes, custom icons and logos, and tab navigation with dropdown options.

## Demo

<ClientOnly>
  <TopBarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Current page title |
| `subtitle` | `string` | - | Subtitle shown below title (only when no breadcrumb) |
| `homePath` | `string` | `'/'` | Path for icon/logo link. Set to empty string to disable. |
| `pluginName` | `string` | - | Plugin/app name for breadcrumb |
| `pages` | `TopBarPage[]` | - | Pages for dropdown navigation |
| `currentPageId` | `string` | - | ID of currently active page |
| `showLogo` | `boolean` | `true` | Show default logo |
| `sticky` | `boolean` | `true` | Make header sticky |
| `floating` | `boolean` | `true` | Floating card style (default) |
| `tabs` | `TopBarTab[]` | - | Tabs for center navigation |
| `currentTabId` | `string` | - | ID of currently active tab |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `page-select` | `TopBarPage` | Emitted when a page is selected from dropdown |
| `tab-select` | `TopBarTab` | Emitted when a tab without children is clicked |
| `tab-option-select` | `[TopBarTabOption, TopBarTab]` | Emitted when a tab dropdown option is selected |

## Slots

| Slot | Description |
|------|-------------|
| `icon` | Custom icon (takes precedence over logo) |
| `logo` | Custom logo area (fallback if no icon) |
| `nav` | Additional navigation items |
| `actions` | Right-side action buttons |

## Types

```ts
interface TopBarPage {
  id: string
  label: string
  to?: string
  href?: string
  icon?: string
  description?: string
  disabled?: boolean
}

interface TopBarTab {
  id: string
  label: string
  to?: string
  href?: string
  icon?: string
  disabled?: boolean
  children?: TopBarTabOption[]
}

interface TopBarTabOption {
  id: string
  label: string
  to?: string
  href?: string
  description?: string
  disabled?: boolean
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppTopBar, ThemeToggle, BaseButton, type TopBarPage } from '@morscherlab/mld-sdk'

const pages: TopBarPage[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview' },
  { id: 'settings', label: 'Settings', description: 'Preferences' },
]

const currentPage = ref('dashboard')
</script>

<template>
  <AppTopBar
    plugin-name="My Plugin"
    title="Dashboard"
    :pages="pages"
    :current-page-id="currentPage"
    @page-select="(p) => currentPage = p.id"
  >
    <template #actions>
      <ThemeToggle />
      <BaseButton size="sm">Save</BaseButton>
    </template>
  </AppTopBar>
</template>
```
