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
@import '../styles/components/slider.css';
</style>
