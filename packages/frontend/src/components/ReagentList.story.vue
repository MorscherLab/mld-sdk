<script setup lang="ts">
import ReagentList from './ReagentList.vue'
import type { Reagent } from './ReagentList.vue'

const today = new Date()
const pastDate = new Date(today)
pastDate.setMonth(pastDate.getMonth() - 2)
const soonDate = new Date(today)
soonDate.setDate(soonDate.getDate() + 15)
const futureDate = new Date(today)
futureDate.setFullYear(futureDate.getFullYear() + 1)

const mockReagents: Reagent[] = [
  {
    id: 'r1',
    name: 'DMEM High Glucose',
    catalogNumber: '11965092',
    lotNumber: '2584391',
    expiryDate: futureDate.toISOString(),
    storageCondition: '4C',
    location: 'Fridge A, Shelf 2',
    stockLevel: 75,
    stockUnit: '%',
    supplier: 'Gibco',
    url: 'https://www.thermofisher.com',
  },
  {
    id: 'r2',
    name: 'Fetal Bovine Serum',
    catalogNumber: '10082147',
    lotNumber: '2612847',
    expiryDate: soonDate.toISOString(),
    storageCondition: '-20C',
    location: 'Freezer B, Rack 3',
    stockLevel: 15,
    stockUnit: '%',
    supplier: 'Gibco',
  },
  {
    id: 'r3',
    name: 'Trypsin-EDTA (0.25%)',
    catalogNumber: '25200056',
    lotNumber: '2598412',
    expiryDate: pastDate.toISOString(),
    storageCondition: '-20C',
    location: 'Freezer B, Rack 1',
    stockLevel: 5,
    stockUnit: '%',
    supplier: 'Gibco',
  },
  {
    id: 'r4',
    name: 'Cisplatin',
    catalogNumber: 'P4394',
    lotNumber: 'SLCH2891',
    expiryDate: futureDate.toISOString(),
    storageCondition: 'RT',
    location: 'Chemical Cabinet',
    stockLevel: 90,
    stockUnit: '%',
    supplier: 'Sigma-Aldrich',
  },
  {
    id: 'r5',
    name: 'CellTiter-Glo 2.0',
    catalogNumber: 'G9242',
    lotNumber: '0000561234',
    expiryDate: futureDate.toISOString(),
    storageCondition: '-80C',
    location: 'Freezer C, Rack 1',
    stockLevel: 45,
    stockUnit: '%',
    supplier: 'Promega',
  },
]

function initState() {
  return {
    modelValue: mockReagents,
    readonly: false,
    showStockLevel: true,
    lowStockThreshold: 10,
    sortable: true,
    searchable: true,
  }
}
</script>

<template>
  <Story title="Lab/ReagentList">
    <Variant title="Playground" :init-state="initState">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <ReagentList
            v-model="state.modelValue"
            :readonly="state.readonly"
            :show-stock-level="state.showStockLevel"
            :low-stock-threshold="state.lowStockThreshold"
            :sortable="state.sortable"
            :searchable="state.searchable"
          />
        </div>
      </template>
      <template #controls="{ state }">
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.showStockLevel" title="Show Stock Level" />
        <HstSlider v-model="state.lowStockThreshold" title="Low Stock Threshold (%)" :min="0" :max="50" />
        <HstCheckbox v-model="state.sortable" title="Sortable" />
        <HstCheckbox v-model="state.searchable" title="Searchable" />
      </template>
    </Variant>

    <Variant title="Readonly">
      <div style="padding: 2rem;">
        <ReagentList
          :model-value="mockReagents"
          readonly
        />
      </div>
    </Variant>

    <Variant title="All Columns">
      <div style="padding: 2rem;">
        <ReagentList
          :model-value="mockReagents"
          :columns="['name', 'catalog', 'lot', 'expiry', 'storage', 'location', 'stock', 'supplier']"
        />
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="padding: 2rem;">
        <ReagentList :model-value="[]" />
      </div>
    </Variant>
  </Story>
</template>
