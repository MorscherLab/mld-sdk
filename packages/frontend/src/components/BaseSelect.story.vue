<script setup lang="ts">
import BaseSelect from './BaseSelect.vue'
import type { SelectOption } from '../types'

const sizes = ['sm', 'md', 'lg'] as const

const fruitOptions: SelectOption<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry', disabled: true },
]

const numericOptions: SelectOption<number>[] = [
  { value: 6, label: '6-well' },
  { value: 12, label: '12-well' },
  { value: 24, label: '24-well' },
  { value: 48, label: '48-well' },
  { value: 96, label: '96-well' },
  { value: 384, label: '384-well' },
]
</script>

<template>
  <Story title="Base Inputs/BaseSelect">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <BaseSelect
            v-model="state.value"
            :options="fruitOptions"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <BaseSelect
            :options="fruitOptions"
            :size="size"
            placeholder="Select a fruit..."
          />
        </div>
      </div>
    </Variant>

    <Variant title="Numeric Values">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseSelect
          :options="numericOptions"
          :model-value="96"
          placeholder="Select plate format..."
        />
      </div>
    </Variant>

    <Variant title="With Disabled Option">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseSelect
          :options="fruitOptions"
          placeholder="Some options are disabled..."
        />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseSelect
          :options="fruitOptions"
          placeholder="Select a fruit..."
          error
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <BaseSelect
          :options="fruitOptions"
          model-value="banana"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
