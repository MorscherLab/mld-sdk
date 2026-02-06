<script setup lang="ts">
import { ref, computed } from 'vue'
import { WellPlate, BaseSelect, BaseToggle, type WellPlateFormat, type Well, type WellEditData } from '@morscherlab/mld-sdk'

const selectedWells = ref<string[]>([])
const format = ref<WellPlateFormat>(96)
const selectionMode = ref<'none' | 'single' | 'multiple' | 'rectangle'>('rectangle')
const showLabels = ref(true)
const showWellIds = ref(false)
const showSampleTypeIndicator = ref(true)
const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'fill'>('md')
const zoom = ref(1)
const heatmapEnabled = ref(false)

const formatOptions = [
  { value: 6, label: '6-well' },
  { value: 12, label: '12-well' },
  { value: 24, label: '24-well' },
  { value: 48, label: '48-well' },
  { value: 54, label: '54-well' },
  { value: 96, label: '96-well' },
  { value: 384, label: '384-well' },
]

const selectionModeOptions = [
  { value: 'none', label: 'None' },
  { value: 'single', label: 'Single' },
  { value: 'multiple', label: 'Multiple' },
  { value: 'rectangle', label: 'Rectangle (drag)' },
  { value: 'drag', label: 'Drag (move wells)' },
]

const wellShapeOptions = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
]

const wellShape = ref<'circle' | 'rounded'>('rounded')

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: 'fill', label: 'Fill Container' },
]

const sampleColors = {
  control: '#3B82F6',
  treatment: '#10B981',
  blank: '#6B7280',
}

// Wells data for heatmap visualization examples (always has values)
const heatmapWells = computed<Record<string, Partial<Well>>>(() => {
  const wells: Record<string, Partial<Well>> = {}
  const rows = 4
  const cols = 6
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${String.fromCharCode(65 + r)}${c + 1}`
      // Generate consistent heatmap values based on position
      wells[id] = {
        state: 'filled',
        value: (r * cols + c) / (rows * cols - 1),
      }
    }
  }
  return wells
})

const demoWells = computed<Record<string, Partial<Well>>>(() => {
  const wells: Record<string, Partial<Well>> = {}

  if (format.value >= 24) {
    wells['A1'] = { sampleType: 'control', state: 'filled' }
    wells['A2'] = { sampleType: 'control', state: 'filled' }
    wells['B1'] = { sampleType: 'treatment', state: 'filled' }
    wells['B2'] = { sampleType: 'treatment', state: 'filled' }
    wells['C1'] = { sampleType: 'blank', state: 'filled' }
  }

  if (heatmapEnabled.value) {
    const rows = format.value <= 12 ? 3 : format.value <= 48 ? 6 : 8
    const cols = format.value <= 6 ? 3 : format.value <= 24 ? 6 : 12
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = `${String.fromCharCode(65 + r)}${c + 1}`
        wells[id] = {
          state: 'filled',
          value: Math.random(),
        }
      }
    }
  }

  return wells
})

const heatmapConfig = computed(() => ({
  enabled: heatmapEnabled.value,
  min: 0,
  max: 1,
  colorScale: 'viridis' as const,
  showLegend: true,
}))

function handleWellClick(wellId: string) {
  console.log('Well clicked:', wellId)
}

function handleContextMenu(wellId: string) {
  console.log('Context menu on:', wellId)
}

function handleWellMove(sourceId: string, targetId: string) {
  console.log('Well moved:', sourceId, '->', targetId)
  // Update dragDemoWells to show the move
  const sourceWell = dragDemoWells.value[sourceId]
  if (sourceWell) {
    dragDemoWells.value[targetId] = { ...sourceWell }
    delete dragDemoWells.value[sourceId]
  }
}

// Separate wells data for Drag Mode demo (so it can be updated)
const dragDemoWells = ref<Record<string, Partial<Well>>>({
  'A1': { sampleType: 'control', state: 'filled' },
  'A2': { sampleType: 'control', state: 'filled' },
  'B1': { sampleType: 'treatment', state: 'filled' },
  'B2': { sampleType: 'treatment', state: 'filled' },
  'C1': { sampleType: 'blank', state: 'filled' },
})

// Editable wells data for Editing Mode demo
const editableWells = ref<Record<string, Partial<Well>>>({
  'A1': { state: 'filled', sampleType: 'sample', metadata: { label: 'S001', injectionVolume: 5, injectionCount: 1 } },
  'A2': { state: 'filled', sampleType: 'sample', metadata: { label: 'S002', injectionVolume: 5, injectionCount: 2 } },
  'B1': { state: 'filled', sampleType: 'blank', metadata: { label: 'BLK1', injectionVolume: 5, injectionCount: 1 } },
  'C1': { state: 'filled', sampleType: 'qc', metadata: { label: 'QC01', injectionVolume: 3, injectionCount: 1, customMethod: 'QC_Short' } },
})

function handleWellEdit(wellId: string, data: WellEditData) {
  console.log('Well edited:', wellId, data)
  editableWells.value[wellId] = {
    state: data.label ? 'filled' : 'empty',
    sampleType: data.sampleType || undefined,
    metadata: {
      label: data.label,
      injectionVolume: data.injectionVolume,
      injectionCount: data.injectionCount,
      customMethod: data.customMethod || null,
    },
  }
}

function handleWellEditClear(wellId: string) {
  console.log('Well cleared:', wellId)
  delete editableWells.value[wellId]
}
</script>

<template>
  <!-- Controls -->
  <div class="demo-section">
    <h3>Interactive Demo</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
      <div>
        <label class="block text-sm text-text-secondary mb-1">Format</label>
        <BaseSelect v-model="format" :options="formatOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Selection Mode</label>
        <BaseSelect v-model="selectionMode" :options="selectionModeOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Size</label>
        <BaseSelect v-model="size" :options="sizeOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Well Shape</label>
        <BaseSelect v-model="wellShape" :options="wellShapeOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Zoom</label>
        <input
          v-model.number="zoom"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          class="w-full"
        />
        <span class="text-xs text-text-muted">{{ zoom.toFixed(1) }}x</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showLabels" size="sm" />
        <span class="text-sm text-text-secondary">Show Labels</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showWellIds" size="sm" />
        <span class="text-sm text-text-secondary">Show Well IDs</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="heatmapEnabled" size="sm" />
        <span class="text-sm text-text-secondary">Heatmap Mode</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showSampleTypeIndicator" size="sm" />
        <span class="text-sm text-text-secondary">Show Type (S/B/Q)</span>
      </div>
    </div>

    <div :class="size === 'fill' ? 'w-full' : 'overflow-auto'">
      <WellPlate
        v-model="selectedWells"
        :format="format"
        :wells="demoWells"
        :selection-mode="selectionMode"
        :show-labels="showLabels"
        :show-well-ids="showWellIds"
        :show-sample-type-indicator="showSampleTypeIndicator"
        :heatmap="heatmapConfig"
        :sample-colors="sampleColors"
        :zoom="zoom"
        :size="size"
        :well-shape="wellShape"
        @well-click="handleWellClick"
        @context-menu="handleContextMenu"
        @well-move="handleWellMove"
      />
    </div>

    <div v-if="selectedWells.length > 0" class="mt-4 p-3 bg-bg-secondary rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>Selected:</strong> {{ selectedWells.join(', ') }}
      </p>
    </div>
  </div>

  <!-- Formats -->
  <div class="demo-section">
    <h3>Plate Formats</h3>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="f in [6, 12, 24, 48, 54, 96] as WellPlateFormat[]" :key="f" class="text-center">
        <p class="text-sm text-text-muted mb-2">{{ f }}-well</p>
        <WellPlate :format="f" size="sm" selection-mode="none" />
      </div>
    </div>
  </div>

  <!-- Fill Container Example -->
  <div class="demo-section">
    <h3>Fill Container Mode</h3>
    <p class="text-sm text-text-secondary mb-4">
      Use <code>size="fill"</code> to make the plate expand to fill its parent container width.
    </p>
    <div class="w-full max-w-lg p-4 bg-bg-secondary rounded-lg border border-border">
      <WellPlate
        :format="24"
        :wells="demoWells"
        selection-mode="none"
        size="fill"
        show-sample-type-indicator
      />
    </div>
  </div>

  <!-- Heatmap Example -->
  <div class="demo-section">
    <h3>Heatmap Visualization</h3>
    <p class="text-sm text-text-secondary mb-4">
      Display numeric data as colors using different color scales.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p class="text-sm text-text-muted mb-2">Viridis</p>
        <WellPlate
          :format="24"
          :wells="heatmapWells"
          :heatmap="{ enabled: true, colorScale: 'viridis', showLegend: true }"
          selection-mode="none"
          size="sm"
        />
      </div>
      <div>
        <p class="text-sm text-text-muted mb-2">Plasma</p>
        <WellPlate
          :format="24"
          :wells="heatmapWells"
          :heatmap="{ enabled: true, colorScale: 'plasma', showLegend: true }"
          selection-mode="none"
          size="sm"
        />
      </div>
    </div>
  </div>

  <!-- Drag Mode Section -->
  <div class="demo-section">
    <h3>Drag Mode</h3>
    <p class="text-sm text-text-secondary mb-4">
      Use <code>selectionMode="drag"</code> to enable drag-and-drop for moving well contents.
      Only wells with assigned sample types can be dragged.
    </p>
    <WellPlate
      :format="24"
      :wells="dragDemoWells"
      selection-mode="drag"
      :sample-colors="sampleColors"
      size="md"
      well-shape="circle"
      show-sample-type-indicator
      @well-move="handleWellMove"
    />
    <p class="text-xs text-text-muted mt-2">
      Drag filled wells (colored) to empty wells to move their content.
    </p>
  </div>

  <!-- Editing Mode Section -->
  <div class="demo-section">
    <h3>Editing Mode</h3>
    <p class="text-sm text-text-secondary mb-4">
      Use <code>editable</code> to enable click-to-edit. Click any well to open the edit popup
      where you can set sample name, type, injection volume, and more.
    </p>
    <WellPlate
      :format="54"
      :wells="editableWells"
      :editable="true"
      :show-well-labels="true"
      :show-badges="true"
      :show-legend="true"
      :show-sample-type-indicator="true"
      size="md"
      @well-edit="handleWellEdit"
      @well-clear="handleWellEditClear"
    />
    <p class="text-xs text-text-muted mt-2">
      Click any well to edit. Labels, badges, and legend are enabled.
    </p>
  </div>
</template>
