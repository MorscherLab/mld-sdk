<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'
import FormField from './FormField.vue'

const textValue = ref('Hello world')
const numberValue = ref<number | undefined>(42)
</script>

<template>
  <Story title="Base Inputs/BaseInput">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
          <FormField
            :label="state.label"
            :error="state.showError ? state.errorMessage : undefined"
            :hint="state.showHint ? state.hintMessage : undefined"
            :required="state.required"
          >
            <BaseInput
              v-model="state.value"
              :type="state.type"
              :placeholder="state.placeholder"
              :size="state.size"
              :disabled="state.disabled"
              :readonly="state.readonly"
              :error="state.showError"
            />
          </FormField>
          <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
            Value: <code>{{ JSON.stringify(state.value) }}</code>
          </p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstText v-model="state.placeholder" title="Placeholder" />
        <HstSelect
          v-model="state.type"
          title="Type"
          :options="['text', 'password', 'email', 'number', 'search', 'tel', 'url'].map(t => ({ label: t, value: t }))"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="['sm', 'md', 'lg'].map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.readonly" title="Readonly" />
        <HstCheckbox v-model="state.required" title="Required" />
        <HstCheckbox v-model="state.showError" title="Show Error" />
        <HstText v-model="state.errorMessage" title="Error Message" />
        <HstCheckbox v-model="state.showHint" title="Show Hint" />
        <HstText v-model="state.hintMessage" title="Hint Message" />
      </template>
    </Variant>

    <Variant title="Text Input">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Username" hint="Enter your display name">
          <BaseInput v-model="textValue" placeholder="e.g. john_doe" />
        </FormField>
        <p style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          v-model: <code>{{ textValue }}</code>
        </p>
      </div>
    </Variant>

    <Variant title="Number Input">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Sample Count" hint="How many samples?">
          <BaseInput v-model="numberValue" type="number" placeholder="0" :min="0" :max="384" />
        </FormField>
        <p style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-muted, #94a3b8);">
          v-model: <code>{{ numberValue }}</code> (type: {{ typeof numberValue }})
        </p>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem;">
        <FormField v-for="size in (['sm', 'md', 'lg'] as const)" :key="size" :label="`Size: ${size}`">
          <BaseInput :size="size" :placeholder="`${size} input`" />
        </FormField>
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem; max-width: 400px; margin: 0 auto;">
        <FormField label="Email" error="Please enter a valid email address" required>
          <BaseInput type="email" model-value="not-an-email" error />
        </FormField>
      </div>
    </Variant>
  </Story>
</template>
