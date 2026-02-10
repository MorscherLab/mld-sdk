<script setup lang="ts">
import { ref } from 'vue'
import BaseTabs from './BaseTabs.vue'
import type { TabItem } from '../types'

const activeTab = ref('overview')

const basicTabs: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'samples', label: 'Samples' },
  { id: 'results', label: 'Results' },
  { id: 'settings', label: 'Settings' },
]

const tabsWithBadges: TabItem[] = [
  { id: 'inbox', label: 'Inbox', badge: 12 },
  { id: 'drafts', label: 'Drafts', badge: 3 },
  { id: 'sent', label: 'Sent' },
  { id: 'archive', label: 'Archive', disabled: true },
]

const tabsWithIcons: TabItem[] = [
  { id: 'plate', label: 'Plate Map', icon: '\u{1F9EA}' },
  { id: 'data', label: 'Raw Data', icon: '\u{1F4CA}' },
  { id: 'analysis', label: 'Analysis', icon: '\u{1F52C}' },
]

const variants = ['underline', 'pills', 'bordered'] as const
</script>

<template>
  <Story title="Base Inputs/BaseTabs">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <BaseTabs
            v-model="state.activeTab"
            :tabs="basicTabs"
            :variant="state.variant"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Active tab: <code>{{ state.activeTab }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstSelect
          v-model="state.activeTab"
          title="Active Tab"
          :options="basicTabs.map(t => ({ label: t.label, value: t.id }))"
        />
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;">
        <div v-for="variant in variants" :key="variant">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ variant }}
          </p>
          <BaseTabs
            v-model="activeTab"
            :tabs="basicTabs"
            :variant="variant"
          />
        </div>
      </div>
    </Variant>

    <Variant title="With Badges">
      <div style="padding: 2rem;">
        <BaseTabs
          model-value="inbox"
          :tabs="tabsWithBadges"
          variant="underline"
        />
      </div>
    </Variant>

    <Variant title="With Icons">
      <div style="padding: 2rem;">
        <BaseTabs
          model-value="plate"
          :tabs="tabsWithIcons"
          variant="pills"
        />
      </div>
    </Variant>

    <Variant title="With Disabled Tab">
      <div style="padding: 2rem;">
        <BaseTabs
          model-value="inbox"
          :tabs="tabsWithBadges"
          variant="bordered"
        />
      </div>
    </Variant>
  </Story>
</template>
