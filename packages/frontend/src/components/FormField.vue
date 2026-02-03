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
  <div class="mld-form-field">
    <label
      v-if="label"
      :for="htmlFor"
      class="mld-form-field__label"
    >
      {{ label }}
      <span v-if="required" class="mld-form-field__required">*</span>
    </label>

    <slot />

    <p v-if="error" class="mld-form-field__error">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mld-form-field__hint">
      {{ hint }}
    </p>
  </div>
</template>

<style>
@import '../styles/components/form-field.css';
</style>
