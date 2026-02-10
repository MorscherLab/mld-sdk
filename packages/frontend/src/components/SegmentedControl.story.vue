<script setup lang="ts">
import SegmentedControl from './SegmentedControl.vue'
import type { SegmentedOption } from '../types'

const sizes = ['sm', 'md', 'lg'] as const
const variants = ['simple', 'card'] as const

const basicOptions: SegmentedOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const plateOptions: SegmentedOption[] = [
  { value: 6, label: '6-well' },
  { value: 12, label: '12-well' },
  { value: 24, label: '24-well' },
  { value: 48, label: '48-well' },
  { value: 96, label: '96-well' },
  { value: 384, label: '384-well' },
]

const cardOptions: SegmentedOption[] = [
  { value: 'basic', label: 'Basic', description: 'Simple endpoint analysis' },
  { value: 'standard', label: 'Standard', description: 'Dose-response curves' },
  { value: 'advanced', label: 'Advanced', description: 'Full kinetic modeling' },
]

const withDisabledOptions: SegmentedOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'deleted', label: 'Deleted', disabled: true },
]
</script>

<template>
  <Story title="Base Inputs/SegmentedControl">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <SegmentedControl
            v-model="state.value"
            :options="basicOptions"
            :variant="state.variant"
            :size="state.size"
            :full-width="state.fullWidth"
            :disabled="state.disabled"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
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
        <HstCheckbox v-model="state.fullWidth" title="Full Width" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="All Sizes (Simple)">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <SegmentedControl :model-value="'week'" :options="basicOptions" :size="size" variant="simple" />
        </div>
      </div>
    </Variant>

    <Variant title="Card Variant">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <SegmentedControl :model-value="'standard'" :options="cardOptions" variant="card" />
      </div>
    </Variant>

    <Variant title="Many Options">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <SegmentedControl :model-value="96" :options="plateOptions" variant="simple" />
      </div>
    </Variant>

    <Variant title="With Disabled Option">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <SegmentedControl :model-value="'active'" :options="withDisabledOptions" variant="simple" />
      </div>
    </Variant>

    <Variant title="Not Full Width">
      <div style="padding: 2rem;">
        <SegmentedControl :model-value="'day'" :options="basicOptions" :full-width="false" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <SegmentedControl :model-value="'week'" :options="basicOptions" disabled />
      </div>
    </Variant>
  </Story>
</template>
