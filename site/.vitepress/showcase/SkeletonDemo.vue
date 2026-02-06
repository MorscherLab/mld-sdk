<script setup lang="ts">
import { Skeleton } from '@morscherlab/mld-sdk'
</script>

<template>
  <!-- Variants -->
  <DemoSection title="Variants">
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Text (default)</label>
        <div class="space-y-2 max-w-md">
          <Skeleton />
          <Skeleton width="75%" />
          <Skeleton width="50%" />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Circular</label>
        <div class="flex gap-4">
          <Skeleton variant="circular" />
          <Skeleton variant="circular" :width="48" :height="48" />
          <Skeleton variant="circular" :width="64" :height="64" />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Rectangular</label>
        <Skeleton variant="rectangular" width="200px" height="120px" />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Rounded</label>
        <Skeleton variant="rounded" width="200px" height="120px" />
      </div>
    </div>
  </DemoSection>

  <!-- Animations -->
  <DemoSection title="Animations">
    <div class="space-y-4 max-w-md">
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Pulse (default)</label>
        <Skeleton animation="pulse" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">Wave</label>
        <Skeleton animation="wave" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-secondary">None</label>
        <Skeleton animation="none" />
      </div>
    </div>
  </DemoSection>

  <!-- Example: Card Loading -->
  <DemoSection title="Example: Card Loading">
    <div class="max-w-sm p-4 rounded-mld border border-border bg-bg-card">
      <div class="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" :width="40" :height="40" />
        <div class="flex-1 space-y-2">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton variant="rounded" height="160px" class="mb-4" />
      <div class="space-y-2">
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </div>
    </div>
  </DemoSection>

  <!-- Example: Table Loading -->
  <DemoSection title="Example: Table Loading">
    <div class="border border-border rounded-mld overflow-hidden">
      <div class="bg-bg-hover p-3 border-b border-border flex gap-4">
        <Skeleton width="100px" />
        <Skeleton width="150px" />
        <Skeleton width="80px" />
        <Skeleton width="120px" />
      </div>
      <div v-for="i in 3" :key="i" class="p-3 border-b border-border last:border-0 flex gap-4">
        <Skeleton width="100px" />
        <Skeleton width="150px" />
        <Skeleton width="80px" />
        <Skeleton width="120px" />
      </div>
    </div>
  </DemoSection>
</template>
