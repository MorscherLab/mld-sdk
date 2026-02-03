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

const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm': return { input: 'px-2.5 py-1.5 text-sm', button: 'w-7' }
    case 'lg': return { input: 'px-4 py-3 text-base', button: 'w-10' }
    default: return { input: 'px-3 py-2 text-sm', button: 'w-8' }
  }
})

const containerClasses = computed(() => [
  'inline-flex rounded-mld border overflow-hidden',
  'transition-colors duration-mld',
  'focus-within:ring-2 focus-within:ring-mld-primary focus-within:border-transparent',
  props.error
    ? 'border-mld-danger focus-within:ring-mld-danger'
    : 'border-border',
  props.disabled ? 'opacity-50' : '',
])

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
  <div :class="containerClasses">
    <!-- Decrement button -->
    <button
      type="button"
      aria-label="Decrease value"
      :disabled="disabled || !canDecrement"
      :class="[
        sizeConfig.button,
        'flex items-center justify-center bg-bg-hover border-r border-border',
        'text-text-muted hover:text-text-primary hover:bg-bg-tertiary',
        'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      ]"
      @click="decrement"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
      </svg>
    </button>

    <!-- Input -->
    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        sizeConfig.input,
        'w-20 text-center bg-bg-input text-text-primary outline-none',
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
        disabled ? 'cursor-not-allowed bg-bg-hover' : '',
      ]"
      @input="handleInput"
    />

    <!-- Increment button -->
    <button
      type="button"
      aria-label="Increase value"
      :disabled="disabled || !canIncrement"
      :class="[
        sizeConfig.button,
        'flex items-center justify-center bg-bg-hover border-l border-border',
        'text-text-muted hover:text-text-primary hover:bg-bg-tertiary',
        'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      ]"
      @click="increment"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>
