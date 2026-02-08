<script setup lang="ts">
import { computed } from 'vue'
import type { TimeRange } from '../types/components'
import TimePicker from './TimePicker.vue'
import { durationMinutes, formatDuration, compareTime } from '../composables/useTimeUtils'

interface Props {
  modelValue?: TimeRange
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  min?: string
  max?: string
  step?: number
  format?: '12h' | '24h'
  showDuration?: boolean
  blockedRanges?: TimeRange[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  error: false,
  size: 'md',
  step: 15,
  format: '24h',
  showDuration: true,
  blockedRanges: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: TimeRange | undefined]
}>()

const startValue = computed(() => props.modelValue?.start)
const endValue = computed(() => props.modelValue?.end)

const duration = computed(() => {
  if (!props.modelValue?.start || !props.modelValue?.end) return null
  return durationMinutes(props.modelValue.start, props.modelValue.end)
})

const durationLabel = computed(() => {
  if (duration.value === null) return ''
  return formatDuration(duration.value)
})

const isInvalid = computed(() => {
  if (!props.modelValue?.start || !props.modelValue?.end) return false
  return compareTime(props.modelValue.start, props.modelValue.end) >= 0
})

const endMin = computed(() => {
  if (props.modelValue?.start) return props.modelValue.start
  return props.min
})

function onStartChange(value: string | undefined) {
  if (!value) {
    emit('update:modelValue', undefined)
    return
  }
  const end = props.modelValue?.end || ''
  emit('update:modelValue', { start: value, end })
}

function onEndChange(value: string | undefined) {
  if (!value) {
    emit('update:modelValue', undefined)
    return
  }
  const start = props.modelValue?.start || ''
  emit('update:modelValue', { start, end: value })
}
</script>

<template>
  <div class="mld-time-range">
    <div class="mld-time-range__start">
      <TimePicker
        :model-value="startValue"
        :disabled="disabled"
        :error="error || isInvalid"
        :size="size"
        :min="min"
        :max="max"
        :step="step"
        :format="format"
        placeholder="Start"
        @update:model-value="onStartChange"
      />
    </div>

    <div class="mld-time-range__separator">
      <span
        v-if="showDuration && duration !== null"
        :class="['mld-time-range__duration', isInvalid ? 'mld-time-range__duration--error' : '']"
      >
        {{ durationLabel }}
      </span>
    </div>

    <div class="mld-time-range__end">
      <TimePicker
        :model-value="endValue"
        :disabled="disabled"
        :error="error || isInvalid"
        :size="size"
        :min="endMin"
        :max="max"
        :step="step"
        :format="format"
        placeholder="End"
        @update:model-value="onEndChange"
      />
    </div>
  </div>
</template>

<style>
@import '../styles/components/time-range-input.css';
</style>
