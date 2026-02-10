<script setup lang="ts">
import ChartContainer from './ChartContainer.vue'
</script>

<template>
  <Story title="Data Display/ChartContainer">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
          <ChartContainer
            :title="state.showTitle ? state.title : undefined"
            :description="state.showDescription ? state.description : undefined"
            :loading="state.loading"
            :empty="state.empty"
            :empty-message="state.emptyMessage"
          >
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #94a3b8); font-style: italic; border: 2px dashed var(--border-color, #e2e8f0); border-radius: 0.5rem;">
              Chart content goes here (e.g. Chart.js, D3, etc.)
            </div>
          </ChartContainer>
        </div>
      </template>

      <template #controls="{ state }">
        <HstCheckbox v-model="state.showTitle" title="Show Title" />
        <HstText v-model="state.title" title="Title" />
        <HstCheckbox v-model="state.showDescription" title="Show Description" />
        <HstText v-model="state.description" title="Description" />
        <HstCheckbox v-model="state.loading" title="Loading" />
        <HstCheckbox v-model="state.empty" title="Empty" />
        <HstText v-model="state.emptyMessage" title="Empty Message" />
      </template>
    </Variant>

    <Variant title="With Title and Description">
      <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
        <ChartContainer
          title="Dose-Response Curve"
          description="IC50 analysis for compound MLD-2847 across 8-point dilution series"
        >
          <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #94a3b8); font-style: italic; border: 2px dashed var(--border-color, #e2e8f0); border-radius: 0.5rem;">
            Sigmoidal dose-response chart placeholder
          </div>
        </ChartContainer>
      </div>
    </Variant>

    <Variant title="Loading State">
      <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
        <ChartContainer
          title="Cell Viability Heatmap"
          description="Processing 96-well plate data..."
          loading
        >
          <div style="height: 300px;" />
        </ChartContainer>
      </div>
    </Variant>

    <Variant title="Empty State">
      <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
        <ChartContainer
          title="Experiment Results"
          empty
          empty-message="No results found. Run an analysis to see data here."
        />
      </div>
    </Variant>

    <Variant title="With Toolbar Slot">
      <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
        <ChartContainer title="Proliferation Assay">
          <template #toolbar>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" style="padding: 0.25rem 0.75rem; font-size: 0.8125rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer;">
                Linear
              </button>
              <button type="button" style="padding: 0.25rem 0.75rem; font-size: 0.8125rem; border: 1px solid var(--mld-primary, #3B82F6); border-radius: 0.375rem; background: var(--mld-primary, #3B82F6); color: #fff; cursor: pointer;">
                Log
              </button>
            </div>
          </template>
          <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #94a3b8); font-style: italic; border: 2px dashed var(--border-color, #e2e8f0); border-radius: 0.5rem;">
            Chart with toolbar controls
          </div>
        </ChartContainer>
      </div>
    </Variant>

    <Variant title="With Legend Slot">
      <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
        <ChartContainer title="Multi-Compound Comparison">
          <div style="height: 250px; display: flex; align-items: center; justify-content: center; color: var(--text-muted, #94a3b8); font-style: italic; border: 2px dashed var(--border-color, #e2e8f0); border-radius: 0.5rem;">
            Overlay chart placeholder
          </div>
          <template #legend>
            <div style="display: flex; gap: 1.5rem; justify-content: center; font-size: 0.8125rem; color: var(--text-primary, #1e293b);">
              <span style="display: flex; align-items: center; gap: 0.375rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: #3B82F6;" /> MLD-2847
              </span>
              <span style="display: flex; align-items: center; gap: 0.375rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: #EC4899;" /> MLD-3192
              </span>
              <span style="display: flex; align-items: center; gap: 0.375rem;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: #10B981;" /> Vehicle
              </span>
            </div>
          </template>
        </ChartContainer>
      </div>
    </Variant>
  </Story>
</template>
