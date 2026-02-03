<script setup lang="ts">
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

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label
    :class="[
      'mld-checkbox',
      disabled ? 'mld-checkbox--disabled' : '',
    ]"
  >
    <div class="mld-checkbox__input-wrapper">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :aria-label="label || 'Checkbox'"
        class="mld-checkbox__native"
        @change="handleChange"
      />
      <div
        :class="[
          'mld-checkbox__box',
          `mld-checkbox__box--${size}`,
          modelValue ? 'mld-checkbox__box--checked' : '',
        ]"
        @click.prevent="!disabled && $emit('update:modelValue', !modelValue)"
      >
        <svg
          v-if="modelValue"
          :class="['mld-checkbox__icon', `mld-checkbox__icon--${size}`]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <span v-if="label" :class="['mld-checkbox__label', `mld-checkbox__label--${size}`]">
      {{ label }}
    </span>
  </label>
</template>

<style>
@import '../styles/components/checkbox.css';
</style>
