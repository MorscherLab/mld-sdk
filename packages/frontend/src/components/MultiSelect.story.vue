<script setup lang="ts">
import { ref } from 'vue'
import MultiSelect from './MultiSelect.vue'
import type { MultiSelectOption } from '../types'

const sizes = ['sm', 'md', 'lg'] as const

const sampleOptions: MultiSelectOption[] = [
  { value: 'hela', label: 'HeLa' },
  { value: 'mcf7', label: 'MCF-7' },
  { value: 'a549', label: 'A549' },
  { value: 'hek293', label: 'HEK293' },
  { value: 'jurkat', label: 'Jurkat' },
  { value: 'k562', label: 'K562' },
]

const withDisabledOptions: MultiSelectOption[] = [
  { value: 'option1', label: 'Available A' },
  { value: 'option2', label: 'Available B' },
  { value: 'option3', label: 'Unavailable', disabled: true },
  { value: 'option4', label: 'Available C' },
]

const selected = ref<(string | number)[]>(['hela', 'a549'])
</script>

<template>
  <Story title="Base Inputs/MultiSelect">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <MultiSelect
            v-model="state.selected"
            :options="sampleOptions"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :max-selections="state.useMaxSelections ? state.maxSelections : undefined"
            :size="state.size"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Selected: <code>{{ JSON.stringify(state.selected) }}</code>
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
        <HstCheckbox v-model="state.useMaxSelections" title="Limit Selections" />
        <HstSlider v-model="state.maxSelections" title="Max Selections" :min="1" :max="10" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <MultiSelect v-model="selected" :options="sampleOptions" :size="size" />
        </div>
      </div>
    </Variant>

    <Variant title="Empty State">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <MultiSelect
          :model-value="[]"
          :options="sampleOptions"
          placeholder="Select cell lines..."
        />
      </div>
    </Variant>

    <Variant title="With Max Selections">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">
          Maximum 3 selections allowed
        </p>
        <MultiSelect
          :model-value="['hela', 'mcf7']"
          :options="sampleOptions"
          :max-selections="3"
        />
      </div>
    </Variant>

    <Variant title="With Disabled Options">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <MultiSelect
          :model-value="['option1']"
          :options="withDisabledOptions"
        />
      </div>
    </Variant>

    <Variant title="All Selected">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <MultiSelect
          :model-value="sampleOptions.map(o => o.value)"
          :options="sampleOptions"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <MultiSelect
          :model-value="['hela', 'a549']"
          :options="sampleOptions"
          disabled
        />
      </div>
    </Variant>
  </Story>
</template>
