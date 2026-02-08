<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

type BatchItemStatus = 'pending' | 'processing' | 'completed' | 'error' | 'skipped'

interface BatchItem {
  id: string
  label: string
  status: BatchItemStatus
  progress?: number
  message?: string
}

interface BatchSummary {
  total: number
  completed: number
  processing: number
  error: number
  pending: number
  skipped: number
  percent: number
}

interface Props {
  items: BatchItem[]
  showSummary?: boolean
  title?: string
  maxHeight?: string
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSummary: true,
  autoScroll: true,
})

const emit = defineEmits<{
  'retry': [id: string]
  'cancel': [id: string]
}>()

const listRef = ref<HTMLElement | null>(null)
const expandedErrors = ref<Set<string>>(new Set())

const summary = computed<BatchSummary>(() => {
  const total = props.items.length
  const completed = props.items.filter(i => i.status === 'completed').length
  const processing = props.items.filter(i => i.status === 'processing').length
  const error = props.items.filter(i => i.status === 'error').length
  const pending = props.items.filter(i => i.status === 'pending').length
  const skipped = props.items.filter(i => i.status === 'skipped').length
  const percent = total > 0 ? Math.round(((completed + skipped) / total) * 100) : 0
  return { total, completed, processing, error, pending, skipped, percent }
})

function toggleError(id: string) {
  if (expandedErrors.value.has(id)) {
    expandedErrors.value.delete(id)
  } else {
    expandedErrors.value.add(id)
  }
}

watch(
  () => props.items.map(i => i.status),
  (newStatuses, oldStatuses) => {
    if (!props.autoScroll || !listRef.value) return
    for (let i = 0; i < newStatuses.length; i++) {
      if (newStatuses[i] === 'processing' && oldStatuses?.[i] !== 'processing') {
        nextTick(() => {
          const el = listRef.value?.querySelector(`[data-item-id="${props.items[i].id}"]`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
        break
      }
    }
  },
)
</script>

<template>
  <div class="mld-batch-progress">
    <div v-if="title" class="mld-batch-progress__header">
      <span class="mld-batch-progress__title">{{ title }}</span>
      <span class="mld-batch-progress__percent">{{ summary.percent }}%</span>
    </div>

    <div class="mld-batch-progress__overall">
      <div
        class="mld-batch-progress__overall-bar"
        :style="{ width: `${summary.percent}%` }"
      />
    </div>

    <slot v-if="showSummary" name="summary" :summary="summary">
      <div class="mld-batch-progress__summary">
        <span v-if="summary.completed" class="mld-batch-progress__summary-item mld-batch-progress__summary-item--completed">
          {{ summary.completed }} completed
        </span>
        <span v-if="summary.processing" class="mld-batch-progress__summary-item mld-batch-progress__summary-item--processing">
          {{ summary.processing }} processing
        </span>
        <span v-if="summary.error" class="mld-batch-progress__summary-item mld-batch-progress__summary-item--error">
          {{ summary.error }} failed
        </span>
        <span v-if="summary.pending" class="mld-batch-progress__summary-item mld-batch-progress__summary-item--pending">
          {{ summary.pending }} pending
        </span>
        <span v-if="summary.skipped" class="mld-batch-progress__summary-item mld-batch-progress__summary-item--skipped">
          {{ summary.skipped }} skipped
        </span>
      </div>
    </slot>

    <div
      ref="listRef"
      class="mld-batch-progress__list"
      :style="maxHeight ? { maxHeight, overflowY: 'auto' } : {}"
    >
      <div
        v-for="item in items"
        :key="item.id"
        :data-item-id="item.id"
        :class="['mld-batch-progress__item', `mld-batch-progress__item--${item.status}`]"
      >
        <slot name="item" :item="item">
          <div class="mld-batch-progress__item-row">
            <!-- Status icon -->
            <div :class="['mld-batch-progress__item-icon', `mld-batch-progress__item-icon--${item.status}`]">
              <!-- Pending: clock -->
              <svg v-if="item.status === 'pending'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 4.5V8l2.5 1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- Processing: spinner -->
              <svg v-else-if="item.status === 'processing'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 1.5A6.5 6.5 0 1 1 1.5 8" stroke-linecap="round" />
              </svg>
              <!-- Completed: checkmark -->
              <svg v-else-if="item.status === 'completed'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- Error: x -->
              <svg v-else-if="item.status === 'error'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <!-- Skipped: dash -->
              <svg v-else viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 8h8" stroke-linecap="round" />
              </svg>
            </div>

            <span class="mld-batch-progress__item-label">{{ item.label }}</span>

            <!-- Mini progress bar for processing items -->
            <div v-if="item.status === 'processing' && item.progress !== undefined" class="mld-batch-progress__item-progress">
              <div class="mld-batch-progress__item-progress-bar" :style="{ width: `${item.progress}%` }" />
            </div>

            <!-- Actions -->
            <div class="mld-batch-progress__item-actions">
              <button
                v-if="item.status === 'error'"
                type="button"
                class="mld-batch-progress__retry-btn"
                @click.stop="emit('retry', item.id)"
              >
                Retry
              </button>
              <button
                v-if="item.status === 'processing'"
                type="button"
                class="mld-batch-progress__cancel-btn"
                @click.stop="emit('cancel', item.id)"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- Error message (expandable) -->
          <div v-if="item.status === 'error' && item.message" class="mld-batch-progress__item-error">
            <button
              type="button"
              class="mld-batch-progress__error-toggle"
              @click.stop="toggleError(item.id)"
            >
              {{ expandedErrors.has(item.id) ? 'Hide error' : 'Show error' }}
            </button>
            <div v-if="expandedErrors.has(item.id)" class="mld-batch-progress__item-message">
              {{ item.message }}
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
@import '../styles/components/batch-progress-list.css';
</style>
