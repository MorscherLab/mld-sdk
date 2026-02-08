<script setup lang="ts">
import { ref } from 'vue'
import { SequenceInput } from '@morscherlab/mld-sdk'

const dnaSeq = ref('ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG')
const proteinSeq = ref('MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSH')
const emptySeq = ref('')
</script>

<template>
  <DemoSection title="DNA Input">
    <SequenceInput v-model="dnaSeq" type="dna" />
  </DemoSection>

  <DemoSection title="Protein Input">
    <SequenceInput v-model="proteinSeq" type="protein" />
  </DemoSection>

  <DemoSection title="Auto-detect">
    <SequenceInput v-model="emptySeq" placeholder="Paste a sequence to auto-detect type..." />
  </DemoSection>

  <DemoSection title="Readonly Viewer">
    <SequenceInput :model-value="dnaSeq" type="dna" :readonly="true" />
  </DemoSection>

  <DemoSection title="Disabled">
    <SequenceInput model-value="ATCG" type="dna" :disabled="true" />
  </DemoSection>
</template>
