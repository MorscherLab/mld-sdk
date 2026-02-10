<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { TopBarPage, TopBarTab, TopBarTabOption, TopBarSettingsConfig, TopBarVariant } from '../types/components'
import ThemeToggle from './ThemeToggle.vue'
import SettingsModal from './SettingsModal.vue'
import { usePlatformContext } from '../composables/usePlatformContext'

interface Props {
  title?: string
  subtitle?: string
  showLogo?: boolean
  variant?: TopBarVariant
  pluginName?: string
  pages?: TopBarPage[]
  currentPageId?: string
  tabs?: TopBarTab[]
  currentTabId?: string
  homePath?: string
  showThemeToggle?: boolean
  showSettings?: boolean
  settingsConfig?: TopBarSettingsConfig
  showStandaloneLabel?: boolean
  standaloneLabel?: string
  showAdmin?: boolean
  adminPath?: string
  showProfile?: boolean
  userName?: string
  userInitial?: string
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  variant: 'card',
  homePath: '/',
  showThemeToggle: false,
  showSettings: false,
  showStandaloneLabel: true,
  standaloneLabel: 'Standalone',
  showAdmin: false,
  adminPath: '/admin',
  showProfile: false,
})

const settingsOpen = ref(false)
const { isIntegrated } = usePlatformContext()
const isStandalone = computed(() => !isIntegrated.value)

const profileInitial = computed(() => {
  if (props.userInitial) return props.userInitial
  if (props.userName) return props.userName.charAt(0).toUpperCase()
  return 'U'
})

const emit = defineEmits<{
  'page-select': [page: TopBarPage]
  'tab-select': [tab: TopBarTab]
  'tab-option-select': [option: TopBarTabOption, tab: TopBarTab]
  'profile-click': []
  'admin-click': []
}>()

const showPagesDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const openTabDropdown = ref<string | null>(null)
const tabDropdownRefs = ref<Map<string, HTMLElement>>(new Map())

function togglePagesDropdown() {
  showPagesDropdown.value = !showPagesDropdown.value
  openTabDropdown.value = null
}

function handlePageClick(page: TopBarPage) {
  if (page.disabled) return
  emit('page-select', page)
  showPagesDropdown.value = false
}

function toggleTabDropdown(tabId: string) {
  showPagesDropdown.value = false
  openTabDropdown.value = openTabDropdown.value === tabId ? null : tabId
}

function handleTabClick(tab: TopBarTab) {
  if (tab.disabled) return
  if (tab.children?.length) {
    toggleTabDropdown(tab.id)
  } else {
    emit('tab-select', tab)
    openTabDropdown.value = null
  }
}

function handleTabOptionClick(option: TopBarTabOption, tab: TopBarTab) {
  if (option.disabled) return
  emit('tab-option-select', option, tab)
  openTabDropdown.value = null
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

  if (showPagesDropdown.value && dropdownRef.value && !dropdownRef.value.contains(target)) {
    showPagesDropdown.value = false
  }

  if (openTabDropdown.value !== null) {
    const clickedInside = Array.from(tabDropdownRefs.value.values()).some((el) => el.contains(target))
    if (!clickedInside) {
      openTabDropdown.value = null
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
      `mld-topbar--${props.variant}`,
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
                @click="showPagesDropdown = false"
              >
                <span class="mld-topbar-dropdown-item__label">{{ page.label }}</span>
                <span v-if="page.description" class="mld-topbar-dropdown-item__description">{{ page.description }}</span>
              </a>
              <router-link
                v-else-if="page.to"
                :to="page.to"
                :class="['mld-topbar-dropdown-item', { 'mld-topbar-dropdown-item--active': page.id === currentPageId, 'mld-topbar-dropdown-item--disabled': page.disabled }]"
                @click="showPagesDropdown = false"
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
                  @click="openTabDropdown = null"
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
                  @click="openTabDropdown = null"
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
        <span v-if="showStandaloneLabel && isStandalone" class="mld-topbar__standalone-badge">
          {{ standaloneLabel }}
        </span>
        <!-- Actions slot (right side) -->
        <slot name="actions" />
        <!-- Theme toggle -->
        <ThemeToggle v-if="showThemeToggle" size="sm" />
        <!-- Settings gear -->
        <button
          v-if="showSettings"
          type="button"
          class="mld-topbar__settings-btn"
          aria-label="Open settings"
          @click="settingsOpen = true"
        >
          <svg class="mld-topbar__settings-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <!-- Admin link -->
        <router-link
          v-if="showAdmin"
          :to="adminPath"
          class="mld-topbar__admin-btn"
          aria-label="Admin Dashboard"
          @click="emit('admin-click')"
        >
          <svg class="mld-topbar__admin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </router-link>
        <!-- Profile button -->
        <button
          v-if="showProfile"
          type="button"
          class="mld-topbar__profile-btn"
          aria-label="Edit profile"
          @click="emit('profile-click')"
        >
          <div class="mld-topbar__profile-avatar">
            {{ profileInitial }}
          </div>
          <span v-if="userName" class="mld-topbar__profile-name">{{ userName }}</span>
        </button>
      </div>
    </div>
  </header>

  <SettingsModal
    v-if="showSettings"
    v-model="settingsOpen"
    :title="settingsConfig?.title"
    :tabs="settingsConfig?.tabs"
    :show-appearance="settingsConfig?.showAppearance ?? true"
    :size="settingsConfig?.size"
  >
    <template v-for="tab in (settingsConfig?.tabs ?? [])" :key="tab.id" #[`tab-${tab.id}`]>
      <slot :name="`settings-tab-${tab.id}`" />
    </template>
    <template #appearance>
      <slot name="settings-appearance" />
    </template>
  </SettingsModal>
</template>

<style>
@import '../styles/components/app-top-bar.css';
</style>
