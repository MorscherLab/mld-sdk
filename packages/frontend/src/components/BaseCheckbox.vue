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
    case 'sm': return { boxSize: '16px', iconSize: '12px', text: 'text-sm' }
    case 'lg': return { boxSize: '24px', iconSize: '16px', text: 'text-base' }
    default: return { boxSize: '20px', iconSize: '14px', text: 'text-sm' }
  }
})

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label
    :class="[
      'inline-flex items-center gap-2 cursor-pointer select-none',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <div class="relative flex items-center justify-center">
      <!-- Hidden native checkbox for accessibility -->
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :aria-label="label || 'Checkbox'"
        class="absolute opacity-0 pointer-events-none"
        style="width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;"
        @change="handleChange"
      />
      <!-- Custom checkbox visual -->
      <div
        class="rounded border transition-colors flex items-center justify-center cursor-pointer"
        :class="modelValue ? 'bg-mld-primary border-mld-primary' : 'bg-bg-input border-border'"
        :style="{
          width: sizeConfig.boxSize,
          height: sizeConfig.boxSize,
          minWidth: sizeConfig.boxSize,
          minHeight: sizeConfig.boxSize,
        }"
        @click.prevent="!disabled && $emit('update:modelValue', !modelValue)"
      >
        <svg
          v-if="modelValue"
          class="text-white"
          :style="{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <span v-if="label" :class="['text-text-primary', sizeConfig.text]">
      {{ label }}
    </span>
  </label>
</template>
