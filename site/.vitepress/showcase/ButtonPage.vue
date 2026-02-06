<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, type ButtonVariant, type ButtonSize } from '@morscherlab/mld-sdk'
import { PageHeader, DemoSection, PropsTable, EventsTable, CodeBlock, type PropDefinition, type EventDefinition } from '../components'

const variants: readonly ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: readonly ButtonSize[] = ['sm', 'md', 'lg']

const loadingVariant = ref<ButtonVariant | null>(null)

function simulateLoading(variant: ButtonVariant) {
  loadingVariant.value = variant
  setTimeout(() => {
    loadingVariant.value = null
  }, 2000)
}

const propDefinitions: readonly PropDefinition[] = [
  { name: 'variant', type: 'ButtonVariant', default: "'primary'", description: 'Button style variant' },
  { name: 'size', type: 'ButtonSize', default: "'md'", description: 'Button size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Show loading spinner' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expand to full container width' },
]

const eventDefinitions: readonly EventDefinition[] = [
  { name: 'click', payload: 'MouseEvent', description: 'Emitted when button is clicked (not when disabled or loading)' },
]

const usageCode = `<BaseButton variant="primary" size="md">
  Click me
</BaseButton>

<BaseButton variant="danger" :loading="isLoading" @click="handleClick">
  Delete
</BaseButton>`
</script>

<template>
  <div class="max-w-4xl">
    <PageHeader
      title="BaseButton"
      description="A versatile button component with multiple variants, sizes, and states."
    />

    <DemoSection title="Variants">
      <div class="demo-grid">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
        >
          {{ variant }}
        </BaseButton>
      </div>
    </DemoSection>

    <DemoSection title="Sizes">
      <div class="demo-grid">
        <BaseButton
          v-for="size in sizes"
          :key="size"
          :size="size"
        >
          Size {{ size }}
        </BaseButton>
      </div>
    </DemoSection>

    <DemoSection title="Loading State" description="Click a button to see the loading state">
      <div class="demo-grid">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :loading="loadingVariant === variant"
          @click="simulateLoading(variant)"
        >
          {{ variant }}
        </BaseButton>
      </div>
    </DemoSection>

    <DemoSection title="Disabled State">
      <div class="demo-grid">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          disabled
        >
          {{ variant }}
        </BaseButton>
      </div>
    </DemoSection>

    <DemoSection title="Full Width">
      <div class="space-y-3 max-w-md">
        <BaseButton variant="primary" full-width>Primary Full Width</BaseButton>
        <BaseButton variant="secondary" full-width>Secondary Full Width</BaseButton>
      </div>
    </DemoSection>

    <DemoSection title="Props">
      <PropsTable :props="propDefinitions" />
    </DemoSection>

    <DemoSection title="Events">
      <EventsTable :events="eventDefinitions" />
    </DemoSection>

    <DemoSection title="Usage">
      <CodeBlock :code="usageCode" />
    </DemoSection>
  </div>
</template>
