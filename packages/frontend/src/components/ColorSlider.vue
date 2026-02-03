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
    case 'sm': return { track: 'h-1', thumb: 16, badge: 'w-8 h-5 text-xs', label: 'text-[10px]' }
    case 'lg': return { track: 'h-2', thumb: 22, badge: 'w-12 h-7 text-sm', label: 'text-xs' }
    default: return { track: 'h-1.5', thumb: 18, badge: 'w-10 h-6 text-xs', label: 'text-[10px]' }
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
  <div :class="['space-y-1', disabled ? 'opacity-50' : '']">
    <div class="flex items-center gap-2">
      <!-- Slider track with gradient -->
      <div class="relative flex-1">
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
          class="color-slider w-full cursor-pointer disabled:cursor-not-allowed"
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
        :class="['flex items-center justify-center rounded font-bold', sizeConfig.badge]"
        :style="valueBadgeStyle"
      >
        {{ currentValue }}
      </div>
    </div>

    <!-- Min/Max labels -->
    <div v-if="showLabels" class="flex justify-between" :class="sizeConfig.label" style="color: var(--text-muted)">
      <span>{{ minLabel ?? min }}</span>
      <span>{{ maxLabel ?? max }}</span>
    </div>
  </div>
</template>

<style scoped>
.color-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: var(--slider-gradient);
}

.color-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid var(--mld-primary, #6366f1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}

.color-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.color-slider::-webkit-slider-thumb:active {
  transform: scale(1.15);
}

.color-slider::-moz-range-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid var(--mld-primary, #6366f1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}

.color-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

.color-slider:focus {
  outline: none;
}

.color-slider:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-slider:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-slider:disabled::-webkit-slider-thumb {
  cursor: not-allowed;
}

.color-slider:disabled::-moz-range-thumb {
  cursor: not-allowed;
}
</style>
