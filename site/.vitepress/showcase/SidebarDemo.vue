<script setup lang="ts">
import { ref } from 'vue'
import { AppSidebar, type SidebarItem } from '@morscherlab/mld-sdk'

const basicItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'settings', label: 'Settings' },
]

const itemsWithBadges: SidebarItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12 },
  { id: 'notifications', label: 'Notifications', badge: 3 },
  { id: 'tasks', label: 'Tasks', badge: '5+' },
  { id: 'archive', label: 'Archive' },
]

const nestedItems: SidebarItem[] = [
  { id: 'home', label: 'Home' },
  {
    id: 'experiments',
    label: 'Experiments',
    children: [
      { id: 'exp-list', label: 'All Experiments' },
      { id: 'exp-new', label: 'New Experiment' },
      { id: 'exp-templates', label: 'Templates' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis',
    children: [
      { id: 'analysis-results', label: 'Results' },
      { id: 'analysis-reports', label: 'Reports' },
    ],
  },
  { id: 'settings', label: 'Settings' },
]

const collapsibleItems: SidebarItem[] = [
  { id: 'home', label: 'Home' },
  {
    id: 'experiments',
    label: 'Experiments',
    defaultOpen: true,
    children: [
      { id: 'exp-list', label: 'All Experiments' },
      { id: 'exp-new', label: 'New Experiment' },
      { id: 'exp-templates', label: 'Templates' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis',
    defaultOpen: false,
    children: [
      { id: 'analysis-results', label: 'Results' },
      { id: 'analysis-reports', label: 'Reports' },
    ],
  },
  { id: 'settings', label: 'Settings' },
]

const itemsWithDisabled: SidebarItem[] = [
  { id: 'active1', label: 'Active Item' },
  { id: 'disabled', label: 'Disabled Item', disabled: true },
  { id: 'active2', label: 'Another Active' },
]

const activeBasic = ref('dashboard')
const activeBadges = ref('inbox')
const activeNested = ref('home')
const activeCollapsible = ref('home')
const activeFloating = ref('dashboard')
const collapsedDemo = ref(false)
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="h-64 border border-border rounded-mld overflow-hidden">
      <AppSidebar
        :floating="false"
        :items="basicItems"
        :active-id="activeBasic"
        @select="(item) => activeBasic = item.id"
      />
    </div>
    <p class="mt-2 text-sm text-text-secondary">Active: {{ activeBasic }}</p>
  </DemoSection>

  <!-- Floating Style -->
  <DemoSection title="Floating Style">
    <p class="text-sm text-text-secondary mb-4">
      When <code>floating</code> is true, the sidebar has rounded corners with shadow and uses fixed positioning.
      In this demo, we show the styling without fixed positioning.
    </p>
    <div class="h-72 border border-border rounded-mld overflow-hidden bg-bg-primary p-4">
      <div class="h-full rounded-xl shadow-sm border border-border overflow-hidden">
        <AppSidebar
          :floating="false"
          :items="basicItems"
          :active-id="activeFloating"
          @select="(item) => activeFloating = item.id"
        />
      </div>
    </div>
  </DemoSection>

  <!-- With Badges -->
  <DemoSection title="With Badges">
    <div class="h-64 border border-border rounded-mld overflow-hidden">
      <AppSidebar
        :floating="false"
        :items="itemsWithBadges"
        :active-id="activeBadges"
        @select="(item) => activeBadges = item.id"
      />
    </div>
  </DemoSection>

  <!-- Collapsible Sections -->
  <DemoSection title="Collapsible Sections">
    <p class="text-sm text-text-secondary mb-4">
      Parent items with children render as collapsible sections using <code>CollapsibleCard</code>.
      Use <code>defaultOpen</code> to control initial state (defaults to open).
    </p>
    <div class="h-96 border border-border rounded-mld overflow-hidden">
      <AppSidebar
        :floating="false"
        :items="collapsibleItems"
        :active-id="activeCollapsible"
        @select="(item) => activeCollapsible = item.id"
      />
    </div>
    <p class="mt-2 text-sm text-text-secondary">Active: {{ activeCollapsible }}</p>
  </DemoSection>

  <!-- Nested Items (legacy name kept for continuity) -->
  <DemoSection title="Nested Items">
    <div class="h-80 border border-border rounded-mld overflow-hidden">
      <AppSidebar
        :floating="false"
        :items="nestedItems"
        :active-id="activeNested"
        @select="(item) => activeNested = item.id"
      />
    </div>
    <p class="mt-2 text-sm text-text-secondary">Active: {{ activeNested }}</p>
  </DemoSection>

  <!-- Collapsible -->
  <DemoSection title="Collapsible Sidebar">
    <p class="text-sm text-text-secondary mb-4">Click the collapse button at the bottom</p>
    <div class="h-64 border border-border rounded-mld overflow-hidden flex">
      <AppSidebar
        :floating="false"
        v-model:collapsed="collapsedDemo"
        :items="basicItems"
        active-id="dashboard"
      />
      <div class="flex-1 p-4 bg-bg-primary">
        <p class="text-sm text-text-secondary">
          Sidebar is {{ collapsedDemo ? 'collapsed' : 'expanded' }}
        </p>
      </div>
    </div>
  </DemoSection>

  <!-- With Header and Footer Slots -->
  <DemoSection title="With Header and Footer Slots">
    <div class="h-80 border border-border rounded-mld overflow-hidden">
      <AppSidebar
        :floating="false"
        :items="basicItems"
        active-id="dashboard"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-mld-primary rounded-mld flex items-center justify-center">
              <span class="text-white font-bold text-sm">M</span>
            </div>
            <span class="font-semibold text-text-primary">My App</span>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center gap-2 text-sm text-text-secondary">
            <div class="w-6 h-6 bg-mld-cta/20 rounded-full flex items-center justify-center">
              <span class="text-mld-cta text-xs">JD</span>
            </div>
            <span>John Doe</span>
          </div>
        </template>
      </AppSidebar>
    </div>
  </DemoSection>

  <!-- Disabled Items -->
  <DemoSection title="With Disabled Items">
    <div class="h-48 border border-border rounded-mld overflow-hidden">
      <AppSidebar
        :floating="false"
        :items="itemsWithDisabled"
        active-id="active1"
      />
    </div>
  </DemoSection>
</template>
