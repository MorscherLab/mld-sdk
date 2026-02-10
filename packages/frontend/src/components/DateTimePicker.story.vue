<script setup lang="ts">
import DateTimePicker from './DateTimePicker.vue'

const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T09:00`

const nextWeek = new Date(now)
nextWeek.setDate(nextWeek.getDate() + 7)
const nextWeekStr = nextWeek.toISOString()

function initState() {
  return {
    modelValue: today as string | undefined,
    placeholder: 'Select date & time',
    disabled: false,
    error: false,
    size: 'md' as const,
    timeStep: 15,
    timeFormat: '24h' as const,
    clearable: false,
  }
}
</script>

<template>
  <Story title="Scheduling/DateTimePicker">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px;">
          <DateTimePicker
            v-model="state.modelValue"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :time-step="state.timeStep"
            :time-format="state.timeFormat"
            :clearable="state.clearable"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstText v-model="state.modelValue" title="Value (ISO)" />
        <HstText v-model="state.placeholder" title="Placeholder" />
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
        <HstSlider v-model="state.timeStep" title="Time Step (minutes)" :min="5" :max="60" :step="5" />
        <HstSelect
          v-model="state.timeFormat"
          title="Time Format"
          :options="[
            { value: '24h', label: '24-hour' },
            { value: '12h', label: '12-hour' },
          ]"
        />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
      </template>
    </Variant>

    <Variant title="12-Hour Format">
      <div style="padding: 2rem; max-width: 400px;">
        <DateTimePicker
          :model-value="today"
          time-format="12h"
        />
      </div>
    </Variant>

    <Variant title="With Min/Max Range">
      <div style="padding: 2rem; max-width: 400px;">
        <DateTimePicker
          :model-value="today"
          :min="today"
          :max="nextWeekStr"
        />
      </div>
    </Variant>

    <Variant title="Clearable">
      <div style="padding: 2rem; max-width: 400px;">
        <DateTimePicker
          :model-value="today"
          clearable
        />
      </div>
    </Variant>

    <Variant title="No Value">
      <div style="padding: 2rem; max-width: 400px;">
        <DateTimePicker placeholder="Pick a date and time" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px;">
        <DateTimePicker
          :model-value="today"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
