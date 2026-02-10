<script setup lang="ts">
import BaseRadioGroup from './BaseRadioGroup.vue'
import type { RadioOption } from '../types'

const sizes = ['sm', 'md', 'lg'] as const
const directions = ['vertical', 'horizontal'] as const

const basicOptions: RadioOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const analysisOptions: RadioOption[] = [
  { value: 'dose_response', label: 'Dose-Response', description: 'Fit dose-response curves to your data' },
  { value: 'kinetics', label: 'Kinetics', description: 'Analyze time-dependent reactions' },
  { value: 'endpoint', label: 'Endpoint', description: 'Single-timepoint measurement analysis' },
  { value: 'custom', label: 'Custom', description: 'Define your own analysis pipeline', disabled: true },
]
</script>

<template>
  <Story title="Base Inputs/BaseRadioGroup">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <BaseRadioGroup
            v-model="state.value"
            :options="basicOptions"
            :name="'playground-radio'"
            :disabled="state.disabled"
            :direction="state.direction"
            :size="state.size"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstSelect
          v-model="state.direction"
          title="Direction"
          :options="directions.map(d => ({ label: d, value: d }))"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Vertical (Default)">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseRadioGroup
          model-value="option1"
          :options="basicOptions"
          name="vertical-demo"
          direction="vertical"
        />
      </div>
    </Variant>

    <Variant title="Horizontal">
      <div style="padding: 2rem;">
        <BaseRadioGroup
          model-value="option2"
          :options="basicOptions"
          name="horizontal-demo"
          direction="horizontal"
        />
      </div>
    </Variant>

    <Variant title="With Descriptions">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseRadioGroup
          model-value="dose_response"
          :options="analysisOptions"
          name="analysis-type"
        />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <BaseRadioGroup
            model-value="option1"
            :options="basicOptions"
            :name="`size-${size}`"
            :size="size"
            direction="horizontal"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseRadioGroup
          model-value="option2"
          :options="basicOptions"
          name="disabled-demo"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
