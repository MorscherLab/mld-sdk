<script setup lang="ts">
import { StatusIndicator } from '@morscherlab/mld-sdk'

const statuses = ['success', 'warning', 'error', 'info', 'muted'] as const
</script>

<template>
  <!-- Statuses -->
  <DemoSection title="Statuses">
    <div class="flex flex-wrap gap-6">
      <StatusIndicator
        v-for="status in statuses"
        :key="status"
        :status="status"
        :label="status.charAt(0).toUpperCase() + status.slice(1)"
      />
    </div>
  </DemoSection>

  <!-- Pulsing -->
  <DemoSection title="Pulsing">
    <div class="flex gap-6">
      <StatusIndicator status="success" :pulse="true" label="Active" />
      <StatusIndicator status="error" :pulse="true" label="Alert" />
    </div>
  </DemoSection>

  <!-- Custom Color -->
  <DemoSection title="Custom Color">
    <StatusIndicator color="#8B5CF6" label="Custom" />
  </DemoSection>

  <!-- Without Labels -->
  <DemoSection title="Without Labels">
    <div class="flex gap-4">
      <StatusIndicator
        v-for="status in statuses"
        :key="status"
        :status="status"
      />
    </div>
  </DemoSection>
</template>
