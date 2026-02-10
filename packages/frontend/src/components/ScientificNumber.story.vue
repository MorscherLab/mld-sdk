<script setup lang="ts">
import { ref } from 'vue'
import ScientificNumber from './ScientificNumber.vue'

type NumberNotation = 'auto' | 'scientific' | 'engineering' | 'compact'
const notations: NumberNotation[] = ['auto', 'scientific', 'engineering', 'compact']

const playgroundValue = ref(0.00042)
</script>

<template>
  <Story title="Data Display/ScientificNumber">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
          <ScientificNumber
            :value="state.value"
            :precision="state.precision"
            :notation="state.notation"
            :unit="state.unit || undefined"
            :copyable="state.copyable"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.value" title="Value" />
        <HstSlider v-model="state.precision" title="Precision" :min="0" :max="8" :step="1" />
        <HstSelect
          v-model="state.notation"
          title="Notation"
          :options="notations.map(n => ({ label: n, value: n }))"
        />
        <HstText v-model="state.unit" title="Unit" />
        <HstCheckbox v-model="state.copyable" title="Copyable" />
      </template>
    </Variant>

    <Variant title="Various Numbers (Auto Notation)">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9375rem;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">Raw Value</th>
              <th style="text-align: left; padding: 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">Formatted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="val in [0.00042, 0.005, 1.23, 42, 1234567, 6.022e23, 1.38e-23, 0, -3.14e-8]" :key="val">
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); font-family: monospace; color: var(--text-muted, #94a3b8);">{{ val }}</td>
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); color: var(--text-primary, #1e293b);">
                <ScientificNumber :value="val" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Variant>

    <Variant title="Notation Comparison">
      <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9375rem;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">Value</th>
              <th v-for="notation in notations" :key="notation" style="text-align: left; padding: 0.5rem; border-bottom: 2px solid var(--border-color, #e2e8f0); color: var(--text-muted, #94a3b8); font-weight: 600;">{{ notation }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="val in [0.00042, 1234567, 6.022e23]" :key="val">
              <td style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); font-family: monospace; color: var(--text-muted, #94a3b8);">{{ val }}</td>
              <td v-for="notation in notations" :key="notation" style="padding: 0.5rem; border-bottom: 1px solid var(--border-color, #e2e8f0); color: var(--text-primary, #1e293b);">
                <ScientificNumber :value="val" :notation="notation" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Variant>

    <Variant title="With Units">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; font-size: 1.125rem;">
        <div style="display: flex; gap: 0.5rem; align-items: baseline;">
          <span style="min-width: 140px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Avogadro:</span>
          <ScientificNumber :value="6.022e23" unit="mol-1" notation="scientific" />
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: baseline;">
          <span style="min-width: 140px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Boltzmann:</span>
          <ScientificNumber :value="1.38e-23" unit="J/K" notation="scientific" />
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: baseline;">
          <span style="min-width: 140px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">IC50:</span>
          <ScientificNumber :value="0.00042" unit="M" notation="auto" />
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: baseline;">
          <span style="min-width: 140px; text-align: right; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Cell count:</span>
          <ScientificNumber :value="5000000" unit="cells/mL" notation="compact" />
        </div>
      </div>
    </Variant>

    <Variant title="Copyable">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; font-size: 1.125rem;">
        <ScientificNumber :value="6.022e23" unit="mol-1" copyable />
        <ScientificNumber :value="0.00042" unit="M" copyable />
        <ScientificNumber :value="1234567" copyable />
      </div>
    </Variant>

    <Variant title="Special Values">
      <div style="padding: 2rem; display: flex; gap: 2rem; align-items: center; justify-content: center; font-size: 1.125rem;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
          <ScientificNumber :value="NaN" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">NaN</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
          <ScientificNumber :value="Infinity" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">Infinity</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
          <ScientificNumber :value="-Infinity" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">-Infinity</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
          <ScientificNumber :value="0" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">Zero</span>
        </div>
      </div>
    </Variant>
  </Story>
</template>
