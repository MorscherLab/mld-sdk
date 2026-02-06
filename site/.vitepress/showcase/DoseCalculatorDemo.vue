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
</template>
