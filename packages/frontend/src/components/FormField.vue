<script setup lang="ts">
interface Props {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  htmlFor?: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="htmlFor"
      class="block text-sm font-medium text-text-primary"
    >
      {{ label }}
      <span v-if="required" class="text-mld-danger ml-0.5">*</span>
    </label>

    <slot />

    <p v-if="error" class="text-sm text-mld-danger">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-sm text-text-muted">
      {{ hint }}
    </p>
  </div>
</template>
