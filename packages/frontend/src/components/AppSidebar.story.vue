<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import BaseSlider from './BaseSlider.vue'
import BaseSelect from './BaseSelect.vue'
import BaseToggle from './BaseToggle.vue'
import BaseButton from './BaseButton.vue'
import type { SidebarToolSection } from '../types'

const activeView = ref('analysis')

const panels: Record<string, SidebarToolSection[]> = {
  analysis: [
    { id: 'parameters', label: 'Parameters', icon: '⚙' },
    { id: 'filters', label: 'Filters', icon: '🔍', defaultOpen: false },
  ],
  results: [
    { id: 'display', label: 'Display Options', icon: '👁' },
    { id: 'export', label: 'Export', icon: '📥' },
  ],
}

const threshold = ref(50)
const method = ref('linear')
const methods = [
  { value: 'linear', label: 'Linear' },
  { value: 'quadratic', label: 'Quadratic' },
  { value: 'logistic', label: 'Logistic' },
]
const showOutliers = ref(true)
const logScale = ref(false)

const views = ['analysis', 'results', 'settings']
const sides: Array<'left' | 'right'> = ['left', 'right']
</script>

<template>
  <Story title="Layout/AppSidebar">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; height: 500px; position: relative;">
          <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
            <button
              v-for="v in views"
              :key="v"
              :style="{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: state.activeView === v ? 'var(--color-primary, #3b82f6)' : 'var(--bg-card, #fff)',
                color: state.activeView === v ? '#fff' : 'var(--text-primary, #111827)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }"
              @click="state.activeView = v"
            >
              {{ v }}
            </button>
          </div>
          <AppSidebar
            :panels="panels"
            :active-view="state.activeView"
            :floating="state.floating"
            :width="state.width"
            :side="state.side"
          >
            <template #section-parameters>
              <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
              <BaseSelect v-model="method" label="Method" :options="methods" />
            </template>
            <template #section-filters>
              <BaseToggle v-model="showOutliers" label="Exclude outliers" />
            </template>
            <template #section-display>
              <BaseToggle v-model="showOutliers" label="Show outliers" />
              <BaseToggle v-model="logScale" label="Log scale" />
            </template>
            <template #section-export>
              <BaseButton size="sm" variant="secondary">Export CSV</BaseButton>
              <BaseButton size="sm" variant="secondary">Export PNG</BaseButton>
            </template>
          </AppSidebar>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.activeView"
          title="Active View"
          :options="views.map(v => ({ label: v, value: v }))"
        />
        <HstCheckbox v-model="state.floating" title="Floating" />
        <HstText v-model="state.width" title="Width" />
        <HstSelect
          v-model="state.side"
          title="Side"
          :options="sides.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="Toolkit with Sections">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <AppSidebar
          :panels="panels"
          active-view="analysis"
        >
          <template #section-parameters>
            <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
            <BaseSelect v-model="method" label="Method" :options="methods" />
          </template>
          <template #section-filters>
            <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          </template>
        </AppSidebar>
      </div>
    </Variant>

    <Variant title="Multi-View Panel Switching">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
          <button
            v-for="v in views"
            :key="v"
            :style="{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--border-color, #e5e7eb)',
              background: activeView === v ? 'var(--color-primary, #3b82f6)' : 'var(--bg-card, #fff)',
              color: activeView === v ? '#fff' : 'var(--text-primary, #111827)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }"
            @click="activeView = v"
          >
            {{ v }}
          </button>
        </div>
        <AppSidebar
          :panels="panels"
          :active-view="activeView"
        >
          <template #section-parameters>
            <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
          </template>
          <template #section-filters>
            <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          </template>
          <template #section-display>
            <BaseToggle v-model="showOutliers" label="Show outliers" />
            <BaseToggle v-model="logScale" label="Log scale" />
          </template>
          <template #section-export>
            <BaseButton size="sm" variant="secondary">Export CSV</BaseButton>
          </template>
        </AppSidebar>
      </div>
    </Variant>

    <Variant title="Right Side">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <AppSidebar
          :panels="panels"
          active-view="analysis"
          side="right"
        >
          <template #section-parameters>
            <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
          </template>
          <template #section-filters>
            <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          </template>
        </AppSidebar>
      </div>
    </Variant>

    <Variant title="With Header and Footer">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <AppSidebar
          :panels="panels"
          active-view="analysis"
        >
          <template #header>
            <span style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary, #111827);">
              Analysis Tools
            </span>
          </template>
          <template #section-parameters>
            <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
            <BaseSelect v-model="method" label="Method" :options="methods" />
          </template>
          <template #section-filters>
            <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          </template>
          <template #footer>
            <BaseButton size="sm" variant="ghost" style="width: 100%;">Reset Defaults</BaseButton>
          </template>
        </AppSidebar>
      </div>
    </Variant>
  </Story>
</template>
