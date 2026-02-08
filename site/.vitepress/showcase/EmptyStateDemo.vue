<script setup lang="ts">
import { EmptyState } from '@morscherlab/mld-sdk'

const colors = ['primary', 'cta', 'success', 'warning', 'error', 'muted'] as const
const colorTitles: Record<string, string> = {
  primary: 'No results found',
  cta: 'Get started',
  success: 'All tasks completed',
  warning: 'Attention needed',
  error: 'Something went wrong',
  muted: 'Nothing here yet',
}

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <!-- Basic -->
  <DemoSection title="Basic">
    <EmptyState
      title="No experiments found"
      description="Create your first experiment to get started."
      actionLabel="Create Experiment"
      @action="() => {}"
    />
  </DemoSection>

  <!-- Colors -->
  <DemoSection title="Colors">
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <EmptyState
        v-for="color in colors"
        :key="color"
        :color="color"
        :title="colorTitles[color]"
        :description="`This is the ${color} color variant.`"
      />
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-6">
      <div v-for="size in sizes" :key="size">
        <p class="text-sm font-medium text-text-secondary mb-2">Size: {{ size }}</p>
        <EmptyState
          :size="size"
          title="No data available"
          description="There is nothing to display right now."
        />
      </div>
    </div>
  </DemoSection>

  <!-- Custom Icon -->
  <DemoSection title="Custom Icon">
    <EmptyState
      title="No layers"
      description="Add layers to organize your content."
      iconPath="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
    />
  </DemoSection>
</template>
