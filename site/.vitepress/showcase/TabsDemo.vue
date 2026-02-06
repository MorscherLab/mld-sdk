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
  <!-- Underline Variant -->
  <DemoSection title="Underline Variant (Default)">
    <BaseTabs v-model="underlineTab" :tabs="basicTabs" variant="underline" />
    <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
      <p class="text-sm text-text-secondary">Selected: <strong>{{ underlineTab }}</strong></p>
    </div>
  </DemoSection>

  <!-- Pills Variant -->
  <DemoSection title="Pills Variant with Badges">
    <BaseTabs v-model="pillsTab" :tabs="tabsWithBadges" variant="pills" />
    <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
      <p class="text-sm text-text-secondary">Selected: <strong>{{ pillsTab }}</strong></p>
    </div>
  </DemoSection>

  <!-- Bordered Variant -->
  <DemoSection title="Bordered Variant with Icons">
    <BaseTabs v-model="borderedTab" :tabs="tabsWithIcons" variant="bordered" />
    <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
      <p class="text-sm text-text-secondary">Selected: <strong>{{ borderedTab }}</strong></p>
    </div>
  </DemoSection>

  <!-- Disabled Tabs -->
  <DemoSection title="With Disabled Tabs">
    <BaseTabs v-model="disabledTab" :tabs="tabsWithDisabled" variant="underline" />
    <div class="mt-4 p-4 bg-bg-secondary rounded-mld">
      <p class="text-sm text-text-secondary">Selected: <strong>{{ disabledTab }}</strong></p>
    </div>
  </DemoSection>

  <!-- Variant Comparison -->
  <DemoSection title="Variant Comparison">
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
  </DemoSection>
</template>
