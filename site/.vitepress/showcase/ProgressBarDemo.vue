<script setup lang="ts">
import { ref } from 'vue'
import { ProgressBar } from '@morscherlab/mld-sdk'

const value = ref(65)
</script>

<template>
  <!-- Basic -->
  <DemoSection title="Basic">
    <div class="max-w-md">
      <ProgressBar :value="value" label="Upload Progress" showValue />
      <p class="text-sm text-text-secondary mt-2">Value: {{ value }}%</p>
    </div>
  </DemoSection>

  <!-- Variants -->
  <DemoSection title="Variants">
    <div class="space-y-4 max-w-md">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">primary (20%)</label>
        <ProgressBar :value="20" variant="primary" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">success (40%)</label>
        <ProgressBar :value="40" variant="success" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">warning (60%)</label>
        <ProgressBar :value="60" variant="warning" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">error (80%)</label>
        <ProgressBar :value="80" variant="error" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">info (100%)</label>
        <ProgressBar :value="100" variant="info" />
      </div>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4 max-w-md">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">sm</label>
        <ProgressBar :value="50" size="sm" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">md</label>
        <ProgressBar :value="50" size="md" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">lg</label>
        <ProgressBar :value="50" size="lg" />
      </div>
    </div>
  </DemoSection>

  <!-- Indeterminate -->
  <DemoSection title="Indeterminate">
    <div class="max-w-md">
      <ProgressBar indeterminate label="Loading..." />
    </div>
  </DemoSection>
</template>
