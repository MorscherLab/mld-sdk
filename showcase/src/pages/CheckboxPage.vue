<script setup lang="ts">
import { ref } from 'vue'
import { BaseCheckbox } from '@morscherlab/mld-sdk'

const sizes = ['sm', 'md', 'lg'] as const

const checked = ref(false)
const checkedWithLabel = ref(true)
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseCheckbox</h1>
    <p class="text-text-secondary mb-8">
      A checkbox component for boolean toggle with optional label and size variants.
    </p>

    <!-- Basic Usage -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="space-y-4">
        <BaseCheckbox v-model="checked" />
        <p class="text-sm text-text-secondary">Checked: {{ checked }}</p>
      </div>
    </div>

    <!-- With Label -->
    <div class="demo-section">
      <h3>With Label</h3>
      <div class="space-y-4">
        <BaseCheckbox v-model="checkedWithLabel" label="Accept terms and conditions" />
        <BaseCheckbox label="Subscribe to newsletter" />
        <BaseCheckbox label="Remember me" />
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="space-y-4">
        <div v-for="size in sizes" :key="size" class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-12">{{ size }}:</span>
          <BaseCheckbox :size="size" :label="`Size ${size}`" />
        </div>
      </div>
    </div>

    <!-- States -->
    <div class="demo-section">
      <h3>States</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">Unchecked:</span>
          <BaseCheckbox label="Option A" />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">Checked:</span>
          <BaseCheckbox :model-value="true" label="Option B" />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20">Disabled:</span>
          <BaseCheckbox disabled label="Disabled unchecked" />
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary w-20"></span>
          <BaseCheckbox disabled :model-value="true" label="Disabled checked" />
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
            <td>Checkbox state (v-model)</td>
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
            <td>Checkbox size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the checkbox</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;BaseCheckbox
  v-model="accepted"
  label="Accept terms and conditions"
/&gt;

&lt;BaseCheckbox
  v-model="remember"
  label="Remember me"
  size="sm"
/&gt;</pre>
    </div>
  </div>
</template>
