<script setup lang="ts">
import { computed } from 'vue'
import type { SidebarItem } from '../types'

interface Props {
  items: SidebarItem[]
  activeId?: string
  collapsed?: boolean
  floating?: boolean
  width?: string
  collapsedWidth?: string
  /** Top offset when floating, useful when used with a floating AppTopBar (e.g., '88px') */
  topOffset?: string
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  floating: true,
  width: '240px',
  collapsedWidth: '64px',
})

const emit = defineEmits<{
  select: [item: SidebarItem]
  'update:collapsed': [collapsed: boolean]
}>()

const sidebarWidth = computed(() => props.collapsed ? props.collapsedWidth : props.width)

function handleItemClick(item: SidebarItem) {
  if (!item.disabled) {
    emit('select', item)
  }
}

function isActive(item: SidebarItem): boolean {
  return item.id === props.activeId
}

function getItemClasses(item: SidebarItem) {
  return [
    'flex items-center gap-3 px-3 py-2 rounded-mld text-sm transition-colors duration-mld',
    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mld-primary',
    item.disabled
      ? 'text-text-muted cursor-not-allowed'
      : isActive(item)
        ? 'bg-mld-primary/10 text-mld-primary font-medium'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover cursor-pointer',
  ]
}
</script>

<template>
  <aside
    :style="{
      width: sidebarWidth,
      ...(floating && topOffset ? { top: topOffset } : {}),
    }"
    :class="[
      'mld-sidebar flex flex-col transition-[width] duration-200 overflow-hidden',
      floating
        ? `mld-sidebar--floating fixed left-4 bottom-4 rounded-xl shadow-sm z-40 ${topOffset ? '' : 'top-4'}`
        : 'h-screen sticky top-0',
    ]"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="px-3 py-4 border-b border-border">
      <slot name="header" />
    </div>

    <!-- Navigation items -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-1">
      <template v-for="item in items" :key="item.id">
        <component
          :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
          :to="item.to"
          :href="item.href"
          :class="getItemClasses(item)"
          :disabled="item.disabled"
          @click="handleItemClick(item)"
        >
          <!-- Icon slot or default icon -->
          <span v-if="item.icon" class="flex-shrink-0 w-5 h-5">
            <slot :name="`icon-${item.id}`" :item="item">
              {{ item.icon }}
            </slot>
          </span>

          <!-- Label (hidden when collapsed) -->
          <span
            v-if="!collapsed"
            class="flex-1 truncate"
          >
            {{ item.label }}
          </span>

          <!-- Badge -->
          <span
            v-if="!collapsed && item.badge !== undefined"
            class="ml-auto px-1.5 py-0.5 text-xs rounded-full bg-mld-primary/10 text-mld-primary"
          >
            {{ item.badge }}
          </span>
        </component>

        <!-- Children (only shown when not collapsed) -->
        <div
          v-if="!collapsed && item.children?.length"
          class="ml-6 mt-1 space-y-1"
        >
          <component
            :is="child.to ? 'router-link' : child.href ? 'a' : 'button'"
            v-for="child in item.children"
            :key="child.id"
            :to="child.to"
            :href="child.href"
            :class="getItemClasses(child)"
            :disabled="child.disabled"
            @click="handleItemClick(child)"
          >
            <span class="flex-1 truncate text-sm">{{ child.label }}</span>
          </component>
        </div>
      </template>
    </nav>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="px-3 py-4 border-t border-border">
      <slot name="footer" />
    </div>

    <!-- Collapse toggle -->
    <button
      type="button"
      class="p-3 border-t border-border text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="emit('update:collapsed', !collapsed)"
    >
      <svg
        :class="['w-5 h-5 mx-auto transition-transform', collapsed ? 'rotate-180' : '']"
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
