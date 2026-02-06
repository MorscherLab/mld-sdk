<script setup lang="ts">
import { ref } from 'vue'
import { AppTopBar, ThemeToggle, SettingsButton, BaseButton, type TopBarPage, type TopBarTab, type TopBarTabOption } from '@morscherlab/mld-sdk'

const pages: TopBarPage[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview and analytics' },
  { id: 'experiments', label: 'Experiments', description: 'Manage your experiments' },
  { id: 'analysis', label: 'Analysis', description: 'Run analysis workflows' },
  { id: 'settings', label: 'Settings', description: 'Configure your preferences', disabled: true },
]

const tabs: TopBarTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'data', label: 'Data' },
  {
    id: 'analysis',
    label: 'Analysis',
    children: [
      { id: 'pca', label: 'PCA', description: 'Principal Component Analysis' },
      { id: 'clustering', label: 'Clustering', description: 'Hierarchical clustering' },
      { id: 'statistics', label: 'Statistics', description: 'Statistical tests' },
    ],
  },
  {
    id: 'export',
    label: 'Export',
    children: [
      { id: 'csv', label: 'CSV' },
      { id: 'excel', label: 'Excel' },
      { id: 'pdf', label: 'PDF Report' },
    ],
  },
]

const currentPage = ref('dashboard')
const currentTab = ref('overview')

function handlePageSelect(page: TopBarPage) {
  currentPage.value = page.id
}

function handleTabSelect(tab: TopBarTab) {
  currentTab.value = tab.id
  console.log('Tab selected:', tab.label)
}

function handleTabOptionSelect(option: TopBarTabOption, tab: TopBarTab) {
  currentTab.value = option.id
  console.log('Tab option selected:', option.label, 'from', tab.label)
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">AppTopBar</h1>
    <p class="text-text-secondary mb-8">
      A header component with logo, navigation breadcrumb, and action slots.
    </p>

    <!-- Admin Dashboard Style -->
    <div class="demo-section">
      <h3>Admin Dashboard Style (Title + Subtitle)</h3>
      <p class="text-sm text-text-secondary mb-4">
        Uses <code>title</code> and <code>subtitle</code> props with a custom icon.
      </p>
      <div class="border border-border rounded-mld overflow-hidden">
        <AppTopBar
          variant="default"
          title="Admin Dashboard"
          subtitle="Manage users, plugins, and system configuration"
        >
          <template #icon>
            <div class="w-9 h-9 bg-mld-primary/10 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-mld-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </template>
          <template #actions>
            <SettingsButton size="sm" />
            <ThemeToggle size="sm" />
          </template>
        </AppTopBar>
      </div>
    </div>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic with Title</h3>
      <div class="border border-border rounded-mld overflow-hidden">
        <AppTopBar variant="default" title="Page Title" />
      </div>
    </div>

    <!-- With Plugin Name and Pages Dropdown -->
    <div class="demo-section">
      <h3>With Plugin Name and Pages Dropdown</h3>
      <p class="text-sm text-text-secondary mb-4">Click the plugin name to open the pages dropdown</p>
      <div class="border border-border rounded-mld">
        <AppTopBar
          variant="default"
          plugin-name="Analysis Plugin"
          title="Results"
          :pages="pages"
          :current-page-id="currentPage"
          class="rounded-mld"
          @page-select="handlePageSelect"
        />
      </div>
      <p class="mt-2 text-sm text-text-secondary">Current page: {{ currentPage }}</p>
    </div>

    <!-- With Actions Slot -->
    <div class="demo-section">
      <h3>With Actions Slot</h3>
      <div class="border border-border rounded-mld overflow-hidden">
        <AppTopBar
          variant="default"
          plugin-name="Experiment Designer"
          title="New Experiment"
        >
          <template #actions>
            <BaseButton size="sm" variant="ghost">Cancel</BaseButton>
            <BaseButton size="sm" variant="primary">Save</BaseButton>
          </template>
        </AppTopBar>
      </div>
    </div>

    <!-- With Theme Toggle -->
    <div class="demo-section">
      <h3>With Theme Toggle</h3>
      <div class="border border-border rounded-mld overflow-hidden">
        <AppTopBar variant="default" title="Dashboard">
          <template #actions>
            <ThemeToggle size="sm" />
          </template>
        </AppTopBar>
      </div>
    </div>

    <!-- Custom Logo Slot -->
    <div class="demo-section">
      <h3>Custom Logo Slot</h3>
      <div class="border border-border rounded-mld overflow-hidden">
        <AppTopBar variant="default" title="Custom Logo Example">
          <template #logo>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-mld-cta rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">CL</span>
              </div>
              <span class="font-semibold text-text-primary">Custom</span>
            </div>
          </template>
        </AppTopBar>
      </div>
    </div>

    <!-- Floating Style -->
    <div class="demo-section">
      <h3>Floating Style</h3>
      <p class="text-sm text-text-secondary mb-4">
        When <code>floating</code> is true, the topbar has rounded corners with shadow and uses fixed positioning.
        In this demo, we simulate the styling without fixed positioning.
      </p>
      <div class="bg-bg-primary p-4 rounded-mld">
        <div class="rounded-xl shadow-sm border border-border overflow-hidden">
          <AppTopBar
            variant="default"
            plugin-name="Analytics"
            title="Reports"
          >
            <template #actions>
              <BaseButton size="sm" variant="secondary">Export</BaseButton>
            </template>
          </AppTopBar>
        </div>
      </div>
    </div>

    <!-- With Tabs -->
    <div class="demo-section">
      <h3>With Tabs</h3>
      <p class="text-sm text-text-secondary mb-4">
        Tabs in the center of the topbar. Some tabs have dropdown options.
      </p>
      <div class="border border-border rounded-mld">
        <AppTopBar
          variant="default"
          plugin-name="Experiment"
          title="EXP-001"
          :tabs="tabs"
          :current-tab-id="currentTab"
          class="rounded-mld"
          @tab-select="handleTabSelect"
          @tab-option-select="handleTabOptionSelect"
        >
          <template #actions>
            <ThemeToggle size="sm" />
          </template>
        </AppTopBar>
      </div>
      <p class="mt-2 text-sm text-text-secondary">Current tab: {{ currentTab }}</p>
    </div>

    <!-- Floating with Tabs -->
    <div class="demo-section">
      <h3>Floating with Tabs</h3>
      <p class="text-sm text-text-secondary mb-4">
        Demonstrates floating style with tabs (simulated without fixed positioning).
      </p>
      <div class="bg-bg-primary p-4 rounded-mld">
        <div class="rounded-xl shadow-sm border border-border">
          <AppTopBar
            variant="default"
            plugin-name="Dashboard"
            :tabs="tabs"
            :current-tab-id="currentTab"
            class="rounded-xl"
            @tab-select="handleTabSelect"
            @tab-option-select="handleTabOptionSelect"
          >
            <template #actions>
              <BaseButton size="sm" variant="primary">Save</BaseButton>
            </template>
          </AppTopBar>
        </div>
      </div>
    </div>

    <!-- Without Logo -->
    <div class="demo-section">
      <h3>Without Logo</h3>
      <div class="border border-border rounded-mld overflow-hidden">
        <AppTopBar
          variant="default"
          title="Minimal Header"
          :show-logo="false"
        />
      </div>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Current page title</td>
          </tr>
          <tr>
            <td><code>subtitle</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Subtitle shown below title (only when no breadcrumb)</td>
          </tr>
          <tr>
            <td><code>homePath</code></td>
            <td><code>string</code></td>
            <td><code>'/'</code></td>
            <td>Path for icon/logo link. Set to empty string to disable.</td>
          </tr>
          <tr>
            <td><code>pluginName</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Plugin/app name for breadcrumb</td>
          </tr>
          <tr>
            <td><code>pages</code></td>
            <td><code>TopBarPage[]</code></td>
            <td>-</td>
            <td>Pages for dropdown navigation</td>
          </tr>
          <tr>
            <td><code>currentPageId</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>ID of currently active page</td>
          </tr>
          <tr>
            <td><code>showLogo</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show default logo</td>
          </tr>
          <tr>
            <td><code>sticky</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Make header sticky</td>
          </tr>
          <tr>
            <td><code>floating</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Floating card style (default)</td>
          </tr>
          <tr>
            <td><code>tabs</code></td>
            <td><code>TopBarTab[]</code></td>
            <td>-</td>
            <td>Tabs for center navigation</td>
          </tr>
          <tr>
            <td><code>currentTabId</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>ID of currently active tab</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TopBarPage Type -->
    <div class="demo-section">
      <h3>TopBarPage Type</h3>
      <pre class="code-block">interface TopBarPage {
  id: string
  label: string
  to?: string        // vue-router path
  href?: string      // External link
  icon?: string
  description?: string
  disabled?: boolean
}</pre>
    </div>

    <!-- TopBarTab Type -->
    <div class="demo-section">
      <h3>TopBarTab Type</h3>
      <pre class="code-block">interface TopBarTab {
  id: string
  label: string
  to?: string              // vue-router path
  href?: string            // External link
  icon?: string
  disabled?: boolean
  children?: TopBarTabOption[]  // Dropdown options
}

interface TopBarTabOption {
  id: string
  label: string
  to?: string
  href?: string
  description?: string
  disabled?: boolean
}</pre>
    </div>

    <!-- Events Table -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>page-select</code></td>
            <td><code>TopBarPage</code></td>
            <td>Emitted when a page is selected from dropdown</td>
          </tr>
          <tr>
            <td><code>tab-select</code></td>
            <td><code>TopBarTab</code></td>
            <td>Emitted when a tab without children is clicked</td>
          </tr>
          <tr>
            <td><code>tab-option-select</code></td>
            <td><code>[TopBarTabOption, TopBarTab]</code></td>
            <td>Emitted when a tab dropdown option is selected</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slots Table -->
    <div class="demo-section">
      <h3>Slots</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>icon</code></td>
            <td>Custom icon (takes precedence over logo)</td>
          </tr>
          <tr>
            <td><code>logo</code></td>
            <td>Custom logo area (fallback if no icon)</td>
          </tr>
          <tr>
            <td><code>nav</code></td>
            <td>Additional navigation items</td>
          </tr>
          <tr>
            <td><code>actions</code></td>
            <td>Right-side action buttons</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">const pages: TopBarPage[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview' },
  { id: 'settings', label: 'Settings', description: 'Preferences' },
]

&lt;AppTopBar
  plugin-name="My Plugin"
  title="Dashboard"
  :pages="pages"
  current-page-id="dashboard"
  @page-select="handlePageSelect"
&gt;
  &lt;template #actions&gt;
    &lt;ThemeToggle /&gt;
    &lt;BaseButton size="sm"&gt;Save&lt;/BaseButton&gt;
  &lt;/template&gt;
&lt;/AppTopBar&gt;</pre>
    </div>
  </div>
</template>
