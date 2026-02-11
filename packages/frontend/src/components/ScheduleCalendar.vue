<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type {
  ScheduleView,
  ScheduleEvent,
  ScheduleBlockedSlot,
  ScheduleEventStatus,
} from '../types/components'
import { formatTime } from '../composables/useTimeUtils'
import { useScheduleDrag } from '../composables/useScheduleDrag'

interface Props {
  modelValue?: Date | string
  view?: ScheduleView
  events?: ScheduleEvent[]
  dayStartHour?: number
  dayEndHour?: number
  slotDuration?: number
  showNowIndicator?: boolean
  readonly?: boolean
  blockedSlots?: ScheduleBlockedSlot[]
  weekStartsOn?: 0 | 1
  showViewToggle?: boolean
  showNavigation?: boolean
  statusColors?: Record<string, string>
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  view: 'week',
  events: () => [],
  dayStartHour: 6,
  dayEndHour: 22,
  slotDuration: 30,
  showNowIndicator: true,
  readonly: false,
  blockedSlots: () => [],
  weekStartsOn: 1,
  showViewToggle: true,
  showNavigation: true,
  locale: 'en-US',
})

const emit = defineEmits<{
  'update:modelValue': [value: Date]
  'update:view': [value: ScheduleView]
  'event-click': [event: ScheduleEvent]
  'event-create': [context: { start: Date; end: Date }]
  'event-update': [context: { event: ScheduleEvent; newStart: Date; newEnd: Date }]
  'slot-click': [context: { date: Date; hour: number; minute: number }]
  'navigate': [context: { direction: string; date: Date }]
}>()

const SLOT_HEIGHT = 40
const currentView = ref<ScheduleView>(props.view)
const currentDate = ref<Date>(parseModelDate(props.modelValue))
const nowTimer = ref<ReturnType<typeof setInterval>>()
const now = ref(new Date())
const bodyRef = ref<HTMLDivElement>()

watch(() => props.view, (v) => { currentView.value = v })
watch(() => props.modelValue, (v) => { if (v) currentDate.value = parseModelDate(v) })

const slotHeightRef = computed(() => SLOT_HEIGHT)
const slotDurationRef = computed(() => props.slotDuration)
const dayStartRef = computed(() => props.dayStartHour)
const dayEndRef = computed(() => props.dayEndHour)
const readonlyRef = computed(() => props.readonly)

const { isDragging, ghost, startCreate, startMove, startResize } = useScheduleDrag({
  slotDuration: slotDurationRef,
  dayStartHour: dayStartRef,
  dayEndHour: dayEndRef,
  readonly: readonlyRef,
  slotHeight: slotHeightRef,
  onCreateComplete(start, end) {
    emit('event-create', { start, end })
  },
  onMoveComplete(event, newStart, newEnd) {
    emit('event-update', { event, newStart, newEnd })
  },
  onResizeComplete(event, newStart, newEnd) {
    emit('event-update', { event, newStart, newEnd })
  },
})

const totalSlots = computed(() => {
  return ((props.dayEndHour - props.dayStartHour) * 60) / props.slotDuration
})

const timeLabels = computed(() => {
  const labels: string[] = []
  for (let i = 0; i <= totalSlots.value; i++) {
    const totalMinutes = props.dayStartHour * 60 + i * props.slotDuration
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    labels.push(formatTime(hour, minute, '24h'))
  }
  return labels
})

const weekDays = computed(() => {
  const days: Date[] = []
  const start = getWeekStart(currentDate.value)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
})

const visibleDays = computed(() => {
  if (currentView.value === 'day') return [currentDate.value]
  if (currentView.value === 'week') return weekDays.value
  return []
})

const headerTitle = computed(() => {
  if (currentView.value === 'day') {
    return currentDate.value.toLocaleDateString(props.locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  if (currentView.value === 'week') {
    const days = weekDays.value
    const first = days[0]
    const last = days[6]
    const sameMonth = first.getMonth() === last.getMonth()
    if (sameMonth) {
      return `${first.toLocaleDateString(props.locale, { month: 'short', day: 'numeric' })} - ${last.getDate()}, ${last.getFullYear()}`
    }
    return `${first.toLocaleDateString(props.locale, { month: 'short', day: 'numeric' })} - ${last.toLocaleDateString(props.locale, { month: 'short', day: 'numeric' })}, ${last.getFullYear()}`
  }
  return currentDate.value.toLocaleDateString(props.locale, { year: 'numeric', month: 'long' })
})

// Month view computations
const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days: { date: Date; isCurrentMonth: boolean }[] = []

  // Adjust for weekStartsOn
  let startPadding = firstDay.getDay() - props.weekStartsOn
  if (startPadding < 0) startPadding += 7

  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({ date, isCurrentMonth: false })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
  }

  return days
})

const monthWeekdayLabels = computed(() => {
  const labels: string[] = []
  const base = new Date(2024, 0, props.weekStartsOn === 1 ? 1 : 7) // A known Monday or Sunday
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    labels.push(d.toLocaleDateString(props.locale, { weekday: 'short' }))
  }
  return labels
})

function parseModelDate(value?: Date | string): Date {
  if (!value) return new Date()
  if (value instanceof Date) return value
  const d = new Date(value)
  return isNaN(d.getTime()) ? new Date() : d
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day - props.weekStartsOn + 7) % 7
  d.setDate(d.getDate() - diff)
  return d
}

function isToday(date: Date): boolean {
  return date.toDateString() === now.value.toDateString()
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

function navigate(direction: 'prev' | 'next' | 'today') {
  const d = new Date(currentDate.value)
  if (direction === 'today') {
    currentDate.value = new Date()
  } else {
    const delta = direction === 'prev' ? -1 : 1
    if (currentView.value === 'day') d.setDate(d.getDate() + delta)
    else if (currentView.value === 'week') d.setDate(d.getDate() + delta * 7)
    else d.setMonth(d.getMonth() + delta)
    currentDate.value = d
  }
  emit('update:modelValue', currentDate.value)
  emit('navigate', { direction, date: currentDate.value })
}

function setView(view: ScheduleView) {
  currentView.value = view
  emit('update:view', view)
}

function getEventStyle(event: ScheduleEvent, dayDate: Date) {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  if (!isSameDay(eventStart, dayDate) && !isSameDay(eventEnd, dayDate)) return null

  const dayStartMin = props.dayStartHour * 60
  const startMin = Math.max(eventStart.getHours() * 60 + eventStart.getMinutes(), dayStartMin) - dayStartMin
  const endMin = Math.min(eventEnd.getHours() * 60 + eventEnd.getMinutes(), props.dayEndHour * 60) - dayStartMin

  const pixelsPerMin = SLOT_HEIGHT / props.slotDuration
  return {
    top: `${startMin * pixelsPerMin}px`,
    height: `${Math.max((endMin - startMin) * pixelsPerMin, SLOT_HEIGHT / 2)}px`,
  }
}

function getEventsForDay(day: Date): ScheduleEvent[] {
  return props.events.filter((e) => {
    const start = new Date(e.start)
    return isSameDay(start, day)
  })
}

function getEventsForDate(date: Date): ScheduleEvent[] {
  return props.events.filter((e) => {
    const start = new Date(e.start)
    return isSameDay(start, date)
  })
}

function getBlockedForDay(day: Date): ScheduleBlockedSlot[] {
  return props.blockedSlots.filter((b) => {
    const start = new Date(b.start)
    return isSameDay(start, day)
  })
}

function getBlockedStyle(slot: ScheduleBlockedSlot) {
  const start = new Date(slot.start)
  const end = new Date(slot.end)
  const dayStartMin = props.dayStartHour * 60
  const startMin = Math.max(start.getHours() * 60 + start.getMinutes(), dayStartMin) - dayStartMin
  const endMin = Math.min(end.getHours() * 60 + end.getMinutes(), props.dayEndHour * 60) - dayStartMin

  const pixelsPerMin = SLOT_HEIGHT / props.slotDuration
  return {
    top: `${startMin * pixelsPerMin}px`,
    height: `${(endMin - startMin) * pixelsPerMin}px`,
  }
}

function getNowIndicatorStyle(): Record<string, string> | null {
  if (!props.showNowIndicator) return null
  const nowMin = now.value.getHours() * 60 + now.value.getMinutes()
  const dayStartMin = props.dayStartHour * 60
  const dayEndMin = props.dayEndHour * 60
  if (nowMin < dayStartMin || nowMin > dayEndMin) return null

  const pixelsPerMin = SLOT_HEIGHT / props.slotDuration
  return { top: `${(nowMin - dayStartMin) * pixelsPerMin}px` }
}

function getStatusClass(status?: ScheduleEventStatus): string {
  if (!status) return 'mld-schedule__event--confirmed'
  return `mld-schedule__event--${status}`
}

function getMonthStatusClass(status?: ScheduleEventStatus): string {
  if (!status) return 'mld-schedule__month-event--confirmed'
  return `mld-schedule__month-event--${status}`
}

function onEventClick(event: ScheduleEvent, e: MouseEvent) {
  e.stopPropagation()
  emit('event-click', event)
}

function onSlotClick(day: Date, slotIndex: number) {
  if (props.readonly || isDragging.value) return
  const totalMinutes = props.dayStartHour * 60 + slotIndex * props.slotDuration
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  const date = new Date(day)
  date.setHours(hour, minute, 0, 0)
  emit('slot-click', { date, hour, minute })
}

function onSlotPointerDown(day: Date, slotIndex: number, e: PointerEvent) {
  if (props.readonly) return
  const date = new Date(day)
  const totalMinutes = props.dayStartHour * 60 + slotIndex * props.slotDuration
  date.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0)
  const dayIndex = visibleDays.value.findIndex((d) => isSameDay(d, day))
  startCreate(date, e.clientY, dayIndex)
}

function onEventPointerDown(event: ScheduleEvent, dayIndex: number, e: PointerEvent) {
  e.stopPropagation()
  startMove(event, e.clientY, dayIndex)
}

function onResizePointerDown(event: ScheduleEvent, edge: 'top' | 'bottom', dayIndex: number, e: PointerEvent) {
  e.stopPropagation()
  startResize(event, edge, e.clientY, dayIndex)
}

function onMonthDayClick(date: Date) {
  currentDate.value = date
  emit('update:modelValue', date)
  setView('day')
}

function formatEventTime(event: ScheduleEvent): string {
  const start = new Date(event.start)
  const end = new Date(event.end)
  return `${formatTime(start.getHours(), start.getMinutes())} - ${formatTime(end.getHours(), end.getMinutes())}`
}

onMounted(() => {
  nowTimer.value = setInterval(() => { now.value = new Date() }, 60000)

  // Scroll to current time or 8am
  if (bodyRef.value) {
    const targetHour = now.value.getHours() >= props.dayStartHour && now.value.getHours() <= props.dayEndHour
      ? now.value.getHours()
      : 8
    const offsetMin = (targetHour - props.dayStartHour) * 60
    const pixelsPerMin = SLOT_HEIGHT / props.slotDuration
    bodyRef.value.scrollTop = Math.max(0, offsetMin * pixelsPerMin - 100)
  }
})

onUnmounted(() => {
  if (nowTimer.value) clearInterval(nowTimer.value)
})
</script>

<template>
  <div class="mld-schedule" :style="{ '--slot-height': `${SLOT_HEIGHT}px` } as any">
    <!-- Header -->
    <div v-if="showNavigation || showViewToggle" class="mld-schedule__header">
      <div v-if="showNavigation" class="mld-schedule__nav">
        <button
          type="button"
          class="mld-schedule__nav-btn"
          aria-label="Previous"
          @click="navigate('prev')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          class="mld-schedule__nav-btn"
          aria-label="Next"
          @click="navigate('next')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <button
          type="button"
          class="mld-schedule__today-btn"
          @click="navigate('today')"
        >
          Today
        </button>
      </div>

      <span class="mld-schedule__title">{{ headerTitle }}</span>

      <div v-if="showViewToggle" class="mld-schedule__view-toggle">
        <button
          v-for="v in (['day', 'week', 'month'] as ScheduleView[])"
          :key="v"
          type="button"
          :class="['mld-schedule__view-btn', currentView === v ? 'mld-schedule__view-btn--active' : '']"
          @click="setView(v)"
        >
          {{ v.charAt(0).toUpperCase() + v.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Day / Week View -->
    <template v-if="currentView === 'day' || currentView === 'week'">
      <!-- Day headers -->
      <div v-if="currentView === 'week'" class="mld-schedule__day-headers">
        <div class="mld-schedule__day-header-gutter" />
        <div
          v-for="(day, i) in visibleDays"
          :key="i"
          :class="['mld-schedule__day-header', isToday(day) ? 'mld-schedule__day-header--today' : '']"
        >
          <slot name="day-header" :date="day" :isToday="isToday(day)">
            <span class="mld-schedule__day-header-name">
              {{ day.toLocaleDateString(locale, { weekday: 'short' }) }}
            </span>
            <span class="mld-schedule__day-header-number">
              {{ day.getDate() }}
            </span>
          </slot>
        </div>
      </div>

      <!-- Time grid body -->
      <div ref="bodyRef" class="mld-schedule__body">
        <!-- Time gutter -->
        <div class="mld-schedule__time-gutter">
          <div
            v-for="(label, i) in timeLabels"
            :key="i"
            class="mld-schedule__time-label"
          >
            <slot name="time-label" :label="label" :index="i">
              {{ i < timeLabels.length - 1 ? label : '' }}
            </slot>
          </div>
        </div>

        <!-- Day columns -->
        <div class="mld-schedule__day-columns">
          <div
            v-for="(day, dayIdx) in visibleDays"
            :key="dayIdx"
            :class="['mld-schedule__day-column', isToday(day) ? 'mld-schedule__day-column--today' : '']"
          >
            <!-- Slot grid -->
            <div
              v-for="slotIdx in totalSlots"
              :key="slotIdx"
              :class="['mld-schedule__slot', !readonly ? 'mld-schedule__slot--interactive' : '']"
              @click="onSlotClick(day, slotIdx - 1)"
              @pointerdown="onSlotPointerDown(day, slotIdx - 1, $event)"
            />

            <!-- Events -->
            <div
              v-for="event in getEventsForDay(day)"
              :key="event.id"
              :class="['mld-schedule__event', getStatusClass(event.status)]"
              :style="getEventStyle(event, day) || undefined"
              @click="onEventClick(event, $event)"
              @pointerdown="onEventPointerDown(event, dayIdx, $event)"
            >
              <slot name="event" :event="event">
                <div
                  v-if="!readonly && event.resizable !== false"
                  class="mld-schedule__event-resize-handle mld-schedule__event-resize-handle--top"
                  @pointerdown="onResizePointerDown(event, 'top', dayIdx, $event)"
                />
                <div class="mld-schedule__event-title">{{ event.title }}</div>
                <div class="mld-schedule__event-time">{{ formatEventTime(event) }}</div>
                <div
                  v-if="!readonly && event.resizable !== false"
                  class="mld-schedule__event-resize-handle mld-schedule__event-resize-handle--bottom"
                  @pointerdown="onResizePointerDown(event, 'bottom', dayIdx, $event)"
                />
              </slot>
            </div>

            <!-- Blocked slots -->
            <div
              v-for="(blocked, bIdx) in getBlockedForDay(day)"
              :key="`b-${bIdx}`"
              class="mld-schedule__blocked"
              :style="getBlockedStyle(blocked)"
            >
              <span v-if="blocked.label" class="mld-schedule__blocked-label">
                {{ blocked.label }}
              </span>
            </div>

            <!-- Now indicator -->
            <div
              v-if="showNowIndicator && isToday(day) && getNowIndicatorStyle()"
              class="mld-schedule__now-indicator"
              :style="getNowIndicatorStyle()!"
            >
              <div class="mld-schedule__now-dot" />
            </div>

            <!-- Drag ghost -->
            <div
              v-if="isDragging && ghost && ghost.dayIndex === dayIdx"
              class="mld-schedule__ghost"
              :style="ghost.style"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Month View -->
    <template v-if="currentView === 'month'">
      <div class="mld-schedule__month-grid">
        <!-- Weekday headers -->
        <div
          v-for="label in monthWeekdayLabels"
          :key="label"
          class="mld-schedule__month-weekday"
        >
          {{ label }}
        </div>

        <!-- Day cells -->
        <div
          v-for="(day, i) in monthDays"
          :key="i"
          :class="[
            'mld-schedule__month-cell',
            isToday(day.date) ? 'mld-schedule__month-cell--today' : '',
            !day.isCurrentMonth ? 'mld-schedule__month-cell--outside' : '',
          ]"
          @click="onMonthDayClick(day.date)"
        >
          <slot name="month-day" :date="day.date" :isToday="isToday(day.date)" :events="getEventsForDate(day.date)">
            <div class="mld-schedule__month-date">{{ day.date.getDate() }}</div>
            <div
              v-for="event in getEventsForDate(day.date).slice(0, 3)"
              :key="event.id"
              :class="['mld-schedule__month-event', getMonthStatusClass(event.status)]"
              @click.stop="onEventClick(event, $event)"
            >
              {{ event.title }}
            </div>
            <div
              v-if="getEventsForDate(day.date).length > 3"
              class="mld-schedule__month-more"
            >
              +{{ getEventsForDate(day.date).length - 3 }} more
            </div>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
@import '../styles/components/schedule-calendar.css';
</style>
