<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import ProgressBar from './ProgressBar.vue'
import type { ProgressVariant, ProgressSize } from '../types'

const variants: ProgressVariant[] = ['primary', 'success', 'warning', 'error', 'info']
const sizes: ProgressSize[] = ['sm', 'md', 'lg']

const animatedValue = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

function startAnimation() {
  animatedValue.value = 0
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    animatedValue.value += 2
    if (animatedValue.value >= 100) {
      if (interval) clearInterval(interval)
    }
  }, 100)
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <Story title="Feedback/ProgressBar">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <ProgressBar
            :value="state.value"
            :variant="state.variant"
            :size="state.size"
            :label="state.showLabel ? state.label : undefined"
            :show-value="state.showValue"
            :indeterminate="state.indeterminate"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSlider v-model="state.value" title="Value" :min="0" :max="100" :step="1" />
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
        <HstCheckbox v-model="state.showLabel" title="Show Label" />
        <HstText v-model="state.label" title="Label" />
        <HstCheckbox v-model="state.showValue" title="Show Value" />
        <HstCheckbox v-model="state.indeterminate" title="Indeterminate" />
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="variant in variants" :key="variant">
          <p style="margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ variant }}
          </p>
          <ProgressBar :value="65" :variant="variant" />
        </div>
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <ProgressBar :value="50" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="With Label and Value">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <ProgressBar :value="75" label="Processing plates..." :show-value="true" variant="primary" />
        <ProgressBar :value="100" label="Analysis complete" :show-value="true" variant="success" />
        <ProgressBar :value="33" label="Uploading data..." :show-value="true" variant="info" />
      </div>
    </Variant>

    <Variant title="Indeterminate">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <ProgressBar :indeterminate="true" label="Loading..." variant="primary" />
      </div>
    </Variant>

    <Variant title="Animated">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
          @click="startAnimation"
        >
          Start Progress
        </button>
        <ProgressBar
          :value="animatedValue"
          label="Processing..."
          :show-value="true"
          :variant="animatedValue >= 100 ? 'success' : 'primary'"
        />
      </div>
    </Variant>
  </Story>
</template>
