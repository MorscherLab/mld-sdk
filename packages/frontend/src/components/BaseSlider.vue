<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: true,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const isDragging = ref(false)

const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm': return { height: 4, thumb: 14 }
    case 'lg': return { height: 10, thumb: 24 }
    default: return { height: 6, thumb: 18 }
  }
})

const currentValue = computed(() => {
  return props.modelValue ?? props.min
})

const percentage = computed(() => {
  const range = props.max - props.min
  if (range === 0) return 0
  return ((currentValue.value - props.min) / range) * 100
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div class="mld-slider" :class="{ 'mld-slider--disabled': disabled }">
    <div class="mld-slider__container">
      <!-- Track background -->
      <div
        class="mld-slider__track"
        :style="{ height: `${sizeConfig.height}px` }"
      />

      <!-- Filled track -->
      <div
        class="mld-slider__fill"
        :style="{
          height: `${sizeConfig.height}px`,
          width: `${percentage}%`,
        }"
      />

      <!-- Native range input -->
      <input
        type="range"
        class="mld-slider__input"
        :value="currentValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-label="`Value: ${currentValue}`"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="currentValue"
        @input="handleInput"
        @mousedown="isDragging = true"
        @mouseup="isDragging = false"
        @touchstart.passive="isDragging = true"
        @touchend="isDragging = false"
      />

      <!-- Custom thumb -->
      <div
        class="mld-slider__thumb"
        :class="{ 'mld-slider__thumb--dragging': isDragging }"
        :style="{
          width: `${sizeConfig.thumb}px`,
          height: `${sizeConfig.thumb}px`,
          left: `${percentage}%`,
        }"
      />
    </div>

    <!-- Value display -->
    <span v-if="showValue" class="mld-slider__value">
      {{ currentValue }}
    </span>
  </div>
</template>

<style>
.mld-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mld-slider--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mld-slider__container {
  position: relative;
  flex: 1;
  height: 24px;
  display: flex;
  align-items: center;
}

.mld-slider__track {
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 9999px;
  background-color: #E2E8F0;
}

html.dark .mld-slider__track {
  background-color: #334155;
}

.mld-slider__fill {
  position: absolute;
  left: 0;
  border-radius: 9999px;
  background-color: #3B82F6;
}

.mld-slider__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
  margin: 0;
}

.mld-slider--disabled .mld-slider__input {
  cursor: not-allowed;
}

.mld-slider__thumb {
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 9999px;
  background-color: white;
  border: 2px solid #3B82F6;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  pointer-events: none;
  transition: transform 150ms ease;
}

.mld-slider__thumb--dragging {
  transform: translateX(-50%) translateY(-50%) scale(1.1);
}

.mld-slider__value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary, #64748B);
}
</style>
