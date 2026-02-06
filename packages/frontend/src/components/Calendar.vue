<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CalendarSelectionMode, CalendarMarker, CalendarDayContext } from '../types'

/**
 * Calendar - Month calendar with date selection, range selection, and custom markers.
 *
 * @example
 * ```vue
 * <!-- Single date selection -->
 * <Calendar v-model="selectedDate" />
 *
 * <!-- Range selection -->
 * <Calendar v-model="dateRange" selection-mode="range" />
 *
 * <!-- With markers -->
 * <Calendar :markers="[{ date: '2024-01-15', color: '#ff0000', label: 'Event' }]" />
 * ```
 */
interface Props {
  /** Selected date(s) - type depends on selectionMode */
  modelValue?: Date | Date[] | { start: Date; end: Date } | null
  /** Selection behavior mode */
  selectionMode?: CalendarSelectionMode
  /** Display month (0-11) */
  month?: number
  /** Display year */
  year?: number
  /** Always show 6 weeks (42 days) */
  fixedWeeks?: boolean
  /** First day of week (0=Sunday, 1=Monday, etc.) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Show days from adjacent months */
  showOutsideDays?: boolean
  /** Show month navigation buttons */
  showNavigation?: boolean
  /** Visual markers on specific dates */
  markers?: CalendarMarker[]
  /** Earliest selectable date */
  minDate?: Date | string
  /** Latest selectable date */
  maxDate?: Date | string
  /** Explicitly disabled dates */
  disabledDates?: Array<Date | string>
  /** Custom disabled date logic */
  isDateDisabled?: (date: Date) => boolean
  /** Locale for date formatting */
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectionMode: 'single',
  fixedWeeks: true,
  weekStartsOn: 1,
  showOutsideDays: true,
  showNavigation: true,
  markers: () => [],
  disabledDates: () => [],
  locale: 'en-US',
})

/**
 * @event update:modelValue - Emitted when date selection changes (v-model support)
 * @event update:month - Emitted when displayed month changes
 * @event update:year - Emitted when displayed year changes
 * @event day-click - Emitted when a day is clicked, includes day context
 * @event navigate - Emitted when month navigation occurs
 */
const emit = defineEmits<{
  'update:modelValue': [value: Date | Date[] | { start: Date; end: Date } | null]
  'update:month': [month: number]
  'update:year': [year: number]
  'day-click': [context: CalendarDayContext]
  navigate: [direction: 'prev' | 'next', month: number, year: number]
}>()

const today = new Date()
today.setHours(0, 0, 0, 0)

const currentMonth = ref(props.month ?? today.getMonth())
const currentYear = ref(props.year ?? today.getFullYear())

// Range hover tracking
const hoveredDate = ref<Date | null>(null)

watch(() => props.month, (val) => { if (val !== undefined) currentMonth.value = val })
watch(() => props.year, (val) => { if (val !== undefined) currentYear.value = val })

const monthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  return date.toLocaleDateString(props.locale, { month: 'long', year: 'numeric' })
})

const weekDayLabels = computed(() => {
  const labels: string[] = []
  // Use Jan 7, 2024 (Sunday) as reference, then offset by weekStartsOn
  const base = new Date(2024, 0, 7 + props.weekStartsOn)
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    labels.push(d.toLocaleDateString(props.locale, { weekday: 'short' }))
  }
  return labels
})

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDate(val: Date | string): Date {
  if (val instanceof Date) return val
  const d = new Date(val + 'T00:00:00')
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

const disabledDateSet = computed(() => {
  const set = new Set<string>()
  for (const d of props.disabledDates) {
    const parsed = parseDate(d)
    set.add(toDateKey(parsed))
  }
  return set
})

const markerMap = computed(() => {
  const map = new Map<string, CalendarMarker[]>()
  for (const marker of props.markers) {
    const date = parseDate(marker.date)
    const key = toDateKey(date)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(marker)
  }
  return map
})

function isDateSelected(date: Date): boolean {
  const val = props.modelValue
  if (!val) return false
  if (val instanceof Date) return isSameDay(date, val)
  if (Array.isArray(val)) return val.some(d => isSameDay(date, d))
  if ('start' in val && 'end' in val) {
    return isSameDay(date, val.start) || isSameDay(date, val.end)
  }
  return false
}

function isInRange(date: Date): boolean {
  if (props.selectionMode !== 'range') return false
  const val = props.modelValue
  if (!val || !('start' in (val as object))) return false
  const range = val as { start: Date; end: Date }

  const t = date.getTime()
  const start = range.start?.getTime()
  if (!start) return false

  // If hovering during selection (before end is set)
  if (!range.end && hoveredDate.value) {
    const hov = hoveredDate.value.getTime()
    const [lo, hi] = start <= hov ? [start, hov] : [hov, start]
    return t > lo && t < hi
  }

  // Complete range
  if (range.end) {
    const end = range.end.getTime()
    return t > start && t < end
  }

  return false
}

function isDisabled(date: Date): boolean {
  if (disabledDateSet.value.has(toDateKey(date))) return true
  if (props.isDateDisabled?.(date)) return true
  if (props.minDate) {
    const min = parseDate(props.minDate)
    if (date < min) return true
  }
  if (props.maxDate) {
    const max = parseDate(props.maxDate)
    if (date > max) return true
  }
  return false
}

const calendarDays = computed<CalendarDayContext[]>(() => {
  const first = new Date(currentYear.value, currentMonth.value, 1)
  const startDow = first.getDay()
  const offset = (startDow - props.weekStartsOn + 7) % 7

  const totalCells = props.fixedWeeks ? 42 : (() => {
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    const needed = offset + daysInMonth
    return Math.ceil(needed / 7) * 7
  })()

  const days: CalendarDayContext[] = []
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(currentYear.value, currentMonth.value, 1 - offset + i)
    date.setHours(0, 0, 0, 0)
    const key = toDateKey(date)
    days.push({
      date,
      dayOfMonth: date.getDate(),
      isToday: isSameDay(date, today),
      isSelected: isDateSelected(date),
      isInRange: isInRange(date),
      isDisabled: isDisabled(date),
      isOutsideMonth: date.getMonth() !== currentMonth.value,
      markers: markerMap.value.get(key) ?? [],
    })
  }
  return days
})

// Range selection state
const rangeStart = ref<Date | null>(null)

function handleDayClick(day: CalendarDayContext) {
  if (day.isDisabled) return
  if (!props.showOutsideDays && day.isOutsideMonth) return

  emit('day-click', day)

  if (props.selectionMode === 'none') return

  if (props.selectionMode === 'single') {
    emit('update:modelValue', day.date)
  } else if (props.selectionMode === 'multiple') {
    const current = (props.modelValue as Date[] | undefined) ?? []
    const idx = current.findIndex(d => isSameDay(d, day.date))
    if (idx >= 0) {
      const next = [...current]
      next.splice(idx, 1)
      emit('update:modelValue', next)
    } else {
      emit('update:modelValue', [...current, day.date])
    }
  } else if (props.selectionMode === 'range') {
    if (!rangeStart.value) {
      rangeStart.value = day.date
    } else {
      const start = rangeStart.value
      const end = day.date
      rangeStart.value = null
      const ordered = start.getTime() <= end.getTime()
        ? { start, end }
        : { start: end, end: start }
      emit('update:modelValue', ordered)
    }
  }
}

function handleDayHover(day: CalendarDayContext) {
  if (props.selectionMode === 'range' && rangeStart.value) {
    hoveredDate.value = day.date
  }
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
    emit('update:year', currentYear.value)
  } else {
    currentMonth.value--
  }
  emit('update:month', currentMonth.value)
  emit('navigate', 'prev', currentMonth.value, currentYear.value)
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
    emit('update:year', currentYear.value)
  } else {
    currentMonth.value++
  }
  emit('update:month', currentMonth.value)
  emit('navigate', 'next', currentMonth.value, currentYear.value)
}
</script>

<template>
  <div class="mld-calendar">
    <div v-if="showNavigation" class="mld-calendar__header">
      <button type="button" class="mld-calendar__nav-btn" aria-label="Previous month" @click="prevMonth">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <slot name="header" :month="currentMonth" :year="currentYear" :prev-month="prevMonth" :next-month="nextMonth">
        <span class="mld-calendar__title">{{ monthLabel }}</span>
      </slot>
      <button type="button" class="mld-calendar__nav-btn" aria-label="Next month" @click="nextMonth">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="mld-calendar__weekdays">
      <span
        v-for="(label, i) in weekDayLabels"
        :key="i"
        class="mld-calendar__weekday"
      >
        <slot name="week-day" :day-name="label" :index="i">{{ label }}</slot>
      </span>
    </div>

    <div class="mld-calendar__grid">
      <button
        v-for="(day, i) in calendarDays"
        :key="i"
        type="button"
        :disabled="day.isDisabled"
        :class="[
          'mld-calendar__day',
          {
            'mld-calendar__day--today': day.isToday,
            'mld-calendar__day--selected': day.isSelected,
            'mld-calendar__day--in-range': day.isInRange,
            'mld-calendar__day--disabled': day.isDisabled,
            'mld-calendar__day--outside': day.isOutsideMonth,
            'mld-calendar__day--interactive': selectionMode !== 'none' && !day.isDisabled,
          },
        ]"
        @click="handleDayClick(day)"
        @mouseenter="handleDayHover(day)"
      >
        <slot name="day-content" :day="day">
          <span class="mld-calendar__day-number">{{ day.dayOfMonth }}</span>
          <div v-if="day.markers.length > 0" class="mld-calendar__markers">
            <span
              v-for="(marker, mi) in day.markers.slice(0, 3)"
              :key="mi"
              :class="[
                'mld-calendar__marker',
                `mld-calendar__marker--${marker.type ?? 'dot'}`,
              ]"
              :style="marker.color ? { '--marker-color': marker.color } : {}"
              :title="marker.label"
            />
          </div>
        </slot>
      </button>
    </div>
  </div>
</template>

<style>
@import '../styles/components/calendar.css';
</style>
