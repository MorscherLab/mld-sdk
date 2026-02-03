<script setup lang="ts">
import { computed } from 'vue'
import type { SampleType } from '../types'

interface Props {
  modelValue?: string
  samples: SampleType[]
  showCounts?: boolean
  editable?: boolean
  colorPalette?: string[]
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  samples: () => [],
  showCounts: true,
  editable: false,
  colorPalette: () => [
    '#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6',
    '#F97316', '#06B6D4', '#14B8A6', '#6B7280',
  ],
  size: 'md',
  orientation: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [sampleId: string | undefined]
  'sample-click': [sample: SampleType]
  'sample-add': []
  'sample-remove': [sampleId: string]
  'color-change': [sampleId: string, color: string]
}>()


function getSampleColor(sample: SampleType, index: number): string {
  return sample.color || props.colorPalette[index % props.colorPalette.length]
}

function handleSampleClick(sample: SampleType) {
  const newValue = props.modelValue === sample.id ? undefined : sample.id
  emit('sample-click', sample)
  emit('update:modelValue', newValue)
}

function handleRemove(event: Event, sampleId: string) {
  event.stopPropagation()
  emit('sample-remove', sampleId)
}

function handleAdd() {
  emit('sample-add')
}
</script>

<template>
  <div :class="['mld-sample-legend', `mld-sample-legend--${orientation}`]" role="list" aria-label="Sample types">
    <button
      v-for="(sample, index) in samples"
      :key="sample.id"
      type="button"
      role="listitem"
      :aria-pressed="modelValue === sample.id"
      :class="[
        'mld-sample-legend__item',
        `mld-sample-legend__item--${size}`,
        modelValue === sample.id ? 'mld-sample-legend__item--selected' : '',
      ]"
      @click="handleSampleClick(sample)"
    >
      <span
        :class="['mld-sample-legend__swatch', `mld-sample-legend__swatch--${size}`]"
        :style="{ backgroundColor: getSampleColor(sample, index) }"
        :aria-hidden="true"
      />

      <span :class="['mld-sample-legend__name', `mld-sample-legend__name--${size}`]">
        {{ sample.name }}
      </span>

      <span
        v-if="showCounts && sample.count !== undefined"
        :class="['mld-sample-legend__count', `mld-sample-legend__count--${size}`]"
      >
        {{ sample.count }}
      </span>

      <button
        v-if="editable"
        type="button"
        class="mld-sample-legend__remove"
        :aria-label="`Remove ${sample.name}`"
        @click="handleRemove($event, sample.id)"
      >
        <svg class="mld-sample-legend__remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </button>

    <button
      v-if="editable"
      type="button"
      :class="['mld-sample-legend__add', `mld-sample-legend__add--${size}`]"
      aria-label="Add sample type"
      @click="handleAdd"
    >
      <svg :class="`mld-sample-legend__add-icon--${size}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span :class="`mld-sample-legend__add-text--${size}`">Add</span>
    </button>
  </div>
</template>

<style>
@import '../styles/components/sample-legend.css';
</style>
