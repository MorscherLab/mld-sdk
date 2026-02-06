<script setup lang="ts">
import { ref } from 'vue'
import { AppLayout, AppSidebar, AppTopBar, type SidebarItem } from '@morscherlab/mld-sdk'

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  {
    id: 'experiments',
    label: 'Experiments',
    children: [
      { id: 'exp-list', label: 'All Experiments' },
      { id: 'exp-new', label: 'New Experiment' },
    ],
  },
  { id: 'analysis', label: 'Analysis' },
  { id: 'settings', label: 'Settings' },
]

const activeItem = ref('dashboard')
const collapsed = ref(false)
const sidebarPosition = ref<'left' | 'right'>('left')
const activeItemBasic = ref('dashboard')
const collapsedBasic = ref(false)
</script>

<template>
  <!-- Floating Layout -->
  <DemoSection title="Floating Layout">
    <p class="text-sm text-text-secondary mb-4">
      With <code>floating</code>, the topbar, sidebar, and main content area all render as separate
      cards with rounded corners, shadows, and gaps on the page background.
    </p>
    <div class="h-[480px] border border-border rounded-mld overflow-hidden">
      <AppLayout
        floating
        v-model:sidebar-collapsed="collapsed"
        :sidebar-position="sidebarPosition"
      >
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

        <template #sidebar="{ collapsed: isCollapsed }">
          <AppSidebar
            :floating="false"
            :items="sidebarItems"
            :active-id="activeItem"
            :collapsed="isCollapsed"
            :side="sidebarPosition"
            @select="(item) => activeItem = item.id"
            @update:collapsed="collapsed = $event"
          />
        </template>

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
              class="px-3 py-1 text-xs rounded border border-border hover:bg-bg-hover"
              @click="collapsed = !collapsed"
            >
              {{ collapsed ? 'Expand' : 'Collapse' }} sidebar
            </button>
          </div>
        </div>
      </AppLayout>
    </div>
  </DemoSection>

  <!-- Basic Layout (non-floating) -->
  <DemoSection title="Basic Layout">
    <p class="text-sm text-text-secondary mb-4">
      Without <code>floating</code>, sections sit flush against each other with borders.
    </p>
    <div class="h-96 border border-border rounded-mld overflow-hidden">
      <AppLayout v-model:sidebar-collapsed="collapsedBasic">
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

        <template #sidebar="{ collapsed: isCollapsed }">
          <AppSidebar
            :floating="false"
            :items="sidebarItems"
            :active-id="activeItemBasic"
            :collapsed="isCollapsed"
            @select="(item) => activeItemBasic = item.id"
            @update:collapsed="collapsedBasic = $event"
          />
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
