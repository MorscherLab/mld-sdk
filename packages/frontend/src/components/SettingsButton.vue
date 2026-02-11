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
      :class="['mld-settings-button__trigger', `mld-settings-button__trigger--${size}`]"
      aria-label="Settings"
      @click.stop="toggle"
    >
      <!-- Settings/Gear icon -->
      <svg
        :class="`mld-settings-button__icon--${size}`"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" />
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
