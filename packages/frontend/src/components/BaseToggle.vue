<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Use inline styles for cross-package Tailwind v4 compatibility
const sizeConfig = computed(() => {
  switch (props.size) {
    // Track: 32x16px | Knob: 12x12px | translate: 32-12-4 = 16px
    case 'sm': return {
      trackWidth: '32px',
      trackHeight: '16px',
      knobSize: '12px',
      translateX: '16px',
      text: 'text-sm',
    }
    // Track: 56x28px | Knob: 24x24px | translate: 56-24-4 = 28px
    case 'lg': return {
      trackWidth: '56px',
      trackHeight: '28px',
      knobSize: '24px',
      translateX: '28px',
      text: 'text-base',
    }
    // Track: 44x24px | Knob: 20x20px | translate: 44-20-4 = 20px
    default: return {
      trackWidth: '44px',
      trackHeight: '24px',
      knobSize: '20px',
      translateX: '20px',
      text: 'text-sm',
    }
  }
})

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      opacity: disabled ? '0.5' : '1',
    }"
    @click="toggle"
  >
    <div
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label || 'Toggle'"
      :style="{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        width: sizeConfig.trackWidth,
        height: sizeConfig.trackHeight,
        borderRadius: '9999px',
        border: '2px solid transparent',
        backgroundColor: modelValue ? 'var(--color-primary)' : 'var(--bg-tertiary)',
        transition: 'background-color 200ms ease-in-out',
      }"
    >
      <span
        :style="{
          display: 'inline-block',
          width: sizeConfig.knobSize,
          height: sizeConfig.knobSize,
          borderRadius: '9999px',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          transform: modelValue ? `translateX(${sizeConfig.translateX})` : 'translateX(2px)',
          transition: 'transform 200ms ease-in-out',
          pointerEvents: 'none',
        }"
      />
    </div>
    <span
      v-if="label"
      :style="{
        color: 'var(--text-primary)',
        fontSize: size === 'lg' ? '16px' : '14px',
      }"
    >
      {{ label }}
    </span>
  </div>
</template>
