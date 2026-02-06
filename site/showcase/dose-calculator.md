<script setup>
import DoseCalculatorDemo from '../.vitepress/showcase/DoseCalculatorDemo.vue'
</script>

# DoseCalculator

Multi-mode calculation panel for dilutions, serial dilutions, and concentration conversions commonly used in lab experiments.

## Demo

<ClientOnly>
  <DoseCalculatorDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'auto' \| 'dilution' \| 'serial' \| 'conversion'` | `'auto'` | Calculator mode. `'auto'` shows tabbed interface. |
| `molecularWeight` | `number` | `undefined` | Molecular weight for mass/molarity conversions |
| `targetWells` | `string[]` | `undefined` | Well IDs for "Apply to wells" feature |
| `disabled` | `boolean` | `false` | Disable all inputs |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `calculate` | `DilutionResult \| SerialDilutionResult` | Emitted when calculation is performed |
| `apply-to-wells` | `WellConcentration[]` | Emitted when applying to target wells |

## Types

```typescript
interface DilutionResult {
  valid: boolean
  stockVolume: VolumeValue
  diluentVolume: VolumeValue
  dilutionFactor: number
  error?: string
}

interface SerialDilutionResult {
  valid: boolean
  steps: SerialDilutionStep[]
  error?: string
}

interface SerialDilutionStep {
  stepNumber: number
  concentration: ConcentrationValue
  volume: VolumeValue
}

interface WellConcentration {
  wellId: string
  concentration: ConcentrationValue
  volume: VolumeValue
}
```

## Usage

```vue
<DoseCalculator
  mode="auto"
  :molecular-weight="180.16"
  :target-wells="selectedWells"
  @calculate="handleCalculate"
  @apply-to-wells="handleApply"
/>
```
