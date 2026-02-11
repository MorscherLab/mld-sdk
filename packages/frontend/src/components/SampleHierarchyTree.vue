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

// Default icons by type (Lucide SVG paths - arrays to support multi-path icons)
interface IconElement {
  tag: 'path' | 'circle' | 'rect'
  attrs: Record<string, string | number>
}

const typeIcons: Record<TreeNodeType, IconElement[]> = {
  study: [
    { tag: 'path', attrs: { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' } },
  ],
  experiment: [
    { tag: 'path', attrs: { d: 'M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2' } },
    { tag: 'path', attrs: { d: 'M6.453 15h11.094' } },
    { tag: 'path', attrs: { d: 'M8.5 2h7' } },
  ],
  plate: [
    { tag: 'rect', attrs: { width: '7', height: '7', x: '3', y: '3', rx: '1' } },
    { tag: 'rect', attrs: { width: '7', height: '7', x: '14', y: '3', rx: '1' } },
    { tag: 'rect', attrs: { width: '7', height: '7', x: '14', y: '14', rx: '1' } },
    { tag: 'rect', attrs: { width: '7', height: '7', x: '3', y: '14', rx: '1' } },
  ],
  sample: [
    { tag: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
    { tag: 'path', attrs: { d: 'M12 6v6l4 2' } },
  ],
  cell_line: [
    { tag: 'path', attrs: { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' } },
    { tag: 'path', attrs: { d: 'M9 18h6' } },
    { tag: 'path', attrs: { d: 'M10 22h4' } },
  ],
  passage: [
    { tag: 'path', attrs: { d: 'M3 5h.01' } },
    { tag: 'path', attrs: { d: 'M3 12h.01' } },
    { tag: 'path', attrs: { d: 'M3 19h.01' } },
    { tag: 'path', attrs: { d: 'M8 5h13' } },
    { tag: 'path', attrs: { d: 'M8 12h13' } },
    { tag: 'path', attrs: { d: 'M8 19h13' } },
  ],
  clone: [
    { tag: 'rect', attrs: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' } },
    { tag: 'path', attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' } },
  ],
  treatment: [
    { tag: 'path', attrs: { d: 'M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2' } },
    { tag: 'path', attrs: { d: 'M6.453 15h11.094' } },
    { tag: 'path', attrs: { d: 'M8.5 2h7' } },
  ],
  folder: [
    { tag: 'path', attrs: { d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' } },
  ],
  custom: [
    { tag: 'path', attrs: { d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915' } },
    { tag: 'circle', attrs: { cx: '12', cy: '12', r: '3' } },
  ],
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

function getIconElements(node: TreeNode): IconElement[] {
  if (node.icon) return [{ tag: 'path', attrs: { d: node.icon } }]
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
  const iconElements = getIconElements(node)

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
              h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
                h('path', { d: 'm9 18 6-6-6-6' }),
              ]),
            ]
          )
        : h('span', { class: 'mld-sample-tree__toggle-placeholder' }),
      props.showIcons
        ? h('span', { class: ['mld-sample-tree__icon', `mld-sample-tree__icon--${node.type || 'custom'}`] }, [
            h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
              iconElements.map(el => h(el.tag, el.attrs))
            ),
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
      <svg class="mld-sample-tree__empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
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
