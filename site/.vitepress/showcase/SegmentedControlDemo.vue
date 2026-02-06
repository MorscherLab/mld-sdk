<script setup lang="ts">
import { ref } from 'vue'
import { SegmentedControl, type SegmentedOption } from '@morscherlab/mld-sdk'

const simpleValue = ref<string>('neg')
const cardValue = ref<string>('v4')
const sizeValue = ref<string>('md')
const disabledValue = ref<string>('a')

const polarityOptions: SegmentedOption[] = [
  { value: 'neg', label: 'NEG' },
  { value: 'pos', label: 'POS' },
]

const versionOptions: SegmentedOption[] = [
  { value: 'v4', label: 'v4', description: 'Advanced' },
  { value: 'v2', label: 'v2', description: 'Smoothed' },
  { value: 'v1', label: 'v1', description: 'Basic' },
]

const sizeOptions: SegmentedOption[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
]

const disabledOptions: SegmentedOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B', disabled: true },
  { value: 'c', label: 'Option C' },
]
</script>

<template>
  <!-- Simple Variant -->
  <section class="space-y-4">
    <h2 class="text-lg font-semibold text-text-primary">Simple Variant</h2>
    <p class="text-sm text-text-muted">Compact button group for binary or small set selections.</p>

    <div class="max-w-xs">
      <SegmentedControl
        v-model="simpleValue"
        :options="polarityOptions"
        variant="simple"
      />
    </div>
    <p class="text-sm text-text-muted">Selected: {{ simpleValue }}</p>
  </section>

  <!-- Card Variant -->
  <section class="space-y-4">
    <h2 class="text-lg font-semibold text-text-primary">Card Variant</h2>
    <p class="text-sm text-text-muted">Options with labels and descriptions for more context.</p>

    <div class="max-w-md">
      <SegmentedControl
        v-model="cardValue"
        :options="versionOptions"
        variant="card"
      />
    </div>
    <p class="text-sm text-text-muted">Selected: {{ cardValue }}</p>
  </section>

  <!-- Sizes -->
  <section class="space-y-4">
    <h2 class="text-lg font-semibold text-text-primary">Sizes</h2>
    <p class="text-sm text-text-muted">Available in small, medium, and large sizes.</p>

    <div class="space-y-4">
      <div class="max-w-xs">
        <p class="text-xs text-text-muted mb-2">Small</p>
        <SegmentedControl
          v-model="sizeValue"
          :options="sizeOptions"
          variant="simple"
          size="sm"
        />
      </div>

      <div class="max-w-sm">
        <p class="text-xs text-text-muted mb-2">Medium (default)</p>
        <SegmentedControl
          v-model="sizeValue"
          :options="sizeOptions"
          variant="simple"
          size="md"
        />
      </div>

      <div class="max-w-md">
        <p class="text-xs text-text-muted mb-2">Large</p>
        <SegmentedControl
          v-model="sizeValue"
          :options="sizeOptions"
          variant="simple"
          size="lg"
        />
      </div>
    </div>
  </section>

  <!-- Full Width vs Hug -->
  <section class="space-y-4">
    <h2 class="text-lg font-semibold text-text-primary">Width Options</h2>
    <p class="text-sm text-text-muted">Full width (default) vs content-hugging.</p>

    <div class="space-y-4">
      <div>
        <p class="text-xs text-text-muted mb-2">Full width (default)</p>
        <SegmentedControl
          v-model="simpleValue"
          :options="polarityOptions"
          variant="simple"
          :full-width="true"
        />
      </div>

      <div>
        <p class="text-xs text-text-muted mb-2">Hug content</p>
        <SegmentedControl
          v-model="simpleValue"
          :options="polarityOptions"
          variant="simple"
          :full-width="false"
        />
      </div>
    </div>
  </section>

  <!-- Disabled States -->
  <section class="space-y-4">
    <h2 class="text-lg font-semibold text-text-primary">Disabled States</h2>
    <p class="text-sm text-text-muted">Individual options or entire control can be disabled.</p>

    <div class="space-y-4 max-w-md">
      <div>
        <p class="text-xs text-text-muted mb-2">Single option disabled</p>
        <SegmentedControl
          v-model="disabledValue"
          :options="disabledOptions"
          variant="simple"
        />
      </div>

      <div>
        <p class="text-xs text-text-muted mb-2">Entire control disabled</p>
        <SegmentedControl
          v-model="simpleValue"
          :options="polarityOptions"
          variant="simple"
          :disabled="true"
        />
      </div>
    </div>
  </section>

  <!-- Card Variant Sizes -->
  <section class="space-y-4">
    <h2 class="text-lg font-semibold text-text-primary">Card Variant Sizes</h2>

    <div class="space-y-4">
      <div class="max-w-sm">
        <p class="text-xs text-text-muted mb-2">Small</p>
        <SegmentedControl
          v-model="cardValue"
          :options="versionOptions"
          variant="card"
          size="sm"
        />
      </div>

      <div class="max-w-md">
        <p class="text-xs text-text-muted mb-2">Medium</p>
        <SegmentedControl
          v-model="cardValue"
          :options="versionOptions"
          variant="card"
          size="md"
        />
      </div>

      <div class="max-w-lg">
        <p class="text-xs text-text-muted mb-2">Large</p>
        <SegmentedControl
          v-model="cardValue"
          :options="versionOptions"
          variant="card"
          size="lg"
        />
      </div>
    </div>
  </section>
</template>
