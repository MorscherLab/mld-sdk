<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** Makes the container scrollable (overflow-y: auto). Ignored when direction is set. */
  scrollable?: boolean
  /** Renders as a transparent flex container instead of a card. */
  direction?: 'row' | 'column'
  /** Flex gap between children. Only applies when direction is set. */
  gap?: string
}

const props = withDefaults(defineProps<Props>(), {
  scrollable: false,
  gap: '1rem',
})

const isLayout = computed(() => !!props.direction)
</script>

<template>
  <div
    class="mld-container"
    :class="
      isLayout
        ? ['mld-container--layout', direction === 'row' ? 'mld-container--row' : 'mld-container--column']
        : ['mld-container--card', scrollable ? 'mld-container--scrollable' : '']
    "
    :style="isLayout ? { gap } : undefined"
  >
    <slot />
  </div>
</template>
