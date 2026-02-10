<script setup lang="ts">
import DoseCalculator from './DoseCalculator.vue'

function initState() {
  return {
    mode: 'auto' as const,
    molecularWeight: 300.44,
    disabled: false,
  }
}
</script>

<template>
  <Story title="Lab/DoseCalculator">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px;">
          <DoseCalculator
            :mode="state.mode"
            :molecular-weight="state.molecularWeight"
            :disabled="state.disabled"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstSelect
          v-model="state.mode"
          title="Mode"
          :options="[
            { value: 'auto', label: 'Auto (Tabs)' },
            { value: 'dilution', label: 'Dilution Only' },
            { value: 'serial', label: 'Serial Only' },
            { value: 'conversion', label: 'Conversion Only' },
          ]"
        />
        <HstSlider v-model="state.molecularWeight" title="Molecular Weight (g/mol)" :min="50" :max="1000" :step="0.1" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Dilution Mode">
      <div style="padding: 2rem; max-width: 500px;">
        <DoseCalculator mode="dilution" :molecular-weight="300.44" />
      </div>
    </Variant>

    <Variant title="Serial Dilution Mode">
      <div style="padding: 2rem; max-width: 500px;">
        <DoseCalculator mode="serial" :molecular-weight="300.44" />
      </div>
    </Variant>

    <Variant title="With Target Wells">
      <div style="padding: 2rem; max-width: 500px;">
        <DoseCalculator
          mode="auto"
          :target-wells="['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px;">
        <DoseCalculator mode="auto" disabled />
      </div>
    </Variant>
  </Story>
</template>
