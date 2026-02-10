<script setup lang="ts">
import { ref } from 'vue'
import DataFrame from './DataFrame.vue'
import type { DataFrameColumn, PaginationState } from '../types'

const columns: DataFrameColumn[] = [
  { key: 'id', label: 'ID', sortable: true, width: 60, align: 'center' },
  { key: 'compound', label: 'Compound', sortable: true },
  { key: 'concentration', label: 'Conc. (uM)', sortable: true, align: 'right' },
  { key: 'response', label: 'Response (%)', sortable: true, align: 'right' },
  { key: 'well', label: 'Well', align: 'center' },
  { key: 'status', label: 'Status' },
]

const data = [
  { id: 1, compound: 'MLD-2847', concentration: 10.0, response: 95.2, well: 'A1', status: 'Pass' },
  { id: 2, compound: 'MLD-2847', concentration: 3.33, response: 82.1, well: 'A2', status: 'Pass' },
  { id: 3, compound: 'MLD-2847', concentration: 1.11, response: 54.7, well: 'A3', status: 'Pass' },
  { id: 4, compound: 'MLD-2847', concentration: 0.37, response: 23.4, well: 'A4', status: 'Pass' },
  { id: 5, compound: 'MLD-2847', concentration: 0.12, response: 8.9, well: 'A5', status: 'Pass' },
  { id: 6, compound: 'MLD-3192', concentration: 10.0, response: 88.7, well: 'B1', status: 'Pass' },
  { id: 7, compound: 'MLD-3192', concentration: 3.33, response: 71.3, well: 'B2', status: 'Pass' },
  { id: 8, compound: 'MLD-3192', concentration: 1.11, response: 45.2, well: 'B3', status: 'Flagged' },
  { id: 9, compound: 'MLD-3192', concentration: 0.37, response: 18.6, well: 'B4', status: 'Pass' },
  { id: 10, compound: 'MLD-3192', concentration: 0.12, response: 5.1, well: 'B5', status: 'Pass' },
  { id: 11, compound: 'Vehicle', concentration: 0, response: 2.3, well: 'C1', status: 'Pass' },
  { id: 12, compound: 'Vehicle', concentration: 0, response: 1.8, well: 'C2', status: 'Pass' },
]

const selectedKeys = ref<(string | number)[]>([])
const pagination = ref<PaginationState>({ page: 1, pageSize: 5, total: data.length })
</script>

<template>
  <Story title="Data Display/DataFrame">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
          <DataFrame
            :data="data"
            :columns="columns"
            row-key="id"
            :striped="state.striped"
            :bordered="state.bordered"
            :sortable="state.sortable"
            :searchable="state.searchable"
            :selectable="state.selectable"
            :loading="state.loading"
            :size="state.size"
            :sticky-header="state.stickyHeader"
            :selected-keys="selectedKeys"
            @update:selected-keys="selectedKeys = $event"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="['sm', 'md', 'lg'].map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.striped" title="Striped" />
        <HstCheckbox v-model="state.bordered" title="Bordered" />
        <HstCheckbox v-model="state.sortable" title="Sortable" />
        <HstCheckbox v-model="state.searchable" title="Searchable" />
        <HstCheckbox v-model="state.selectable" title="Selectable" />
        <HstCheckbox v-model="state.stickyHeader" title="Sticky Header" />
        <HstCheckbox v-model="state.loading" title="Loading" />
      </template>
    </Variant>

    <Variant title="Sortable with Search">
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <DataFrame
          :data="data"
          :columns="columns"
          row-key="id"
          sortable
          searchable
          search-placeholder="Search compounds, wells..."
        />
      </div>
    </Variant>

    <Variant title="With Pagination">
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <DataFrame
          :data="data"
          :columns="columns"
          row-key="id"
          sortable
          :pagination="pagination"
          @update:pagination="pagination = $event"
        />
      </div>
    </Variant>

    <Variant title="Selectable Rows">
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <DataFrame
          :data="data"
          :columns="columns"
          row-key="id"
          selectable
          :selected-keys="selectedKeys"
          @update:selected-keys="selectedKeys = $event"
        />
        <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          Selected IDs: {{ selectedKeys.length ? selectedKeys.join(', ') : 'none' }}
        </p>
      </div>
    </Variant>

    <Variant title="Loading State">
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <DataFrame
          :data="[]"
          :columns="columns"
          loading
        />
      </div>
    </Variant>

    <Variant title="Empty State">
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <DataFrame
          :data="[]"
          :columns="columns"
          empty-text="No experiment results found. Run an analysis to populate this table."
        />
      </div>
    </Variant>

    <Variant title="Compact (sm)">
      <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
        <DataFrame
          :data="data"
          :columns="columns"
          row-key="id"
          size="sm"
          sortable
          bordered
        />
      </div>
    </Variant>
  </Story>
</template>
