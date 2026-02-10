<script setup lang="ts">
import { ref } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'

const sizes = ['sm', 'md', 'lg'] as const
const checked = ref(true)
</script>

<template>
  <Story title="Base Inputs/BaseCheckbox">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <BaseCheckbox
            v-model="state.checked"
            :label="state.label"
            :disabled="state.disabled"
            :size="state.size"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Checked: <code>{{ state.checked }}</code>
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
        <HstCheckbox v-model="state.checked" title="Checked" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <BaseCheckbox v-model="checked" :label="`${size} checkbox`" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="Without Label">
      <div style="padding: 2rem; display: flex; gap: 1rem; align-items: center;">
        <BaseCheckbox v-model="checked" />
        <BaseCheckbox :model-value="false" />
      </div>
    </Variant>

    <Variant title="Disabled States">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
        <BaseCheckbox :model-value="false" label="Disabled unchecked" disabled />
        <BaseCheckbox :model-value="true" label="Disabled checked" disabled />
      </div>
    </Variant>

    <Variant title="Form Group">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <p style="margin: 0 0 0.25rem; font-weight: 600; color: var(--text-primary, #e2e8f0);">Notification Preferences</p>
        <BaseCheckbox :model-value="true" label="Email notifications" />
        <BaseCheckbox :model-value="true" label="Push notifications" />
        <BaseCheckbox :model-value="false" label="SMS notifications" />
        <BaseCheckbox :model-value="false" label="Weekly digest" disabled />
      </div>
    </Variant>
  </Story>
</template>
