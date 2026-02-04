<script setup lang="ts">
import { ref, watch, type VNode } from 'vue'
import { h, Transition } from 'vue'

export type TreeNodeType =
  | 'study'
  | 'experiment'
  | 'plate'
  | 'sample'
  | 'cell_line'
  | 'passage'
  | 'clone'
  | 'treatment'
  | 'folder'
  | 'custom'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error'

export interface TreeNode {
  id: string
  label: string
  type?: TreeNodeType
  icon?: string
  children?: TreeNode[]
  metadata?: Record<string, unknown>
  badge?: string | number
  badgeVariant?: BadgeVariant
}

interface Props {
  nodes: TreeNode[]
  defaultExpandedIds?: string[]
  expandAll?: boolean
  showIcons?: boolean
  showCounts?: boolean
  maxDepth?: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpandedIds: () => [],
  expandAll: false,
  showIcons: true,
  showCounts: true,
  size: 'md',
})

const emit = defineEmits<{
  'node-click': [node: TreeNode]
  'expand': [nodeId: string]
  'collapse': [nodeId: string]
}>()

// Track expanded nodes
const expandedIds = ref<Set<string>>(new Set(props.defaultExpandedIds))

// Default icons by type (SVG paths)
const typeIcons: Record<TreeNodeType, string> = {
  study: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  experiment: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  plate: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  sample: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  cell_line: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  passage: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  clone: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  treatment: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  custom: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
}

// Collect all node IDs for expand all
function collectAllIds(nodes: TreeNode[]): string[] {
  const ids: string[] = []
  function traverse(node: TreeNode) {
    ids.push(node.id)
    if (node.children) {
      node.children.forEach(traverse)
    }
  }
  nodes.forEach(traverse)
  return ids
}

// Watch for expandAll changes
watch(
  () => props.expandAll,
  (shouldExpandAll) => {
    if (shouldExpandAll) {
      expandedIds.value = new Set(collectAllIds(props.nodes))
    } else {
      expandedIds.value = new Set(props.defaultExpandedIds)
    }
  },
  { immediate: true }
)

function isExpanded(nodeId: string): boolean {
  return expandedIds.value.has(nodeId)
}

function toggleExpand(node: TreeNode) {
  if (isExpanded(node.id)) {
    expandedIds.value.delete(node.id)
    emit('collapse', node.id)
  } else {
    expandedIds.value.add(node.id)
    emit('expand', node.id)
  }
}

function handleNodeClick(node: TreeNode) {
  emit('node-click', node)
}

function getIconPath(node: TreeNode): string {
  if (node.icon) return node.icon
  return typeIcons[node.type || 'custom']
}

function getBadgeContent(node: TreeNode): string | number | undefined {
  if (node.badge !== undefined) return node.badge
  if (props.showCounts && node.children && node.children.length > 0) {
    return node.children.length
  }
  return undefined
}

function getBadgeVariant(node: TreeNode): BadgeVariant {
  return node.badgeVariant || 'default'
}

function hasChildren(node: TreeNode): boolean {
  return !!node.children && node.children.length > 0
}

function canShowChildren(node: TreeNode, depth: number): boolean {
  if (!hasChildren(node)) return false
  if (props.maxDepth !== undefined && depth >= props.maxDepth) return false
  return isExpanded(node.id)
}

// Render tree node recursively
function renderNode(node: TreeNode, depth: number): VNode {
  const expanded = isExpanded(node.id)
  const canExpand = hasChildren(node)
  const showChildNodes = canShowChildren(node, depth)
  const badge = getBadgeContent(node)
  const badgeVar = getBadgeVariant(node)
  const iconPath = getIconPath(node)

  const header = h(
    'div',
    {
      class: 'mld-sample-tree__node-header',
      onClick: () => handleNodeClick(node),
    },
    [
      canExpand
        ? h(
            'button',
            {
              type: 'button',
              class: 'mld-sample-tree__toggle',
              'aria-label': expanded ? 'Collapse' : 'Expand',
              onClick: (e: Event) => {
                e.stopPropagation()
                toggleExpand(node)
              },
            },
            [
              h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
                h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5l7 7-7 7' }),
              ]),
            ]
          )
        : h('span', { class: 'mld-sample-tree__toggle-placeholder' }),
      props.showIcons
        ? h('span', { class: ['mld-sample-tree__icon', `mld-sample-tree__icon--${node.type || 'custom'}`] }, [
            h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
              h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: iconPath }),
            ]),
          ])
        : null,
      h('span', { class: 'mld-sample-tree__label' }, node.label),
      badge !== undefined
        ? h('span', { class: ['mld-sample-tree__badge', `mld-sample-tree__badge--${badgeVar}`] }, String(badge))
        : null,
    ]
  )

  const childNodes =
    showChildNodes && node.children
      ? h(
          Transition,
          { enterActiveClass: 'mld-sample-tree__children--entering', leaveActiveClass: 'mld-sample-tree__children--leaving' },
          () => h('div', { class: 'mld-sample-tree__children' }, node.children!.map((child) => renderNode(child, depth + 1)))
        )
      : null

  return h(
    'div',
    {
      key: node.id,
      class: ['mld-sample-tree__node', expanded ? 'mld-sample-tree__node--expanded' : '', !canExpand ? 'mld-sample-tree__node--leaf' : ''],
      role: 'treeitem',
      'aria-expanded': canExpand ? expanded : undefined,
    },
    [header, childNodes]
  )
}

// Render the entire tree
function renderTree(): VNode[] {
  return props.nodes.map((node) => renderNode(node, 0))
}
</script>

<template>
  <div :class="['mld-sample-tree', `mld-sample-tree--${size}`]" role="tree">
    <!-- Empty state -->
    <div v-if="nodes.length === 0" class="mld-sample-tree__empty">
      <svg class="mld-sample-tree__empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <p class="mld-sample-tree__empty-text">No items</p>
    </div>

    <!-- Tree nodes rendered via render function -->
    <template v-else>
      <component :is="() => renderTree()" />
    </template>
  </div>
</template>

<style>
@import '../styles/components/sample-hierarchy-tree.css';
</style>
