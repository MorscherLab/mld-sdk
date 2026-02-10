<script setup lang="ts">
import { ref } from 'vue'
import MoleculeInput from './MoleculeInput.vue'
import type { MoleculeData } from './MoleculeInput.vue'

function initState() {
  return {
    modelValue: undefined as MoleculeData | undefined,
    disabled: false,
    readonly: false,
    height: 300,
    showSmiles: true,
    placeholder: 'Draw a chemical structure',
    error: false,
  }
}
</script>

<template>
  <Story title="Lab/MoleculeInput">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 600px;">
          <MoleculeInput
            v-model="state.modelValue"
            :disabled="state.disabled"
            :readonly="state.readonly"
            :height="state.height"
            :show-smiles="state.showSmiles"
            :placeholder="state.placeholder"
            :error="state.error"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstSlider v-model="state.height" title="Height (px)" :min="200" :max="500" />
        <HstCheckbox v-model="state.showSmiles" title="Show SMILES" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Readonly (No Structure)">
      <div style="padding: 2rem; max-width: 600px;">
        <MoleculeInput readonly :height="250" />
      </div>
    </Variant>

    <Variant title="Readonly (With Structure)">
      <div style="padding: 2rem; max-width: 600px;">
        <MoleculeInput
          readonly
          :height="250"
          :model-value="{ smiles: 'CCO', molfile: '' }"
        />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 600px;">
        <MoleculeInput error :height="250" />
      </div>
    </Variant>
  </Story>
</template>
