<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value?: number
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showValue?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  variant: 'primary',
  size: 'md',
  label: undefined,
  showValue: false,
  indeterminate: false,
})

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))

const barStyle = computed(() => {
  if (props.indeterminate) return undefined
  return { width: `${clampedValue.value}%` }
})
</script>

<template>
  <div class="mld-progress">
    <div
      v-if="label || showValue"
      class="mld-progress__header"
    >
      <span v-if="label" class="mld-progress__label">{{ label }}</span>
      <span v-if="showValue && !indeterminate" class="mld-progress__value">{{ clampedValue }}%</span>
    </div>
    <div
      :class="[
        'mld-progress__track',
        `mld-progress__track--${size}`,
      ]"
      role="progressbar"
      :aria-valuenow="indeterminate ? undefined : clampedValue"
      :aria-valuemin="indeterminate ? undefined : 0"
      :aria-valuemax="indeterminate ? undefined : 100"
    >
      <div
        :class="[
          'mld-progress__bar',
          `mld-progress__bar--${variant}`,
          indeterminate ? 'mld-progress__bar--indeterminate' : '',
        ]"
        :style="barStyle"
      />
    </div>
  </div>
</template>

<style>
@import '../styles/components/progress-bar.css';
</style>
