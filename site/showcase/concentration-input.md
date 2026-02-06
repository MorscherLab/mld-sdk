<script setup>
import ConcentrationInputDemo from '../.vitepress/showcase/ConcentrationInputDemo.vue'
</script>

# ConcentrationInput

Numeric input with unit selector for entering concentrations with auto-conversion hints between units.

## Demo

<ClientOnly>
  <ConcentrationInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `ConcentrationValue` | `undefined` | Concentration value and unit (v-model) |
| `allowedUnits` | `ConcentrationUnit[]` | `[]` | Restrict available units (empty = all units) |
| `showConversion` | `boolean` | `true` | Show conversion hint to related units |
| `molecularWeight` | `number` | `undefined` | MW for mass/molarity conversion |
| `min` | `number` | `undefined` | Minimum value constraint |
| `max` | `number` | `undefined` | Maximum value constraint |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `boolean` | `false` | Show error state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `placeholder` | `string` | `'Enter value'` | Input placeholder text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `ConcentrationValue \| undefined` | Emitted when value or unit changes |

## Types

```typescript
interface ConcentrationValue {
  value: number
  unit: ConcentrationUnit
}

type ConcentrationUnit =
  | 'pM' | 'nM' | 'µM' | 'mM' | 'M'        // Molarity
  | 'pg/mL' | 'ng/mL' | 'µg/mL' | 'mg/mL' | 'g/mL'  // Mass/Volume
  | '% v/v' | '% w/v' | '% w/w'            // Percentage
```

## Usage

```vue
<ConcentrationInput
  v-model="concentration"
  :allowed-units="['nM', 'µM', 'mM']"
  show-conversion
  size="md"
/>
```
