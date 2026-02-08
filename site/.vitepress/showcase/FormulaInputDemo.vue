<script setup lang="ts">
import { ref } from 'vue'
import { FormulaInput } from '@morscherlab/mld-sdk'

const formula = ref('Ca(OH)2')
const mw = ref<number | null>(null)
const emptyFormula = ref('')
</script>

<template>
  <DemoSection title="Basic Usage">
    <div class="max-w-sm">
      <FormulaInput v-model="formula" @mw="mw = $event" />
      <p v-if="mw" class="text-xs text-text-secondary mt-2">Emitted MW: {{ mw.toFixed(2) }} g/mol</p>
    </div>
  </DemoSection>

  <DemoSection title="Without Preview">
    <div class="max-w-sm">
      <FormulaInput v-model="emptyFormula" :show-preview="false" placeholder="Type a formula..." />
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="flex flex-col gap-3 max-w-sm">
      <FormulaInput model-value="H2O" size="sm" />
      <FormulaInput model-value="NaCl" size="md" />
      <FormulaInput model-value="C6H12O6" size="lg" />
    </div>
  </DemoSection>

  <DemoSection title="Error State">
    <div class="max-w-sm">
      <FormulaInput model-value="H2O" :error="true" />
    </div>
  </DemoSection>

  <DemoSection title="Disabled">
    <div class="max-w-sm">
      <FormulaInput model-value="NaCl" :disabled="true" />
    </div>
  </DemoSection>
</template>
