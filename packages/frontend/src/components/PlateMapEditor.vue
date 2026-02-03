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
  <div :class="['flex', showSidebar ? 'gap-4' : '']">
    <!-- Main plate area -->
    <div class="flex-1 min-w-0">
      <!-- Toolbar -->
      <div
        v-if="showToolbar"
        class="flex flex-wrap items-center gap-2 mb-4 p-2 rounded-lg"
        style="background-color: var(--bg-secondary); border: 1px solid var(--border-color)"
      >
        <!-- Plate tabs (matching MSExpDesigner rack tabs) -->
        <div class="flex items-center gap-1 flex-wrap">
          <button
            v-for="(plate, index) in editor.plates.value"
            :key="plate.id"
            type="button"
            class="group relative flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-all duration-200"
            :style="{
              backgroundColor: plate.id === editor.activePlate.value?.id
                ? 'var(--color-primary, #3b82f6)'
                : 'var(--bg-tertiary)',
              color: plate.id === editor.activePlate.value?.id
                ? 'white'
                : 'var(--text-secondary)',
              border: plate.id === editor.activePlate.value?.id
                ? 'none'
                : '1px solid var(--border-color)',
            }"
            @click="editor.setActivePlate(plate.id)"
          >
            <!-- Slot color dot -->
            <span
              class="w-2.5 h-2.5 rounded-full flex-shrink-0"
              :style="{ backgroundColor: SLOT_COLORS[getPlateSlot(plate.id, index)] }"
            />
            <span class="font-medium">{{ plate.name }}</span>
            <!-- Sample count badge -->
            <span
              v-if="getPlateWellCount(plate.id) > 0"
              class="px-1.5 min-w-[1.25rem] text-center text-[10px] font-semibold rounded-full"
              :style="{
                backgroundColor: plate.id === editor.activePlate.value?.id
                  ? 'rgba(255,255,255,0.2)'
                  : 'var(--bg-secondary)',
                color: plate.id === editor.activePlate.value?.id
                  ? 'white'
                  : 'var(--text-muted)',
              }"
            >
              {{ getPlateWellCount(plate.id) }}
            </span>
            <!-- Remove button (shown on hover for non-active) -->
            <button
              v-if="editor.plates.value.length > 1"
              type="button"
              class="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              :style="{ color: plate.id === editor.activePlate.value?.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }"
              :aria-label="`Remove ${plate.name}`"
              @click.stop="handleRemovePlate(plate.id)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </button>

          <!-- Add plate button -->
          <button
            v-if="allowAddPlates && editor.plates.value.length < maxPlates"
            type="button"
            class="flex items-center gap-1 px-2 py-1.5 text-sm rounded-md transition-colors"
            style="color: var(--text-muted); border: 1px dashed var(--border-color)"
            aria-label="Add plate"
            @click="handleAddPlate"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        </div>

        <div class="flex-1" />

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            :disabled="!editor.canUndo.value"
            class="p-1.5 rounded transition-colors"
            :style="{
              color: editor.canUndo.value ? 'var(--text-secondary)' : 'var(--text-muted)',
              opacity: editor.canUndo.value ? 1 : 0.4,
            }"
            title="Undo (Ctrl+Z)"
            @click="handleUndo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          <button
            type="button"
            :disabled="!editor.canRedo.value"
            class="p-1.5 rounded transition-colors"
            :style="{
              color: editor.canRedo.value ? 'var(--text-secondary)' : 'var(--text-muted)',
              opacity: editor.canRedo.value ? 1 : 0.4,
            }"
            title="Redo (Ctrl+Shift+Z)"
            @click="handleRedo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>

          <div class="w-px h-4 mx-1" style="background-color: var(--border-color)" />

          <button
            type="button"
            class="p-1.5 rounded transition-colors hover:bg-gray-500/10"
            style="color: var(--text-secondary)"
            title="Import"
            @click="showImportModal = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>

          <button
            type="button"
            class="p-1.5 rounded transition-colors hover:bg-gray-500/10"
            style="color: var(--text-secondary)"
            title="Export JSON"
            @click="handleExport('json')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="mt-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
        style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color)"
      >
        <span style="color: var(--text-secondary)">
          <strong>{{ editor.selectedWells.value.length }}</strong> wells selected
        </span>
        <div class="flex-1" />
        <button
          v-if="editor.activeSampleId.value"
          type="button"
          class="px-3 py-1 text-sm font-medium rounded transition-colors"
          style="background-color: var(--color-primary, #3b82f6); color: white"
          @click="handleAssignSample"
        >
          Assign {{ editor.samples.value.find(s => s.id === editor.activeSampleId.value)?.name }}
        </button>
        <button
          type="button"
          class="px-3 py-1 text-sm font-medium rounded transition-colors hover:bg-red-500/10"
          style="background-color: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color)"
          @click="handleClearWells"
        >
          Clear
        </button>
      </div>

      <!-- Legend -->
      <div class="mt-3 flex items-center justify-between px-1">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <div class="w-3.5 h-3.5 rounded" style="background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4)" />
            <span class="text-xs" style="color: var(--text-muted)">Sample</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3.5 h-3.5 rounded" style="background-color: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4)" />
            <span class="text-xs" style="color: var(--text-muted)">Control</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3.5 h-3.5 rounded" style="background-color: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.4)" />
            <span class="text-xs" style="color: var(--text-muted)">Blank</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3.5 h-3.5 rounded" style="background-color: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4)" />
            <span class="text-xs" style="color: var(--text-muted)">QC</span>
          </div>
        </div>
        <span class="text-xs flex items-center gap-1.5" style="color: var(--text-muted)">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Drag to select
        </span>
      </div>
    </div>

    <!-- Sidebar -->
    <div v-if="showSidebar" class="w-52 flex-shrink-0">
      <div class="rounded-lg p-3" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color)">
        <h3 class="text-sm font-medium mb-3" style="color: var(--text-primary)">Sample Types</h3>

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
        <div v-if="allowAddSamples" class="mt-3 pt-3" style="border-top: 1px solid var(--border-color)">
          <div class="flex gap-2">
            <input
              v-model="newSampleName"
              type="text"
              placeholder="New sample..."
              class="flex-1 px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-1"
              style="background-color: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-primary)"
              @keyup.enter="handleAddSample"
            />
            <button
              type="button"
              :disabled="!newSampleName.trim()"
              class="px-2 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style="background-color: var(--color-primary, #3b82f6); color: white"
              @click="handleAddSample"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Keyboard shortcuts -->
        <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color)">
          <h4 class="text-xs font-medium mb-2" style="color: var(--text-muted)">Shortcuts</h4>
          <div class="space-y-1 text-xs" style="color: var(--text-muted)">
            <div><kbd class="px-1 rounded" style="background-color: var(--bg-primary)">1-9</kbd> Quick assign</div>
            <div><kbd class="px-1 rounded" style="background-color: var(--bg-primary)">Del</kbd> Clear wells</div>
            <div><kbd class="px-1 rounded" style="background-color: var(--bg-primary)">Ctrl+Z</kbd> Undo</div>
            <div><kbd class="px-1 rounded" style="background-color: var(--bg-primary)">Ctrl+A</kbd> Select all</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Import modal -->
    <Teleport to="body">
      <div
        v-if="showImportModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="showImportModal = false"
      >
        <div class="rounded-lg shadow-lg p-4 w-full max-w-md" style="background-color: var(--bg-primary); border: 1px solid var(--border-color)">
          <h3 class="text-lg font-medium mb-3" style="color: var(--text-primary)">Import Plate Map</h3>

          <div class="mb-3">
            <label class="block text-sm mb-1" style="color: var(--text-secondary)">Format</label>
            <select
              v-model="importFormat"
              class="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-1"
              style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary)"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm mb-1" style="color: var(--text-secondary)">Data</label>
            <textarea
              v-model="importText"
              rows="8"
              class="w-full px-3 py-2 rounded-md font-mono text-sm focus:outline-none focus:ring-1 resize-none"
              style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary)"
              placeholder="Paste your data here..."
            />
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 text-sm rounded-md transition-colors"
              style="background-color: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color)"
              @click="showImportModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              :disabled="!importText.trim()"
              class="px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style="background-color: var(--color-primary, #3b82f6); color: white"
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
