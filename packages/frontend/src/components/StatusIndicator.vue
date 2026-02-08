<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status?: 'success' | 'warning' | 'error' | 'info' | 'muted'
  label?: string
  pulse?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'muted',
  label: undefined,
  pulse: false,
  color: undefined,
})

const dotStyle = computed(() =>
  props.color ? { backgroundColor: props.color, color: props.color } : {}
)
</script>

<template>
  <span class="mld-status">
    <span
      :class="[
        'mld-status__dot',
        { [`mld-status__dot--${status}`]: !color },
        { 'mld-status__dot--pulse': pulse },
      ]"
      :style="dotStyle"
    />
    <span v-if="label" class="mld-status__label">{{ label }}</span>
  </span>
</template>

<style>
@import '../styles/components/status-indicator.css';
</style>
