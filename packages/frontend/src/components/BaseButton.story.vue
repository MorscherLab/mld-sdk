<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import type { ButtonVariant, ButtonSize } from '../types'

const variants: ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

function handleClick() {
  console.log('Button clicked')
}
</script>

<template>
  <Story title="Base Inputs/BaseButton">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <BaseButton
            :variant="state.variant"
            :size="state.size"
            :disabled="state.disabled"
            :loading="state.loading"
            :full-width="state.fullWidth"
            @click="handleClick"
          >
            {{ state.label }}
          </BaseButton>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.variant"
          title="Variant"
          :options="variants.map(v => ({ label: v, value: v }))"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.disabled" title="Disabled" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.fullWidth" title="Full Width" />
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <BaseButton
              v-for="variant in variants"
              :key="variant"
              :variant="variant"
              :size="size"
              @click="handleClick"
            >
              {{ variant }}
            </BaseButton>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Loading States">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          loading
        >
          {{ variant }}
        </BaseButton>
      </div>
    </Variant>

    <Variant title="Disabled States">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <BaseButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          disabled
        >
          {{ variant }}
        </BaseButton>
      </div>
    </Variant>
  </Story>
</template>
