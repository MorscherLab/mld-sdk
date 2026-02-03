<script setup lang="ts">
import { ref } from 'vue'
import { BaseToggle } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const enabled = ref(false)
const notifications = ref(true)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseToggle</h1>
    <p class="text-text-secondary mb-8">
      A switch-style toggle component for boolean values with label and size variants.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="space-y-4">
        <BaseToggle v-model="enabled" />
        <p class="text-sm text-text-secondary">Enabled: {{ enabled }}</p>
      </div>
    </div>

    <!-- With Label -->
    <div class="demo-section">
      <h3>With Label</h3>
      <div class="space-y-4">
        <BaseToggle v-model="notifications" label="Enable notifications" />
        <BaseToggle label="Dark mode" />
        <BaseToggle label="Auto-save" />
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4">
        <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-12">{{ size }}:</span>
          <BaseToggle :size="size" :label="`Size ${size}`" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
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
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Toggle state (v-model)</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Label text</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Toggle size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the toggle</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;BaseToggle
  v-model="darkMode"
  label="Enable dark mode"
/&gt;

&lt;BaseToggle
  v-model="notifications"
  label="Push notifications"
  size="lg"
/&gt;</pre>
    </div>
  </div>
</template>
