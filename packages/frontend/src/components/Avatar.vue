<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  initials?: string
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  size: 'md',
})

const PALETTE = ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981', '#F59E0B', '#06B6D4', '#6366F1']

const computedInitials = computed(() =>
  props.initials || props.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || ''
)

const backgroundColor = computed(() => {
  if (props.color) return props.color
  if (!props.name) return undefined

  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
})
</script>

<template>
  <span
    :class="['mld-avatar', `mld-avatar--${size}`]"
    :style="backgroundColor ? { backgroundColor } : undefined"
    role="img"
    :aria-label="alt || name || 'User avatar'"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt || name || ''"
      class="mld-avatar__image"
    >
    <span v-else-if="computedInitials" class="mld-avatar__initials">
      {{ computedInitials }}
    </span>
    <svg
      v-else
      class="mld-avatar__fallback"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </span>
</template>

<style>
@import '../styles/components/avatar.css';
</style>
