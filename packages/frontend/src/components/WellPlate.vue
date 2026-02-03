<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { WellPlateFormat, WellPlateSelectionMode, Well, HeatmapConfig, WellShape } from '../types'

interface Props {
  modelValue?: string[]
  format?: WellPlateFormat
  wells?: Record<string, Partial<Well>>
  selectionMode?: WellPlateSelectionMode
  showLabels?: boolean
  showWellIds?: boolean
  showSampleTypeIndicator?: boolean
  heatmap?: HeatmapConfig
  sampleColors?: Record<string, string>
  zoom?: number
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fillContainer?: boolean
  wellShape?: WellShape
}

// Drag state for moving wells
const dragSourceWell = ref<string | null>(null)
const dragTargetWell = ref<string | null>(null)

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  format: 96,
  wells: () => ({}),
  selectionMode: 'multiple',
  showLabels: true,
  showWellIds: false,
  showSampleTypeIndicator: false,
  heatmap: () => ({ enabled: false }),
  sampleColors: () => ({}),
  zoom: 1,
  disabled: false,
  readonly: false,
  size: 'md',
  fillContainer: false,
  wellShape: 'rounded',
})

const emit = defineEmits<{
  'update:modelValue': [wellIds: string[]]
  'well-click': [wellId: string, event: MouseEvent]
  'well-hover': [wellId: string | null, event?: MouseEvent]
  'selection-change': [wellIds: string[]]
  'context-menu': [wellId: string, event: MouseEvent]
  'well-move': [sourceWellId: string, targetWellId: string]
}>()

const plateRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStart = ref<{ row: number; col: number } | null>(null)
const dragEnd = ref<{ row: number; col: number } | null>(null)
const hoveredWell = ref<string | null>(null)

const PLATE_CONFIGS: Record<WellPlateFormat, { rows: number; cols: number }> = {
  6: { rows: 2, cols: 3 },
  12: { rows: 3, cols: 4 },
  24: { rows: 4, cols: 6 },
  48: { rows: 6, cols: 8 },
  54: { rows: 6, cols: 9 },
  96: { rows: 8, cols: 12 },
  384: { rows: 16, cols: 24 },
}

const plateConfig = computed(() => PLATE_CONFIGS[props.format])

const rowLabels = computed(() =>
  Array.from({ length: plateConfig.value.rows }, (_, i) => String.fromCharCode(65 + i))
)

const colLabels = computed(() =>
  Array.from({ length: plateConfig.value.cols }, (_, i) => i + 1)
)

const wellGrid = computed(() => {
  const grid: Well[][] = []
  for (let row = 0; row < plateConfig.value.rows; row++) {
    const rowWells: Well[] = []
    for (let col = 0; col < plateConfig.value.cols; col++) {
      const id = `${rowLabels.value[row]}${col + 1}`
      const wellData = props.wells[id] || {}
      rowWells.push({
        id,
        row,
        col,
        state: wellData.state || 'empty',
        sampleType: wellData.sampleType,
        value: wellData.value,
        metadata: wellData.metadata,
      })
    }
    grid.push(rowWells)
  }
  return grid
})

const selectedWellSet = computed(() => new Set(props.modelValue))

const dragSelectedWells = computed(() => {
  if (!isDragging.value || !dragStart.value || !dragEnd.value) return new Set<string>()

  const minRow = Math.min(dragStart.value.row, dragEnd.value.row)
  const maxRow = Math.max(dragStart.value.row, dragEnd.value.row)
  const minCol = Math.min(dragStart.value.col, dragEnd.value.col)
  const maxCol = Math.max(dragStart.value.col, dragEnd.value.col)

  const wells = new Set<string>()
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      const id = `${rowLabels.value[row]}${col + 1}`
      wells.add(id)
    }
  }
  return wells
})

// Size presets with pixel values for reliable sizing
const sizeConfig = computed(() => {
  if (props.fillContainer) {
    return {
      cellWidth: '100%',
      cellHeight: '32px',
      headerWidth: '40px',
      headerHeight: '32px',
      text: 'text-xs',
      spacing: 'border-spacing-1',
    }
  }
  // Use pixel values to avoid Tailwind class generation issues
  const sizes = {
    sm: { cellWidth: '40px', cellHeight: '40px', headerWidth: '32px', headerHeight: '32px', text: 'text-[10px]', spacing: 'border-spacing-0.5' },
    md: { cellWidth: '56px', cellHeight: '32px', headerWidth: '32px', headerHeight: '24px', text: 'text-xs', spacing: 'border-spacing-1' },
    lg: { cellWidth: '80px', cellHeight: '40px', headerWidth: '40px', headerHeight: '32px', text: 'text-sm', spacing: 'border-spacing-1' },
    xl: { cellWidth: '96px', cellHeight: '48px', headerWidth: '48px', headerHeight: '40px', text: 'text-base', spacing: 'border-spacing-1.5' },
  }
  return sizes[props.size]
})

// Sample type colors (matching MSExpDesigner)
const defaultSampleTypeColors: Record<string, { bg: string; border: string }> = {
  sample: { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  control: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  blank: { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)' },
  qc: { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)' },
}

const heatmapColors: Record<string, string[]> = {
  viridis: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
  plasma: ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'],
  turbo: ['#30123b', '#4145ab', '#4675ed', '#39a2fc', '#1bcfd4', '#24e79e', '#71f05f', '#c1f034', '#f1c83c', '#f99538', '#e45a31', '#ba2512', '#7a0403'],
}

function getHeatmapColor(value: number | undefined): string | null {
  if (!props.heatmap?.enabled || value === undefined) return null

  const min = props.heatmap.min ?? 0
  const max = props.heatmap.max ?? 1
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))

  const colors = props.heatmap.colorScale === 'custom' && props.heatmap.customColors?.length
    ? props.heatmap.customColors
    : heatmapColors[props.heatmap.colorScale || 'viridis']

  const index = Math.min(Math.floor(normalized * (colors.length - 1)), colors.length - 1)
  return colors[index]
}

function getWellClasses(well: Well): string[] {
  const isWellSelected = isSelected(well.id)
  const isDragOver = dragSelectedWells.value.has(well.id)
  const isHovered = hoveredWell.value === well.id
  const isDisabled = props.disabled || well.state === 'disabled'
  const isDragSource = dragSourceWell.value === well.id
  const isDragTarget = dragTargetWell.value === well.id

  const selectionClass = isDragSource ? 'ring-2 ring-amber-500 opacity-50'
    : isDragTarget ? 'ring-2 ring-emerald-500 ring-offset-1 bg-emerald-500/20'
    : isWellSelected ? 'ring-2 ring-emerald-500 ring-offset-1'
    : isDragOver ? 'ring-2 ring-indigo-500 bg-indigo-500/20'
    : isHovered && !props.readonly ? 'ring-2 ring-emerald-500/50'
    : ''

  const cursorClass = props.selectionMode === 'drag' && well.sampleType
    ? 'cursor-grab active:cursor-grabbing'
    : 'cursor-pointer'

  return [
    'transition-all duration-150',
    cursorClass,
    'flex items-center justify-center',
    sizeConfig.value.text,
    'font-medium',
    props.wellShape === 'circle' ? 'rounded-full' : 'rounded-lg',
    selectionClass,
    isDisabled ? 'opacity-50 cursor-not-allowed' : '',
  ].filter(Boolean)
}

function getWellStyle(well: Well): Record<string, string> {
  const heatmapColor = getHeatmapColor(well.value)
  if (heatmapColor) {
    return { backgroundColor: heatmapColor, border: '1px solid transparent' }
  }

  if (well.sampleType && props.sampleColors[well.sampleType]) {
    const color = props.sampleColors[well.sampleType]
    return {
      backgroundColor: `${color}26`,
      border: `1px solid ${color}66`,
    }
  }

  if (well.sampleType && defaultSampleTypeColors[well.sampleType]) {
    const colors = defaultSampleTypeColors[well.sampleType]
    return {
      backgroundColor: colors.bg,
      border: `1px solid ${colors.border}`,
    }
  }

  const borderStyle = well.state === 'filled' ? 'solid' : 'dashed'
  return {
    backgroundColor: 'var(--bg-tertiary)',
    border: `1px ${borderStyle} var(--border-color)`,
  }
}

function getSampleTypeIndicator(well: Well): string | null {
  if (!props.showSampleTypeIndicator || !well.sampleType) return null
  const typeMap: Record<string, string> = {
    sample: 'S',
    control: 'C',
    blank: 'B',
    qc: 'Q',
  }
  return typeMap[well.sampleType] || well.sampleType.charAt(0).toUpperCase()
}

function isSelected(wellId: string): boolean {
  return selectedWellSet.value.has(wellId) || dragSelectedWells.value.has(wellId)
}

function handleWellClick(well: Well, event: MouseEvent) {
  if (props.disabled || props.readonly) return

  emit('well-click', well.id, event)

  if (props.selectionMode === 'none') return

  const isCurrentlySelected = selectedWellSet.value.has(well.id)
  const isMultiSelect = event.shiftKey || event.metaKey || event.ctrlKey

  let newSelection: string[]
  if (props.selectionMode === 'single') {
    newSelection = isCurrentlySelected ? [] : [well.id]
  } else if (isMultiSelect) {
    newSelection = isCurrentlySelected
      ? props.modelValue.filter(id => id !== well.id)
      : [...props.modelValue, well.id]
  } else {
    newSelection = isCurrentlySelected && props.modelValue.length === 1 ? [] : [well.id]
  }

  emit('update:modelValue', newSelection)
  emit('selection-change', newSelection)
}

function handleWellMouseDown(well: Well, event: MouseEvent) {
  if (props.disabled || props.readonly || props.selectionMode !== 'rectangle') return
  if (event.button !== 0) return

  isDragging.value = true
  dragStart.value = { row: well.row, col: well.col }
  dragEnd.value = { row: well.row, col: well.col }
}

function handleWellMouseEnter(well: Well, event: MouseEvent) {
  hoveredWell.value = well.id
  emit('well-hover', well.id, event)

  if (isDragging.value && props.selectionMode === 'rectangle') {
    dragEnd.value = { row: well.row, col: well.col }
  }
}

function handleWellMouseLeave() {
  hoveredWell.value = null
  emit('well-hover', null)
}

function handleMouseUp() {
  if (!isDragging.value || props.selectionMode !== 'rectangle') return

  const newSelection = Array.from(dragSelectedWells.value)
  isDragging.value = false
  dragStart.value = null
  dragEnd.value = null

  if (newSelection.length > 0) {
    emit('update:modelValue', newSelection)
    emit('selection-change', newSelection)
  }
}

function handleContextMenu(well: Well, event: MouseEvent) {
  event.preventDefault()
  emit('context-menu', well.id, event)
}

// Drag handlers for moving well contents
function handleDragStart(well: Well, event: DragEvent) {
  if (props.disabled || props.readonly || props.selectionMode !== 'drag') return
  if (!well.sampleType) return // Only allow dragging filled wells

  dragSourceWell.value = well.id
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', well.id)
  }
}

function handleDragOver(well: Well, event: DragEvent) {
  if (props.selectionMode !== 'drag' || !dragSourceWell.value) return
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragTargetWell.value = well.id
}

function handleDragLeave() {
  dragTargetWell.value = null
}

function handleDrop(well: Well, event: DragEvent) {
  event.preventDefault()
  if (props.selectionMode !== 'drag' || !dragSourceWell.value) return

  const sourceId = dragSourceWell.value
  const targetId = well.id

  if (sourceId !== targetId) {
    emit('well-move', sourceId, targetId)
  }

  dragSourceWell.value = null
  dragTargetWell.value = null
}

function handleDragEnd() {
  dragSourceWell.value = null
  dragTargetWell.value = null
}

function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return

  if (event.key === 'Escape') {
    emit('update:modelValue', [])
    emit('selection-change', [])
  }

  if ((event.key === 'a' || event.key === 'A') && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    const allWells = wellGrid.value.flat().map(w => w.id)
    emit('update:modelValue', allWells)
    emit('selection-change', allWells)
  }
}

onMounted(() => {
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('keydown', handleKeyDown)
})

const containerStyle = computed(() =>
  props.fillContainer ? {} : {
    transform: `scale(${props.zoom})`,
    transformOrigin: 'top left',
  }
)

const tableClass = computed(() => {
  return [
    'border-separate',
    sizeConfig.value.spacing,
    props.fillContainer ? 'w-full table-fixed' : '',
  ].join(' ')
})
</script>

<template>
  <div
    ref="plateRef"
    :class="['select-none', fillContainer ? 'w-full' : 'inline-block']"
    :style="containerStyle"
  >
    <div class="overflow-x-auto">
      <table
        role="grid"
        :aria-label="`${format}-well plate`"
        :class="tableClass"
      >
        <!-- Column headers -->
        <thead v-if="showLabels">
          <tr>
            <th :style="{ width: sizeConfig.headerWidth, height: sizeConfig.headerHeight }"></th>
            <th
              v-for="col in colLabels"
              :key="col"
              :class="[sizeConfig.text, 'font-medium text-center']"
              :style="{ width: fillContainer ? 'auto' : sizeConfig.cellWidth, height: sizeConfig.headerHeight }"
              style="color: var(--text-muted)"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in wellGrid" :key="rowIndex" role="row">
            <!-- Row header -->
            <td
              v-if="showLabels"
              :class="[sizeConfig.text, 'font-medium text-center align-middle']"
              :style="{ width: sizeConfig.headerWidth, height: sizeConfig.cellHeight, minWidth: sizeConfig.headerWidth, minHeight: sizeConfig.cellHeight, color: 'var(--text-muted)' }"
            >
              {{ rowLabels[rowIndex] }}
            </td>

            <!-- Wells -->
            <td v-for="well in row" :key="well.id" class="p-0">
              <div
                role="gridcell"
                tabindex="0"
                :aria-label="`Well ${well.id}${well.sampleType ? `, Sample type: ${well.sampleType}` : ''}${well.value !== undefined ? `, Value: ${well.value}` : ''}`"
                :aria-selected="isSelected(well.id)"
                :aria-disabled="disabled || well.state === 'disabled'"
                :draggable="selectionMode === 'drag' && !!well.sampleType"
                :class="getWellClasses(well)"
                :style="{
                  width: fillContainer ? '100%' : sizeConfig.cellWidth,
                  height: sizeConfig.cellHeight,
                  minWidth: fillContainer ? 'auto' : sizeConfig.cellWidth,
                  minHeight: sizeConfig.cellHeight,
                  ...getWellStyle(well),
                }"
                :title="`${well.id}${well.sampleType ? `: ${well.sampleType}` : ''}`"
                @click="handleWellClick(well, $event)"
                @mousedown="handleWellMouseDown(well, $event)"
                @mouseenter="handleWellMouseEnter(well, $event)"
                @mouseleave="handleWellMouseLeave"
                @contextmenu="handleContextMenu(well, $event)"
                @dragstart="handleDragStart(well, $event)"
                @dragover.prevent="handleDragOver(well, $event)"
                @dragleave="handleDragLeave"
                @drop.prevent="handleDrop(well, $event)"
                @dragend="handleDragEnd"
                @keydown.enter="handleWellClick(well, $event as unknown as MouseEvent)"
                @keydown.space.prevent="handleWellClick(well, $event as unknown as MouseEvent)"
              >
                <!-- Sample type indicator (S/B/Q/C) -->
                <span
                  v-if="getSampleTypeIndicator(well)"
                  class="font-bold pointer-events-none"
                  style="color: var(--text-primary)"
                >
                  {{ getSampleTypeIndicator(well) }}
                </span>
                <!-- Well ID -->
                <span
                  v-else-if="showWellIds"
                  :class="[sizeConfig.text, 'font-medium pointer-events-none']"
                  style="color: var(--text-primary)"
                >
                  {{ well.id }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Heatmap legend -->
    <div
      v-if="heatmap?.enabled && heatmap.showLegend"
      class="mt-2 flex items-center gap-2"
    >
      <span class="text-xs" style="color: var(--text-muted)">{{ heatmap.min ?? 0 }}</span>
      <div class="flex-1 h-3 rounded-sm overflow-hidden flex">
        <div
          v-for="(color, index) in (heatmap.colorScale === 'custom' && heatmap.customColors?.length ? heatmap.customColors : heatmapColors[heatmap.colorScale || 'viridis'])"
          :key="index"
          class="flex-1"
          :style="{ backgroundColor: color }"
        />
      </div>
      <span class="text-xs" style="color: var(--text-muted)">{{ heatmap.max ?? 1 }}</span>
    </div>
  </div>
</template>

<style>
@import '../styles/components/well-plate.css';
</style>
