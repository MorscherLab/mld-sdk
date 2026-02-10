<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import type { SidebarItem } from '../types'

const collapsed = ref(false)
const activeId = ref('dashboard')

const sampleItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'D' },
  { id: 'experiments', label: 'Experiments', icon: 'E', badge: 3 },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: 'A',
    defaultOpen: true,
    children: [
      { id: 'dose-response', label: 'Dose-Response' },
      { id: 'quality-control', label: 'Quality Control' },
      { id: 'statistics', label: 'Statistics', badge: 'new' },
    ],
  },
  { id: 'settings', label: 'Settings', icon: 'S' },
  { id: 'disabled-item', label: 'Archived', icon: 'X', disabled: true },
]

const sides: Array<'left' | 'right'> = ['left', 'right']

function handleSelect(item: SidebarItem) {
  activeId.value = item.id
}
</script>

<template>
  <Story title="Layout/AppSidebar">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; height: 500px; position: relative;">
          <AppSidebar
            :items="sampleItems"
            :active-id="activeId"
            :collapsed="state.collapsed"
            :floating="state.floating"
            :width="state.width"
            :collapsed-width="state.collapsedWidth"
            :side="state.side"
            @update:collapsed="state.collapsed = $event"
            @select="handleSelect"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstCheckbox v-model="state.collapsed" title="Collapsed" />
        <HstCheckbox v-model="state.floating" title="Floating" />
        <HstText v-model="state.width" title="Width" />
        <HstText v-model="state.collapsedWidth" title="Collapsed Width" />
        <HstSelect
          v-model="state.side"
          title="Side"
          :options="sides.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="With Navigation Items">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <AppSidebar
          :items="sampleItems"
          :active-id="activeId"
          :collapsed="collapsed"
          @update:collapsed="collapsed = $event"
          @select="handleSelect"
        />
      </div>
    </Variant>

    <Variant title="Collapsed State">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <AppSidebar
          :items="sampleItems"
          :active-id="activeId"
          :collapsed="true"
          @select="handleSelect"
        />
      </div>
    </Variant>

    <Variant title="Custom Slot Content">
      <div style="padding: 2rem; height: 400px; position: relative;">
        <AppSidebar :floating="true" width="220px">
          <div style="padding: 1rem;">
            <p style="margin: 0 0 1rem; font-weight: 600; color: var(--text-primary, #1e293b);">Custom Nav</p>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
              <li style="padding: 0.5rem; border-radius: 0.375rem; background: var(--bg-hover, #f1f5f9); cursor: pointer;">Home</li>
              <li style="padding: 0.5rem; border-radius: 0.375rem; cursor: pointer;">Reports</li>
              <li style="padding: 0.5rem; border-radius: 0.375rem; cursor: pointer;">Archive</li>
            </ul>
          </div>
        </AppSidebar>
      </div>
    </Variant>

    <Variant title="Right Side">
      <div style="padding: 2rem; height: 500px; position: relative;">
        <AppSidebar
          :items="sampleItems"
          :active-id="activeId"
          side="right"
          :collapsed="collapsed"
          @update:collapsed="collapsed = $event"
          @select="handleSelect"
        />
      </div>
    </Variant>
  </Story>
</template>
