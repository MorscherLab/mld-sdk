<script setup lang="ts">
import { ref, computed } from 'vue'
import { SampleSelector, type SampleGroup } from '@morscherlab/mld-sdk'

// Realistic sample data with hierarchical naming
const samples = [
  'Project1/Experiment1/Control_001',
  'Project1/Experiment1/Control_002',
  'Project1/Experiment1/Control_003',
  'Project1/Experiment1/Treatment_001',
  'Project1/Experiment1/Treatment_002',
  'Project1/Experiment1/Treatment_003',
  'Project1/Experiment2/Control_001',
  'Project1/Experiment2/Control_002',
  'Project1/Experiment2/Treatment_001',
  'Project1/Experiment2/Treatment_002',
  'Project2/Batch1/Sample_001',
  'Project2/Batch1/Sample_002',
  'Project2/Batch1/Sample_003',
  'Project2/Batch2/Sample_001',
  'Project2/Batch2/Sample_002',
]

const selectedSamples = ref<string[]>([])
const groups = ref<SampleGroup[]>([])

// Simple example
const simpleSamples = ['Sample_1', 'Sample_2', 'Sample_3', 'Sample_4', 'Sample_5']
const simpleSelected = ref<string[]>(['Sample_1', 'Sample_3'])
const simpleGroups = ref<SampleGroup[]>([])

// Pre-grouped example with hierarchical structure
const preGroupedSamples = [
  'WT_Rep1', 'WT_Rep2', 'WT_Rep3',
  'KO_Rep1', 'KO_Rep2', 'KO_Rep3',
  'Treated_Rep1', 'Treated_Rep2', 'Treated_Rep3',
]
const preGroupedSelected = ref<string[]>(preGroupedSamples)
const preGroupedGroups = ref<SampleGroup[]>([
  { name: 'Wild Type', color: '#3B82F6', samples: ['WT_Rep1', 'WT_Rep2', 'WT_Rep3'] },
  { name: 'Knockout', color: '#EF4444', samples: ['KO_Rep1', 'KO_Rep2', 'KO_Rep3'] },
  { name: 'Treatment', color: '#10B981', samples: ['Treated_Rep1', 'Treated_Rep2', 'Treated_Rep3'] },
])

function handleAutoGroup(level: number) {
  console.log('Auto-group triggered with level:', level)
  // Parse sample names by path separator and create groups
  const prefixGroups: Record<string, string[]> = {}
  samples.forEach(sample => {
    const parts = sample.split('/')
    const prefix = parts.slice(0, level).join('/')
    if (!prefixGroups[prefix]) prefixGroups[prefix] = []
    prefixGroups[prefix].push(sample)
  })

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
  groups.value = Object.entries(prefixGroups).map(([name, samples], i) => ({
    name,
    color: colors[i % colors.length],
    samples,
  }))
}

function handleMetadataGroup(mapping: Record<string, string[]>) {
  console.log('Metadata grouping:', mapping)
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  groups.value = Object.entries(mapping).map(([name, samples], i) => ({
    name,
    color: colors[i % colors.length],
    samples,
  }))
}

const selectedCount = computed(() => selectedSamples.value.length)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">SampleSelector</h1>
    <p class="text-text-secondary mb-8">
      A hierarchical sample grouping component for scientific workflows. Features
      three-level grouping (Major Groups > Sub Groups > Samples), auto-grouping by
      naming patterns, and CSV metadata import.
    </p>

    <!-- Full Featured Example -->
    <div class="demo-section">
      <h3>Full Featured Example</h3>
      <p class="text-sm text-text-secondary mb-4">
        Complete sample selector with hierarchical path-based samples. Try clicking
        "Auto" to group by different path levels (1 = Project, 2 = Experiment, 3 = Sample type).
      </p>
      <div class="max-w-lg">
        <SampleSelector
          :samples="samples"
          v-model="selectedSamples"
          v-model:groups="groups"
          enable-grouping
          enable-auto-group
          enable-metadata-group
          @auto-group="handleAutoGroup"
          @metadata-group="handleMetadataGroup"
        />
        <p class="mt-3 text-sm text-text-secondary">
          Selected: {{ selectedCount }} of {{ samples.length }} samples
        </p>
      </div>
    </div>

    <!-- Pre-grouped Example -->
    <div class="demo-section">
      <h3>Pre-grouped Samples</h3>
      <p class="text-sm text-text-secondary mb-4">
        Samples can be pre-grouped. Groups are displayed with expandable tree view.
        Click group colors to change them, hover to reveal delete buttons.
      </p>
      <div class="max-w-lg">
        <SampleSelector
          :samples="preGroupedSamples"
          v-model="preGroupedSelected"
          v-model:groups="preGroupedGroups"
          enable-grouping
          :enable-auto-group="false"
          :enable-metadata-group="false"
        />
      </div>
    </div>

    <!-- Simple Selection -->
    <div class="demo-section">
      <h3>Simple Selection (No Grouping)</h3>
      <p class="text-sm text-text-secondary mb-4">
        Basic sample selection without grouping features. Shows flat list with checkboxes.
      </p>
      <div class="max-w-lg">
        <SampleSelector
          :samples="simpleSamples"
          v-model="simpleSelected"
          v-model:groups="simpleGroups"
          :enable-grouping="false"
        />
        <p class="mt-3 text-sm text-text-secondary">
          Selected: {{ simpleSelected.join(', ') || 'None' }}
        </p>
      </div>
    </div>

    <!-- Features -->
    <div class="demo-section">
      <h3>Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Select All with Indeterminate</h4>
          <p class="text-sm text-text-secondary">
            Header checkbox shows checked, unchecked, or indeterminate state based on selection.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Auto-group with Preview</h4>
          <p class="text-sm text-text-secondary">
            Level selector shows preview of how many groups will be created and example names.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Hierarchical Tree View</h4>
          <p class="text-sm text-text-secondary">
            Groups display with expand/collapse, tree lines, and nested structure.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Native Color Picker</h4>
          <p class="text-sm text-text-secondary">
            Click any group color swatch to open the browser's native color picker.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Reset Groups</h4>
          <p class="text-sm text-text-secondary">
            Reset button clears all groups and returns to flat sample list.
          </p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-mld border border-border">
          <h4 class="font-medium text-text-primary mb-2">Expand/Collapse All</h4>
          <p class="text-sm text-text-secondary">
            Quick controls to expand or collapse all groups at once.
          </p>
        </div>
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
            <td><code>samples</code></td>
            <td><code>string[]</code></td>
            <td>Required</td>
            <td>Available sample names</td>
          </tr>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>string[]</code></td>
            <td>Required</td>
            <td>Selected samples (v-model)</td>
          </tr>
          <tr>
            <td><code>groups</code></td>
            <td><code>SampleGroup[]</code></td>
            <td><code>[]</code></td>
            <td>Pre-defined groups (v-model:groups)</td>
          </tr>
          <tr>
            <td><code>enableGrouping</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show grouping controls</td>
          </tr>
          <tr>
            <td><code>enableAutoGroup</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show auto-group button</td>
          </tr>
          <tr>
            <td><code>enableMetadataGroup</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show metadata upload button</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events Table -->
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
            <td><code>string[]</code></td>
            <td>Emitted when selection changes</td>
          </tr>
          <tr>
            <td><code>update:groups</code></td>
            <td><code>SampleGroup[]</code></td>
            <td>Emitted when groups change</td>
          </tr>
          <tr>
            <td><code>autoGroup</code></td>
            <td><code>number</code></td>
            <td>Emitted when auto-group is triggered (with level)</td>
          </tr>
          <tr>
            <td><code>metadataGroup</code></td>
            <td><code>Record&lt;string, string[]&gt;</code></td>
            <td>Emitted when metadata grouping is applied</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Types -->
    <div class="demo-section">
      <h3>Types</h3>
      <pre class="code-block">interface SampleGroup {
  name: string      // Group display name
  color: string     // Hex color for group badge
  samples: string[] // Sample names in this group
}</pre>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
import { SampleSelector, type SampleGroup } from '@morscherlab/mld-sdk'

const samples = [
  'Project/Experiment1/Sample_001',
  'Project/Experiment1/Sample_002',
  'Project/Experiment2/Sample_001',
]
const selected = ref&lt;string[]&gt;([])
const groups = ref&lt;SampleGroup[]&gt;([])

function handleAutoGroup(level: number) {
  // Parse sample names by path separator
  const prefixGroups: Record&lt;string, string[]&gt; = {}
  samples.forEach(sample =&gt; {
    const parts = sample.split('/')
    const prefix = parts.slice(0, level).join('/')
    if (!prefixGroups[prefix]) prefixGroups[prefix] = []
    prefixGroups[prefix].push(sample)
  })

  groups.value = Object.entries(prefixGroups).map(
    ([name, samples], i) =&gt; ({
      name,
      color: ['#3B82F6', '#10B981', '#F59E0B'][i % 3],
      samples,
    })
  )
}
&lt;/script&gt;

&lt;template&gt;
  &lt;SampleSelector
    :samples="samples"
    v-model="selected"
    v-model:groups="groups"
    @auto-group="handleAutoGroup"
  /&gt;
&lt;/template&gt;</pre>
    </div>
  </div>
</template>
