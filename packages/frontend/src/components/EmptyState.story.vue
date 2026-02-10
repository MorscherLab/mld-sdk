<script setup lang="ts">
import EmptyState from './EmptyState.vue'
import type { EmptyStateColor, EmptyStateSize } from '../types'

const colors: EmptyStateColor[] = ['primary', 'cta', 'success', 'warning', 'error', 'muted']
const sizes: EmptyStateSize[] = ['sm', 'md', 'lg']
</script>

<template>
  <Story title="Feedback/EmptyState">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem;">
          <EmptyState
            :title="state.title"
            :description="state.description"
            :color="state.color"
            :size="state.size"
            :action-label="state.showAction ? state.actionLabel : undefined"
            @action="() => console.log('Action clicked')"
          />
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.title" title="Title" />
        <HstText v-model="state.description" title="Description" />
        <HstSelect
          v-model="state.color"
          title="Color"
          :options="colors.map(c => ({ label: c, value: c }))"
        />
        <HstSelect
          v-model="state.size"
          title="Size"
          :options="sizes.map(s => ({ label: s, value: s }))"
        />
        <HstCheckbox v-model="state.showAction" title="Show Action" />
        <HstText v-model="state.actionLabel" title="Action Label" />
      </template>
    </Variant>

    <Variant title="No Experiments">
      <div style="padding: 2rem;">
        <EmptyState
          title="No experiments yet"
          description="Create your first experiment to get started with data analysis."
          action-label="Create Experiment"
          color="primary"
          @action="() => console.log('Create experiment')"
        />
      </div>
    </Variant>

    <Variant title="No Results">
      <div style="padding: 2rem;">
        <EmptyState
          title="No results found"
          description="Try adjusting your search filters or broadening your query."
          color="muted"
          size="sm"
        />
      </div>
    </Variant>

    <Variant title="Error State">
      <div style="padding: 2rem;">
        <EmptyState
          title="Something went wrong"
          description="We couldn't load the plate data. Please check your connection and try again."
          color="error"
          action-label="Retry"
          icon-path="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          @action="() => console.log('Retry')"
        />
      </div>
    </Variant>

    <Variant title="All Colors">
      <div style="padding: 2rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
        <EmptyState
          v-for="color in colors"
          :key="color"
          :title="`${color.charAt(0).toUpperCase() + color.slice(1)} state`"
          description="Example description text."
          :color="color"
          size="sm"
        />
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem;">
        <div v-for="size in sizes" :key="size">
          <p style="margin: 0 0 0.5rem; font-size: 0.75rem; color: var(--text-muted, #94a3b8); text-transform: uppercase; letter-spacing: 0.05em;">
            {{ size }}
          </p>
          <EmptyState
            :title="`Empty state (${size})`"
            description="This shows the different size options available."
            :size="size"
            color="muted"
          />
        </div>
      </div>
    </Variant>

    <Variant title="With Custom Content">
      <div style="padding: 2rem;">
        <EmptyState
          title="Upload your data"
          description="Drag and drop CSV or Excel files, or click below to browse."
          color="cta"
        >
          <div style="margin-top: 1rem; padding: 2rem; border: 2px dashed var(--border-color, #e2e8f0); border-radius: 0.5rem; text-align: center;">
            <p style="margin: 0; color: var(--text-muted, #94a3b8); font-size: 0.875rem;">
              Drop files here or click to upload
            </p>
          </div>
        </EmptyState>
      </div>
    </Variant>
  </Story>
</template>
