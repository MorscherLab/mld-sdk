<script setup lang="ts">
/**
 * AppLayout - Page layout shell with topbar, sidebar, and main content slots
 *
 * Provides a responsive application layout structure with optional topbar and sidebar.
 * Supports v-model:sidebarCollapsed for two-way binding of sidebar collapse state.
 *
 * @example
 * ```vue
 * <AppLayout v-model:sidebar-collapsed="collapsed" floating>
 *   <template #topbar>
 *     <AppTopBar title="My App" />
 *   </template>
 *   <template #sidebar="{ collapsed, toggle }">
 *     <AppSidebar :collapsed="collapsed" @update:collapsed="toggle" />
 *   </template>
 *   <main-content />
 * </AppLayout>
 * ```
 */
import { computed } from 'vue'

interface Props {
  /** Position of sidebar (left or right side of screen) */
  sidebarPosition?: 'left' | 'right'
  /** Width of expanded sidebar (use 'auto' to fit content) */
  sidebarWidth?: string
  /** Width of collapsed sidebar (use 'auto' to fit content) */
  sidebarCollapsedWidth?: string
  /** Whether sidebar is collapsed (use v-model:sidebarCollapsed for two-way binding) */
  sidebarCollapsed?: boolean
  /** When true, topbar/sidebar/main render as floating cards with gaps */
  floating?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sidebarPosition: 'left',
  sidebarWidth: 'auto',
  sidebarCollapsedWidth: 'auto',
  sidebarCollapsed: false,
  floating: false,
})

const emit = defineEmits<{
  /** Emitted when sidebar collapse state should change (for v-model:sidebarCollapsed) */
  'update:sidebarCollapsed': [collapsed: boolean]
}>()

const layoutClasses = computed(() => [
  'mld-layout',
  props.sidebarPosition === 'right' ? 'mld-layout--sidebar-right' : '',
  props.floating ? 'mld-layout--floating' : '',
])

const sidebarStyle = computed(() => {
  const width = props.sidebarCollapsed ? props.sidebarCollapsedWidth : props.sidebarWidth
  return width !== 'auto' ? { width } : undefined
})

function toggleSidebar() {
  emit('update:sidebarCollapsed', !props.sidebarCollapsed)
}
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
        <slot
          name="sidebar"
          :collapsed="props.sidebarCollapsed"
          :toggle="toggleSidebar"
        />
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
