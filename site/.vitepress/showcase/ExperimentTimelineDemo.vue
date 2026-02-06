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
</template>
