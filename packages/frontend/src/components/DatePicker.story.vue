<script setup lang="ts">
import DatePicker from './DatePicker.vue'

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <Story title="Base Inputs/DatePicker">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <DatePicker
            v-model="state.value"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :error="state.error"
            :size="state.size"
            :clearable="state.clearable"
            :min="state.useMin ? state.min : undefined"
            :max="state.useMax ? state.max : undefined"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.value" title="Value (YYYY-MM-DD)" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.clearable" title="Clearable" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.useMin" title="Use Min Date" />
        <HstText v-model="state.min" title="Min Date" />
        <HstCheckbox v-model="state.useMax" title="Use Max Date" />
        <HstText v-model="state.max" title="Max Date" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <DatePicker :size="size" placeholder="Select date..." />
        </div>
      </div>
    </Variant>

    <Variant title="Pre-selected Date">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <DatePicker model-value="2026-02-10" />
      </div>
    </Variant>

    <Variant title="With Date Range Constraints">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <p style="margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-primary, #e2e8f0);">
          Only dates in February 2026
        </p>
        <DatePicker
          model-value="2026-02-10"
          min="2026-02-01"
          max="2026-02-28"
        />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <DatePicker
          model-value="2026-01-01"
          error
          placeholder="Invalid date"
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <DatePicker
          model-value="2026-02-10"
          disabled
        />
      </div>
    </Variant>

    <Variant title="Not Clearable">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <DatePicker
          model-value="2026-02-10"
          :clearable="false"
        />
      </div>
    </Variant>
  </Story>
</template>
