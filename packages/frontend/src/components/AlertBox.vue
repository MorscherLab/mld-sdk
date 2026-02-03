<script setup lang="ts">
import type { AlertType } from '../types'

interface Props {
  type?: AlertType
  title?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const typeConfig: Record<AlertType, { bgColor: string; borderColor: string; icon: string; iconColor: string }> = {
  success: {
    bgColor: 'var(--mld-success-bg)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: 'M5 13l4 4L19 7',
    iconColor: 'text-mld-success',
  },
  error: {
    bgColor: 'var(--mld-error-bg)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    icon: 'M6 18L18 6M6 6l12 12',
    iconColor: 'text-mld-danger',
  },
  warning: {
    bgColor: 'var(--mld-warning-bg)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: 'M12 9v2m0 4h.01M12 3l9.196 16H2.804L12 3z',
    iconColor: 'text-mld-warning',
  },
  info: {
    bgColor: 'var(--mld-info-bg)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconColor: 'text-mld-primary',
  },
}

const config = typeConfig[props.type]
</script>

<template>
  <div
    class="flex items-start gap-3 p-4 border"
    :style="{ backgroundColor: config.bgColor, borderColor: config.borderColor, borderRadius: '0.5rem' }"
    role="alert"
  >
    <svg
      :class="['w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="config.icon" />
    </svg>

    <div class="flex-1 min-w-0">
      <h4 v-if="title" class="text-sm font-medium text-text-primary mb-1">
        {{ title }}
      </h4>
      <div class="text-sm text-text-secondary">
        <slot />
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="p-1 rounded-mld-sm text-text-muted hover:text-text-primary transition-colors"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
