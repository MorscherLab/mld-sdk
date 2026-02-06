<script setup lang="ts">
import { ref } from 'vue'
import { BaseSelect, type SelectOption } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const basicOptions: SelectOption<string>[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const optionsWithDescriptions: SelectOption<string>[] = [
  { value: 'react', label: 'React', description: 'A JavaScript library for building user interfaces' },
  { value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
  { value: 'angular', label: 'Angular', description: 'Platform for building mobile & desktop apps' },
  { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
]

const optionsWithDisabled: SelectOption<string>[] = [
  { value: 'active1', label: 'Active Option 1' },
  { value: 'disabled1', label: 'Disabled Option', disabled: true },
  { value: 'active2', label: 'Active Option 2' },
  { value: 'disabled2', label: 'Another Disabled', disabled: true },
]

const numericOptions: SelectOption<number>[] = [
  { value: 10, label: '10 items' },
  { value: 25, label: '25 items' },
  { value: 50, label: '50 items' },
  { value: 100, label: '100 items' },
]

const basicValue = ref('')
const frameworkValue = ref('')
const disabledValue = ref('')
const numericValue = ref<number>(25)
const errorValue = ref('')
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="max-w-md">
      <BaseSelect
        v-model="basicValue"
        :options="basicOptions"
        placeholder="Select an option"
      />
      <p class="mt-2 text-sm text-text-secondary">Selected: {{ basicValue || 'None' }}</p>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4 max-w-md">
      <div v-for="size in sizes" :key="size" class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <BaseSelect
          :size="size"
          :options="basicOptions"
          :placeholder="`Size ${size}`"
        />
      </div>
    </div>
  </DemoSection>

  <!-- With Descriptions -->
  <DemoSection title="Options with Descriptions">
    <p class="text-sm text-text-secondary mb-4">Note: Descriptions are available in the options but HTML select doesn't display them. Consider custom dropdown for richer UI.</p>
    <div class="max-w-md">
      <BaseSelect
        v-model="frameworkValue"
        :options="optionsWithDescriptions"
        placeholder="Choose a framework"
      />
      <p class="mt-2 text-sm text-text-secondary">Selected: {{ frameworkValue || 'None' }}</p>
    </div>
  </DemoSection>

  <!-- Disabled Options -->
  <DemoSection title="Disabled Options">
    <div class="max-w-md">
      <BaseSelect
        v-model="disabledValue"
        :options="optionsWithDisabled"
        placeholder="Some options are disabled"
      />
    </div>
  </DemoSection>

  <!-- Numeric Values -->
  <DemoSection title="Numeric Values">
    <div class="max-w-md">
      <BaseSelect
        v-model="numericValue"
        :options="numericOptions"
      />
      <p class="mt-2 text-sm text-text-secondary">Selected: {{ numericValue }} (type: {{ typeof numericValue }})</p>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4 max-w-md">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Error</label>
        <BaseSelect
          v-model="errorValue"
          :options="basicOptions"
          error
          placeholder="Select with error"
        />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <BaseSelect
          :options="basicOptions"
          disabled
          placeholder="Disabled select"
        />
      </div>
    </div>
  </DemoSection>
</template>
