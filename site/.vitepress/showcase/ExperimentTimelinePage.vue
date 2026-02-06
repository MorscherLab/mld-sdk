<script setup lang="ts">
import { ref } from 'vue'
import { ExperimentTimeline, BaseSelect, BaseToggle, type ProtocolStep, type ProtocolStepType, type ProtocolStepStatus } from '@morscherlab/mld-sdk'

const orientation = ref<'horizontal' | 'vertical'>('vertical')
const showDuration = ref(true)
const editable = ref(false)
const collapsible = ref(true)
const size = ref<'sm' | 'md' | 'lg'>('md')
const colorByStatus = ref(true)
const colorByType = ref(false)
const expandedStepId = ref<string | undefined>(undefined)

const steps = ref<ProtocolStep[]>([
  {
    id: 'step-1',
    type: 'addition',
    name: 'Add Cells',
    description: 'Seed cells at 10,000 cells/well in complete medium',
    duration: 15,
    status: 'completed',
    parameters: {
      'Cell density': '10,000 cells/well',
      'Volume': '100 uL',
      'Medium': 'DMEM + 10% FBS',
    },
    order: 0,
  },
  {
    id: 'step-2',
    type: 'incubation',
    name: 'Incubate Overnight',
    description: 'Allow cells to adhere and recover',
    duration: 960,
    status: 'completed',
    parameters: {
      'Temperature': '37C',
      'CO2': '5%',
    },
    order: 1,
  },
  {
    id: 'step-3',
    type: 'addition',
    name: 'Add Treatment',
    description: 'Add drug dilutions to designated wells',
    duration: 30,
    status: 'in_progress',
    parameters: {
      'Concentrations': '0.1-100 uM',
      'Vehicle': '0.1% DMSO',
    },
    order: 2,
  },
  {
    id: 'step-4',
    type: 'incubation',
    name: 'Treatment Incubation',
    description: 'Incubate with treatment for 24 hours',
    duration: 1440,
    status: 'pending',
    parameters: {
      'Temperature': '37C',
      'Duration': '24 hours',
    },
    order: 3,
  },
  {
    id: 'step-5',
    type: 'wash',
    name: 'Wash Cells',
    description: 'Remove medium and wash with PBS',
    duration: 10,
    status: 'pending',
    parameters: {
      'Buffer': 'PBS',
      'Washes': '2x',
    },
    order: 4,
  },
  {
    id: 'step-6',
    type: 'measurement',
    name: 'Read Plate',
    description: 'Measure fluorescence at 485/535 nm',
    duration: 15,
    status: 'pending',
    parameters: {
      'Excitation': '485 nm',
      'Emission': '535 nm',
      'Gain': 'Auto',
    },
    order: 5,
  },
])

const orientationOptions = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
]

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

function handleStepClick(step: ProtocolStep) {
  console.log('Step clicked:', step)
}

function handleStepExpand(stepId: string | undefined) {
  expandedStepId.value = stepId
}

function handleStepAdd(afterStepId?: string) {
  const newStep: ProtocolStep = {
    id: `step-${Date.now()}`,
    type: 'custom',
    name: 'New Step',
    status: 'pending',
    order: afterStepId
      ? steps.value.findIndex(s => s.id === afterStepId) + 1
      : steps.value.length,
  }

  if (afterStepId) {
    const index = steps.value.findIndex(s => s.id === afterStepId)
    steps.value.splice(index + 1, 0, newStep)
    steps.value = steps.value.map((s, i) => ({ ...s, order: i }))
  } else {
    steps.value.push(newStep)
  }
}

function handleStepRemove(stepId: string) {
  steps.value = steps.value.filter(s => s.id !== stepId).map((s, i) => ({ ...s, order: i }))
}

function handleStepReorder(stepId: string, newOrder: number) {
  console.log('Step reordered:', stepId, 'to', newOrder)
}

function handleStatusChange(stepId: string, status: ProtocolStepStatus) {
  console.log('Status changed:', stepId, status)
}

function handleColorByStatusChange(value: boolean) {
  colorByStatus.value = value
  if (value) colorByType.value = false
}

function handleColorByTypeChange(value: boolean) {
  colorByType.value = value
  if (value) colorByStatus.value = false
}
</script>

<template>
  <div class="max-w-5xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">ExperimentTimeline</h1>
    <p class="text-text-secondary mb-8">
      Visual timeline for protocol steps with status tracking, expandable details, and drag-to-reorder support.
    </p>

    <!-- Interactive Demo -->
    <div class="demo-section">
      <h3>Interactive Demo</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
        <div>
          <label class="block text-sm text-text-secondary mb-1">Orientation</label>
          <BaseSelect v-model="orientation" :options="orientationOptions" size="sm" />
        </div>
        <div>
          <label class="block text-sm text-text-secondary mb-1">Size</label>
          <BaseSelect v-model="size" :options="sizeOptions" size="sm" />
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="showDuration" size="sm" />
          <span class="text-sm text-text-secondary">Show Duration</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="collapsible" size="sm" />
          <span class="text-sm text-text-secondary">Collapsible</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="editable" size="sm" />
          <span class="text-sm text-text-secondary">Editable</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle :model-value="colorByStatus" size="sm" @update:model-value="handleColorByStatusChange" />
          <span class="text-sm text-text-secondary">Color by Status</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle :model-value="colorByType" size="sm" @update:model-value="handleColorByTypeChange" />
          <span class="text-sm text-text-secondary">Color by Type</span>
        </div>
      </div>

      <div :class="orientation === 'horizontal' ? 'overflow-x-auto pb-4' : ''">
        <ExperimentTimeline
          v-model="steps"
          :orientation="orientation"
          :show-duration="showDuration"
          :editable="editable"
          :collapsible="collapsible"
          :expanded-step-id="expandedStepId"
          :size="size"
          :color-by-status="colorByStatus"
          :color-by-type="colorByType"
          @step-click="handleStepClick"
          @step-expand="handleStepExpand"
          @step-add="handleStepAdd"
          @step-remove="handleStepRemove"
          @step-reorder="handleStepReorder"
          @step-status-change="handleStatusChange"
        />
      </div>
    </div>

    <!-- Step Types -->
    <div class="demo-section">
      <h3>Step Types</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="type in ['incubation', 'wash', 'addition', 'measurement', 'transfer', 'centrifuge', 'mix', 'custom'] as ProtocolStepType[]" :key="type" class="p-3 bg-bg-secondary rounded-lg border border-border">
          <div class="text-sm font-medium text-text-primary capitalize">{{ type }}</div>
          <div class="text-xs text-text-muted mt-1">
            {{ {
              incubation: 'Temperature-controlled waiting',
              wash: 'Remove and replace medium',
              addition: 'Add reagents or samples',
              measurement: 'Take readings',
              transfer: 'Move samples between plates',
              centrifuge: 'Spin samples',
              mix: 'Pipette mixing',
              custom: 'User-defined step',
            }[type] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Status States -->
    <div class="demo-section">
      <h3>Status States</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div v-for="status in ['pending', 'in_progress', 'completed', 'failed', 'skipped'] as ProtocolStepStatus[]" :key="status" class="p-3 rounded-lg border-2" :class="{
          'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600': status === 'pending' || status === 'skipped',
          'bg-blue-100 dark:bg-blue-900/30 border-blue-400': status === 'in_progress',
          'bg-green-100 dark:bg-green-900/30 border-green-400': status === 'completed',
          'bg-red-100 dark:bg-red-900/30 border-red-400': status === 'failed',
        }">
          <div class="text-sm font-medium capitalize" :class="{
            'text-gray-600 dark:text-gray-400': status === 'pending',
            'text-gray-400 dark:text-gray-500': status === 'skipped',
            'text-blue-600 dark:text-blue-400': status === 'in_progress',
            'text-green-600 dark:text-green-400': status === 'completed',
            'text-red-600 dark:text-red-400': status === 'failed',
          }">
            {{ status.replace('_', ' ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Horizontal Layout -->
    <div class="demo-section">
      <h3>Horizontal Layout</h3>
      <p class="text-sm text-text-secondary mb-4">
        Use horizontal orientation for compact timeline views.
      </p>
      <div class="overflow-x-auto pb-4">
        <ExperimentTimeline
          :model-value="steps.slice(0, 4)"
          orientation="horizontal"
          size="sm"
          :collapsible="false"
        />
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
            <td><code>ProtocolStep[]</code></td>
            <td><code>[]</code></td>
            <td>Protocol steps (v-model)</td>
          </tr>
          <tr>
            <td><code>orientation</code></td>
            <td><code>'horizontal' | 'vertical'</code></td>
            <td><code>'vertical'</code></td>
            <td>Timeline layout direction</td>
          </tr>
          <tr>
            <td><code>showDuration</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show duration labels</td>
          </tr>
          <tr>
            <td><code>editable</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Enable editing and reordering</td>
          </tr>
          <tr>
            <td><code>collapsible</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Allow expanding step details</td>
          </tr>
          <tr>
            <td><code>expandedStepId</code></td>
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>Currently expanded step</td>
          </tr>
          <tr>
            <td><code>colorByStatus</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Color steps by status</td>
          </tr>
          <tr>
            <td><code>colorByType</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Color steps by type</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Size preset</td>
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
            <td><code>ProtocolStep[]</code></td>
            <td>Steps array changed</td>
          </tr>
          <tr>
            <td><code>step-click</code></td>
            <td><code>ProtocolStep</code></td>
            <td>Step clicked</td>
          </tr>
          <tr>
            <td><code>step-expand</code></td>
            <td><code>string | undefined</code></td>
            <td>Step expanded/collapsed</td>
          </tr>
          <tr>
            <td><code>step-add</code></td>
            <td><code>afterStepId?</code></td>
            <td>Add step requested</td>
          </tr>
          <tr>
            <td><code>step-remove</code></td>
            <td><code>stepId</code></td>
            <td>Step removed</td>
          </tr>
          <tr>
            <td><code>step-reorder</code></td>
            <td><code>stepId, newOrder</code></td>
            <td>Step dragged to new position</td>
          </tr>
          <tr>
            <td><code>step-status-change</code></td>
            <td><code>stepId, status</code></td>
            <td>Status changed (in edit mode)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ProtocolStep Type -->
    <div class="demo-section">
      <h3>ProtocolStep Type</h3>
      <pre class="code-block">interface ProtocolStep {
  id: string
  type: ProtocolStepType  // 'incubation' | 'wash' | 'addition' | ...
  name: string
  description?: string
  duration?: number       // in minutes
  status: ProtocolStepStatus  // 'pending' | 'in_progress' | ...
  parameters?: Record&lt;string, unknown&gt;
  order: number
}</pre>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;ExperimentTimeline
  v-model="protocolSteps"
  orientation="vertical"
  editable
  collapsible
  @step-click="handleClick"
  @step-status-change="handleStatusChange"
/&gt;</pre>
    </div>
  </div>
</template>
