<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { SidebarItem } from '../types'

const router = useRouter()

interface Props {
  items: readonly SidebarItem[]
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

function handleItemClick(item: SidebarItem, event?: MouseEvent) {
  if (item.disabled) return

  if (item.to) {
    // For internal routes, use router.push
    if (event && item.href) {
      // If there's also an href (shouldn't happen but just in case), prevent default
      event.preventDefault()
    }
    router.push(item.to)
  } else if (item.href) {
    // Let default behavior handle external links
  }

  emit('select', item)
}

function isActive(item: SidebarItem): boolean {
  return item.id === props.activeId
}

function getItemClasses(item: SidebarItem, isParent = false) {
  if (isParent) {
    // Parent items with children are category headers - not clickable links
    return [
      'flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider',
      'text-text-muted select-none',
    ]
  }
  return [
    'flex items-center gap-3 px-3 py-2 rounded-mld text-sm transition-colors duration-mld',
    'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mld-primary',
    'w-full text-left', // For button elements to match anchor styling
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
      ...(props.floating && props.topOffset ? { top: props.topOffset } : {}),
    }"
    :class="[
      'mld-sidebar flex flex-col transition-[width] duration-200',
      props.floating
        ? `mld-sidebar--floating fixed left-4 bottom-4 rounded-xl shadow-sm z-40 ${props.topOffset ? '' : 'top-4'}`
        : 'h-full border-r border-border',
    ]"
  >
    <!-- Header slot -->
    <div v-if="$slots.header" class="px-3 py-4 border-b border-border">
      <slot name="header" />
    </div>

    <!-- Navigation items -->
    <nav class="flex-1 overflow-y-auto p-3 space-y-4">
      <template v-for="item in props.items" :key="item.id">
        <!-- Item with children: render as category header -->
        <div v-if="item.children?.length" class="space-y-1">
          <!-- Category header (not clickable) -->
          <div
            v-if="!props.collapsed"
            :class="getItemClasses(item, true)"
          >
            <span v-if="item.icon" class="flex-shrink-0 w-4 h-4">
              <slot :name="`icon-${item.id}`" :item="item">
                {{ item.icon }}
              </slot>
            </span>
            <span class="truncate">{{ item.label }}</span>
          </div>

          <!-- Children -->
          <div v-if="!props.collapsed" class="space-y-0.5">
            <template v-for="child in item.children" :key="child.id">
              <a
                v-if="child.href"
                :href="child.href"
                :class="getItemClasses(child)"
                @click="(e: MouseEvent) => handleItemClick(child, e)"
              >
                <span class="flex-1 truncate">{{ child.label }}</span>
              </a>
              <button
                v-else
                type="button"
                :class="getItemClasses(child)"
                @click="(e: MouseEvent) => handleItemClick(child, e)"
              >
                <span class="flex-1 truncate">{{ child.label }}</span>
              </button>
            </template>
          </div>
        </div>

        <!-- Item without children: render as clickable link -->
        <a
          v-else-if="item.href"
          :href="item.href"
          :class="getItemClasses(item)"
          @click="(e: MouseEvent) => handleItemClick(item, e)"
        >
          <!-- Icon slot or default icon -->
          <span v-if="item.icon" class="flex-shrink-0 w-5 h-5">
            <slot :name="`icon-${item.id}`" :item="item">
              {{ item.icon }}
            </slot>
          </span>

          <!-- Label (hidden when collapsed) -->
          <span
            v-if="!props.collapsed"
            class="flex-1 truncate"
          >
            {{ item.label }}
          </span>

          <!-- Badge -->
          <span
            v-if="!props.collapsed && item.badge !== undefined"
            class="ml-auto px-1.5 py-0.5 text-xs rounded-full bg-mld-primary/10 text-mld-primary"
          >
            {{ item.badge }}
          </span>
        </a>
        <button
          v-else
          type="button"
          :class="getItemClasses(item)"
          @click="(e: MouseEvent) => handleItemClick(item, e)"
        >
          <!-- Icon slot or default icon -->
          <span v-if="item.icon" class="flex-shrink-0 w-5 h-5">
            <slot :name="`icon-${item.id}`" :item="item">
              {{ item.icon }}
            </slot>
          </span>

          <!-- Label (hidden when collapsed) -->
          <span
            v-if="!props.collapsed"
            class="flex-1 truncate"
          >
            {{ item.label }}
          </span>

          <!-- Badge -->
          <span
            v-if="!props.collapsed && item.badge !== undefined"
            class="ml-auto px-1.5 py-0.5 text-xs rounded-full bg-mld-primary/10 text-mld-primary"
          >
            {{ item.badge }}
          </span>
        </button>
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
      :aria-label="props.collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="emit('update:collapsed', !props.collapsed)"
    >
      <svg
        :class="['w-5 h-5 mx-auto transition-transform', props.collapsed ? 'rotate-180' : '']"
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
