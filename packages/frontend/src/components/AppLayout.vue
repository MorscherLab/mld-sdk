<script setup lang="ts">
/**
 * AppLayout - Page layout shell with topbar, sidebar, and main content slots
 *
 * Provides a responsive application layout structure with optional topbar and sidebar.
 * The sidebar slot is a simple pass-through; visibility is controlled by AppSidebar itself.
 *
 * @example
 * ```vue
 * <AppLayout sidebar-position="right" floating>
 *   <template #topbar>
 *     <AppTopBar title="My App" />
 *   </template>
 *   <template #sidebar>
 *     <AppSidebar :panels="toolPanels" :active-view="activeTab">
 *       <template #section-params>...</template>
 *     </AppSidebar>
 *   </template>
 *   <main-content />
 * </AppLayout>
 * ```
 */
import { computed } from 'vue'

interface Props {
  /** Position of sidebar (left or right side of screen) */
  sidebarPosition?: 'left' | 'right'
  /** Width of sidebar (use 'auto' to fit content) */
  sidebarWidth?: string
  /** When true, topbar/sidebar/main render as floating cards with gaps */
  floating?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sidebarPosition: 'left',
  sidebarWidth: 'auto',
  floating: false,
})

const layoutClasses = computed(() => [
  'mld-layout',
  props.sidebarPosition === 'right' ? 'mld-layout--sidebar-right' : '',
  props.floating ? 'mld-layout--floating' : '',
])

const sidebarStyle = computed(() => {
  return props.sidebarWidth !== 'auto' ? { width: props.sidebarWidth } : undefined
})
</script>

<template>
  <div :class="layoutClasses">
    <div v-if="$slots.topbar" class="mld-layout__topbar">
      <slot name="topbar" />
    </div>

    <div class="mld-layout__body">
      <div
        v-if="$slots.sidebar"
        class="mld-layout__sidebar"
        :style="sidebarStyle"
      >
        <slot name="sidebar" />
      </div>

      <main class="mld-layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
@import '../styles/components/app-layout.css';
</style>
