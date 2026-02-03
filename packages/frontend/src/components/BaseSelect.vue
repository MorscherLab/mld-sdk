<script setup lang="ts">
import type { SelectOption } from '../types'

interface Props {
  modelValue?: string | number
  options: SelectOption<string | number>[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  error: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = typeof props.modelValue === 'number'
    ? Number(target.value)
    : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="mld-select">
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="[
        'mld-select__control',
        `mld-select__control--${size}`,
        error ? 'mld-select__control--error' : '',
        disabled ? 'mld-select__control--disabled' : '',
      ]"
      @change="handleChange"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="mld-select__icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>

<style>
@import '../styles/components/select.css';
</style>
