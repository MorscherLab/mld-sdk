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

const defaultIconPaths = [
  'M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z',
  'M7 11h10',
  'M7 15h6',
  'M7 7h8',
]
</script>

<template>
  <div :class="['mld-empty-state', `mld-empty-state--${size}`]">
    <div :class="['mld-empty-state__icon-wrapper', `mld-empty-state__icon-wrapper--${color}`]">
      <slot name="icon">
        <svg
          class="mld-empty-state__icon"
          :class="`mld-empty-state__icon--${color}`"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <template v-if="iconPath">
            <path :d="iconPath" />
          </template>
          <template v-else>
            <path v-for="(d, i) in defaultIconPaths" :key="i" :d="d" />
          </template>
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
