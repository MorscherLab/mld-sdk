<script setup lang="ts">
import { ref } from 'vue'
import UnitInput from './UnitInput.vue'

const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg']

const concentrationValue = ref<number | undefined>(10)
const concentrationUnit = ref('uM')

const concentrationUnits = [
  { value: 'M', label: 'M', factor: 1, group: 'Molar' },
  { value: 'mM', label: 'mM', factor: 1e-3, group: 'Molar' },
  { value: 'uM', label: 'uM', factor: 1e-6, group: 'Molar' },
  { value: 'nM', label: 'nM', factor: 1e-9, group: 'Molar' },
  { value: 'pM', label: 'pM', factor: 1e-12, group: 'Molar' },
  { value: 'mg/mL', label: 'mg/mL', factor: 1e-3, group: 'Mass' },
  { value: 'ug/mL', label: 'ug/mL', factor: 1e-6, group: 'Mass' },
  { value: 'ng/mL', label: 'ng/mL', factor: 1e-9, group: 'Mass' },
]

const volumeUnits = [
  { value: 'L', label: 'L', factor: 1 },
  { value: 'mL', label: 'mL', factor: 1e-3 },
  { value: 'uL', label: 'uL', factor: 1e-6 },
  { value: 'nL', label: 'nL', factor: 1e-9 },
]

const temperatureUnits = [
  { value: 'C', label: 'Celsius' },
  { value: 'F', label: 'Fahrenheit' },
  { value: 'K', label: 'Kelvin' },
]

const weightUnits = [
  { value: 'kg', label: 'kg', factor: 1000 },
  { value: 'g', label: 'g', factor: 1 },
  { value: 'mg', label: 'mg', factor: 1e-3 },
  { value: 'ug', label: 'ug', factor: 1e-6 },
]
</script>

<template>
  <Story title="Scientific/UnitInput">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
          <UnitInput
            v-model="concentrationValue"
            v-model:unit="concentrationUnit"
            :units="concentrationUnits"
            :placeholder="state.placeholder"
            :size="state.size"
            :disabled="state.disabled"
            :error="state.error"
            :convert-on-unit-change="state.convertOnUnitChange"
            :precision="state.precision"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstSlider v-model="state.precision" title="Precision" :min="0" :max="8" :step="1" />
        <HstCheckbox v-model="state.convertOnUnitChange" title="Convert on Unit Change" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Concentration (Grouped Units)">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Grouped units with automatic conversion
        </p>
        <UnitInput
          :model-value="10"
          unit="uM"
          :units="concentrationUnits"
          convert-on-unit-change
          :precision="3"
        />
      </div>
    </Variant>

    <Variant title="Volume">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
        <UnitInput
          :model-value="250"
          unit="uL"
          :units="volumeUnits"
          convert-on-unit-change
          :precision="2"
          placeholder="Enter volume"
        />
      </div>
    </Variant>

    <Variant title="Temperature (No Conversion)">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
        <UnitInput
          :model-value="37"
          unit="C"
          :units="temperatureUnits"
          placeholder="Enter temperature"
        />
      </div>
    </Variant>

    <Variant title="Weight with Min/Max">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Clamped between 0 and 1000
        </p>
        <UnitInput
          :model-value="5.5"
          unit="mg"
          :units="weightUnits"
          :min="0"
          :max="1000"
          :step="0.1"
          convert-on-unit-change
          :precision="2"
        />
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <UnitInput
            :model-value="10"
            unit="uM"
            :units="concentrationUnits"
            :size="size"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
        <UnitInput
          :model-value="10"
          unit="uM"
          :units="concentrationUnits"
          error
        />
      </div>
    </Variant>

    <Variant title="Disabled State">
      <div style="padding: 2rem; max-width: 350px; margin: 0 auto;">
        <UnitInput
          :model-value="37"
          unit="C"
          :units="temperatureUnits"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
