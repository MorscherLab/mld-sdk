<script setup lang="ts">
import { ref } from 'vue'
import { BaseButton, type ButtonVariant, type ButtonSize } from '@morscherlab/mld-sdk'

const variants: ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

const loadingVariant = ref<ButtonVariant | null>(null)

function simulateLoading(variant: ButtonVariant) {
  loadingVariant.value = variant
  setTimeout(() => {
    loadingVariant.value = null
  }, 2000)
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">BaseButton</h1>
    <p class="text-text-secondary mb-8">
      A versatile button component with multiple variants, sizes, and states.
    </p>

    <!-- Variants -->
    <div class="demo-section">
      <h3>Variants</h3>
      <div class="demo-grid">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
        >
          {{ variant }}
        </BaseButton>
      </div>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="demo-grid">
        <BaseButton
          v-for="size in sizes"
          :key="size"
          :size="size"
        >
          Size {{ size }}
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div class="demo-section">
      <h3>Loading State</h3>
      <p class="text-sm text-text-secondary mb-4">Click a button to see the loading state</p>
      <div class="demo-grid">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :loading="loadingVariant === variant"
          @click="simulateLoading(variant)"
        >
          {{ variant }}
        </BaseButton>
      </div>
    </div>

    <!-- Disabled State -->
    <div class="demo-section">
      <h3>Disabled State</h3>
      <div class="demo-grid">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          disabled
        >
          {{ variant }}
        </BaseButton>
      </div>
    </div>

    <!-- Full Width -->
    <div class="demo-section">
      <h3>Full Width</h3>
      <div class="space-y-3 max-w-md">
        <BaseButton variant="primary" full-width>Primary Full Width</BaseButton>
        <BaseButton variant="secondary" full-width>Secondary Full Width</BaseButton>
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
            <td><code>variant</code></td>
            <td><code>ButtonVariant</code></td>
            <td><code>'primary'</code></td>
            <td>Button style variant</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>ButtonSize</code></td>
            <td><code>'md'</code></td>
            <td>Button size</td>
          </tr>
          <tr>
            <td><code>disabled</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable the button</td>
          </tr>
          <tr>
            <td><code>loading</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show loading spinner</td>
          </tr>
          <tr>
            <td><code>type</code></td>
            <td><code>'button' | 'submit' | 'reset'</code></td>
            <td><code>'button'</code></td>
            <td>HTML button type</td>
          </tr>
          <tr>
            <td><code>fullWidth</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Expand to full container width</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events Table -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>click</code></td>
            <td><code>MouseEvent</code></td>
            <td>Emitted when button is clicked (not when disabled or loading)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;BaseButton variant="primary" size="md"&gt;
  Click me
&lt;/BaseButton&gt;

&lt;BaseButton variant="danger" :loading="isLoading" @click="handleClick"&gt;
  Delete
&lt;/BaseButton&gt;</pre>
    </div>
  </div>
</template>
