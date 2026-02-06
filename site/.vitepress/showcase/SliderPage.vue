<script setup lang="ts">
import { ref } from 'vue'
import { BaseSlider } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const value = ref(50)
const volume = ref(75)
const temperature = ref(22)
const percentage = ref(30)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseSlider</h1>
    <p class="text-text-secondary mb-8">
      A slider component for numeric range selection.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="max-w-md space-y-2">
        <BaseSlider v-model="value" />
        <p class="text-sm text-text-secondary">Value: {{ value }}</p>
      </div>
    </div>

    <!-- Custom Range -->
    <div class="demo-section">
      <h3>Custom Range</h3>
      <div class="space-y-6 max-w-md">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Volume (0-100)</label>
          <BaseSlider v-model="volume" :min="0" :max="100" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Temperature (15-30, step 0.5)</label>
          <BaseSlider v-model="temperature" :min="15" :max="30" :step="0.5" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Percentage (0-100, step 10)</label>
          <BaseSlider v-model="percentage" :min="0" :max="100" :step="10" />
        </div>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-6 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <BaseSlider :size="size" :model-value="50" />
        </div>
      </div>
    </div>

    <!-- Without Value Display -->
    <div class="demo-section">
      <h3>Without Value Display</h3>
      <div class="max-w-md">
        <BaseSlider :model-value="60" :show-value="false" />
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-6 max-w-md">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <BaseSlider :model-value="40" disabled />
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
            <td><code>number</code></td>
            <td>-</td>
            <td>Current value (v-model)</td>
          </tr>
          <tr>
            <td><code>min</code></td>
            <td><code>number</code></td>
            <td><code>0</code></td>
            <td>Minimum value</td>
          </tr>
          <tr>
            <td><code>max</code></td>
            <td><code>number</code></td>
            <td><code>100</code></td>
            <td>Maximum value</td>
          </tr>
          <tr>
            <td><code>step</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Step increment</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Slider size</td>
          </tr>
          <tr>
            <td><code>showValue</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show current value next to slider</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the slider</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;BaseSlider
  v-model="volume"
  :min="0"
  :max="100"
  :step="5"
/&gt;</pre>
    </div>
  </div>
</template>
