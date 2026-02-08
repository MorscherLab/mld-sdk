<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200,
})

const visible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

function show() {
  timeoutId = setTimeout(() => {
    visible.value = true
  }, props.delay)
}

function hide() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  visible.value = false
}

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <span
    class="mld-tooltip"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <span
      :class="[
        'mld-tooltip__content',
        `mld-tooltip__content--${position}`,
        visible ? 'mld-tooltip__content--visible' : '',
      ]"
      role="tooltip"
    >
      {{ text }}
    </span>
  </span>
</template>

<style>
@import '../styles/components/tooltip.css';
</style>
