<script setup lang="ts">
interface Props {
  vertical?: boolean
  label?: string
  spacing?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  vertical: false,
  label: undefined,
  spacing: 'md',
})
</script>

<template>
  <div
    v-if="vertical"
    :class="[
      'mld-divider',
      'mld-divider--vertical',
      `mld-divider--${spacing}`,
    ]"
    role="separator"
    aria-orientation="vertical"
  />
  <div
    v-else
    :class="[
      'mld-divider',
      `mld-divider--${spacing}`,
    ]"
    role="separator"
    aria-orientation="horizontal"
  >
    <template v-if="label">
      <span class="mld-divider__line" />
      <span class="mld-divider__label">{{ label }}</span>
      <span class="mld-divider__line" />
    </template>
  </div>
</template>

<style>
@import '../styles/components/divider.css';
</style>
