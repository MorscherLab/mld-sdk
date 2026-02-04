<script setup lang="ts">
import { ref, computed } from 'vue'

export type StorageCondition = 'RT' | '4C' | '-20C' | '-80C'

export type ReagentColumn =
  | 'name'
  | 'catalog'
  | 'lot'
  | 'expiry'
  | 'storage'
  | 'location'
  | 'stock'
  | 'supplier'

export interface Reagent {
  id: string
  name: string
  catalogNumber?: string
  lotNumber?: string
  expiryDate?: Date | string
  storageCondition?: StorageCondition
  location?: string
  stockLevel?: number
  stockUnit?: string
  supplier?: string
  url?: string
}

interface Props {
  modelValue?: Reagent[]
  readonly?: boolean
  showStockLevel?: boolean
  lowStockThreshold?: number
  columns?: ReagentColumn[]
  sortable?: boolean
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  readonly: false,
  showStockLevel: true,
  lowStockThreshold: 10,
  columns: () => ['name', 'lot', 'expiry', 'storage', 'stock'],
  sortable: true,
  searchable: true,
})

const emit = defineEmits<{
  'update:modelValue': [reagents: Reagent[]]
  'add': []
  'edit': [reagent: Reagent]
  'remove': [reagentId: string]
  'reorder': [reagentId: string, fromIndex: number, toIndex: number]
}>()

// State
const searchQuery = ref('')
const sortColumn = ref<ReagentColumn | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const draggedId = ref<string | null>(null)
const dragOverId = ref<string | null>(null)

// Column configuration
const columnLabels: Record<ReagentColumn, string> = {
  name: 'Name',
  catalog: 'Catalog #',
  lot: 'Lot #',
  expiry: 'Expiry',
  storage: 'Storage',
  location: 'Location',
  stock: 'Stock',
  supplier: 'Supplier',
}

// Computed
const filteredReagents = computed(() => {
  let result = [...(props.modelValue || [])]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.catalogNumber?.toLowerCase().includes(query) ||
        r.lotNumber?.toLowerCase().includes(query) ||
        r.supplier?.toLowerCase().includes(query)
    )
  }

  // Sort
  if (sortColumn.value) {
    const col = sortColumn.value
    result.sort((a, b) => {
      let aVal: string | number | null | undefined = getColumnValue(a, col) as string | number | null | undefined
      let bVal: string | number | null | undefined = getColumnValue(b, col) as string | number | null | undefined

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

function getColumnValue(reagent: Reagent, column: ReagentColumn): unknown {
  switch (column) {
    case 'name':
      return reagent.name
    case 'catalog':
      return reagent.catalogNumber
    case 'lot':
      return reagent.lotNumber
    case 'expiry':
      return reagent.expiryDate ? new Date(reagent.expiryDate).getTime() : null
    case 'storage':
      return reagent.storageCondition
    case 'location':
      return reagent.location
    case 'stock':
      return reagent.stockLevel
    case 'supplier':
      return reagent.supplier
    default:
      return null
  }
}

// Helpers
function isExpired(reagent: Reagent): boolean {
  if (!reagent.expiryDate) return false
  const expiry = new Date(reagent.expiryDate)
  return expiry < new Date()
}

function isExpiringSoon(reagent: Reagent, daysThreshold = 30): boolean {
  if (!reagent.expiryDate) return false
  const expiry = new Date(reagent.expiryDate)
  const now = new Date()
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold
}

function isLowStock(reagent: Reagent): boolean {
  if (reagent.stockLevel === undefined) return false
  return reagent.stockLevel <= props.lowStockThreshold
}

function formatExpiryDate(date: Date | string | undefined): string {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function getStockLevel(reagent: Reagent): number {
  return reagent.stockLevel ?? 0
}

function getStockFillClass(level: number): string {
  if (level >= 50) return 'mld-reagent-list__stock-fill--good'
  if (level >= 20) return 'mld-reagent-list__stock-fill--warning'
  return 'mld-reagent-list__stock-fill--low'
}

function getRowClass(reagent: Reagent): string[] {
  const classes: string[] = ['mld-reagent-list__row']
  if (isExpired(reagent)) classes.push('mld-reagent-list__row--expired')
  else if (isExpiringSoon(reagent)) classes.push('mld-reagent-list__row--expiring-soon')
  if (isLowStock(reagent)) classes.push('mld-reagent-list__row--low-stock')
  if (draggedId.value === reagent.id) classes.push('mld-reagent-list__row--dragging')
  if (dragOverId.value === reagent.id) classes.push('mld-reagent-list__row--drag-over')
  return classes
}

// Actions
function handleSort(column: ReagentColumn) {
  if (!props.sortable) return
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

function handleEdit(reagent: Reagent) {
  emit('edit', reagent)
}

function handleRemove(reagentId: string) {
  emit('remove', reagentId)
  const updated = (props.modelValue || []).filter((r) => r.id !== reagentId)
  emit('update:modelValue', updated)
}

function handleAdd() {
  emit('add')
}

// Drag and drop
function handleDragStart(event: DragEvent, reagent: Reagent) {
  if (props.readonly || !props.sortable) return
  draggedId.value = reagent.id
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', reagent.id)
  }
}

function handleDragOver(event: DragEvent, reagent: Reagent) {
  if (props.readonly || !props.sortable || !draggedId.value) return
  event.preventDefault()
  dragOverId.value = reagent.id
}

function handleDragLeave() {
  dragOverId.value = null
}

function handleDrop(event: DragEvent, targetReagent: Reagent) {
  if (props.readonly || !props.sortable || !draggedId.value) return
  event.preventDefault()

  const reagents = [...(props.modelValue || [])]
  const fromIndex = reagents.findIndex((r) => r.id === draggedId.value)
  const toIndex = reagents.findIndex((r) => r.id === targetReagent.id)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    draggedId.value = null
    dragOverId.value = null
    return
  }

  const [removed] = reagents.splice(fromIndex, 1)
  reagents.splice(toIndex, 0, removed)

  emit('reorder', draggedId.value, fromIndex, toIndex)
  emit('update:modelValue', reagents)

  draggedId.value = null
  dragOverId.value = null
}

function handleDragEnd() {
  draggedId.value = null
  dragOverId.value = null
}
</script>

<template>
  <div class="mld-reagent-list">
    <!-- Header -->
    <div class="mld-reagent-list__header">
      <!-- Search -->
      <div v-if="searchable" class="mld-reagent-list__search">
        <svg class="mld-reagent-list__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="mld-reagent-list__search-input"
          placeholder="Search reagents..."
        />
      </div>

      <!-- Add button -->
      <button
        v-if="!readonly"
        type="button"
        class="mld-reagent-list__add-btn"
        @click="handleAdd"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add
      </button>
    </div>

    <!-- Table -->
    <table v-if="filteredReagents.length > 0" class="mld-reagent-list__table">
      <thead>
        <tr>
          <th v-if="sortable && !readonly" style="width: 24px" />
          <th
            v-for="col in columns"
            :key="col"
            :class="[sortable ? 'mld-reagent-list__col--sortable' : '']"
            @click="handleSort(col)"
          >
            {{ columnLabels[col] }}
            <svg
              v-if="sortable"
              :class="[
                'mld-reagent-list__sort-icon',
                sortColumn === col ? 'mld-reagent-list__sort-icon--active' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="sortColumn === col && sortDirection === 'desc'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </th>
          <th v-if="!readonly" style="width: 80px" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="reagent in filteredReagents"
          :key="reagent.id"
          :class="getRowClass(reagent)"
          :draggable="sortable && !readonly"
          @dragstart="handleDragStart($event, reagent)"
          @dragover="handleDragOver($event, reagent)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, reagent)"
          @dragend="handleDragEnd"
        >
          <!-- Drag handle -->
          <td v-if="sortable && !readonly">
            <svg class="mld-reagent-list__drag-handle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </td>

          <!-- Name -->
          <td v-if="columns.includes('name')" class="mld-reagent-list__cell mld-reagent-list__cell--name">
            <a
              v-if="reagent.url"
              :href="reagent.url"
              target="_blank"
              rel="noopener noreferrer"
              class="mld-reagent-list__link"
            >
              {{ reagent.name }}
            </a>
            <span v-else>{{ reagent.name }}</span>
          </td>

          <!-- Catalog number -->
          <td v-if="columns.includes('catalog')" class="mld-reagent-list__cell mld-reagent-list__cell--muted">
            {{ reagent.catalogNumber || '-' }}
          </td>

          <!-- Lot number -->
          <td v-if="columns.includes('lot')" class="mld-reagent-list__cell mld-reagent-list__cell--muted">
            {{ reagent.lotNumber || '-' }}
          </td>

          <!-- Expiry -->
          <td v-if="columns.includes('expiry')" class="mld-reagent-list__cell">
            <span v-if="isExpired(reagent)" class="mld-reagent-list__expired-text">
              {{ formatExpiryDate(reagent.expiryDate) }}
            </span>
            <span v-else-if="isExpiringSoon(reagent)" class="mld-reagent-list__expiring-text">
              {{ formatExpiryDate(reagent.expiryDate) }}
            </span>
            <span v-else>
              {{ formatExpiryDate(reagent.expiryDate) }}
            </span>

            <!-- Expiry badge -->
            <span v-if="isExpired(reagent)" class="mld-reagent-list__badge mld-reagent-list__badge--error">
              <svg class="mld-reagent-list__badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Expired
            </span>
            <span v-else-if="isExpiringSoon(reagent)" class="mld-reagent-list__badge mld-reagent-list__badge--warning">
              <svg class="mld-reagent-list__badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Soon
            </span>
          </td>

          <!-- Storage -->
          <td v-if="columns.includes('storage')" class="mld-reagent-list__cell">
            <span
              v-if="reagent.storageCondition"
              :class="['mld-reagent-list__storage', `mld-reagent-list__storage--${reagent.storageCondition}`]"
            >
              {{ reagent.storageCondition }}
            </span>
            <span v-else class="mld-reagent-list__cell--muted">-</span>
          </td>

          <!-- Location -->
          <td v-if="columns.includes('location')" class="mld-reagent-list__cell mld-reagent-list__cell--muted">
            {{ reagent.location || '-' }}
          </td>

          <!-- Stock -->
          <td v-if="columns.includes('stock') && showStockLevel" class="mld-reagent-list__cell">
            <div v-if="reagent.stockLevel !== undefined" class="mld-reagent-list__stock">
              <div class="mld-reagent-list__stock-bar">
                <div
                  :class="['mld-reagent-list__stock-fill', getStockFillClass(getStockLevel(reagent))]"
                  :style="{ width: `${Math.min(100, getStockLevel(reagent))}%` }"
                />
              </div>
              <span class="mld-reagent-list__stock-text">
                {{ getStockLevel(reagent) }}%
              </span>
            </div>
            <span v-else class="mld-reagent-list__cell--muted">-</span>
          </td>

          <!-- Supplier -->
          <td v-if="columns.includes('supplier')" class="mld-reagent-list__cell mld-reagent-list__cell--muted">
            {{ reagent.supplier || '-' }}
          </td>

          <!-- Actions -->
          <td v-if="!readonly" class="mld-reagent-list__cell mld-reagent-list__cell--actions">
            <button
              type="button"
              class="mld-reagent-list__action-btn"
              aria-label="Edit"
              @click="handleEdit(reagent)"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              type="button"
              class="mld-reagent-list__action-btn mld-reagent-list__action-btn--danger"
              aria-label="Remove"
              @click="handleRemove(reagent.id)"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state -->
    <div v-else class="mld-reagent-list__empty">
      <svg class="mld-reagent-list__empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
      <p class="mld-reagent-list__empty-text">
        {{ searchQuery ? 'No reagents found' : 'No reagents added yet' }}
      </p>
      <button
        v-if="!readonly && !searchQuery"
        type="button"
        class="mld-reagent-list__empty-btn"
        @click="handleAdd"
      >
        Add Reagent
      </button>
    </div>
  </div>
</template>

<style>
@import '../styles/components/reagent-list.css';
</style>
