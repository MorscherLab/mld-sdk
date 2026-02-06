<script setup lang="ts">
import { ref } from 'vue'
import { IconButton, type ButtonVariant, type ButtonSize } from '@morscherlab/mld-sdk'

const variants: ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

const loadingVariant = ref<ButtonVariant | null>(null)

function simulateLoading(variant: ButtonVariant) {
  loadingVariant.value = variant
  setTimeout(() => {
    loadingVariant.value = null
  }, 2000)
}
</script>

<template>
  <!-- Variants -->
  <DemoSection title="Variants">
    <div class="demo-grid">
      <IconButton
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :label="`${variant} action`"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </IconButton>
    </div>
    <p class="mt-3 text-sm text-text-muted">
      Variants: {{ variants.join(', ') }}
    </p>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="demo-grid items-end">
      <div v-for="size in sizes" :key="size" class="text-center">
        <IconButton :size="size" label="Edit">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </IconButton>
        <p class="text-xs text-text-muted mt-2">{{ size }}</p>
      </div>
    </div>
  </DemoSection>

  <!-- Different Icons -->
  <DemoSection title="Common Actions">
    <div class="demo-grid">
      <IconButton variant="ghost" label="Edit">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </IconButton>

      <IconButton variant="danger" label="Delete">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </IconButton>

      <IconButton variant="ghost" label="Search">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </IconButton>

      <IconButton variant="ghost" label="Settings">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </IconButton>

      <IconButton variant="ghost" label="Close">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </IconButton>

      <IconButton variant="ghost" label="Menu">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </IconButton>
    </div>
  </DemoSection>

  <!-- Loading State -->
  <DemoSection title="Loading State" description="Click a button to see the loading state">
    <div class="demo-grid">
      <IconButton
        v-for="variant in ['primary', 'secondary', 'danger'] as ButtonVariant[]"
        :key="variant"
        :variant="variant"
        :loading="loadingVariant === variant"
        label="Refresh"
        @click="simulateLoading(variant)"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </IconButton>
    </div>
  </DemoSection>

  <!-- Disabled State -->
  <DemoSection title="Disabled State">
    <div class="demo-grid">
      <IconButton
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        disabled
        label="Disabled"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </IconButton>
    </div>
  </DemoSection>
</template>
