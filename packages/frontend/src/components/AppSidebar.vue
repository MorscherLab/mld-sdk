<script setup lang="ts">
/**
 * AppSidebar - Navigation sidebar with collapsible sections
 *
 * Two-mode component:
 * 1. Items mode: Pass `items` array for automatic nav rendering with CollapsibleCard sections
 * 2. Slot mode: Use default slot for custom content when no items provided
 *
 * Items with children render as CollapsibleCard sections (respects `defaultOpen` prop).
 * When collapsed, parent items show icon-only; children are hidden.
 * Supports v-model:collapsed for two-way binding of collapse state.
 *
 * @example
 * ```vue
 * <!-- Items mode -->
 * <AppSidebar
 *   :items="navItems"
 *   :active-id="activeRoute"
 *   v-model:collapsed="collapsed"
 *   @select="handleNavigation"
 * />
 *
 * <!-- Slot mode -->
 * <AppSidebar v-model:collapsed="collapsed">
 *   <custom-navigation />
 * </AppSidebar>
 *
 * <!-- With page-specific settings panel -->
 * <AppSidebar :items="navItems" :active-id="currentPage" @select="handleNav">
 *   <template #panel="{ activeId }">
 *     <div v-if="activeId === 'dashboard'">
 *       <BaseSelect label="Time range" :options="timeRanges" />
 *     </div>
 *   </template>
 * </AppSidebar>
 * ```
 */
import { computed } from 'vue'
import type { SidebarItem } from '../types'
import CollapsibleCard from './CollapsibleCard.vue'

interface Props {
  /** Navigation items (if provided, renders nav automatically; otherwise use default slot) */
  items?: readonly SidebarItem[]
  /** ID of currently active item (applies active styling) */
  activeId?: string
  /** Whether sidebar is collapsed (use v-model:collapsed for two-way binding) */
  collapsed?: boolean
  /** Floating variant with absolute positioning */
  floating?: boolean
  /** Width when expanded */
  width?: string
  /** Width when collapsed (icon-only mode) */
  collapsedWidth?: string
  /** Position sidebar on left or right side */
  side?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  collapsed: false,
  floating: true,
  width: '240px',
  collapsedWidth: '64px',
  side: 'left',
})

const emit = defineEmits<{
  /** Emitted when a navigation item is clicked */
  select: [item: SidebarItem]
  /** Emitted when collapse state should change (for v-model:collapsed) */
  'update:collapsed': [collapsed: boolean]
}>()

const sidebarWidth = computed(() => props.collapsed ? props.collapsedWidth : props.width)
const hasItems = computed(() => props.items.length > 0)

const sidebarClasses = computed(() => [
  'mld-sidebar',
  `mld-sidebar--${props.side}`,
  props.floating ? 'mld-sidebar--floating' : 'mld-sidebar--static',
])

const sidebarStyle = computed(() => ({
  width: sidebarWidth.value,
}))

/** Prevent default navigation for vue-router items; consumer handles routing via @select event */
function handleItemClick(item: SidebarItem, event?: Event) {
  if (item.disabled) return
  if (item.to && event) {
    event.preventDefault()
  }
  emit('select', item)
}

function getItemClasses(item: SidebarItem) {
  const classes = ['mld-sidebar__item']
  if (item.disabled) classes.push('mld-sidebar__item--disabled')
  else if (item.id === props.activeId) classes.push('mld-sidebar__item--active')
  return classes
}
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

    <!-- Navigation items (when items provided) -->
    <nav v-if="hasItems" class="mld-sidebar__nav">
      <template v-for="item in props.items" :key="item.id">
        <!-- Item with children: collapsible section -->
        <div v-if="item.children?.length">
          <!-- Collapsed: icon only -->
          <div v-if="props.collapsed" class="mld-sidebar__section-icon">
            <span class="mld-sidebar__icon">
              <slot :name="`icon-${item.id}`" :item="item">
                {{ item.icon }}
              </slot>
            </span>
          </div>
          <!-- Expanded: CollapsibleCard section -->
          <div v-else class="mld-sidebar__section">
            <CollapsibleCard
              :title="item.label"
              :default-open="item.defaultOpen !== false"
            >
              <div class="mld-sidebar__section-children">
                <component
                  v-for="child in item.children"
                  :key="child.id"
                  :is="child.href ? 'a' : 'button'"
                  :href="child.href"
                  :type="child.href ? undefined : 'button'"
                  :class="getItemClasses(child)"
                  @click="handleItemClick(child, $event)"
                >
                  <span v-if="child.icon" class="mld-sidebar__icon">
                    <slot :name="`icon-${child.id}`" :item="child">
                      {{ child.icon }}
                    </slot>
                  </span>
                  <span class="mld-sidebar__item-label">{{ child.label }}</span>
                  <span v-if="child.badge !== undefined" class="mld-sidebar__badge">
                    {{ child.badge }}
                  </span>
                </component>
              </div>
            </CollapsibleCard>
          </div>
        </div>

        <component
          v-else
          :is="item.href ? 'a' : 'button'"
          :href="item.href"
          :type="item.href ? undefined : 'button'"
          :class="getItemClasses(item)"
          @click="handleItemClick(item, $event)"
        >
          <span v-if="item.icon" class="mld-sidebar__icon">
            <slot :name="`icon-${item.id}`" :item="item">
              {{ item.icon }}
            </slot>
          </span>
          <span v-if="!props.collapsed" class="mld-sidebar__item-label">{{ item.label }}</span>
          <span v-if="!props.collapsed && item.badge !== undefined" class="mld-sidebar__badge">
            {{ item.badge }}
          </span>
        </component>
      </template>
    </nav>

    <!-- Content slot (when no nav items provided) -->
    <div v-else-if="$slots.default" class="mld-sidebar__content">
      <slot />
    </div>

    <!-- Page-specific settings panel (scoped with activeId) -->
    <div v-if="$slots.panel && !props.collapsed" class="mld-sidebar__panel">
      <slot name="panel" :active-id="props.activeId" />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="mld-sidebar__footer">
      <slot name="footer" />
    </div>

    <!-- Collapse toggle (only with nav items) -->
    <button
      v-if="hasItems"
      type="button"
      class="mld-sidebar__collapse-btn"
      :aria-label="props.collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="emit('update:collapsed', !props.collapsed)"
    >
      <svg
        :class="{ 'mld-sidebar__collapse-icon': true, 'mld-sidebar__collapse-icon--collapsed': props.collapsed }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<style>
@import '../styles/components/app-sidebar.css';
</style>
