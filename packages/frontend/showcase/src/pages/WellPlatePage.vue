<script setup lang="ts">
import { ref, computed } from 'vue'
import { WellPlate, BaseSelect, BaseToggle, type WellPlateFormat, type Well } from '@morscherlab/mld-sdk'

const selectedWells = ref<string[]>([])
const format = ref<WellPlateFormat>(96)
const selectionMode = ref<'none' | 'single' | 'multiple' | 'rectangle'>('rectangle')
const showLabels = ref(true)
const showWellIds = ref(false)
const showSampleTypeIndicator = ref(true)
const size = ref<'sm' | 'md' | 'lg'>('md')
const zoom = ref(1)
const heatmapEnabled = ref(false)
const fillContainer = ref(false)

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
]

const sampleColors = {
  control: '#3B82F6',
  treatment: '#10B981',
  blank: '#6B7280',
}

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
</script>

<template>
  <div class="max-w-5xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">WellPlate</h1>
    <p class="text-text-secondary mb-8">
      Interactive microplate display component supporting 6 to 384-well formats with multiple selection modes.
    </p>

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
        <div class="flex items-center gap-2">
          <BaseToggle v-model="fillContainer" size="sm" />
          <span class="text-sm text-text-secondary">Fill Container</span>
        </div>
      </div>

      <div :class="fillContainer ? 'w-full max-w-2xl' : 'overflow-auto'">
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
          :fill-container="fillContainer"
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
        Use <code>fillContainer</code> to make the plate expand to fill its parent container width.
      </p>
      <div class="w-full max-w-lg p-4 bg-bg-secondary rounded-lg border border-border">
        <WellPlate
          :format="24"
          :wells="demoWells"
          selection-mode="none"
          fill-container
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
            :wells="demoWells"
            :heatmap="{ enabled: true, colorScale: 'viridis', showLegend: true }"
            selection-mode="none"
            size="sm"
          />
        </div>
        <div>
          <p class="text-sm text-text-muted mb-2">Plasma</p>
          <WellPlate
            :format="24"
            :wells="demoWells"
            :heatmap="{ enabled: true, colorScale: 'plasma', showLegend: true }"
            selection-mode="none"
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>string[]</code></td>
            <td><code>[]</code></td>
            <td>Selected well IDs (v-model)</td>
          </tr>
          <tr>
            <td><code>format</code></td>
            <td><code>6 | 12 | 24 | 48 | 54 | 96 | 384</code></td>
            <td><code>96</code></td>
            <td>Plate format</td>
          </tr>
          <tr>
            <td><code>wells</code></td>
            <td><code>Record&lt;string, Partial&lt;Well&gt;&gt;</code></td>
            <td><code>{}</code></td>
            <td>Well data by ID</td>
          </tr>
          <tr>
            <td><code>selectionMode</code></td>
            <td><code>'none' | 'single' | 'multiple' | 'rectangle' | 'drag'</code></td>
            <td><code>'multiple'</code></td>
            <td>Selection behavior. 'drag' mode allows moving well contents.</td>
          </tr>
          <tr>
            <td><code>showLabels</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show row/column labels</td>
          </tr>
          <tr>
            <td><code>heatmap</code></td>
            <td><code>HeatmapConfig</code></td>
            <td><code>{ enabled: false }</code></td>
            <td>Heatmap visualization settings</td>
          </tr>
          <tr>
            <td><code>sampleColors</code></td>
            <td><code>Record&lt;string, string&gt;</code></td>
            <td><code>{}</code></td>
            <td>Color mapping for sample types</td>
          </tr>
          <tr>
            <td><code>zoom</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Zoom level (0.5 - 2.0)</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Well size preset</td>
          </tr>
          <tr>
            <td><code>fillContainer</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Make plate fill parent container width</td>
          </tr>
          <tr>
            <td><code>showSampleTypeIndicator</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show sample type letter (S/B/Q/C) in wells</td>
          </tr>
          <tr>
            <td><code>wellShape</code></td>
            <td><code>'circle' | 'rounded'</code></td>
            <td><code>'rounded'</code></td>
            <td>Shape of well elements</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>string[]</code></td>
            <td>Emitted when selection changes</td>
          </tr>
          <tr>
            <td><code>well-click</code></td>
            <td><code>wellId, event</code></td>
            <td>Single well clicked</td>
          </tr>
          <tr>
            <td><code>well-hover</code></td>
            <td><code>wellId | null, event</code></td>
            <td>Mouse enters/leaves a well</td>
          </tr>
          <tr>
            <td><code>selection-change</code></td>
            <td><code>string[]</code></td>
            <td>Selection completed (after drag)</td>
          </tr>
          <tr>
            <td><code>context-menu</code></td>
            <td><code>wellId, event</code></td>
            <td>Right-click on a well</td>
          </tr>
          <tr>
            <td><code>well-move</code></td>
            <td><code>sourceWellId, targetWellId</code></td>
            <td>Well content dragged to another well (drag mode only)</td>
          </tr>
        </tbody>
      </table>
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

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;WellPlate
  v-model="selectedWells"
  :format="96"
  :wells="wellData"
  :sample-colors="{ control: '#3B82F6', treatment: '#10B981' }"
  selection-mode="rectangle"
  @well-click="handleClick"
/&gt;</pre>
    </div>
  </div>
</template>
