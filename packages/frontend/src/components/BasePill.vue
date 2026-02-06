<script setup lang="ts">
import type { PillVariant, PillSize } from '../types'

/**
 * BasePill - Compact label component for tags, status indicators, and badges.
 *
 * @example
 * ```vue
 * <BasePill variant="success">Active</BasePill>
 * <BasePill variant="warning" removable @remove="handleRemove">Tag</BasePill>
 * <BasePill :icon="true">
 *   <template #icon><CheckIcon /></template>
 *   Verified
 * </BasePill>
 * ```
 */
interface Props {
  /** Visual style variant */
  variant?: PillVariant
  /** Size of the pill */
  size?: PillSize
  /** Show remove button */
  removable?: boolean
  /** Disable interaction */
  disabled?: boolean
  /** Show icon slot */
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  removable: false,
  disabled: false,
  icon: false,
})

/**
 * @event remove - Emitted when the remove button is clicked
 */
const emit = defineEmits<{
  remove: []
}>()

function handleRemove(event: MouseEvent) {
  event.stopPropagation()
  if (!props.disabled) {
    emit('remove')
  }
}
</script>

<template>
  <span
    :class="[
      'mld-pill',
      `mld-pill--${variant}`,
      `mld-pill--${size}`,
      { 'mld-pill--disabled': disabled, 'mld-pill--with-icon': icon },
    ]"
  >
    <span v-if="icon" class="mld-pill__icon">
      <slot name="icon" />
    </span>
    <span class="mld-pill__label">
      <slot />
    </span>
    <button
      v-if="removable && !disabled"
      type="button"
      class="mld-pill__remove"
      aria-label="Remove"
      @click="handleRemove"
    >
      <svg class="mld-pill__remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
</template>

<style>
@import '../styles/components/pill.css';
</style>
