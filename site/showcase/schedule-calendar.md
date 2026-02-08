<script setup>
import ScheduleCalendarDemo from '../.vitepress/showcase/ScheduleCalendarDemo.vue'
</script>

# ScheduleCalendar

A full-featured scheduling calendar supporting day, week, and month views with event display, blocked slots, navigation, and a current-time indicator.

## Demo

<ClientOnly>
  <ScheduleCalendarDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | - | Currently selected date/view reference (v-model) |
| `view` | `'day' \| 'week' \| 'month'` | `'week'` | Calendar view mode |
| `events` | `ScheduleEvent[]` | `[]` | Events to display |
| `dayStartHour` | `number` | `8` | First visible hour of the day |
| `dayEndHour` | `number` | `18` | Last visible hour of the day |
| `slotDuration` | `number` | `30` | Slot duration in minutes |
| `showNowIndicator` | `boolean` | `false` | Show current time indicator |
| `readonly` | `boolean` | `false` | Disable event creation and editing |
| `blockedSlots` | `ScheduleBlockedSlot[]` | `[]` | Blocked/unavailable time ranges |
| `weekStartsOn` | `number` | `1` | First day of the week (0 = Sunday, 1 = Monday) |
| `showViewToggle` | `boolean` | `false` | Show day/week/month toggle |
| `showNavigation` | `boolean` | `false` | Show prev/next navigation buttons |
| `statusColors` | `Record<string, string>` | - | Custom status-to-color mapping |
| `locale` | `string` | `'en-US'` | Locale for date formatting |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | View reference changed |
| `event-click` | `ScheduleEvent` | Event clicked |
| `slot-click` | `{ date: string, time: string }` | Empty time slot clicked |
| `event-drop` | `{ event: ScheduleEvent, start: string, end: string }` | Event dragged to new time |

## Types

```ts
interface ScheduleEvent {
  id: string
  title: string
  start: string       // ISO datetime (YYYY-MM-DDTHH:mm)
  end: string          // ISO datetime (YYYY-MM-DDTHH:mm)
  color?: string
  resource?: string
  status?: string
  description?: string
}

interface ScheduleBlockedSlot {
  start: string        // ISO datetime (YYYY-MM-DDTHH:mm)
  end: string          // ISO datetime (YYYY-MM-DDTHH:mm)
  reason?: string
}
```

## Usage

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ScheduleCalendar } from '@morscherlab/mld-sdk'
import type { ScheduleEvent } from '@morscherlab/mld-sdk'

const events = computed<ScheduleEvent[]>(() => [
  {
    id: '1',
    title: 'LC-MS Run',
    start: '2026-02-09T09:00',
    end: '2026-02-09T12:00',
    color: '#3b82f6',
    resource: 'Orbitrap Q-Exactive HF',
  },
])
</script>

<template>
  <ScheduleCalendar
    view="week"
    :events="events"
    :day-start-hour="7"
    :day-end-hour="18"
    show-now-indicator
    show-navigation
    show-view-toggle
    @event-click="handleEventClick"
    @slot-click="handleSlotClick"
  />
</template>
```
