<script setup lang="ts">
import { ref } from 'vue'
import { NumberInput } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const quantity = ref<number>(1)
const percentage = ref<number>(50)
const decimal = ref<number>(0.5)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">NumberInput</h1>
    <p class="text-text-secondary mb-8">
      A number input with +/- buttons for easy increment/decrement.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="space-y-2">
        <NumberInput v-model="quantity" />
        <p class="text-sm text-text-secondary">Value: {{ quantity }}</p>
      </div>
    </div>

    <!-- With Constraints -->
    <div class="demo-section">
      <h3>With Min/Max/Step</h3>
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Percentage (0-100, step 5)</label>
          <NumberInput v-model="percentage" :min="0" :max="100" :step="5" />
          <p class="text-sm text-text-secondary">Value: {{ percentage }}%</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-text-secondary">Decimal (0-1, step 0.1)</label>
          <NumberInput v-model="decimal" :min="0" :max="1" :step="0.1" />
          <p class="text-sm text-text-secondary">Value: {{ decimal }}</p>
        </div>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4">
        <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-12">{{ size }}:</span>
          <NumberInput :size="size" :model-value="10" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">Error:</span>
          <NumberInput error :model-value="-5" />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">Disabled:</span>
          <NumberInput disabled :model-value="42" />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">At min:</span>
          <NumberInput :model-value="0" :min="0" :max="10" />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">At max:</span>
          <NumberInput :model-value="10" :min="0" :max="10" />
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
            <td>-</td>
            <td>Minimum value</td>
          </tr>
          <tr>
            <td><code>max</code></td>
            <td><code>number</code></td>
            <td>-</td>
            <td>Maximum value</td>
          </tr>
          <tr>
            <td><code>step</code></td>
            <td><code>number</code></td>
            <td><code>1</code></td>
            <td>Increment/decrement step</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>'sm' | 'md' | 'lg'</code></td>
            <td><code>'md'</code></td>
            <td>Input size</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Placeholder text</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the input</td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show error state styling</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;NumberInput
  v-model="quantity"
  :min="1"
  :max="99"
  :step="1"
/&gt;</pre>
    </div>
  </div>
</template>
