<script setup lang="ts">
import NumberInput from './NumberInput.vue'

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <Story title="Base Inputs/NumberInput">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 300px; margin: 0 auto;">
          <NumberInput
            v-model="state.value"
            :min="state.min"
            :max="state.max"
            :step="state.step"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :placeholder="state.placeholder"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSlider v-model="state.value" title="Value" :min="0" :max="100" />
        <HstSlider v-model="state.min" title="Min" :min="-100" :max="0" />
        <HstSlider v-model="state.max" title="Max" :min="1" :max="1000" />
        <HstSlider v-model="state.step" title="Step" :min="1" :max="50" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 300px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <NumberInput :model-value="42" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="With Constraints">
      <div style="padding: 2rem; max-width: 300px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Sample count (0-384)</p>
          <NumberInput :model-value="96" :min="0" :max="384" :step="1" placeholder="Samples" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Temperature (step 0.5)</p>
          <NumberInput :model-value="37" :min="0" :max="100" :step="0.5" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Volume in uL (step 10)</p>
          <NumberInput :model-value="100" :min="0" :max="1000" :step="10" />
        </div>
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 300px; margin: 0 auto;">
        <NumberInput :model-value="999" :max="100" error />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 300px; margin: 0 auto;">
        <NumberInput :model-value="50" disabled />
      </div>
    </Variant>

    <Variant title="Empty with Placeholder">
      <div style="padding: 2rem; max-width: 300px; margin: 0 auto;">
        <NumberInput placeholder="Enter value..." />
      </div>
    </Variant>
  </Story>
</template>
