<script setup>
import ProtocolStepEditorDemo from '../.vitepress/showcase/ProtocolStepEditorDemo.vue'
</script>

# ProtocolStepEditor

Template-based editor for creating and modifying protocol steps with type-specific parameter forms and live preview.

## Demo

<ClientOnly>
  <ProtocolStepEditorDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ProtocolStep` | `undefined` | Step to edit (v-model) |
| `templates` | `StepTemplate[]` | `undefined` | Override default templates |
| `customTemplates` | `StepTemplate[]` | `undefined` | Additional custom templates |
| `mode` | `'create' \| 'edit'` | `'create'` | Editor mode |
| `showPreview` | `boolean` | `true` | Show live preview card |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `ProtocolStep` | Step data changed |
| `save` | `ProtocolStep` | Save/Add button clicked |
| `save-template` | `StepTemplate` | Save as Template clicked |
| `cancel` | - | Cancel button clicked |

## Types

```typescript
interface ProtocolStep {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  duration?: number        // in minutes
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

interface StepTemplate {
  id: string
  type: ProtocolStepType
  name: string
  description?: string
  defaultDuration?: number
  parameters: ParameterDefinition[]
  isBuiltIn?: boolean
}

interface ParameterDefinition {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'concentration' | ...
  required?: boolean
  default?: unknown
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  unit?: string
}
```

### Step Types

| Type | Description |
|------|-------------|
| `incubation` | Temperature-controlled waiting period |
| `wash` | Remove and replace medium |
| `addition` | Add reagents, drugs, or samples |
| `measurement` | Take readings or images |
| `transfer` | Move between containers |
| `centrifuge` | Spin samples |
| `mix` | Pipette or shake mixing |
| `custom` | User-defined step type |

### Template Parameters

Each step type has predefined parameters:

- **Addition**: Reagent name, volume, concentration, dispense method
- **Incubation**: Temperature, duration, CO2 percentage, humidity
- **Measurement**: Measurement type, wavelength(s), gain setting, read mode
- **Wash**: Wash buffer, volume, number of washes, aspiration setting

## Usage

```vue
<ProtocolStepEditor
  v-model="currentStep"
  mode="create"
  :custom-templates="myTemplates"
  show-preview
  @save="addStepToProtocol"
  @save-template="saveToLibrary"
  @cancel="closeEditor"
/>
```
