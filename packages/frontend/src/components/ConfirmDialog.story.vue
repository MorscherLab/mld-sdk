<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import type { ConfirmVariant } from '../types'

const variants: ConfirmVariant[] = ['danger', 'warning', 'info']

const dialogOpen = ref(false)
const dangerOpen = ref(false)
const warningOpen = ref(false)
const infoOpen = ref(false)
const loadingOpen = ref(false)
const isLoading = ref(false)

function handleConfirmLoading() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    loadingOpen.value = false
  }, 2000)
}
</script>

<template>
  <Story title="Layout/ConfirmDialog">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
            @click="dialogOpen = true"
          >
            Open Dialog
          </button>
          <ConfirmDialog
            v-model="dialogOpen"
            :title="state.title"
            :message="state.message"
            :variant="state.variant"
            :confirm-label="state.confirmLabel"
            :cancel-label="state.cancelLabel"
            :loading="state.loading"
            @confirm="dialogOpen = false"
            @cancel="dialogOpen = false"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.message" title="Message" />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstText v-model="state.confirmLabel" title="Confirm Label" />
        <HstText v-model="state.cancelLabel" title="Cancel Label" />
        <HstCheckbox v-model="state.loading" title="Loading" />
      </template>
    </Variant>

    <Variant title="Danger">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; background: #ef4444; color: #fff; cursor: pointer; font-size: 0.875rem;"
          @click="dangerOpen = true"
        >
          Delete Experiment
        </button>
        <ConfirmDialog
          v-model="dangerOpen"
          title="Delete Experiment"
          message="Are you sure you want to delete this experiment? All associated data, plates, and analysis results will be permanently removed. This action cannot be undone."
          variant="danger"
          confirm-label="Delete"
          @confirm="dangerOpen = false"
        />
      </div>
    </Variant>

    <Variant title="Warning">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid #f59e0b; border-radius: 0.375rem; background: var(--bg-card, #fff); color: #f59e0b; cursor: pointer; font-size: 0.875rem;"
          @click="warningOpen = true"
        >
          Reset Analysis
        </button>
        <ConfirmDialog
          v-model="warningOpen"
          title="Reset Analysis"
          message="This will discard all unsaved changes and reset the analysis to its initial state. Do you want to continue?"
          variant="warning"
          confirm-label="Reset"
          @confirm="warningOpen = false"
        />
      </div>
    </Variant>

    <Variant title="Info">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid #3b82f6; border-radius: 0.375rem; background: var(--bg-card, #fff); color: #3b82f6; cursor: pointer; font-size: 0.875rem;"
          @click="infoOpen = true"
        >
          Export Data
        </button>
        <ConfirmDialog
          v-model="infoOpen"
          title="Export Data"
          message="This will generate a CSV export of all 96 wells across 3 plates. The download will start automatically."
          variant="info"
          confirm-label="Export"
          @confirm="infoOpen = false"
        />
      </div>
    </Variant>

    <Variant title="With Loading State">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
          @click="loadingOpen = true"
        >
          Submit with Loading
        </button>
        <ConfirmDialog
          v-model="loadingOpen"
          title="Submit Results"
          message="Submit the analysis results to the platform? This may take a moment."
          variant="info"
          confirm-label="Submit"
          :loading="isLoading"
          @confirm="handleConfirmLoading"
        />
      </div>
    </Variant>
  </Story>
</template>
