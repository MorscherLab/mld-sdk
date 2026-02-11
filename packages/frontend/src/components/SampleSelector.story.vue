<script setup lang="ts">
import SampleSelector from './SampleSelector.vue'
import type { SampleGroup } from '../types'

const mockSamples = [
  'Control_Rep1', 'Control_Rep2', 'Control_Rep3',
  'Treatment_Low_Rep1', 'Treatment_Low_Rep2', 'Treatment_Low_Rep3',
  'Treatment_High_Rep1', 'Treatment_High_Rep2', 'Treatment_High_Rep3',
  'Vehicle_Rep1', 'Vehicle_Rep2', 'Vehicle_Rep3',
]

const mockGroups: SampleGroup[] = [
  { name: 'Control', color: '#3B82F6', samples: ['Control_Rep1', 'Control_Rep2', 'Control_Rep3'] },
  { name: 'Treatment_Low', color: '#10B981', samples: ['Treatment_Low_Rep1', 'Treatment_Low_Rep2', 'Treatment_Low_Rep3'] },
  { name: 'Treatment_High', color: '#EF4444', samples: ['Treatment_High_Rep1', 'Treatment_High_Rep2', 'Treatment_High_Rep3'] },
  { name: 'Vehicle', color: '#F59E0B', samples: ['Vehicle_Rep1', 'Vehicle_Rep2', 'Vehicle_Rep3'] },
]

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
]

function initState() {
  return {
    samples: mockSamples,
    selected: [] as string[],
    groups: [] as SampleGroup[],
    enableGrouping: true,
    enableAutoGroup: true,
    enableMetadataGroup: true,
  }
}

function handleAutoGroup(level: number, state: { samples: string[]; groups: SampleGroup[] }) {
  const prefixGroups: Record<string, string[]> = {}

  for (const sample of state.samples) {
    const parts = sample.split(/[_\-.]/)
    const prefix = parts.slice(0, level).join('_')
    if (!prefixGroups[prefix]) {
      prefixGroups[prefix] = []
    }
    prefixGroups[prefix].push(sample)
  }

  state.groups = Object.entries(prefixGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, samples], i) => ({
      name,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      samples,
    }))
}
</script>

<template>
  <Story title="Lab/SampleSelector">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px;">
          <SampleSelector
            v-model="state.selected"
            v-model:groups="state.groups"
            :samples="state.samples"
            :enable-grouping="state.enableGrouping"
            :enable-auto-group="state.enableAutoGroup"
            :enable-metadata-group="state.enableMetadataGroup"
            @auto-group="(level: number) => handleAutoGroup(level, state)"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.enableGrouping" title="Enable Grouping" />
        <HstCheckbox v-model="state.enableAutoGroup" title="Enable Auto Group" />
        <HstCheckbox v-model="state.enableMetadataGroup" title="Enable Metadata Group" />
      </template>
    </Variant>

    <Variant title="With Pre-defined Groups">
      <div style="padding: 2rem; max-width: 400px;">
        <SampleSelector
          :model-value="['Control_Rep1', 'Treatment_Low_Rep1']"
          :samples="mockSamples"
          :groups="mockGroups"
        />
      </div>
    </Variant>

    <Variant title="No Grouping">
      <div style="padding: 2rem; max-width: 400px;">
        <SampleSelector
          :model-value="[]"
          :samples="mockSamples"
          :enable-grouping="false"
        />
      </div>
    </Variant>
  </Story>
</template>
