<script setup lang="ts">
import { ref } from 'vue'
import { IconButton, type ButtonVariant, type ButtonSize } from '@morscherlab/mld-sdk'

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
    <h1 class="text-3xl font-bold text-text-primary mb-2">IconButton</h1>
    <p class="text-text-secondary mb-8">
      A compact button designed for icon-only actions with accessible labels.
    </p>

    <!-- Variants -->
    <div class="demo-section">
      <h3>Variants</h3>
      <div class="demo-grid">
        <IconButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :label="`${variant} action`"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </IconButton>
      </div>
      <p class="mt-3 text-sm text-text-muted">
        Variants: {{ variants.join(', ') }}
      </p>
    </div>

    <!-- Sizes -->
    <div class="demo-section">
      <h3>Sizes</h3>
      <div class="demo-grid items-end">
        <div v-for="size in sizes" :key="size" class="text-center">
          <IconButton :size="size" label="Edit">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </IconButton>
          <p class="text-xs text-text-muted mt-2">{{ size }}</p>
        </div>
      </div>
    </div>

    <!-- Different Icons -->
    <div class="demo-section">
      <h3>Common Actions</h3>
      <div class="demo-grid">
        <IconButton variant="ghost" label="Edit">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </IconButton>

        <IconButton variant="danger" label="Delete">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </IconButton>

        <IconButton variant="ghost" label="Search">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </IconButton>

        <IconButton variant="ghost" label="Settings">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </IconButton>

        <IconButton variant="ghost" label="Close">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>

        <IconButton variant="ghost" label="Menu">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </IconButton>
      </div>
    </div>

    <!-- Loading State -->
    <div class="demo-section">
      <h3>Loading State</h3>
      <p class="text-sm text-text-secondary mb-4">Click a button to see the loading state</p>
      <div class="demo-grid">
        <IconButton
          v-for="variant in ['primary', 'secondary', 'danger'] as ButtonVariant[]"
          :key="variant"
          :variant="variant"
          :loading="loadingVariant === variant"
          label="Refresh"
          @click="simulateLoading(variant)"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </IconButton>
      </div>
    </div>

    <!-- Disabled State -->
    <div class="demo-section">
      <h3>Disabled State</h3>
      <div class="demo-grid">
        <IconButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          disabled
          label="Disabled"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </IconButton>
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
            <td><code>'ghost'</code></td>
            <td>Button style variant</td>
          </tr>
          <tr>
            <td><code>size</code></td>
            <td><code>ButtonSize</code></td>
            <td><code>'md'</code></td>
            <td>Button size</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td>Required</td>
            <td>Accessible label (aria-label and title)</td>
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
            <td>Emitted when button is clicked</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slots Table -->
    <div class="demo-section">
      <h3>Slots</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>default</code></td>
            <td>Icon content (typically an SVG)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;IconButton
  variant="danger"
  label="Delete item"
  @click="handleDelete"
&gt;
  &lt;svg fill="none" stroke="currentColor" viewBox="0 0 24 24"&gt;
    &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /&gt;
  &lt;/svg&gt;
&lt;/IconButton&gt;</pre>
    </div>

    <!-- Accessibility Note -->
    <div class="demo-section">
      <h3>Accessibility</h3>
      <p class="text-sm text-text-secondary">
        The <code>label</code> prop is required for accessibility. It provides:
      </p>
      <ul class="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
        <li><code>aria-label</code> for screen readers</li>
        <li><code>title</code> for tooltip on hover</li>
      </ul>
    </div>
  </div>
</template>
