<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataFrameColumn, SortState, PaginationState } from '../types'

/**
 * DataFrame - Data table with sorting, searching, pagination, and row selection.
 *
 * @example
 * ```vue
 * <DataFrame
 *   :data="rows"
 *   :columns="[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'age', label: 'Age', align: 'right' }
 *   ]"
 *   sortable
 *   searchable
 *   :pagination="{ page: 1, pageSize: 10, total: 100 }"
 * />
 * ```
 */
interface Props {
  /** Array of data objects */
  data: Record<string, unknown>[]
  /** Column definitions */
  columns: DataFrameColumn[]
  /** Unique key for each row (property name or function) */
  rowKey?: string | ((row: Record<string, unknown>) => string | number)
  /** Alternate row background colors */
  striped?: boolean
  /** Show table borders */
  bordered?: boolean
  /** Table size */
  size?: 'sm' | 'md' | 'lg'
  /** Make header sticky on scroll */
  stickyHeader?: boolean
  /** Maximum table height (enables vertical scroll) */
  maxHeight?: string | number
  /** Show loading overlay */
  loading?: boolean
  /** Empty state message */
  emptyText?: string
  /** Enable column sorting */
  sortable?: boolean
  /** Current sort state (controlled mode) */
  sort?: SortState | null
  /** Pagination state or false to disable */
  pagination?: PaginationState | false
  /** Enable search input */
  searchable?: boolean
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Column keys to search (defaults to all) */
  searchKeys?: string[]
  /** Enable row selection with checkboxes */
  selectable?: boolean
  /** Currently selected row keys */
  selectedKeys?: (string | number)[]
}

const props = withDefaults(defineProps<Props>(), {
  striped: true,
  bordered: true,
  size: 'md',
  stickyHeader: false,
  loading: false,
  emptyText: 'No data',
  sortable: false,
  pagination: false,
  searchable: false,
  searchPlaceholder: 'Search...',
  selectable: false,
  selectedKeys: () => [],
})

/**
 * @event update:sort - Emitted when sort state changes
 * @event update:pagination - Emitted when page changes
 * @event update:selectedKeys - Emitted when row selection changes
 * @event row-click - Emitted when a row is clicked
 * @event cell-click - Emitted when a cell is clicked
 */
const emit = defineEmits<{
  'update:sort': [sort: SortState | null]
  'update:pagination': [pagination: PaginationState]
  'update:selectedKeys': [keys: (string | number)[]]
  'row-click': [row: Record<string, unknown>, index: number]
  'cell-click': [value: unknown, column: DataFrameColumn, row: Record<string, unknown>]
}>()

const searchQuery = ref('')
const internalSort = ref<SortState | null>(null)

const activeSort = computed(() => props.sort !== undefined ? props.sort : internalSort.value)

function getRowKey(row: Record<string, unknown>, index: number): string | number {
  if (!props.rowKey) return index
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  return row[props.rowKey] as string | number
}

function getCellValue(row: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce((obj: unknown, k) => {
    if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k]
    return undefined
  }, row)
}

function formatCell(col: DataFrameColumn, row: Record<string, unknown>, index: number): string {
  const value = getCellValue(row, col.key)
  if (col.formatter) return col.formatter(value, row, index)
  if (value === null || value === undefined) return ''
  return String(value)
}

// Filtering
const filteredData = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) return props.data
  const query = searchQuery.value.toLowerCase()
  const keys = props.searchKeys ?? props.columns.map(c => c.key)
  return props.data.filter(row =>
    keys.some(key => {
      const val = getCellValue(row, key)
      return val !== null && val !== undefined && String(val).toLowerCase().includes(query)
    })
  )
})

// Sorting
const sortedData = computed(() => {
  const sort = activeSort.value
  if (!sort || !sort.direction) return filteredData.value

  const col = props.columns.find(c => c.key === sort.key)
  if (!col) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aVal = getCellValue(a, sort.key)
    const bVal = getCellValue(b, sort.key)

    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    let cmp = 0
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal
    } else {
      cmp = String(aVal).localeCompare(String(bVal))
    }
    return sort.direction === 'asc' ? cmp : -cmp
  })
})

// Pagination
const paginatedData = computed(() => {
  if (!props.pagination) return sortedData.value
  const { page, pageSize } = props.pagination
  const start = (page - 1) * pageSize
  return sortedData.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.max(1, Math.ceil(sortedData.value.length / props.pagination.pageSize))
})

function handleSort(col: DataFrameColumn) {
  if (!col.sortable && !props.sortable) return

  const current = activeSort.value
  let next: SortState | null

  if (current?.key === col.key) {
    if (current.direction === 'asc') {
      next = { key: col.key, direction: 'desc' }
    } else if (current.direction === 'desc') {
      next = null
    } else {
      next = { key: col.key, direction: 'asc' }
    }
  } else {
    next = { key: col.key, direction: 'asc' }
  }

  if (props.sort === undefined) {
    internalSort.value = next
  }
  emit('update:sort', next)
}

function handlePageChange(page: number) {
  if (!props.pagination) return
  emit('update:pagination', { ...props.pagination, page, total: sortedData.value.length })
}

function isColumnSortable(col: DataFrameColumn): boolean {
  return col.sortable === true || (props.sortable && col.sortable !== false)
}

// Selection
const allSelected = computed(() => {
  if (!props.selectable || paginatedData.value.length === 0) return false
  return paginatedData.value.every((row, i) =>
    props.selectedKeys.includes(getRowKey(row, i))
  )
})

const selectIndeterminate = computed(() => {
  return props.selectedKeys.length > 0 && !allSelected.value
})

function toggleSelectAll() {
  if (allSelected.value) {
    emit('update:selectedKeys', [])
  } else {
    emit('update:selectedKeys', paginatedData.value.map((row, i) => getRowKey(row, i)))
  }
}

function toggleRowSelect(key: string | number) {
  const next = [...props.selectedKeys]
  const idx = next.indexOf(key)
  if (idx >= 0) {
    next.splice(idx, 1)
  } else {
    next.push(key)
  }
  emit('update:selectedKeys', next)
}

const wrapperStyle = computed(() => {
  if (!props.maxHeight) return undefined
  const maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  return { maxHeight, overflowY: 'auto' as const }
})
</script>

<template>
  <div
    :class="[
      'mld-dataframe',
      { 'mld-dataframe--bordered': bordered },
    ]"
  >
    <!-- Search header -->
    <div v-if="searchable" class="mld-dataframe__header">
      <div class="mld-dataframe__search-wrapper">
        <svg class="mld-dataframe__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.34-4.34" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="mld-dataframe__search"
          :placeholder="searchPlaceholder"
        />
      </div>
    </div>

    <!-- Table wrapper -->
    <div class="mld-dataframe__table-wrapper" :style="wrapperStyle">
      <table class="mld-dataframe__table">
        <thead :class="['mld-dataframe__thead', { 'mld-dataframe__thead--sticky': stickyHeader }]">
          <tr>
            <th v-if="selectable" class="mld-dataframe__th mld-dataframe__th--checkbox">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="selectIndeterminate"
                class="mld-dataframe__checkbox"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'mld-dataframe__th',
                `mld-dataframe__th--${size}`,
                `mld-dataframe__th--align-${col.align ?? 'left'}`,
                {
                  'mld-dataframe__th--sortable': isColumnSortable(col),
                  'mld-dataframe__th--sorted': activeSort?.key === col.key && activeSort?.direction,
                },
              ]"
              :style="{
                width: col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : undefined,
                minWidth: col.minWidth ? (typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth) : undefined,
              }"
              @click="isColumnSortable(col) ? handleSort(col) : undefined"
            >
              <slot :name="`header-${col.key}`" :column="col">
                <div class="mld-dataframe__th-content">
                  <span>{{ col.label }}</span>
                  <svg
                    v-if="isColumnSortable(col)"
                    :class="[
                      'mld-dataframe__sort-icon',
                      {
                        'mld-dataframe__sort-icon--asc': activeSort?.key === col.key && activeSort?.direction === 'asc',
                        'mld-dataframe__sort-icon--desc': activeSort?.key === col.key && activeSort?.direction === 'desc',
                      },
                    ]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" />
                  </svg>
                </div>
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="getRowKey(row, rowIndex)"
            :class="[
              'mld-dataframe__row',
              {
                'mld-dataframe__row--striped': striped && rowIndex % 2 === 1,
                'mld-dataframe__row--selected': selectedKeys.includes(getRowKey(row, rowIndex)),
              },
            ]"
            @click="emit('row-click', row, rowIndex)"
          >
            <td v-if="selectable" class="mld-dataframe__td mld-dataframe__td--checkbox">
              <input
                type="checkbox"
                :checked="selectedKeys.includes(getRowKey(row, rowIndex))"
                class="mld-dataframe__checkbox"
                @click.stop
                @change="toggleRowSelect(getRowKey(row, rowIndex))"
              />
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'mld-dataframe__td',
                `mld-dataframe__td--${size}`,
                `mld-dataframe__td--align-${col.align ?? 'left'}`,
                { 'mld-dataframe__td--ellipsis': col.ellipsis },
              ]"
              @click.stop="emit('cell-click', getCellValue(row, col.key), col, row)"
            >
              <slot :name="`cell-${col.key}`" :value="getCellValue(row, col.key)" :row="row" :column="col" :index="rowIndex">
                {{ formatCell(col, row, rowIndex) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="paginatedData.length === 0 && !loading" class="mld-dataframe__empty">
        <slot name="empty">
          <svg class="mld-dataframe__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <p class="mld-dataframe__empty-text">{{ emptyText }}</p>
        </slot>
      </div>

      <!-- Loading overlay -->
      <div v-if="loading" class="mld-dataframe__loading">
        <slot name="loading">
          <svg class="mld-dataframe__loading-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
        </slot>
      </div>
    </div>

    <!-- Footer / Pagination -->
    <div v-if="pagination" class="mld-dataframe__footer">
      <slot name="footer">
        <span class="mld-dataframe__page-info">
          {{ (pagination.page - 1) * pagination.pageSize + 1 }}&ndash;{{ Math.min(pagination.page * pagination.pageSize, sortedData.length) }}
          of {{ sortedData.length }}
        </span>
        <div class="mld-dataframe__page-controls">
          <button
            type="button"
            class="mld-dataframe__page-btn"
            :disabled="pagination.page <= 1"
            @click="handlePageChange(pagination.page - 1)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span class="mld-dataframe__page-number">{{ pagination.page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="mld-dataframe__page-btn"
            :disabled="pagination.page >= totalPages"
            @click="handlePageChange(pagination.page + 1)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
@import '../styles/components/dataframe.css';
</style>
