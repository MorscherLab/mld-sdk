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

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div
    :class="[
      'mld-toggle',
      disabled ? 'mld-toggle--disabled' : '',
    ]"
    @click="toggle"
  >
    <div
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label || 'Toggle'"
      :class="[
        'mld-toggle__track',
        `mld-toggle__track--${size}`,
        modelValue ? 'mld-toggle__track--on' : 'mld-toggle__track--off',
      ]"
    >
      <span
        :class="[
          'mld-toggle__knob',
          `mld-toggle__knob--${size}`,
          modelValue ? `mld-toggle__knob--on-${size}` : 'mld-toggle__knob--off',
        ]"
      />
    </div>
    <span
      v-if="label"
      :class="['mld-toggle__label', `mld-toggle__label--${size}`]"
    >
      {{ label }}
    </span>
  </div>
</template>

<style>
@import '../styles/components/toggle.css';
</style>
