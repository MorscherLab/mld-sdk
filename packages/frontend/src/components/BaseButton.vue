<script setup lang="ts">
import type { ButtonVariant, ButtonSize } from '../types'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'mld-button',
      `mld-button--${variant}`,
      `mld-button--${size}`,
      fullWidth ? 'mld-button--full-width' : '',
      (disabled || loading) ? 'mld-button--disabled' : '',
    ]"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="mld-button__spinner"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        style="opacity: 0.25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        style="opacity: 0.75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>

<style>
@import '../styles/components/button.css';
</style>
