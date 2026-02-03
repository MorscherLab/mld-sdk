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
      props.disabled ? 'mld-checkbox--disabled' : '',
    ]"
  >
    <div class="mld-checkbox__input-wrapper">
      <input
        type="checkbox"
        :checked="props.modelValue"
        :disabled="props.disabled"
        :aria-label="props.label || 'Checkbox'"
        class="mld-checkbox__native"
        @change="handleChange"
      />
      <div
        :class="[
          'mld-checkbox__box',
          `mld-checkbox__box--${props.size}`,
          props.modelValue ? 'mld-checkbox__box--checked' : '',
        ]"
      >
        <svg
          v-if="props.modelValue"
          :class="['mld-checkbox__icon', `mld-checkbox__icon--${props.size}`]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
    <span v-if="props.label" :class="['mld-checkbox__label', `mld-checkbox__label--${props.size}`]">
      {{ props.label }}
    </span>
  </label>
</template>

<style>
@import '../styles/components/checkbox.css';
</style>
