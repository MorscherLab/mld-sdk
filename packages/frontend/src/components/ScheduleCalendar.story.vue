<script setup lang="ts">
import ScheduleCalendar from './ScheduleCalendar.vue'
import type { ScheduleEvent, ScheduleBlockedSlot } from '../types/components'

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()
const day = today.getDate()

function makeDate(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date(year, month, day + dayOffset, hour, minute)
  return d.toISOString()
}

const mockEvents: ScheduleEvent[] = [
  {
    id: 'ev-1',
    title: 'Plate Reader - Cisplatin DR',
    start: makeDate(0, 9, 0),
    end: makeDate(0, 10, 30),
    status: 'confirmed',
    color: '#3B82F6',
  },
  {
    id: 'ev-2',
    title: 'Flow Cytometry - Apoptosis',
    start: makeDate(0, 13, 0),
    end: makeDate(0, 15, 0),
    status: 'in-progress',
    color: '#10B981',
  },
  {
    id: 'ev-3',
    title: 'Microscopy - Cell Morphology',
    start: makeDate(1, 10, 0),
    end: makeDate(1, 12, 0),
    status: 'pending',
    color: '#F59E0B',
  },
  {
    id: 'ev-4',
    title: 'qPCR Run',
    start: makeDate(1, 14, 0),
    end: makeDate(1, 16, 30),
    status: 'confirmed',
    color: '#8B5CF6',
  },
  {
    id: 'ev-5',
    title: 'Western Blot - Transfer',
    start: makeDate(2, 8, 0),
    end: makeDate(2, 9, 0),
    status: 'confirmed',
    color: '#EF4444',
  },
  {
    id: 'ev-6',
    title: 'Lab Meeting',
    start: makeDate(3, 11, 0),
    end: makeDate(3, 12, 0),
    status: 'confirmed',
    color: '#6B7280',
  },
  {
    id: 'ev-7',
    title: 'Instrument Calibration',
    start: makeDate(-1, 9, 0),
    end: makeDate(-1, 10, 0),
    status: 'cancelled',
    color: '#EF4444',
  },
]

const mockBlockedSlots: ScheduleBlockedSlot[] = [
  {
    start: makeDate(0, 12, 0),
    end: makeDate(0, 13, 0),
    label: 'Lunch',
  },
  {
    start: makeDate(2, 12, 0),
    end: makeDate(2, 13, 0),
    label: 'Maintenance',
  },
]

function initState() {
  return {
    modelValue: today,
    view: 'week' as const,
    events: mockEvents,
    dayStartHour: 6,
    dayEndHour: 22,
    slotDuration: 30,
    showNowIndicator: true,
    readonly: false,
    showViewToggle: true,
    showNavigation: true,
  }
}
</script>

<template>
  <Story title="Scheduling/ScheduleCalendar">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 1rem; height: 700px;">
          <ScheduleCalendar
            v-model="state.modelValue"
            :view="state.view"
            :events="state.events"
            :day-start-hour="state.dayStartHour"
            :day-end-hour="state.dayEndHour"
            :slot-duration="state.slotDuration"
            :show-now-indicator="state.showNowIndicator"
            :readonly="state.readonly"
            :blocked-slots="mockBlockedSlots"
            :show-view-toggle="state.showViewToggle"
            :show-navigation="state.showNavigation"
            @event-click="(ev) => console.log('Event clicked:', ev.title)"
            @slot-click="(ctx) => console.log('Slot clicked:', ctx)"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstSelect
          v-model="state.view"
          title="View"
          :options="[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]"
        />
        <HstSlider v-model="state.dayStartHour" title="Day Start Hour" :min="0" :max="12" />
        <HstSlider v-model="state.dayEndHour" title="Day End Hour" :min="12" :max="24" />
        <HstSelect
          v-model="state.slotDuration"
          title="Slot Duration"
          :options="[
            { value: 15, label: '15 min' },
            { value: 30, label: '30 min' },
            { value: 60, label: '60 min' },
          ]"
        />
        <HstCheckbox v-model="state.showNowIndicator" title="Show Now Indicator" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.showViewToggle" title="Show View Toggle" />
        <HstCheckbox v-model="state.showNavigation" title="Show Navigation" />
      </template>
    </Variant>

    <Variant title="Day View">
      <div style="padding: 1rem; height: 600px;">
        <ScheduleCalendar
          :model-value="today"
          view="day"
          :events="mockEvents"
          :blocked-slots="mockBlockedSlots"
        />
      </div>
    </Variant>

    <Variant title="Month View">
      <div style="padding: 1rem; height: 600px;">
        <ScheduleCalendar
          :model-value="today"
          view="month"
          :events="mockEvents"
        />
      </div>
    </Variant>

    <Variant title="Readonly">
      <div style="padding: 1rem; height: 600px;">
        <ScheduleCalendar
          :model-value="today"
          view="week"
          :events="mockEvents"
          readonly
        />
      </div>
    </Variant>

    <Variant title="Empty Calendar">
      <div style="padding: 1rem; height: 600px;">
        <ScheduleCalendar
          :model-value="today"
          view="week"
          :events="[]"
        />
      </div>
    </Variant>
  </Story>
</template>
