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

const sizeConfig = computed(() => {
  switch (props.size) {
    case 'sm': return { padding: 'px-2 py-1', text: 'text-sm', tag: 'px-1.5 py-0.5 text-xs' }
    case 'lg': return { padding: 'px-4 py-2.5', text: 'text-base', tag: 'px-2.5 py-1 text-sm' }
    default: return { padding: 'px-3 py-2', text: 'text-sm', tag: 'px-2 py-0.5 text-xs' }
  }
})

const containerClasses = computed(() => [
  'w-full rounded-mld border bg-bg-input flex flex-wrap gap-1.5 items-center cursor-text',
  'transition-colors duration-mld',
  'focus-within:outline-none focus-within:ring-2 focus-within:ring-mld-primary focus-within:border-transparent',
  sizeConfig.value.padding,
  props.error
    ? 'border-mld-danger focus-within:ring-mld-danger'
    : 'border-border',
  props.disabled ? 'opacity-50 cursor-not-allowed bg-bg-hover' : '',
])

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
    :class="containerClasses"
    @click="focusInput"
  >
    <!-- Tags -->
    <span
      v-for="(tag, index) in modelValue"
      :key="`${tag}-${index}`"
      :class="[
        'inline-flex items-center gap-1 rounded-full bg-mld-primary/10 text-mld-primary',
        sizeConfig.tag,
      ]"
    >
      {{ tag }}
      <button
        v-if="!disabled"
        type="button"
        :aria-label="`Remove ${tag}`"
        class="p-0.5 -mr-0.5 rounded-full hover:text-mld-primary/70 hover:bg-mld-primary/20 transition-colors"
        @click.stop="removeTag(index)"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>

    <!-- Input -->
    <input
      ref="inputRef"
      v-model="inputValue"
      type="text"
      :placeholder="modelValue.length === 0 ? placeholder : ''"
      :disabled="disabled || !canAddMore"
      :class="[
        'flex-1 min-w-[60px] bg-transparent outline-none text-text-primary placeholder:text-text-muted',
        sizeConfig.text,
      ]"
      @keydown="handleKeydown"
      @paste="handlePaste"
      @blur="addTag(inputValue)"
    />
  </div>
</template>
