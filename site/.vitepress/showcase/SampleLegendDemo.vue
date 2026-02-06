<script setup lang="ts">
import { ref } from 'vue'
import { SampleLegend, BaseToggle, BaseSelect, type SampleType } from '@morscherlab/mld-sdk'

const activeSampleId = ref<string | undefined>('control')
const showCounts = ref(true)
const editable = ref(false)
const orientation = ref<'vertical' | 'horizontal'>('vertical')
const size = ref<'sm' | 'md' | 'lg'>('md')

const samples = ref<SampleType[]>([
  { id: 'control', name: 'Control', color: '#3B82F6', count: 8 },
  { id: 'treatment-a', name: 'Treatment A', color: '#10B981', count: 16 },
  { id: 'treatment-b', name: 'Treatment B', color: '#8B5CF6', count: 16 },
  { id: 'blank', name: 'Blank', color: '#6B7280', count: 4 },
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

function handleSampleClick(sample: SampleType) {
  console.log('Sample clicked:', sample)
}

function handleSampleAdd() {
  const id = `sample-${Date.now()}`
  samples.value.push({
    id,
    name: `Sample ${samples.value.length + 1}`,
    count: 0,
  })
}

function handleSampleRemove(sampleId: string) {
  const index = samples.value.findIndex(s => s.id === sampleId)
  if (index !== -1) {
    samples.value.splice(index, 1)
  }
  if (activeSampleId.value === sampleId) {
    activeSampleId.value = undefined
  }
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
        <BaseToggle v-model="showCounts" size="sm" />
        <span class="text-sm text-text-secondary">Show Counts</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="editable" size="sm" />
        <span class="text-sm text-text-secondary">Editable</span>
      </div>
    </div>

    <div class="p-4 bg-bg-secondary rounded-lg border border-border">
      <SampleLegend
        v-model="activeSampleId"
        :samples="samples"
        :show-counts="showCounts"
        :editable="editable"
        :orientation="orientation"
        :size="size"
        @sample-click="handleSampleClick"
        @sample-add="handleSampleAdd"
        @sample-remove="handleSampleRemove"
      />
    </div>

    <div v-if="activeSampleId" class="mt-4 p-3 bg-mld-primary/10 rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>Active:</strong> {{ samples.find(s => s.id === activeSampleId)?.name }}
      </p>
    </div>
  </div>

  <!-- Orientations -->
  <div class="demo-section">
    <h3>Orientations</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p class="text-sm text-text-muted mb-2">Vertical</p>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <SampleLegend
            :samples="samples"
            orientation="vertical"
          />
        </div>
      </div>
      <div>
        <p class="text-sm text-text-muted mb-2">Horizontal</p>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <SampleLegend
            :samples="samples"
            orientation="horizontal"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Sizes -->
  <div class="demo-section">
    <h3>Sizes</h3>
    <div class="grid grid-cols-3 gap-6">
      <div v-for="s in ['sm', 'md', 'lg'] as const" :key="s">
        <p class="text-sm text-text-muted mb-2 capitalize">{{ s }}</p>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <SampleLegend
            :samples="samples.slice(0, 3)"
            :size="s"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Editable Mode -->
  <div class="demo-section">
    <h3>Editable Mode</h3>
    <p class="text-sm text-text-secondary mb-4">
      When editable, users can add new sample types and remove existing ones.
    </p>
    <div class="p-4 bg-bg-secondary rounded-lg border border-border max-w-xs">
      <SampleLegend
        v-model="activeSampleId"
        :samples="samples"
        editable
        @sample-add="handleSampleAdd"
        @sample-remove="handleSampleRemove"
      />
    </div>
  </div>
</template>
