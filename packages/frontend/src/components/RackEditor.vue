<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Rack, SlotPosition, WellPlateFormat, WellPlateSize, WellEditData, Well } from '../types'
import { useRackEditor } from '../composables/useRackEditor'
import WellPlate from './WellPlate.vue'

interface Props {
  modelValue?: Rack[]
  activeRackId?: string
  maxRacks?: number
  minRacks?: number
  allowReorder?: boolean
  editable?: boolean
  readonly?: boolean
  wellPlateSize?: WellPlateSize
  showLegend?: boolean
  showBadges?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  activeRackId: undefined,
  maxRacks: 10,
  minRacks: 1,
  allowReorder: true,
  editable: true,
  readonly: false,
  wellPlateSize: 'md',
  showLegend: true,
  showBadges: true,
})

const emit = defineEmits<{
  'update:modelValue': [racks: Rack[]]
  'update:activeRackId': [rackId: string]
  'rack-add': [rack: Rack]
  'rack-remove': [rackId: string]
  'rack-reorder': [rackIds: string[]]
  'well-edit': [rackId: string, wellId: string, data: WellEditData]
}>()

const editor = useRackEditor(props.modelValue, {
  maxRacks: props.maxRacks,
  minRacks: props.minRacks,
})

// Sync external modelValue -> internal racks
watch(
  () => props.modelValue,
  (newRacks) => {
    if (newRacks && JSON.stringify(newRacks) !== JSON.stringify(editor.racks.value)) {
      editor.racks.value = newRacks.map(r => ({ ...r }))
    }
  },
)

// Sync external activeRackId -> internal
watch(
  () => props.activeRackId,
  (id) => {
    if (id && id !== editor.activeRackId.value) {
      editor.setActiveRack(id)
    }
  },
)

// Sync internal racks -> external modelValue
watch(
  editor.racks,
  (newRacks) => {
    emit('update:modelValue', newRacks)
  },
  { deep: true },
)

// Sync internal activeRackId -> external
watch(
  editor.activeRackId,
  (id) => {
    emit('update:activeRackId', id)
  },
)

const SLOT_COLORS: Record<SlotPosition, string> = {
  R: '#ef4444',
  G: '#22c55e',
  B: '#3b82f6',
  Y: '#eab308',
}

const SLOT_OPTIONS: SlotPosition[] = ['R', 'G', 'B', 'Y']

const FORMAT_OPTIONS: { value: WellPlateFormat; label: string }[] = [
  { value: 54, label: '54' },
  { value: 96, label: '96' },
]

// Drag state for rack reordering
const draggingRackId = ref<string | null>(null)
const dragOverRackId = ref<string | null>(null)

function handleAddRack() {
  const rack = editor.addRack()
  emit('rack-add', rack)
}

function handleRemoveRack(rackId: string) {
  editor.removeRack(rackId)
  emit('rack-remove', rackId)
}

function handleTabClick(rackId: string) {
  editor.setActiveRack(rackId)
}

// Rack drag handlers
function handleRackDragStart(event: DragEvent, rackId: string) {
  if (!props.allowReorder) return
  draggingRackId.value = rackId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', rackId)
  }
}

function handleRackDragOver(event: DragEvent, rackId: string) {
  event.preventDefault()
  if (draggingRackId.value && draggingRackId.value !== rackId) {
    dragOverRackId.value = rackId
  }
}

function handleRackDragLeave() {
  dragOverRackId.value = null
}

function handleRackDrop(event: DragEvent, targetRackId: string) {
  event.preventDefault()
  if (!draggingRackId.value || draggingRackId.value === targetRackId) {
    clearDragState()
    return
  }

  const fromIndex = editor.racks.value.findIndex(r => r.id === draggingRackId.value)
  const toIndex = editor.racks.value.findIndex(r => r.id === targetRackId)

  if (fromIndex !== -1 && toIndex !== -1) {
    editor.reorderRacks(fromIndex, toIndex)
    emit('rack-reorder', editor.racks.value.map(r => r.id))
  }

  clearDragState()
}

function handleRackDragEnd() {
  clearDragState()
}

function clearDragState() {
  draggingRackId.value = null
  dragOverRackId.value = null
}

// Toolbar actions
function handleFormatChange(format: WellPlateFormat) {
  if (!editor.activeRack.value) return
  editor.updateRack(editor.activeRack.value.id, { format })
}

function handleSlotChange(slot: SlotPosition) {
  if (!editor.activeRack.value) return
  editor.updateRack(editor.activeRack.value.id, { slot })
}

function handleClearAll() {
  if (!editor.activeRack.value) return
  editor.clearAllWells(editor.activeRack.value.id)
}

function handleFillSeries() {
  if (!editor.activeRack.value) return
  editor.fillSeries(editor.activeRack.value.id)
}

// Well edit from WellPlate
function handleWellEdit(wellId: string, data: WellEditData) {
  if (!editor.activeRack.value) return
  const rackId = editor.activeRack.value.id

  const wellData: Partial<Well> = {
    id: wellId,
    state: data.label ? 'filled' : 'empty',
    sampleType: data.sampleType || undefined,
    metadata: {
      label: data.label,
      injectionVolume: data.injectionVolume,
      injectionCount: data.injectionCount,
      customMethod: data.customMethod || null,
    },
  }

  if (data.label) {
    editor.setWellData(rackId, wellId, wellData)
  } else {
    editor.clearWell(rackId, wellId)
  }

  emit('well-edit', rackId, wellId, data)
}

function handleWellClear(wellId: string) {
  if (!editor.activeRack.value) return
  editor.clearWell(editor.activeRack.value.id, wellId)
}

// Computed well count per rack
function getWellCount(rack: Rack): number {
  return Object.keys(rack.wells).length
}

const activeRackWells = computed(() => editor.activeRack.value?.wells ?? {})
</script>

<template>
  <div :class="['mld-rack-editor', { 'mld-rack-editor--readonly': readonly }]">
    <!-- Rack tabs -->
    <div class="mld-rack-editor__tabs">
      <div class="mld-rack-editor__tabs-inner">
        <button
          v-for="rack in editor.racks.value"
          :key="rack.id"
          :draggable="allowReorder && !readonly"
          :class="[
            'mld-rack-editor__tab',
            {
              'mld-rack-editor__tab--active': editor.activeRackId.value === rack.id,
              'mld-rack-editor__tab--dragging': draggingRackId === rack.id,
              'mld-rack-editor__tab--drag-over': dragOverRackId === rack.id,
            },
          ]"
          @click="handleTabClick(rack.id)"
          @dragstart="handleRackDragStart($event, rack.id)"
          @dragover="handleRackDragOver($event, rack.id)"
          @dragleave="handleRackDragLeave"
          @drop="handleRackDrop($event, rack.id)"
          @dragend="handleRackDragEnd"
        >
          <span
            class="mld-rack-editor__slot-dot"
            :style="{ backgroundColor: SLOT_COLORS[rack.slot] }"
          />
          {{ rack.name }}
          <span
            v-if="getWellCount(rack) > 0"
            :class="[
              'mld-rack-editor__count',
              editor.activeRackId.value === rack.id ? 'mld-rack-editor__count--active' : 'mld-rack-editor__count--inactive',
            ]"
          >
            {{ getWellCount(rack) }}
          </span>
          <!-- Remove button -->
          <button
            v-if="editor.racks.value.length > minRacks && !readonly"
            class="mld-rack-editor__tab-remove"
            @click.stop="handleRemoveRack(rack.id)"
          >
            &times;
          </button>
        </button>
      </div>

      <!-- Add rack button -->
      <button
        v-if="editor.racks.value.length < maxRacks && !readonly"
        class="mld-rack-editor__add-btn"
        @click="handleAddRack"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
        Add Rack
      </button>
    </div>

    <!-- Toolbar for active rack -->
    <div v-if="editor.activeRack.value && !readonly" class="mld-rack-editor__toolbar">
      <div class="mld-rack-editor__toolbar-group">
        <!-- Format selector -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="mld-rack-editor__toolbar-label">Plate</span>
          <div class="mld-rack-editor__format-btns">
            <button
              v-for="opt in FORMAT_OPTIONS"
              :key="opt.value"
              :class="[
                'mld-rack-editor__format-btn',
                editor.activeRack.value.format === opt.value ? 'mld-rack-editor__format-btn--active' : 'mld-rack-editor__format-btn--inactive',
              ]"
              @click="handleFormatChange(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="mld-rack-editor__toolbar-divider" />

        <!-- Slot selector -->
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="mld-rack-editor__toolbar-label">Slot</span>
          <div class="mld-rack-editor__slot-btns">
            <button
              v-for="s in SLOT_OPTIONS"
              :key="s"
              class="mld-rack-editor__slot-btn"
              :style="{
                backgroundColor: editor.activeRack.value.slot === s ? SLOT_COLORS[s] : 'var(--bg-secondary)',
                color: editor.activeRack.value.slot === s ? 'white' : SLOT_COLORS[s],
                borderColor: editor.activeRack.value.slot === s ? 'transparent' : `${SLOT_COLORS[s]}40`,
                boxShadow: editor.activeRack.value.slot === s ? '0 2px 4px rgba(0,0,0,0.15)' : 'none',
              }"
              @click="handleSlotChange(s)"
            >
              {{ s }}
            </button>
          </div>
        </div>
      </div>

      <div class="mld-rack-editor__toolbar-spacer" />

      <!-- Actions -->
      <button class="mld-rack-editor__action-btn" @click="handleClearAll">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Clear
      </button>
      <button class="mld-rack-editor__action-btn" @click="handleFillSeries">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" />
        </svg>
        Fill Series
      </button>
    </div>

    <!-- Plate view -->
    <div v-if="editor.activeRack.value" class="mld-rack-editor__plate">
      <WellPlate
        :format="editor.activeRack.value.format"
        :wells="activeRackWells"
        :editable="editable && !readonly"
        :show-well-labels="true"
        :show-badges="showBadges"
        :show-legend="showLegend"
        :default-injection-volume="editor.activeRack.value.injectionVolume"
        :readonly="readonly"
        :size="wellPlateSize"
        :show-sample-type-indicator="true"
        @well-edit="handleWellEdit"
        @well-clear="handleWellClear"
      />
    </div>
  </div>
</template>

<style>
@import '../styles/components/rack-editor.css';
</style>
