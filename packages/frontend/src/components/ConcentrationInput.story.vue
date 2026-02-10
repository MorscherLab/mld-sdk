<script setup lang="ts">
import ConcentrationInput from './ConcentrationInput.vue'
import type { ConcentrationValue, ConcentrationUnit } from '../composables/useConcentrationUnits'

function initState() {
  return {
    modelValue: { value: 100, unit: 'uM' as ConcentrationUnit } as ConcentrationValue | undefined,
    showConversion: true,
    disabled: false,
    error: false,
    size: 'md' as const,
    placeholder: 'Enter value',
  }
}
</script>

<template>
  <Story title="Lab/ConcentrationInput">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px;">
          <ConcentrationInput
            v-model="state.modelValue"
            :show-conversion="state.showConversion"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :placeholder="state.placeholder"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.showConversion" title="Show Conversion" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
        <HstText v-model="state.placeholder" title="Placeholder" />
      </template>
    </Variant>

    <Variant title="With Min/Max">
      <div style="padding: 2rem; max-width: 400px;">
        <ConcentrationInput
          :model-value="{ value: 50, unit: 'uM' as ConcentrationUnit }"
          :min="0"
          :max="1000"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px;">
        <ConcentrationInput
          :model-value="{ value: 10, unit: 'mM' as ConcentrationUnit }"
          disabled
        />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 400px;">
        <ConcentrationInput
          :model-value="{ value: -5, unit: 'nM' as ConcentrationUnit }"
          error
        />
      </div>
    </Variant>
  </Story>
</template>
