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

const containerClasses = computed(() => {
  switch (props.variant) {
    case 'pills':
      return 'flex gap-2 p-1 bg-bg-secondary rounded-mld'
    case 'bordered':
      return 'flex border-b border-border'
    default: // underline
      return 'flex border-b border-border'
  }
})

function getTabClasses(tab: TabItem) {
  const isActive = activeTab.value === tab.id
  const baseClasses = 'px-4 py-2 text-sm font-medium transition-colors duration-mld focus:outline-none'

  if (tab.disabled) {
    return `${baseClasses} text-text-muted cursor-not-allowed`
  }

  switch (props.variant) {
    case 'pills':
      return `${baseClasses} rounded-mld-sm ${isActive
        ? 'bg-mld-primary text-white'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
      }`
    case 'bordered':
      return `${baseClasses} border-b-2 -mb-px ${isActive
        ? 'border-mld-primary text-mld-primary'
        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
      }`
    default: // underline
      return `${baseClasses} border-b-2 -mb-px ${isActive
        ? 'border-mld-primary text-mld-primary'
        : 'border-transparent text-text-secondary hover:text-text-primary'
      }`
  }
}
</script>

<template>
  <div :class="containerClasses" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :aria-selected="activeTab === tab.id"
      :aria-disabled="tab.disabled"
      :class="getTabClasses(tab)"
      @click="selectTab(tab.id)"
    >
      <span class="flex items-center gap-2">
        <span v-if="tab.icon" class="text-current">{{ tab.icon }}</span>
        {{ tab.label }}
        <span
          v-if="tab.badge !== undefined"
          class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-mld-primary/10 text-mld-primary"
        >
          {{ tab.badge }}
        </span>
      </span>
    </button>
  </div>
</template>
