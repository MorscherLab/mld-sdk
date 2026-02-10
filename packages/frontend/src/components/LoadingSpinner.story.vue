<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'
import type { SpinnerSize, SpinnerVariant } from '../types'

const sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg']
const variants: SpinnerVariant[] = ['primary', 'cta', 'muted']
</script>

<template>
  <Story title="Feedback/LoadingSpinner">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <LoadingSpinner
            :size="state.size"
            :variant="state.variant"
            :label="state.label"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstText v-model="state.label" title="Label" />
      </template>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: flex-end; justify-content: center;">
        <div v-for="size in sizes" :key="size" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <LoadingSpinner :size="size" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">{{ size }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; justify-content: center;">
        <div v-for="variant in variants" :key="variant" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <LoadingSpinner :variant="variant" size="md" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">{{ variant }}</span>
        </div>
      </div>
    </Variant>

    <Variant title="Custom Labels">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; align-items: center;">
        <LoadingSpinner size="md" label="Loading experiments..." />
        <LoadingSpinner size="sm" label="Processing plates..." variant="cta" />
        <LoadingSpinner size="lg" label="Analyzing data..." />
      </div>
    </Variant>

    <Variant title="Inline Usage">
      <div style="padding: 2rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
        <LoadingSpinner size="xs" label="" />
        <span style="color: var(--text-muted, #94a3b8); font-size: 0.875rem;">Fetching results...</span>
      </div>
    </Variant>
  </Story>
</template>
