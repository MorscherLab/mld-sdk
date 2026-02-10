<script setup lang="ts">
import BasePill from './BasePill.vue'
import type { PillVariant, PillSize } from '../types'

const variants: PillVariant[] = ['default', 'primary', 'success', 'warning', 'error', 'info', 'outline']
const sizes: PillSize[] = ['sm', 'md', 'lg']
</script>

<template>
  <Story title="Feedback/BasePill">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <BasePill
            :variant="state.variant"
            :size="state.size"
            :removable="state.removable"
            :disabled="state.disabled"
            @remove="() => console.log('Remove clicked')"
          >
            {{ state.label }}
          </BasePill>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.removable" title="Removable" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <BasePill
              v-for="variant in variants"
              :key="variant"
              :variant="variant"
              :size="size"
            >
              {{ variant }}
            </BasePill>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Removable">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; justify-content: center;">
        <BasePill variant="primary" removable @remove="() => console.log('Removed')">
          Sample A
        </BasePill>
        <BasePill variant="success" removable @remove="() => console.log('Removed')">
          QC Passed
        </BasePill>
        <BasePill variant="warning" removable @remove="() => console.log('Removed')">
          Review
        </BasePill>
        <BasePill variant="error" removable @remove="() => console.log('Removed')">
          Failed
        </BasePill>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; justify-content: center;">
        <BasePill
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          disabled
        >
          {{ variant }}
        </BasePill>
      </div>
    </Variant>

    <Variant title="Practical Example - Tags">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <h3 style="margin: 0 0 0.75rem; color: var(--text-primary, #1e293b); font-size: 0.875rem; font-weight: 600;">
          Experiment Tags
        </h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <BasePill variant="primary" removable>dose-response</BasePill>
          <BasePill variant="info" removable>IC50</BasePill>
          <BasePill variant="success" removable>validated</BasePill>
          <BasePill variant="outline" removable>96-well</BasePill>
          <BasePill variant="default" removable>oncology</BasePill>
        </div>
      </div>
    </Variant>

    <Variant title="Practical Example - Status Labels">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Plate PLT-001</span>
            <BasePill variant="success" size="sm">Complete</BasePill>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Plate PLT-002</span>
            <BasePill variant="warning" size="sm">In Progress</BasePill>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Plate PLT-003</span>
            <BasePill variant="error" size="sm">Failed</BasePill>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem;">
            <span style="color: var(--text-primary, #1e293b); font-size: 0.875rem;">Plate PLT-004</span>
            <BasePill variant="default" size="sm">Pending</BasePill>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
