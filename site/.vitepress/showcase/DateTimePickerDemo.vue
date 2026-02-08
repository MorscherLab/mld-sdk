<script setup lang="ts">
import { ref } from 'vue'
import { DateTimePicker } from '@morscherlab/mld-sdk'

const basicValue = ref('')
const value12h = ref('')
const smValue = ref('')
const mdValue = ref('')
const lgValue = ref('')
const errorValue = ref('')
const disabledValue = ref('2026-02-08T10:30')
</script>

<template>
  <DemoSection title="Basic Usage">
    <div class="flex items-center gap-4">
      <DateTimePicker v-model="basicValue" placeholder="Pick date and time" />
      <span class="text-sm text-text-secondary">Selected: {{ basicValue || 'none' }}</span>
    </div>
  </DemoSection>

  <DemoSection title="12-hour Format">
    <div class="flex items-center gap-4">
      <DateTimePicker v-model="value12h" time-format="12h" />
      <span class="text-sm text-text-secondary">Selected: {{ value12h || 'none' }}</span>
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="flex items-end gap-4">
      <div class="text-center">
        <DateTimePicker v-model="smValue" size="sm" />
        <p class="text-xs text-text-secondary mt-2">sm</p>
      </div>
      <div class="text-center">
        <DateTimePicker v-model="mdValue" size="md" />
        <p class="text-xs text-text-secondary mt-2">md</p>
      </div>
      <div class="text-center">
        <DateTimePicker v-model="lgValue" size="lg" />
        <p class="text-xs text-text-secondary mt-2">lg</p>
      </div>
    </div>
  </DemoSection>

  <DemoSection title="States">
    <div class="flex flex-wrap gap-4">
      <div>
        <label class="text-xs text-text-secondary block mb-1">Error</label>
        <DateTimePicker v-model="errorValue" error="Date and time are required" />
      </div>
      <div>
        <label class="text-xs text-text-secondary block mb-1">Disabled</label>
        <DateTimePicker v-model="disabledValue" disabled />
      </div>
    </div>
  </DemoSection>
</template>
