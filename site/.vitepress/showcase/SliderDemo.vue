<script setup lang="ts">
import { ref } from 'vue'
import { BaseSlider } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const value = ref(50)
const volume = ref(75)
const temperature = ref(22)
const percentage = ref(30)
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="max-w-md space-y-2">
      <BaseSlider v-model="value" />
      <p class="text-sm text-text-secondary">Value: {{ value }}</p>
    </div>
  </DemoSection>

  <!-- Custom Range -->
  <DemoSection title="Custom Range">
    <div class="space-y-6 max-w-md">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Volume (0-100)</label>
        <BaseSlider v-model="volume" :min="0" :max="100" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Temperature (15-30, step 0.5)</label>
        <BaseSlider v-model="temperature" :min="15" :max="30" :step="0.5" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Percentage (0-100, step 10)</label>
        <BaseSlider v-model="percentage" :min="0" :max="100" :step="10" />
      </div>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-6 max-w-md">
      <div v-for="size in sizes" :key="size" class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <BaseSlider :size="size" :model-value="50" />
      </div>
    </div>
  </DemoSection>

  <!-- Without Value Display -->
  <DemoSection title="Without Value Display">
    <div class="max-w-md">
      <BaseSlider :model-value="60" :show-value="false" />
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-6 max-w-md">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <BaseSlider :model-value="40" disabled />
      </div>
    </div>
  </DemoSection>
</template>
