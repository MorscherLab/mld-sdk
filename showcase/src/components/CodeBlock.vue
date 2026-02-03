<script setup lang="ts">
defineProps<{
  code: string
}>()
</script>

<template>
  <pre class="code-block">{{ code }}</pre>
</template>
