<script setup lang="ts">
import { ref, computed } from 'vue'
import { ScheduleCalendar } from '@morscherlab/mld-sdk'
import type { ScheduleEvent, ScheduleBlockedSlot } from '@morscherlab/mld-sdk'

const weekView = ref('week')
const dayView = ref('day')
const monthView = ref('month')

const today = new Date()
const monday = new Date(today)
monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

function makeDateTime(dayOffset: number, hour: number, minute: number = 0): string {
  const d = new Date(monday)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString().slice(0, 16)
}

const weekEvents = computed<ScheduleEvent[]>(() => [
  {
    id: '1',
    title: 'LC-MS Run: Proteomics Batch A',
    start: makeDateTime(0, 9, 0),
    end: makeDateTime(0, 12, 0),
    color: '#3b82f6',
    resource: 'Orbitrap Q-Exactive HF',
  },
  {
    id: '2',
    title: 'Calibration',
    start: makeDateTime(0, 13, 0),
    end: makeDateTime(0, 14, 30),
    color: '#f59e0b',
    resource: 'Orbitrap Q-Exactive HF',
  },
  {
    id: '3',
    title: 'Metabolomics Screen',
    start: makeDateTime(1, 8, 0),
    end: makeDateTime(1, 16, 0),
    color: '#22c55e',
    resource: 'Agilent 6545 Q-TOF',
  },
  {
    id: '4',
    title: 'Targeted Quantitation',
    start: makeDateTime(2, 10, 0),
    end: makeDateTime(2, 13, 0),
    color: '#8b5cf6',
    resource: 'Thermo TSQ Quantis',
  },
  {
    id: '5',
    title: 'Sample Prep QC',
    start: makeDateTime(3, 9, 0),
    end: makeDateTime(3, 11, 0),
    color: '#ec4899',
    resource: 'Orbitrap Q-Exactive HF',
  },
  {
    id: '6',
    title: 'Lipid Profiling',
    start: makeDateTime(3, 14, 0),
    end: makeDateTime(3, 17, 0),
    color: '#14b8a6',
    resource: 'Agilent 6545 Q-TOF',
  },
  {
    id: '7',
    title: 'Pharmacokinetics Run',
    start: makeDateTime(4, 8, 0),
    end: makeDateTime(4, 15, 0),
    color: '#f97316',
    resource: 'Thermo TSQ Quantis',
  },
])

const dayEvents = computed<ScheduleEvent[]>(() => [
  {
    id: 'd1',
    title: 'LC-MS Run: Batch C',
    start: makeDateTime(0, 8, 0),
    end: makeDateTime(0, 11, 30),
    color: '#3b82f6',
    resource: 'Orbitrap Q-Exactive HF',
  },
  {
    id: 'd2',
    title: 'Column Conditioning',
    start: makeDateTime(0, 12, 0),
    end: makeDateTime(0, 13, 0),
    color: '#f59e0b',
    resource: 'Orbitrap Q-Exactive HF',
  },
  {
    id: 'd3',
    title: 'Metabolite ID',
    start: makeDateTime(0, 14, 0),
    end: makeDateTime(0, 17, 0),
    color: '#22c55e',
    resource: 'Agilent 6545 Q-TOF',
  },
])

const monthEvents = computed<ScheduleEvent[]>(() => [
  {
    id: 'm1',
    title: 'Proteomics Batch',
    start: makeDateTime(0, 9, 0),
    end: makeDateTime(0, 17, 0),
    color: '#3b82f6',
  },
  {
    id: 'm2',
    title: 'Instrument Maintenance',
    start: makeDateTime(2, 8, 0),
    end: makeDateTime(2, 12, 0),
    color: '#f59e0b',
  },
  {
    id: 'm3',
    title: 'Lipidomics Study',
    start: makeDateTime(4, 9, 0),
    end: makeDateTime(4, 16, 0),
    color: '#22c55e',
  },
])

const blockedSlots = computed<ScheduleBlockedSlot[]>(() => [
  {
    start: makeDateTime(1, 12, 0),
    end: makeDateTime(1, 14, 0),
    reason: 'Scheduled maintenance',
  },
  {
    start: makeDateTime(3, 8, 0),
    end: makeDateTime(3, 10, 0),
    reason: 'System update',
  },
])
</script>

<template>
  <DemoSection title="Week View">
    <ScheduleCalendar
      v-model="weekView"
      view="week"
      :events="weekEvents"
      :day-start-hour="7"
      :day-end-hour="18"
      :slot-duration="30"
      show-now-indicator
      show-view-toggle
      show-navigation
    />
  </DemoSection>

  <DemoSection title="Day View">
    <ScheduleCalendar
      v-model="dayView"
      view="day"
      :events="dayEvents"
      :day-start-hour="7"
      :day-end-hour="18"
      :slot-duration="30"
      show-now-indicator
      show-navigation
    />
  </DemoSection>

  <DemoSection title="Month View">
    <ScheduleCalendar
      v-model="monthView"
      view="month"
      :events="monthEvents"
      show-view-toggle
      show-navigation
    />
  </DemoSection>

  <DemoSection title="Read-only">
    <ScheduleCalendar
      view="week"
      :events="weekEvents"
      :day-start-hour="7"
      :day-end-hour="18"
      readonly
      show-navigation
    />
  </DemoSection>

  <DemoSection title="With Blocked Slots">
    <ScheduleCalendar
      view="week"
      :events="weekEvents"
      :blocked-slots="blockedSlots"
      :day-start-hour="7"
      :day-end-hour="18"
      show-now-indicator
      show-navigation
    />
  </DemoSection>
</template>
