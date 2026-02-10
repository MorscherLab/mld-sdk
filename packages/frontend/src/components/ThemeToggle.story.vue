<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'

const sizes: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg']
</script>

<template>
  <Story title="Action/ThemeToggle">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <ThemeToggle :size="state.size" />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; display: flex; gap: 1.5rem; align-items: center; justify-content: center;">
        <div v-for="size in sizes" :key="size" style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
          <ThemeToggle :size="size" />
          <span style="font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </span>
        </div>
      </div>
    </Variant>
  </Story>
</template>
