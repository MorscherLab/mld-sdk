<script setup lang="ts">
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
    :class="[
      'mld-input',
      `mld-input--${size}`,
      error ? 'mld-input--error' : '',
      disabled ? 'mld-input--disabled' : '',
    ]"
    @input="handleInput"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="emit('keydown', $event)"
  />
</template>

<style>
@import '../styles/components/input.css';
</style>
