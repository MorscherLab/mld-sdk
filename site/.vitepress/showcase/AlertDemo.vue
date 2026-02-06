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
  <!-- All Types -->
  <DemoSection title="Alert Types">
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
  </DemoSection>

  <!-- With Title -->
  <DemoSection title="With Title">
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
  </DemoSection>

  <!-- Dismissible -->
  <DemoSection title="Dismissible">
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
  </DemoSection>

  <!-- Long Content -->
  <DemoSection title="Long Content">
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
  </DemoSection>
</template>
