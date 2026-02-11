<script setup lang="ts">
import BaseModal from './BaseModal.vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  variant?: 'danger' | 'warning' | 'info'
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  variant: 'danger',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    size="sm"
    :closable="!loading"
    :close-on-overlay="!loading"
    :close-on-escape="!loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="mld-confirm">
      <div :class="['mld-confirm__icon', `mld-confirm__icon--${variant}`]">
        <slot name="icon">
          <!-- Lucide triangle-alert for danger/warning -->
          <svg v-if="variant === 'danger' || variant === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
          <!-- Lucide info for info -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
        </slot>
      </div>
      <div class="mld-confirm__content">
        <h4 v-if="title" class="mld-confirm__title">{{ title }}</h4>
        <p v-if="message" class="mld-confirm__message">{{ message }}</p>
        <slot />
      </div>
    </div>

    <template #footer>
      <div class="mld-confirm__footer">
        <button
          type="button"
          class="mld-confirm__btn-cancel"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          :class="['mld-confirm__btn-confirm', `mld-confirm__btn-confirm--${variant}`]"
          :disabled="loading"
          @click="handleConfirm"
        >
          <svg v-if="loading" class="mld-confirm__btn-spinner" fill="none" viewBox="0 0 24 24">
            <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ confirmLabel }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<style>
@import '../styles/components/confirm-dialog.css';
</style>
