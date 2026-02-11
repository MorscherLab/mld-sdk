<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  disabled: false,
  error: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const canDecrement = computed(() => {
  if (props.modelValue === undefined) return true
  if (props.min === undefined) return true
  return props.modelValue > props.min
})

const canIncrement = computed(() => {
  if (props.modelValue === undefined) return true
  if (props.max === undefined) return true
  return props.modelValue < props.max
})

function clamp(value: number): number {
  let result = value
  if (props.min !== undefined && result < props.min) result = props.min
  if (props.max !== undefined && result > props.max) result = props.max
  return result
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? undefined : Number(target.value)
  if (value !== undefined && !isNaN(value)) {
    emit('update:modelValue', clamp(value))
  } else {
    emit('update:modelValue', undefined)
  }
}

function decrement() {
  if (props.disabled || !canDecrement.value) return
  const current = props.modelValue ?? (props.max ?? 0)
  emit('update:modelValue', clamp(current - props.step))
}

function increment() {
  if (props.disabled || !canIncrement.value) return
  const current = props.modelValue ?? (props.min ?? 0)
  emit('update:modelValue', clamp(current + props.step))
}
</script>

<template>
  <div
    :class="[
      'mld-number-input',
      error ? 'mld-number-input--error' : '',
      disabled ? 'mld-number-input--disabled' : '',
    ]"
  >
    <button
      type="button"
      aria-label="Decrease value"
      :disabled="disabled || !canDecrement"
      :class="[
        'mld-number-input__button',
        'mld-number-input__button--decrement',
        `mld-number-input__button--${size}`,
      ]"
      @click="decrement"
    >
      <svg class="mld-number-input__button-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M5 12h14" />
      </svg>
    </button>

    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        'mld-number-input__input',
        `mld-number-input__input--${size}`,
        disabled ? 'mld-number-input__input--disabled' : '',
      ]"
      @input="handleInput"
    />

    <button
      type="button"
      aria-label="Increase value"
      :disabled="disabled || !canIncrement"
      :class="[
        'mld-number-input__button',
        'mld-number-input__button--increment',
        `mld-number-input__button--${size}`,
      ]"
      @click="increment"
    >
      <svg class="mld-number-input__button-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M5 12h14" /><path d="M12 5v14" />
      </svg>
    </button>
  </div>
</template>

<style>
@import '../styles/components/number-input.css';
</style>
