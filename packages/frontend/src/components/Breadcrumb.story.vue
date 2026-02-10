<script setup lang="ts">
import Breadcrumb from './Breadcrumb.vue'
import type { BreadcrumbItem } from '../types'

const simpleItems: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Experiments', href: '#' },
  { label: 'EXP-2024-001' },
]

const deepItems: BreadcrumbItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Oncology Screen', href: '#' },
  { label: 'Experiment Batch 3', href: '#' },
  { label: 'Plate PLT-096-A1' },
]

const routerItems: BreadcrumbItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Analysis', to: '/analysis' },
  { label: 'Results' },
]
</script>

<template>
  <Story title="Layout/Breadcrumb">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <Breadcrumb
            :items="simpleItems"
            :separator="state.separator"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.separator" title="Separator" />
      </template>
    </Variant>

    <Variant title="Simple Path">
      <div style="padding: 2rem;">
        <Breadcrumb :items="simpleItems" />
      </div>
    </Variant>

    <Variant title="Deep Path">
      <div style="padding: 2rem;">
        <Breadcrumb :items="deepItems" />
      </div>
    </Variant>

    <Variant title="Custom Separator">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            Chevron (default /)
          </p>
          <Breadcrumb :items="simpleItems" separator="/" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            Arrow
          </p>
          <Breadcrumb :items="simpleItems" separator=">" />
        </div>
        <div>
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            Dot
          </p>
          <Breadcrumb :items="simpleItems" separator="." />
        </div>
      </div>
    </Variant>

    <Variant title="Router Links">
      <div style="padding: 2rem;">
        <Breadcrumb
          :items="routerItems"
          @navigate="(item) => console.log('Navigate to:', item)"
        />
      </div>
    </Variant>

    <Variant title="Single Item">
      <div style="padding: 2rem;">
        <Breadcrumb :items="[{ label: 'Home' }]" />
      </div>
    </Variant>
  </Story>
</template>
