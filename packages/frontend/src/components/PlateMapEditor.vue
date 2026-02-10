<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { PlateMapEditorState, WellPlateFormat, SampleType, Well } from '../types'
import { useWellPlateEditor } from '../composables/useWellPlateEditor'
import WellPlate from './WellPlate.vue'
import SampleLegend from './SampleLegend.vue'

// Slot colors matching MSExpDesigner
type SlotPosition = 'R' | 'G' | 'B' | 'Y'
const SLOT_COLORS: Record<SlotPosition, string> = {
  R: '#ef4444', // red
  G: '#22c55e', // green
  B: '#3b82f6', // blue
  Y: '#eab308', // yellow
}
const SLOT_ORDER: SlotPosition[] = ['R', 'G', 'B', 'Y']

interface Props {
  modelValue?: PlateMapEditorState
  format?: WellPlateFormat
  maxPlates?: number
  samples?: SampleType[]
  showToolbar?: boolean
  showSidebar?: boolean
  allowAddPlates?: boolean
  allowAddSamples?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fill'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  format: 96,
  maxPlates: 10,
  samples: () => [],
  showToolbar: true,
  showSidebar: true,
  allowAddPlates: true,
  allowAddSamples: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [state: PlateMapEditorState]
  'plate-add': [plate: { id: string; name: string }]
  'plate-remove': [plateId: string]
  'sample-assign': [wellIds: string[], sampleId: string | undefined]
  'wells-clear': [wellIds: string[]]
  'undo': []
  'redo': []
  'export': [data: string, format: 'json' | 'csv']
  'import': [success: boolean]
}>()

const editor = useWellPlateEditor(props.modelValue, {
  defaultFormat: props.format,
})

const newSampleName = ref('')
const showImportModal = ref(false)
const importText = ref('')
const importFormat = ref<'json' | 'csv'>('json')

// Track slot assignment for each plate
const plateSlots = ref<Map<string, SlotPosition>>(new Map())

// Assign slots to plates on creation
function getPlateSlot(plateId: string, plateIndex: number): SlotPosition {
  if (!plateSlots.value.has(plateId)) {
    plateSlots.value.set(plateId, SLOT_ORDER[plateIndex % SLOT_ORDER.length])
  }
  return plateSlots.value.get(plateId)!
}

const sampleColors = computed(() => {
  const colors: Record<string, string> = {}
  for (const sample of editor.samples.value) {
    if (sample.color) {
      colors[sample.id] = sample.color
    }
  }
  return colors
})

const wellsData = computed(() => {
  const plate = editor.activePlate.value
  if (!plate) return {}

  const wells: Record<string, Partial<Well>> = {}
  for (const [wellId, well] of Object.entries(plate.wells)) {
    wells[wellId] = {
      state: well.state,
      sampleType: well.sampleType,
      value: well.value,
    }
  }
  return wells
})

// Count samples in a plate
function getPlateWellCount(plateId: string): number {
  const plate = editor.plates.value.find(p => p.id === plateId)
  if (!plate) return 0
  return Object.values(plate.wells).filter(w => w.sampleType).length
}

watch(
  () => editor.state.value,
  (newState) => emit('update:modelValue', { ...newState }),
  { deep: true }
)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) editor.reset()
  }
)

function handleSelectionChange(wellIds: string[]) {
  editor.setSelectedWells(wellIds)
}

function handleSampleClick(sample: SampleType) {
  const newSampleId = editor.activeSampleId.value === sample.id ? undefined : sample.id
  editor.setActiveSample(newSampleId)
}

function handleAssignSample() {
  const wells = editor.selectedWells.value
  if (wells.length === 0) return

  editor.assignSample(wells, editor.activeSampleId.value)
  emit('sample-assign', wells, editor.activeSampleId.value)
}

function handleClearWells() {
  const wells = editor.selectedWells.value
  if (wells.length === 0) return

  editor.clearWells(wells)
  emit('wells-clear', wells)
}

function handleAddSample() {
  if (!newSampleName.value.trim()) return
  editor.addSample(newSampleName.value.trim())
  newSampleName.value = ''
}

function handleRemoveSample(sampleId: string) {
  editor.removeSample(sampleId)
}

function handleAddPlate() {
  if (editor.plates.value.length >= props.maxPlates) return
  const plate = editor.addPlate()
  emit('plate-add', { id: plate.id, name: plate.name })
}

function handleRemovePlate(plateId: string) {
  editor.removePlate(plateId)
  plateSlots.value.delete(plateId)
  emit('plate-remove', plateId)
}

function handleUndo() {
  editor.undo()
  emit('undo')
}

function handleRedo() {
  editor.redo()
  emit('redo')
}

function handleExport(format: 'json' | 'csv') {
  const data = editor.exportData(format)
  emit('export', data, format)

  const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `plate-map.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

function handleImport() {
  const success = editor.importData(importText.value, importFormat.value)
  emit('import', success)
  if (success) {
    showImportModal.value = false
    importText.value = ''
  }
}

function handleKeyDown(event: KeyboardEvent) {
  const isUndo = (event.metaKey || event.ctrlKey) && event.key === 'z'
  if (isUndo) {
    event.preventDefault()
    event.shiftKey ? handleRedo() : handleUndo()
    return
  }

  const isDelete = event.key === 'Delete' || event.key === 'Backspace'
  if (isDelete && editor.selectedWells.value.length > 0) {
    event.preventDefault()
    handleClearWells()
    return
  }

  const num = parseInt(event.key)
  const isValidSampleKey = num >= 1 && num <= 9 && editor.samples.value.length >= num
  if (isValidSampleKey) {
    editor.setActiveSample(editor.samples.value[num - 1].id)
    if (editor.selectedWells.value.length > 0) {
      handleAssignSample()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div :class="['mld-plate-editor', { 'mld-plate-editor--with-sidebar': showSidebar }]">
    <!-- Main plate area -->
    <div class="mld-plate-editor__main">
      <!-- Toolbar -->
      <div v-if="showToolbar" class="mld-plate-editor__toolbar">
        <!-- Plate tabs -->
        <div class="mld-plate-editor__tabs">
          <button
            v-for="(plate, index) in editor.plates.value"
            :key="plate.id"
            type="button"
            :class="['mld-plate-editor__tab', { 'mld-plate-editor__tab--active': plate.id === editor.activePlate.value?.id }]"
            @click="editor.setActivePlate(plate.id)"
          >
            <span
              class="mld-plate-editor__tab-slot"
              :style="{ backgroundColor: SLOT_COLORS[getPlateSlot(plate.id, index)] }"
            />
            <span class="mld-plate-editor__tab-name">{{ plate.name }}</span>
            <span
              v-if="getPlateWellCount(plate.id) > 0"
              class="mld-plate-editor__tab-count"
            >
              {{ getPlateWellCount(plate.id) }}
            </span>
            <button
              v-if="editor.plates.value.length > 1"
              type="button"
              class="mld-plate-editor__tab-remove"
              :aria-label="`Remove ${plate.name}`"
              @click.stop="handleRemovePlate(plate.id)"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </button>

          <button
            v-if="allowAddPlates && editor.plates.value.length < maxPlates"
            type="button"
            class="mld-plate-editor__add-plate"
            aria-label="Add plate"
            @click="handleAddPlate"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        </div>

        <div class="mld-plate-editor__spacer" />

        <!-- Actions -->
        <div class="mld-plate-editor__actions">
          <button
            type="button"
            :disabled="!editor.canUndo.value"
            class="mld-plate-editor__action-btn"
            title="Undo (Ctrl+Z)"
            @click="handleUndo"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          <button
            type="button"
            :disabled="!editor.canRedo.value"
            class="mld-plate-editor__action-btn"
            title="Redo (Ctrl+Shift+Z)"
            @click="handleRedo"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>

          <div class="mld-plate-editor__divider" />

          <button
            type="button"
            class="mld-plate-editor__action-btn"
            title="Import"
            @click="showImportModal = true"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>

          <button
            type="button"
            class="mld-plate-editor__action-btn"
            title="Export JSON"
            @click="handleExport('json')"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Well plate -->
      <WellPlate
        v-if="editor.activePlate.value"
        :model-value="editor.selectedWells.value"
        :format="editor.activePlate.value.format"
        :wells="wellsData"
        :sample-colors="sampleColors"
        :size="size"
        selection-mode="rectangle"
        show-sample-type-indicator
        @update:model-value="handleSelectionChange"
      />

      <!-- Selection info bar -->
      <div
        v-if="editor.selectedWells.value.length > 0"
        class="mld-plate-editor__selection-bar"
      >
        <span class="mld-plate-editor__selection-count">
          <strong>{{ editor.selectedWells.value.length }}</strong> wells selected
        </span>
        <div class="mld-plate-editor__spacer" />
        <button
          v-if="editor.activeSampleId.value"
          type="button"
          class="mld-plate-editor__assign-btn"
          @click="handleAssignSample"
        >
          Assign {{ editor.samples.value.find(s => s.id === editor.activeSampleId.value)?.name }}
        </button>
        <button
          type="button"
          class="mld-plate-editor__clear-btn"
          @click="handleClearWells"
        >
          Clear
        </button>
      </div>

      <!-- Legend -->
      <div class="mld-plate-editor__legend">
        <div class="mld-plate-editor__legend-items">
          <div class="mld-plate-editor__legend-item">
            <div class="mld-plate-editor__legend-swatch" style="background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4)" />
            <span class="mld-plate-editor__legend-label">Sample</span>
          </div>
          <div class="mld-plate-editor__legend-item">
            <div class="mld-plate-editor__legend-swatch" style="background-color: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4)" />
            <span class="mld-plate-editor__legend-label">Control</span>
          </div>
          <div class="mld-plate-editor__legend-item">
            <div class="mld-plate-editor__legend-swatch" style="background-color: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.4)" />
            <span class="mld-plate-editor__legend-label">Blank</span>
          </div>
          <div class="mld-plate-editor__legend-item">
            <div class="mld-plate-editor__legend-swatch" style="background-color: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4)" />
            <span class="mld-plate-editor__legend-label">QC</span>
          </div>
        </div>
        <span class="mld-plate-editor__legend-hint">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Drag to select
        </span>
      </div>
    </div>

    <!-- Sidebar -->
    <div v-if="showSidebar" class="mld-plate-editor__sidebar">
      <div class="mld-plate-editor__sidebar-panel">
        <h3 class="mld-plate-editor__sidebar-title">Sample Types</h3>

        <SampleLegend
          :model-value="editor.activeSampleId.value"
          :samples="editor.samples.value"
          :editable="allowAddSamples"
          :size="size === 'lg' ? 'md' : 'sm'"
          @update:model-value="editor.setActiveSample($event)"
          @sample-click="handleSampleClick"
          @sample-remove="handleRemoveSample"
        />

        <!-- Add sample -->
        <div v-if="allowAddSamples" class="mld-plate-editor__add-sample">
          <div class="mld-plate-editor__add-sample-form">
            <input
              v-model="newSampleName"
              type="text"
              placeholder="New sample..."
              class="mld-plate-editor__add-sample-input"
              @keyup.enter="handleAddSample"
            />
            <button
              type="button"
              :disabled="!newSampleName.trim()"
              class="mld-plate-editor__add-sample-btn"
              @click="handleAddSample"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Keyboard shortcuts -->
        <div class="mld-plate-editor__shortcuts">
          <h4 class="mld-plate-editor__shortcuts-title">Shortcuts</h4>
          <div class="mld-plate-editor__shortcuts-list">
            <div><kbd class="mld-plate-editor__shortcut-key">1-9</kbd> Quick assign</div>
            <div><kbd class="mld-plate-editor__shortcut-key">Del</kbd> Clear wells</div>
            <div><kbd class="mld-plate-editor__shortcut-key">Ctrl+Z</kbd> Undo</div>
            <div><kbd class="mld-plate-editor__shortcut-key">Ctrl+A</kbd> Select all</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import modal -->
    <Teleport to="body">
      <div
        v-if="showImportModal"
        class="mld-plate-editor__modal-overlay"
        @click.self="showImportModal = false"
      >
        <div class="mld-plate-editor__modal">
          <h3 class="mld-plate-editor__modal-title">Import Plate Map</h3>

          <div class="mld-plate-editor__modal-field">
            <label class="mld-plate-editor__modal-label">Format</label>
            <select
              v-model="importFormat"
              class="mld-plate-editor__modal-select"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div class="mld-plate-editor__modal-field">
            <label class="mld-plate-editor__modal-label">Data</label>
            <textarea
              v-model="importText"
              rows="8"
              class="mld-plate-editor__modal-textarea"
              placeholder="Paste your data here..."
            />
          </div>

          <div class="mld-plate-editor__modal-actions">
            <button
              type="button"
              class="mld-plate-editor__modal-cancel"
              @click="showImportModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="!importText.trim()"
              class="mld-plate-editor__modal-submit"
              @click="handleImport"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
@import '../styles/components/plate-map-editor.css';
</style>
