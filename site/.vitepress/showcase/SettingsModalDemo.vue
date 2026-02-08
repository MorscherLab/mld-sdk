<script setup lang="ts">
import { ref } from 'vue'
import { SettingsModal, BaseButton } from '@morscherlab/mld-sdk'

const showBasic = ref(false)
const showCustom = ref(false)

const customTabs = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
]
</script>

<template>
  <!-- Appearance Only -->
  <DemoSection title="Appearance Only">
    <p class="text-sm text-text-secondary mb-4">
      Opens the settings modal with just the built-in appearance tab
    </p>
    <BaseButton @click="showBasic = true">Open Settings</BaseButton>

    <SettingsModal v-model="showBasic" />
  </DemoSection>

  <!-- With Custom Tabs -->
  <DemoSection title="With Custom Tabs">
    <p class="text-sm text-text-secondary mb-4">
      Custom tabs are displayed alongside the built-in appearance tab
    </p>
    <BaseButton @click="showCustom = true">Open Settings with Tabs</BaseButton>

    <SettingsModal v-model="showCustom" :tabs="customTabs">
      <template #tab-general>
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-text-primary">General settings content here</h4>
          <p class="text-sm text-text-secondary">
            Configure general application preferences such as language, timezone, and default views.
          </p>
        </div>
      </template>

      <template #tab-notifications>
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-text-primary">Notification preferences here</h4>
          <p class="text-sm text-text-secondary">
            Choose which notifications you want to receive and how they are delivered.
          </p>
        </div>
      </template>
    </SettingsModal>
  </DemoSection>
</template>
