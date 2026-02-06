<script setup lang="ts">
import { ref } from 'vue'
import { SampleHierarchyTree, BaseSelect, BaseToggle } from '@morscherlab/mld-sdk'

type TreeNodeType = 'study' | 'experiment' | 'plate' | 'sample' | 'cell_line' | 'passage' | 'clone' | 'treatment' | 'folder' | 'custom'
type BadgeVariant = 'default' | 'success' | 'warning' | 'error'

interface TreeNode {
  id: string
  label: string
  type?: TreeNodeType
  children?: TreeNode[]
  badge?: string | number
  badgeVariant?: BadgeVariant
}

const expandAll = ref(false)
const showIcons = ref(true)
const showCounts = ref(true)
const maxDepth = ref<number>(0)
const size = ref<'sm' | 'md' | 'lg'>('md')

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

const maxDepthOptions = [
  { value: 0, label: 'Unlimited' },
  { value: 1, label: '1 Level' },
  { value: 2, label: '2 Levels' },
  { value: 3, label: '3 Levels' },
]

// Complex biological hierarchy demo
const biologicalNodes: TreeNode[] = [
  {
    id: 'study-1',
    label: 'Drug Screening Study 2024-01',
    type: 'study',
    badge: 'Active',
    badgeVariant: 'success',
    children: [
      {
        id: 'exp-1',
        label: 'Compound A Dose Response',
        type: 'experiment',
        children: [
          {
            id: 'plate-1',
            label: 'Plate 001',
            type: 'plate',
            badge: '96',
          },
          {
            id: 'plate-2',
            label: 'Plate 002',
            type: 'plate',
            badge: '96',
          },
        ],
      },
      {
        id: 'exp-2',
        label: 'Compound B Toxicity',
        type: 'experiment',
        badge: 'Draft',
        badgeVariant: 'warning',
        children: [
          {
            id: 'plate-3',
            label: 'Plate 003',
            type: 'plate',
            badge: '384',
          },
        ],
      },
    ],
  },
  {
    id: 'study-2',
    label: 'Cell Line Characterization',
    type: 'study',
    children: [
      {
        id: 'cell-1',
        label: 'HeLa',
        type: 'cell_line',
        children: [
          {
            id: 'passage-1',
            label: 'P12-P20',
            type: 'passage',
            children: [
              { id: 'clone-1', label: 'Clone A1', type: 'clone' },
              { id: 'clone-2', label: 'Clone A2', type: 'clone' },
              { id: 'clone-3', label: 'Clone B1', type: 'clone', badge: 'New', badgeVariant: 'success' },
            ],
          },
        ],
      },
      {
        id: 'cell-2',
        label: 'HEK293',
        type: 'cell_line',
        children: [
          {
            id: 'passage-2',
            label: 'P5-P15',
            type: 'passage',
          },
        ],
      },
    ],
  },
]

// Organizational hierarchy demo
const orgNodes: TreeNode[] = [
  {
    id: 'org-1',
    label: 'Research Division',
    type: 'folder',
    children: [
      {
        id: 'org-2',
        label: 'Biology Team',
        type: 'folder',
        children: [
          { id: 'sample-1', label: 'Sample Collection A', type: 'sample', badge: 45 },
          { id: 'sample-2', label: 'Sample Collection B', type: 'sample', badge: 32 },
        ],
      },
      {
        id: 'org-3',
        label: 'Chemistry Team',
        type: 'folder',
        children: [
          { id: 'treatment-1', label: 'Compound Library', type: 'treatment', badge: 1250 },
        ],
      },
    ],
  },
]

// Simple treatment hierarchy
const treatmentNodes: TreeNode[] = [
  {
    id: 'drug-class-1',
    label: 'Kinase Inhibitors',
    type: 'treatment',
    children: [
      { id: 'drug-1', label: 'Imatinib', type: 'treatment' },
      { id: 'drug-2', label: 'Dasatinib', type: 'treatment' },
      { id: 'drug-3', label: 'Nilotinib', type: 'treatment' },
    ],
  },
  {
    id: 'drug-class-2',
    label: 'Checkpoint Inhibitors',
    type: 'treatment',
    badge: '!',
    badgeVariant: 'error',
    children: [
      { id: 'drug-4', label: 'Pembrolizumab', type: 'treatment' },
      { id: 'drug-5', label: 'Nivolumab', type: 'treatment' },
    ],
  },
]

function handleNodeClick(node: TreeNode) {
  console.log('Node clicked:', node)
}

function handleExpand(nodeId: string) {
  console.log('Node expanded:', nodeId)
}

function handleCollapse(nodeId: string) {
  console.log('Node collapsed:', nodeId)
}
</script>

<template>
  <!-- Interactive Demo -->
  <div class="demo-section">
    <h3>Interactive Demo</h3>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
      <div>
        <label class="block text-sm text-text-secondary mb-1">Size</label>
        <BaseSelect v-model="size" :options="sizeOptions" size="sm" />
      </div>
      <div>
        <label class="block text-sm text-text-secondary mb-1">Max Depth</label>
        <BaseSelect v-model="maxDepth" :options="maxDepthOptions" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="expandAll" size="sm" />
        <span class="text-sm text-text-secondary">Expand All</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showIcons" size="sm" />
        <span class="text-sm text-text-secondary">Show Icons</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showCounts" size="sm" />
        <span class="text-sm text-text-secondary">Show Counts</span>
      </div>
    </div>

    <div class="p-4 bg-bg-secondary rounded-lg border border-border">
      <SampleHierarchyTree
        :nodes="biologicalNodes"
        :default-expanded-ids="['study-1', 'exp-1']"
        :expand-all="expandAll"
        :show-icons="showIcons"
        :show-counts="showCounts"
        :max-depth="maxDepth || undefined"
        :size="size"
        @node-click="handleNodeClick"
        @expand="handleExpand"
        @collapse="handleCollapse"
      />
    </div>
  </div>

  <!-- Organizational Hierarchy -->
  <div class="demo-section">
    <h3>Organizational Structure</h3>
    <p class="text-sm text-text-secondary mb-4">
      Use folder nodes for organizational grouping.
    </p>
    <div class="p-4 bg-bg-secondary rounded-lg border border-border max-w-md">
      <SampleHierarchyTree
        :nodes="orgNodes"
        :default-expanded-ids="['org-1', 'org-2']"
        show-icons
        show-counts
        size="sm"
        @node-click="handleNodeClick"
      />
    </div>
  </div>

  <!-- Treatment Hierarchy -->
  <div class="demo-section">
    <h3>Treatment Classification</h3>
    <p class="text-sm text-text-secondary mb-4">
      Group treatments by drug class or mechanism.
    </p>
    <div class="p-4 bg-bg-secondary rounded-lg border border-border max-w-md">
      <SampleHierarchyTree
        :nodes="treatmentNodes"
        expand-all
        show-icons
        size="md"
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>
