<script setup>
import ExperimentTimelineDemo from '../.vitepress/showcase/ExperimentTimelineDemo.vue'
</script>

# ExperimentTimeline

Visual timeline for protocol steps with status tracking, expandable details, and drag-to-reorder support.

## Demo

<ClientOnly>
  <ExperimentTimelineDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ProtocolStep[]` | `[]` | Protocol steps (v-model) |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Timeline layout direction |
| `showDuration` | `boolean` | `true` | Show duration labels |
| `editable` | `boolean` | `false` | Enable editing and reordering |
| `collapsible` | `boolean` | `true` | Allow expanding step details |
| `expandedStepId` | `string` | `undefined` | Currently expanded step |
| `colorByStatus` | `boolean` | `true` | Color steps by status |
| `colorByType` | `boolean` | `false` | Color steps by type |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size preset |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `ProtocolStep[]` | Steps array changed |
| `step-click` | `ProtocolStep` | Step clicked |
| `step-expand` | `string \| undefined` | Step expanded/collapsed |
| `step-add` | `afterStepId?` | Add step requested |
| `step-remove` | `stepId` | Step removed |
| `step-reorder` | `stepId, newOrder` | Step dragged to new position |
| `step-status-change` | `stepId, status` | Status changed (in edit mode) |

## Types

```typescript
interface ProtocolStep {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  duration?: number       // in minutes
  status: ProtocolStepStatus
  parameters?: Record<string, unknown>
  order: number
}

type ProtocolStepType =
  | 'incubation' | 'wash' | 'addition' | 'measurement'
  | 'transfer' | 'centrifuge' | 'mix' | 'custom'

type ProtocolStepStatus =
  | 'pending' | 'in_progress' | 'completed'
  | 'failed' | 'skipped'
```

### Step Types

| Type | Description |
|------|-------------|
| `incubation` | Temperature-controlled waiting |
| `wash` | Remove and replace medium |
| `addition` | Add reagents or samples |
| `measurement` | Take readings |
| `transfer` | Move samples between plates |
| `centrifuge` | Spin samples |
| `mix` | Pipette mixing |
| `custom` | User-defined step |

### Status States

| Status | Description |
|--------|-------------|
| `pending` | Not yet started |
| `in_progress` | Currently active |
| `completed` | Successfully finished |
| `failed` | Encountered an error |
| `skipped` | Intentionally skipped |

## Usage

```vue
<ExperimentTimeline
  v-model="protocolSteps"
  orientation="vertical"
  editable
  collapsible
  @step-click="handleClick"
  @step-status-change="handleStatusChange"
/>
```
