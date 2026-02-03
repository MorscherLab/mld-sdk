<script setup lang="ts">
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
    :class="[
      'mld-textarea',
      `mld-textarea--${size}`,
      `mld-textarea--resize-${resize}`,
      error ? 'mld-textarea--error' : '',
      disabled ? 'mld-textarea--disabled' : '',
    ]"
    @input="handleInput"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>

<style>
@import '../styles/components/textarea.css';
</style>
