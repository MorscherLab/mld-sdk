<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TopBarPage, TopBarTab, TopBarTabOption } from '../types/components'

type TopBarVariant = 'floating' | 'card' | 'sticky' | 'default'

interface Props {
  title?: string
  subtitle?: string
  showLogo?: boolean
  variant?: TopBarVariant
  /** @deprecated Use variant="floating" instead */
  floating?: boolean
  /** @deprecated Use variant="sticky" instead */
  sticky?: boolean
  pluginName?: string
  pages?: TopBarPage[]
  currentPageId?: string
  tabs?: TopBarTab[]
  currentTabId?: string
  homePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  variant: 'card',
  homePath: '/',
})

const effectiveVariant = computed<TopBarVariant>(() => {
  if (props.variant) return props.variant
  if (props.floating) return 'floating'
  if (props.sticky) return 'sticky'
  return 'default'
})

const emit = defineEmits<{
  'page-select': [page: TopBarPage]
  'tab-select': [tab: TopBarTab]
  'tab-option-select': [option: TopBarTabOption, tab: TopBarTab]
}>()

const showPagesDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const openTabDropdown = ref<string | null>(null)
const tabDropdownRefs = ref<Map<string, HTMLElement>>(new Map())

function togglePagesDropdown() {
  showPagesDropdown.value = !showPagesDropdown.value
  openTabDropdown.value = null
}

function closeDropdown() {
  showPagesDropdown.value = false
}

function handlePageClick(page: TopBarPage) {
  if (page.disabled) return
  emit('page-select', page)
  closeDropdown()
}

function toggleTabDropdown(tabId: string) {
  showPagesDropdown.value = false
  openTabDropdown.value = openTabDropdown.value === tabId ? null : tabId
}

function closeTabDropdown() {
  openTabDropdown.value = null
}

function handleTabClick(tab: TopBarTab) {
  if (tab.disabled) return
  if (tab.children?.length) {
    toggleTabDropdown(tab.id)
  } else {
    emit('tab-select', tab)
    closeTabDropdown()
  }
}

function handleTabOptionClick(option: TopBarTabOption, tab: TopBarTab) {
  if (option.disabled) return
  emit('tab-option-select', option, tab)
  closeTabDropdown()
}

function setTabDropdownRef(el: HTMLElement | null, tabId: string) {
  if (el) {
    tabDropdownRefs.value.set(tabId, el)
  } else {
    tabDropdownRefs.value.delete(tabId)
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  // Only close pages dropdown if it's actually open and click is outside
  if (showPagesDropdown.value && dropdownRef.value && !dropdownRef.value.contains(target)) {
    closeDropdown()
  }
  // Only close tab dropdowns if one is actually open and click is outside
  if (openTabDropdown.value !== null) {
    let clickedInsideTabDropdown = false
    tabDropdownRefs.value.forEach((el) => {
      if (el.contains(target)) {
        clickedInsideTabDropdown = true
      }
    })
    if (!clickedInsideTabDropdown) {
      closeTabDropdown()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    :class="[
      'mld-topbar',
      `mld-topbar--${effectiveVariant}`,
    ]"
  >
    <div class="mld-topbar__container">
      <!-- Left section: Icon/Logo + Title/Subtitle or Breadcrumb -->
      <div class="mld-topbar__left">
        <!-- Icon/Logo with external home link (absolute URL) -->
        <a v-if="homePath && homePath.startsWith('http')" :href="homePath" class="mld-topbar-home-link">
          <slot name="icon">
            <slot name="logo">
              <div v-if="showLogo" class="mld-topbar__logo">
                <div class="mld-topbar__logo-icon">
                  <span class="mld-topbar__logo-text">M</span>
                </div>
              </div>
            </slot>
          </slot>
        </a>
        <!-- Icon/Logo with platform home link (absolute path goes to parent app) -->
        <a v-else-if="homePath && homePath.startsWith('/')" :href="homePath" class="mld-topbar-home-link">
          <slot name="icon">
            <slot name="logo">
              <div v-if="showLogo" class="mld-topbar__logo">
                <div class="mld-topbar__logo-icon">
                  <span class="mld-topbar__logo-text">M</span>
                </div>
              </div>
            </slot>
          </slot>
        </a>
        <!-- Icon/Logo with router link (relative path within app) -->
        <router-link v-else-if="homePath" :to="homePath" class="mld-topbar-home-link">
          <slot name="icon">
            <slot name="logo">
              <div v-if="showLogo" class="mld-topbar__logo">
                <div class="mld-topbar__logo-icon">
                  <span class="mld-topbar__logo-text">M</span>
                </div>
              </div>
            </slot>
          </slot>
        </router-link>
        <!-- Icon/Logo without link (homePath is empty) -->
        <template v-else>
          <slot name="icon">
            <slot name="logo">
              <div v-if="showLogo" class="mld-topbar__logo">
                <div class="mld-topbar__logo-icon">
                  <span class="mld-topbar__logo-text">M</span>
                </div>
              </div>
            </slot>
          </slot>
        </template>

        <!-- Title with subtitle (no breadcrumb) -->
        <div v-if="title && subtitle && !pluginName && !pages?.length" class="mld-topbar-title-group">
          <span class="mld-topbar-title">{{ title }}</span>
          <span class="mld-topbar-subtitle">{{ subtitle }}</span>
        </div>

        <!-- Breadcrumb: Plugin Name > Current Page -->
        <div v-else-if="pluginName || pages?.length" ref="dropdownRef" class="mld-topbar-breadcrumb">
          <!-- Plugin name with dropdown trigger -->
          <button
            v-if="pages?.length"
            type="button"
            class="mld-topbar-plugin-name"
            @click.stop="togglePagesDropdown"
          >
            {{ pluginName }}
            <svg
              class="mld-topbar-chevron"
              :class="{ 'mld-topbar-chevron--open': showPagesDropdown }"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <span v-else class="mld-topbar-plugin-name--static">{{ pluginName }}</span>

          <!-- Separator -->
          <svg
            v-if="title"
            class="mld-topbar-separator"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>

          <!-- Current page title -->
          <span v-if="title" class="mld-topbar-current-page">{{ title }}</span>

          <!-- Pages dropdown -->
          <div v-show="showPagesDropdown" class="mld-topbar-dropdown">
            <template v-for="page in pages" :key="page.id">
              <a
                v-if="page.href"
                :href="page.href"
                :class="['mld-topbar-dropdown-item', { 'mld-topbar-dropdown-item--active': page.id === currentPageId, 'mld-topbar-dropdown-item--disabled': page.disabled }]"
                @click="closeDropdown"
              >
                <span class="mld-topbar-dropdown-item__label">{{ page.label }}</span>
                <span v-if="page.description" class="mld-topbar-dropdown-item__description">{{ page.description }}</span>
              </a>
              <router-link
                v-else-if="page.to"
                :to="page.to"
                :class="['mld-topbar-dropdown-item', { 'mld-topbar-dropdown-item--active': page.id === currentPageId, 'mld-topbar-dropdown-item--disabled': page.disabled }]"
                @click="closeDropdown"
              >
                <span class="mld-topbar-dropdown-item__label">{{ page.label }}</span>
                <span v-if="page.description" class="mld-topbar-dropdown-item__description">{{ page.description }}</span>
              </router-link>
              <button
                v-else
                type="button"
                :class="['mld-topbar-dropdown-item', { 'mld-topbar-dropdown-item--active': page.id === currentPageId, 'mld-topbar-dropdown-item--disabled': page.disabled }]"
                @click="handlePageClick(page)"
              >
                <span class="mld-topbar-dropdown-item__label">{{ page.label }}</span>
                <span v-if="page.description" class="mld-topbar-dropdown-item__description">{{ page.description }}</span>
              </button>
            </template>
          </div>
        </div>

        <!-- Title only (backward compat when no pluginName and no subtitle) -->
        <span v-else-if="title" class="mld-topbar__title-only">{{ title }}</span>

        <!-- Navigation slot -->
        <slot name="nav" />
      </div>

      <!-- Center section: Tabs -->
      <div v-if="tabs?.length" class="mld-topbar__tabs">
        <template v-for="tab in tabs" :key="tab.id">
          <div
            :ref="(el) => tab.children?.length ? setTabDropdownRef(el as HTMLElement, tab.id) : null"
            class="mld-topbar-tab-wrapper"
          >
            <!-- Tab with children (dropdown) -->
            <button
              v-if="tab.children?.length"
              type="button"
              :class="[
                'mld-topbar-tab',
                { 'mld-topbar-tab--active': tab.id === currentTabId || tab.children.some(c => c.id === currentTabId) },
                { 'mld-topbar-tab--disabled': tab.disabled }
              ]"
              @click.stop="handleTabClick(tab)"
            >
              {{ tab.label }}
              <svg
                class="mld-topbar-tab-chevron"
                :class="{ 'mld-topbar-tab-chevron--open': openTabDropdown === tab.id }"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <!-- Simple tab (no children) -->
            <a
              v-else-if="tab.href"
              :href="tab.href"
              :class="[
                'mld-topbar-tab',
                { 'mld-topbar-tab--active': tab.id === currentTabId },
                { 'mld-topbar-tab--disabled': tab.disabled }
              ]"
            >
              {{ tab.label }}
            </a>
            <router-link
              v-else-if="tab.to"
              :to="tab.to"
              :class="[
                'mld-topbar-tab',
                { 'mld-topbar-tab--active': tab.id === currentTabId },
                { 'mld-topbar-tab--disabled': tab.disabled }
              ]"
            >
              {{ tab.label }}
            </router-link>
            <button
              v-else
              type="button"
              :class="[
                'mld-topbar-tab',
                { 'mld-topbar-tab--active': tab.id === currentTabId },
                { 'mld-topbar-tab--disabled': tab.disabled }
              ]"
              @click="handleTabClick(tab)"
            >
              {{ tab.label }}
            </button>

            <!-- Tab dropdown -->
            <div v-if="tab.children?.length" v-show="openTabDropdown === tab.id" class="mld-topbar-tab-dropdown">
              <template v-for="option in tab.children" :key="option.id">
                <a
                  v-if="option.href"
                  :href="option.href"
                  :class="[
                    'mld-topbar-dropdown-item',
                    { 'mld-topbar-dropdown-item--active': option.id === currentTabId },
                    { 'mld-topbar-dropdown-item--disabled': option.disabled }
                  ]"
                  @click="closeTabDropdown"
                >
                  <span class="mld-topbar-dropdown-item__label">{{ option.label }}</span>
                  <span v-if="option.description" class="mld-topbar-dropdown-item__description">{{ option.description }}</span>
                </a>
                <router-link
                  v-else-if="option.to"
                  :to="option.to"
                  :class="[
                    'mld-topbar-dropdown-item',
                    { 'mld-topbar-dropdown-item--active': option.id === currentTabId },
                    { 'mld-topbar-dropdown-item--disabled': option.disabled }
                  ]"
                  @click="closeTabDropdown"
                >
                  <span class="mld-topbar-dropdown-item__label">{{ option.label }}</span>
                  <span v-if="option.description" class="mld-topbar-dropdown-item__description">{{ option.description }}</span>
                </router-link>
                <button
                  v-else
                  type="button"
                  :class="[
                    'mld-topbar-dropdown-item',
                    { 'mld-topbar-dropdown-item--active': option.id === currentTabId },
                    { 'mld-topbar-dropdown-item--disabled': option.disabled }
                  ]"
                  @click="handleTabOptionClick(option, tab)"
                >
                  <span class="mld-topbar-dropdown-item__label">{{ option.label }}</span>
                  <span v-if="option.description" class="mld-topbar-dropdown-item__description">{{ option.description }}</span>
                </button>
              </template>
            </div>
          </div>
        </template>
      </div>

      <!-- Right section: Actions -->
      <div class="mld-topbar__right">
        <!-- Actions slot (right side) -->
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style>
/* AppTopBar - BEM-style naming for external package compatibility */

/* Base topbar styles */
.mld-topbar {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary, var(--mld-bg-card, #ffffff));
  box-sizing: border-box;
}

/* Main container layout */
.mld-topbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mld-topbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mld-topbar__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mld-topbar__tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Logo styles */
.mld-topbar__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mld-topbar__logo-icon {
  width: 2rem;
  height: 2rem;
  background-color: var(--color-primary, #3B82F6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mld-topbar__logo-text {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.mld-topbar__title-only {
  font-weight: 600;
  color: var(--text-primary, #1E293B);
}

/* Variant: floating - fixed position with offset from edges */
.mld-topbar--floating {
  position: fixed;
  top: 1rem;
  right: 1rem;
  left: 1rem;
  width: auto;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color, var(--mld-border, #e5e7eb));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  z-index: 50;
}

/* Variant: card - inline card with margins and rounded corners */
.mld-topbar--card {
  width: calc(100% - 2rem);
  margin: 1rem 1rem 0 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color, var(--mld-border, #e5e7eb));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  flex-shrink: 0;
}

/* Variant: sticky - full-width sticky header */
.mld-topbar--sticky {
  position: sticky;
  top: 0;
  border-bottom: 1px solid var(--border-color, var(--mld-border, #e5e7eb));
  z-index: 40;
}

/* Variant: default - basic inline header */
.mld-topbar--default {
  border-bottom: 1px solid var(--border-color, var(--mld-border, #e5e7eb));
}

.mld-topbar-home-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.mld-topbar-home-link:hover {
  opacity: 0.8;
}

.mld-topbar-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.mld-topbar-title {
  font-weight: 600;
  color: var(--mld-text-primary, #111827);
  font-size: 0.9375rem;
  line-height: 1.25;
}

.mld-topbar-subtitle {
  font-size: 0.75rem;
  color: var(--mld-text-secondary, #6b7280);
  line-height: 1.25;
}

.mld-topbar-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.mld-topbar-plugin-name {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  border-radius: var(--mld-radius-sm, 0.25rem);
  color: var(--mld-text-secondary, #6b7280);
  font-weight: 500;
  font-size: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mld-topbar-plugin-name:hover {
  background: var(--mld-bg-hover, rgba(0, 0, 0, 0.05));
  color: var(--mld-text-primary, #111827);
}

.mld-topbar-plugin-name--static {
  padding: 0.25rem 0.5rem;
  color: var(--mld-text-secondary, #6b7280);
  font-weight: 500;
}

.mld-topbar-chevron {
  transition: transform 0.15s ease;
}

.mld-topbar-chevron--open {
  transform: rotate(180deg);
}

.mld-topbar-separator {
  width: 1rem;
  height: 1rem;
  color: var(--mld-text-muted, #9ca3af);
  flex-shrink: 0;
}

.mld-topbar-current-page {
  font-weight: 600;
  color: var(--mld-text-primary, #111827);
}

.mld-topbar-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 200px;
  background: var(--mld-bg-card, #ffffff);
  border: 1px solid var(--mld-border, #e5e7eb);
  border-radius: var(--mld-radius, 0.5rem);
  box-shadow: var(--mld-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
  z-index: 50;
  overflow: hidden;
}

.mld-topbar-dropdown-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  font: inherit;
  text-align: left;
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.mld-topbar-dropdown-item:hover:not(.mld-topbar-dropdown-item--disabled) {
  background: var(--mld-bg-hover, rgba(0, 0, 0, 0.05));
}

.mld-topbar-dropdown-item--active {
  background: var(--mld-info-bg, rgba(59, 130, 246, 0.1));
  color: var(--mld-info, #3b82f6);
}

.mld-topbar-dropdown-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mld-topbar-dropdown-item__label {
  font-weight: 500;
}

.mld-topbar-dropdown-item__description {
  font-size: 0.75rem;
  color: var(--mld-text-muted, #9ca3af);
  margin-top: 0.125rem;
}

.mld-topbar-dropdown-item--active .mld-topbar-dropdown-item__description {
  color: var(--mld-info, #3b82f6);
  opacity: 0.8;
}

/* Tabs in center of topbar - kept for backwards compat */
.mld-topbar-tabs,
.mld-topbar__tabs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.mld-topbar-tab-wrapper {
  position: relative;
}

.mld-topbar-tab {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: var(--mld-radius-sm, 0.25rem);
  color: var(--mld-text-secondary, #6b7280);
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mld-topbar-tab:hover:not(.mld-topbar-tab--disabled) {
  background: var(--mld-bg-hover, rgba(0, 0, 0, 0.05));
  color: var(--mld-text-primary, #111827);
}

.mld-topbar-tab--active {
  background: var(--mld-primary-bg, rgba(99, 102, 241, 0.1));
  color: var(--mld-primary, #6366f1);
}

.mld-topbar-tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mld-topbar-tab-chevron {
  transition: transform 0.15s ease;
}

.mld-topbar-tab-chevron--open {
  transform: rotate(180deg);
}

.mld-topbar-tab-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  background: var(--mld-bg-card, #ffffff);
  border: 1px solid var(--mld-border, #e5e7eb);
  border-radius: var(--mld-radius, 0.5rem);
  box-shadow: var(--mld-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
  z-index: 50;
  overflow: hidden;
}
</style>
