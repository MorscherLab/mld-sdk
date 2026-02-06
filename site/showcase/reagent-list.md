<script setup>
import ReagentListDemo from '../.vitepress/showcase/ReagentListDemo.vue'
</script>

# ReagentList

Inventory table for managing laboratory reagents with stock level indicators, expiry warnings, and storage conditions.

## Demo

<ClientOnly>
  <ReagentListDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Reagent[]` | `[]` | Array of reagents (v-model) |
| `readonly` | `boolean` | `false` | Disable editing and reordering |
| `showStockLevel` | `boolean` | `true` | Show stock level progress bars |
| `lowStockThreshold` | `number` | `10` | Threshold for low stock warning (%) |
| `columns` | `ReagentColumn[]` | `['name', 'lot', 'expiry', 'storage', 'stock']` | Visible columns |
| `sortable` | `boolean` | `true` | Enable column sorting and drag reorder |
| `searchable` | `boolean` | `true` | Show search input |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Reagent[]` | Emitted when reagents change |
| `add` | - | Add button clicked |
| `edit` | `Reagent` | Edit button clicked for reagent |
| `remove` | `string` | Reagent removed (by ID) |
| `reorder` | `reagentId, fromIndex, toIndex` | Reagent dragged to new position |

## Types

```typescript
interface Reagent {
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
  | 'storage' | 'location' | 'stock' | 'supplier'
```

## Usage

```vue
<ReagentList
  v-model="reagents"
  :columns="['name', 'lot', 'expiry', 'storage', 'stock']"
  :low-stock-threshold="20"
  sortable
  searchable
  @add="openAddModal"
  @edit="openEditModal"
/>
```
