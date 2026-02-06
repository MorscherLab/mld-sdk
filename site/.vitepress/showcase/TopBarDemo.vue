<script setup lang="ts">
import { ref } from 'vue'
import { AppTopBar, ThemeToggle, SettingsButton, BaseButton, type TopBarPage, type TopBarTab, type TopBarTabOption } from '@morscherlab/mld-sdk'

const pages: TopBarPage[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview and analytics' },
  { id: 'experiments', label: 'Experiments', description: 'Manage your experiments' },
  { id: 'analysis', label: 'Analysis', description: 'Run analysis workflows' },
  { id: 'settings', label: 'Settings', description: 'Configure your preferences', disabled: true },
]

const tabs: TopBarTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'data', label: 'Data' },
  {
    id: 'analysis',
    label: 'Analysis',
    children: [
      { id: 'pca', label: 'PCA', description: 'Principal Component Analysis' },
      { id: 'clustering', label: 'Clustering', description: 'Hierarchical clustering' },
      { id: 'statistics', label: 'Statistics', description: 'Statistical tests' },
    ],
  },
  {
    id: 'export',
    label: 'Export',
    children: [
      { id: 'csv', label: 'CSV' },
      { id: 'excel', label: 'Excel' },
      { id: 'pdf', label: 'PDF Report' },
    ],
  },
]

const currentPage = ref('dashboard')
const currentTab = ref('overview')

function handlePageSelect(page: TopBarPage) {
  currentPage.value = page.id
}

function handleTabSelect(tab: TopBarTab) {
  currentTab.value = tab.id
  console.log('Tab selected:', tab.label)
}

function handleTabOptionSelect(option: TopBarTabOption, tab: TopBarTab) {
  currentTab.value = option.id
  console.log('Tab option selected:', option.label, 'from', tab.label)
}
</script>

<template>
  <!-- Admin Dashboard Style -->
  <DemoSection title="Admin Dashboard Style (Title + Subtitle)">
    <p class="text-sm text-text-secondary mb-4">
      Uses <code>title</code> and <code>subtitle</code> props with a custom icon.
    </p>
    <div class="border border-border rounded-mld overflow-hidden">
      <AppTopBar
        variant="default"
        title="Admin Dashboard"
        subtitle="Manage users, plugins, and system configuration"
      >
        <template #icon>
          <div class="w-9 h-9 bg-mld-primary/10 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-mld-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </template>
        <template #actions>
          <SettingsButton size="sm" />
          <ThemeToggle size="sm" />
        </template>
      </AppTopBar>
    </div>
  </DemoSection>

  <!-- Basic Usage -->
  <DemoSection title="Basic with Title">
    <div class="border border-border rounded-mld overflow-hidden">
      <AppTopBar variant="default" title="Page Title" />
    </div>
  </DemoSection>

  <!-- With Plugin Name and Pages Dropdown -->
  <DemoSection title="With Plugin Name and Pages Dropdown">
    <p class="text-sm text-text-secondary mb-4">Click the plugin name to open the pages dropdown</p>
    <div class="border border-border rounded-mld">
      <AppTopBar
        variant="default"
        plugin-name="Analysis Plugin"
        title="Results"
        :pages="pages"
        :current-page-id="currentPage"
        class="rounded-mld"
        @page-select="handlePageSelect"
      />
    </div>
    <p class="mt-2 text-sm text-text-secondary">Current page: {{ currentPage }}</p>
  </DemoSection>

  <!-- With Actions Slot -->
  <DemoSection title="With Actions Slot">
    <div class="border border-border rounded-mld overflow-hidden">
      <AppTopBar
        variant="default"
        plugin-name="Experiment Designer"
        title="New Experiment"
      >
        <template #actions>
          <BaseButton size="sm" variant="ghost">Cancel</BaseButton>
          <BaseButton size="sm" variant="primary">Save</BaseButton>
        </template>
      </AppTopBar>
    </div>
  </DemoSection>

  <!-- With Theme Toggle -->
  <DemoSection title="With Theme Toggle">
    <div class="border border-border rounded-mld overflow-hidden">
      <AppTopBar variant="default" title="Dashboard">
        <template #actions>
          <ThemeToggle size="sm" />
        </template>
      </AppTopBar>
    </div>
  </DemoSection>

  <!-- Custom Logo Slot -->
  <DemoSection title="Custom Logo Slot">
    <div class="border border-border rounded-mld overflow-hidden">
      <AppTopBar variant="default" title="Custom Logo Example">
        <template #logo>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-mld-cta rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">CL</span>
            </div>
            <span class="font-semibold text-text-primary">Custom</span>
          </div>
        </template>
      </AppTopBar>
    </div>
  </DemoSection>

  <!-- Floating Style -->
  <DemoSection title="Floating Style">
    <p class="text-sm text-text-secondary mb-4">
      When <code>floating</code> is true, the topbar has rounded corners with shadow and uses fixed positioning.
      In this demo, we simulate the styling without fixed positioning.
    </p>
    <div class="bg-bg-primary p-4 rounded-mld">
      <div class="rounded-xl shadow-sm border border-border overflow-hidden">
        <AppTopBar
          variant="default"
          plugin-name="Analytics"
          title="Reports"
        >
          <template #actions>
            <BaseButton size="sm" variant="secondary">Export</BaseButton>
          </template>
        </AppTopBar>
      </div>
    </div>
  </DemoSection>

  <!-- With Tabs -->
  <DemoSection title="With Tabs">
    <p class="text-sm text-text-secondary mb-4">
      Tabs in the center of the topbar. Some tabs have dropdown options.
    </p>
    <div class="border border-border rounded-mld">
      <AppTopBar
        variant="default"
        plugin-name="Experiment"
        title="EXP-001"
        :tabs="tabs"
        :current-tab-id="currentTab"
        class="rounded-mld"
        @tab-select="handleTabSelect"
        @tab-option-select="handleTabOptionSelect"
      >
        <template #actions>
          <ThemeToggle size="sm" />
        </template>
      </AppTopBar>
    </div>
    <p class="mt-2 text-sm text-text-secondary">Current tab: {{ currentTab }}</p>
  </DemoSection>

  <!-- Floating with Tabs -->
  <DemoSection title="Floating with Tabs">
    <p class="text-sm text-text-secondary mb-4">
      Demonstrates floating style with tabs (simulated without fixed positioning).
    </p>
    <div class="bg-bg-primary p-4 rounded-mld">
      <div class="rounded-xl shadow-sm border border-border">
        <AppTopBar
          variant="default"
          plugin-name="Dashboard"
          :tabs="tabs"
          :current-tab-id="currentTab"
          class="rounded-xl"
          @tab-select="handleTabSelect"
          @tab-option-select="handleTabOptionSelect"
        >
          <template #actions>
            <BaseButton size="sm" variant="primary">Save</BaseButton>
          </template>
        </AppTopBar>
      </div>
    </div>
  </DemoSection>

  <!-- Without Logo -->
  <DemoSection title="Without Logo">
    <div class="border border-border rounded-mld overflow-hidden">
      <AppTopBar
        variant="default"
        title="Minimal Header"
        :show-logo="false"
      />
    </div>
  </DemoSection>
</template>
