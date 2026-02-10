<script setup lang="ts">
import { computed } from 'vue'

interface ColorStop {
  value: number
  color: string
}

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showValue?: boolean
  showLabels?: boolean
  minLabel?: string
  maxLabel?: string
  size?: 'sm' | 'md' | 'lg'
  /** Color stops for the gradient. Default: green (low) → yellow (mid) → red (high) */
  colorStops?: ColorStop[]
  /** Thresholds for value badge color. Default: green ≤ threshold1, yellow ≤ threshold2, red above */
  thresholds?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: true,
  showLabels: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Default color stops: green at start, yellow at 30%, red at end
const defaultColorStops: ColorStop[] = [
  { value: 0, color: '#22c55e' },
  { value: 30, color: '#eab308' },
  { value: 100, color: '#ef4444' },
]

// Default thresholds: green ≤ 10%, yellow ≤ 30%, red above
const defaultThresholds: [number, number] = [10, 30]

const colorStops = computed(() => props.colorStops ?? defaultColorStops)
const thresholds = computed(() => props.thresholds ?? defaultThresholds)

const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm': return { thumb: 16, badgeSize: '24px', fontSize: '11px', labelFontSize: '0.625rem' }
    case 'lg': return { thumb: 22, badgeSize: '32px', fontSize: '14px', labelFontSize: '0.75rem' }
    default: return { thumb: 18, badgeSize: '28px', fontSize: '12px', labelFontSize: '0.625rem' }
  }
})

const currentValue = computed(() => props.modelValue ?? props.min)

const percentage = computed(() => {
  const range = props.max - props.min
  if (range === 0) return 0
  return ((currentValue.value - props.min) / range) * 100
})

// Generate CSS gradient from color stops
const gradientStyle = computed(() => {
  const stops = colorStops.value
    .map(stop => `${stop.color} ${stop.value}%`)
    .join(', ')
  return `linear-gradient(to right, ${stops})`
})

// Value badge style based on thresholds
const valueBadgeStyle = computed(() => {
  const pct = percentage.value
  const [t1, t2] = thresholds.value

  if (pct <= t1) {
    return {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
      border: '1px solid rgba(34, 197, 94, 0.3)'
    }
  }
  if (pct <= t2) {
    return {
      backgroundColor: 'rgba(234, 179, 8, 0.15)',
      color: '#eab308',
      border: '1px solid rgba(234, 179, 8, 0.3)'
    }
  }
  return {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  }
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div :class="['mld-color-slider', { 'mld-color-slider--disabled': disabled }]">
    <div class="mld-color-slider__row">
      <!-- Slider track with gradient -->
      <div class="mld-color-slider__track">
        <input
          type="range"
          :value="currentValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :aria-label="`Value: ${currentValue}`"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="currentValue"
          class="color-slider mld-color-slider__input"
          :style="{
            '--slider-gradient': gradientStyle,
            '--thumb-size': `${sizeConfig.thumb}px`,
          }"
          @input="handleInput"
        />
      </div>

      <!-- Value badge -->
      <div
        v-if="showValue"
        class="mld-color-slider__badge"
        :style="{
          ...valueBadgeStyle,
          minWidth: sizeConfig.badgeSize,
          height: sizeConfig.badgeSize,
          fontSize: sizeConfig.fontSize,
        }"
      >
        {{ currentValue }}
      </div>
    </div>

    <!-- Min/Max labels -->
    <div
      v-if="showLabels"
      class="mld-color-slider__labels"
      :style="{ fontSize: sizeConfig.labelFontSize }"
    >
      <span>{{ minLabel ?? min }}</span>
      <span>{{ maxLabel ?? max }}</span>
    </div>
  </div>
</template>

<style>
@import '../styles/components/color-slider.css';
</style>
