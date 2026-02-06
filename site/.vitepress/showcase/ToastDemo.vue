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
  <!-- Trigger Buttons -->
  <DemoSection title="Toast Types">
    <p class="text-sm text-text-secondary mb-4">Click the buttons to trigger different toast types</p>
    <div class="demo-grid">
      <BaseButton variant="success" @click="showSuccess">Success Toast</BaseButton>
      <BaseButton variant="danger" @click="showError">Error Toast</BaseButton>
      <BaseButton variant="secondary" @click="showWarning">Warning Toast</BaseButton>
      <BaseButton variant="primary" @click="showInfo">Info Toast</BaseButton>
    </div>
  </DemoSection>

  <!-- Multiple Toasts -->
  <DemoSection title="Multiple Toasts">
    <p class="text-sm text-text-secondary mb-4">Multiple toasts stack vertically</p>
    <BaseButton variant="cta" @click="showMultiple">Show Multiple Toasts</BaseButton>
  </DemoSection>

  <!-- Long Message -->
  <DemoSection title="Long Message">
    <p class="text-sm text-text-secondary mb-4">Toasts handle longer messages gracefully</p>
    <BaseButton variant="secondary" @click="showLongMessage">Show Long Toast</BaseButton>
  </DemoSection>
</template>
