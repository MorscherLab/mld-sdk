<script setup lang="ts">
import IconButton from './IconButton.vue'
import type { ButtonVariant, ButtonSize } from '../types'

const variants: ButtonVariant[] = ['primary', 'secondary', 'cta', 'danger', 'success', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

function handleClick() {
  console.log('IconButton clicked')
}
</script>

<template>
  <Story title="Action/IconButton">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; display: flex; align-items: center; justify-content: center;">
          <IconButton
            :variant="state.variant"
            :size="state.size"
            :disabled="state.disabled"
            :loading="state.loading"
            :label="state.label"
            @click="handleClick"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </IconButton>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.label" title="Label (aria)" />
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
      </template>
    </Variant>

    <Variant title="All Variants">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <IconButton
              v-for="variant in variants"
              :key="variant"
              :variant="variant"
              :size="size"
              :label="variant"
              @click="handleClick"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </IconButton>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Loading States">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <IconButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :label="`${variant} loading`"
          loading
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </IconButton>
      </div>
    </Variant>

    <Variant title="Common Icons">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
        <IconButton label="Add" variant="ghost" @click="handleClick">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </IconButton>
        <IconButton label="Edit" variant="ghost" @click="handleClick">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </IconButton>
        <IconButton label="Delete" variant="danger" @click="handleClick">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </IconButton>
        <IconButton label="Download" variant="primary" @click="handleClick">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </IconButton>
      </div>
    </Variant>

    <Variant title="Disabled States">
      <div style="padding: 2rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
        <IconButton
          v-for="variant in variants"
          :key="variant"
          :variant="variant"
          :label="`${variant} disabled`"
          disabled
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </IconButton>
      </div>
    </Variant>
  </Story>
</template>
