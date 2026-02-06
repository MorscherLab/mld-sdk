<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-text-primary mb-2">{{ title }}</h1>
    <p class="text-text-secondary">{{ description }}</p>
  </header>
</template>
