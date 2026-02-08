<script setup lang="ts">
import { AuditTrail } from '@morscherlab/mld-sdk'

const entries = [
  {
    id: '1',
    type: 'create' as const,
    action: 'Created experiment',
    detail: 'Experiment "Dose Response - Compound A" was created',
    user: 'Jane Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'update' as const,
    action: 'Updated plate layout',
    detail: 'Modified well assignments in Plate 1',
    user: 'Bob Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    type: 'system' as const,
    action: 'Analysis completed',
    detail: 'IC50 calculation finished successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '4',
    type: 'delete' as const,
    action: 'Removed sample group',
    detail: 'Group "Control B" was removed',
    user: 'Jane Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '5',
    type: 'update' as const,
    action: 'Changed concentration units',
    user: 'Alice Wang',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
]
</script>

<template>
  <DemoSection title="Basic Timeline">
    <AuditTrail :entries="entries" />
  </DemoSection>

  <DemoSection title="With Filters">
    <AuditTrail :entries="entries" :show-filters="true" />
  </DemoSection>

  <DemoSection title="Oldest First">
    <AuditTrail :entries="entries" order="oldest" max-height="200px" />
  </DemoSection>

  <DemoSection title="Empty State">
    <AuditTrail :entries="[]" empty-message="No changes recorded yet" />
  </DemoSection>

  <DemoSection title="Small Size">
    <AuditTrail :entries="entries.slice(0, 3)" size="sm" />
  </DemoSection>
</template>
