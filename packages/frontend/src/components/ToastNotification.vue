<script setup lang="ts">
import { useToast } from '../composables/useToast'
import type { Toast } from '../types'

const { toasts, dismiss } = useToast()

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
          <!-- Lucide circle-check -->
          <svg v-if="toast.type === 'success'" class="mld-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: accentColors[toast.type] }">
            <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
          </svg>
          <!-- Lucide circle-x -->
          <svg v-else-if="toast.type === 'error'" class="mld-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: accentColors[toast.type] }">
            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
          </svg>
          <!-- Lucide triangle-alert -->
          <svg v-else-if="toast.type === 'warning'" class="mld-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: accentColors[toast.type] }">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
          <!-- Lucide info -->
          <svg v-else class="mld-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: accentColors[toast.type] }">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
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
