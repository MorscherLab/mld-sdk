<script setup lang="ts">
import { Avatar } from '@morscherlab/mld-sdk'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const people = [
  { name: 'Jane Doe' },
  { name: 'Bob Smith' },
  { name: 'Alice Wang' },
  { name: 'Carlos Reyes' },
]
</script>

<template>
  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="flex gap-4 items-end">
      <div v-for="size in sizes" :key="size" class="text-center">
        <Avatar :size="size" name="Jane Doe" />
        <p class="text-xs text-text-secondary mt-2">{{ size }}</p>
      </div>
    </div>
  </DemoSection>

  <!-- From Name -->
  <DemoSection title="From Name">
    <div class="flex gap-4 items-center">
      <div v-for="person in people" :key="person.name" class="text-center">
        <Avatar :name="person.name" />
        <p class="text-xs text-text-secondary mt-2">{{ person.name }}</p>
      </div>
    </div>
  </DemoSection>

  <!-- Custom Initials -->
  <DemoSection title="Custom Initials">
    <Avatar initials="MLD" color="#3B82F6" />
  </DemoSection>

  <!-- Fallback -->
  <DemoSection title="Fallback">
    <div class="flex gap-4 items-center">
      <Avatar />
      <span class="text-sm text-text-secondary">No name, initials, or image provided</span>
    </div>
  </DemoSection>
</template>
