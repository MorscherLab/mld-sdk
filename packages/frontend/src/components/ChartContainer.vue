<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'
import EmptyState from './EmptyState.vue'

interface Props {
  title?: string
  description?: string
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  empty: false,
  emptyMessage: 'No data available',
})
</script>

<template>
  <div class="mld-chart">
    <div v-if="title || description || $slots.toolbar" class="mld-chart__header">
      <div v-if="title || description" class="mld-chart__header-text">
        <h3 v-if="title" class="mld-chart__title">{{ title }}</h3>
        <p v-if="description" class="mld-chart__description">{{ description }}</p>
      </div>
      <div v-if="$slots.toolbar" class="mld-chart__toolbar">
        <slot name="toolbar" />
      </div>
    </div>

    <div class="mld-chart__body">
      <!-- Loading overlay -->
      <div v-if="loading" class="mld-chart__loading-overlay">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Empty state -->
      <template v-else-if="empty">
        <slot name="empty">
          <EmptyState
            :title="emptyMessage"
            size="sm"
            icon-path="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </slot>
      </template>

      <!-- Chart content -->
      <template v-else>
        <slot />
      </template>
    </div>

    <div v-if="$slots.legend" class="mld-chart__legend">
      <slot name="legend" />
    </div>
  </div>
</template>

<style>
@import '../styles/components/chart-container.css';
</style>
