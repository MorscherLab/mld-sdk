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

const iconPaths: Record<AlertType, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  warning: 'M12 9v2m0 4h.01M12 3l9.196 16H2.804L12 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}
</script>

<template>
  <div
    class="mld-alert"
    :class="`mld-alert--${props.type}`"
    role="alert"
  >
    <svg
      class="mld-alert__icon"
      :class="`mld-alert__icon--${props.type}`"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths[props.type]" />
    </svg>

    <div class="mld-alert__content">
      <h4 v-if="props.title" class="mld-alert__title">
        {{ props.title }}
      </h4>
      <div class="mld-alert__message">
        <slot />
      </div>
    </div>

    <button
      v-if="props.dismissible"
      type="button"
      class="mld-alert__dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <svg class="mld-alert__dismiss-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style>
@import '../styles/components/alert-box.css';
</style>
