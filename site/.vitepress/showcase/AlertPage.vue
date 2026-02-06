<script setup lang="ts">
import { ref } from 'vue'
import { AlertBox } from '@morscherlab/mld-sdk'

const dismissedAlerts = ref<Set<string>>(new Set())

function dismissAlert(type: string) {
  dismissedAlerts.value.add(type)
}

function resetAlerts() {
  dismissedAlerts.value.clear()
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">AlertBox</h1>
    <p class="text-text-secondary mb-8">
      An alert component for displaying important messages with different severity levels.
    </p>

    <!-- All Types -->
    <div class="demo-section">
      <h3>Alert Types</h3>
      <div class="space-y-4">
        <AlertBox type="success">
          This is a success alert. Your changes have been saved.
        </AlertBox>

        <AlertBox type="error">
          This is an error alert. Something went wrong.
        </AlertBox>

        <AlertBox type="warning">
          This is a warning alert. Please review before proceeding.
        </AlertBox>

        <AlertBox type="info">
          This is an info alert. Here's some helpful information.
        </AlertBox>
      </div>
    </div>

    <!-- With Title -->
    <div class="demo-section">
      <h3>With Title</h3>
      <div class="space-y-4">
        <AlertBox type="success" title="Success!">
          Your profile has been updated successfully.
        </AlertBox>

        <AlertBox type="error" title="Error">
          Failed to save changes. Please try again.
        </AlertBox>

        <AlertBox type="warning" title="Warning">
          Your session will expire in 5 minutes.
        </AlertBox>

        <AlertBox type="info" title="Did you know?">
          You can customize your dashboard by dragging widgets.
        </AlertBox>
      </div>
    </div>

    <!-- Dismissible -->
    <div class="demo-section">
      <h3>Dismissible</h3>
      <p class="text-sm text-text-secondary mb-4">Click the X button to dismiss</p>

      <div class="space-y-4">
        <AlertBox
          v-if="!dismissedAlerts.has('success-dismiss')"
          type="success"
          title="Dismissible Success"
          dismissible
          @dismiss="dismissAlert('success-dismiss')"
        >
          Click the X button to dismiss this alert.
        </AlertBox>

        <AlertBox
          v-if="!dismissedAlerts.has('error-dismiss')"
          type="error"
          title="Dismissible Error"
          dismissible
          @dismiss="dismissAlert('error-dismiss')"
        >
          This alert can also be dismissed.
        </AlertBox>

        <AlertBox
          v-if="!dismissedAlerts.has('warning-dismiss')"
          type="warning"
          title="Dismissible Warning"
          dismissible
          @dismiss="dismissAlert('warning-dismiss')"
        >
          Close me when you're done reading.
        </AlertBox>

        <AlertBox
          v-if="!dismissedAlerts.has('info-dismiss')"
          type="info"
          title="Dismissible Info"
          dismissible
          @dismiss="dismissAlert('info-dismiss')"
        >
          This information can be dismissed once noted.
        </AlertBox>

        <button
          v-if="dismissedAlerts.size > 0"
          class="text-sm text-mld-primary hover:underline"
          @click="resetAlerts"
        >
          Reset dismissed alerts
        </button>
      </div>
    </div>

    <!-- Long Content -->
    <div class="demo-section">
      <h3>Long Content</h3>
      <AlertBox type="info" title="Terms Update">
        <p class="mb-2">We've updated our terms of service. Here are the key changes:</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Updated data retention policies</li>
          <li>New privacy controls</li>
          <li>Clarified usage guidelines</li>
          <li>Added accessibility features</li>
        </ul>
        <p class="mt-2">Please review the full document for more details.</p>
      </AlertBox>
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
            <td><code>type</code></td>
            <td><code>AlertType</code></td>
            <td><code>'info'</code></td>
            <td>Alert severity type</td>
          </tr>
          <tr>
            <td><code>title</code></td>
            <td><code>string</code></td>
            <td>-</td>
            <td>Optional alert title</td>
          </tr>
          <tr>
            <td><code>dismissible</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Show dismiss button</td>
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
            <td><code>dismiss</code></td>
            <td>-</td>
            <td>Emitted when dismiss button is clicked</td>
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
            <td>Alert content</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Code Example -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;AlertBox type="success" title="Saved!"&gt;
  Your changes have been saved successfully.
&lt;/AlertBox&gt;

&lt;AlertBox
  type="error"
  title="Error"
  dismissible
  @dismiss="handleDismiss"
&gt;
  Failed to load data. Please try again.
&lt;/AlertBox&gt;</pre>
    </div>
  </div>
</template>
