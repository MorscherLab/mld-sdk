<script setup>
import FormulaInputDemo from '../.vitepress/showcase/FormulaInputDemo.vue'
</script>

# FormulaInput

Chemical formula entry with live subscript preview and molecular weight calculation.

## Demo

<ClientOnly>
  <FormulaInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Formula string (v-model) |
| `showPreview` | `boolean` | `true` | Show rendered formula preview |
| `showMW` | `boolean` | `true` | Show molecular weight |
| `placeholder` | `string` | `'e.g. Ca(OH)2'` | Input placeholder |
| `error` | `boolean` | `false` | Error state |
| `disabled` | `boolean` | `false` | Disabled state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Formula text changed |
| `mw` | `number \| null` | Calculated molecular weight |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FormulaInput } from '@morscherlab/mld-sdk'

const formula = ref('')
const mw = ref<number | null>(null)
</script>

<template>
  <FormulaInput v-model="formula" @mw="mw = $event" />
</template>
```
