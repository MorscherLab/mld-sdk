<script setup lang="ts">
import ColorSlider from './ColorSlider.vue'

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <Story title="Base Inputs/ColorSlider">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <ColorSlider
            v-model="state.value"
            :min="state.min"
            :max="state.max"
            :step="state.step"
            :disabled="state.disabled"
            :show-value="state.showValue"
            :show-labels="state.showLabels"
            :min-label="state.minLabel || undefined"
            :max-label="state.maxLabel || undefined"
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
        <HstCheckbox v-model="state.showLabels" title="Show Labels" />
        <HstText v-model="state.minLabel" title="Min Label" />
        <HstText v-model="state.maxLabel" title="Max Label" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <ColorSlider :model-value="50" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="With Labels">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Default labels (min/max values)</p>
          <ColorSlider :model-value="30" show-labels />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Custom labels</p>
          <ColorSlider :model-value="60" show-labels min-label="Low" max-label="High" />
        </div>
      </div>
    </Variant>

    <Variant title="Custom Color Stops">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Blue to Red (cold to hot)</p>
          <ColorSlider
            :model-value="50"
            :color-stops="[
              { value: 0, color: '#3b82f6' },
              { value: 50, color: '#a855f7' },
              { value: 100, color: '#ef4444' },
            ]"
            show-labels
            min-label="Cold"
            max-label="Hot"
          />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">Single color intensity</p>
          <ColorSlider
            :model-value="70"
            :color-stops="[
              { value: 0, color: '#dbeafe' },
              { value: 100, color: '#1d4ed8' },
            ]"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Custom Thresholds">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">
          Green below 25%, yellow below 75%, red above
        </p>
        <ColorSlider
          :model-value="50"
          :thresholds="[25, 75]"
          show-labels
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <ColorSlider :model-value="65" disabled />
      </div>
    </Variant>
  </Story>
</template>
