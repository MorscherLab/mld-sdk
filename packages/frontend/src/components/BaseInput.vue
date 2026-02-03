<script setup lang="ts">
import { computed } from 'vue'
import type { InputType } from '../types'

interface Props {
  modelValue?: string | number
  type?: InputType
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  autocomplete?: string
  autofocus?: boolean
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  error: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2.5 py-1.5 text-sm'
    case 'lg': return 'px-4 py-3 text-base'
    default: return 'px-3 py-2 text-sm'
  }
})

const inputClasses = computed(() => [
  'w-full rounded-mld border bg-bg-input text-text-primary placeholder:text-text-muted',
  'transition-colors duration-mld',
  'focus:outline-none focus:ring-2 focus:ring-mld-primary focus:border-transparent',
  sizeClasses.value,
  props.error
    ? 'border-mld-danger focus:ring-mld-danger'
    : 'border-border',
  props.disabled ? 'opacity-50 cursor-not-allowed bg-bg-hover' : '',
])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :autocomplete="autocomplete"
    :autofocus="autofocus"
    :min="min"
    :max="max"
    :step="step"
    :class="inputClasses"
    @input="handleInput"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="emit('keydown', $event)"
  />
</template>
