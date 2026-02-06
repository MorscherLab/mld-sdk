<script setup>
import DataFrameDemo from '../.vitepress/showcase/DataFrameDemo.vue'
</script>

# DataFrame

Data table with sorting, searching, pagination, and row selection. Supports custom column formatters, nested key access, and cell/header slots.

## Demo

<ClientOnly>
  <DataFrameDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Record<string, unknown>[]` | — | Array of row objects |
| `columns` | `DataFrameColumn[]` | — | Column definitions |
| `rowKey` | `string \| Function` | index | Unique key per row |
| `striped` | `boolean` | `true` | Alternate row colors |
| `bordered` | `boolean` | `true` | Show table borders |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Row height |
| `stickyHeader` | `boolean` | `false` | Sticky header on scroll |
| `maxHeight` | `string \| number` | — | Max table height (enables scroll) |
| `loading` | `boolean` | `false` | Show loading overlay |
| `emptyText` | `string` | `'No data'` | Empty state message |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `sort` | `SortState \| null` | — | Controlled sort state |
| `pagination` | `PaginationState \| false` | `false` | Pagination config |
| `searchable` | `boolean` | `false` | Show search input |
| `searchPlaceholder` | `string` | `'Search...'` | Search placeholder |
| `searchKeys` | `string[]` | all columns | Columns to search |
| `selectable` | `boolean` | `false` | Enable row checkboxes |
| `selectedKeys` | `(string \| number)[]` | `[]` | Selected row keys |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:sort` | `SortState \| null` | Sort state changed |
| `update:pagination` | `PaginationState` | Page changed |
| `update:selectedKeys` | `(string \| number)[]` | Selection changed |
| `row-click` | `row, index` | Row was clicked |
| `cell-click` | `value, column, row` | Cell was clicked |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `cell-{key}` | `value, row, column, index` | Custom cell content |
| `header-{key}` | `column` | Custom header content |
| `empty` | — | Custom empty state |
| `loading` | — | Custom loading indicator |
| `footer` | — | Custom footer/pagination |

## Column Definition

```typescript
interface DataFrameColumn {
  key: string          // Supports nested keys: 'user.name'
  label: string        // Header text
  sortable?: boolean   // Enable sorting
  align?: 'left' | 'center' | 'right'
  width?: string | number
  minWidth?: string | number
  ellipsis?: boolean   // Truncate overflow
  formatter?: (value, row, index) => string
}
```

## Usage

```vue
<template>
  <DataFrame
    :data="rows"
    :columns="[
      { key: 'name', label: 'Name', sortable: true },
      { key: 'value', label: 'Value', align: 'right',
        formatter: (v) => v.toFixed(2) },
    ]"
    sortable
    searchable
    :pagination="{ page: 1, pageSize: 10, total: rows.length }"
  />
</template>
```
