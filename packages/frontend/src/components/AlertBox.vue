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
</script>

<template>
  <div
    class="mld-alert"
    :class="`mld-alert--${props.type}`"
    role="alert"
  >
    <!-- Lucide circle-check -->
    <svg v-if="props.type === 'success'" class="mld-alert__icon mld-alert__icon--success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
    <!-- Lucide circle-x -->
    <svg v-else-if="props.type === 'error'" class="mld-alert__icon mld-alert__icon--error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
    </svg>
    <!-- Lucide triangle-alert -->
    <svg v-else-if="props.type === 'warning'" class="mld-alert__icon mld-alert__icon--warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
    <!-- Lucide info -->
    <svg v-else class="mld-alert__icon mld-alert__icon--info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
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
      <svg class="mld-alert__dismiss-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>

<style>
@import '../styles/components/alert-box.css';
</style>
