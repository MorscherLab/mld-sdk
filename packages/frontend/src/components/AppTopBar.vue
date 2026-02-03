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
@import '../styles/components/app-top-bar.css';
</style>
