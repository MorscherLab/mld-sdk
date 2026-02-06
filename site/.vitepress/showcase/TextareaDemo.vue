<script setup lang="ts">
import { ref } from 'vue'
import { BaseTextarea } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const
const resizeOptions = ['none', 'vertical', 'horizontal', 'both'] as const

const textValue = ref('')
const errorValue = ref('This has an error')
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="max-w-md">
      <BaseTextarea v-model="textValue" placeholder="Enter your message..." />
      <p class="mt-2 text-sm text-text-secondary">Value: {{ textValue || '(empty)' }}</p>
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4 max-w-md">
      <div v-for="size in sizes" :key="size" class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
        <BaseTextarea :size="size" :placeholder="`Size ${size}`" :rows="2" />
      </div>
    </div>
  </DemoSection>

  <!-- Resize Options -->
  <DemoSection title="Resize Options">
    <div class="space-y-4 max-w-md">
      <div v-for="resize in resizeOptions" :key="resize" class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">resize: {{ resize }}</label>
        <BaseTextarea :resize="resize" :placeholder="`Resize ${resize}`" :rows="2" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4 max-w-md">
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Error</label>
        <BaseTextarea v-model="errorValue" error />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Disabled</label>
        <BaseTextarea disabled placeholder="Disabled textarea" />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium text-text-secondary">Readonly</label>
        <BaseTextarea readonly model-value="This is read-only content" />
      </div>
    </div>
  </DemoSection>
</template>
