<script setup lang="ts">
import { ref } from 'vue'
import { TimePicker } from '@morscherlab/mld-sdk'

const basicTime = ref('14:30')
const time12h = ref('09:00')
const constrainedTime = ref('12:00')
const smTime = ref('10:00')
const mdTime = ref('10:00')
const lgTime = ref('10:00')
const errorTime = ref('')
const disabledTime = ref('08:00')
const clearableTime = ref('16:45')
</script>

<template>
  <DemoSection title="Basic Usage">
    <div class="flex items-center gap-4">
      <TimePicker v-model="basicTime" placeholder="Select time" />
      <span class="text-sm text-text-secondary">Selected: {{ basicTime || 'none' }}</span>
    </div>
  </DemoSection>

  <DemoSection title="12-hour Format">
    <div class="flex items-center gap-4">
      <TimePicker v-model="time12h" format="12h" />
      <span class="text-sm text-text-secondary">Selected: {{ time12h || 'none' }}</span>
    </div>
  </DemoSection>

  <DemoSection title="Constrained Range">
    <div class="flex flex-col gap-2">
      <TimePicker
        v-model="constrainedTime"
        min="09:00"
        max="17:00"
        :step="30"
      />
      <span class="text-xs text-text-secondary">Business hours only: 09:00 - 17:00, 30 minute steps</span>
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="flex items-end gap-4">
      <div class="text-center">
        <TimePicker v-model="smTime" size="sm" />
        <p class="text-xs text-text-secondary mt-2">sm</p>
      </div>
      <div class="text-center">
        <TimePicker v-model="mdTime" size="md" />
        <p class="text-xs text-text-secondary mt-2">md</p>
      </div>
      <div class="text-center">
        <TimePicker v-model="lgTime" size="lg" />
        <p class="text-xs text-text-secondary mt-2">lg</p>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="States">
    <div class="flex flex-wrap gap-4">
      <div>
        <label class="text-xs text-text-secondary block mb-1">Error</label>
        <TimePicker v-model="errorTime" error="Time is required" />
      </div>
      <div>
        <label class="text-xs text-text-secondary block mb-1">Disabled</label>
        <TimePicker v-model="disabledTime" disabled />
      </div>
      <div>
        <label class="text-xs text-text-secondary block mb-1">Clearable</label>
        <TimePicker v-model="clearableTime" clearable />
      </div>
    </div>
  </DemoSection>
</template>
