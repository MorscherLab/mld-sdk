<script setup lang="ts">
import { ref } from 'vue'
import WellPlate from './WellPlate.vue'
import type { WellPlateFormat, WellPlateSelectionMode, WellPlateSize, WellShape, Well } from '../types'

const formats: WellPlateFormat[] = [6, 12, 24, 48, 96, 384]
const selectionModes: WellPlateSelectionMode[] = ['none', 'single', 'multiple', 'rectangle']
const sizes: WellPlateSize[] = ['sm', 'md', 'lg', 'xl']
const shapes: WellShape[] = ['rounded', 'circle']

const selectedWells = ref<string[]>([])

const PLATE_CONFIGS: Record<WellPlateFormat, { rows: number; cols: number }> = {
  6: { rows: 2, cols: 3 },
  12: { rows: 3, cols: 4 },
  24: { rows: 4, cols: 6 },
  48: { rows: 6, cols: 8 },
  54: { rows: 6, cols: 9 },
  96: { rows: 8, cols: 12 },
  384: { rows: 16, cols: 24 },
}

function generateMockWells(format: WellPlateFormat): Record<string, Partial<Well>> {
  const config = PLATE_CONFIGS[format]
  const wells: Record<string, Partial<Well>> = {}
  const sampleTypes = ['sample', 'control', 'blank', 'qc']

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const id = `${String.fromCharCode(65 + row)}${col + 1}`
      if (Math.random() > 0.3) {
        wells[id] = {
          state: 'filled',
          sampleType: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
          value: Math.random() * 100,
        }
      }
    }
  }
  return wells
}

function generateHeatmapWells(format: WellPlateFormat): Record<string, Partial<Well>> {
  const config = PLATE_CONFIGS[format]
  const wells: Record<string, Partial<Well>> = {}

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      const id = `${String.fromCharCode(65 + row)}${col + 1}`
      const distance = Math.sqrt(
        Math.pow(row - config.rows / 2, 2) + Math.pow(col - config.cols / 2, 2)
      )
      const maxDist = Math.sqrt(Math.pow(config.rows / 2, 2) + Math.pow(config.cols / 2, 2))
      wells[id] = {
        state: 'filled',
        value: 1 - distance / maxDist,
      }
    }
  }
  return wells
}

const mockWells96 = generateMockWells(96)
const heatmapWells = generateHeatmapWells(96)
const mockWells6 = generateMockWells(6)

const rectSelected = ref<string[]>([])
</script>

<template>
  <Story title="Lab/WellPlate">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <WellPlate
            v-model="selectedWells"
            :format="state.format"
            :wells="generateMockWells(state.format)"
            :selection-mode="state.selectionMode"
            :size="state.size"
            :well-shape="state.wellShape"
            :show-labels="state.showLabels"
            :show-well-ids="state.showWellIds"
            :show-sample-type-indicator="state.showSampleTypeIndicator"
            :show-legend="state.showLegend"
            :disabled="state.disabled"
            :readonly="state.readonly"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Selected: {{ selectedWells.length > 0 ? selectedWells.join(', ') : 'none' }}
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.format"
          title="Format"
          :options="formats.map(f => ({ label: `${f}-well`, value: f }))"
        />
        <HstSelect
          v-model="state.selectionMode"
          title="Selection Mode"
          :options="selectionModes.map(m => ({ label: m, value: m }))"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstSelect
          v-model="state.wellShape"
          title="Well Shape"
          :options="shapes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.showLabels" title="Show Labels" />
        <HstCheckbox v-model="state.showWellIds" title="Show Well IDs" />
        <HstCheckbox v-model="state.showSampleTypeIndicator" title="Sample Type Indicator" />
        <HstCheckbox v-model="state.showLegend" title="Show Legend" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
      </template>
    </Variant>

    <Variant title="Heatmap">
      <div style="padding: 2rem;">
        <WellPlate
          :format="96"
          :wells="heatmapWells"
          :heatmap="{ enabled: true, min: 0, max: 1, colorScale: 'viridis', showLegend: true }"
          selection-mode="none"
          show-labels
          size="md"
        />
      </div>
    </Variant>

    <Variant title="6-Well Plate">
      <div style="padding: 2rem;">
        <WellPlate
          :format="6"
          :wells="mockWells6"
          selection-mode="multiple"
          show-labels
          show-sample-type-indicator
          show-legend
          size="xl"
          well-shape="circle"
        />
      </div>
    </Variant>

    <Variant title="Rectangle Selection">
      <div style="padding: 2rem;">
        <WellPlate
          v-model="rectSelected"
          :format="96"
          :wells="mockWells96"
          selection-mode="rectangle"
          show-labels
          size="md"
        />
        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Drag to select a rectangle of wells. Selected: {{ rectSelected.length }} wells
        </p>
      </div>
    </Variant>

    <Variant title="Sample Types with Legend">
      <div style="padding: 2rem;">
        <WellPlate
          :format="96"
          :wells="mockWells96"
          selection-mode="none"
          show-labels
          show-sample-type-indicator
          show-legend
          size="md"
        />
      </div>
    </Variant>
  </Story>
</template>
