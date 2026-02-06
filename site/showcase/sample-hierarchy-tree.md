<script setup>
import SampleHierarchyTreeDemo from '../.vitepress/showcase/SampleHierarchyTreeDemo.vue'
</script>

# SampleHierarchyTree

Flexible tree display for hierarchical biological data such as studies, experiments, cell lines, and sample collections.

## Demo

<ClientOnly>
  <SampleHierarchyTreeDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | `[]` | Array of tree nodes |
| `defaultExpandedIds` | `string[]` | `[]` | IDs of initially expanded nodes |
| `expandAll` | `boolean` | `false` | Expand all nodes |
| `showIcons` | `boolean` | `true` | Show type-based icons |
| `showCounts` | `boolean` | `true` | Show child count badges |
| `maxDepth` | `number` | `undefined` | Maximum visible nesting depth |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `node-click` | `TreeNode` | Node label clicked |
| `expand` | `string` | Node expanded (by ID) |
| `collapse` | `string` | Node collapsed (by ID) |

## Types

```typescript
interface TreeNode {
  id: string
  label: string
  type?: TreeNodeType
  icon?: string           // Custom SVG path
  children?: TreeNode[]
  metadata?: Record<string, unknown>
  badge?: string | number
  badgeVariant?: 'default' | 'success' | 'warning' | 'error'
}

type TreeNodeType =
  | 'study' | 'experiment' | 'plate' | 'sample'
  | 'cell_line' | 'passage' | 'clone'
  | 'treatment' | 'folder' | 'custom'
```

### Node Types

| Type | Description |
|------|-------------|
| `study` | Top-level study container |
| `experiment` | Experiment within a study |
| `plate` | Microplate |
| `sample` | Individual sample |
| `cell_line` | Cell line |
| `passage` | Cell passage range |
| `clone` | Cell clone |
| `treatment` | Treatment or compound |
| `folder` | Organizational folder |
| `custom` | User-defined type |

### Badge Variants

| Variant | Description |
|---------|-------------|
| `default` | Gray/neutral badge |
| `success` | Green badge |
| `warning` | Amber badge |
| `error` | Red badge |

## Usage

```vue
<SampleHierarchyTree
  :nodes="studyHierarchy"
  :default-expanded-ids="['study-1']"
  show-icons
  show-counts
  @node-click="handleNodeClick"
/>
```
