<script setup lang="ts">
import { computed } from 'vue'
import type { RadioOption } from '../types'

interface Props {
  modelValue?: string | number
  options: RadioOption[]
  name: string
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  direction: 'vertical',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const sizeConfig = computed(() => {
  // Visual radio sizes with wrapper for touch targets
  switch (props.size) {
    case 'sm': return { radio: 'w-4 h-4', wrapper: 'w-8 h-8', dot: 'w-2 h-2', text: 'text-sm', desc: 'text-xs' }
    case 'lg': return { radio: 'w-6 h-6', wrapper: 'w-10 h-10', dot: 'w-3 h-3', text: 'text-base', desc: 'text-sm' }
    default: return { radio: 'w-5 h-5', wrapper: 'w-9 h-9', dot: 'w-2.5 h-2.5', text: 'text-sm', desc: 'text-xs' }
  }
})

function handleChange(value: string | number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    :class="[
      'flex gap-4',
      direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
    ]"
    role="radiogroup"
  >
    <label
      v-for="option in options"
      :key="String(option.value)"
      :class="[
        'inline-flex items-start gap-1 cursor-pointer select-none',
        (disabled || option.disabled) ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    >
      <div :class="['relative shrink-0 flex items-center justify-center -ml-1', sizeConfig.wrapper]">
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          :disabled="disabled || option.disabled"
          :aria-describedby="option.description ? `${name}-${option.value}-desc` : undefined"
          class="sr-only peer"
          @change="handleChange(option.value)"
        />
        <div
          :class="[
            sizeConfig.radio,
            'rounded-full border transition-colors duration-mld flex items-center justify-center',
            'peer-focus:ring-2 peer-focus:ring-mld-primary peer-focus:ring-offset-2 peer-focus:ring-offset-bg-primary',
            modelValue === option.value
              ? 'border-mld-primary bg-bg-input'
              : 'border-border bg-bg-input',
          ]"
        >
          <div
            v-if="modelValue === option.value"
            :class="[sizeConfig.dot, 'rounded-full bg-mld-primary']"
          />
        </div>
      </div>
      <div class="flex flex-col pt-1.5">
        <span :class="['text-text-primary', sizeConfig.text]">
          {{ option.label }}
        </span>
        <span
          v-if="option.description"
          :id="`${name}-${option.value}-desc`"
          :class="['text-text-muted', sizeConfig.desc]"
        >
          {{ option.description }}
        </span>
      </div>
    </label>
  </div>
</template>
