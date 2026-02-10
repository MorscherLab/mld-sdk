<script setup lang="ts">
import { useToast } from '../composables/useToast'
import type { Toast } from '../types'

const { toasts, dismiss } = useToast()

const iconPaths: Record<Toast['type'], string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  warning: 'M12 9v2m0 4h.01M12 3l9.196 16H2.804L12 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const accentColors: Record<Toast['type'], string> = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
}
</script>

<template>
  <Teleport to="body">
    <div class="mld-toast__container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['mld-toast__item', `mld-toast__item--${toast.type}`]"
          :style="{
            borderLeftColor: accentColors[toast.type],
          }"
          role="alert"
          @click="dismiss(toast.id)"
        >
          <svg
            class="mld-toast__icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            :style="{ color: accentColors[toast.type] }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths[toast.type]" />
          </svg>
          <span class="mld-toast__message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
@import '../styles/components/toast.css';
</style>
