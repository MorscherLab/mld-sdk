<script setup lang="ts">
import { ref } from 'vue'
import { ColorSlider } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const tolerance = ref(5)
const quality = ref(75)
const risk = ref(50)
</script>

<template>
  <!-- Basic Usage (PPM Tolerance Style) -->
  <DemoSection title="PPM Tolerance Example" description="Green (strict) to Yellow (moderate) to Red (loose). Value badge changes color based on thresholds.">
    <div class="max-w-md space-y-2">
      <ColorSlider
        v-model="tolerance"
        :min="1"
        :max="50"
        show-labels
        min-label="1 (strict)"
        max-label="50 (loose)"
      />
      <p class="text-sm text-text-secondary">Mass tolerance: {{ tolerance }} ppm</p>
    </div>
  </DemoSection>

  <!-- Quality Score (Reversed) -->
  <DemoSection title="Quality Score (High = Good)" description="Custom thresholds: Red below 50%, Yellow 50-80%, Green above 80%.">
    <div class="max-w-md space-y-2">
      <ColorSlider
        v-model="quality"
        :min="0"
        :max="100"
        :thresholds="[80, 50]"
        :color-stops="[
          { value: 0, color: '#ef4444' },
          { value: 50, color: '#eab308' },
          { value: 100, color: '#22c55e' },
        ]"
        show-labels
        min-label="0%"
        max-label="100%"
      />
      <p class="text-sm text-text-secondary">Quality: {{ quality }}%</p>
    </div>
  </DemoSection>

  <!-- Risk Level -->
  <DemoSection title="Risk Level">
    <div class="max-w-md space-y-2">
      <ColorSlider
        v-model="risk"
        :min="0"
        :max="100"
        :thresholds="[30, 70]"
        show-labels
        min-label="Low risk"
        max-label="High risk"
      />
      <p class="text-sm text-text-secondary">Risk: {{ risk }}%</p>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-6 max-w-md">
      <div v-for="size in sizes" :key="size" class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <ColorSlider :size="size" :model-value="25" :min="1" :max="50" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-6 max-w-md">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Without value badge</label>
        <ColorSlider :model-value="30" :min="1" :max="50" :show-value="false" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <ColorSlider :model-value="15" :min="1" :max="50" disabled />
      </div>
    </div>
  </DemoSection>
</template>
