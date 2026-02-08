<script setup>
import ChemicalFormulaDemo from '../.vitepress/showcase/ChemicalFormulaDemo.vue'
</script>

# ChemicalFormula

Inline rendering of chemical formulas with proper subscripts and superscripts. Handles parenthesized groups, hydrates, and ionic charges.

## Demo

<ClientOnly>
  <ChemicalFormulaDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `formula` | `string` | - | Chemical formula string (e.g. `'Ca(OH)2'`) |
| `inline` | `boolean` | `true` | Render as inline span (true) or block div (false) |

## Usage

```vue
<script setup lang="ts">
import { ChemicalFormula } from '@morscherlab/mld-sdk'
</script>

<template>
  <ChemicalFormula formula="H2O" />
  <ChemicalFormula formula="Ca(OH)2" />
  <ChemicalFormula formula="CuSO4·5H2O" />
  <ChemicalFormula formula="SO4^2-" />
</template>
```
