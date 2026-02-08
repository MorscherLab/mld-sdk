<script setup>
import ScientificNumberDemo from '../.vitepress/showcase/ScientificNumberDemo.vue'
</script>

# ScientificNumber

Renders numbers in proper scientific notation with Unicode superscripts. Supports auto, scientific, engineering, and compact (SI suffix) modes.

## Demo

<ClientOnly>
  <ScientificNumberDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | The number to display |
| `precision` | `number` | `3` | Decimal precision |
| `notation` | `'auto' \| 'scientific' \| 'engineering' \| 'compact'` | `'auto'` | Display notation mode |
| `unit` | `string` | - | Unit label displayed after the number |
| `copyable` | `boolean` | `false` | Show copy-to-clipboard button |

## Usage

```vue
<script setup lang="ts">
import { ScientificNumber } from '@morscherlab/mld-sdk'
</script>

<template>
  <ScientificNumber :value="0.00023" unit="mol/L" />
  <ScientificNumber :value="5600000" notation="compact" unit="Da" />
  <ScientificNumber :value="6.022e23" :copyable="true" />
</template>
```
