<script setup lang="ts">
import { ref } from 'vue'
import { BaseToggle } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const enabled = ref(false)
const notifications = ref(true)
</script>

<template>
  <!-- Basic Usage -->
  <DemoSection title="Basic Usage">
    <div class="space-y-4">
      <BaseToggle v-model="enabled" />
      <p class="text-sm text-text-secondary">Enabled: {{ enabled }}</p>
    </div>
  </DemoSection>

  <!-- With Label -->
  <DemoSection title="With Label">
    <div class="space-y-4">
      <BaseToggle v-model="notifications" label="Enable notifications" />
      <BaseToggle label="Dark mode" />
      <BaseToggle label="Auto-save" />
    </div>
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="space-y-4">
      <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-12">{{ size }}:</span>
        <BaseToggle :size="size" :label="`Size ${size}`" />
      </div>
    </div>
  </DemoSection>

  <!-- States -->
  <DemoSection title="States">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Off:</span>
        <BaseToggle label="Feature" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">On:</span>
        <BaseToggle :model-value="true" label="Feature" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20">Disabled:</span>
        <BaseToggle disabled label="Disabled off" />
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-text-secondary w-20"></span>
        <BaseToggle disabled :model-value="true" label="Disabled on" />
      </div>
    </div>
  </DemoSection>
</template>
