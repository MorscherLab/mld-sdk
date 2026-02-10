<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from './AppLayout.vue'
import AppTopBar from './AppTopBar.vue'
import AppSidebar from './AppSidebar.vue'
import BaseSlider from './BaseSlider.vue'
import BaseSelect from './BaseSelect.vue'
import BaseToggle from './BaseToggle.vue'
import BaseButton from './BaseButton.vue'
import type { SidebarToolSection, TopBarTab } from '../types'

const activeTab = ref('analysis')

const tabs: TopBarTab[] = [
  { id: 'analysis', label: 'Analysis' },
  { id: 'results', label: 'Results' },
  { id: 'settings', label: 'Settings' },
]

const toolPanels: Record<string, SidebarToolSection[]> = {
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
]
const showOutliers = ref(true)
const logScale = ref(false)
</script>

<template>
  <Story title="Layout/AppLayout">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="height: 600px;">
          <AppLayout
            :sidebar-position="state.sidebarPosition"
            :floating="state.floating ?? true"
            :sidebar-width="state.sidebarWidth"
          >
            <template #topbar>
              <AppTopBar
                title="My Plugin"
                subtitle="Laboratory Analysis"
                :tabs="tabs"
                :current-tab-id="activeTab"
                :show-theme-toggle="true"
                home-path=""
                @tab-select="t => activeTab = t.id"
              />
            </template>
            <template #sidebar>
              <AppSidebar
                :panels="toolPanels"
                :active-view="activeTab"
                :floating="false"
                :side="state.sidebarPosition"
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
            </template>
            <div style="padding: 2rem;">
              <h2 style="margin: 0 0 1rem; color: var(--text-primary, #1e293b);">
                {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }}
              </h2>
              <p style="color: var(--text-muted, #94a3b8);">
                Main content area. The sidebar shows tools for the "{{ activeTab }}" view.
                Switch tabs to see different tool panels (settings tab has none).
              </p>
            </div>
          </AppLayout>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.sidebarPosition"
          title="Sidebar Position"
          :options="[{ label: 'left', value: 'left' }, { label: 'right', value: 'right' }]"
        />
        <HstCheckbox v-model="state.floating" title="Floating" />
        <HstText v-model="state.sidebarWidth" title="Sidebar Width" />
      </template>
    </Variant>

    <Variant title="Full Layout (Floating)">
      <div style="height: 600px;">
        <AppLayout
          :floating="true"
          sidebar-width="280px"
        >
          <template #topbar>
            <AppTopBar
              plugin-name="Plate Analyzer"
              title="Dashboard"
              :tabs="tabs"
              :current-tab-id="activeTab"
              :show-theme-toggle="true"
              home-path=""
              @tab-select="t => activeTab = t.id"
            />
          </template>
          <template #sidebar>
            <AppSidebar
              :panels="toolPanels"
              :active-view="activeTab"
              :floating="false"
            >
              <template #header>
                <span style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary, #111827);">
                  Tools
                </span>
              </template>
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
              </template>
            </AppSidebar>
          </template>
          <div style="padding: 2rem;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
              <div style="padding: 1.5rem; background: var(--bg-card, #fff); border-radius: 0.5rem; border: 1px solid var(--border-color, #e2e8f0);">
                <p style="margin: 0 0 0.25rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">Experiments</p>
                <p style="margin: 0; font-size: 1.5rem; font-weight: 600; color: var(--text-primary, #1e293b);">24</p>
              </div>
              <div style="padding: 1.5rem; background: var(--bg-card, #fff); border-radius: 0.5rem; border: 1px solid var(--border-color, #e2e8f0);">
                <p style="margin: 0 0 0.25rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">Plates</p>
                <p style="margin: 0; font-size: 1.5rem; font-weight: 600; color: var(--text-primary, #1e293b);">156</p>
              </div>
              <div style="padding: 1.5rem; background: var(--bg-card, #fff); border-radius: 0.5rem; border: 1px solid var(--border-color, #e2e8f0);">
                <p style="margin: 0 0 0.25rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">Analyses</p>
                <p style="margin: 0; font-size: 1.5rem; font-weight: 600; color: var(--text-primary, #1e293b);">89</p>
              </div>
            </div>
          </div>
        </AppLayout>
      </div>
    </Variant>

    <Variant title="Without Sidebar">
      <div style="height: 400px;">
        <AppLayout>
          <template #topbar>
            <AppTopBar title="Simple Page" :show-theme-toggle="true" home-path="" />
          </template>
          <div style="padding: 2rem;">
            <p style="color: var(--text-muted, #94a3b8);">Layout without a sidebar, just topbar and content.</p>
          </div>
        </AppLayout>
      </div>
    </Variant>

    <Variant title="Right Sidebar">
      <div style="height: 500px;">
        <AppLayout
          sidebar-position="right"
          sidebar-width="260px"
        >
          <template #topbar>
            <AppTopBar title="Right Sidebar Layout" home-path="" />
          </template>
          <template #sidebar>
            <AppSidebar
              :panels="toolPanels"
              active-view="analysis"
              :floating="false"
              side="right"
            >
              <template #section-parameters>
                <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
              </template>
              <template #section-filters>
                <BaseToggle v-model="showOutliers" label="Exclude outliers" />
              </template>
            </AppSidebar>
          </template>
          <div style="padding: 2rem;">
            <p style="color: var(--text-muted, #94a3b8);">Main content with sidebar on the right side.</p>
          </div>
        </AppLayout>
      </div>
    </Variant>
  </Story>
</template>
