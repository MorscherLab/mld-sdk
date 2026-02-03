<script setup lang="ts">
import { computed } from 'vue'
import type { TabItem } from '../types'

interface Props {
  modelValue: string
  tabs: TabItem[]
  variant?: 'underline' | 'pills' | 'bordered'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'underline',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = computed(() => props.modelValue)

function selectTab(tabId: string) {
  const tab = props.tabs.find(t => t.id === tabId)
  if (tab && !tab.disabled) {
    emit('update:modelValue', tabId)
  }
}
</script>

<template>
  <div :class="['mld-tabs', `mld-tabs--${variant}`]" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :aria-selected="activeTab === tab.id"
      :aria-disabled="tab.disabled"
      :class="[
        'mld-tab',
        activeTab === tab.id ? 'mld-tab--active' : '',
        tab.disabled ? 'mld-tab--disabled' : '',
      ]"
      @click="selectTab(tab.id)"
    >
      <span class="mld-tab__content">
        <span v-if="tab.icon" class="mld-tab__icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.badge !== undefined" class="mld-tab__badge">
          {{ tab.badge }}
        </span>
      </span>
    </button>
  </div>
</template>

<style>
@import '../styles/components/tabs.css';
</style>
