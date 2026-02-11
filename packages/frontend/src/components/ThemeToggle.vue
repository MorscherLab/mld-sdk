<script setup lang="ts">
import { useTheme } from '../composables/useTheme'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    :class="['mld-theme-toggle', `mld-theme-toggle--${size}`]"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <!-- Lucide sun -->
    <svg
      v-if="isDark"
      :class="`mld-theme-toggle__icon--${size}`"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
    <!-- Lucide moon -->
    <svg
      v-else
      :class="`mld-theme-toggle__icon--${size}`"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  </button>
</template>

<style>
@import '../styles/components/theme-toggle.css';
</style>
