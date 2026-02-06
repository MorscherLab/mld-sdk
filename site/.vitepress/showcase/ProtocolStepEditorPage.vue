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
    concentration: { value: 100, unit: 'µM' },
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
  <div class="max-w-5xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">ProtocolStepEditor</h1>
    <p class="text-text-secondary mb-8">
      Template-based editor for creating and modifying protocol steps with type-specific parameter forms and live preview.
    </p>

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

    <!-- Step Types -->
    <div class="demo-section">
      <h3>Available Step Types</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="type in ['incubation', 'wash', 'addition', 'measurement', 'transfer', 'centrifuge', 'mix', 'custom'] as ProtocolStepType[]"
          :key="type"
          class="p-4 bg-bg-secondary rounded-lg border border-border"
        >
          <div class="text-sm font-medium text-text-primary capitalize mb-1">{{ type }}</div>
          <div class="text-xs text-text-muted">
            {{ {
              incubation: 'Temperature-controlled waiting period',
              wash: 'Remove and replace medium',
              addition: 'Add reagents, drugs, or samples',
              measurement: 'Take readings or images',
              transfer: 'Move between containers',
              centrifuge: 'Spin samples',
              mix: 'Pipette or shake mixing',
              custom: 'User-defined step type',
            }[type] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Template Parameters -->
    <div class="demo-section">
      <h3>Template Parameters</h3>
      <p class="text-sm text-text-secondary mb-4">
        Each step type has predefined parameters that can be customized.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <h4 class="font-medium text-text-primary mb-3">Addition Step</h4>
          <ul class="text-sm text-text-muted space-y-1">
            <li>- Reagent name (text)</li>
            <li>- Volume (number + unit)</li>
            <li>- Concentration (concentration input)</li>
            <li>- Dispense method (select)</li>
          </ul>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <h4 class="font-medium text-text-primary mb-3">Incubation Step</h4>
          <ul class="text-sm text-text-muted space-y-1">
            <li>- Temperature (number + C)</li>
            <li>- Duration (number + min/h)</li>
            <li>- CO2 percentage (number)</li>
            <li>- Humidity (checkbox)</li>
          </ul>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <h4 class="font-medium text-text-primary mb-3">Measurement Step</h4>
          <ul class="text-sm text-text-muted space-y-1">
            <li>- Measurement type (select)</li>
            <li>- Wavelength(s) (number + nm)</li>
            <li>- Gain setting (select/number)</li>
            <li>- Read mode (select)</li>
          </ul>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <h4 class="font-medium text-text-primary mb-3">Wash Step</h4>
          <ul class="text-sm text-text-muted space-y-1">
            <li>- Wash buffer (reagent)</li>
            <li>- Volume (number + unit)</li>
            <li>- Number of washes (number)</li>
            <li>- Aspiration setting (select)</li>
          </ul>
        </div>
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

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>ProtocolStep</code></td>
            <td><code>undefined</code></td>
            <td>Step to edit (v-model)</td>
          </tr>
          <tr>
            <td><code>templates</code></td>
            <td><code>StepTemplate[]</code></td>
            <td><code>undefined</code></td>
            <td>Override default templates</td>
          </tr>
          <tr>
            <td><code>customTemplates</code></td>
            <td><code>StepTemplate[]</code></td>
            <td><code>undefined</code></td>
            <td>Additional custom templates</td>
          </tr>
          <tr>
            <td><code>mode</code></td>
            <td><code>'create' | 'edit'</code></td>
            <td><code>'create'</code></td>
            <td>Editor mode</td>
          </tr>
          <tr>
            <td><code>showPreview</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show live preview card</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>ProtocolStep</code></td>
            <td>Step data changed</td>
          </tr>
          <tr>
            <td><code>save</code></td>
            <td><code>ProtocolStep</code></td>
            <td>Save/Add button clicked</td>
          </tr>
          <tr>
            <td><code>save-template</code></td>
            <td><code>StepTemplate</code></td>
            <td>Save as Template clicked</td>
          </tr>
          <tr>
            <td><code>cancel</code></td>
            <td>-</td>
            <td>Cancel button clicked</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Types -->
    <div class="demo-section">
      <h3>Types</h3>
      <pre class="code-block">interface ProtocolStep {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  duration?: number        // in minutes
  status: ProtocolStepStatus
  parameters?: Record&lt;string, unknown&gt;
  order: number
}

type ProtocolStepType =
  | 'incubation' | 'wash' | 'addition' | 'measurement'
  | 'transfer' | 'centrifuge' | 'mix' | 'custom'

type ProtocolStepStatus =
  | 'pending' | 'in_progress' | 'completed'
  | 'failed' | 'skipped'

interface StepTemplate {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  defaultDuration?: number
  parameters: ParameterDefinition[]
  isBuiltIn?: boolean
}

interface ParameterDefinition {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'concentration' | ...
  required?: boolean
  default?: unknown
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  unit?: string
}</pre>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;ProtocolStepEditor
  v-model="currentStep"
  mode="create"
  :custom-templates="myTemplates"
  show-preview
  @save="addStepToProtocol"
  @save-template="saveToLibrary"
  @cancel="closeEditor"
/&gt;</pre>
    </div>
  </div>
</template>
