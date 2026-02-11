<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import type { ModalSize } from '../types'

interface Props {
  modelValue: boolean
  title?: string
  size?: ModalSize
  closable?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeOnEscape: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

function close() {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

function handleOverlayClick(event: MouseEvent) {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    close()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (props.closeOnEscape && event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="mld-modal"
        @click="handleOverlayClick"
      >
        <!-- Overlay -->
        <div class="mld-modal__overlay" />

        <!-- Modal -->
        <div
          :class="[
            'mld-modal__container',
            `mld-modal__container--${size}`,
          ]"
          role="dialog"
          aria-modal="true"
        >
          <!-- Header -->
          <div v-if="title || closable" class="mld-modal__header">
            <h3 v-if="title" class="mld-modal__title">
              {{ title }}
            </h3>
            <button
              v-if="closable"
              type="button"
              class="mld-modal__close"
              aria-label="Close modal"
              @click="close"
            >
              <svg class="mld-modal__close-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="mld-modal__body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="mld-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
@import '../styles/components/modal.css';
</style>
