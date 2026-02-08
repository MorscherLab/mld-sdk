<script setup lang="ts">
import { Breadcrumb } from '@morscherlab/mld-sdk'

const basicItems = [
  { label: 'Home' },
  { label: 'Experiments' },
  { label: 'EXP-001' },
]

const longItems = [
  { label: 'Home' },
  { label: 'Projects' },
  { label: 'Metabolomics' },
  { label: 'Experiment A' },
  { label: 'Results' },
]
</script>

<template>
  <!-- Basic -->
  <DemoSection title="Basic">
    <Breadcrumb :items="basicItems" />
  </DemoSection>

  <!-- Custom Separator -->
  <DemoSection title="Custom Separator">
    <Breadcrumb :items="basicItems" separator=">" />
  </DemoSection>

  <!-- Long Path -->
  <DemoSection title="Long Path">
    <Breadcrumb :items="longItems" />
  </DemoSection>
</template>
