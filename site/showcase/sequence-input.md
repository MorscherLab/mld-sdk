<script setup>
import SequenceInputDemo from '../.vitepress/showcase/SequenceInputDemo.vue'
</script>

# SequenceInput

DNA/RNA/protein sequence input with validation, base coloring, statistics, and tools.

## Demo

<ClientOnly>
  <SequenceInputDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Sequence string (v-model) |
| `type` | `'dna' \| 'rna' \| 'protein' \| 'auto'` | `'auto'` | Sequence type |
| `readonly` | `boolean` | `false` | Show as colored viewer instead of textarea |
| `showStats` | `boolean` | `true` | Show stats bar (length, GC%, MW) |
| `showTools` | `boolean` | `true` | Show toolbar with tools |
| `maxLength` | `number` | - | Maximum sequence length |
| `placeholder` | `string` | `'Paste or type sequence...'` | Input placeholder |
| `rows` | `number` | `6` | Textarea rows |
| `error` | `boolean` | `false` | Error state |
| `disabled` | `boolean` | `false` | Disabled state |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Sequence changed |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `tools` | `{ sequence, type, stats }` | Custom toolbar content |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SequenceInput } from '@morscherlab/mld-sdk'

const seq = ref('')
</script>

<template>
  <SequenceInput v-model="seq" type="dna" />
</template>
```
