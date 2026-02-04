<script setup lang="ts">
import type { SegmentedOption, SegmentedControlVariant, SegmentedControlSize } from '../types'

interface Props {
  modelValue: string | number
  options: SegmentedOption[]
  variant?: SegmentedControlVariant
  size?: SegmentedControlSize
  fullWidth?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'simple',
  size: 'md',
  fullWidth: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function handleSelect(option: SegmentedOption) {
  if (props.disabled || option.disabled) return
  emit('update:modelValue', option.value)
}

function handleKeydown(event: KeyboardEvent, option: SegmentedOption) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSelect(option)
  }
}
</script>

<template>
  <div
    :class="[
      'mld-segmented-control',
      `mld-segmented-control--${variant}`,
      `mld-segmented-control--${size}`,
      fullWidth ? 'mld-segmented-control--full-width' : '',
      disabled ? 'mld-segmented-control--disabled' : '',
    ]"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="String(option.value)"
      type="button"
      role="radio"
      :aria-checked="modelValue === option.value"
      :disabled="disabled || option.disabled"
      :class="[
        'mld-segmented-control__option',
        `mld-segmented-control__option--${variant}`,
        `mld-segmented-control__option--${size}`,
        modelValue === option.value ? 'mld-segmented-control__option--active' : '',
        option.disabled ? 'mld-segmented-control__option--disabled' : '',
      ]"
      @click="handleSelect(option)"
      @keydown="handleKeydown($event, option)"
    >
      <span class="mld-segmented-control__label">{{ option.label }}</span>
      <span
        v-if="option.description && variant === 'card'"
        class="mld-segmented-control__description"
      >
        {{ option.description }}
      </span>
    </button>
  </div>
</template>

<style>
@import '../styles/components/segmented-control.css';
</style>
