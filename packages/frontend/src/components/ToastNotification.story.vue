<script setup lang="ts">
import ToastNotification from './ToastNotification.vue'
import { useToast } from '../composables/useToast'

const toast = useToast()

function showSuccess() {
  toast.success('Analysis completed successfully.')
}

function showError() {
  toast.error('Failed to process plate data. Please try again.')
}

function showWarning() {
  toast.warning('3 wells have missing sample assignments.')
}

function showInfo() {
  toast.info('Export file is being generated...')
}

function showAll() {
  toast.success('Experiment saved.')
  setTimeout(() => toast.info('Syncing with platform...'), 300)
  setTimeout(() => toast.warning('Low disk space detected.'), 600)
  setTimeout(() => toast.error('Connection timeout on retry.'), 900)
}
</script>

<template>
  <Story title="Feedback/ToastNotification">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <p style="margin: 0; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">
            Click a button to trigger a toast notification.
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
            <button
              type="button"
              style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #10b981; color: #fff; cursor: pointer; font-size: 0.875rem;"
              @click="toast.success(state.message || 'Success!')"
            >
              Success
            </button>
            <button
              type="button"
              style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #ef4444; color: #fff; cursor: pointer; font-size: 0.875rem;"
              @click="toast.error(state.message || 'Error!')"
            >
              Error
            </button>
            <button
              type="button"
              style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #f59e0b; color: #fff; cursor: pointer; font-size: 0.875rem;"
              @click="toast.warning(state.message || 'Warning!')"
            >
              Warning
            </button>
            <button
              type="button"
              style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #3b82f6; color: #fff; cursor: pointer; font-size: 0.875rem;"
              @click="toast.info(state.message || 'Info!')"
            >
              Info
            </button>
          </div>
          <ToastNotification />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.message" title="Message" />
      </template>
    </Variant>

    <Variant title="All Types">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #10b981; color: #fff; cursor: pointer; font-size: 0.875rem;"
            @click="showSuccess"
          >
            Success Toast
          </button>
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #ef4444; color: #fff; cursor: pointer; font-size: 0.875rem;"
            @click="showError"
          >
            Error Toast
          </button>
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #f59e0b; color: #fff; cursor: pointer; font-size: 0.875rem;"
            @click="showWarning"
          >
            Warning Toast
          </button>
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #3b82f6; color: #fff; cursor: pointer; font-size: 0.875rem;"
            @click="showInfo"
          >
            Info Toast
          </button>
        </div>
        <ToastNotification />
      </div>
    </Variant>

    <Variant title="Multiple Toasts">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
          @click="showAll"
        >
          Show All Types (stacked)
        </button>
        <p style="margin: 0; color: var(--text-muted, #94a3b8); font-size: 0.75rem;">
          Click to see multiple toasts stacked. Click any toast to dismiss it.
        </p>
        <ToastNotification />
      </div>
    </Variant>
  </Story>
</template>
