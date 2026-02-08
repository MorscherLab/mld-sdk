<script setup>
import StepWizardDemo from '../.vitepress/showcase/StepWizardDemo.vue'
</script>

# StepWizard

Multi-step wizard with progress indicator, validation gates, and navigation.

## Demo

<ClientOnly>
  <StepWizardDemo />
</ClientOnly>

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `WizardStep[]` | - | Step definitions |
| `modelValue` | `number` | `0` | Current step index (v-model) |
| `linear` | `boolean` | `true` | Enforce sequential progression |
| `showProgress` | `boolean` | `true` | Show step progress indicator |
| `showStepNumbers` | `boolean` | `true` | Show step numbers in dots |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Step changed |
| `complete` | - | Finish clicked on last step |
| `cancel` | - | Cancel clicked |
| `step-change` | `[from, to]` | Step transition |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `step-{id}` | `{ step, index }` | Content for each step |
| `navigation` | `{ goBack, goNext, finish, cancel, isFirst, isLast, canProceed }` | Custom navigation |
| `progress` | `{ steps, current, states }` | Custom progress indicator |

## Exposed Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `setStepValid` | `(index: number, valid: boolean) => void` | Gate navigation by marking steps valid/invalid |

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StepWizard } from '@morscherlab/mld-sdk'

const step = ref(0)
const steps = [
  { id: 'setup', label: 'Setup' },
  { id: 'config', label: 'Configuration' },
  { id: 'review', label: 'Review' },
]
</script>

<template>
  <StepWizard v-model="step" :steps="steps" @complete="submit">
    <template #step-setup>Step 1 content</template>
    <template #step-config>Step 2 content</template>
    <template #step-review>Step 3 content</template>
  </StepWizard>
</template>
```
