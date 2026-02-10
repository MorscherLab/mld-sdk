<script setup lang="ts">
import { ref } from 'vue'
import SequenceInput from './SequenceInput.vue'

type SequenceType = 'auto' | 'dna' | 'rna' | 'protein'
const sequenceTypes: SequenceType[] = ['auto', 'dna', 'rna', 'protein']

const sequence = ref('')

const sampleDNA = 'ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGCTAGCTAGCTAGCTAGCTAGCTAGCTGAATTCGATATCAAGCTTATCGATACCGTCGACCTCGAGGGGGGGCCCGGTACCCAATTCGCCCTATAGTGAGTCGTATTACAATTCACTG'
const sampleRNA = 'AUGCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGCUAGCUAGCUAGCUAGCUAGCUAGCUGAAUUCGAUAUCAAGCUUAUCGAU'
const sampleProtein = 'MVLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR'
</script>

<template>
  <Story title="Scientific/SequenceInput">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
          <SequenceInput
            v-model="sequence"
            :type="state.type"
            :readonly="state.readonly"
            :show-stats="state.showStats"
            :show-tools="state.showTools"
            :rows="state.rows"
            :placeholder="state.placeholder"
            :error="state.error"
            :disabled="state.disabled"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.type"
          title="Sequence Type"
          :options="sequenceTypes.map(t => ({ label: t, value: t }))"
        />
        <HstSlider v-model="state.rows" title="Rows" :min="2" :max="20" :step="1" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.showStats" title="Show Stats" />
        <HstCheckbox v-model="state.showTools" title="Show Tools" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
      </template>
    </Variant>

    <Variant title="DNA Sequence">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          GFP coding sequence fragment (auto-detected as DNA)
        </p>
        <SequenceInput :model-value="sampleDNA" type="dna" />
      </div>
    </Variant>

    <Variant title="RNA Sequence">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          mRNA sequence fragment
        </p>
        <SequenceInput :model-value="sampleRNA" type="rna" />
      </div>
    </Variant>

    <Variant title="Protein Sequence">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Human hemoglobin alpha subunit
        </p>
        <SequenceInput :model-value="sampleProtein" type="protein" />
      </div>
    </Variant>

    <Variant title="Readonly Viewer">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Read-only mode with colored bases and line numbers
        </p>
        <SequenceInput :model-value="sampleDNA" type="dna" readonly />
      </div>
    </Variant>

    <Variant title="Without Tools">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <SequenceInput :model-value="sampleDNA" :show-tools="false" />
      </div>
    </Variant>

    <Variant title="Without Stats">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <SequenceInput :model-value="sampleDNA" :show-stats="false" />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <SequenceInput model-value="ATGCGATCG" error />
      </div>
    </Variant>

    <Variant title="Disabled State">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <SequenceInput :model-value="sampleDNA" disabled />
      </div>
    </Variant>

    <Variant title="With Max Length">
      <div style="padding: 2rem; max-width: 600px; margin: 0 auto;">
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Limited to 50 characters
        </p>
        <SequenceInput v-model="sequence" :max-length="50" placeholder="Enter up to 50 bases..." />
      </div>
    </Variant>
  </Story>
</template>
