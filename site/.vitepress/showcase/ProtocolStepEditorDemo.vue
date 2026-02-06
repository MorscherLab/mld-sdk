<script setup lang="ts">
import { ref } from 'vue'
import { ProtocolStepEditor, BaseToggle, type ProtocolStep, type ProtocolStepType } from '@morscherlab/mld-sdk'

const mode = ref<'create' | 'edit'>('create')
const showPreview = ref(true)

// Demo step for edit mode
const editStep = ref<ProtocolStep>({
  id: 'step-edit-1',
  type: 'addition',
  name: 'Add Treatment',
  description: 'Add drug dilutions to designated wells',
  duration: 30,
  status: 'pending',
  parameters: {
    concentration: { value: 100, unit: 'uM' },
    volume: 100,
  },
  order: 0,
})

const newStep = ref<ProtocolStep | undefined>(undefined)

const savedTemplates = ref<unknown[]>([])

function handleSave(step: ProtocolStep) {
  console.log('Step saved:', step)
  if (mode.value === 'create') {
    newStep.value = step
  }
}

function handleSaveTemplate(template: unknown) {
  console.log('Template saved:', template)
  savedTemplates.value.push(template)
}

function handleCancel() {
  console.log('Cancelled')
}

function toggleMode() {
  mode.value = mode.value === 'create' ? 'edit' : 'create'
}
</script>

<template>
  <!-- Interactive Demo -->
  <div class="demo-section">
    <h3>Interactive Demo</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
      <div class="flex items-center gap-2">
        <BaseToggle :model-value="mode === 'edit'" size="sm" @update:model-value="toggleMode" />
        <span class="text-sm text-text-secondary">Edit Mode</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showPreview" size="sm" />
        <span class="text-sm text-text-secondary">Show Preview</span>
      </div>
    </div>

    <div class="max-w-lg">
      <ProtocolStepEditor
        :model-value="mode === 'edit' ? editStep : undefined"
        :mode="mode"
        :show-preview="showPreview"
        @save="handleSave"
        @save-template="handleSaveTemplate"
        @cancel="handleCancel"
      />
    </div>

    <div v-if="newStep && mode === 'create'" class="mt-4 p-3 bg-bg-secondary rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>Created Step:</strong> {{ newStep.name }} ({{ newStep.type }})
      </p>
    </div>
  </div>

  <!-- Custom Templates -->
  <div class="demo-section">
    <h3>Custom Templates</h3>
    <p class="text-sm text-text-secondary mb-4">
      Save frequently used configurations as custom templates for reuse.
    </p>
    <div v-if="savedTemplates.length > 0" class="p-4 bg-bg-secondary rounded-lg border border-border">
      <p class="text-sm text-text-muted">{{ savedTemplates.length }} custom template(s) saved</p>
    </div>
    <div v-else class="p-4 bg-bg-secondary rounded-lg border border-border text-sm text-text-muted">
      No custom templates yet. Create a step and click "Save as Template" to add one.
    </div>
  </div>
</template>
