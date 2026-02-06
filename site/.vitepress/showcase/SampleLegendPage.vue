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
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">SampleLegend</h1>
    <p class="text-text-secondary mb-8">
      Color-coded legend for sample types with optional counts and editing capabilities.
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
            <td><code>string</code></td>
            <td><code>undefined</code></td>
            <td>Active sample type ID (v-model)</td>
          </tr>
          <tr>
            <td><code>samples</code></td>
            <td><code>SampleType[]</code></td>
            <td><code>[]</code></td>
            <td>Array of sample types to display</td>
          </tr>
          <tr>
            <td><code>showCounts</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show well count badges</td>
          </tr>
          <tr>
            <td><code>editable</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Allow adding/removing samples</td>
          </tr>
          <tr>
            <td><code>colorPalette</code></td>
            <td><code>string[]</code></td>
            <td>SDK palette</td>
            <td>Default colors for new samples</td>
          </tr>
          <tr>
            <td><code>orientation</code></td>
            <td><code>'vertical' | 'horizontal'</code></td>
            <td><code>'vertical'</code></td>
            <td>Layout orientation</td>
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
            <td><code>string | undefined</code></td>
            <td>Active sample changed</td>
          </tr>
          <tr>
            <td><code>sample-click</code></td>
            <td><code>SampleType</code></td>
            <td>Sample item clicked</td>
          </tr>
          <tr>
            <td><code>sample-add</code></td>
            <td>none</td>
            <td>Add button clicked</td>
          </tr>
          <tr>
            <td><code>sample-remove</code></td>
            <td><code>string</code></td>
            <td>Remove button clicked</td>
          </tr>
          <tr>
            <td><code>color-change</code></td>
            <td><code>sampleId, color</code></td>
            <td>Sample color changed</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;SampleLegend
  v-model="activeSample"
  :samples="[
    { id: 'control', name: 'Control', color: '#3B82F6', count: 8 },
    { id: 'treatment', name: 'Treatment', color: '#10B981', count: 16 },
  ]"
  editable
  @sample-add="handleAdd"
  @sample-remove="handleRemove"
/&gt;</pre>
    </div>
  </div>
</template>
