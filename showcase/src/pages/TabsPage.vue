<script setup lang="ts">
import { ref } from 'vue'
import { BaseTabs, type TabItem } from '@morscherlab/mld-sdk'

const basicTabs: TabItem[] = [
  { id: 'tab1', label: 'Overview' },
  { id: 'tab2', label: 'Settings' },
  { id: 'tab3', label: 'Analytics' },
]

const tabsWithBadges: TabItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12 },
  { id: 'sent', label: 'Sent', badge: 0 },
  { id: 'drafts', label: 'Drafts', badge: 3 },
  { id: 'spam', label: 'Spam', badge: '99+' },
]

const tabsWithDisabled: TabItem[] = [
  { id: 'active1', label: 'Active Tab' },
  { id: 'disabled1', label: 'Disabled Tab', disabled: true },
  { id: 'active2', label: 'Another Active' },
]

const tabsWithIcons: TabItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'user', label: 'Profile', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'help', label: 'Help', icon: '❓' },
]

const underlineTab = ref('tab1')
const pillsTab = ref('inbox')
const borderedTab = ref('home')
const disabledTab = ref('active1')
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseTabs</h1>
    <p class="text-text-secondary mb-8">
      A tab navigation component with multiple variants and support for badges and icons.
    </p>

    <!-- Underline Variant -->
    <div class="demo-section">
      <h3>Underline Variant (Default)</h3>
      <BaseTabs v-model="underlineTab" :tabs="basicTabs" variant="underline" />
      <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
        <p class="text-sm text-text-secondary">Selected: <strong>{{ underlineTab }}</strong></p>
      </div>
    </div>

    <!-- Pills Variant -->
    <div class="demo-section">
      <h3>Pills Variant with Badges</h3>
      <BaseTabs v-model="pillsTab" :tabs="tabsWithBadges" variant="pills" />
      <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
        <p class="text-sm text-text-secondary">Selected: <strong>{{ pillsTab }}</strong></p>
      </div>
    </div>

    <!-- Bordered Variant -->
    <div class="demo-section">
      <h3>Bordered Variant with Icons</h3>
      <BaseTabs v-model="borderedTab" :tabs="tabsWithIcons" variant="bordered" />
      <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
        <p class="text-sm text-text-secondary">Selected: <strong>{{ borderedTab }}</strong></p>
      </div>
    </div>

    <!-- Disabled Tabs -->
    <div class="demo-section">
      <h3>With Disabled Tabs</h3>
      <BaseTabs v-model="disabledTab" :tabs="tabsWithDisabled" variant="underline" />
      <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
        <p class="text-sm text-text-secondary">Selected: <strong>{{ disabledTab }}</strong></p>
      </div>
    </div>

    <!-- Variant Comparison -->
    <div class="demo-section">
      <h3>Variant Comparison</h3>
      <div class="space-y-6">
        <div>
          <p class="text-sm text-text-muted mb-2">Underline</p>
          <BaseTabs model-value="tab1" :tabs="basicTabs" variant="underline" />
        </div>
        <div>
          <p class="text-sm text-text-muted mb-2">Pills</p>
          <BaseTabs model-value="tab1" :tabs="basicTabs" variant="pills" />
        </div>
        <div>
          <p class="text-sm text-text-muted mb-2">Bordered</p>
          <BaseTabs model-value="tab1" :tabs="basicTabs" variant="bordered" />
        </div>
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
            <td><code>modelValue</code></td>
            <td><code>string</code></td>
            <td>Required</td>
            <td>Active tab ID (v-model)</td>
          </tr>
          <tr>
            <td><code>tabs</code></td>
            <td><code>TabItem[]</code></td>
            <td>Required</td>
            <td>Array of tab definitions</td>
          </tr>
          <tr>
            <td><code>variant</code></td>
            <td><code>'underline' | 'pills' | 'bordered'</code></td>
            <td><code>'underline'</code></td>
            <td>Tab style variant</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TabItem Type -->
    <div class="demo-section">
      <h3>TabItem Type</h3>
      <pre class="code-block">interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  badge?: string | number
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
            <td><code>update:modelValue</code></td>
            <td><code>string</code></td>
            <td>Emitted when a tab is selected</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">const tabs: TabItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12 },
  { id: 'sent', label: 'Sent' },
  { id: 'drafts', label: 'Drafts', badge: 3 },
]

const activeTab = ref('inbox')

&lt;BaseTabs
  v-model="activeTab"
  :tabs="tabs"
  variant="pills"
/&gt;

&lt;div v-if="activeTab === 'inbox'"&gt;
  Inbox content...
&lt;/div&gt;</pre>
    </div>
  </div>
</template>
