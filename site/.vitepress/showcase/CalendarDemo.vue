<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, type CalendarMarker } from '@morscherlab/mld-sdk'
import { DemoSection } from '../components'

const singleDate = ref<Date | null>(null)
const rangeValue = ref<{ start: Date; end: Date } | null>(null)
const multipleDates = ref<Date[]>([])

const markers: CalendarMarker[] = [
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 5), color: '#22c55e', label: 'Experiment Start', type: 'dot' },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), color: '#3b82f6', label: 'Data Collection', type: 'dot' },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 12), color: '#f59e0b', label: 'Review', type: 'dot' },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 20), color: '#ef4444', label: 'Deadline', type: 'bar' },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 25), color: '#8b5cf6', label: 'Conference', type: 'highlight' },
]

const minDate = new Date()
minDate.setDate(minDate.getDate() - 7)
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 30)

function formatDate(d: Date | null): string {
  if (!d) return 'none'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <DemoSection title="Single Selection" description="Click a date to select it">
    <div class="flex flex-wrap gap-6 items-start">
      <Calendar v-model="singleDate" />
      <div class="text-sm opacity-60">Selected: {{ formatDate(singleDate as Date | null) }}</div>
    </div>
  </DemoSection>

  <DemoSection title="Range Selection" description="Click two dates to select a range">
    <div class="flex flex-wrap gap-6 items-start">
      <Calendar v-model="rangeValue" selection-mode="range" />
      <div class="text-sm opacity-60">
        <template v-if="rangeValue">
          {{ formatDate(rangeValue.start) }} &ndash; {{ formatDate(rangeValue.end) }}
        </template>
        <template v-else>No range selected</template>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="Multiple Selection" description="Click dates to toggle selection">
    <div class="flex flex-wrap gap-6 items-start">
      <Calendar v-model="multipleDates" selection-mode="multiple" />
      <div class="text-sm opacity-60">
        {{ multipleDates.length }} date(s) selected
      </div>
    </div>
  </DemoSection>

  <DemoSection title="With Markers" description="Dates can display colored indicators">
    <Calendar :markers="markers" selection-mode="none" />
  </DemoSection>

  <DemoSection title="Min/Max Date Constraints" description="Only dates within the past 7 days to 30 days ahead are selectable">
    <Calendar
      v-model="singleDate"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </DemoSection>

  <DemoSection title="Week Starts on Sunday">
    <Calendar selection-mode="none" :week-starts-on="0" />
  </DemoSection>
</template>
