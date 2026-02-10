<script setup lang="ts">
import { ref } from 'vue'
import Calendar from './Calendar.vue'
import type { CalendarSelectionMode } from '../types'

const selectionModes: CalendarSelectionMode[] = ['none', 'single', 'range', 'multiple']

const selectedDate = ref<Date | null>(null)
const selectedDates = ref<Date[]>([])
const dateRange = ref<{ start: Date; end: Date } | null>(null)

const markers = [
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 5), color: '#3B82F6', label: 'Experiment start', type: 'dot' as const },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 10), color: '#10B981', label: 'QC review', type: 'dot' as const },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), color: '#F97316', label: 'Plate reading', type: 'dot' as const },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 20), color: '#EC4899', label: 'Analysis due', type: 'dot' as const },
  { date: new Date(new Date().getFullYear(), new Date().getMonth(), 25), color: '#8B5CF6', label: 'Report submission', type: 'bar' as const },
]
</script>

<template>
  <Story title="Data Display/Calendar">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; justify-content: center;">
          <Calendar
            v-model="selectedDate"
            :selection-mode="state.selectionMode"
            :show-navigation="state.showNavigation"
            :show-outside-days="state.showOutsideDays"
            :fixed-weeks="state.fixedWeeks"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.selectionMode"
          title="Selection Mode"
          :options="selectionModes.map(m => ({ label: m, value: m }))"
        />
        <HstCheckbox v-model="state.showNavigation" title="Show Navigation" />
        <HstCheckbox v-model="state.showOutsideDays" title="Show Outside Days" />
        <HstCheckbox v-model="state.fixedWeeks" title="Fixed Weeks (6 rows)" />
      </template>
    </Variant>

    <Variant title="Single Selection">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <Calendar v-model="selectedDate" selection-mode="single" />
        <p style="font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Selected: {{ selectedDate ? selectedDate.toLocaleDateString() : 'none' }}
        </p>
      </div>
    </Variant>

    <Variant title="Multiple Selection">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <Calendar v-model="selectedDates" selection-mode="multiple" />
        <p style="font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Selected {{ selectedDates.length }} date(s)
        </p>
      </div>
    </Variant>

    <Variant title="Range Selection">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <Calendar v-model="dateRange" selection-mode="range" />
        <p style="font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          {{ dateRange ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}` : 'Click two dates to select a range' }}
        </p>
      </div>
    </Variant>

    <Variant title="With Markers">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <Calendar :markers="markers" selection-mode="single" />
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.8125rem; color: var(--text-primary, #1e293b);">
          <span v-for="marker in markers" :key="marker.label" style="display: flex; align-items: center; gap: 0.375rem;">
            <span :style="{ width: '8px', height: '8px', borderRadius: '50%', background: marker.color }" />
            {{ marker.label }}
          </span>
        </div>
      </div>
    </Variant>

    <Variant title="With Min/Max Date">
      <div style="padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <Calendar
          selection-mode="single"
          :min-date="new Date(new Date().getFullYear(), new Date().getMonth(), 5)"
          :max-date="new Date(new Date().getFullYear(), new Date().getMonth(), 25)"
        />
        <p style="font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Only dates between the 5th and 25th of this month are selectable
        </p>
      </div>
    </Variant>

    <Variant title="Week Starts on Sunday">
      <div style="padding: 2rem; display: flex; justify-content: center;">
        <Calendar selection-mode="single" :week-starts-on="0" />
      </div>
    </Variant>
  </Story>
</template>
