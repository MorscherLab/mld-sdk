<script setup lang="ts">
import type { ButtonVariant, ButtonSize } from '../types'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  label: string // Required for accessibility
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  loading: false,
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
    type="button"
    :disabled="disabled || loading"
    :aria-label="label"
    :title="label"
    :class="[
      'mld-icon-button',
      `mld-icon-button--${variant}`,
      `mld-icon-button--${size}`,
      (disabled || loading) ? 'mld-icon-button--disabled' : '',
    ]"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      :class="['mld-icon-button__spinner', `mld-icon-button__icon--${size}`]"
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
    <span v-else :class="`mld-icon-button__icon--${size}`">
      <slot />
    </span>
  </button>
</template>

<style>
@import '../styles/components/icon-button.css';
</style>
