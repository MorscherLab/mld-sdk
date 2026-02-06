<script setup lang="ts">
import { ThemeToggle, useTheme, AlertBox } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const { isDark, toggleTheme, setTheme } = useTheme()
</script>

<template>
  <!-- Current Theme -->
  <DemoSection title="Current Theme">
    <AlertBox :type="isDark ? 'info' : 'warning'">
      <p>
        Current theme: <strong>{{ isDark ? 'Dark' : 'Light' }}</strong>
      </p>
    </AlertBox>
  </DemoSection>

  <!-- Basic Usage -->
  <DemoSection title="Basic Usage" description="Click to toggle the theme">
    <ThemeToggle />
  </DemoSection>

  <!-- Sizes -->
  <DemoSection title="Sizes">
    <div class="demo-grid items-end">
      <div v-for="size in sizes" :key="size" class="text-center">
        <ThemeToggle :size="size" />
        <p class="text-xs text-text-muted mt-2">{{ size }}</p>
      </div>
    </div>
  </DemoSection>

  <!-- Inline with Text -->
  <DemoSection title="Inline with Text">
    <div class="flex items-center gap-3">
      <span class="text-text-secondary">Toggle theme:</span>
      <ThemeToggle size="sm" />
    </div>
  </DemoSection>

  <!-- useTheme Composable -->
  <DemoSection title="useTheme() Composable" description="The theme can also be controlled programmatically:">
    <div class="demo-grid">
      <button
        class="px-4 py-2 bg-bg-secondary border border-border rounded-mld text-sm hover:bg-bg-hover transition-colors"
        @click="setTheme('light')"
      >
        Set Light
      </button>
      <button
        class="px-4 py-2 bg-bg-secondary border border-border rounded-mld text-sm hover:bg-bg-hover transition-colors"
        @click="setTheme('dark')"
      >
        Set Dark
      </button>
      <button
        class="px-4 py-2 bg-bg-secondary border border-border rounded-mld text-sm hover:bg-bg-hover transition-colors"
        @click="toggleTheme"
      >
        Toggle
      </button>
    </div>
  </DemoSection>
</template>
