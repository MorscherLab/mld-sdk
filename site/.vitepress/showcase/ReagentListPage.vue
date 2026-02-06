<script setup lang="ts">
import { ref } from 'vue'
import { ReagentList, BaseToggle, BaseSelect } from '@morscherlab/mld-sdk'

type StorageCondition = 'RT' | '4C' | '-20C' | '-80C'
type ReagentColumn = 'name' | 'catalog' | 'lot' | 'expiry' | 'storage' | 'location' | 'stock' | 'supplier'

interface Reagent {
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

const readonly = ref(false)
const showStockLevel = ref(true)
const sortable = ref(true)
const searchable = ref(true)
const lowStockThreshold = ref(20)

const columns = ref<ReagentColumn[]>(['name', 'lot', 'expiry', 'storage', 'stock'])

const columnOptions = [
  { value: 'all', label: 'All Columns' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'inventory', label: 'Inventory Focus' },
]

const columnPreset = ref('all')

function updateColumns(preset: string | number) {
  columnPreset.value = String(preset)
  switch (preset) {
    case 'all':
      columns.value = ['name', 'catalog', 'lot', 'expiry', 'storage', 'location', 'stock', 'supplier']
      break
    case 'minimal':
      columns.value = ['name', 'expiry', 'stock']
      break
    case 'inventory':
      columns.value = ['name', 'lot', 'storage', 'location', 'stock']
      break
  }
}

// Demo reagents with various states
const reagents = ref<Reagent[]>([
  {
    id: '1',
    name: 'DMEM High Glucose',
    catalogNumber: '11965092',
    lotNumber: '2389456',
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    storageCondition: '4C',
    location: 'Cold Room A',
    stockLevel: 85,
    supplier: 'Gibco',
    url: 'https://www.thermofisher.com/order/catalog/product/11965092',
  },
  {
    id: '2',
    name: 'Fetal Bovine Serum',
    catalogNumber: 'F2442',
    lotNumber: 'SLCD6543',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    storageCondition: '-20C',
    location: 'Freezer 1, Shelf 2',
    stockLevel: 45,
    supplier: 'Sigma-Aldrich',
  },
  {
    id: '3',
    name: 'Trypsin-EDTA (0.25%)',
    catalogNumber: '25200056',
    lotNumber: '2401234',
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days (expiring soon)
    storageCondition: '-20C',
    location: 'Freezer 1, Shelf 1',
    stockLevel: 15, // Low stock
    supplier: 'Gibco',
  },
  {
    id: '4',
    name: 'Penicillin-Streptomycin',
    catalogNumber: '15140122',
    lotNumber: '2398765',
    expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Expired
    storageCondition: '-20C',
    location: 'Freezer 2',
    stockLevel: 5,
    supplier: 'Gibco',
  },
  {
    id: '5',
    name: 'DMSO (Cell Culture Grade)',
    catalogNumber: 'D2650',
    lotNumber: 'SHBM1234',
    expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years
    storageCondition: 'RT',
    location: 'Cabinet B3',
    stockLevel: 100,
    supplier: 'Sigma-Aldrich',
  },
  {
    id: '6',
    name: 'PBS (Phosphate Buffered Saline)',
    catalogNumber: '10010023',
    lotNumber: '2456789',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    storageCondition: 'RT',
    location: 'Cabinet A1',
    stockLevel: 60,
    supplier: 'Gibco',
  },
])

function handleAdd() {
  console.log('Add reagent clicked')
  // In real app, would open a modal to add new reagent
}

function handleEdit(reagent: Reagent) {
  console.log('Edit reagent:', reagent)
}

function handleRemove(reagentId: string) {
  console.log('Remove reagent:', reagentId)
}

function handleReorder(reagentId: string, fromIndex: number, toIndex: number) {
  console.log('Reorder:', reagentId, 'from', fromIndex, 'to', toIndex)
}
</script>

<template>
  <div class="max-w-6xl">
    <h1 class="text-3xl font-bold text-text-primary mb-2">ReagentList</h1>
    <p class="text-text-secondary mb-8">
      Inventory table for managing laboratory reagents with stock level indicators, expiry warnings, and storage conditions.
    </p>

    <!-- Interactive Demo -->
    <div class="demo-section">
      <h3>Interactive Demo</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-bg-secondary rounded-lg border border-border">
        <div>
          <label class="block text-sm text-text-secondary mb-1">Columns</label>
          <BaseSelect
            :model-value="columnPreset"
            :options="columnOptions"
            size="sm"
            @update:model-value="updateColumns"
          />
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="readonly" size="sm" />
          <span class="text-sm text-text-secondary">Readonly</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="showStockLevel" size="sm" />
          <span class="text-sm text-text-secondary">Show Stock</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="sortable" size="sm" />
          <span class="text-sm text-text-secondary">Sortable</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseToggle v-model="searchable" size="sm" />
          <span class="text-sm text-text-secondary">Searchable</span>
        </div>
      </div>

      <ReagentList
        v-model="reagents"
        :readonly="readonly"
        :show-stock-level="showStockLevel"
        :sortable="sortable"
        :searchable="searchable"
        :columns="columns"
        :low-stock-threshold="lowStockThreshold"
        @add="handleAdd"
        @edit="handleEdit"
        @remove="handleRemove"
        @reorder="handleReorder"
      />
    </div>

    <!-- Status Indicators -->
    <div class="demo-section">
      <h3>Status Indicators</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">Expired</span>
          </div>
          <p class="text-xs text-text-muted">Reagent past expiration date</p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">Expiring Soon</span>
          </div>
          <p class="text-xs text-text-muted">Within 30 days of expiry</p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-16 h-2 bg-red-500 rounded" />
          </div>
          <p class="text-xs text-text-muted">Low stock (&lt;20%)</p>
        </div>
        <div class="p-4 bg-bg-secondary rounded-lg border border-border">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">-20C</span>
          </div>
          <p class="text-xs text-text-muted">Storage temperature badge</p>
        </div>
      </div>
    </div>

    <!-- Storage Conditions -->
    <div class="demo-section">
      <h3>Storage Conditions</h3>
      <div class="flex gap-4">
        <span class="px-3 py-1 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">RT</span>
        <span class="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">4C</span>
        <span class="px-3 py-1 text-sm bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 rounded">-20C</span>
        <span class="px-3 py-1 text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded">-80C</span>
      </div>
    </div>

    <!-- Props Table -->
    <div class="demo-section">
      <h3>Props</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>Reagent[]</code></td>
            <td><code>[]</code></td>
            <td>Array of reagents (v-model)</td>
          </tr>
          <tr>
            <td><code>readonly</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disable editing and reordering</td>
          </tr>
          <tr>
            <td><code>showStockLevel</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show stock level progress bars</td>
          </tr>
          <tr>
            <td><code>lowStockThreshold</code></td>
            <td><code>number</code></td>
            <td><code>10</code></td>
            <td>Threshold for low stock warning (%)</td>
          </tr>
          <tr>
            <td><code>columns</code></td>
            <td><code>ReagentColumn[]</code></td>
            <td><code>['name', 'lot', 'expiry', 'storage', 'stock']</code></td>
            <td>Visible columns</td>
          </tr>
          <tr>
            <td><code>sortable</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Enable column sorting and drag reorder</td>
          </tr>
          <tr>
            <td><code>searchable</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Show search input</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Events -->
    <div class="demo-section">
      <h3>Events</h3>
      <table class="props-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>Reagent[]</code></td>
            <td>Emitted when reagents change</td>
          </tr>
          <tr>
            <td><code>add</code></td>
            <td>-</td>
            <td>Add button clicked</td>
          </tr>
          <tr>
            <td><code>edit</code></td>
            <td><code>Reagent</code></td>
            <td>Edit button clicked for reagent</td>
          </tr>
          <tr>
            <td><code>remove</code></td>
            <td><code>string</code></td>
            <td>Reagent removed (by ID)</td>
          </tr>
          <tr>
            <td><code>reorder</code></td>
            <td><code>reagentId, fromIndex, toIndex</code></td>
            <td>Reagent dragged to new position</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Reagent Type -->
    <div class="demo-section">
      <h3>Reagent Type</h3>
      <pre class="code-block">interface Reagent {
  id: string
  name: string
  catalogNumber?: string
  lotNumber?: string
  expiryDate?: Date | string
  storageCondition?: 'RT' | '4C' | '-20C' | '-80C'
  location?: string
  stockLevel?: number  // 0-100 percentage
  stockUnit?: string
  supplier?: string
  url?: string         // Link to product page
}

type ReagentColumn =
  | 'name' | 'catalog' | 'lot' | 'expiry'
  | 'storage' | 'location' | 'stock' | 'supplier'</pre>
    </div>

    <!-- Usage -->
    <div class="demo-section">
      <h3>Usage</h3>
      <pre class="code-block">&lt;ReagentList
  v-model="reagents"
  :columns="['name', 'lot', 'expiry', 'storage', 'stock']"
  :low-stock-threshold="20"
  sortable
  searchable
  @add="openAddModal"
  @edit="openEditModal"
/&gt;</pre>
    </div>
  </div>
</template>
