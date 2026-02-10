<script setup lang="ts">
import { ref } from 'vue'
import FormulaInput from './FormulaInput.vue'

const formula = ref('')
const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg']
</script>

<template>
  <Story title="Scientific/FormulaInput">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <FormulaInput
            v-model="formula"
            :show-preview="state.showPreview"
            :show-m-w="state.showMW"
            :placeholder="state.placeholder"
            :error="state.error"
            :disabled="state.disabled"
            :size="state.size"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstCheckbox v-model="state.showPreview" title="Show Preview" />
        <HstCheckbox v-model="state.showMW" title="Show Molecular Weight" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Pre-filled Formulas">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">Water</p>
          <FormulaInput model-value="H2O" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">Glucose</p>
          <FormulaInput model-value="C6H12O6" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">Calcium Hydroxide</p>
          <FormulaInput model-value="Ca(OH)2" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">Copper Sulfate Pentahydrate</p>
          <FormulaInput model-value="CuSO4.5H2O" />
        </div>
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <FormulaInput model-value="NaCl" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="Without Preview">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormulaInput model-value="H2SO4" :show-preview="false" />
      </div>
    </Variant>

    <Variant title="Without Molecular Weight">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormulaInput model-value="CH3COOH" :show-m-w="false" />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormulaInput model-value="H2O" error />
      </div>
    </Variant>

    <Variant title="Disabled State">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormulaInput model-value="NaCl" disabled />
      </div>
    </Variant>
  </Story>
</template>
