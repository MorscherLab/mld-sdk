<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
}

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggle(event: MouseEvent) {
  isOpen.value = !isOpen.value
  emit('click', event)
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="mld-settings-button">
    <button
      type="button"
      :class="[
        'inline-flex items-center justify-center rounded-mld bg-transparent hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors duration-mld focus:outline-none focus:ring-2 focus:ring-mld-primary focus:ring-offset-2',
        sizeClasses[size],
      ]"
      aria-label="Settings"
      @click.stop="toggle"
    >
      <!-- Settings/Gear icon -->
      <svg
        :class="iconSizeClasses[size]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>

    <!-- Dropdown panel -->
    <div v-show="isOpen" class="mld-settings-dropdown">
      <slot>
        <div class="mld-settings-dropdown__empty">
          No settings configured
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
@import '../styles/components/settings-button.css';
</style>
