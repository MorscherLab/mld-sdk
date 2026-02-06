<script setup lang="ts">
import { ref } from 'vue'
import { BaseRadioGroup, type RadioOption } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const selected = ref<string>('option1')
const plan = ref<string>('pro')

const basicOptions: RadioOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const planOptions: RadioOption[] = [
  { value: 'free', label: 'Free', description: 'Basic features, limited usage' },
  { value: 'pro', label: 'Pro', description: 'All features, unlimited usage' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions, dedicated support' },
]

const mixedOptions: RadioOption[] = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled (unavailable)', disabled: true },
  { value: 'custom', label: 'Custom' },
]
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="space-y-4">
      <BaseRadioGroup v-model="selected" :options="basicOptions" name="basic" />
      <p class="text-sm text-text-secondary">Selected: {{ selected }}</p>
    </div>
  </DemoSection>

  <!-- With Descriptions -->
  <DemoSection title="With Descriptions">
    <div class="space-y-4">
      <BaseRadioGroup v-model="plan" :options="planOptions" name="plan" />
      <p class="text-sm text-text-secondary">Selected plan: {{ plan }}</p>
    </div>
  </DemoSection>

  <!-- Directions -->
  <DemoSection title="Directions">
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Vertical (default)</label>
        <BaseRadioGroup :options="basicOptions" name="vertical" direction="vertical" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Horizontal</label>
        <BaseRadioGroup :options="basicOptions" name="horizontal" direction="horizontal" />
      </div>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-6">
      <div v-for="size in sizes" :key="size" class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <BaseRadioGroup :options="basicOptions" :name="`size-${size}`" :size="size" direction="horizontal" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">With disabled option</label>
        <BaseRadioGroup :options="mixedOptions" name="mixed" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Entire group disabled</label>
        <BaseRadioGroup :options="basicOptions" name="disabled" disabled />
      </div>
    </div>
  </DemoSection>
</template>
