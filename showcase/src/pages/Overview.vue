<script setup lang="ts">
import { BaseButton, AlertBox } from '@morscherlab/mld-sdk'

const components = [
  {
    category: 'Form Components',
    items: [
      { name: 'BaseButton', description: '6 variants, 3 sizes, loading/disabled states', to: '/button' },
      { name: 'BaseInput', description: '7 input types, 3 sizes, error/disabled states', to: '/input' },
      { name: 'BaseSelect', description: 'Dropdown select with descriptions, 3 sizes', to: '/select' },
      { name: 'FormField', description: 'Wrapper with label, error, hint, required', to: '/form-field' },
    ],
  },
  {
    category: 'Feedback Components',
    items: [
      { name: 'AlertBox', description: '4 types: success, error, warning, info', to: '/alert' },
      { name: 'ToastNotification', description: 'Toast notifications via useToast()', to: '/toast' },
    ],
  },
  {
    category: 'Navigation Components',
    items: [
      { name: 'BaseTabs', description: '3 variants: underline, pills, bordered', to: '/tabs' },
      { name: 'AppTopBar', description: 'Header with logo, pages dropdown, actions', to: '/top-bar' },
      { name: 'AppSidebar', description: 'Sidebar with nested items, collapse', to: '/sidebar' },
    ],
  },
  {
    category: 'Interactive Components',
    items: [
      { name: 'BaseModal', description: '5 sizes, customizable close behavior', to: '/modal' },
      { name: 'IconButton', description: 'Icon-only button, 6 variants, 3 sizes', to: '/icon-button' },
      { name: 'ThemeToggle', description: 'Light/dark mode toggle button', to: '/theme-toggle' },
      { name: 'CollapsibleCard', description: 'Expandable card with header', to: '/collapsible-card' },
    ],
  },
]
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">MLD SDK Component Showcase</h1>
    <p class="text-text-secondary mb-8">
      A comprehensive showcase of all components available in the @morscherlab/mld-sdk package.
    </p>

    <AlertBox type="info" title="Getting Started" class="mb-8">
      <p class="mb-2">Install the SDK in your Vue 3 project:</p>
      <code class="block bg-bg-hover px-3 py-2 rounded-mld text-sm font-mono">
        npm install @morscherlab/mld-sdk
      </code>
      <p class="mt-3 mb-2">Import styles and components:</p>
      <code class="block bg-bg-hover px-3 py-2 rounded-mld text-sm font-mono whitespace-pre">import '@morscherlab/mld-sdk/styles'
import { BaseButton, useToast } from '@morscherlab/mld-sdk'</code>
    </AlertBox>

    <div class="space-y-8">
      <div v-for="category in components" :key="category.category">
        <h2 class="text-xl font-semibold text-text-primary mb-4">{{ category.category }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            v-for="item in category.items"
            :key="item.name"
            :to="item.to"
            class="demo-section hover:border-mld-primary transition-colors cursor-pointer !mb-0"
          >
            <h3 class="font-semibold text-text-primary mb-1">{{ item.name }}</h3>
            <p class="text-sm text-text-secondary">{{ item.description }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-border">
      <h2 class="text-xl font-semibold text-text-primary mb-4">Composables</h2>
      <div class="demo-section">
        <ul class="space-y-2 text-sm">
          <li><code class="text-mld-primary">useApi()</code> - HTTP client with error handling</li>
          <li><code class="text-mld-primary">useAuth()</code> - Authentication state and actions</li>
          <li><code class="text-mld-primary">usePasskey()</code> - WebAuthn/FIDO2 support</li>
          <li><code class="text-mld-primary">useTheme()</code> - Theme mode management</li>
          <li><code class="text-mld-primary">useToast()</code> - Toast notification system</li>
          <li><code class="text-mld-primary">usePlatformContext()</code> - Platform integration for plugins</li>
        </ul>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-semibold text-text-primary mb-4">Stores</h2>
      <div class="demo-section">
        <ul class="space-y-2 text-sm">
          <li><code class="text-mld-primary">useAuthStore()</code> - Pinia store for auth state</li>
          <li><code class="text-mld-primary">useSettingsStore()</code> - Pinia store for app settings</li>
        </ul>
      </div>
    </div>
  </div>
</template>
