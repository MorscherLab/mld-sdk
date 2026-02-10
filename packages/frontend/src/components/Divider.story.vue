<script setup lang="ts">
import Divider from './Divider.vue'
import type { DividerSpacing } from '../types'

const spacings: DividerSpacing[] = ['sm', 'md', 'lg']
</script>

<template>
  <Story title="Layout/Divider">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
          <p style="margin: 0; color: var(--text-primary, #1e293b);">Content above</p>
          <Divider
            :vertical="state.vertical"
            :label="state.showLabel ? state.label : undefined"
            :spacing="state.spacing"
          />
          <p style="margin: 0; color: var(--text-primary, #1e293b);">Content below</p>
        </div>
      </template>

      <template #controls="{ state }">
        <HstCheckbox v-model="state.vertical" title="Vertical" />
        <HstCheckbox v-model="state.showLabel" title="Show Label" />
        <HstText v-model="state.label" title="Label" />
        <HstSelect
          v-model="state.spacing"
          title="Spacing"
          :options="spacings.map(s => ({ label: s, value: s }))"
        />
      </template>
    </Variant>

    <Variant title="Horizontal">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <p style="margin: 0; color: var(--text-primary, #1e293b);">First section content</p>
        <Divider />
        <p style="margin: 0; color: var(--text-primary, #1e293b);">Second section content</p>
      </div>
    </Variant>

    <Variant title="With Label">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <p style="margin: 0; color: var(--text-primary, #1e293b);">Section A</p>
        <Divider label="OR" />
        <p style="margin: 0; color: var(--text-primary, #1e293b);">Section B</p>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="padding: 2rem; display: flex; align-items: center; gap: 0; height: 100px;">
        <span style="color: var(--text-primary, #1e293b);">Left</span>
        <Divider :vertical="true" />
        <span style="color: var(--text-primary, #1e293b);">Right</span>
      </div>
    </Variant>

    <Variant title="All Spacings">
      <div style="padding: 2rem; max-width: 500px; margin: 0 auto;">
        <div v-for="spacing in spacings" :key="spacing" style="margin-bottom: 2rem;">
          <p style="margin: 0 0 0.25rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ spacing }}
          </p>
          <p style="margin: 0; color: var(--text-primary, #1e293b);">Above</p>
          <Divider :spacing="spacing" />
          <p style="margin: 0; color: var(--text-primary, #1e293b);">Below</p>
        </div>
      </div>
    </Variant>
  </Story>
</template>
