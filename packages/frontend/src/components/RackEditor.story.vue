<script setup lang="ts">
import RackEditor from './RackEditor.vue'
import type { Rack } from '../types'

const defaultRacks: Rack[] = [
  {
    id: 'rack-1',
    name: 'Rack 1',
    format: 96,
    slot: 'R',
    injectionVolume: 10,
    wells: {},
  },
  {
    id: 'rack-2',
    name: 'Rack 2',
    format: 54,
    slot: 'G',
    injectionVolume: 5,
    wells: {},
  },
]

function initState() {
  return {
    modelValue: defaultRacks.map(r => ({ ...r, wells: { ...r.wells } })),
    activeRackId: 'rack-1',
    maxRacks: 10,
    minRacks: 1,
    allowReorder: true,
    editable: true,
    readonly: false,
    wellPlateSize: 'md' as const,
    showLegend: true,
    showBadges: true,
  }
}
</script>

<template>
  <Story title="Lab/RackEditor">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <RackEditor
            v-model="state.modelValue"
            v-model:active-rack-id="state.activeRackId"
            :max-racks="state.maxRacks"
            :min-racks="state.minRacks"
            :allow-reorder="state.allowReorder"
            :editable="state.editable"
            :readonly="state.readonly"
            :well-plate-size="state.wellPlateSize"
            :show-legend="state.showLegend"
            :show-badges="state.showBadges"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstSlider v-model="state.maxRacks" title="Max Racks" :min="1" :max="20" />
        <HstSlider v-model="state.minRacks" title="Min Racks" :min="0" :max="5" />
        <HstCheckbox v-model="state.allowReorder" title="Allow Reorder" />
        <HstCheckbox v-model="state.editable" title="Editable" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstSelect
          v-model="state.wellPlateSize"
          title="Well Plate Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'xl', label: 'Extra Large' },
            { value: 'fill', label: 'Fill' },
          ]"
        />
        <HstCheckbox v-model="state.showLegend" title="Show Legend" />
        <HstCheckbox v-model="state.showBadges" title="Show Badges" />
      </template>
    </Variant>

    <Variant title="Single Rack">
      <div style="padding: 2rem;">
        <RackEditor
          :model-value="[{ id: 'rack-1', name: 'Sample Rack', format: 96, slot: 'R', injectionVolume: 10, wells: {} }]"
          :min-racks="1"
          :max-racks="1"
        />
      </div>
    </Variant>

    <Variant title="Readonly">
      <div style="padding: 2rem;">
        <RackEditor
          :model-value="defaultRacks"
          readonly
        />
      </div>
    </Variant>
  </Story>
</template>
