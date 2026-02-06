<script setup>
import RackEditorDemo from '../.vitepress/showcase/RackEditorDemo.vue'
</script>

# RackEditor

Multi-rack management component for LCMS sequence generation. Provides tabbed rack navigation, drag-to-reorder, per-well editing via WellPlate, and toolbar actions for format, slot, clear, and fill series.

## Demo

<ClientOnly>
  <RackEditorDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Rack[]` | `undefined` | Rack data (v-model) |
| `activeRackId` | `string` | `undefined` | Active rack ID (v-model:activeRackId) |
| `maxRacks` | `number` | `10` | Maximum number of racks |
| `minRacks` | `number` | `1` | Minimum number of racks |
| `allowReorder` | `boolean` | `true` | Allow drag-to-reorder rack tabs |
| `editable` | `boolean` | `true` | Enable click-to-edit wells via popup |
| `readonly` | `boolean` | `false` | Disable all editing (toolbar hidden, wells read-only) |
| `wellPlateSize` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fill'` | `'md'` | Well plate size preset |
| `showLegend` | `boolean` | `true` | Show sample type legend below plate |
| `showBadges` | `boolean` | `true` | Show injection count / custom method badges |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Rack[]` | Rack data changed |
| `update:activeRackId` | `string` | Active rack changed |
| `rack-add` | `Rack` | New rack created |
| `rack-remove` | `string` | Rack deleted |
| `rack-reorder` | `string[]` | Rack order changed (array of IDs) |
| `well-edit` | `rackId, wellId, WellEditData` | Well edited via popup |

## Rack Type

```typescript
interface Rack {
  id: string
  name: string
  format: WellPlateFormat    // 54 or 96
  slot: SlotPosition         // 'R' | 'G' | 'B' | 'Y'
  injectionVolume: number
  wells: Record<string, Partial<Well>>
}
```

## Composable: useRackEditor

For programmatic control, use the `useRackEditor` composable directly.

```typescript
import { useRackEditor } from '@morscherlab/mld-sdk'

const editor = useRackEditor(undefined, {
  defaultFormat: 54,
  defaultInjectionVolume: 5,
  maxRacks: 10,
  minRacks: 1,
})

// Rack management
const rack = editor.addRack('My Rack')
editor.removeRack(rack.id)
editor.reorderRacks(0, 2)
editor.updateRack(rack.id, { format: 96, slot: 'B' })
editor.setActiveRack(rack.id)

// Well operations
editor.setWellData(rack.id, 'A1', {
  state: 'filled',
  sampleType: 'sample',
  metadata: { label: 'Sample_001' },
})
editor.clearWell(rack.id, 'A1')
editor.clearAllWells(rack.id)
editor.fillSeries(rack.id, 'S')  // S001, S002, ...

// State access
console.log(editor.totalSampleCount.value)
console.log(editor.getAllWells())

// Reset
editor.reset()
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultFormat` | `WellPlateFormat` | `54` | Default plate format for new racks |
| `defaultInjectionVolume` | `number` | `5` | Default injection volume |
| `maxRacks` | `number` | `10` | Maximum racks allowed |
| `minRacks` | `number` | `1` | Minimum racks (prevents removal below this) |

### Returns

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `racks` | `Ref<Rack[]>` | All racks |
| `activeRack` | `ComputedRef<Rack \| undefined>` | Currently active rack |
| `activeRackId` | `Ref<string>` | Active rack ID |
| `addRack(name?)` | `Rack` | Add new rack |
| `removeRack(rackId)` | `void` | Remove rack |
| `reorderRacks(from, to)` | `void` | Reorder racks |
| `updateRack(rackId, data)` | `void` | Update rack properties |
| `setActiveRack(rackId)` | `void` | Set active rack |
| `setWellData(rackId, wellId, data)` | `void` | Set well data |
| `clearWell(rackId, wellId)` | `void` | Clear single well |
| `clearAllWells(rackId)` | `void` | Clear all wells in rack |
| `fillSeries(rackId, prefix?)` | `void` | Auto-fill empty wells |
| `getAllWells()` | `Array<{rackId, wellId, well}>` | Get all wells across racks |
| `totalSampleCount` | `ComputedRef<number>` | Total filled wells |
| `reset()` | `void` | Reset to single empty rack |

## Usage

```vue
<template>
  <RackEditor
    v-model="racks"
    v-model:active-rack-id="activeRackId"
    :max-racks="5"
    :editable="true"
    well-plate-size="md"
    @rack-add="onRackAdd"
    @well-edit="onWellEdit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RackEditor, type Rack } from '@morscherlab/mld-sdk'

const racks = ref<Rack[]>([])
const activeRackId = ref('')

function onRackAdd(rack: Rack) {
  console.log('New rack:', rack.name)
}

function onWellEdit(rackId: string, wellId: string, data: any) {
  console.log('Edited:', rackId, wellId, data)
}
</script>
```
