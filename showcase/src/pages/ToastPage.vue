<script setup lang="ts">
import { BaseButton, useToast } from '@morscherlab/mld-sdk'

const { success, error, warning, info } = useToast()

function showSuccess() {
  success('Operation completed successfully!')
}

function showError() {
  error('Something went wrong. Please try again.')
}

function showWarning() {
  warning('Please review your changes before submitting.')
}

function showInfo() {
  info('Your session will expire in 5 minutes.')
}

function showMultiple() {
  success('File uploaded')
  setTimeout(() => info('Processing file...'), 300)
  setTimeout(() => success('File processed'), 600)
}

function showLongMessage() {
  info('This is a longer toast message that demonstrates how the component handles text that might wrap to multiple lines.')
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">ToastNotification</h1>
    <p class="text-text-secondary mb-8">
      A toast notification system using the <code>useToast()</code> composable. Toasts appear in the top-right corner and auto-dismiss.
    </p>

    <!-- Trigger Buttons -->
    <div class="demo-section">
      <h3>Toast Types</h3>
      <p class="text-sm text-text-secondary mb-4">Click the buttons to trigger different toast types</p>
      <div class="demo-grid">
        <BaseButton variant="success" @click="showSuccess">Success Toast</BaseButton>
        <BaseButton variant="danger" @click="showError">Error Toast</BaseButton>
        <BaseButton variant="secondary" @click="showWarning">Warning Toast</BaseButton>
        <BaseButton variant="primary" @click="showInfo">Info Toast</BaseButton>
      </div>
    </div>

    <!-- Multiple Toasts -->
    <div class="demo-section">
      <h3>Multiple Toasts</h3>
      <p class="text-sm text-text-secondary mb-4">Multiple toasts stack vertically</p>
      <BaseButton variant="cta" @click="showMultiple">Show Multiple Toasts</BaseButton>
    </div>

    <!-- Long Message -->
    <div class="demo-section">
      <h3>Long Message</h3>
      <p class="text-sm text-text-secondary mb-4">Toasts handle longer messages gracefully</p>
      <BaseButton variant="secondary" @click="showLongMessage">Show Long Toast</BaseButton>
    </div>

    <!-- Composable API -->
    <div class="demo-section">
      <h3>useToast() API</h3>
      <pre class="code-block">import { useToast } from '@morscherlab/mld-sdk'

const { success, error, warning, info, toasts, dismiss } = useToast()

// Show toasts
success('Saved successfully!')
error('Failed to save')
warning('Unsaved changes')
info('Tip: Press Ctrl+S to save')

// Access active toasts
console.log(toasts.value)

// Manually dismiss a toast
dismiss(toastId)</pre>
    </div>

    <!-- Toast Type -->
    <div class="demo-section">
      <h3>Toast Type</h3>
      <pre class="code-block">interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}</pre>
    </div>

    <!-- Methods Table -->
    <div class="demo-section">
      <h3>Methods</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Arguments</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>success()</code></td>
            <td><code>message: string</code></td>
            <td>Show a success toast</td>
          </tr>
          <tr>
            <td><code>error()</code></td>
            <td><code>message: string</code></td>
            <td>Show an error toast</td>
          </tr>
          <tr>
            <td><code>warning()</code></td>
            <td><code>message: string</code></td>
            <td>Show a warning toast</td>
          </tr>
          <tr>
            <td><code>info()</code></td>
            <td><code>message: string</code></td>
            <td>Show an info toast</td>
          </tr>
          <tr>
            <td><code>dismiss()</code></td>
            <td><code>id: number</code></td>
            <td>Dismiss a specific toast by ID</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Properties Table -->
    <div class="demo-section">
      <h3>Reactive Properties</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>toasts</code></td>
            <td><code>Ref&lt;Toast[]&gt;</code></td>
            <td>Array of currently active toasts</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Setup Instructions -->
    <div class="demo-section">
      <h3>Setup</h3>
      <p class="text-sm text-text-secondary mb-4">
        Add the <code>ToastNotification</code> component to your app root (usually App.vue):
      </p>
      <pre class="code-block">&lt;script setup&gt;
import { ToastNotification } from '@morscherlab/mld-sdk'
&lt;/script&gt;

&lt;template&gt;
  &lt;div&gt;
    &lt;!-- Your app content --&gt;
    &lt;router-view /&gt;

    &lt;!-- Toast container (renders via Teleport to body) --&gt;
    &lt;ToastNotification /&gt;
  &lt;/div&gt;
&lt;/template&gt;</pre>
    </div>

    <!-- Behavior Notes -->
    <div class="demo-section">
      <h3>Behavior</h3>
      <ul class="space-y-2 text-sm text-text-secondary">
        <li>Toasts auto-dismiss after 3 seconds</li>
        <li>Click a toast to dismiss it immediately</li>
        <li>Multiple toasts stack vertically</li>
        <li>Toasts use Teleport to render at the body root</li>
        <li>Animated entrance and exit transitions</li>
      </ul>
    </div>
  </div>
</template>
