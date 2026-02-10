<script setup lang="ts">
/**
 * AppSidebar - Context-sensitive toolkit panel
 *
 * Shows tool sections relevant to the active view. Sections are defined
 * via the `panels` config (mapping view IDs to section arrays) and rendered
 * as CollapsibleCards. Actual controls are provided through named slots:
 * `#section-{sectionId}`.
 *
 * When the active view has no matching panels, the sidebar hides entirely.
 *
 * @example
 * ```vue
 * <AppSidebar :panels="toolPanels" :active-view="activeTab">
 *   <template #section-parameters>
 *     <BaseSlider v-model="threshold" label="Threshold" />
 *   </template>
 *   <template #section-display>
 *     <BaseToggle v-model="showOutliers" label="Show outliers" />
 *   </template>
 *   <template #header>Plugin Tools</template>
 * </AppSidebar>
 * ```
 */
import { computed } from 'vue'
import type { SidebarToolSection } from '../types'
import CollapsibleCard from './CollapsibleCard.vue'

interface Props {
  /** Map of view IDs to their tool sections */
  panels?: Record<string, SidebarToolSection[]>
  /** Which view's panels to display */
  activeView?: string
  /** Floating variant with absolute positioning */
  floating?: boolean
  /** Width when visible */
  width?: string
  /** Position sidebar on left or right side */
  side?: 'left' | 'right'
  /** Toggle state map: sectionId → boolean */
  toggleState?: Record<string, boolean>
}

const props = withDefaults(defineProps<Props>(), {
  panels: () => ({}),
  activeView: '',
  floating: true,
  width: '280px',
  side: 'left',
  toggleState: () => ({}),
})

defineEmits<{
  'update:toggle': [sectionId: string, value: boolean]
}>()

const activeSections = computed<SidebarToolSection[]>(() => {
  if (!props.activeView || !props.panels[props.activeView]) return []
  return props.panels[props.activeView]
})

const isVisible = computed(() => activeSections.value.length > 0)

const sidebarClasses = computed(() => [
  'mld-sidebar',
  `mld-sidebar--${props.side}`,
  props.floating ? 'mld-sidebar--floating' : 'mld-sidebar--static',
  !isVisible.value ? 'mld-sidebar--hidden' : '',
])

const sidebarStyle = computed(() => ({
  width: props.width,
}))
</script>

<template>
  <aside
    :class="sidebarClasses"
    :style="sidebarStyle"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="mld-sidebar__header">
      <slot name="header" />
    </div>

    <!-- Tool sections -->
    <div class="mld-sidebar__sections">
      <CollapsibleCard
        v-for="section in activeSections"
        :key="section.id"
        :title="section.label"
        :subtitle="section.subtitle"
        :icon="section.icon"
        :icon-color="section.iconColor"
        :icon-bg="section.iconBg"
        :default-open="section.defaultOpen !== false"
        :show-toggle="section.showToggle"
        :toggle-value="toggleState[section.id] ?? false"
        @update:toggle-value="$emit('update:toggle', section.id, $event)"
      >
        <slot :name="`section-${section.id}`" />
      </CollapsibleCard>
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="mld-sidebar__footer">
      <slot name="footer" />
    </div>
  </aside>
</template>

<style>
@import '../styles/components/app-sidebar.css';
</style>
