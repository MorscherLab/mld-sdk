<script setup lang="ts">
import { ref } from 'vue'
import BaseToggle from './BaseToggle.vue'

const sizes = ['sm', 'md', 'lg'] as const
const toggleOn = ref(true)
const toggleOff = ref(false)
</script>

<template>
  <Story title="Base Inputs/BaseToggle">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <BaseToggle
            v-model="state.value"
            :label="state.label"
            :disabled="state.disabled"
            :size="state.size"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ state.value }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.value" title="Value" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <BaseToggle v-model="toggleOn" :label="`${size} toggle`" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="On and Off States">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
        <BaseToggle v-model="toggleOn" label="Toggle is ON" />
        <BaseToggle v-model="toggleOff" label="Toggle is OFF" />
      </div>
    </Variant>

    <Variant title="Without Label">
      <div style="padding: 2rem; display: flex; gap: 1.5rem; align-items: center;">
        <BaseToggle v-model="toggleOn" size="sm" />
        <BaseToggle v-model="toggleOn" size="md" />
        <BaseToggle v-model="toggleOn" size="lg" />
      </div>
    </Variant>

    <Variant title="Disabled States">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
        <BaseToggle :model-value="false" label="Disabled (off)" disabled />
        <BaseToggle :model-value="true" label="Disabled (on)" disabled />
      </div>
    </Variant>

    <Variant title="Settings Example">
      <div style="padding: 2rem; max-width: 400px; display: flex; flex-direction: column; gap: 1rem;">
        <BaseToggle :model-value="true" label="Dark mode" />
        <BaseToggle :model-value="true" label="Auto-save results" />
        <BaseToggle :model-value="false" label="Show advanced options" />
        <BaseToggle :model-value="false" label="Beta features" disabled />
      </div>
    </Variant>
  </Story>
</template>
