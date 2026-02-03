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

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-mld-primary hover:bg-mld-primary-hover text-white',
  secondary: 'bg-bg-secondary hover:bg-bg-hover text-text-primary border border-border',
  cta: 'bg-mld-cta hover:bg-mld-cta-hover text-white',
  danger: 'bg-mld-danger hover:bg-mld-danger-hover text-white',
  success: 'bg-mld-success hover:bg-mld-success-hover text-white',
  ghost: 'bg-transparent hover:bg-bg-hover text-text-secondary hover:text-text-primary',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

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
      'inline-flex items-center justify-center rounded-mld transition-colors duration-mld focus:outline-none focus:ring-2 focus:ring-mld-primary focus:ring-offset-2',
      variantClasses[variant],
      sizeClasses[size],
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      :class="['animate-spin', iconSizeClasses[size]]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span v-else :class="iconSizeClasses[size]">
      <slot />
    </span>
  </button>
</template>
