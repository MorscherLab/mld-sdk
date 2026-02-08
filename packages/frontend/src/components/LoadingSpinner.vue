<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'cta' | 'muted'
  label?: string
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  label: 'Loading',
})
</script>

<template>
  <div
    :class="[
      'mld-spinner',
      `mld-spinner--${size}`,
      `mld-spinner--${variant}`,
    ]"
    role="status"
  >
    <svg
      class="mld-spinner__svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        style="opacity: 0.25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        style="opacity: 0.75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span class="mld-spinner__label">{{ label }}</span>
  </div>
</template>

<style>
@import '../styles/components/loading-spinner.css';
</style>
