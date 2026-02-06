<script setup lang="ts">
import { ref } from 'vue'
import { TagsInput } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const tags = ref<string[]>(['Vue', 'TypeScript'])
const skills = ref<string[]>([])
const limitedTags = ref<string[]>(['Tag 1', 'Tag 2'])
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="max-w-md space-y-2">
      <TagsInput v-model="tags" placeholder="Add tags..." />
      <p class="text-sm text-text-secondary">Tags: {{ tags.join(', ') || '(none)' }}</p>
      <p class="text-xs text-text-muted">Press Enter or comma to add a tag</p>
    </div>
  </DemoSection>

  <!-- Empty State -->
  <DemoSection title="Empty State">
    <div class="max-w-md">
      <TagsInput v-model="skills" placeholder="Type skills and press Enter..." />
    </div>
  </DemoSection>

  <!-- Max Tags -->
  <DemoSection title="Max Tags Limit">
    <div class="max-w-md space-y-2">
      <TagsInput v-model="limitedTags" :max-tags="5" placeholder="Max 5 tags..." />
      <p class="text-sm text-text-secondary">{{ limitedTags.length }}/5 tags</p>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4 max-w-md">
      <div v-for="size in sizes" :key="size" class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <TagsInput :size="size" :model-value="['Example', 'Tags']" :placeholder="`Size ${size}`" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4 max-w-md">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Error</label>
        <TagsInput error :model-value="['Invalid']" placeholder="Error state" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <TagsInput disabled :model-value="['Locked', 'Tags']" placeholder="Disabled" />
      </div>
    </div>
  </DemoSection>
</template>
