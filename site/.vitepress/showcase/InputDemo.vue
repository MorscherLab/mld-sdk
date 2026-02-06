<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput, type InputType } from '@morscherlab/mld-sdk'
import { DemoSection } from '../components'

const inputTypes: readonly InputType[] = ['text', 'password', 'email', 'number', 'search', 'tel', 'url']
const sizes = ['sm', 'md', 'lg'] as const

const textValue = ref('')
const numberValue = ref<number | undefined>(undefined)
const errorValue = ref('Invalid input')
</script>

<template>
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
</template>
