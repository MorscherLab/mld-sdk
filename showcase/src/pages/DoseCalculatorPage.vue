<script setup lang="ts">
import { ref } from 'vue'
import { DoseCalculator, BaseSelect, BaseToggle } from '@morscherlab/mld-sdk'

const mode = ref<'auto' | 'dilution' | 'serial' | 'conversion'>('auto')
const disabled = ref(false)
const molecularWeight = ref<number | undefined>(180.16) // Aspirin MW
const showMW = ref(true)

// Target wells for apply-to-wells demo
const targetWells = ref<string[]>(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'])
const useTargetWells = ref(false)

const modeOptions = [
  { value: 'auto', label: 'Auto (Tabbed)' },
  { value: 'dilution', label: 'Dilution Only' },
  { value: 'serial', label: 'Serial Only' },
  { value: 'conversion', label: 'Conversion Only' },
]

function handleCalculate(result: unknown) {
  console.log('Calculation result:', result)
}

function handleApplyToWells(wells: unknown) {
  console.log('Applied to wells:', wells)
}
</script>

<template>
  <div class="max-w-5xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">DoseCalculator</h1>
    <p class="text-text-secondary mb-8">
      Multi-mode calculation panel for dilutions, serial dilutions, and concentration conversions commonly used in lab experiments.
    </p>

    <!-- Interactive Demo -->
    <div class="demo-section">
      <h3>Interactive Demo</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
        <div>
          <label class="block text-sm text-text-secondary mb-1">Mode</label>
          <BaseSelect v-model="mode" :options="modeOptions" size="sm" />
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="disabled" size="sm" />
          <span class="text-sm text-text-secondary">Disabled</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="showMW" size="sm" />
          <span class="text-sm text-text-secondary">Show MW</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="useTargetWells" size="sm" />
          <span class="text-sm text-text-secondary">Target Wells</span>
        </div>
      </div>

      <div class="max-w-md">
        <DoseCalculator
          :mode="mode"
          :disabled="disabled"
          :molecular-weight="showMW ? molecularWeight : undefined"
          :target-wells="useTargetWells ? targetWells : undefined"
          @calculate="handleCalculate"
          @apply-to-wells="handleApplyToWells"
        />
      </div>

      <p v-if="useTargetWells" class="text-xs text-text-muted mt-4">
        Target wells: {{ targetWells.join(', ') }}
      </p>
    </div>

    <!-- Dilution Mode -->
    <div class="demo-section">
      <h3>Dilution Mode</h3>
      <p class="text-sm text-text-secondary mb-4">
        Calculate volumes needed to prepare a diluted solution from a stock concentration.
      </p>
      <div class="max-w-md">
        <DoseCalculator mode="dilution" />
      </div>
      <div class="mt-4 p-3 bg-bg-secondary rounded-lg text-sm">
        <p class="font-medium text-text-primary mb-1">C1 x V1 = C2 x V2</p>
        <p class="text-text-muted">Enter stock concentration, desired final concentration, and final volume to calculate the required volumes.</p>
      </div>
    </div>

    <!-- Serial Dilution Mode -->
    <div class="demo-section">
      <h3>Serial Dilution Mode</h3>
      <p class="text-sm text-text-secondary mb-4">
        Generate a series of dilutions for dose-response curves.
      </p>
      <div class="max-w-md">
        <DoseCalculator mode="serial" />
      </div>
    </div>

    <!-- Conversion Mode -->
    <div class="demo-section">
      <h3>Conversion Mode</h3>
      <p class="text-sm text-text-secondary mb-4">
        Convert between concentration units. Requires molecular weight for mass/molarity conversions.
      </p>
      <div class="max-w-md">
        <DoseCalculator mode="conversion" :molecular-weight="180.16" />
      </div>
    </div>

    <!-- With Target Wells -->
    <div class="demo-section">
      <h3>Integration with Well Plates</h3>
      <p class="text-sm text-text-secondary mb-4">
        Pass target well IDs to enable "Apply to wells" functionality for plate-based experiments.
      </p>
      <div class="max-w-md">
        <DoseCalculator
          mode="serial"
          :target-wells="['A1', 'A2', 'A3', 'A4', 'A5', 'A6']"
          @apply-to-wells="handleApplyToWells"
        />
      </div>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>mode</code></td>
            <td><code>'auto' | 'dilution' | 'serial' | 'conversion'</code></td>
            <td><code>'auto'</code></td>
            <td>Calculator mode. 'auto' shows tabbed interface.</td>
          </tr>
          <tr>
            <td><code>molecularWeight</code></td>
            <td><code>number</code></td>
            <td><code>undefined</code></td>
            <td>Molecular weight for mass/molarity conversions</td>
          </tr>
          <tr>
            <td><code>targetWells</code></td>
            <td><code>string[]</code></td>
            <td><code>undefined</code></td>
            <td>Well IDs for "Apply to wells" feature</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable all inputs</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>calculate</code></td>
            <td><code>DilutionResult | SerialDilutionResult</code></td>
            <td>Emitted when calculation is performed</td>
          </tr>
          <tr>
            <td><code>apply-to-wells</code></td>
            <td><code>WellConcentration[]</code></td>
            <td>Emitted when applying to target wells</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Result Types -->
    <div class="demo-section">
      <h3>Result Types</h3>
      <pre class="code-block">interface DilutionResult {
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
}</pre>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;DoseCalculator
  mode="auto"
  :molecular-weight="180.16"
  :target-wells="selectedWells"
  @calculate="handleCalculate"
  @apply-to-wells="handleApply"
/&gt;</pre>
    </div>
  </div>
</template>
