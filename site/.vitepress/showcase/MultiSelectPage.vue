<script setup lang="ts">
import { ref } from 'vue'
import { MultiSelect, type MultiSelectOption } from '@morscherlab/mld-sdk'

const basicValue = ref<string[]>([])
const preselectedValue = ref<string[]>(['apple', 'banana'])
const limitedValue = ref<string[]>([])
const sizeValue = ref<string[]>(['md'])

const fruitOptions: MultiSelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

const analysisOptions: MultiSelectOption[] = [
  { value: 'peak-detection', label: 'Peak Detection' },
  { value: 'normalization', label: 'Normalization' },
  { value: 'smoothing', label: 'Smoothing' },
  { value: 'baseline', label: 'Baseline Correction' },
  { value: 'integration', label: 'Integration', disabled: true },
]

const sizeOptions: MultiSelectOption[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-text-primary mb-2">MultiSelect</h1>
      <p class="text-text-muted">
        A chip-based component for selecting multiple values from a set of options.
      </p>
    </div>

    <!-- Basic Usage -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Basic Usage</h2>
      <p class="text-sm text-text-muted">Click chips to toggle selection.</p>

      <div class="max-w-md">
        <MultiSelect
          v-model="basicValue"
          :options="fruitOptions"
          placeholder="Select fruits..."
        />
      </div>
      <p class="text-sm text-text-muted">Selected: {{ basicValue.length > 0 ? basicValue.join(', ') : 'none' }}</p>
    </section>

    <!-- Pre-selected Values -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Pre-selected Values</h2>
      <p class="text-sm text-text-muted">Initial values can be set via v-model.</p>

      <div class="max-w-md">
        <MultiSelect
          v-model="preselectedValue"
          :options="fruitOptions"
        />
      </div>
    </section>

    <!-- Max Selections -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Limited Selections</h2>
      <p class="text-sm text-text-muted">Limit the maximum number of selections (max: 2).</p>

      <div class="max-w-md">
        <MultiSelect
          v-model="limitedValue"
          :options="fruitOptions"
          :max-selections="2"
          placeholder="Select up to 2 fruits..."
        />
      </div>
      <p class="text-sm text-text-muted">Selected: {{ limitedValue.length }}/2</p>
    </section>

    <!-- Disabled Options -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Disabled Options</h2>
      <p class="text-sm text-text-muted">Individual options can be disabled.</p>

      <div class="max-w-lg">
        <MultiSelect
          v-model="basicValue"
          :options="analysisOptions"
          placeholder="Select analysis steps..."
        />
      </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Sizes</h2>
      <p class="text-sm text-text-muted">Available in small, medium, and large sizes.</p>

      <div class="space-y-6">
        <div class="max-w-md">
          <p class="text-xs text-text-muted mb-2">Small</p>
          <MultiSelect
            v-model="sizeValue"
            :options="sizeOptions"
            size="sm"
          />
        </div>

        <div class="max-w-md">
          <p class="text-xs text-text-muted mb-2">Medium (default)</p>
          <MultiSelect
            v-model="sizeValue"
            :options="sizeOptions"
            size="md"
          />
        </div>

        <div class="max-w-md">
          <p class="text-xs text-text-muted mb-2">Large</p>
          <MultiSelect
            v-model="sizeValue"
            :options="sizeOptions"
            size="lg"
          />
        </div>
      </div>
    </section>

    <!-- Disabled State -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Disabled State</h2>
      <p class="text-sm text-text-muted">Entire component can be disabled.</p>

      <div class="max-w-md">
        <MultiSelect
          v-model="preselectedValue"
          :options="fruitOptions"
          :disabled="true"
        />
      </div>
    </section>

    <!-- Real-world Example -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-text-primary">Real-world Example</h2>
      <p class="text-sm text-text-muted">Analysis pipeline configuration.</p>

      <div class="max-w-lg p-4 border border-border-color rounded-lg bg-bg-secondary">
        <label class="block text-sm font-medium text-text-primary mb-2">
          Select Processing Steps
        </label>
        <MultiSelect
          v-model="basicValue"
          :options="analysisOptions"
          placeholder="Choose analysis steps to apply..."
        />
      </div>
    </section>
  </div>
</template>
