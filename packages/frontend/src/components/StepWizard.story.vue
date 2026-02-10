<script setup lang="ts">
import StepWizard from './StepWizard.vue'

const mockSteps = [
  { id: 'setup', label: 'Experiment Setup', description: 'Configure basic experiment parameters' },
  { id: 'samples', label: 'Sample Selection', description: 'Choose samples and assign groups' },
  { id: 'protocol', label: 'Protocol Design', description: 'Define the experimental protocol steps' },
  { id: 'review', label: 'Review & Submit', description: 'Review and finalize the experiment' },
]

const optionalSteps = [
  { id: 'setup', label: 'Setup' },
  { id: 'config', label: 'Configuration', optional: true },
  { id: 'validate', label: 'Validation' },
  { id: 'submit', label: 'Submit' },
]

function initState() {
  return {
    steps: mockSteps,
    currentStep: 0,
    linear: true,
    showProgress: true,
    showStepNumbers: true,
    size: 'md' as const,
  }
}
</script>

<template>
  <Story title="Workflow/StepWizard">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 700px;">
          <StepWizard
            v-model="state.currentStep"
            :steps="state.steps"
            :linear="state.linear"
            :show-progress="state.showProgress"
            :show-step-numbers="state.showStepNumbers"
            :size="state.size"
          >
            <template #step-setup>
              <div style="padding: 1.5rem;">
                <h3 style="margin: 0 0 0.5rem 0;">Experiment Setup</h3>
                <p style="margin: 0; color: #6b7280;">Configure your experiment name, type, and basic parameters.</p>
              </div>
            </template>
            <template #step-samples>
              <div style="padding: 1.5rem;">
                <h3 style="margin: 0 0 0.5rem 0;">Sample Selection</h3>
                <p style="margin: 0; color: #6b7280;">Select the samples you want to include and assign them to groups.</p>
              </div>
            </template>
            <template #step-protocol>
              <div style="padding: 1.5rem;">
                <h3 style="margin: 0 0 0.5rem 0;">Protocol Design</h3>
                <p style="margin: 0; color: #6b7280;">Design your experimental protocol with step-by-step instructions.</p>
              </div>
            </template>
            <template #step-review>
              <div style="padding: 1.5rem;">
                <h3 style="margin: 0 0 0.5rem 0;">Review & Submit</h3>
                <p style="margin: 0; color: #6b7280;">Review all settings and submit your experiment for processing.</p>
              </div>
            </template>
          </StepWizard>
        </div>
      </template>
      <template #controls="{ state }">
        <HstSlider v-model="state.currentStep" title="Current Step" :min="0" :max="3" />
        <HstCheckbox v-model="state.linear" title="Linear" />
        <HstCheckbox v-model="state.showProgress" title="Show Progress" />
        <HstCheckbox v-model="state.showStepNumbers" title="Show Step Numbers" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
      </template>
    </Variant>

    <Variant title="Non-Linear">
      <div style="padding: 2rem; max-width: 700px;">
        <StepWizard
          :steps="mockSteps"
          :model-value="1"
          :linear="false"
        >
          <template #step-setup>
            <div style="padding: 1.5rem;">Step 1 content (clickable from any step)</div>
          </template>
          <template #step-samples>
            <div style="padding: 1.5rem;">Step 2 content (active)</div>
          </template>
          <template #step-protocol>
            <div style="padding: 1.5rem;">Step 3 content</div>
          </template>
          <template #step-review>
            <div style="padding: 1.5rem;">Step 4 content</div>
          </template>
        </StepWizard>
      </div>
    </Variant>

    <Variant title="With Optional Steps">
      <div style="padding: 2rem; max-width: 700px;">
        <StepWizard
          :steps="optionalSteps"
          :model-value="0"
        >
          <template #step-setup>
            <div style="padding: 1.5rem;">Setup content</div>
          </template>
          <template #step-config>
            <div style="padding: 1.5rem;">Optional configuration step</div>
          </template>
          <template #step-validate>
            <div style="padding: 1.5rem;">Validation content</div>
          </template>
          <template #step-submit>
            <div style="padding: 1.5rem;">Submit content</div>
          </template>
        </StepWizard>
      </div>
    </Variant>

    <Variant title="Small">
      <div style="padding: 2rem; max-width: 500px;">
        <StepWizard
          :steps="mockSteps"
          :model-value="2"
          size="sm"
        >
          <template #step-setup>
            <div style="padding: 1rem; font-size: 0.875rem;">Setup</div>
          </template>
          <template #step-samples>
            <div style="padding: 1rem; font-size: 0.875rem;">Samples</div>
          </template>
          <template #step-protocol>
            <div style="padding: 1rem; font-size: 0.875rem;">Protocol (active)</div>
          </template>
          <template #step-review>
            <div style="padding: 1rem; font-size: 0.875rem;">Review</div>
          </template>
        </StepWizard>
      </div>
    </Variant>
  </Story>
</template>
