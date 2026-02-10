<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from './AppLayout.vue'
import AppTopBar from './AppTopBar.vue'
import AppSidebar from './AppSidebar.vue'
import type { SidebarItem } from '../types'

const sidebarCollapsed = ref(false)

const navItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'D' },
  { id: 'experiments', label: 'Experiments', icon: 'E' },
  { id: 'analysis', label: 'Analysis', icon: 'A' },
  { id: 'settings', label: 'Settings', icon: 'S' },
]

const activeId = ref('dashboard')

function handleSelect(item: SidebarItem) {
  activeId.value = item.id
}
</script>

<template>
  <Story title="Layout/AppLayout">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="height: 600px;">
          <AppLayout
            v-model:sidebar-collapsed="sidebarCollapsed"
            :sidebar-position="state.sidebarPosition"
            :floating="state.floating"
            :sidebar-width="state.sidebarWidth"
          >
            <template #topbar>
              <AppTopBar
                title="My Plugin"
                subtitle="Laboratory Analysis"
                :show-theme-toggle="true"
                home-path=""
              />
            </template>
            <template #sidebar="{ collapsed, toggle }">
              <AppSidebar
                :items="navItems"
                :active-id="activeId"
                :collapsed="collapsed"
                :floating="false"
                @update:collapsed="toggle"
                @select="handleSelect"
              />
            </template>
            <div style="padding: 2rem;">
              <h2 style="margin: 0 0 1rem; color: var(--text-primary, #1e293b);">{{ activeId.charAt(0).toUpperCase() + activeId.slice(1) }}</h2>
              <p style="color: var(--text-muted, #94a3b8);">
                This is the main content area. The sidebar is {{ sidebarCollapsed ? 'collapsed' : 'expanded' }}.
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

    <Variant title="Full Layout Demo">
      <div style="height: 600px;">
        <AppLayout
          v-model:sidebar-collapsed="sidebarCollapsed"
          :floating="true"
        >
          <template #topbar>
            <AppTopBar
              plugin-name="Plate Analyzer"
              title="Dashboard"
              :show-theme-toggle="true"
              home-path=""
            />
          </template>
          <template #sidebar="{ collapsed, toggle }">
            <AppSidebar
              :items="navItems"
              :active-id="activeId"
              :collapsed="collapsed"
              :floating="false"
              @update:collapsed="toggle"
              @select="handleSelect"
            />
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
          v-model:sidebar-collapsed="sidebarCollapsed"
          sidebar-position="right"
        >
          <template #topbar>
            <AppTopBar title="Right Sidebar Layout" home-path="" />
          </template>
          <template #sidebar="{ collapsed, toggle }">
            <AppSidebar
              :items="navItems"
              :active-id="activeId"
              :collapsed="collapsed"
              :floating="false"
              side="right"
              @update:collapsed="toggle"
              @select="handleSelect"
            />
          </template>
          <div style="padding: 2rem;">
            <p style="color: var(--text-muted, #94a3b8);">Main content with sidebar on the right side.</p>
          </div>
        </AppLayout>
      </div>
    </Variant>
  </Story>
</template>
