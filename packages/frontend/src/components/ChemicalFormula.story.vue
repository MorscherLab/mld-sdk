<script setup lang="ts">
import ChemicalFormula from './ChemicalFormula.vue'

const formulas = [
  { formula: 'H2O', name: 'Water' },
  { formula: 'NaCl', name: 'Sodium Chloride' },
  { formula: 'C6H12O6', name: 'Glucose' },
  { formula: 'Ca(OH)2', name: 'Calcium Hydroxide' },
  { formula: 'H2SO4', name: 'Sulfuric Acid' },
  { formula: 'CH3COOH', name: 'Acetic Acid' },
  { formula: 'C2H5OH', name: 'Ethanol' },
  { formula: 'NH3', name: 'Ammonia' },
  { formula: 'CuSO4.5H2O', name: 'Copper Sulfate Pentahydrate' },
  { formula: 'Fe2O3', name: 'Iron(III) Oxide' },
]
</script>

<template>
  <Story title="Data Display/ChemicalFormula">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
          <ChemicalFormula :formula="state.formula" :inline="state.inline" />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.formula" title="Formula" />
        <HstCheckbox v-model="state.inline" title="Inline" />
      </template>
    </Variant>

    <Variant title="Common Formulas">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 1rem;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 0.75rem 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">Name</th>
              <th style="text-align: left; padding: 0.75rem 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">Formula</th>
              <th style="text-align: left; padding: 0.75rem 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">Rendered</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in formulas" :key="item.formula">
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); color: var(--text-primary, #1e293b);">{{ item.name }}</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); font-family: monospace; color: var(--text-muted, #94a3b8);">{{ item.formula }}</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); color: var(--text-primary, #1e293b); font-size: 1.125rem;">
                <ChemicalFormula :formula="item.formula" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Variant>

    <Variant title="Inline in Text">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto; line-height: 1.8; color: var(--text-primary, #1e293b);">
        <p style="margin: 0 0 1rem;">
          The reaction of <ChemicalFormula formula="NaOH" /> with <ChemicalFormula formula="HCl" /> produces
          <ChemicalFormula formula="NaCl" /> and <ChemicalFormula formula="H2O" />.
        </p>
        <p style="margin: 0 0 1rem;">
          Photosynthesis converts <ChemicalFormula formula="CO2" /> and <ChemicalFormula formula="H2O" />
          into <ChemicalFormula formula="C6H12O6" /> and <ChemicalFormula formula="O2" />.
        </p>
        <p style="margin: 0;">
          The drug compound was dissolved in <ChemicalFormula formula="(CH3)2SO" /> (DMSO) at a stock
          concentration of 10 mM.
        </p>
      </div>
    </Variant>

    <Variant title="Block Display">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; font-size: 1.5rem;">
        <ChemicalFormula formula="C6H12O6" :inline="false" />
        <ChemicalFormula formula="Ca(OH)2" :inline="false" />
        <ChemicalFormula formula="CuSO4.5H2O" :inline="false" />
      </div>
    </Variant>

    <Variant title="Complex Formulas">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: center; font-size: 1.25rem;">
        <div style="display: flex; gap: 0.75rem; align-items: baseline;">
          <span style="min-width: 180px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Aspirin:</span>
          <ChemicalFormula formula="C9H8O4" />
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: baseline;">
          <span style="min-width: 180px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Caffeine:</span>
          <ChemicalFormula formula="C8H10N4O2" />
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: baseline;">
          <span style="min-width: 180px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">ATP:</span>
          <ChemicalFormula formula="C10H16N5O13P3" />
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: baseline;">
          <span style="min-width: 180px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Hemoglobin subunit:</span>
          <ChemicalFormula formula="C738H1166N812O203S2Fe" />
        </div>
      </div>
    </Variant>
  </Story>
</template>
