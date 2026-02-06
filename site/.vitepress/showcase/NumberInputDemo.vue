<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const quantity = ref<number>(1)
const percentage = ref<number>(50)
const decimal = ref<number>(0.5)
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="space-y-2">
      <NumberInput v-model="quantity" />
      <p class="text-sm text-text-secondary">Value: {{ quantity }}</p>
    </div>
  </DemoSection>

  <!-- With Constraints -->
  <DemoSection title="With Min/Max/Step">
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Percentage (0-100, step 5)</label>
        <NumberInput v-model="percentage" :min="0" :max="100" :step="5" />
        <p class="text-sm text-text-secondary">Value: {{ percentage }}%</p>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Decimal (0-1, step 0.1)</label>
        <NumberInput v-model="decimal" :min="0" :max="1" :step="0.1" />
        <p class="text-sm text-text-secondary">Value: {{ decimal }}</p>
      </div>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4">
      <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-12">{{ size }}:</span>
        <NumberInput :size="size" :model-value="10" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Error:</span>
        <NumberInput error :model-value="-5" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Disabled:</span>
        <NumberInput disabled :model-value="42" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">At min:</span>
        <NumberInput :model-value="0" :min="0" :max="10" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">At max:</span>
        <NumberInput :model-value="10" :min="0" :max="10" />
      </div>
    </div>
  </DemoSection>
</template>
