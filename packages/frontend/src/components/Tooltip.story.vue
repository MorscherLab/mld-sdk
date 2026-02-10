<script setup lang="ts">
import Tooltip from './Tooltip.vue'

const positions: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right']
</script>

<template>
  <Story title="Data Display/Tooltip">
    <Variant title="Playground">
      <template #default="{ state }">
        <div style="padding: 4rem; display: flex; align-items: center; justify-content: center;">
          <Tooltip :text="state.text" :position="state.position" :delay="state.delay">
            <button
              type="button"
              style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer;"
            >
              Hover me
            </button>
          </Tooltip>
        </div>
      </template>

      <template #controls="{ state }">
        <HstText v-model="state.text" title="Tooltip Text" />
        <HstSelect
          v-model="state.position"
          title="Position"
          :options="positions.map(p => ({ label: p, value: p }))"
        />
        <HstSlider v-model="state.delay" title="Delay (ms)" :min="0" :max="1000" :step="50" />
      </template>
    </Variant>

    <Variant title="All Positions">
      <div style="padding: 6rem; display: flex; gap: 3rem; align-items: center; justify-content: center; flex-wrap: wrap;">
        <Tooltip
          v-for="pos in positions"
          :key="pos"
          :text="`Tooltip on ${pos}`"
          :position="pos"
          :delay="100"
        >
          <button
            type="button"
            style="padding: 0.5rem 1rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); color: var(--text-primary, #1e293b); cursor: pointer; min-width: 100px; text-align: center;"
          >
            {{ pos }}
          </button>
        </Tooltip>
      </div>
    </Variant>

    <Variant title="On Text Content">
      <div style="padding: 4rem; max-width: 500px; margin: 0 auto; line-height: 1.8; color: var(--text-primary, #1e293b);">
        <p style="margin: 0;">
          The experiment used
          <Tooltip text="Dimethyl sulfoxide - a polar aprotic solvent" position="top" :delay="100">
            <span style="text-decoration: underline dotted; cursor: help; color: var(--mld-primary, #3B82F6);">DMSO</span>
          </Tooltip>
          as the vehicle control. Samples were incubated at
          <Tooltip text="Standard mammalian cell culture temperature" position="top" :delay="100">
            <span style="text-decoration: underline dotted; cursor: help; color: var(--mld-primary, #3B82F6);">37 C</span>
          </Tooltip>
          for 24 hours before
          <Tooltip text="3-(4,5-dimethylthiazol-2-yl)-2,5-diphenyltetrazolium bromide" position="top" :delay="100">
            <span style="text-decoration: underline dotted; cursor: help; color: var(--mld-primary, #3B82F6);">MTT</span>
          </Tooltip>
          assay readout.
        </p>
      </div>
    </Variant>

    <Variant title="On Icon Buttons">
      <div style="padding: 4rem; display: flex; gap: 1rem; align-items: center; justify-content: center;">
        <Tooltip text="Add new sample" position="bottom" :delay="100">
          <button type="button" style="padding: 0.5rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </Tooltip>
        <Tooltip text="Export results" position="bottom" :delay="100">
          <button type="button" style="padding: 0.5rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </Tooltip>
        <Tooltip text="Delete experiment" position="bottom" :delay="100">
          <button type="button" style="padding: 0.5rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 0.375rem; background: var(--bg-card, #fff); cursor: pointer; display: flex; align-items: center; justify-content: center; color: #ef4444;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </Tooltip>
      </div>
    </Variant>
  </Story>
</template>
