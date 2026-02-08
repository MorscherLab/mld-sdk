<script setup lang="ts">
import { ChemicalFormula } from '@morscherlab/mld-sdk'
</script>

<template>
  <DemoSection title="Common Formulas">
    <div class="flex flex-wrap gap-6 items-baseline">
      <div v-for="f in ['H2O', 'NaCl', 'CO2', 'C6H12O6', 'H2SO4']" :key="f" class="text-center">
        <ChemicalFormula :formula="f" />
        <p class="text-xs text-text-secondary mt-1">{{ f }}</p>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="Parenthesized Groups">
    <div class="flex flex-wrap gap-6 items-baseline">
      <ChemicalFormula formula="Ca(OH)2" />
      <ChemicalFormula formula="Mg3(PO4)2" />
      <ChemicalFormula formula="Al2(SO4)3" />
    </div>
  </DemoSection>

  <DemoSection title="Hydrates">
    <ChemicalFormula formula="CuSO4·5H2O" />
  </DemoSection>

  <DemoSection title="Charges">
    <div class="flex flex-wrap gap-6 items-baseline">
      <ChemicalFormula formula="Ca2+" />
      <ChemicalFormula formula="SO4^2-" />
      <ChemicalFormula formula="Fe3+" />
    </div>
  </DemoSection>

  <DemoSection title="Block Mode">
    <ChemicalFormula formula="C6H12O6" :inline="false" />
  </DemoSection>
</template>
