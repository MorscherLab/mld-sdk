<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProtocolStep, ProtocolStepType, ProtocolStepStatus } from '../types'

interface Props {
  modelValue?: ProtocolStep[]
  orientation?: 'horizontal' | 'vertical'
  showDuration?: boolean
  showTime?: boolean
  editable?: boolean
  collapsible?: boolean
  expandedStepId?: string
  size?: 'sm' | 'md' | 'lg'
  colorByStatus?: boolean
  colorByType?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  orientation: 'vertical',
  showDuration: true,
  showTime: false,
  editable: false,
  collapsible: true,
  expandedStepId: undefined,
  size: 'md',
  colorByStatus: true,
  colorByType: false,
})

const emit = defineEmits<{
  'update:modelValue': [steps: ProtocolStep[]]
  'step-click': [step: ProtocolStep]
  'step-expand': [stepId: string | undefined]
  'step-add': [afterStepId?: string]
  'step-remove': [stepId: string]
  'step-update': [step: ProtocolStep]
  'step-reorder': [stepId: string, newOrder: number]
  'step-status-change': [stepId: string, status: ProtocolStepStatus]
}>()

const localExpandedId = ref<string | undefined>(props.expandedStepId)
const draggedStepId = ref<string | null>(null)
const dragOverStepId = ref<string | null>(null)

const expandedId = computed({
  get: () => props.expandedStepId ?? localExpandedId.value,
  set: (id) => {
    localExpandedId.value = id
    emit('step-expand', id)
  },
})

const sortedSteps = computed(() => {
  if (props.modelValue.every((step, i, arr) => i === 0 || step.order >= arr[i - 1].order)) {
    return props.modelValue
  }
  return [...props.modelValue].sort((a, b) => a.order - b.order)
})

const stepTypeIcons: Record<ProtocolStepType, string> = {
  incubation: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  wash: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  addition: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  measurement: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  centrifuge: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  mix: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
  custom: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
}

const stepTypeColors: Record<ProtocolStepType, string> = {
  incubation: '#F59E0B',
  wash: '#06B6D4',
  addition: '#10B981',
  measurement: '#8B5CF6',
  transfer: '#3B82F6',
  centrifuge: '#6B7280',
  mix: '#F97316',
  custom: '#EC4899',
}

const statusColors: Record<ProtocolStepStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-300 dark:border-gray-600' },
  in_progress: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-400' },
  completed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-400' },
  failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-400' },
  skipped: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-400 dark:text-gray-500', border: 'border-gray-300 dark:border-gray-600' },
}

const sizeClasses = computed(() => {
  const sizes = {
    sm: { icon: 'w-6 h-6', iconInner: 'w-3 h-3', text: 'text-xs', padding: 'p-2', gap: 'gap-2' },
    md: { icon: 'w-8 h-8', iconInner: 'w-4 h-4', text: 'text-sm', padding: 'p-3', gap: 'gap-3' },
    lg: { icon: 'w-10 h-10', iconInner: 'w-5 h-5', text: 'text-base', padding: 'p-4', gap: 'gap-4' },
  }
  return sizes[props.size]
})

function formatDuration(minutes: number | undefined): string {
  if (minutes === undefined) return ''
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function getStepColor(step: ProtocolStep): string {
  return props.colorByType && !props.colorByStatus ? stepTypeColors[step.type] : ''
}

function getStatusClasses(step: ProtocolStep) {
  return props.colorByStatus ? statusColors[step.status] : statusColors.pending
}

function toggleExpand(step: ProtocolStep) {
  expandedId.value = expandedId.value === step.id ? undefined : step.id
}

function handleStepClick(step: ProtocolStep) {
  emit('step-click', step)
  if (props.collapsible) {
    toggleExpand(step)
  }
}

function handleStatusChange(step: ProtocolStep, status: ProtocolStepStatus) {
  const updatedSteps = props.modelValue.map(s =>
    s.id === step.id ? { ...s, status } : s
  )
  emit('step-status-change', step.id, status)
  emit('update:modelValue', updatedSteps)
}

function handleRemoveStep(stepId: string) {
  const updatedSteps = props.modelValue
    .filter(s => s.id !== stepId)
    .map((s, i) => ({ ...s, order: i }))
  emit('step-remove', stepId)
  emit('update:modelValue', updatedSteps)
}

function handleAddStep(afterStepId?: string) {
  emit('step-add', afterStepId)
}

function handleDragStart(event: DragEvent, step: ProtocolStep) {
  if (!props.editable) return
  draggedStepId.value = step.id
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', step.id)
  }
}

function handleDragOver(event: DragEvent, step: ProtocolStep) {
  if (!props.editable || !draggedStepId.value) return
  event.preventDefault()
  dragOverStepId.value = step.id
}

function handleDragLeave() {
  dragOverStepId.value = null
}

function handleDrop(event: DragEvent, targetStep: ProtocolStep) {
  if (!props.editable || !draggedStepId.value) return
  event.preventDefault()

  const draggedStep = props.modelValue.find(s => s.id === draggedStepId.value)
  if (!draggedStep || draggedStep.id === targetStep.id) {
    draggedStepId.value = null
    dragOverStepId.value = null
    return
  }

  const steps = [...props.modelValue]
  const draggedIndex = steps.findIndex(s => s.id === draggedStepId.value)
  const targetIndex = steps.findIndex(s => s.id === targetStep.id)

  steps.splice(draggedIndex, 1)
  steps.splice(targetIndex, 0, draggedStep)

  const reordered = steps.map((s, i) => ({ ...s, order: i }))
  emit('step-reorder', draggedStepId.value, targetIndex)
  emit('update:modelValue', reordered)

  draggedStepId.value = null
  dragOverStepId.value = null
}

function handleDragEnd() {
  draggedStepId.value = null
  dragOverStepId.value = null
}

const containerClass = computed(() =>
  props.orientation === 'horizontal'
    ? 'flex items-start overflow-x-auto pb-2'
    : 'flex flex-col'
)

const stepClass = computed(() =>
  props.orientation === 'horizontal'
    ? 'flex-shrink-0'
    : ''
)
</script>

<template>
  <div :class="containerClass" role="list" :aria-label="`Protocol timeline with ${sortedSteps.length} steps`">
    <div
      v-for="(step, index) in sortedSteps"
      :key="step.id"
      :class="[stepClass, 'relative']"
      role="listitem"
      :draggable="editable"
      @dragstart="handleDragStart($event, step)"
      @dragover="handleDragOver($event, step)"
      @dragleave="handleDragLeave"
      @drop="handleDrop($event, step)"
      @dragend="handleDragEnd"
    >
      <!-- Connector line -->
      <div
        v-if="index < sortedSteps.length - 1"
        :class="[
          'absolute bg-border',
          orientation === 'horizontal'
            ? 'top-1/2 -translate-y-1/2 h-0.5 left-full w-4'
            : 'left-4 top-full w-0.5 h-4 -translate-x-1/2',
        ]"
        :style="orientation === 'horizontal' ? { left: `calc(100% - 0.5rem)`, width: '2rem' } : {}"
      />

      <!-- Step card -->
      <div
        :class="[
          'relative rounded-lg border-2 transition-all duration-200 cursor-pointer',
          sizeClasses.padding,
          getStatusClasses(step).bg,
          getStatusClasses(step).border,
          dragOverStepId === step.id ? 'ring-2 ring-mld-primary' : '',
          draggedStepId === step.id ? 'opacity-50' : '',
          editable ? 'cursor-grab active:cursor-grabbing' : '',
          orientation === 'horizontal' ? 'min-w-[180px]' : 'w-full',
        ]"
        :style="colorByType ? { borderColor: getStepColor(step) } : {}"
        @click="handleStepClick(step)"
      >
        <!-- Header -->
        <div class="flex items-center" :class="sizeClasses.gap">
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 rounded-full flex items-center justify-center',
              sizeClasses.icon,
              getStatusClasses(step).text,
            ]"
            :style="colorByType ? { backgroundColor: `${getStepColor(step)}20`, color: getStepColor(step) } : {}"
          >
            <svg :class="sizeClasses.iconInner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stepTypeIcons[step.type]" />
            </svg>
          </div>

          <!-- Title & meta -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span :class="['font-medium truncate', sizeClasses.text, 'text-text-primary']">
                {{ step.name }}
              </span>
              <span
                v-if="showDuration && step.duration"
                :class="['text-text-muted', size === 'sm' ? 'text-[10px]' : 'text-xs']"
              >
                {{ formatDuration(step.duration) }}
              </span>
            </div>
            <div :class="['text-text-muted capitalize', size === 'sm' ? 'text-[10px]' : 'text-xs']">
              {{ step.type.replace('_', ' ') }}
            </div>
          </div>

          <!-- Expand indicator -->
          <svg
            v-if="collapsible && (step.description || step.parameters)"
            :class="[
              'w-4 h-4 text-text-muted transition-transform',
              expandedId === step.id ? 'rotate-180' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>

          <!-- Remove button -->
          <button
            v-if="editable"
            type="button"
            class="p-1 text-text-muted hover:text-mld-danger transition-colors rounded"
            :aria-label="`Remove ${step.name}`"
            @click.stop="handleRemoveStep(step.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Expanded content -->
        <div
          v-if="expandedId === step.id && (step.description || step.parameters)"
          :aria-expanded="expandedId === step.id"
          class="mt-3 pt-3 border-t border-border/50"
        >
          <p v-if="step.description" :class="['text-text-secondary mb-2', size === 'sm' ? 'text-xs' : 'text-sm']">
            {{ step.description }}
          </p>

          <div v-if="step.parameters && Object.keys(step.parameters).length > 0" class="space-y-1">
            <div
              v-for="(value, key) in step.parameters"
              :key="String(key)"
              :class="['flex justify-between', size === 'sm' ? 'text-[10px]' : 'text-xs']"
            >
              <span class="text-text-muted">{{ key }}:</span>
              <span class="text-text-primary font-medium">{{ value }}</span>
            </div>
          </div>

          <!-- Status controls -->
          <div v-if="editable" class="mt-3 flex flex-wrap gap-1">
            <button
              v-for="status in (['pending', 'in_progress', 'completed', 'failed', 'skipped'] as const)"
              :key="status"
              type="button"
              :class="[
                'px-2 py-0.5 rounded text-xs transition-colors',
                step.status === status
                  ? `${statusColors[status].bg} ${statusColors[status].text} font-medium`
                  : 'text-text-muted hover:bg-bg-hover',
              ]"
              @click.stop="handleStatusChange(step, status)"
            >
              {{ status.replace('_', ' ') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add step button (between steps) -->
      <button
        v-if="editable && orientation === 'vertical'"
        type="button"
        class="absolute left-4 -translate-x-1/2 -bottom-2 w-4 h-4 bg-bg-secondary border border-border rounded-full flex items-center justify-center text-text-muted hover:text-mld-primary hover:border-mld-primary transition-colors opacity-0 hover:opacity-100 focus:opacity-100 z-10"
        :aria-label="`Add step after ${step.name}`"
        @click.stop="handleAddStep(step.id)"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <!-- Spacer for vertical layout -->
      <div v-if="orientation === 'vertical' && index < sortedSteps.length - 1" class="h-4" />
      <div v-if="orientation === 'horizontal' && index < sortedSteps.length - 1" class="w-8" />
    </div>

    <!-- Empty state / Add first step -->
    <div
      v-if="sortedSteps.length === 0"
      class="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg"
    >
      <div class="text-center">
        <p class="text-text-muted mb-2">No protocol steps defined</p>
        <button
          v-if="editable"
          type="button"
          class="px-3 py-1.5 text-sm bg-mld-primary text-white rounded-mld hover:bg-mld-primary-hover transition-colors"
          @click="handleAddStep()"
        >
          Add First Step
        </button>
      </div>
    </div>

    <!-- Add step at end -->
    <button
      v-if="editable && sortedSteps.length > 0"
      type="button"
      :class="[
        'flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg text-text-muted hover:text-mld-primary hover:border-mld-primary transition-colors',
        sizeClasses.padding,
        orientation === 'horizontal' ? 'min-w-[120px] flex-shrink-0' : 'w-full mt-4',
      ]"
      @click="handleAddStep()"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span :class="sizeClasses.text">Add Step</span>
    </button>
  </div>
</template>
