<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { generateTimeSlots, formatTime, parseTime } from '../composables/useTimeUtils'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  min?: string
  max?: string
  timeStep?: number
  timeFormat?: '12h' | '24h'
  clearable?: boolean
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date & time',
  disabled: false,
  error: false,
  size: 'md',
  timeStep: 15,
  timeFormat: '24h',
  clearable: false,
  locale: 'en-US',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLDivElement>()

// Parse model value into date and time parts
const selectedDate = computed(() => {
  if (!props.modelValue) return null
  const d = new Date(props.modelValue)
  return isNaN(d.getTime()) ? null : d
})

const selectedDateStr = computed(() => {
  if (!selectedDate.value) return null
  const y = selectedDate.value.getFullYear()
  const m = String(selectedDate.value.getMonth() + 1).padStart(2, '0')
  const d = String(selectedDate.value.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

const selectedTimeStr = computed(() => {
  if (!selectedDate.value) return null
  return formatTime(selectedDate.value.getHours(), selectedDate.value.getMinutes())
})

const displayValue = computed(() => {
  if (!selectedDate.value) return ''
  const dateStr = selectedDate.value.toLocaleDateString(props.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = formatTime(
    selectedDate.value.getHours(),
    selectedDate.value.getMinutes(),
    props.timeFormat,
  )
  return `${dateStr} ${timeStr}`
})

// Calendar state
const currentMonth = ref(new Date())
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: { date: Date; isCurrentMonth: boolean; isDisabled: boolean }[] = []

  const startPadding = firstDay.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({ date, isCurrentMonth: false, isDisabled: isDateDisabled(date) })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({ date, isCurrentMonth: true, isDisabled: isDateDisabled(date) })
  }

  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    const date = new Date(year, month + 1, i)
    days.push({ date, isCurrentMonth: false, isDisabled: isDateDisabled(date) })
  }

  return days
})

// Time slots
const timeSlots = computed(() => {
  return generateTimeSlots('00:00', '23:59', props.timeStep)
})

const monthYear = computed(() => {
  return currentMonth.value.toLocaleDateString(props.locale, {
    year: 'numeric',
    month: 'long',
  })
})

function isDateDisabled(date: Date): boolean {
  if (props.min) {
    const minDate = new Date(props.min)
    minDate.setHours(0, 0, 0, 0)
    const check = new Date(date)
    check.setHours(0, 0, 0, 0)
    if (check < minDate) return true
  }
  if (props.max) {
    const maxDate = new Date(props.max)
    maxDate.setHours(23, 59, 59, 999)
    const check = new Date(date)
    check.setHours(23, 59, 59, 999)
    if (check > maxDate) return true
  }
  return false
}

function isTimeDisabled(time: string): boolean {
  if (!selectedDateStr.value) return false
  const { hour, minute } = parseTime(time)

  if (props.min) {
    const minDate = new Date(props.min)
    if (selectedDateStr.value === formatDateStr(minDate)) {
      const minMin = minDate.getHours() * 60 + minDate.getMinutes()
      if (hour * 60 + minute < minMin) return true
    }
  }
  if (props.max) {
    const maxDate = new Date(props.max)
    if (selectedDateStr.value === formatDateStr(maxDate)) {
      const maxMin = maxDate.getHours() * 60 + maxDate.getMinutes()
      if (hour * 60 + minute > maxMin) return true
    }
  }
  return false
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isSameDay(a: Date, b: Date | null): boolean {
  if (!b) return false
  return a.toDateString() === b.toDateString()
}

function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString()
}

function selectDate(day: { date: Date; isDisabled: boolean }) {
  if (day.isDisabled || props.disabled) return
  const dateStr = formatDateStr(day.date)
  const timeStr = selectedTimeStr.value || '09:00'
  emit('update:modelValue', `${dateStr}T${timeStr}`)
}

function selectTime(time: string) {
  if (isTimeDisabled(time)) return
  const dateStr = selectedDateStr.value || formatDateStr(new Date())
  emit('update:modelValue', `${dateStr}T${time}`)
}

function prevMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1,
  )
}

function nextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1,
  )
}

function goToNow() {
  const now = new Date()
  currentMonth.value = new Date(now.getFullYear(), now.getMonth(), 1)
  const dateStr = formatDateStr(now)
  const timeStr = formatTime(now.getHours(), now.getMinutes())
  emit('update:modelValue', `${dateStr}T${timeStr}`)
  isOpen.value = false
}

function goToToday() {
  const today = new Date()
  currentMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
  const dateStr = formatDateStr(today)
  const timeStr = selectedTimeStr.value || '09:00'
  emit('update:modelValue', `${dateStr}T${timeStr}`)
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

watch(isOpen, (open) => {
  if (open && selectedDate.value) {
    currentMonth.value = new Date(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth(),
      1,
    )
    nextTick(() => {
      // Scroll time grid to selected time
      const grid = containerRef.value?.querySelector('.mld-datetime-picker__time-grid')
      const active = containerRef.value?.querySelector('.mld-datetime-picker__time-chip--active')
      if (grid && active) {
        active.scrollIntoView({ block: 'center' })
      }
    })
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
  <div ref="containerRef" class="mld-datetime-picker">
    <div class="mld-datetime-picker__input-wrapper">
      <div class="mld-datetime-picker__icon-calendar">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <input
        type="text"
        readonly
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'mld-datetime-picker__input',
          `mld-datetime-picker__input--${size}`,
          error ? 'mld-datetime-picker__input--error' : '',
          disabled ? 'mld-datetime-picker__input--disabled' : '',
        ]"
        aria-label="Select date and time"
        @click="toggleDropdown"
      />
      <div class="mld-datetime-picker__icon-clock">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <Transition
      enter-active-class="mld-datetime-picker__dropdown-enter-active"
      enter-from-class="mld-datetime-picker__dropdown-enter-from"
      enter-to-class="mld-datetime-picker__dropdown-enter-to"
      leave-active-class="mld-datetime-picker__dropdown-leave-active"
      leave-from-class="mld-datetime-picker__dropdown-leave-from"
      leave-to-class="mld-datetime-picker__dropdown-leave-to"
    >
      <div
        v-if="isOpen"
        class="mld-datetime-picker__dropdown"
        role="dialog"
        aria-modal="true"
        aria-label="Date and time picker"
      >
        <!-- Calendar section -->
        <div class="mld-datetime-picker__calendar-section">
          <div class="mld-date-picker__header">
            <button type="button" class="mld-date-picker__nav-btn" aria-label="Previous month" @click="prevMonth">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="mld-date-picker__month-year">{{ monthYear }}</span>
            <button type="button" class="mld-date-picker__nav-btn" aria-label="Next month" @click="nextMonth">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="mld-date-picker__weekdays">
            <div v-for="day in weekDays" :key="day" class="mld-date-picker__weekday">{{ day }}</div>
          </div>

          <div class="mld-date-picker__grid">
            <button
              v-for="(day, index) in calendarDays"
              :key="index"
              type="button"
              :disabled="day.isDisabled"
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
        </div>

        <!-- Divider -->
        <div class="mld-datetime-picker__divider" />

        <!-- Time section -->
        <div class="mld-datetime-picker__time-section">
          <div class="mld-datetime-picker__time-label">Time</div>
          <div class="mld-datetime-picker__time-grid">
            <button
              v-for="time in timeSlots"
              :key="time"
              type="button"
              :disabled="isTimeDisabled(time)"
              :class="[
                'mld-datetime-picker__time-chip',
                selectedTimeStr === time ? 'mld-datetime-picker__time-chip--active' : '',
                isTimeDisabled(time) ? 'mld-datetime-picker__time-chip--disabled' : '',
              ]"
              @click="selectTime(time)"
            >
              {{ timeFormat === '12h' ? formatTime(parseTime(time).hour, parseTime(time).minute, '12h') : time }}
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="mld-datetime-picker__footer">
          <div>
            <button type="button" class="mld-datetime-picker__footer-btn" @click="goToToday">Today</button>
            <button type="button" class="mld-datetime-picker__footer-btn" style="margin-left: 0.75rem" @click="goToNow">Now</button>
          </div>
          <button
            v-if="clearable && modelValue"
            type="button"
            class="mld-datetime-picker__footer-btn mld-datetime-picker__footer-btn--muted"
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
@import '../styles/components/datetime-picker.css';
</style>
