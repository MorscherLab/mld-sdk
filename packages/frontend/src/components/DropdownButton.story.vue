<script setup lang="ts">
import { ref } from 'vue'
import DropdownButton from './DropdownButton.vue'
import type { ButtonVariant, ButtonSize, SelectOption } from '../types'

const variants: ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

const selected = ref<string | undefined>(undefined)

const basicOptions: SelectOption<string>[] = [
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'json', label: 'JSON' },
  { value: 'tsv', label: 'TSV', disabled: true },
]

const descriptiveOptions: SelectOption<string>[] = [
  { value: 'quick', label: 'Quick Analysis', description: 'Basic statistics and QC checks' },
  { value: 'full', label: 'Full Analysis', description: 'Comprehensive dose-response fitting' },
  { value: 'custom', label: 'Custom Pipeline', description: 'Configure analysis steps manually' },
]
</script>

<template>
  <Story title="Action/DropdownButton">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <DropdownButton
            v-model="selected"
            :options="basicOptions"
            :variant="state.variant"
            :size="state.size"
            :disabled="state.disabled"
            :loading="state.loading"
            :placeholder="state.placeholder"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.placeholder" title="Placeholder" />
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
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.loading" title="Loading" />
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start;">
        <div v-for="variant in variants" :key="variant" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <DropdownButton
            :options="basicOptions"
            :variant="variant"
            placeholder="Export as..."
          />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8);">{{ variant }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="With Descriptions">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <DropdownButton
          :options="descriptiveOptions"
          variant="primary"
          placeholder="Run Analysis..."
        />
      </div>
    </Variant>

    <Variant title="Pre-selected Value">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <DropdownButton
          model-value="xlsx"
          :options="basicOptions"
          variant="secondary"
        />
      </div>
    </Variant>

    <Variant title="Disabled Option">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <DropdownButton
          :options="basicOptions"
          variant="secondary"
          placeholder="Export format"
        />
      </div>
    </Variant>
  </Story>
</template>
