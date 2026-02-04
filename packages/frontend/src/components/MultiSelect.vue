<script setup lang="ts">
import { computed } from 'vue'
import type { MultiSelectOption, MultiSelectSize } from '../types'

interface Props {
  modelValue: (string | number)[]
  options: MultiSelectOption[]
  placeholder?: string
  disabled?: boolean
  maxSelections?: number
  size?: MultiSelectSize
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select options...',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
}>()

const canSelectMore = computed(() => {
  if (props.maxSelections === undefined) return true
  return props.modelValue.length < props.maxSelections
})

function isSelected(value: string | number): boolean {
  return props.modelValue.includes(value)
}

function toggleOption(option: MultiSelectOption) {
  if (props.disabled || option.disabled) return

  if (isSelected(option.value)) {
    emit('update:modelValue', props.modelValue.filter(v => v !== option.value))
  } else if (canSelectMore.value) {
    emit('update:modelValue', [...props.modelValue, option.value])
  }
}

function handleKeydown(event: KeyboardEvent, option: MultiSelectOption) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleOption(option)
  }
}

const selectedLabels = computed(() => {
  return props.modelValue
    .map(v => props.options.find(o => o.value === v)?.label)
    .filter(Boolean)
})
</script>

<template>
  <div
    :class="[
      'mld-multi-select',
      `mld-multi-select--${size}`,
      disabled ? 'mld-multi-select--disabled' : '',
    ]"
  >
    <div
      v-if="modelValue.length === 0"
      class="mld-multi-select__placeholder"
    >
      {{ placeholder }}
    </div>

    <div class="mld-multi-select__options" role="group">
      <button
        v-for="option in options"
        :key="String(option.value)"
        type="button"
        role="checkbox"
        :aria-checked="isSelected(option.value)"
        :disabled="disabled || option.disabled || (!isSelected(option.value) && !canSelectMore)"
        :class="[
          'mld-multi-select__chip',
          `mld-multi-select__chip--${size}`,
          isSelected(option.value) ? 'mld-multi-select__chip--active' : '',
          option.disabled ? 'mld-multi-select__chip--disabled' : '',
          !isSelected(option.value) && !canSelectMore ? 'mld-multi-select__chip--disabled' : '',
        ]"
        @click="toggleOption(option)"
        @keydown="handleKeydown($event, option)"
      >
        <span class="mld-multi-select__chip-label">{{ option.label }}</span>
        <svg
          v-if="isSelected(option.value)"
          class="mld-multi-select__chip-check"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>

    <div
      v-if="modelValue.length > 0"
      class="mld-multi-select__summary"
    >
      {{ selectedLabels.join(', ') }}
    </div>
  </div>
</template>

<style>
@import '../styles/components/multi-select.css';
</style>
