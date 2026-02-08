<script setup lang="ts">
import { ref } from 'vue'
import { TimeRangeInput } from '@morscherlab/mld-sdk'
import type { TimeRange } from '@morscherlab/mld-sdk'

const basicRange = ref<TimeRange>({ start: '09:00', end: '12:30' })
const noDurationRange = ref<TimeRange>({ start: '14:00', end: '16:00' })
const constrainedRange = ref<TimeRange>({ start: '10:00', end: '15:00' })
const smRange = ref<TimeRange>({ start: '08:00', end: '09:00' })
const mdRange = ref<TimeRange>({ start: '08:00', end: '09:00' })
const lgRange = ref<TimeRange>({ start: '08:00', end: '09:00' })
const errorRange = ref<TimeRange>({ start: '', end: '' })
const disabledRange = ref<TimeRange>({ start: '10:00', end: '11:30' })
</script>

<template>
  <DemoSection title="Basic Usage">
    <div class="flex flex-col gap-2">
      <TimeRangeInput v-model="basicRange" />
      <span class="text-sm text-text-secondary">
        Selected: {{ basicRange.start }} - {{ basicRange.end }}
      </span>
    </div>
  </DemoSection>

  <DemoSection title="Hidden Duration">
    <TimeRangeInput v-model="noDurationRange" :show-duration="false" />
  </DemoSection>

  <DemoSection title="Constrained Range">
    <div class="flex flex-col gap-2">
      <TimeRangeInput
        v-model="constrainedRange"
        min="08:00"
        max="18:00"
        :step="30"
      />
      <span class="text-xs text-text-secondary">Limited to 08:00 - 18:00, 30 minute steps</span>
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="flex items-end gap-4">
      <div class="text-center">
        <TimeRangeInput v-model="smRange" size="sm" />
        <p class="text-xs text-text-secondary mt-2">sm</p>
      </div>
      <div class="text-center">
        <TimeRangeInput v-model="mdRange" size="md" />
        <p class="text-xs text-text-secondary mt-2">md</p>
      </div>
      <div class="text-center">
        <TimeRangeInput v-model="lgRange" size="lg" />
        <p class="text-xs text-text-secondary mt-2">lg</p>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="States">
    <div class="flex flex-wrap gap-4">
      <div>
        <label class="text-xs text-text-secondary block mb-1">Error</label>
        <TimeRangeInput v-model="errorRange" error="Time range is required" />
      </div>
      <div>
        <label class="text-xs text-text-secondary block mb-1">Disabled</label>
        <TimeRangeInput v-model="disabledRange" disabled />
      </div>
    </div>
  </DemoSection>
</template>
