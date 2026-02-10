<script setup lang="ts">
import SampleLegend from './SampleLegend.vue'
import type { SampleType } from '../types'

const mockSamples: SampleType[] = [
  { id: 's1', name: 'HeLa Cells', color: '#3B82F6', count: 24 },
  { id: 's2', name: 'MCF-7 Cells', color: '#10B981', count: 12 },
  { id: 's3', name: 'Vehicle Control', color: '#F59E0B', count: 8 },
  { id: 's4', name: 'Positive Control', color: '#EF4444', count: 4 },
  { id: 's5', name: 'QC Standard', color: '#8B5CF6', count: 6 },
]

function initState() {
  return {
    modelValue: undefined as string | undefined,
    samples: mockSamples,
    showCounts: true,
    editable: false,
    size: 'md' as const,
    orientation: 'vertical' as const,
  }
}
</script>

<template>
  <Story title="Lab/SampleLegend">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 300px;">
          <SampleLegend
            v-model="state.modelValue"
            :samples="state.samples"
            :show-counts="state.showCounts"
            :editable="state.editable"
            :size="state.size"
            :orientation="state.orientation"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.showCounts" title="Show Counts" />
        <HstCheckbox v-model="state.editable" title="Editable" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
        <HstSelect
          v-model="state.orientation"
          title="Orientation"
          :options="[
            { value: 'vertical', label: 'Vertical' },
            { value: 'horizontal', label: 'Horizontal' },
          ]"
        />
      </template>
    </Variant>

    <Variant title="Horizontal">
      <div style="padding: 2rem;">
        <SampleLegend
          :samples="mockSamples"
          orientation="horizontal"
        />
      </div>
    </Variant>

    <Variant title="Editable">
      <div style="padding: 2rem; max-width: 300px;">
        <SampleLegend
          :samples="mockSamples"
          editable
        />
      </div>
    </Variant>

    <Variant title="Small No Counts">
      <div style="padding: 2rem; max-width: 250px;">
        <SampleLegend
          :samples="mockSamples"
          size="sm"
          :show-counts="false"
        />
      </div>
    </Variant>
  </Story>
</template>
