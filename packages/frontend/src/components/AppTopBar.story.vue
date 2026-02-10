<script setup lang="ts">
import AppTopBar from './AppTopBar.vue'
import type { TopBarVariant, TopBarPage, TopBarTab } from '../types'

const variants: TopBarVariant[] = ['card', 'default']

const samplePages: TopBarPage[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview and statistics' },
  { id: 'experiments', label: 'Experiments', description: 'Manage experiments' },
  { id: 'analysis', label: 'Analysis', description: 'Run analysis pipelines' },
  { id: 'settings', label: 'Settings', disabled: true },
]

const sampleTabs: TopBarTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'results', label: 'Results' },
  {
    id: 'export',
    label: 'Export',
    children: [
      { id: 'export-csv', label: 'CSV', description: 'Comma-separated values' },
      { id: 'export-xlsx', label: 'Excel', description: 'Microsoft Excel format' },
      { id: 'export-pdf', label: 'PDF', description: 'Portable Document Format' },
    ],
  },
]
</script>

<template>
  <Story title="Layout/AppTopBar">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <AppTopBar
            :title="state.title"
            :subtitle="state.subtitle"
            :variant="state.variant"
            :show-logo="state.showLogo"
            :show-theme-toggle="state.showThemeToggle"
            :home-path="state.homePath"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.subtitle" title="Subtitle" />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstCheckbox v-model="state.showLogo" title="Show Logo" />
        <HstCheckbox v-model="state.showThemeToggle" title="Show Theme Toggle" />
        <HstText v-model="state.homePath" title="Home Path" />
      </template>
    </Variant>

    <Variant title="With Title and Subtitle">
      <div style="padding: 2rem;">
        <AppTopBar
          title="Dose-Response Analysis"
          subtitle="Experiment EXP-2024-001"
          :show-theme-toggle="true"
        />
      </div>
    </Variant>

    <Variant title="Plugin Breadcrumb with Pages">
      <div style="padding: 2rem;">
        <AppTopBar
          plugin-name="IC50 Calculator"
          title="Results"
          :pages="samplePages"
          current-page-id="analysis"
          variant="card"
          :show-theme-toggle="true"
          home-path=""
        />
      </div>
    </Variant>

    <Variant title="With Tabs">
      <div style="padding: 2rem;">
        <AppTopBar
          plugin-name="Plate Analyzer"
          title="Experiment View"
          :tabs="sampleTabs"
          current-tab-id="overview"
          variant="card"
          home-path=""
        />
      </div>
    </Variant>

    <Variant title="Default Variant">
      <div style="padding: 2rem;">
        <AppTopBar
          title="My Plugin"
          variant="default"
          :show-theme-toggle="true"
        />
      </div>
    </Variant>

    <Variant title="Minimal (Logo Only)">
      <div style="padding: 2rem;">
        <AppTopBar :show-logo="true" home-path="/" />
      </div>
    </Variant>
  </Story>
</template>
