<script setup lang="ts">
import { ref } from 'vue'
import { DropdownButton, type ButtonVariant, type ButtonSize, type SelectOption } from '@morscherlab/mld-sdk'
import { DemoSection } from '../components'

const basicOptions: SelectOption<string>[] = [
  { value: 'csv', label: 'CSV' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'json', label: 'JSON' },
  { value: 'tsv', label: 'TSV', disabled: true },
]

const descriptiveOptions: SelectOption<string>[] = [
  { value: 'standard', label: 'Standard', description: 'Default analysis pipeline' },
  { value: 'advanced', label: 'Advanced', description: 'Extended parameter set' },
  { value: 'custom', label: 'Custom', description: 'User-defined configuration' },
]

const selectedFormat = ref<string>()
const selectedPipeline = ref<string>('standard')
const selectedVariant = ref<string>()
const selectedSize = ref<string>()
const loadingValue = ref<string>()
const isLoading = ref(false)

const variants: readonly ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: readonly ButtonSize[] = ['sm', 'md', 'lg']

function simulateLoading() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<template>
  <DemoSection title="Basic" description="Select an export format">
    <div class="demo-grid">
      <DropdownButton
        v-model="selectedFormat"
        :options="basicOptions"
        placeholder="Export as..."
      />
      <span class="text-sm opacity-60">Selected: {{ selectedFormat ?? 'none' }}</span>
    </div>
  </DemoSection>

  <DemoSection title="With Descriptions">
    <div class="demo-grid">
      <DropdownButton
        v-model="selectedPipeline"
        :options="descriptiveOptions"
        variant="primary"
      />
    </div>
  </DemoSection>

  <DemoSection title="Variants">
    <div class="demo-grid">
      <DropdownButton
        v-for="variant in variants"
        :key="variant"
        v-model="selectedVariant"
        :options="basicOptions"
        :variant="variant"
        :placeholder="variant"
      />
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="demo-grid">
      <DropdownButton
        v-for="size in sizes"
        :key="size"
        v-model="selectedSize"
        :options="basicOptions"
        :size="size"
        :placeholder="`Size ${size}`"
      />
    </div>
  </DemoSection>

  <DemoSection title="States">
    <div class="demo-grid">
      <DropdownButton
        :options="basicOptions"
        disabled
        placeholder="Disabled"
      />
      <DropdownButton
        v-model="loadingValue"
        :options="basicOptions"
        :loading="isLoading"
        placeholder="Loading"
        @select="simulateLoading"
      />
    </div>
  </DemoSection>
</template>
