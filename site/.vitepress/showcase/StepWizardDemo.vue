<script setup lang="ts">
import { ref } from 'vue'
import { StepWizard } from '@morscherlab/mld-sdk'

const currentStep = ref(0)

const steps = [
  { id: 'setup', label: 'Setup' },
  { id: 'config', label: 'Configuration' },
  { id: 'review', label: 'Review' },
  { id: 'confirm', label: 'Confirm' },
]

function handleComplete() {
  alert('Wizard completed!')
  currentStep.value = 0
}
</script>

<template>
  <DemoSection title="Basic Wizard">
    <StepWizard
      v-model="currentStep"
      :steps="steps"
      @complete="handleComplete"
      @cancel="currentStep = 0"
    >
      <template #step-setup>
        <div class="p-4">
          <h3 class="font-semibold text-text-primary mb-2">Setup</h3>
          <p class="text-sm text-text-secondary">Configure basic experiment parameters.</p>
        </div>
      </template>
      <template #step-config>
        <div class="p-4">
          <h3 class="font-semibold text-text-primary mb-2">Configuration</h3>
          <p class="text-sm text-text-secondary">Set analysis options and thresholds.</p>
        </div>
      </template>
      <template #step-review>
        <div class="p-4">
          <h3 class="font-semibold text-text-primary mb-2">Review</h3>
          <p class="text-sm text-text-secondary">Review all settings before proceeding.</p>
        </div>
      </template>
      <template #step-confirm>
        <div class="p-4">
          <h3 class="font-semibold text-text-primary mb-2">Confirm</h3>
          <p class="text-sm text-text-secondary">Click Finish to submit.</p>
        </div>
      </template>
    </StepWizard>
  </DemoSection>
</template>
