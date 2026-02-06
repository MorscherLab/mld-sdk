<script setup lang="ts">
import { ref, computed } from 'vue'
import { GroupAssigner, type GroupItem } from '@morscherlab/mld-sdk'

// Basic example groups
const groups = ref<GroupItem[]>([
  { name: 'Control', color: '#6B7280', count: 3 },
  { name: 'Treatment A', color: '#3B82F6', count: 4 },
  { name: 'Treatment B', color: '#10B981', count: 4 },
  { name: 'Treatment C', color: '#F59E0B', count: 3 },
])
const group1 = ref<string[]>(['Control'])
const group2 = ref<string[]>(['Treatment A'])

// Custom labels example
const customGroups = ref<GroupItem[]>([
  { name: 'Wild Type', color: '#8B5CF6', count: 6 },
  { name: 'Mutant A', color: '#EC4899', count: 5 },
  { name: 'Mutant B', color: '#06B6D4', count: 5 },
  { name: 'Knockout', color: '#EF4444', count: 4 },
])
const customGroup1 = ref<string[]>([])
const customGroup2 = ref<string[]>([])

// Pre-assigned example
const preGroups = ref<GroupItem[]>([
  { name: 'Vehicle', color: '#6B7280', count: 3 },
  { name: 'Low Dose', color: '#3B82F6', count: 3 },
  { name: 'Mid Dose', color: '#10B981', count: 3 },
  { name: 'High Dose', color: '#F59E0B', count: 3 },
])
const preGroup1 = ref<string[]>(['Vehicle'])
const preGroup2 = ref<string[]>(['Low Dose', 'Mid Dose', 'High Dose'])

const isValid = computed(() => group1.value.length >= 1 && group2.value.length >= 1)
</script>

<template>
  <!-- Basic Example -->
  <div class="demo-section">
    <h3>Basic Example</h3>
    <p class="text-sm text-text-secondary mb-4">
      Drag groups between zones to assign them. Groups in Control will be compared against Treatment.
    </p>
    <div class="max-w-xl">
      <GroupAssigner
        :groups="groups"
        v-model:group1="group1"
        v-model:group2="group2"
        :min-per-group="1"
      />
      <div class="mt-4 p-3 bg-bg-tertiary rounded-mld text-sm">
        <p class="text-text-secondary">
          <strong>Control:</strong> {{ group1.join(', ') || 'None' }}
        </p>
        <p class="text-text-secondary mt-1">
          <strong>Treatment:</strong> {{ group2.join(', ') || 'None' }}
        </p>
        <p class="mt-2" :class="isValid ? 'text-mld-success' : 'text-mld-warning'">
          {{ isValid ? 'Ready for comparison' : 'Assign at least one group to each zone' }}
        </p>
      </div>
    </div>
  </div>

  <!-- Custom Labels and Colors -->
  <div class="demo-section">
    <h3>Custom Labels and Colors</h3>
    <p class="text-sm text-text-secondary mb-4">
      Customize zone labels and accent colors for different comparison types.
    </p>
    <div class="max-w-xl">
      <GroupAssigner
        :groups="customGroups"
        v-model:group1="customGroup1"
        v-model:group2="customGroup2"
        label1="Baseline"
        label2="Experimental"
        color1="#8B5CF6"
        color2="#EC4899"
        :min-per-group="1"
      />
    </div>
  </div>

  <!-- Pre-assigned Groups -->
  <div class="demo-section">
    <h3>Pre-assigned Groups</h3>
    <p class="text-sm text-text-secondary mb-4">
      Groups can be pre-assigned. Users can still drag to reassign.
    </p>
    <div class="max-w-xl">
      <GroupAssigner
        :groups="preGroups"
        v-model:group1="preGroup1"
        v-model:group2="preGroup2"
        label1="Vehicle"
        label2="Drug Treatment"
        color1="#6B7280"
        color2="#10B981"
      />
    </div>
  </div>
</template>
