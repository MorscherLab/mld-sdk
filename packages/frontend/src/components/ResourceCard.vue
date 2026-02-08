<script setup lang="ts">
import { computed } from 'vue'
import BasePill from './BasePill.vue'
import type { ResourceStatus, ResourceSpec } from '../types/components'

interface Props {
  name: string
  description?: string
  status?: ResourceStatus
  image?: string
  location?: string
  specs?: ResourceSpec[]
  tags?: string[]
  nextAvailable?: string
  showBookAction?: boolean
  compact?: boolean
  size?: 'sm' | 'md' | 'lg'
  statusLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'available',
  specs: () => [],
  tags: () => [],
  showBookAction: true,
  compact: false,
  size: 'md',
})

const emit = defineEmits<{
  book: []
  click: []
}>()

const defaultStatusLabels: Record<ResourceStatus, string> = {
  'available': 'Available',
  'in-use': 'In Use',
  'maintenance': 'Maintenance',
  'offline': 'Offline',
}

const displayStatusLabel = computed(() => props.statusLabel ?? defaultStatusLabels[props.status])

const cardClasses = computed(() => [
  'mld-resource-card',
  `mld-resource-card--${props.size}`,
  { 'mld-resource-card--compact': props.compact },
])

function handleBook(event: MouseEvent) {
  event.stopPropagation()
  emit('book')
}

function handleClick() {
  emit('click')
}
</script>

<template>
  <!-- Compact mode -->
  <div v-if="compact" :class="cardClasses" @click="handleClick">
    <slot name="status">
      <span :class="['mld-resource-card__status-dot', `mld-resource-card__status-dot--${status}`]" />
    </slot>

    <span class="mld-resource-card__name">{{ name }}</span>

    <span :class="['mld-resource-card__status-label', `mld-resource-card__status-label--${status}`]">
      {{ displayStatusLabel }}
    </span>

    <slot name="action">
      <button
        v-if="showBookAction"
        type="button"
        class="mld-resource-card__book-btn"
        @click="handleBook"
      >
        Book
      </button>
    </slot>
  </div>

  <!-- Card mode -->
  <div v-else :class="cardClasses" @click="handleClick">
    <div class="mld-resource-card__content">
      <div class="mld-resource-card__header">
        <!-- Image / fallback -->
        <div class="mld-resource-card__image">
          <slot name="image">
            <img v-if="image" :src="image" :alt="name" />
            <div v-else class="mld-resource-card__image-fallback">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 00-.659 1.59V21a.75.75 0 01-.75.75h-6.24a.75.75 0 01-.75-.75v-2.44a2.25 2.25 0 00-.659-1.59L5 14.5m14 0h-2.25m-10.5 0H4" />
              </svg>
            </div>
          </slot>
        </div>

        <!-- Body -->
        <div class="mld-resource-card__body">
          <div class="mld-resource-card__title-row">
            <h3 class="mld-resource-card__name">{{ name }}</h3>

            <slot name="status">
              <div class="mld-resource-card__status">
                <span :class="['mld-resource-card__status-dot', `mld-resource-card__status-dot--${status}`]" />
                <span class="mld-resource-card__status-label">{{ displayStatusLabel }}</span>
              </div>
            </slot>
          </div>

          <p v-if="description" class="mld-resource-card__description">{{ description }}</p>

          <p v-if="location" class="mld-resource-card__location">Location: {{ location }}</p>

          <p v-if="nextAvailable" class="mld-resource-card__next-available">Next available: {{ nextAvailable }}</p>
        </div>
      </div>

      <!-- Specs -->
      <div v-if="specs.length > 0 || $slots.specs" class="mld-resource-card__specs">
        <slot name="specs">
          <div v-for="spec in specs" :key="spec.label" class="mld-resource-card__spec">
            <span class="mld-resource-card__spec-label">{{ spec.label }}</span>
            <span class="mld-resource-card__spec-value">{{ spec.value }}</span>
          </div>
        </slot>
      </div>

      <!-- Tags + action -->
      <div v-if="tags.length > 0 || showBookAction || $slots.action" class="mld-resource-card__footer">
        <div class="mld-resource-card__tags">
          <BasePill v-for="tag in tags" :key="tag" size="sm">{{ tag }}</BasePill>
        </div>

        <div class="mld-resource-card__action">
          <slot name="action">
            <button
              v-if="showBookAction"
              type="button"
              class="mld-resource-card__book-btn"
              @click="handleBook"
            >
              Book Now
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '../styles/components/resource-card.css';
</style>
