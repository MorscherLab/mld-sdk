<script setup lang="ts">
import { ref } from 'vue'
import SettingsModal from './SettingsModal.vue'
import type { SettingsTab } from '../types'

const basicOpen = ref(false)
const customOpen = ref(false)
const appearanceOnlyOpen = ref(false)

const customTabs: SettingsTab[] = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'advanced', label: 'Advanced' },
]

const sizes: Array<'md' | 'lg' | 'xl'> = ['md', 'lg', 'xl']
</script>

<template>
  <Story title="Layout/SettingsModal">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
            @click="basicOpen = true"
          >
            Open Settings
          </button>
          <SettingsModal
            v-model="basicOpen"
            :title="state.title"
            :show-appearance="state.showAppearance"
            :size="state.size"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstCheckbox v-model="state.showAppearance" title="Show Appearance" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="Appearance Only">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
          @click="appearanceOnlyOpen = true"
        >
          Appearance Settings
        </button>
        <SettingsModal
          v-model="appearanceOnlyOpen"
          title="Appearance"
          :show-appearance="true"
        />
      </div>
    </Variant>

    <Variant title="With Custom Tabs">
      <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
        <button
          type="button"
          style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; font-size: 0.875rem;"
          @click="customOpen = true"
        >
          Open Settings (Custom Tabs)
        </button>
        <SettingsModal
          v-model="customOpen"
          title="Plugin Settings"
          :tabs="customTabs"
          :show-appearance="true"
          size="lg"
        >
          <template #tab-general>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-primary, #1e293b); margin-bottom: 0.25rem;">Plugin Name</label>
                <input
                  type="text"
                  value="IC50 Calculator"
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
                />
              </div>
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-primary, #1e293b); margin-bottom: 0.25rem;">Default Model</label>
                <select style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;">
                  <option>4-Parameter Logistic</option>
                  <option>3-Parameter Logistic</option>
                  <option>Linear</option>
                </select>
              </div>
            </div>
          </template>
          <template #tab-notifications>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary, #1e293b); font-size: 0.875rem;">
                <input type="checkbox" checked /> Email on analysis complete
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary, #1e293b); font-size: 0.875rem;">
                <input type="checkbox" /> Email on QC failure
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary, #1e293b); font-size: 0.875rem;">
                <input type="checkbox" checked /> In-app notifications
              </label>
            </div>
          </template>
          <template #tab-advanced>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <p style="margin: 0; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
                Advanced settings for curve fitting and data processing.
              </p>
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-primary, #1e293b); margin-bottom: 0.25rem;">Max Iterations</label>
                <input
                  type="number"
                  value="1000"
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
                />
              </div>
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-primary, #1e293b); margin-bottom: 0.25rem;">Convergence Threshold</label>
                <input
                  type="number"
                  value="0.0001"
                  step="0.0001"
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; font-size: 0.875rem; background: var(--bg-primary, #fff); color: var(--text-primary, #1e293b); box-sizing: border-box;"
                />
              </div>
            </div>
          </template>
        </SettingsModal>
      </div>
    </Variant>
  </Story>
</template>
