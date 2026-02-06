<script setup lang="ts">
import { ref } from 'vue'
import { ConcentrationInput, BaseSelect, BaseToggle, type ConcentrationValue, type ConcentrationUnit } from '@morscherlab/mld-sdk'

const concentration = ref<ConcentrationValue | undefined>({ value: 100, unit: 'µM' })
const showConversion = ref(true)
const disabled = ref(false)
const error = ref(false)
const size = ref<'sm' | 'md' | 'lg'>('md')

// Restricted units example
const restrictedConcentration = ref<ConcentrationValue | undefined>({ value: 50, unit: 'nM' })
const molarityOnlyUnits: ConcentrationUnit[] = ['pM', 'nM', 'µM', 'mM', 'M']

// Mass/volume example
const massConcentration = ref<ConcentrationValue | undefined>({ value: 10, unit: 'µg/mL' })

const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]
</script>

<template>
  <!-- Interactive Demo -->
  <div class="demo-section">
    <h3>Interactive Demo</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
      <div>
        <label class="block text-sm text-text-secondary mb-1">Size</label>
        <BaseSelect v-model="size" :options="sizeOptions" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="showConversion" size="sm" />
        <span class="text-sm text-text-secondary">Show Conversion</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="disabled" size="sm" />
        <span class="text-sm text-text-secondary">Disabled</span>
      </div>
      <div class="flex items-center gap-2">
        <BaseToggle v-model="error" size="sm" />
        <span class="text-sm text-text-secondary">Error State</span>
      </div>
    </div>

    <div class="max-w-md">
      <ConcentrationInput
        v-model="concentration"
        :size="size"
        :show-conversion="showConversion"
        :disabled="disabled"
        :error="error"
        placeholder="Enter concentration"
      />
    </div>

    <div v-if="concentration" class="mt-4 p-3 bg-bg-secondary rounded-lg">
      <p class="text-sm text-text-secondary">
        <strong>Value:</strong> {{ concentration.value }} {{ concentration.unit }}
      </p>
    </div>
  </div>

  <!-- Unit Types -->
  <div class="demo-section">
    <h3>Unit Categories</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-4 bg-bg-secondary rounded-lg border border-border">
        <h4 class="font-medium text-text-primary mb-3">Molarity Units</h4>
        <ConcentrationInput
          v-model="restrictedConcentration"
          :allowed-units="molarityOnlyUnits"
          show-conversion
          size="sm"
        />
        <p class="text-xs text-text-muted mt-2">pM, nM, µM, mM, M</p>
      </div>

      <div class="p-4 bg-bg-secondary rounded-lg border border-border">
        <h4 class="font-medium text-text-primary mb-3">Mass/Volume Units</h4>
        <ConcentrationInput
          v-model="massConcentration"
          :allowed-units="['pg/mL', 'ng/mL', 'µg/mL', 'mg/mL', 'g/mL']"
          show-conversion
          size="sm"
        />
        <p class="text-xs text-text-muted mt-2">pg/mL to g/mL</p>
      </div>

      <div class="p-4 bg-bg-secondary rounded-lg border border-border">
        <h4 class="font-medium text-text-primary mb-3">Percentage Units</h4>
        <ConcentrationInput
          :allowed-units="['% v/v', '% w/v', '% w/w']"
          :show-conversion="false"
          size="sm"
        />
        <p class="text-xs text-text-muted mt-2">% v/v, % w/v, % w/w</p>
      </div>
    </div>
  </div>

  <!-- Size Variants -->
  <div class="demo-section">
    <h3>Size Variants</h3>
    <div class="space-y-4 max-w-md">
      <div>
        <p class="text-sm text-text-muted mb-2">Small</p>
        <ConcentrationInput :model-value="{ value: 10, unit: 'nM' }" size="sm" :show-conversion="false" />
      </div>
      <div>
        <p class="text-sm text-text-muted mb-2">Medium (default)</p>
        <ConcentrationInput :model-value="{ value: 100, unit: 'µM' }" size="md" :show-conversion="false" />
      </div>
      <div>
        <p class="text-sm text-text-muted mb-2">Large</p>
        <ConcentrationInput :model-value="{ value: 1, unit: 'mM' }" size="lg" :show-conversion="false" />
      </div>
    </div>
  </div>

  <!-- Min/Max Constraints -->
  <div class="demo-section">
    <h3>Min/Max Constraints</h3>
    <p class="text-sm text-text-secondary mb-4">
      Use min and max props to constrain input values.
    </p>
    <div class="max-w-md">
      <ConcentrationInput
        :model-value="{ value: 50, unit: 'µM' }"
        :min="0"
        :max="1000"
        :allowed-units="['µM']"
        :show-conversion="false"
        placeholder="0-1000"
      />
      <p class="text-xs text-text-muted mt-2">Value constrained between 0 and 1000</p>
    </div>
  </div>
</template>
