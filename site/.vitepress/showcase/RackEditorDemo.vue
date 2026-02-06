<script setup lang="ts">
import { ref, computed } from 'vue'
import { RackEditor, BaseSelect, BaseToggle, type Rack, type WellPlateSize } from '@morscherlab/mld-sdk'

const racks = ref<Rack[]>([])
const activeRackId = ref<string>('')
const editable = ref(true)
const readonly_ = ref(false)
const showLegend = ref(true)
const showBadges = ref(true)
const allowReorder = ref(true)
const maxRacks = ref(10)
const size = ref<WellPlateSize>('md')

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: 'fill', label: 'Fill Container' },
]

const maxRacksOptions = [
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
]

function handleRackAdd(rack: Rack) {
  console.log('Rack added:', rack.name, rack.slot)
}

function handleRackRemove(rackId: string) {
  console.log('Rack removed:', rackId)
}

function handleRackReorder(rackIds: string[]) {
  console.log('Racks reordered:', rackIds)
}

function handleWellEdit(rackId: string, wellId: string, data: unknown) {
  console.log('Well edited:', rackId, wellId, data)
}

const totalSamples = computed(() => {
  let count = 0
  for (const rack of racks.value) {
    count += Object.keys(rack.wells).length
  }
  return count
})
</script>

<template>
  <!-- Interactive Demo -->
  <div class="demo-section">
    <h3>Interactive Demo</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
      <div>
        <label class="block text-sm text-text-secondary mb-1">Plate Size</label>
        <BaseSelect v-model="size" :options="sizeOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Max Racks</label>
        <BaseSelect v-model="maxRacks" :options="maxRacksOptions" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="editable" size="sm" />
        <span class="text-sm text-text-secondary">Editable</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showLegend" size="sm" />
        <span class="text-sm text-text-secondary">Legend</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showBadges" size="sm" />
        <span class="text-sm text-text-secondary">Badges</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="allowReorder" size="sm" />
        <span class="text-sm text-text-secondary">Reorder</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="readonly_" size="sm" />
        <span class="text-sm text-text-secondary">Readonly</span>
      </div>
    </div>

    <RackEditor
      v-model="racks"
      v-model:active-rack-id="activeRackId"
      :editable="editable"
      :readonly="readonly_"
      :show-legend="showLegend"
      :show-badges="showBadges"
      :allow-reorder="allowReorder"
      :max-racks="maxRacks"
      :well-plate-size="size"
      @rack-add="handleRackAdd"
      @rack-remove="handleRackRemove"
      @rack-reorder="handleRackReorder"
      @well-edit="handleWellEdit"
    />

    <div v-if="totalSamples > 0" class="mt-4 p-3 bg-bg-secondary rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>Total samples:</strong> {{ totalSamples }} across {{ racks.length }} rack(s)
      </p>
    </div>
  </div>

  <!-- Workflow Description -->
  <div class="demo-section">
    <h3>Workflow</h3>
    <div class="space-y-3 text-sm text-text-secondary">
      <p><strong>1. Add Racks</strong> -- Click "Add Rack" to create new racks. Slot colors (R/G/B/Y) cycle automatically.</p>
      <p><strong>2. Configure</strong> -- Select plate format (54 or 96) and slot position from the toolbar.</p>
      <p><strong>3. Edit Wells</strong> -- Click any well to open the edit popup. Set sample name, type, injection volume, and more.</p>
      <p><strong>4. Fill Series</strong> -- Click "Fill Series" to auto-populate empty wells with sequential sample names (S001, S002...).</p>
      <p><strong>5. Reorder</strong> -- Drag rack tabs to rearrange the order.</p>
    </div>
  </div>
</template>
