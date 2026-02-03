<script setup lang="ts">
import { computed } from 'vue'
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

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2.5 py-1.5 text-sm'
    case 'lg': return 'px-4 py-3 text-base'
    default: return 'px-3 py-2 text-sm'
  }
})

const selectClasses = computed(() => [
  'w-full rounded-mld border bg-bg-input text-text-primary appearance-none cursor-pointer',
  'transition-colors duration-mld',
  'focus:outline-none focus:ring-2 focus:ring-mld-primary focus:border-transparent',
  'pr-10', // Space for chevron
  sizeClasses.value,
  props.error
    ? 'border-mld-danger focus:ring-mld-danger'
    : 'border-border',
  props.disabled ? 'opacity-50 cursor-not-allowed bg-bg-hover' : '',
])

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = typeof props.modelValue === 'number'
    ? Number(target.value)
    : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
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
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg
        class="h-4 w-4 text-text-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
