<script setup lang="ts">
import { ref } from 'vue'
import { BasePill, type PillVariant, type PillSize } from '@morscherlab/mld-sdk'
import { DemoSection } from '../components'

const variants: readonly PillVariant[] = ['default', 'primary', 'success', 'warning', 'error', 'info', 'outline']
const sizes: readonly PillSize[] = ['sm', 'md', 'lg']

const tags = ref(['Vue 3', 'TypeScript', 'Vite', 'Pinia'])

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

function resetTags() {
  tags.value = ['Vue 3', 'TypeScript', 'Vite', 'Pinia']
}
</script>

<template>
  <DemoSection title="Variants">
    <div class="demo-grid">
      <BasePill
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
      >
        {{ variant }}
      </BasePill>
    </div>
  </DemoSection>

  <DemoSection title="Sizes">
    <div class="demo-grid">
      <BasePill
        v-for="size in sizes"
        :key="size"
        :size="size"
        variant="primary"
      >
        Size {{ size }}
      </BasePill>
    </div>
  </DemoSection>

  <DemoSection title="Removable" description="Click the X to remove a tag">
    <div class="demo-grid">
      <BasePill
        v-for="tag in tags"
        :key="tag"
        variant="primary"
        removable
        @remove="removeTag(tag)"
      >
        {{ tag }}
      </BasePill>
      <button v-if="tags.length < 4" class="text-sm underline opacity-60" @click="resetTags">
        Reset
      </button>
    </div>
  </DemoSection>

  <DemoSection title="With Icon">
    <div class="demo-grid">
      <BasePill variant="success" :icon="true">
        <template #icon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </template>
        Verified
      </BasePill>
      <BasePill variant="warning" :icon="true">
        <template #icon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
        Pending
      </BasePill>
      <BasePill variant="error" :icon="true">
        <template #icon>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 14px; height: 14px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </template>
        Failed
      </BasePill>
    </div>
  </DemoSection>

  <DemoSection title="Disabled">
    <div class="demo-grid">
      <BasePill variant="primary" disabled>Disabled</BasePill>
      <BasePill variant="success" disabled removable>Can't Remove</BasePill>
    </div>
  </DemoSection>
</template>
