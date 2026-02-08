<script setup lang="ts">
import { ref } from 'vue'
import { BatchProgressList } from '@morscherlab/mld-sdk'

const items = ref([
  { id: '1', label: 'Sample_001.raw', status: 'completed' as const },
  { id: '2', label: 'Sample_002.raw', status: 'completed' as const },
  { id: '3', label: 'Sample_003.raw', status: 'processing' as const, progress: 65 },
  { id: '4', label: 'Sample_004.raw', status: 'error' as const, message: 'Failed to parse retention time data: unexpected format in column 3' },
  { id: '5', label: 'Sample_005.raw', status: 'pending' as const },
  { id: '6', label: 'Blank_001.raw', status: 'skipped' as const },
  { id: '7', label: 'Sample_006.raw', status: 'pending' as const },
])

function handleRetry(id: string) {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.status = 'processing'
    item.progress = 0
    item.message = undefined
  }
}
</script>

<template>
  <DemoSection title="Batch Processing">
    <BatchProgressList
      :items="items"
      title="Processing 7 files"
      max-height="400px"
      @retry="handleRetry"
    />
  </DemoSection>

  <DemoSection title="Without Summary">
    <BatchProgressList
      :items="items.slice(0, 3)"
      :show-summary="false"
    />
  </DemoSection>
</template>
