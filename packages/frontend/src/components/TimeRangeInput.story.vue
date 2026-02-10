<script setup lang="ts">
import TimeRangeInput from './TimeRangeInput.vue'
import type { TimeRange } from '../types/components'

function initState() {
  return {
    modelValue: { start: '09:00', end: '17:00' } as TimeRange | undefined,
    disabled: false,
    error: false,
    size: 'md' as const,
    step: 15,
    format: '24h' as const,
    showDuration: true,
  }
}
</script>

<template>
  <Story title="Scheduling/TimeRangeInput">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px;">
          <TimeRangeInput
            v-model="state.modelValue"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :step="state.step"
            :format="state.format"
            :show-duration="state.showDuration"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]"
        />
        <HstSlider v-model="state.step" title="Step (minutes)" :min="5" :max="60" :step="5" />
        <HstSelect
          v-model="state.format"
          title="Format"
          :options="[
            { value: '24h', label: '24-hour' },
            { value: '12h', label: '12-hour' },
          ]"
        />
        <HstCheckbox v-model="state.showDuration" title="Show Duration" />
      </template>
    </Variant>

    <Variant title="Morning Shift">
      <div style="padding: 2rem; max-width: 500px;">
        <TimeRangeInput
          :model-value="{ start: '06:00', end: '14:00' }"
        />
      </div>
    </Variant>

    <Variant title="12-Hour Format">
      <div style="padding: 2rem; max-width: 500px;">
        <TimeRangeInput
          :model-value="{ start: '09:00', end: '17:00' }"
          format="12h"
        />
      </div>
    </Variant>

    <Variant title="With Min/Max">
      <div style="padding: 2rem; max-width: 500px;">
        <TimeRangeInput
          :model-value="{ start: '08:00', end: '12:00' }"
          min="06:00"
          max="22:00"
        />
      </div>
    </Variant>

    <Variant title="No Duration">
      <div style="padding: 2rem; max-width: 500px;">
        <TimeRangeInput
          :model-value="{ start: '10:00', end: '15:00' }"
          :show-duration="false"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px;">
        <TimeRangeInput
          :model-value="{ start: '09:00', end: '17:00' }"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
