<script setup lang="ts">
import { ref } from 'vue'
import { AppSidebar, type SidebarItem } from '@morscherlab/mld-sdk'

const basicItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'settings', label: 'Settings' },
]

const itemsWithBadges: SidebarItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12 },
  { id: 'notifications', label: 'Notifications', badge: 3 },
  { id: 'tasks', label: 'Tasks', badge: '5+' },
  { id: 'archive', label: 'Archive' },
]

const nestedItems: SidebarItem[] = [
  { id: 'home', label: 'Home' },
  {
    id: 'experiments',
    label: 'Experiments',
    children: [
      { id: 'exp-list', label: 'All Experiments' },
      { id: 'exp-new', label: 'New Experiment' },
      { id: 'exp-templates', label: 'Templates' },
    ],
  },
  {
    id: 'analysis',
    label: 'Analysis',
    children: [
      { id: 'analysis-results', label: 'Results' },
      { id: 'analysis-reports', label: 'Reports' },
    ],
  },
  { id: 'settings', label: 'Settings' },
]

const itemsWithDisabled: SidebarItem[] = [
  { id: 'active1', label: 'Active Item' },
  { id: 'disabled', label: 'Disabled Item', disabled: true },
  { id: 'active2', label: 'Another Active' },
]

const activeBasic = ref('dashboard')
const activeBadges = ref('inbox')
const activeNested = ref('home')
const activeFloating = ref('dashboard')
const collapsedDemo = ref(false)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">AppSidebar</h1>
    <p class="text-text-secondary mb-8">
      A sidebar navigation component with support for nested items, badges, and collapsible state.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="h-64 border border-border rounded-mld overflow-hidden">
        <AppSidebar
          :floating="false"
          :items="basicItems"
          :active-id="activeBasic"
          @select="(item) => activeBasic = item.id"
        />
      </div>
      <p class="mt-2 text-sm text-text-secondary">Active: {{ activeBasic }}</p>
    </div>

    <!-- Floating Style -->
    <div class="demo-section">
      <h3>Floating Style</h3>
      <p class="text-sm text-text-secondary mb-4">
        When <code>floating</code> is true, the sidebar has rounded corners with shadow and uses fixed positioning.
        In this demo, we show the styling without fixed positioning.
      </p>
      <div class="h-72 border border-border rounded-mld overflow-hidden bg-bg-primary p-4">
        <div class="h-full rounded-xl shadow-sm border border-border overflow-hidden">
          <AppSidebar
            :floating="false"
            :items="basicItems"
            :active-id="activeFloating"
            @select="(item) => activeFloating = item.id"
          />
        </div>
      </div>
    </div>

    <!-- With Badges -->
    <div class="demo-section">
      <h3>With Badges</h3>
      <div class="h-64 border border-border rounded-mld overflow-hidden">
        <AppSidebar
          :floating="false"
          :items="itemsWithBadges"
          :active-id="activeBadges"
          @select="(item) => activeBadges = item.id"
        />
      </div>
    </div>

    <!-- Nested Items -->
    <div class="demo-section">
      <h3>Nested Items</h3>
      <div class="h-80 border border-border rounded-mld overflow-hidden">
        <AppSidebar
          :floating="false"
          :items="nestedItems"
          :active-id="activeNested"
          @select="(item) => activeNested = item.id"
        />
      </div>
      <p class="mt-2 text-sm text-text-secondary">Active: {{ activeNested }}</p>
    </div>

    <!-- Collapsible -->
    <div class="demo-section">
      <h3>Collapsible Sidebar</h3>
      <p class="text-sm text-text-secondary mb-4">Click the collapse button at the bottom</p>
      <div class="h-64 border border-border rounded-mld overflow-hidden flex">
        <AppSidebar
          :floating="false"
          v-model:collapsed="collapsedDemo"
          :items="basicItems"
          active-id="dashboard"
        />
        <div class="flex-1 p-4 bg-bg-primary">
          <p class="text-sm text-text-secondary">
            Sidebar is {{ collapsedDemo ? 'collapsed' : 'expanded' }}
          </p>
        </div>
      </div>
    </div>

    <!-- With Header and Footer Slots -->
    <div class="demo-section">
      <h3>With Header and Footer Slots</h3>
      <div class="h-80 border border-border rounded-mld overflow-hidden">
        <AppSidebar
          :floating="false"
          :items="basicItems"
          active-id="dashboard"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-mld-primary rounded-mld flex items-center justify-center">
                <span class="text-white font-bold text-sm">M</span>
              </div>
              <span class="font-semibold text-text-primary">My App</span>
            </div>
          </template>
          <template #footer>
            <div class="flex items-center gap-2 text-sm text-text-secondary">
              <div class="w-6 h-6 bg-mld-cta/20 rounded-full flex items-center justify-center">
                <span class="text-mld-cta text-xs">JD</span>
              </div>
              <span>John Doe</span>
            </div>
          </template>
        </AppSidebar>
      </div>
    </div>

    <!-- Disabled Items -->
    <div class="demo-section">
      <h3>With Disabled Items</h3>
      <div class="h-48 border border-border rounded-mld overflow-hidden">
        <AppSidebar
          :floating="false"
          :items="itemsWithDisabled"
          active-id="active1"
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
            <td><code>items</code></td>
            <td><code>SidebarItem[]</code></td>
            <td>Required</td>
            <td>Navigation items</td>
          </tr>
          <tr>
            <td><code>activeId</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Currently active item ID</td>
          </tr>
          <tr>
            <td><code>collapsed</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Collapse sidebar (v-model)</td>
          </tr>
          <tr>
            <td><code>floating</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Floating style with fixed position, rounded corners and shadow (default)</td>
          </tr>
          <tr>
            <td><code>width</code></td>
            <td><code>string</code></td>
            <td><code>'240px'</code></td>
            <td>Expanded width</td>
          </tr>
          <tr>
            <td><code>collapsedWidth</code></td>
            <td><code>string</code></td>
            <td><code>'64px'</code></td>
            <td>Collapsed width</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SidebarItem Type -->
    <div class="demo-section">
      <h3>SidebarItem Type</h3>
      <pre class="code-block">interface SidebarItem {
  id: string
  label: string
  icon?: string
  to?: string          // vue-router path
  href?: string        // External link
  children?: SidebarItem[]
  badge?: string | number
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
            <td><code>select</code></td>
            <td><code>SidebarItem</code></td>
            <td>Emitted when an item is clicked</td>
          </tr>
          <tr>
            <td><code>update:collapsed</code></td>
            <td><code>boolean</code></td>
            <td>Emitted when collapse state changes</td>
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
            <td><code>header</code></td>
            <td>Header content above navigation</td>
          </tr>
          <tr>
            <td><code>footer</code></td>
            <td>Footer content above collapse toggle</td>
          </tr>
          <tr>
            <td><code>icon-{id}</code></td>
            <td>Custom icon for specific item</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">const items: SidebarItem[] = [
  { id: 'home', label: 'Home', to: '/' },
  {
    id: 'experiments',
    label: 'Experiments',
    children: [
      { id: 'exp-list', label: 'All', to: '/experiments' },
      { id: 'exp-new', label: 'New', to: '/experiments/new' },
    ],
  },
  { id: 'settings', label: 'Settings', badge: 3 },
]

&lt;AppSidebar
  floating
  :items="items"
  :active-id="activeItem"
  v-model:collapsed="isCollapsed"
  @select="handleSelect"
&gt;
  &lt;template #header&gt;
    &lt;Logo /&gt;
  &lt;/template&gt;
  &lt;template #footer&gt;
    &lt;UserProfile /&gt;
  &lt;/template&gt;
&lt;/AppSidebar&gt;</pre>
    </div>
  </div>
</template>
