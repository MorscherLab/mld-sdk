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
</template>
