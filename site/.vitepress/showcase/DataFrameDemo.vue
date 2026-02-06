<script setup lang="ts">
import { ref } from 'vue'
import { DataFrame, type DataFrameColumn, type SortState, type PaginationState } from '@morscherlab/mld-sdk'
import { DemoSection } from '../components'

// Sample data
const sampleData = [
  { id: 1, name: 'Aspirin', formula: 'C9H8O4', mw: 180.16, category: 'NSAID', stock: 1250 },
  { id: 2, name: 'Ibuprofen', formula: 'C13H18O2', mw: 206.28, category: 'NSAID', stock: 890 },
  { id: 3, name: 'Acetaminophen', formula: 'C8H9NO2', mw: 151.16, category: 'Analgesic', stock: 2100 },
  { id: 4, name: 'Metformin', formula: 'C4H11N5', mw: 129.16, category: 'Antidiabetic', stock: 560 },
  { id: 5, name: 'Omeprazole', formula: 'C17H19N3O3S', mw: 345.42, category: 'PPI', stock: 340 },
  { id: 6, name: 'Amoxicillin', formula: 'C16H19N3O5S', mw: 365.40, category: 'Antibiotic', stock: 780 },
  { id: 7, name: 'Atorvastatin', formula: 'C33H35FN2O5', mw: 558.64, category: 'Statin', stock: 420 },
  { id: 8, name: 'Lisinopril', formula: 'C21H31N3O5', mw: 405.49, category: 'ACE Inhibitor', stock: 650 },
  { id: 9, name: 'Simvastatin', formula: 'C25H38O5', mw: 418.57, category: 'Statin', stock: 310 },
  { id: 10, name: 'Losartan', formula: 'C22H23ClN6O', mw: 422.91, category: 'ARB', stock: 480 },
  { id: 11, name: 'Gabapentin', formula: 'C9H17NO2', mw: 171.24, category: 'Anticonvulsant', stock: 920 },
  { id: 12, name: 'Ciprofloxacin', formula: 'C17H18FN3O3', mw: 331.34, category: 'Antibiotic', stock: 540 },
]

const basicColumns: DataFrameColumn[] = [
  { key: 'name', label: 'Compound', sortable: true },
  { key: 'formula', label: 'Formula' },
  { key: 'mw', label: 'MW (g/mol)', sortable: true, align: 'right', formatter: (v) => (v as number).toFixed(2) },
  { key: 'category', label: 'Category', sortable: true },
]

const fullColumns: DataFrameColumn[] = [
  { key: 'id', label: '#', width: 50, align: 'center' },
  { key: 'name', label: 'Compound', sortable: true, minWidth: 120 },
  { key: 'formula', label: 'Formula', ellipsis: true },
  { key: 'mw', label: 'MW (g/mol)', sortable: true, align: 'right', formatter: (v) => (v as number).toFixed(2) },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true, align: 'right', formatter: (v) => `${(v as number).toLocaleString()} units` },
]

const sort = ref<SortState | null>(null)
const pagination = ref<PaginationState>({ page: 1, pageSize: 5, total: sampleData.length })
const selectedKeys = ref<(string | number)[]>([])
</script>

<template>
  <DemoSection title="Basic Table" description="Simple data table with sorting">
    <DataFrame
      :data="sampleData.slice(0, 6)"
      :columns="basicColumns"
      row-key="id"
      sortable
    />
  </DemoSection>

  <DemoSection title="Searchable" description="Type to filter rows across all columns">
    <DataFrame
      :data="sampleData"
      :columns="basicColumns"
      row-key="id"
      sortable
      searchable
      search-placeholder="Search compounds..."
    />
  </DemoSection>

  <DemoSection title="Pagination" description="Navigate through pages of data">
    <DataFrame
      :data="sampleData"
      :columns="fullColumns"
      row-key="id"
      sortable
      :sort="sort"
      :pagination="pagination"
      @update:sort="sort = $event"
      @update:pagination="pagination = $event"
    />
  </DemoSection>

  <DemoSection title="Row Selection" description="Select rows with checkboxes">
    <DataFrame
      :data="sampleData.slice(0, 6)"
      :columns="basicColumns"
      row-key="id"
      selectable
      :selected-keys="selectedKeys"
      @update:selected-keys="selectedKeys = $event"
    />
    <div class="text-sm opacity-60 mt-2">
      Selected: {{ selectedKeys.length > 0 ? selectedKeys.join(', ') : 'none' }}
    </div>
  </DemoSection>

  <DemoSection title="Loading State">
    <DataFrame
      :data="[]"
      :columns="basicColumns"
      loading
    />
  </DemoSection>

  <DemoSection title="Empty State">
    <DataFrame
      :data="[]"
      :columns="basicColumns"
      empty-text="No compounds found"
    />
  </DemoSection>

  <DemoSection title="Compact Size" description="Smaller row height for dense data">
    <DataFrame
      :data="sampleData.slice(0, 4)"
      :columns="basicColumns"
      row-key="id"
      size="sm"
    />
  </DemoSection>
</template>
