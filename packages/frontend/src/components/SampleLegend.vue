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

const sizeClasses = computed(() => {
  const sizes = {
    sm: { swatch: 'w-3 h-3', text: 'text-xs', gap: 'gap-1.5', padding: 'px-2 py-1' },
    md: { swatch: 'w-4 h-4', text: 'text-sm', gap: 'gap-2', padding: 'px-3 py-1.5' },
    lg: { swatch: 'w-5 h-5', text: 'text-base', gap: 'gap-2.5', padding: 'px-4 py-2' },
  }
  return sizes[props.size]
})

const containerClasses = computed(() => {
  return props.orientation === 'horizontal'
    ? 'flex flex-wrap items-center gap-2'
    : 'flex flex-col gap-1'
})

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
  <div :class="containerClasses" role="list" aria-label="Sample types">
    <button
      v-for="(sample, index) in samples"
      :key="sample.id"
      type="button"
      role="listitem"
      :aria-pressed="modelValue === sample.id"
      :class="[
        'flex items-center rounded-mld transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-mld-primary focus:ring-offset-1',
        sizeClasses.gap,
        sizeClasses.padding,
        modelValue === sample.id
          ? 'bg-mld-primary/10 ring-1 ring-mld-primary'
          : 'hover:bg-bg-hover',
      ]"
      @click="handleSampleClick(sample)"
    >
      <!-- Color swatch -->
      <span
        :class="[sizeClasses.swatch, 'rounded-sm flex-shrink-0']"
        :style="{ backgroundColor: getSampleColor(sample, index) }"
        :aria-hidden="true"
      />

      <!-- Sample name -->
      <span :class="[sizeClasses.text, 'text-text-primary truncate']">
        {{ sample.name }}
      </span>

      <!-- Count badge -->
      <span
        v-if="showCounts && sample.count !== undefined"
        :class="[
          'text-text-muted bg-bg-secondary rounded-full px-1.5 min-w-[1.5rem] text-center',
          size === 'sm' ? 'text-[10px]' : 'text-xs',
        ]"
      >
        {{ sample.count }}
      </span>

      <!-- Remove button -->
      <button
        v-if="editable"
        type="button"
        class="ml-auto text-text-muted hover:text-mld-danger transition-colors p-0.5 rounded"
        :aria-label="`Remove ${sample.name}`"
        @click="handleRemove($event, sample.id)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </button>

    <!-- Add button -->
    <button
      v-if="editable"
      type="button"
      :class="[
        'flex items-center rounded-mld border-2 border-dashed border-border',
        'text-text-muted hover:text-text-primary hover:border-mld-primary/50 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-mld-primary focus:ring-offset-1',
        sizeClasses.gap,
        sizeClasses.padding,
      ]"
      aria-label="Add sample type"
      @click="handleAdd"
    >
      <svg :class="sizeClasses.swatch" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span :class="sizeClasses.text">Add</span>
    </button>
  </div>
</template>
