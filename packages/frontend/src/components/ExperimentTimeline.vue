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

const statusClasses: Record<ProtocolStepStatus, string> = {
  pending: 'mld-timeline__card--pending',
  in_progress: 'mld-timeline__card--in-progress',
  completed: 'mld-timeline__card--completed',
  failed: 'mld-timeline__card--failed',
  skipped: 'mld-timeline__card--skipped',
}

const iconStatusClasses: Record<ProtocolStepStatus, string> = {
  pending: 'mld-timeline__icon--pending',
  in_progress: 'mld-timeline__icon--in-progress',
  completed: 'mld-timeline__icon--completed',
  failed: 'mld-timeline__icon--failed',
  skipped: 'mld-timeline__icon--skipped',
}

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

function getStatusClass(step: ProtocolStep): string {
  return props.colorByStatus ? statusClasses[step.status] : statusClasses.pending
}

function getIconStatusClass(step: ProtocolStep): string {
  return props.colorByStatus ? iconStatusClasses[step.status] : iconStatusClasses.pending
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

</script>

<template>
  <div
    :class="['mld-timeline', orientation === 'horizontal' ? 'mld-timeline--horizontal' : 'mld-timeline--vertical']"
    role="list"
    :aria-label="`Protocol timeline with ${sortedSteps.length} steps`"
  >
    <div
      v-for="(step, index) in sortedSteps"
      :key="step.id"
      class="mld-timeline__step"
      role="listitem"
      :draggable="editable"
      @dragstart="handleDragStart($event, step)"
      @dragover="handleDragOver($event, step)"
      @dragleave="handleDragLeave"
      @drop="handleDrop($event, step)"
      @dragend="handleDragEnd"
    >
      <div
        v-if="index < sortedSteps.length - 1"
        class="mld-timeline__connector"
      />

      <div
        :class="[
          'mld-timeline__card',
          `mld-timeline__card--${size}`,
          getStatusClass(step),
          dragOverStepId === step.id ? 'mld-timeline__card--drag-over' : '',
          draggedStepId === step.id ? 'mld-timeline__card--dragging' : '',
          editable ? 'mld-timeline__card--editable' : '',
        ]"
        :style="colorByType ? { borderColor: getStepColor(step) } : {}"
        @click="handleStepClick(step)"
      >
        <div :class="['mld-timeline__header', `mld-timeline__header--${size}`]">
          <div
            :class="[
              'mld-timeline__icon',
              `mld-timeline__icon--${size}`,
              getIconStatusClass(step),
            ]"
            :style="colorByType ? { backgroundColor: `${getStepColor(step)}20`, color: getStepColor(step) } : {}"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stepTypeIcons[step.type]" />
            </svg>
          </div>

          <div class="mld-timeline__content">
            <div class="mld-timeline__title-row">
              <span :class="['mld-timeline__title', `mld-timeline__title--${size}`]">
                {{ step.name }}
              </span>
              <span
                v-if="showDuration && step.duration"
                :class="['mld-timeline__duration', size === 'sm' ? 'mld-timeline__duration--sm' : '']"
              >
                {{ formatDuration(step.duration) }}
              </span>
            </div>
            <div :class="['mld-timeline__type', `mld-timeline__type--${size}`]">
              {{ step.type.replace('_', ' ') }}
            </div>
          </div>

          <svg
            v-if="collapsible && (step.description || step.parameters)"
            :class="[
              'mld-timeline__expand-icon',
              expandedId === step.id ? 'mld-timeline__expand-icon--expanded' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>

          <button
            v-if="editable"
            type="button"
            class="mld-timeline__remove-btn"
            :aria-label="`Remove ${step.name}`"
            @click.stop="handleRemoveStep(step.id)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          v-if="expandedId === step.id && (step.description || step.parameters)"
          :aria-expanded="expandedId === step.id"
          class="mld-timeline__expanded"
        >
          <p v-if="step.description" :class="['mld-timeline__description', `mld-timeline__description--${size}`]">
            {{ step.description }}
          </p>

          <div v-if="step.parameters && Object.keys(step.parameters).length > 0" class="mld-timeline__parameters">
            <div
              v-for="(value, key) in step.parameters"
              :key="String(key)"
              :class="['mld-timeline__param', `mld-timeline__param--${size}`]"
            >
              <span class="mld-timeline__param-key">{{ key }}:</span>
              <span class="mld-timeline__param-value">{{ value }}</span>
            </div>
          </div>

          <div v-if="editable" class="mld-timeline__status-controls">
            <button
              v-for="status in (['pending', 'in_progress', 'completed', 'failed', 'skipped'] as const)"
              :key="status"
              type="button"
              :class="[
                'mld-timeline__status-btn',
                `mld-timeline__status-btn--${status}`,
                step.status === status ? 'mld-timeline__status-btn--active' : '',
              ]"
              @click.stop="handleStatusChange(step, status)"
            >
              {{ status.replace('_', ' ') }}
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="editable && orientation === 'vertical'"
        type="button"
        class="mld-timeline__add-inline"
        :aria-label="`Add step after ${step.name}`"
        @click.stop="handleAddStep(step.id)"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <div v-if="orientation === 'vertical' && index < sortedSteps.length - 1" class="mld-timeline__spacer--vertical" />
      <div v-if="orientation === 'horizontal' && index < sortedSteps.length - 1" class="mld-timeline__spacer--horizontal" />
    </div>

    <div
      v-if="sortedSteps.length === 0"
      class="mld-timeline__empty"
    >
      <div class="mld-timeline__empty-content">
        <p class="mld-timeline__empty-text">No protocol steps defined</p>
        <button
          v-if="editable"
          type="button"
          class="mld-timeline__empty-btn"
          @click="handleAddStep()"
        >
          Add First Step
        </button>
      </div>
    </div>

    <button
      v-if="editable && sortedSteps.length > 0"
      type="button"
      :class="['mld-timeline__add-end', `mld-timeline__add-end--${size}`]"
      @click="handleAddStep()"
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span :class="`mld-timeline__add-end-text--${size}`">Add Step</span>
    </button>
  </div>
</template>

<style>
@import '../styles/components/experiment-timeline.css';
</style>
