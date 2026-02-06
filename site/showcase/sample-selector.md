<script setup>
import SampleSelectorDemo from '../.vitepress/showcase/SampleSelectorDemo.vue'
</script>

# SampleSelector

A hierarchical sample grouping component for scientific workflows. Features three-level grouping (Major Groups > Sub Groups > Samples), auto-grouping by naming patterns, and CSV metadata import.

## Demo

<ClientOnly>
  <SampleSelectorDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `samples` | `string[]` | Required | Available sample names |
| `modelValue` | `string[]` | Required | Selected samples (v-model) |
| `groups` | `SampleGroup[]` | `[]` | Pre-defined groups (v-model:groups) |
| `enableGrouping` | `boolean` | `true` | Show grouping controls |
| `enableAutoGroup` | `boolean` | `true` | Show auto-group button |
| `enableMetadataGroup` | `boolean` | `true` | Show metadata upload button |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string[]` | Emitted when selection changes |
| `update:groups` | `SampleGroup[]` | Emitted when groups change |
| `autoGroup` | `number` | Emitted when auto-group is triggered (with level) |
| `metadataGroup` | `Record<string, string[]>` | Emitted when metadata grouping is applied |

## Types

```typescript
interface SampleGroup {
  name: string      // Group display name
  color: string     // Hex color for group badge
  samples: string[] // Sample names in this group
}
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SampleSelector, type SampleGroup } from '@morscherlab/mld-sdk'

const samples = [
  'Project/Experiment1/Sample_001',
  'Project/Experiment1/Sample_002',
  'Project/Experiment2/Sample_001',
]
const selected = ref<string[]>([])
const groups = ref<SampleGroup[]>([])

function handleAutoGroup(level: number) {
  // Parse sample names by path separator
  const prefixGroups: Record<string, string[]> = {}
  samples.forEach(sample => {
    const parts = sample.split('/')
    const prefix = parts.slice(0, level).join('/')
    if (!prefixGroups[prefix]) prefixGroups[prefix] = []
    prefixGroups[prefix].push(sample)
  })

  groups.value = Object.entries(prefixGroups).map(
    ([name, samples], i) => ({
      name,
      color: ['#3B82F6', '#10B981', '#F59E0B'][i % 3],
      samples,
    })
  )
}
</script>

<template>
  <SampleSelector
    :samples="samples"
    v-model="selected"
    v-model:groups="groups"
    @auto-group="handleAutoGroup"
  />
</template>
```
