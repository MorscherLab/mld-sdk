<script setup lang="ts">
import { ref } from 'vue'
import { AppLayout, AppSidebar, AppTopBar, AppContainer, type SidebarToolSection, type TopBarSettingsConfig } from '@morscherlab/mld-sdk'

const settingsConfig: TopBarSettingsConfig = {
  title: 'App Settings',
  tabs: [{ id: 'general', label: 'General' }],
  showAppearance: true,
}

const sidebarPanels: Record<string, SidebarToolSection[]> = {
  dashboard: [
    { id: 'overview', label: 'Overview', defaultOpen: true },
    { id: 'recent', label: 'Recent Activity' },
  ],
  experiments: [
    { id: 'exp-filters', label: 'Filters', defaultOpen: true },
    { id: 'exp-actions', label: 'Actions' },
  ],
  analysis: [
    { id: 'parameters', label: 'Parameters', defaultOpen: true },
    { id: 'display', label: 'Display Options' },
  ],
  settings: [
    { id: 'general', label: 'General', defaultOpen: true },
  ],
}

const activeItem = ref('dashboard')
const sidebarPosition = ref<'left' | 'right'>('left')
const activeItemBasic = ref('dashboard')
const activeItemMulti = ref('dashboard')
</script>

<template>
  <!-- Floating Layout -->
  <DemoSection title="Floating Layout">
    <p class="text-sm text-text-secondary mb-4">
      AppLayout fills the viewport (<code>height: 100vh; overflow: hidden</code>) so nothing scrolls
      at the page level. The topbar, sidebar, and main content each manage their own overflow.
      With <code>floating</code>, sections render as separate cards with rounded corners, shadows, and gaps.
    </p>
    <div class="h-[480px] border border-border rounded-mld overflow-hidden">
      <AppLayout
        floating
        :sidebar-position="sidebarPosition"
      >
        <template #topbar>
          <AppTopBar
            variant="default"
            show-theme-toggle
            show-settings
            show-standalone-label
            :settings-config="settingsConfig"
          >
            <template #logo>
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-mld-primary rounded flex items-center justify-center">
                  <span class="text-white font-bold text-xs">M</span>
                </div>
                <span class="font-semibold text-text-primary text-sm">My App</span>
              </div>
            </template>
            <template #settings-tab-general>
              <p class="text-sm text-text-secondary">General settings content goes here.</p>
            </template>
          </AppTopBar>
        </template>

        <template #sidebar>
          <AppSidebar
            :floating="false"
            :panels="sidebarPanels"
            :active-view="activeItem"
            :side="sidebarPosition"
          >
            <template #section-overview>
              <p class="text-xs text-text-secondary">Dashboard overview tools</p>
            </template>
            <template #section-recent>
              <p class="text-xs text-text-secondary">Recent activity feed</p>
            </template>
            <template #section-exp-filters>
              <p class="text-xs text-text-secondary">Filter experiments</p>
            </template>
            <template #section-exp-actions>
              <p class="text-xs text-text-secondary">Experiment actions</p>
            </template>
            <template #section-parameters>
              <p class="text-xs text-text-secondary">Analysis parameters</p>
            </template>
            <template #section-display>
              <p class="text-xs text-text-secondary">Display options</p>
            </template>
            <template #section-general>
              <p class="text-xs text-text-secondary">General settings</p>
            </template>
          </AppSidebar>
        </template>

        <AppContainer scrollable>
          <div class="p-6">
            <h2 class="text-lg font-semibold text-text-primary mb-2">Main Content</h2>
            <p class="text-sm text-text-secondary mb-4">
              Active page: <strong>{{ activeItem }}</strong>
            </p>
            <div class="flex gap-2">
              <button
                class="px-3 py-1 text-xs rounded border border-border hover:bg-bg-hover"
                @click="sidebarPosition = sidebarPosition === 'left' ? 'right' : 'left'"
              >
                Toggle sidebar position ({{ sidebarPosition }})
              </button>
              <button
                v-for="page in ['dashboard', 'experiments', 'analysis', 'settings']"
                :key="page"
                class="px-3 py-1 text-xs rounded border border-border hover:bg-bg-hover"
                :class="activeItem === page ? 'bg-mld-primary/10 text-mld-primary' : ''"
                @click="activeItem = page"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </AppContainer>
      </AppLayout>
    </div>
  </DemoSection>

  <!-- Multi-Panel Main Content -->
  <DemoSection title="Multi-Panel Main Content">
    <p class="text-sm text-text-secondary mb-4">
      The main content area is a flex column container with <code>overflow: hidden</code>.
      Consumers compose their own scrollable panels inside it. This demo shows a side-by-side
      split layout where each panel scrolls independently.
    </p>
    <div class="h-[480px] border border-border rounded-mld overflow-hidden">
      <AppLayout
        floating
        sidebar-width="200px"
      >
        <template #topbar>
          <AppTopBar variant="default">
            <template #logo>
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-mld-primary rounded flex items-center justify-center">
                  <span class="text-white font-bold text-xs">M</span>
                </div>
                <span class="font-semibold text-text-primary text-sm">Split View</span>
              </div>
            </template>
          </AppTopBar>
        </template>

        <template #sidebar>
          <AppSidebar
            :floating="false"
            :panels="sidebarPanels"
            :active-view="activeItemMulti"
          >
            <template #section-overview>
              <p class="text-xs text-text-secondary">Dashboard overview tools</p>
            </template>
            <template #section-recent>
              <p class="text-xs text-text-secondary">Recent activity feed</p>
            </template>
            <template #section-exp-filters>
              <p class="text-xs text-text-secondary">Filter experiments</p>
            </template>
            <template #section-exp-actions>
              <p class="text-xs text-text-secondary">Experiment actions</p>
            </template>
            <template #section-parameters>
              <p class="text-xs text-text-secondary">Analysis parameters</p>
            </template>
            <template #section-display>
              <p class="text-xs text-text-secondary">Display options</p>
            </template>
            <template #section-general>
              <p class="text-xs text-text-secondary">General settings</p>
            </template>
          </AppSidebar>
        </template>

        <!-- Multi-panel content: two side-by-side AppContainer cards -->
        <AppContainer direction="row">
          <!-- Left panel: scrollable list -->
          <AppContainer scrollable style="width: 240px; flex: none;">
            <div class="p-3">
              <p class="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Items</p>
              <div class="flex flex-col gap-1">
                <div
                  v-for="i in 20"
                  :key="i"
                  class="px-3 py-2 text-sm rounded hover:bg-bg-hover cursor-pointer"
                  :class="i === 1 ? 'bg-mld-primary/10 text-mld-primary font-medium' : 'text-text-secondary'"
                >
                  Item {{ i }}
                </div>
              </div>
            </div>
          </AppContainer>
          <!-- Right panel: scrollable detail -->
          <AppContainer scrollable>
            <div class="p-6">
              <h2 class="text-lg font-semibold text-text-primary mb-2">Detail Panel</h2>
              <p class="text-sm text-text-secondary mb-4">
                Each panel scrolls independently. Two separate <code>AppContainer</code> cards
                with their own rounded corners, borders, and shadows.
              </p>
              <div class="flex flex-col gap-3">
                <div
                  v-for="i in 12"
                  :key="i"
                  class="p-4 rounded border border-border bg-bg-secondary"
                >
                  <p class="text-sm font-medium text-text-primary">Section {{ i }}</p>
                  <p class="text-xs text-text-muted mt-1">Content fills the available space and scrolls vertically.</p>
                </div>
              </div>
            </div>
          </AppContainer>
        </AppContainer>
      </AppLayout>
    </div>
  </DemoSection>

  <!-- Basic Layout (non-floating) -->
  <DemoSection title="Basic Layout">
    <p class="text-sm text-text-secondary mb-4">
      Without <code>floating</code>, sections sit flush against each other with borders.
      The sidebar auto-sizes to its content by default.
    </p>
    <div class="h-96 border border-border rounded-mld overflow-hidden">
      <AppLayout>
        <template #topbar>
          <AppTopBar variant="default">
            <template #logo>
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-mld-primary rounded flex items-center justify-center">
                  <span class="text-white font-bold text-xs">M</span>
                </div>
                <span class="font-semibold text-text-primary text-sm">My App</span>
              </div>
            </template>
          </AppTopBar>
        </template>

        <template #sidebar>
          <AppSidebar
            :floating="false"
            :panels="sidebarPanels"
            :active-view="activeItemBasic"
          >
            <template #section-overview>
              <p class="text-xs text-text-secondary">Dashboard overview tools</p>
            </template>
            <template #section-recent>
              <p class="text-xs text-text-secondary">Recent activity feed</p>
            </template>
            <template #section-exp-filters>
              <p class="text-xs text-text-secondary">Filter experiments</p>
            </template>
            <template #section-exp-actions>
              <p class="text-xs text-text-secondary">Experiment actions</p>
            </template>
            <template #section-parameters>
              <p class="text-xs text-text-secondary">Analysis parameters</p>
            </template>
            <template #section-display>
              <p class="text-xs text-text-secondary">Display options</p>
            </template>
            <template #section-general>
              <p class="text-xs text-text-secondary">General settings</p>
            </template>
          </AppSidebar>
        </template>

        <div class="p-6">
          <h2 class="text-lg font-semibold text-text-primary mb-2">Main Content</h2>
          <p class="text-sm text-text-secondary">
            Active page: <strong>{{ activeItemBasic }}</strong>
          </p>
        </div>
      </AppLayout>
    </div>
  </DemoSection>
</template>
