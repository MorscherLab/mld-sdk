<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  iconPath?: string
  color?: 'primary' | 'cta' | 'success' | 'warning' | 'error' | 'muted'
  size?: 'sm' | 'md' | 'lg'
  actionLabel?: string
}

withDefaults(defineProps<Props>(), {
  color: 'muted',
  size: 'md',
})

const emit = defineEmits<{
  action: []
}>()

const defaultIconPath = 'M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'
</script>

<template>
  <div :class="['mld-empty-state', `mld-empty-state--${size}`]">
    <div :class="['mld-empty-state__icon-wrapper', `mld-empty-state__icon-wrapper--${color}`]">
      <slot name="icon">
        <svg
          class="mld-empty-state__icon"
          :class="`mld-empty-state__icon--${color}`"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path :d="iconPath || defaultIconPath" />
        </svg>
      </slot>
    </div>
    <h3 v-if="title" class="mld-empty-state__title">{{ title }}</h3>
    <p v-if="description" class="mld-empty-state__description">{{ description }}</p>
    <slot />
    <div v-if="actionLabel" class="mld-empty-state__action">
      <button class="mld-empty-state__button" @click="emit('action')">
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>

<style>
@import '../styles/components/empty-state.css';
</style>
