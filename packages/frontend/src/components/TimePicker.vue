<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { generateTimeSlots, formatTime, parseTime, compareTime } from '../composables/useTimeUtils'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  min?: string
  max?: string
  step?: number
  format?: '12h' | '24h'
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select time',
  disabled: false,
  error: false,
  size: 'md',
  step: 15,
  format: '24h',
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLDivElement>()
const listRef = ref<HTMLUListElement>()
const highlightedIndex = ref(-1)

const slots = computed(() => {
  const start = props.min ?? '00:00'
  const end = props.max ?? '23:59'
  return generateTimeSlots(start, end, props.step)
})

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const { hour, minute } = parseTime(props.modelValue)
  return formatTime(hour, minute, props.format)
})

function isSlotDisabled(slot: string): boolean {
  if (props.min && compareTime(slot, props.min) < 0) return true
  if (props.max && compareTime(slot, props.max) > 0) return true
  return false
}

function selectSlot(slot: string) {
  if (isSlotDisabled(slot) || props.disabled) return
  emit('update:modelValue', slot)
  isOpen.value = false
}

function clear() {
  emit('update:modelValue', undefined)
  isOpen.value = false
}

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function scrollToActiveSlot() {
  nextTick(() => {
    if (!listRef.value) return
    const activeEl = listRef.value.querySelector('.mld-time-picker__slot--active') as HTMLElement | null
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'center' })
    } else if (props.modelValue) {
      // Scroll to nearest slot
      const nearestIndex = findNearestSlotIndex(props.modelValue)
      if (nearestIndex >= 0) {
        const children = listRef.value.children
        if (children[nearestIndex]) {
          (children[nearestIndex] as HTMLElement).scrollIntoView({ block: 'center' })
        }
      }
    }
  })
}

function findNearestSlotIndex(time: string): number {
  if (slots.value.length === 0) return -1
  let bestIndex = 0
  let bestDiff = Infinity
  for (let i = 0; i < slots.value.length; i++) {
    const { hour: h1, minute: m1 } = parseTime(slots.value[i])
    const { hour: h2, minute: m2 } = parseTime(time)
    const minuteDiff = Math.abs((h1 * 60 + m1) - (h2 * 60 + m2))
    if (minuteDiff < bestDiff) {
      bestDiff = minuteDiff
      bestIndex = i
    }
  }
  return bestIndex
}

function handleKeydown(event: KeyboardEvent) {
  if (!isOpen.value) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault()
      isOpen.value = true
      return
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault()
      let next = highlightedIndex.value + 1
      while (next < slots.value.length && isSlotDisabled(slots.value[next])) next++
      if (next < slots.value.length) {
        highlightedIndex.value = next
        scrollToHighlighted()
      }
      break
    }
    case 'ArrowUp': {
      event.preventDefault()
      let prev = highlightedIndex.value - 1
      while (prev >= 0 && isSlotDisabled(slots.value[prev])) prev--
      if (prev >= 0) {
        highlightedIndex.value = prev
        scrollToHighlighted()
      }
      break
    }
    case 'Enter': {
      event.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < slots.value.length) {
        selectSlot(slots.value[highlightedIndex.value])
      }
      break
    }
    case 'Escape': {
      event.preventDefault()
      isOpen.value = false
      break
    }
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    if (!listRef.value) return
    const children = listRef.value.children
    if (children[highlightedIndex.value]) {
      (children[highlightedIndex.value] as HTMLElement).scrollIntoView({ block: 'nearest' })
    }
  })
}

watch(isOpen, (open) => {
  if (open) {
    // Set highlighted index to current value or nearest slot
    if (props.modelValue) {
      const idx = slots.value.indexOf(props.modelValue)
      highlightedIndex.value = idx >= 0 ? idx : findNearestSlotIndex(props.modelValue)
    } else {
      highlightedIndex.value = 0
    }
    scrollToActiveSlot()
  } else {
    highlightedIndex.value = -1
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="mld-time-picker" @keydown="handleKeydown">
    <div class="mld-time-picker__input-wrapper">
      <input
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'mld-time-picker__input',
          `mld-time-picker__input--${size}`,
          error ? 'mld-time-picker__input--error' : '',
          disabled ? 'mld-time-picker__input--disabled' : '',
        ]"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
        @click="toggleDropdown"
      />
      <button
        v-if="clearable && modelValue"
        type="button"
        class="mld-time-picker__clear-btn"
        aria-label="Clear time"
        @click.stop="clear"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
      <div class="mld-time-picker__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      </div>
    </div>

    <Transition
      enter-active-class="mld-time-picker__dropdown-enter-active"
      enter-from-class="mld-time-picker__dropdown-enter-from"
      enter-to-class="mld-time-picker__dropdown-enter-to"
      leave-active-class="mld-time-picker__dropdown-leave-active"
      leave-from-class="mld-time-picker__dropdown-leave-from"
      leave-to-class="mld-time-picker__dropdown-leave-to"
    >
      <div
        v-if="isOpen"
        class="mld-time-picker__dropdown"
      >
        <ul
          ref="listRef"
          class="mld-time-picker__list"
          role="listbox"
          aria-label="Available times"
        >
          <li
            v-for="(slot, index) in slots"
            :key="slot"
            role="option"
            :aria-selected="slot === modelValue"
            :aria-disabled="isSlotDisabled(slot)"
            :class="[
              'mld-time-picker__slot',
              slot === modelValue ? 'mld-time-picker__slot--active' : '',
              isSlotDisabled(slot) ? 'mld-time-picker__slot--disabled' : '',
              index === highlightedIndex && !isSlotDisabled(slot) ? 'mld-time-picker__slot--highlighted' : '',
            ]"
            @click="selectSlot(slot)"
          >
            {{ formatTime(parseTime(slot).hour, parseTime(slot).minute, format) }}
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style>
@import '../styles/components/time-picker.css';
</style>
