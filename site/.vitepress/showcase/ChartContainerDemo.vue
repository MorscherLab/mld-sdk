<script setup lang="ts">
import { ref } from 'vue'
import { ChartContainer, BaseButton } from '@morscherlab/mld-sdk'

const loading = ref(false)
const empty = ref(false)
</script>

<template>
  <!-- Basic -->
  <DemoSection title="Basic">
    <ChartContainer title="Revenue Over Time" description="Monthly revenue in USD">
      <div class="h-[200px] flex items-center justify-center bg-bg-hover rounded text-text-secondary text-sm">
        Chart goes here
      </div>
    </ChartContainer>
  </DemoSection>

  <!-- With Toolbar -->
  <DemoSection title="With Toolbar">
    <ChartContainer title="Experiment Results" description="Dose-response curves">
      <template #toolbar>
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm">Export</BaseButton>
          <BaseButton variant="secondary" size="sm">Refresh</BaseButton>
        </div>
      </template>

      <div class="h-[200px] flex items-center justify-center bg-bg-hover rounded text-text-secondary text-sm">
        Chart goes here
      </div>
    </ChartContainer>
  </DemoSection>

  <!-- Loading State -->
  <DemoSection title="Loading State">
    <div class="mb-4">
      <BaseButton variant="secondary" size="sm" @click="loading = !loading">
        Toggle Loading
      </BaseButton>
    </div>
    <ChartContainer title="Loading Example" :loading="loading">
      <div class="h-[200px] flex items-center justify-center bg-bg-hover rounded text-text-secondary text-sm">
        Chart content
      </div>
    </ChartContainer>
  </DemoSection>

  <!-- Empty State -->
  <DemoSection title="Empty State">
    <div class="mb-4">
      <BaseButton variant="secondary" size="sm" @click="empty = !empty">
        Toggle Empty
      </BaseButton>
    </div>
    <ChartContainer
      title="Empty Example"
      :empty="empty"
      empty-message="No data for selected period"
    >
      <div class="h-[200px] flex items-center justify-center bg-bg-hover rounded text-text-secondary text-sm">
        Chart content
      </div>
    </ChartContainer>
  </DemoSection>

  <!-- With Legend -->
  <DemoSection title="With Legend">
    <ChartContainer title="Sample Distribution">
      <div class="h-[200px] flex items-center justify-center bg-bg-hover rounded text-text-secondary text-sm">
        Chart goes here
      </div>

      <template #legend>
        <div class="flex gap-4 items-center">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span class="text-sm text-text-secondary">Group A</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="text-sm text-text-secondary">Group B</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <span class="text-sm text-text-secondary">Control</span>
          </div>
        </div>
      </template>
    </ChartContainer>
  </DemoSection>
</template>
