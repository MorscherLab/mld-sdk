<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const selectedDate = ref<string>()
const eventDate = ref<string>('2024-12-25')
const rangeDate = ref<string>()

const today = new Date()
const minDate = today.toISOString().split('T')[0]
const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString().split('T')[0]
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="max-w-xs space-y-2">
      <DatePicker v-model="selectedDate" placeholder="Select a date" />
      <p class="text-sm text-text-secondary">Selected: {{ selectedDate || '(none)' }}</p>
    </div>
  </DemoSection>

  <!-- With Initial Value -->
  <DemoSection title="With Initial Value">
    <div class="max-w-xs space-y-2">
      <DatePicker v-model="eventDate" />
      <p class="text-sm text-text-secondary">Event date: {{ eventDate }}</p>
    </div>
  </DemoSection>

  <!-- Date Range Constraints -->
  <DemoSection title="Date Range Constraints">
    <div class="max-w-xs space-y-2">
      <DatePicker
        v-model="rangeDate"
        :min="minDate"
        :max="maxDate"
        placeholder="Select date (next 3 months)"
      />
      <p class="text-xs text-text-muted">
        Dates outside {{ minDate }} to {{ maxDate }} are disabled
      </p>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4 max-w-xs">
      <div v-for="size in sizes" :key="size" class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <DatePicker :size="size" :placeholder="`Size ${size}`" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4 max-w-xs">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Error</label>
        <DatePicker error placeholder="Invalid date" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <DatePicker disabled placeholder="Disabled" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Not Clearable</label>
        <DatePicker model-value="2024-06-15" :clearable="false" />
      </div>
    </div>
  </DemoSection>
</template>
