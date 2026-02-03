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

const bgColors: Record<Toast['type'], string> = {
  success: 'rgba(16, 185, 129, 0.15)',
  error: 'rgba(239, 68, 68, 0.15)',
  warning: 'rgba(245, 158, 11, 0.15)',
  info: 'rgba(59, 130, 246, 0.15)',
}

const borderColors: Record<Toast['type'], string> = {
  success: 'rgba(16, 185, 129, 0.4)',
  error: 'rgba(239, 68, 68, 0.4)',
  warning: 'rgba(245, 158, 11, 0.4)',
  info: 'rgba(59, 130, 246, 0.4)',
}

const iconColors: Record<Toast['type'], string> = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-2 px-4 py-3 rounded-mld shadow-mld-lg pointer-events-auto cursor-pointer max-w-sm"
          :style="{
            backgroundColor: bgColors[toast.type],
            border: `1px solid ${borderColors[toast.type]}`,
            backdropFilter: 'blur(8px)',
          }"
          role="alert"
          @click="dismiss(toast.id)"
        >
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            :style="{ color: iconColors[toast.type] }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths[toast.type]" />
          </svg>
          <span class="text-sm text-text-primary">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
