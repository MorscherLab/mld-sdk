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
  <div ref="containerRef" class="mld-date-picker">
    <div class="mld-date-picker__input-wrapper">
      <input
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder || 'Select date'"
        :disabled="disabled"
        :class="[
          'mld-date-picker__input',
          `mld-date-picker__input--${size}`,
          error ? 'mld-date-picker__input--error' : '',
          disabled ? 'mld-date-picker__input--disabled' : '',
        ]"
        @click="toggleCalendar"
      />
      <div class="mld-date-picker__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
        </svg>
      </div>
    </div>

    <Transition
      enter-active-class="mld-date-picker__dropdown-enter-active"
      enter-from-class="mld-date-picker__dropdown-enter-from"
      enter-to-class="mld-date-picker__dropdown-enter-to"
      leave-active-class="mld-date-picker__dropdown-leave-active"
      leave-from-class="mld-date-picker__dropdown-leave-from"
      leave-to-class="mld-date-picker__dropdown-leave-to"
    >
      <div
        v-if="isOpen"
        class="mld-date-picker__dropdown"
        role="dialog"
        aria-modal="true"
        aria-label="Date picker"
      >
        <div class="mld-date-picker__header">
          <button
            type="button"
            aria-label="Previous month"
            class="mld-date-picker__nav-btn"
            @click="prevMonth"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span class="mld-date-picker__month-year">{{ monthYear }}</span>
          <button
            type="button"
            aria-label="Next month"
            class="mld-date-picker__nav-btn"
            @click="nextMonth"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div class="mld-date-picker__weekdays">
          <div
            v-for="day in weekDays"
            :key="day"
            class="mld-date-picker__weekday"
          >
            {{ day }}
          </div>
        </div>

        <div class="mld-date-picker__grid">
          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            type="button"
            :disabled="day.isDisabled"
            :aria-label="day.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })"
            :aria-selected="isSameDay(day.date, selectedDate)"
            :class="[
              'mld-date-picker__day',
              !day.isCurrentMonth ? 'mld-date-picker__day--other-month' : '',
              day.isDisabled ? 'mld-date-picker__day--disabled' : '',
              isSameDay(day.date, selectedDate) ? 'mld-date-picker__day--selected' : '',
              isToday(day.date) && !isSameDay(day.date, selectedDate) ? 'mld-date-picker__day--today' : '',
            ]"
            @click="selectDate(day)"
          >
            {{ day.date.getDate() }}
          </button>
        </div>

        <div class="mld-date-picker__footer">
          <button
            type="button"
            class="mld-date-picker__footer-btn mld-date-picker__today-btn"
            @click="goToToday"
          >
            Today
          </button>
          <button
            v-if="clearable && modelValue"
            type="button"
            class="mld-date-picker__footer-btn mld-date-picker__clear-btn"
            @click="clear"
          >
            Clear
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import '../styles/components/date-picker.css';
</style>
