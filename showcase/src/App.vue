<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppTopBar, AppSidebar, ThemeToggle, ToastNotification, BaseInput, type SidebarItem } from '@morscherlab/mld-sdk'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const searchQuery = ref('')

function handleSidebarSelect(item: SidebarItem) {
  if (item.to) router.push(item.to)
}

const sidebarItems: readonly SidebarItem[] = [
  { id: 'overview', label: 'Overview', to: '/' },
  {
    id: 'buttons',
    label: 'Buttons',
    children: [
      { id: 'button', label: 'BaseButton', to: '/button' },
      { id: 'icon-button', label: 'IconButton', to: '/icon-button' },
    ],
  },
  {
    id: 'form-inputs',
    label: 'Form Inputs',
    children: [
      { id: 'input', label: 'BaseInput', to: '/input' },
      { id: 'textarea', label: 'BaseTextarea', to: '/textarea' },
      { id: 'select', label: 'BaseSelect', to: '/select' },
      { id: 'checkbox', label: 'BaseCheckbox', to: '/checkbox' },
      { id: 'toggle', label: 'BaseToggle', to: '/toggle' },
      { id: 'radio', label: 'BaseRadioGroup', to: '/radio' },
      { id: 'slider', label: 'BaseSlider', to: '/slider' },
      { id: 'color-slider', label: 'ColorSlider', to: '/color-slider' },
      { id: 'number-input', label: 'NumberInput', to: '/number-input' },
      { id: 'date-picker', label: 'DatePicker', to: '/date-picker' },
      { id: 'tags-input', label: 'TagsInput', to: '/tags-input' },
      { id: 'file-uploader', label: 'FileUploader', to: '/file-uploader' },
      { id: 'form-field', label: 'FormField', to: '/form-field' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    children: [
      { id: 'alert', label: 'AlertBox', to: '/alert' },
      { id: 'toast', label: 'ToastNotification', to: '/toast' },
      { id: 'skeleton', label: 'Skeleton', to: '/skeleton' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    children: [
      { id: 'tabs', label: 'BaseTabs', to: '/tabs' },
      { id: 'top-bar', label: 'AppTopBar', to: '/top-bar' },
      { id: 'sidebar', label: 'AppSidebar', to: '/sidebar' },
      { id: 'modal', label: 'BaseModal', to: '/modal' },
      { id: 'collapsible-card', label: 'CollapsibleCard', to: '/collapsible-card' },
      { id: 'theme-toggle', label: 'ThemeToggle', to: '/theme-toggle' },
    ],
  },
  {
    id: 'lab-components',
    label: 'Lab Components',
    children: [
      { id: 'well-plate', label: 'WellPlate', to: '/well-plate' },
      { id: 'sample-legend', label: 'SampleLegend', to: '/sample-legend' },
      { id: 'plate-map-editor', label: 'PlateMapEditor', to: '/plate-map-editor' },
      { id: 'experiment-timeline', label: 'ExperimentTimeline', to: '/experiment-timeline' },
    ],
  },
  {
    id: 'sample-management',
    label: 'Sample Management',
    children: [
      { id: 'sample-selector', label: 'SampleSelector', to: '/sample-selector' },
      { id: 'group-assigner', label: 'GroupAssigner', to: '/group-assigner' },
    ],
  },
]

const activeId = computed(() => {
  const name = route.name as string
  return name === 'overview' ? 'overview' : name
})

const filteredSidebarItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return sidebarItems

  return sidebarItems
    .map((item) => {
      // If parent label matches, show parent with all children
      if (item.label.toLowerCase().includes(query)) {
        return item
      }
      // If item has children, filter them
      if (item.children) {
        const matchingChildren = item.children.filter((child) =>
          child.label.toLowerCase().includes(query)
        )
        if (matchingChildren.length > 0) {
          return { ...item, children: matchingChildren }
        }
      }
      return null
    })
    .filter((item): item is SidebarItem => item !== null)
})
</script>

<template>
  <div class="h-screen flex flex-col bg-bg-primary overflow-hidden">
    <!-- Fixed TopBar -->
    <AppTopBar
      plugin-name="MLD SDK"
      title="Component Showcase"
      :show-logo="true"
      variant="default"
      class="flex-shrink-0"
    >
      <template #actions>
        <BaseInput
          v-model="searchQuery"
          placeholder="Search components..."
          size="sm"
          class="w-48"
        />
        <ThemeToggle size="sm" />
      </template>
    </AppTopBar>

    <!-- Content area with sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Fixed Sidebar with internal scroll -->
      <AppSidebar
        :items="filteredSidebarItems"
        :active-id="activeId"
        v-model:collapsed="collapsed"
        :floating="false"
        width="220px"
        class="flex-shrink-0"
        @select="handleSidebarSelect"
      />

      <!-- Scrollable main content -->
      <main class="flex-1 overflow-y-auto p-8">
        <router-view />
      </main>
    </div>

    <!-- Toast container -->
    <ToastNotification />
  </div>
</template>
