<script setup lang="ts">
import BaseTextarea from './BaseTextarea.vue'

const sizes = ['sm', 'md', 'lg'] as const
const resizeOptions = ['none', 'vertical', 'horizontal', 'both'] as const
</script>

<template>
  <Story title="Base Inputs/BaseTextarea">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <BaseTextarea
            v-model="state.value"
            :placeholder="state.placeholder"
            :disabled="state.disabled"
            :readonly="state.readonly"
            :error="state.error"
            :size="state.size"
            :rows="state.rows"
            :resize="state.resize"
            :maxlength="state.useMaxlength ? state.maxlength : undefined"
          />
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
            <span v-if="state.useMaxlength"> ({{ (state.value || '').length }}/{{ state.maxlength }})</span>
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
        <HstSelect
          v-model="state.resize"
          title="Resize"
          :options="resizeOptions.map(r => ({ label: r, value: r }))"
        />
        <HstSlider v-model="state.rows" title="Rows" :min="1" :max="20" />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.error" title="Error" />
        <HstCheckbox v-model="state.useMaxlength" title="Use Maxlength" />
        <HstSlider v-model="state.maxlength" title="Maxlength" :min="10" :max="500" />
      </template>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <BaseTextarea :size="size" placeholder="Enter notes..." :rows="3" />
        </div>
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <BaseTextarea
          model-value="Invalid content"
          error
          placeholder="Something went wrong..."
        />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <BaseTextarea
          model-value="This textarea is disabled and cannot be edited."
          disabled
        />
      </div>
    </Variant>

    <Variant title="Readonly">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <BaseTextarea
          model-value="This content is readonly. You can select and copy but not edit."
          readonly
        />
      </div>
    </Variant>
  </Story>
</template>
