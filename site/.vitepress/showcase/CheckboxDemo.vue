<script setup lang="ts">
import { ref } from 'vue'
import { BaseCheckbox } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const checked = ref(false)
const checkedWithLabel = ref(true)
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="space-y-4">
      <BaseCheckbox v-model="checked" />
      <p class="text-sm text-text-secondary">Checked: {{ checked }}</p>
    </div>
  </DemoSection>

  <!-- With Label -->
  <DemoSection title="With Label">
    <div class="space-y-4">
      <BaseCheckbox v-model="checkedWithLabel" label="Accept terms and conditions" />
      <BaseCheckbox label="Subscribe to newsletter" />
      <BaseCheckbox label="Remember me" />
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4">
      <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-12">{{ size }}:</span>
        <BaseCheckbox :size="size" :label="`Size ${size}`" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Unchecked:</span>
        <BaseCheckbox label="Option A" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Checked:</span>
        <BaseCheckbox :model-value="true" label="Option B" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Disabled:</span>
        <BaseCheckbox disabled label="Disabled unchecked" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20"></span>
        <BaseCheckbox disabled :model-value="true" label="Disabled checked" />
      </div>
    </div>
  </DemoSection>
</template>
