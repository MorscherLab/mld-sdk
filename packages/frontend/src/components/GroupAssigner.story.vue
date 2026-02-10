<script setup lang="ts">
import GroupAssigner from './GroupAssigner.vue'
import type { GroupItem } from '../types'

const mockGroups: GroupItem[] = [
  { name: 'Control_Rep1', color: '#3B82F6', count: 8 },
  { name: 'Control_Rep2', color: '#3B82F6', count: 8 },
  { name: 'Control_Rep3', color: '#3B82F6', count: 8 },
  { name: 'Treatment_Rep1', color: '#10B981', count: 12 },
  { name: 'Treatment_Rep2', color: '#10B981', count: 12 },
  { name: 'Treatment_Rep3', color: '#10B981', count: 12 },
  { name: 'Vehicle_Rep1', color: '#F59E0B', count: 4 },
  { name: 'Vehicle_Rep2', color: '#F59E0B', count: 4 },
]

function initState() {
  return {
    groups: mockGroups,
    group1: ['Control_Rep1', 'Control_Rep2', 'Control_Rep3'] as string[],
    group2: ['Treatment_Rep1', 'Treatment_Rep2', 'Treatment_Rep3'] as string[],
    label1: 'Control',
    label2: 'Treatment',
    color1: '#3B82F6',
    color2: '#F43F5E',
    minPerGroup: 1,
  }
}
</script>

<template>
  <Story title="Lab/GroupAssigner">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 700px;">
          <GroupAssigner
            :groups="state.groups"
            v-model:group1="state.group1"
            v-model:group2="state.group2"
            :label1="state.label1"
            :label2="state.label2"
            :color1="state.color1"
            :color2="state.color2"
            :min-per-group="state.minPerGroup"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstText v-model="state.label1" title="Label 1" />
        <HstText v-model="state.label2" title="Label 2" />
        <HstText v-model="state.color1" title="Color 1" />
        <HstText v-model="state.color2" title="Color 2" />
        <HstSlider v-model="state.minPerGroup" title="Min per Group" :min="0" :max="5" />
      </template>
    </Variant>

    <Variant title="Empty (Unassigned)">
      <div style="padding: 2rem; max-width: 700px;">
        <GroupAssigner
          :groups="mockGroups"
          :group1="[]"
          :group2="[]"
          label1="Baseline"
          label2="Experiment"
        />
      </div>
    </Variant>

    <Variant title="Custom Labels">
      <div style="padding: 2rem; max-width: 700px;">
        <GroupAssigner
          :groups="mockGroups"
          :group1="['Control_Rep1']"
          :group2="['Treatment_Rep1']"
          label1="Wild Type"
          label2="Knockout"
          color1="#8B5CF6"
          color2="#06B6D4"
          :min-per-group="2"
        />
      </div>
    </Variant>
  </Story>
</template>
