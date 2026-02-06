<script setup>
import PlateMapEditorDemo from '../.vitepress/showcase/PlateMapEditorDemo.vue'
</script>

# PlateMapEditor

Full-featured plate layout editor combining WellPlate and SampleLegend with multi-plate support, undo/redo, and import/export.

## Demo

<ClientOnly>
  <PlateMapEditorDemo />
</ClientOnly>

## Workflow

1. **Add Sample Types** -- Create sample types in the sidebar with custom names. Colors are assigned automatically.
2. **Select Wells** -- Click and drag on the plate to select wells. Use Ctrl/Cmd+A to select all.
3. **Assign Samples** -- Click a sample type, then click "Assign" or press 1-9 for quick assignment.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `1-9` | Quick assign sample |
| `Del` | Clear selected wells |
| `Ctrl+Z` | Undo |
| `Ctrl+A` | Select all wells |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `PlateMapEditorState` | `undefined` | Editor state (v-model) |
| `format` | `WellPlateFormat` | `96` | Default plate format |
| `maxPlates` | `number` | `10` | Maximum number of plates |
| `showToolbar` | `boolean` | `true` | Show toolbar with plate tabs |
| `showSidebar` | `boolean` | `true` | Show sample legend sidebar |
| `allowAddPlates` | `boolean` | `true` | Allow adding new plates |
| `allowAddSamples` | `boolean` | `true` | Allow adding sample types |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fill'` | `'md'` | Size preset. Use `'fill'` to make plate fill parent container width. |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `PlateMapEditorState` | State changed |
| `plate-add` | `{ id, name }` | New plate created |
| `plate-remove` | `plateId` | Plate deleted |
| `sample-assign` | `wellIds, sampleId` | Wells assigned to sample |
| `wells-clear` | `wellIds` | Wells cleared |
| `export` | `data, format` | Data exported |
| `import` | `success` | Data imported |

## Composable: useWellPlateEditor

For programmatic control, use the `useWellPlateEditor` composable directly.

```typescript
import { useWellPlateEditor } from '@morscherlab/mld-sdk'

const editor = useWellPlateEditor({
  plates: [{ id: 'p1', name: 'Plate 1', format: 96, wells: {} }],
  samples: [{ id: 's1', name: 'Control', color: '#3B82F6' }],
})

// Actions
editor.addPlate('Plate 2')
editor.addSample('Treatment', '#10B981')
editor.assignSample(['A1', 'A2', 'A3'], 's1')
editor.undo()
editor.redo()

// Export
const json = editor.exportData('json')
const csv = editor.exportData('csv')
```

## Usage

```vue
<PlateMapEditor
  v-model="editorState"
  :format="96"
  :max-plates="5"
  @sample-assign="handleAssign"
  @export="handleExport"
/>
```
