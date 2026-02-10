<script setup lang="ts">
import BaseSlider from './BaseSlider.vue'

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <Story title="Base Inputs/BaseSlider">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <BaseSlider
            v-model="state.value"
            :min="state.min"
            :max="state.max"
            :step="state.step"
            :disabled="state.disabled"
            :show-value="state.showValue"
            :size="state.size"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ state.value }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSlider v-model="state.value" title="Value" :min="0" :max="100" />
        <HstSlider v-model="state.min" title="Min" :min="0" :max="50" />
        <HstSlider v-model="state.max" title="Max" :min="50" :max="200" />
        <HstSlider v-model="state.step" title="Step" :min="1" :max="25" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.showValue" title="Show Value" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <BaseSlider :model-value="50" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="Custom Range">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Temperature (0-40)</p>
          <BaseSlider :model-value="25" :min="0" :max="40" :step="0.5" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Percentage (0-100, step 5)</p>
          <BaseSlider :model-value="75" :min="0" :max="100" :step="5" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Concentration (1-1000)</p>
          <BaseSlider :model-value="500" :min="1" :max="1000" :step="1" />
        </div>
      </div>
    </Variant>

    <Variant title="Without Value Display">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseSlider :model-value="60" :show-value="false" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseSlider :model-value="35" disabled />
      </div>
    </Variant>
  </Story>
</template>
