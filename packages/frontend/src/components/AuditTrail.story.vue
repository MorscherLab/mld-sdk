<script setup lang="ts">
import AuditTrail from './AuditTrail.vue'

const now = new Date()

function minutesAgo(mins: number): Date {
  return new Date(now.getTime() - mins * 60 * 1000)
}

function hoursAgo(hrs: number): Date {
  return new Date(now.getTime() - hrs * 60 * 60 * 1000)
}

function daysAgo(days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

const mockEntries = [
  {
    id: 'e1',
    type: 'create' as const,
    action: 'Created experiment "Cisplatin Dose Response"',
    detail: 'Initial setup with 96-well plate format, 8 concentration points.',
    user: 'Elena Morscher',
    timestamp: minutesAgo(5),
    metadata: { 'Plate format': '96-well', 'Compounds': '1' },
  },
  {
    id: 'e2',
    type: 'update' as const,
    action: 'Updated sample assignments',
    detail: 'Assigned HeLa cells to wells A1-A12 and MCF-7 to wells B1-B12.',
    user: 'Elena Morscher',
    timestamp: minutesAgo(45),
  },
  {
    id: 'e3',
    type: 'update' as const,
    action: 'Modified protocol step "Incubation"',
    detail: 'Changed incubation time from 24h to 48h.',
    user: 'Thomas Weber',
    timestamp: hoursAgo(2),
    metadata: { 'Previous': '24h', 'New': '48h' },
  },
  {
    id: 'e4',
    type: 'system' as const,
    action: 'Plate reader measurement completed',
    detail: 'Luminescence readout finished for plate 1. 96/96 wells measured successfully.',
    user: undefined,
    timestamp: hoursAgo(6),
  },
  {
    id: 'e5',
    type: 'delete' as const,
    action: 'Removed blank wells from analysis',
    detail: 'Wells H1-H12 excluded from dose-response curve fitting.',
    user: 'Elena Morscher',
    timestamp: daysAgo(1),
  },
  {
    id: 'e6',
    type: 'create' as const,
    action: 'Generated analysis report',
    detail: 'IC50 curve fitting completed. Report exported as PDF.',
    user: 'Thomas Weber',
    timestamp: daysAgo(2),
    metadata: { 'IC50': '3.2 uM', 'R-squared': '0.98' },
  },
  {
    id: 'e7',
    type: 'system' as const,
    action: 'Experiment status changed to "Completed"',
    user: undefined,
    timestamp: daysAgo(3),
  },
]

function initState() {
  return {
    entries: mockEntries,
    showFilters: false,
    emptyMessage: 'No activity yet',
    order: 'newest' as const,
    size: 'md' as const,
  }
}
</script>

<template>
  <Story title="Workflow/AuditTrail">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 600px;">
          <AuditTrail
            :entries="state.entries"
            :show-filters="state.showFilters"
            :empty-message="state.emptyMessage"
            :order="state.order"
            :size="state.size"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.showFilters" title="Show Filters" />
        <HstText v-model="state.emptyMessage" title="Empty Message" />
        <HstSelect
          v-model="state.order"
          title="Order"
          :options="[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
          ]"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
      </template>
    </Variant>

    <Variant title="With Filters">
      <div style="padding: 2rem; max-width: 600px;">
        <AuditTrail
          :entries="mockEntries"
          show-filters
        />
      </div>
    </Variant>

    <Variant title="With Max Height">
      <div style="padding: 2rem; max-width: 600px;">
        <AuditTrail
          :entries="mockEntries"
          max-height="300px"
        />
      </div>
    </Variant>

    <Variant title="Oldest First">
      <div style="padding: 2rem; max-width: 600px;">
        <AuditTrail
          :entries="mockEntries"
          order="oldest"
        />
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="padding: 2rem; max-width: 600px;">
        <AuditTrail
          :entries="[]"
          empty-message="No audit events recorded"
        />
      </div>
    </Variant>
  </Story>
</template>
