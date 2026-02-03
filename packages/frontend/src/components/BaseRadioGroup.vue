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
    :class="['mld-radio-group', `mld-radio-group--${props.direction}`]"
    role="radiogroup"
  >
    <label
      v-for="option in props.options"
      :key="String(option.value)"
      :class="[
        'mld-radio-option',
        (props.disabled || option.disabled) ? 'mld-radio-option--disabled' : '',
      ]"
    >
      <div :class="['mld-radio-option__input-wrapper', `mld-radio-option__input-wrapper--${props.size}`]">
        <input
          type="radio"
          :name="props.name"
          :value="option.value"
          :checked="props.modelValue === option.value"
          :disabled="props.disabled || option.disabled"
          :aria-describedby="option.description ? `${props.name}-${option.value}-desc` : undefined"
          class="mld-radio-option__native"
          @change="handleChange(option.value)"
        />
        <div
          :class="[
            'mld-radio-option__circle',
            `mld-radio-option__circle--${props.size}`,
            props.modelValue === option.value ? 'mld-radio-option__circle--checked' : '',
          ]"
        >
          <div
            v-if="props.modelValue === option.value"
            :class="['mld-radio-option__dot', `mld-radio-option__dot--${props.size}`]"
          />
        </div>
      </div>
      <div class="mld-radio-option__content">
        <span :class="['mld-radio-option__label', `mld-radio-option__label--${props.size}`]">
          {{ option.label }}
        </span>
        <span
          v-if="option.description"
          :id="`${props.name}-${option.value}-desc`"
          :class="['mld-radio-option__description', `mld-radio-option__description--${props.size}`]"
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
