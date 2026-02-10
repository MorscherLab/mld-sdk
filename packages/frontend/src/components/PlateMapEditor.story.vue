<script setup lang="ts">
import PlateMapEditor from './PlateMapEditor.vue'
import type { SampleType } from '../types'

const mockSamples: SampleType[] = [
  { id: 's1', name: 'HeLa Cells', color: '#3B82F6', count: 0 },
  { id: 's2', name: 'MCF-7 Cells', color: '#10B981', count: 0 },
  { id: 's3', name: 'Vehicle Control', color: '#F59E0B', count: 0 },
  { id: 's4', name: 'Blank', color: '#EF4444', count: 0 },
]

function initState() {
  return {
    format: 96 as const,
    maxPlates: 10,
    samples: mockSamples,
    showToolbar: true,
    showSidebar: true,
    allowAddPlates: true,
    allowAddSamples: true,
    size: 'md' as const,
  }
}
</script>

<template>
  <Story title="Lab/PlateMapEditor">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <PlateMapEditor
            :format="state.format"
            :max-plates="state.maxPlates"
            :samples="state.samples"
            :show-toolbar="state.showToolbar"
            :show-sidebar="state.showSidebar"
            :allow-add-plates="state.allowAddPlates"
            :allow-add-samples="state.allowAddSamples"
            :size="state.size"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstSelect
          v-model="state.format"
          title="Format"
          :options="[
            { value: 54, label: '54-well' },
            { value: 96, label: '96-well' },
          ]"
        />
        <HstSlider v-model="state.maxPlates" title="Max Plates" :min="1" :max="10" />
        <HstCheckbox v-model="state.showToolbar" title="Show Toolbar" />
        <HstCheckbox v-model="state.showSidebar" title="Show Sidebar" />
        <HstCheckbox v-model="state.allowAddPlates" title="Allow Add Plates" />
        <HstCheckbox v-model="state.allowAddSamples" title="Allow Add Samples" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' },
            { value: 'fill', label: 'Fill' },
          ]"
        />
      </template>
    </Variant>

    <Variant title="No Sidebar">
      <div style="padding: 2rem;">
        <PlateMapEditor
          :format="96"
          :samples="mockSamples"
          :show-sidebar="false"
        />
      </div>
    </Variant>

    <Variant title="Minimal (No Toolbar)">
      <div style="padding: 2rem;">
        <PlateMapEditor
          :format="96"
          :samples="mockSamples"
          :show-toolbar="false"
          :show-sidebar="false"
        />
      </div>
    </Variant>
  </Story>
</template>
