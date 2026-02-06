<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SelectOption, ButtonVariant, ButtonSize } from '../types'

/**
 * DropdownButton - Button-style select with dropdown menu for option selection.
 *
 * @example
 * ```vue
 * <DropdownButton
 *   v-model="selectedValue"
 *   :options="[
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B', description: 'Additional info' }
 *   ]"
 *   variant="secondary"
 * />
 * ```
 */
interface Props {
  /** Selected option value */
  modelValue?: string | number
  /** Available options */
  options: SelectOption<string | number>[]
  /** Placeholder text when no option is selected */
  placeholder?: string
  /** Button style variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Disable interaction */
  disabled?: boolean
  /** Show loading spinner */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  size: 'md',
  disabled: false,
  loading: false,
})

/**
 * @event update:modelValue - Emitted when an option is selected (v-model support)
 * @event select - Emitted when an option is selected, includes full option object
 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  select: [option: SelectOption<string | number>]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLDivElement>()

const selectedLabel = computed(() => {
  if (props.modelValue === undefined) return props.placeholder ?? 'Select...'
  const found = props.options.find(o => o.value === props.modelValue)
  return found?.label ?? String(props.modelValue)
})

function toggle() {
  if (props.disabled || props.loading) return
  isOpen.value = !isOpen.value
}

function selectOption(option: SelectOption<string | number>) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('select', option)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)

  return () => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div ref="containerRef" class="mld-dropdown-button">
    <button
      type="button"
      :disabled="disabled || loading"
      :class="[
        'mld-dropdown-button__trigger',
        `mld-dropdown-button__trigger--${variant}`,
        `mld-dropdown-button__trigger--${size}`,
        {
          'mld-dropdown-button__trigger--disabled': disabled || loading,
          'mld-dropdown-button__trigger--open': isOpen,
        },
      ]"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <svg v-if="loading" class="mld-dropdown-button__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      </svg>
      <span class="mld-dropdown-button__label">{{ selectedLabel }}</span>
      <svg
        :class="['mld-dropdown-button__chevron', { 'mld-dropdown-button__chevron--open': isOpen }]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="mld-dropdown-button-menu">
      <ul
        v-if="isOpen"
        class="mld-dropdown-button__menu"
        role="listbox"
        :aria-activedescendant="modelValue !== undefined ? `mld-dropdown-option-${modelValue}` : undefined"
      >
        <li
          v-for="option in options"
          :id="`mld-dropdown-option-${option.value}`"
          :key="String(option.value)"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
          :class="[
            'mld-dropdown-button__option',
            {
              'mld-dropdown-button__option--selected': option.value === modelValue,
              'mld-dropdown-button__option--disabled': option.disabled,
            },
          ]"
          @click="selectOption(option)"
        >
          <span class="mld-dropdown-button__option-label">{{ option.label }}</span>
          <span v-if="option.description" class="mld-dropdown-button__option-description">
            {{ option.description }}
          </span>
          <svg
            v-if="option.value === modelValue"
            class="mld-dropdown-button__option-check"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style>
@import '../styles/components/dropdown-button.css';
</style>
