<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="demo-section">
    <h3>{{ title }}</h3>
    <p v-if="description" class="text-sm text-text-secondary mb-4">
      {{ description }}
    </p>
    <slot />
  </section>
</template>
