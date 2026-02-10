<script setup>
import SidebarDemo from '../.vitepress/showcase/SidebarDemo.vue'
</script>

# AppSidebar

A context-sensitive tool panel sidebar that displays sections relevant to the active view. Sections are defined via the `panels` config (a map of view IDs to section arrays) and rendered as CollapsibleCard components. Actual controls are provided through named slots (`#section-{id}`). When the active view has no matching panels, the sidebar hides entirely.

## Demo

<ClientOnly>
  <SidebarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `panels` | `Record<string, SidebarToolSection[]>` | `{}` | Map of view IDs to their tool sections |
| `activeView` | `string` | `''` | Which view's panels to display |
| `floating` | `boolean` | `true` | Floating style with absolute positioning, border, and shadow |
| `width` | `string` | `'280px'` | Width when visible |
| `side` | `'left' \| 'right'` | `'left'` | Position sidebar on left or right side |
| `toggleState` | `Record<string, boolean>` | `{}` | Toggle state map: sectionId to boolean |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:toggle` | `[sectionId: string, value: boolean]` | Emitted when a section toggle is clicked |

## Slots

| Slot | Description |
|------|-------------|
| `#section-{id}` | Content for a specific tool section (rendered inside CollapsibleCard) |
| `#header` | Header content above sections (pinned) |
| `#footer` | Footer content below sections (pinned) |

## Types

```ts
interface SidebarToolSection {
  id: string
  label: string
  subtitle?: string
  icon?: string | string[]
  iconColor?: string
  iconBg?: string
  defaultOpen?: boolean
  showToggle?: boolean
}
```

## Behavior

- Each section renders as a `CollapsibleCard` with card styling (border, shadow, white background)
- Icon badges are square with rounded corners, using `iconColor` and `iconBg` for theming
- When `activeView` changes, the sidebar displays the sections mapped to that view
- When the active view has no matching panels (or is empty), the sidebar hides entirely
- The sections area is scrollable; header and footer slots are pinned at the top and bottom
- Sections with `showToggle: true` display an inline toggle switch in the header
- Toggle state is managed externally via the `toggleState` prop and `update:toggle` event

## Usage

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  AppSidebar,
  BaseSlider,
  BaseSelect,
  BaseToggle,
  BaseButton,
  FileUploader,
  type SidebarToolSection,
} from '@morscherlab/mld-sdk'

// Icon paths (Lucide-style SVG path data)
const icons = {
  upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  settings: [
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  ],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3'],
  eye: [
    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  ],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
}

// Define panels for each view
const panels: Record<string, SidebarToolSection[]> = {
  analysis: [
    {
      id: 'parameters',
      label: 'Parameters',
      subtitle: 'Analysis settings',
      icon: icons.settings,
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
    },
    {
      id: 'filters',
      label: 'Filters',
      subtitle: 'Refine results',
      icon: icons.filter,
      iconColor: '#0ea5e9',
      iconBg: '#e0f2fe',
      defaultOpen: false,
    },
  ],
  results: [
    {
      id: 'display',
      label: 'Display Options',
      subtitle: 'Chart and table settings',
      icon: icons.eye,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
    },
    {
      id: 'export',
      label: 'Export',
      subtitle: 'Download data',
      icon: icons.download,
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      showToggle: true,
      defaultOpen: false,
    },
  ],
}

const activeView = ref('analysis')
const threshold = ref(50)
const method = ref('linear')
const showOutliers = ref(true)
const logScale = ref(false)
const toggleState = reactive<Record<string, boolean>>({ export: false })
</script>

<template>
  <AppSidebar
    :panels="panels"
    :active-view="activeView"
    :toggle-state="toggleState"
    floating
    width="300px"
    @update:toggle="(id, val) => toggleState[id] = val"
  >
    <template #header>
      <span style="font-weight: 600;">Analysis Tools</span>
    </template>

    <template #section-parameters>
      <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
      <BaseSelect
        v-model="method"
        label="Method"
        :options="[
          { value: 'linear', label: 'Linear' },
          { value: 'quadratic', label: 'Quadratic' },
        ]"
      />
    </template>

    <template #section-filters>
      <BaseToggle v-model="showOutliers" label="Exclude outliers" />
    </template>

    <template #section-display>
      <BaseToggle v-model="showOutliers" label="Show outliers" />
      <BaseToggle v-model="logScale" label="Log scale" />
    </template>

    <template #section-export>
      <BaseButton size="sm" variant="secondary">Export CSV</BaseButton>
      <BaseButton size="sm" variant="secondary">Export PNG</BaseButton>
    </template>

    <template #footer>
      <BaseButton size="sm" variant="ghost" style="width: 100%;">
        Reset Defaults
      </BaseButton>
    </template>
  </AppSidebar>
</template>
```
