<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  maxTags?: number
  allowDuplicates?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  disabled: false,
  error: false,
  size: 'md',
  allowDuplicates: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement>()

const canAddMore = computed(() => {
  if (props.maxTags === undefined) return true
  return props.modelValue.length < props.maxTags
})

function addTag(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return
  if (!canAddMore.value) return
  if (!props.allowDuplicates && props.modelValue.includes(trimmed)) return

  emit('update:modelValue', [...props.modelValue, trimmed])
  inputValue.value = ''
}

function removeTag(index: number) {
  if (props.disabled) return
  const newTags = [...props.modelValue]
  newTags.splice(index, 1)
  emit('update:modelValue', newTags)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag(inputValue.value)
  } else if (event.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text')
  if (!text) return

  const tags = text.split(/[,\n]/).map(t => t.trim()).filter(Boolean)
  const newTags = [...props.modelValue]

  for (const tag of tags) {
    if (!canAddMore.value) break
    if (!props.allowDuplicates && newTags.includes(tag)) continue
    newTags.push(tag)
  }

  emit('update:modelValue', newTags)
}

function focusInput() {
  inputRef.value?.focus()
}
</script>

<template>
  <div
    :class="[
      'mld-tags-input',
      `mld-tags-input--${size}`,
      error ? 'mld-tags-input--error' : '',
      disabled ? 'mld-tags-input--disabled' : '',
    ]"
    @click="focusInput"
  >
    <span
      v-for="(tag, index) in modelValue"
      :key="`${tag}-${index}`"
      :class="['mld-tags-input__tag', `mld-tags-input__tag--${size}`]"
    >
      {{ tag }}
      <button
        v-if="!disabled"
        type="button"
        :aria-label="`Remove ${tag}`"
        class="mld-tags-input__tag-remove"
        @click.stop="removeTag(index)"
      >
        <svg class="mld-tags-input__tag-remove-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </span>

    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="modelValue.length === 0 ? placeholder : ''"
      :disabled="disabled || !canAddMore"
      :class="['mld-tags-input__input', `mld-tags-input__input--${size}`]"
      @keydown="handleKeydown"
      @paste="handlePaste"
      @blur="addTag(inputValue)"
    />
  </div>
</template>

<style>
@import '../styles/components/tags-input.css';
</style>
