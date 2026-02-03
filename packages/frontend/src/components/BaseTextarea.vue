<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  rows?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  error: false,
  size: 'md',
  rows: 3,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2.5 py-1.5 text-sm'
    case 'lg': return 'px-4 py-3 text-base'
    default: return 'px-3 py-2 text-sm'
  }
})

const resizeClass = computed(() => {
  switch (props.resize) {
    case 'none': return 'resize-none'
    case 'horizontal': return 'resize-x'
    case 'both': return 'resize'
    default: return 'resize-y'
  }
})

const textareaClasses = computed(() => [
  'w-full rounded-mld border bg-bg-input text-text-primary placeholder:text-text-muted',
  'transition-colors duration-mld',
  'focus:outline-none focus:ring-2 focus:ring-mld-primary focus:border-transparent',
  sizeClasses.value,
  resizeClass.value,
  props.error
    ? 'border-mld-danger focus:ring-mld-danger'
    : 'border-border',
  props.disabled ? 'opacity-50 cursor-not-allowed bg-bg-hover' : '',
])

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    :maxlength="maxlength"
    :class="textareaClasses"
    @input="handleInput"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>
