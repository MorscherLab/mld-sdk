<script setup lang="ts">
import { ref } from 'vue'
import { UnitInput } from '@morscherlab/mld-sdk'

const massValue = ref(500)
const massUnit = ref('mg')
const massUnits = [
  { value: 'ng', label: 'ng', factor: 1e-9, group: 'Mass' },
  { value: 'µg', label: 'µg', factor: 1e-6, group: 'Mass' },
  { value: 'mg', label: 'mg', factor: 1e-3, group: 'Mass' },
  { value: 'g', label: 'g', factor: 1, group: 'Mass' },
  { value: 'kg', label: 'kg', factor: 1e3, group: 'Mass' },
]

const volValue = ref(10)
const volUnit = ref('mL')
const volumeUnits = [
  { value: 'µL', label: 'µL', factor: 1e-6 },
  { value: 'mL', label: 'mL', factor: 1e-3 },
  { value: 'L', label: 'L', factor: 1 },
]

const tempValue = ref(37)
const tempUnit = ref('C')
const tempUnits = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
  { value: 'K', label: 'K' },
]
</script>

<template>
  <DemoSection title="With Conversion">
    <div class="max-w-xs">
      <UnitInput
        v-model="massValue"
        v-model:unit="massUnit"
        :units="massUnits"
        :convert-on-unit-change="true"
        :precision="3"
      />
      <p class="text-xs text-text-secondary mt-2">Value: {{ massValue }} {{ massUnit }}</p>
    </div>
  </DemoSection>

  <DemoSection title="Volume (no conversion)">
    <div class="max-w-xs">
      <UnitInput v-model="volValue" v-model:unit="volUnit" :units="volumeUnits" />
    </div>
  </DemoSection>

  <DemoSection title="Temperature (no factor)">
    <div class="max-w-xs">
      <UnitInput v-model="tempValue" v-model:unit="tempUnit" :units="tempUnits" />
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="flex flex-col gap-3 max-w-xs">
      <UnitInput :model-value="100" unit="mg" :units="massUnits" size="sm" />
      <UnitInput :model-value="100" unit="mg" :units="massUnits" size="md" />
      <UnitInput :model-value="100" unit="mg" :units="massUnits" size="lg" />
    </div>
  </DemoSection>

  <DemoSection title="Error & Disabled">
    <div class="flex flex-col gap-3 max-w-xs">
      <UnitInput :model-value="100" unit="mg" :units="massUnits" :error="true" />
      <UnitInput :model-value="100" unit="mg" :units="massUnits" :disabled="true" />
    </div>
  </DemoSection>
</template>
