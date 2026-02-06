<script setup>
import GroupAssignerDemo from '../.vitepress/showcase/GroupAssignerDemo.vue'
</script>

# GroupAssigner

A drag-and-drop component for assigning groups to two categories. Ideal for statistical comparisons like volcano plots (Control vs Treatment).

## Demo

<ClientOnly>
  <GroupAssignerDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `groups` | `GroupItem[]` | Required | All available groups |
| `group1` | `string[]` | Required | Groups in zone 1 (v-model:group1) |
| `group2` | `string[]` | Required | Groups in zone 2 (v-model:group2) |
| `label1` | `string` | `'Control'` | Zone 1 label |
| `label2` | `string` | `'Treatment'` | Zone 2 label |
| `color1` | `string` | `'#3B82F6'` | Zone 1 accent color |
| `color2` | `string` | `'#F43F5E'` | Zone 2 accent color |
| `minPerGroup` | `number` | `1` | Minimum groups required per zone |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:group1` | `string[]` | Emitted when zone 1 groups change |
| `update:group2` | `string[]` | Emitted when zone 2 groups change |

## Types

```typescript
interface GroupItem {
  name: string   // Group name (used as identifier)
  color: string  // Hex color for the group pill
  count: number  // Sample count (displayed in badge)
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { GroupAssigner, type GroupItem } from '@morscherlab/mld-sdk'

const groups = ref<GroupItem[]>([
  { name: 'Control', color: '#6B7280', count: 3 },
  { name: 'Treatment A', color: '#3B82F6', count: 4 },
  { name: 'Treatment B', color: '#10B981', count: 4 },
])

const control = ref<string[]>(['Control'])
const treatment = ref<string[]>([])
</script>

<template>
  <GroupAssigner
    :groups="groups"
    v-model:group1="control"
    v-model:group2="treatment"
    label1="Control"
    label2="Treatment"
    :min-per-group="1"
  />
</template>
```
