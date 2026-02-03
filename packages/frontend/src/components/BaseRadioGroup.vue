<script setup lang="ts">
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

function handleChange(value: string | number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    :class="['mld-radio-group', `mld-radio-group--${direction}`]"
    role="radiogroup"
  >
    <label
      v-for="option in options"
      :key="String(option.value)"
      :class="[
        'mld-radio-option',
        (disabled || option.disabled) ? 'mld-radio-option--disabled' : '',
      ]"
    >
      <div :class="['mld-radio-option__input-wrapper', `mld-radio-option__input-wrapper--${size}`]">
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          :disabled="disabled || option.disabled"
          :aria-describedby="option.description ? `${name}-${option.value}-desc` : undefined"
          class="mld-radio-option__native"
          @change="handleChange(option.value)"
        />
        <div
          :class="[
            'mld-radio-option__circle',
            `mld-radio-option__circle--${size}`,
            modelValue === option.value ? 'mld-radio-option__circle--checked' : '',
          ]"
        >
          <div
            v-if="modelValue === option.value"
            :class="['mld-radio-option__dot', `mld-radio-option__dot--${size}`]"
          />
        </div>
      </div>
      <div class="mld-radio-option__content">
        <span :class="['mld-radio-option__label', `mld-radio-option__label--${size}`]">
          {{ option.label }}
        </span>
        <span
          v-if="option.description"
          :id="`${name}-${option.value}-desc`"
          :class="['mld-radio-option__description', `mld-radio-option__description--${size}`]"
        >
          {{ option.description }}
        </span>
      </div>
    </label>
  </div>
</template>

<style>
@import '../styles/components/radio-group.css';
</style>
