<script setup lang="ts">
import { LoadingSpinner } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="flex gap-6 items-center">
      <div class="text-center">
        <LoadingSpinner size="xs" />
        <p class="text-xs text-text-secondary mt-2">xs</p>
      </div>
      <div class="text-center">
        <LoadingSpinner size="sm" />
        <p class="text-xs text-text-secondary mt-2">sm</p>
      </div>
      <div class="text-center">
        <LoadingSpinner size="md" />
        <p class="text-xs text-text-secondary mt-2">md</p>
      </div>
      <div class="text-center">
        <LoadingSpinner size="lg" />
        <p class="text-xs text-text-secondary mt-2">lg</p>
      </div>
    </div>
  </DemoSection>

  <!-- Variants -->
  <DemoSection title="Variants">
    <div class="flex gap-6 items-center">
      <div class="text-center">
        <LoadingSpinner variant="primary" />
        <p class="text-xs text-text-secondary mt-2">primary</p>
      </div>
      <div class="text-center">
        <LoadingSpinner variant="cta" />
        <p class="text-xs text-text-secondary mt-2">cta</p>
      </div>
      <div class="text-center">
        <LoadingSpinner variant="muted" />
        <p class="text-xs text-text-secondary mt-2">muted</p>
      </div>
    </div>
  </DemoSection>

  <!-- With Label -->
  <DemoSection title="With Label">
    <div class="flex gap-3 items-center">
      <LoadingSpinner size="sm" />
      <span class="text-sm text-text-secondary">Loading data...</span>
    </div>
  </DemoSection>
</template>
