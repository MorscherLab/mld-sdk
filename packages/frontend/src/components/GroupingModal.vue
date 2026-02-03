<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import BaseSelect from './BaseSelect.vue'
import type { SelectOption } from '../types'

interface Props {
  open: boolean
  samples: string[]
}

interface ParsedRow {
  [key: string]: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  apply: [mapping: Record<string, string[]>, columns: string[]]
}>()

const csvFile = ref<File | null>(null)
const csvData = ref<ParsedRow[]>([])
const csvColumns = ref<string[]>([])
const sampleColumn = ref<string>('')
const groupColumns = ref<string[]>([])
const isDragOver = ref(false)
const parseError = ref<string | null>(null)

const columnOptions = computed<SelectOption[]>(() =>
  csvColumns.value.map(col => ({ value: col, label: col }))
)

const availableGroupColumns = computed<SelectOption[]>(() =>
  csvColumns.value
    .filter(col => col !== sampleColumn.value && !groupColumns.value.includes(col))
    .map(col => ({ value: col, label: col }))
)

const matchedSamples = computed(() => {
  if (!sampleColumn.value || csvData.value.length === 0) return []
  const csvSampleValues = csvData.value.map(row => row[sampleColumn.value])
  return props.samples.filter(sample => csvSampleValues.includes(sample))
})

const unmatchedSamples = computed(() => {
  if (!sampleColumn.value || csvData.value.length === 0) return []
  const csvSampleValues = csvData.value.map(row => row[sampleColumn.value])
  return props.samples.filter(sample => !csvSampleValues.includes(sample))
})

const previewData = computed(() => {
  if (csvData.value.length === 0) return []
  return csvData.value.slice(0, 5)
})

const canApply = computed(() =>
  sampleColumn.value &&
  groupColumns.value.length > 0 &&
  matchedSamples.value.length > 0
)

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    resetState()
  }
})

function resetState() {
  csvFile.value = null
  csvData.value = []
  csvColumns.value = []
  sampleColumn.value = ''
  groupColumns.value = []
  parseError.value = null
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0])
  }
}

async function handleFile(file: File) {
  if (!file.name.endsWith('.csv')) {
    parseError.value = 'Please upload a CSV file'
    return
  }

  csvFile.value = file
  parseError.value = null

  try {
    const text = await file.text()
    parseCSV(text)
  } catch {
    parseError.value = 'Failed to read file'
  }
}

function parseCSV(text: string) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) {
    parseError.value = 'CSV must have at least a header and one data row'
    return
  }

  const headers = parseCSVLine(lines[0])
  csvColumns.value = headers

  const data: ParsedRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length !== headers.length) continue

    const row: ParsedRow = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx]
    })
    data.push(row)
  }

  csvData.value = data

  // Auto-select sample column if there's a likely match
  const sampleColGuess = headers.find(h =>
    h.toLowerCase().includes('sample') ||
    h.toLowerCase().includes('name') ||
    h.toLowerCase().includes('id')
  )
  if (sampleColGuess) {
    sampleColumn.value = sampleColGuess
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())

  return result
}

function addGroupColumn(column: string) {
  if (column && !groupColumns.value.includes(column)) {
    groupColumns.value.push(column)
  }
}

function removeGroupColumn(column: string) {
  groupColumns.value = groupColumns.value.filter(c => c !== column)
}

function moveGroupColumn(index: number, direction: 'up' | 'down') {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= groupColumns.value.length) return

  const cols = [...groupColumns.value]
  const temp = cols[index]
  cols[index] = cols[newIndex]
  cols[newIndex] = temp
  groupColumns.value = cols
}

function applyGrouping() {
  if (!canApply.value) return

  const mapping: Record<string, string[]> = {}

  for (const row of csvData.value) {
    const sampleName = row[sampleColumn.value]
    if (!props.samples.includes(sampleName)) continue

    // Build hierarchical group key
    const groupKey = groupColumns.value.map(col => row[col]).join(' / ')

    if (!mapping[groupKey]) {
      mapping[groupKey] = []
    }
    mapping[groupKey].push(sampleName)
  }

  emit('apply', mapping, groupColumns.value)
  emit('close')
}

function close() {
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="open"
    title="Group by Metadata"
    size="lg"
    @update:model-value="!$event && close()"
    @close="close"
  >
    <div class="mld-grouping-modal">
      <!-- File upload area -->
      <div
        v-if="!csvFile"
        :class="[
          'mld-grouping-modal__dropzone',
          isDragOver ? 'mld-grouping-modal__dropzone--dragover' : '',
        ]"
        @drop="handleDrop"
        @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false"
      >
        <input
          type="file"
          accept=".csv"
          class="mld-grouping-modal__file-input"
          @change="handleFileInput"
        />
        <svg class="mld-grouping-modal__upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mld-grouping-modal__upload-text">
          <span class="mld-grouping-modal__upload-highlight">Click to upload</span>
          or drag and drop a CSV file
        </p>
        <p class="mld-grouping-modal__upload-hint">
          CSV should contain sample names and grouping columns
        </p>
      </div>

      <!-- Error message -->
      <div v-if="parseError" class="mld-grouping-modal__error">
        {{ parseError }}
      </div>

      <!-- Configuration section -->
      <template v-if="csvFile && csvData.length > 0">
        <div class="mld-grouping-modal__file-info">
          <svg class="mld-grouping-modal__file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="mld-grouping-modal__file-name">{{ csvFile.name }}</span>
          <button
            type="button"
            class="mld-grouping-modal__file-clear"
            @click="resetState"
          >
            Change file
          </button>
        </div>

        <!-- Column selection -->
        <div class="mld-grouping-modal__config">
          <div class="mld-grouping-modal__config-row">
            <label class="mld-grouping-modal__label">Sample Column</label>
            <BaseSelect
              v-model="sampleColumn"
              :options="columnOptions"
              placeholder="Select sample column..."
            />
          </div>

          <div class="mld-grouping-modal__config-row">
            <label class="mld-grouping-modal__label">Group Columns</label>
            <div class="mld-grouping-modal__group-columns">
              <!-- Selected group columns with reordering -->
              <div v-if="groupColumns.length > 0" class="mld-grouping-modal__selected-columns">
                <div
                  v-for="(col, index) in groupColumns"
                  :key="col"
                  class="mld-grouping-modal__selected-column"
                >
                  <span class="mld-grouping-modal__column-name">{{ col }}</span>
                  <div class="mld-grouping-modal__column-actions">
                    <button
                      type="button"
                      :disabled="index === 0"
                      class="mld-grouping-modal__column-btn"
                      @click="moveGroupColumn(index, 'up')"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      :disabled="index === groupColumns.length - 1"
                      class="mld-grouping-modal__column-btn"
                      @click="moveGroupColumn(index, 'down')"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="mld-grouping-modal__column-btn mld-grouping-modal__column-btn--remove"
                      @click="removeGroupColumn(col)"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add column dropdown -->
              <BaseSelect
                v-if="availableGroupColumns.length > 0"
                model-value=""
                :options="availableGroupColumns"
                placeholder="Add group column..."
                @update:model-value="addGroupColumn($event as string)"
              />
            </div>
          </div>
        </div>

        <!-- Match status -->
        <div v-if="sampleColumn" class="mld-grouping-modal__match-status">
          <div class="mld-grouping-modal__match-stat mld-grouping-modal__match-stat--matched">
            <span class="mld-grouping-modal__match-count">{{ matchedSamples.length }}</span>
            <span class="mld-grouping-modal__match-label">samples matched</span>
          </div>
          <div
            v-if="unmatchedSamples.length > 0"
            class="mld-grouping-modal__match-stat mld-grouping-modal__match-stat--unmatched"
          >
            <span class="mld-grouping-modal__match-count">{{ unmatchedSamples.length }}</span>
            <span class="mld-grouping-modal__match-label">samples not found in CSV</span>
          </div>
        </div>

        <!-- Preview table -->
        <div v-if="previewData.length > 0" class="mld-grouping-modal__preview">
          <h4 class="mld-grouping-modal__preview-title">Data Preview</h4>
          <div class="mld-grouping-modal__table-wrapper">
            <table class="mld-grouping-modal__table">
              <thead>
                <tr>
                  <th
                    v-for="col in csvColumns"
                    :key="col"
                    :class="[
                      'mld-grouping-modal__th',
                      col === sampleColumn ? 'mld-grouping-modal__th--sample' : '',
                      groupColumns.includes(col) ? 'mld-grouping-modal__th--group' : '',
                    ]"
                  >
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in previewData" :key="idx">
                  <td
                    v-for="col in csvColumns"
                    :key="col"
                    :class="[
                      'mld-grouping-modal__td',
                      col === sampleColumn ? 'mld-grouping-modal__td--sample' : '',
                      groupColumns.includes(col) ? 'mld-grouping-modal__td--group' : '',
                    ]"
                  >
                    {{ row[col] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="csvData.length > 5" class="mld-grouping-modal__preview-note">
            Showing 5 of {{ csvData.length }} rows
          </p>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="mld-grouping-modal__footer">
        <BaseButton variant="secondary" @click="close">Cancel</BaseButton>
        <BaseButton
          variant="primary"
          :disabled="!canApply"
          @click="applyGrouping"
        >
          Apply Grouping
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style>
@import '../styles/components/grouping-modal.css';
</style>
