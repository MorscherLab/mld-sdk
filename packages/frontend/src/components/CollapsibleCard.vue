<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  disabled: false,
})

const isOpen = ref(props.defaultOpen)

const toggle = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const headerClasses = computed(() => [
  'flex items-center justify-between w-full px-4 py-3 text-left',
  'bg-bg-card hover:bg-bg-hover transition-colors duration-mld',
  'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mld-primary',
  props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
])
</script>

<template>
  <div class="border border-border rounded-mld overflow-hidden bg-bg-card">
    <button
      type="button"
      :class="headerClasses"
      :disabled="disabled"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <div>
        <h3 class="text-sm font-medium text-text-primary">{{ title }}</h3>
        <p v-if="subtitle" class="text-xs text-text-muted mt-0.5">{{ subtitle }}</p>
      </div>
      <svg
        :class="[
          'w-5 h-5 text-text-muted transition-transform duration-200',
          isOpen ? 'rotate-180' : '',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="collapse">
      <div v-show="isOpen" class="border-t border-border">
        <div class="px-4 py-3">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import '../styles/components/collapsible-card.css';
</style>
