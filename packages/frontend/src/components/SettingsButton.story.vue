<script setup lang="ts">
import SettingsButton from './SettingsButton.vue'

const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg']
</script>

<template>
  <Story title="Action/SettingsButton">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <SettingsButton :size="state.size">
            <div style="padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-primary, #1e293b);">
                <input type="checkbox" checked /> Enable notifications
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-primary, #1e293b);">
                <input type="checkbox" /> Auto-save results
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-primary, #1e293b);">
                <input type="checkbox" checked /> Show grid lines
              </label>
            </div>
          </SettingsButton>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; display: flex; gap: 2rem; align-items: center; justify-content: center;">
        <div v-for="size in sizes" :key="size" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <SettingsButton :size="size">
            <div style="padding: 0.75rem; font-size: 0.875rem; color: var(--text-primary, #1e293b);">
              Settings panel content ({{ size }})
            </div>
          </SettingsButton>
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </span>
        </div>
      </div>
    </Variant>

    <Variant title="Empty (Default Slot)">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <SettingsButton />
      </div>
    </Variant>
  </Story>
</template>
