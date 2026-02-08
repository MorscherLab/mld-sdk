<script setup lang="ts">
import { Divider } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- Horizontal -->
  <DemoSection title="Horizontal">
    <div class="max-w-md">
      <p class="text-sm text-text-secondary mb-2">Content above</p>
      <Divider />
      <p class="text-sm text-text-secondary mt-2">Content below</p>
    </div>
  </DemoSection>

  <!-- With Label -->
  <DemoSection title="With Label">
    <div class="max-w-md space-y-6">
      <div>
        <p class="text-sm text-text-secondary mb-2">Option A</p>
        <Divider label="OR" />
        <p class="text-sm text-text-secondary mt-2">Option B</p>
      </div>
      <div>
        <p class="text-sm text-text-secondary mb-2">First section content</p>
        <Divider label="Section Break" />
        <p class="text-sm text-text-secondary mt-2">Second section content</p>
      </div>
    </div>
  </DemoSection>

  <!-- Spacing -->
  <DemoSection title="Spacing">
    <div class="max-w-md">
      <p class="text-sm text-text-secondary">Spacing: sm</p>
      <Divider spacing="sm" />
      <p class="text-sm text-text-secondary">Spacing: md (default)</p>
      <Divider spacing="md" />
      <p class="text-sm text-text-secondary">Spacing: lg</p>
      <Divider spacing="lg" />
      <p class="text-sm text-text-secondary">End of content</p>
    </div>
  </DemoSection>

  <!-- Vertical -->
  <DemoSection title="Vertical">
    <div class="flex items-center gap-0 h-8">
      <span class="text-sm text-text-secondary px-3">Left</span>
      <Divider vertical />
      <span class="text-sm text-text-secondary px-3">Right</span>
    </div>
  </DemoSection>
</template>
