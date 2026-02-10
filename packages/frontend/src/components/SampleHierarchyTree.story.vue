<script setup lang="ts">
import SampleHierarchyTree from './SampleHierarchyTree.vue'
import type { TreeNode } from './SampleHierarchyTree.vue'

const mockNodes: TreeNode[] = [
  {
    id: 'study-1',
    label: 'Drug Resistance Study',
    type: 'study',
    badge: 3,
    badgeVariant: 'default',
    children: [
      {
        id: 'exp-1',
        label: 'Cisplatin Dose Response',
        type: 'experiment',
        children: [
          {
            id: 'plate-1',
            label: 'Plate 1 (96-well)',
            type: 'plate',
            badge: 96,
            children: [
              { id: 'sample-1', label: 'HeLa Control', type: 'sample' },
              { id: 'sample-2', label: 'HeLa 0.1 uM', type: 'sample' },
              { id: 'sample-3', label: 'HeLa 1.0 uM', type: 'sample' },
              { id: 'sample-4', label: 'HeLa 10 uM', type: 'sample' },
            ],
          },
          {
            id: 'plate-2',
            label: 'Plate 2 (96-well)',
            type: 'plate',
            badge: 96,
            children: [
              { id: 'sample-5', label: 'MCF-7 Control', type: 'sample' },
              { id: 'sample-6', label: 'MCF-7 0.1 uM', type: 'sample' },
              { id: 'sample-7', label: 'MCF-7 1.0 uM', type: 'sample' },
            ],
          },
        ],
      },
      {
        id: 'exp-2',
        label: 'Combination Treatment',
        type: 'experiment',
        children: [
          {
            id: 'plate-3',
            label: 'Combo Plate A',
            type: 'plate',
            badge: 54,
          },
        ],
      },
      {
        id: 'exp-3',
        label: 'Cell Line Characterization',
        type: 'experiment',
        children: [
          {
            id: 'cell-1',
            label: 'HeLa',
            type: 'cell_line',
            children: [
              { id: 'p-1', label: 'Passage 12', type: 'passage' },
              { id: 'p-2', label: 'Passage 15', type: 'passage', badge: 'low', badgeVariant: 'warning' },
            ],
          },
          {
            id: 'cell-2',
            label: 'MCF-7',
            type: 'cell_line',
            children: [
              { id: 'clone-1', label: 'Clone A', type: 'clone' },
              { id: 'clone-2', label: 'Clone B', type: 'clone', badge: 'resistant', badgeVariant: 'error' },
            ],
          },
        ],
      },
    ],
  },
]

function initState() {
  return {
    nodes: mockNodes,
    expandAll: false,
    showIcons: true,
    showCounts: true,
    size: 'md' as const,
  }
}
</script>

<template>
  <Story title="Lab/SampleHierarchyTree">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px;">
          <SampleHierarchyTree
            :nodes="state.nodes"
            :expand-all="state.expandAll"
            :show-icons="state.showIcons"
            :show-counts="state.showCounts"
            :size="state.size"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.expandAll" title="Expand All" />
        <HstCheckbox v-model="state.showIcons" title="Show Icons" />
        <HstCheckbox v-model="state.showCounts" title="Show Counts" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
      </template>
    </Variant>

    <Variant title="Expanded">
      <div style="padding: 2rem; max-width: 500px;">
        <SampleHierarchyTree
          :nodes="mockNodes"
          expand-all
        />
      </div>
    </Variant>

    <Variant title="No Icons">
      <div style="padding: 2rem; max-width: 500px;">
        <SampleHierarchyTree
          :nodes="mockNodes"
          :show-icons="false"
          expand-all
        />
      </div>
    </Variant>

    <Variant title="Small">
      <div style="padding: 2rem; max-width: 400px;">
        <SampleHierarchyTree
          :nodes="mockNodes"
          size="sm"
          expand-all
        />
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="padding: 2rem; max-width: 500px;">
        <SampleHierarchyTree :nodes="[]" />
      </div>
    </Variant>
  </Story>
</template>
