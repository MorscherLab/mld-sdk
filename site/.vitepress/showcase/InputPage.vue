<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput, type InputType } from '@morscherlab/mld-sdk'
import { PageHeader, DemoSection, PropsTable, EventsTable, CodeBlock, type PropDefinition, type EventDefinition } from '../components'

const inputTypes: readonly InputType[] = ['text', 'password', 'email', 'number', 'search', 'tel', 'url']
const sizes = ['sm', 'md', 'lg'] as const

const textValue = ref('')
const numberValue = ref<number | undefined>(undefined)
const errorValue = ref('Invalid input')

const propDefinitions: readonly PropDefinition[] = [
  { name: 'modelValue', type: 'string | number', description: 'Input value (v-model)' },
  { name: 'type', type: 'InputType', default: "'text'", description: 'HTML input type' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Make input read-only' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state styling' },
  { name: 'min', type: 'number', description: 'Minimum value (for number type)' },
  { name: 'max', type: 'number', description: 'Maximum value (for number type)' },
  { name: 'step', type: 'number', description: 'Step increment (for number type)' },
]

const eventDefinitions: readonly EventDefinition[] = [
  { name: 'update:modelValue', payload: 'string | number', description: 'Emitted on input (for v-model)' },
  { name: 'focus', payload: 'FocusEvent', description: 'Emitted when input gains focus' },
  { name: 'blur', payload: 'FocusEvent', description: 'Emitted when input loses focus' },
  { name: 'keydown', payload: 'KeyboardEvent', description: 'Emitted on keydown' },
]

const usageCode = `<BaseInput
  v-model="email"
  type="email"
  placeholder="Enter email"
  :error="hasError"
/>

<BaseInput
  v-model="count"
  type="number"
  :min="0"
  :max="100"
  :step="5"
/>`
</script>

<template>
  <div class="max-w-4xl">
    <PageHeader
      title="BaseInput"
      description="A flexible input component supporting various types and states."
    />

    <DemoSection title="Input Types">
      <div class="space-y-4 max-w-md">
        <div v-for="type in inputTypes" :key="type" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">{{ type }}</label>
          <BaseInput :type="type" :placeholder="`Enter ${type}...`" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Sizes">
      <div class="space-y-4 max-w-md">
        <div v-for="size in sizes" :key="size" class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Size: {{ size }}</label>
          <BaseInput :size="size" :placeholder="`Size ${size}`" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="States">
      <div class="space-y-4 max-w-md">
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Normal</label>
          <BaseInput v-model="textValue" placeholder="Enter text..." />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Error</label>
          <BaseInput v-model="errorValue" error placeholder="Invalid input" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Disabled</label>
          <BaseInput disabled placeholder="Disabled input" />
        </div>
        <div class="space-y-1">
          <label class="text-sm font-medium text-text-secondary">Readonly</label>
          <BaseInput readonly model-value="Read-only value" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Number Input with Min/Max">
      <div class="max-w-md">
        <BaseInput
          v-model="numberValue"
          type="number"
          :min="0"
          :max="100"
          :step="5"
          placeholder="Enter a number (0-100, step 5)"
        />
        <p class="mt-2 text-sm text-text-secondary">Value: {{ numberValue }}</p>
      </div>
    </DemoSection>

    <DemoSection title="Props">
      <PropsTable :props="propDefinitions" />
    </DemoSection>

    <DemoSection title="Events">
      <EventsTable :events="eventDefinitions" />
    </DemoSection>

    <DemoSection title="Usage">
      <CodeBlock :code="usageCode" />
    </DemoSection>
  </div>
</template>
