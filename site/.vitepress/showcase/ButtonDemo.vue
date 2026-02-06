<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, type ButtonVariant, type ButtonSize } from '@morscherlab/mld-sdk'
import { DemoSection } from '../components'

const variants: readonly ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: readonly ButtonSize[] = ['sm', 'md', 'lg']

const loadingVariant = ref<ButtonVariant | null>(null)

function simulateLoading(variant: ButtonVariant) {
  loadingVariant.value = variant
  setTimeout(() => {
    loadingVariant.value = null
  }, 2000)
}
</script>

<template>
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
</template>
