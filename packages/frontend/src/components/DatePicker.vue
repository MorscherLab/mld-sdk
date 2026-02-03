<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  min?: string
  max?: string
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  error: false,
  size: 'md',
  clearable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLDivElement>()
const currentMonth = ref(new Date())

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2.5 py-1.5 text-sm'
    case 'lg': return 'px-4 py-3 text-base'
    default: return 'px-3 py-2 text-sm'
  }
})

const inputClasses = computed(() => [
  'w-full rounded-mld border bg-bg-input text-text-primary',
  'transition-colors duration-mld cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-mld-primary focus:border-transparent',
  sizeClasses.value,
  props.error
    ? 'border-mld-danger focus:ring-mld-danger'
    : 'border-border',
  props.disabled ? 'opacity-50 cursor-not-allowed bg-bg-hover' : '',
])

const selectedDate = computed(() => {
  if (!props.modelValue) return null
  const date = new Date(props.modelValue + 'T00:00:00')
  return isNaN(date.getTime()) ? null : date
})

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

const monthYear = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
})

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: { date: Date; isCurrentMonth: boolean; isDisabled: boolean }[] = []

  // Previous month days
  const startPadding = firstDay.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({ date, isCurrentMonth: false, isDisabled: isDateDisabled(date) })
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({ date, isCurrentMonth: true, isDisabled: isDateDisabled(date) })
  }

  // Next month days
  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    const date = new Date(year, month + 1, i)
    days.push({ date, isCurrentMonth: false, isDisabled: isDateDisabled(date) })
  }

  return days
})

function isDateDisabled(date: Date): boolean {
  if (props.min) {
    const minDate = new Date(props.min + 'T00:00:00')
    if (date < minDate) return true
  }
  if (props.max) {
    const maxDate = new Date(props.max + 'T00:00:00')
    if (date > maxDate) return true
  }
  return false
}

function isSameDay(date1: Date, date2: Date | null): boolean {
  if (!date2) return false
  return date1.toDateString() === date2.toDateString()
}

function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString()
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function selectDate(day: { date: Date; isDisabled: boolean }) {
  if (day.isDisabled || props.disabled) return
  emit('update:modelValue', formatDateValue(day.date))
  isOpen.value = false
}

function prevMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  )
}

function goToToday() {
  const today = new Date()
  currentMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
  if (!isDateDisabled(today)) {
    emit('update:modelValue', formatDateValue(today))
    isOpen.value = false
  }
}

function clear() {
  emit('update:modelValue', undefined)
  isOpen.value = false
}

function toggleCalendar() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(isOpen, (open) => {
  if (open && selectedDate.value) {
    currentMonth.value = new Date(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth(),
      1
    )
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
  <div ref="containerRef" class="relative">
    <!-- Input -->
    <div class="relative">
      <input
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder || 'Select date'"
        :disabled="disabled"
        :class="inputClasses"
        class="pr-10"
        @click="toggleCalendar"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Calendar Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-72 p-3 rounded-mld border border-border bg-bg-card shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Date picker"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <button
            type="button"
            aria-label="Previous month"
            class="p-2 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"
            @click="prevMonth"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-sm font-medium text-text-primary">{{ monthYear }}</span>
          <button
            type="button"
            aria-label="Next month"
            class="p-2 rounded-full hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors"
            @click="nextMonth"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Week days -->
        <div class="grid grid-cols-7 gap-1 mb-1">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs font-medium text-text-muted py-1"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar grid -->
        <div class="grid grid-cols-7 gap-0.5">
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            type="button"
            :disabled="day.isDisabled"
            :aria-label="day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"
            :aria-selected="isSameDay(day.date, selectedDate)"
            :class="[
              'w-9 h-9 text-sm rounded-full transition-colors flex items-center justify-center',
              day.isCurrentMonth ? 'text-text-primary' : 'text-text-muted',
              day.isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-bg-hover cursor-pointer',
              isSameDay(day.date, selectedDate) ? 'bg-mld-primary text-white hover:bg-mld-primary' : '',
              isToday(day.date) && !isSameDay(day.date, selectedDate) ? 'ring-1 ring-mld-primary' : '',
            ]"
            @click="selectDate(day)"
          >
            {{ day.date.getDate() }}
          </button>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <button
            type="button"
            class="text-xs text-mld-primary hover:text-mld-primary/80 transition-colors"
            @click="goToToday"
          >
            Today
          </button>
          <button
            v-if="clearable && modelValue"
            type="button"
            class="text-xs text-text-muted hover:text-text-primary transition-colors"
            @click="clear"
          >
            Clear
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
