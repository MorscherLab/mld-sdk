<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  animation: 'pulse',
})

const style = computed(() => {
  const s: Record<string, string> = {}

  if (props.width) {
    s.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height) {
    s.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  return s
})

const classes = computed(() => {
  const base = ['bg-bg-hover']

  switch (props.variant) {
    case 'circular':
      base.push('rounded-full')
      if (!props.width && !props.height) {
        base.push('w-10 h-10')
      }
      break
    case 'rectangular':
      base.push('rounded-none')
      if (!props.height) base.push('h-24')
      break
    case 'rounded':
      base.push('rounded-mld')
      if (!props.height) base.push('h-24')
      break
    default:
      base.push('rounded')
      if (!props.height) base.push('h-4')
      if (!props.width) base.push('w-full')
  }

  switch (props.animation) {
    case 'pulse':
      base.push('animate-pulse')
      break
    case 'wave':
      base.push('skeleton-wave')
      break
  }

  return base
})
</script>

<template>
  <div :class="classes" :style="style" />
</template>

<style>
@import '../styles/components/skeleton.css';
</style>
