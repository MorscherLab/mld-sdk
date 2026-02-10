<script setup lang="ts">
import { ref, reactive } from 'vue'
import AppSidebar from './AppSidebar.vue'
import BaseSlider from './BaseSlider.vue'
import BaseSelect from './BaseSelect.vue'
import BaseToggle from './BaseToggle.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import NumberInput from './NumberInput.vue'
import FileUploader from './FileUploader.vue'
import FormField from './FormField.vue'
import type { SidebarToolSection } from '../types'

/* --- Icon paths (Lucide-style) --- */
const icons = {
  upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  fileText: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  shuffle: ['M16 3h5v5', 'M4 20L21 3', 'M21 16v5h-5', 'M15 15l6 6', 'M4 4l5 5'],
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
  route: ['M18 6l-6 6-4-4-6 6'],
  settings: ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
}

/* --- Sequence builder panels --- */
const sequencePanels: Record<string, SidebarToolSection[]> = {
  sequence: [
    {
      id: 'import',
      label: 'Import Layout',
      subtitle: 'Upload from Excel',
      icon: icons.upload,
      iconColor: '#3b82f6',
      iconBg: '#dbeafe',
    },
    {
      id: 'naming',
      label: 'Experiment & Naming',
      subtitle: 'exp001_260210_XP_M...',
      icon: icons.fileText,
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
      showToggle: true,
    },
    {
      id: 'randomize',
      label: 'Randomize Samples',
      subtitle: 'Sequential order',
      icon: icons.shuffle,
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
      showToggle: true,
      defaultOpen: false,
    },
    {
      id: 'acquisition',
      label: 'Acquisition',
      subtitle: 'NEG, VIAL',
      icon: icons.zap,
      iconColor: '#ef4444',
      iconBg: '#fee2e2',
    },
    {
      id: 'method',
      label: 'Method & Path',
      subtitle: 'Select method',
      icon: icons.route,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
      defaultOpen: false,
    },
  ],
}

/* --- Simple panels for basic demo --- */
const simplePanels: Record<string, SidebarToolSection[]> = {
  analysis: [
    {
      id: 'parameters',
      label: 'Parameters',
      subtitle: 'Analysis settings',
      icon: ['M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
    },
    {
      id: 'filters',
      label: 'Filters',
      subtitle: 'Refine results',
      icon: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3'],
      iconColor: '#0ea5e9',
      iconBg: '#e0f2fe',
      defaultOpen: false,
    },
  ],
  results: [
    {
      id: 'display',
      label: 'Display Options',
      subtitle: 'Chart and table settings',
      icon: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
    },
    {
      id: 'export',
      label: 'Export',
      subtitle: 'Download data',
      icon: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      defaultOpen: false,
    },
  ],
}

const threshold = ref(50)
const method = ref('linear')
const methods = [
  { value: 'linear', label: 'Linear' },
  { value: 'quadratic', label: 'Quadratic' },
  { value: 'logistic', label: 'Logistic' },
]
const showOutliers = ref(true)
const logScale = ref(false)
const polarity = ref('negative')
const container = ref('vial')
const expNumber = ref(1)
const initials = ref('XP')
const toggleState = reactive<Record<string, boolean>>({ naming: true, randomize: false })

function handleToggle(id: string, value: boolean) {
  toggleState[id] = value
}
</script>

<template>
  <Story title="Layout/AppSidebar">
    <Variant title="Sequence Builder">
      <div style="padding: 2rem; height: 700px; position: relative; background: var(--bg-primary, #f1f5f9);">
        <AppSidebar
          :panels="sequencePanels"
          active-view="sequence"
          :toggle-state="toggleState"
          width="300px"
          @update:toggle="handleToggle"
        >
          <template #section-import>
            <FileUploader accept=".xlsx,.xls" placeholder="Drop Excel or click" />
            <div style="display: flex; gap: 0.5rem;">
              <BaseButton size="sm" variant="secondary" style="flex: 1;">96-Well</BaseButton>
              <BaseButton size="sm" variant="secondary" style="flex: 1;">54-Vial</BaseButton>
            </div>
          </template>
          <template #section-naming>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary, #4b5563);">File Prefix</span>
              <span style="font-size: 0.75rem; color: var(--text-muted, #9ca3af);">Custom</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <FormField label="Exp #" style="flex: 1;">
                <NumberInput v-model="expNumber" :min="1" />
              </FormField>
              <FormField label="Initials" style="flex: 0 0 4rem;">
                <BaseInput v-model="initials" />
              </FormField>
            </div>
            <FormField label="Folder Name">
              <span style="font-size: 0.8125rem; color: var(--text-secondary, #4b5563);">Metabolites</span>
            </FormField>
            <BaseInput model-value="exp001_260210_XP_Metabolites" readonly />
            <p style="font-size: 0.6875rem; color: var(--text-muted, #9ca3af); margin: 0;">
              Toggle to save experiment to database for tracking and analysis.
            </p>
          </template>
          <template #section-randomize>
            <BaseSelect
              model-value="sequential"
              :options="[
                { value: 'sequential', label: 'Sequential' },
                { value: 'random', label: 'Random' },
                { value: 'block', label: 'Block randomize' },
              ]"
              label="Order"
            />
          </template>
          <template #section-acquisition>
            <div style="display: flex; gap: 0.5rem;">
              <FormField label="Polarity" style="flex: 1;">
                <BaseSelect v-model="polarity" :options="[{ value: 'negative', label: 'Negative' }, { value: 'positive', label: 'Positive' }]" />
              </FormField>
              <FormField label="Container" style="flex: 1;">
                <BaseSelect v-model="container" :options="[{ value: 'vial', label: 'Vial' }, { value: 'plate', label: 'Plate' }]" />
              </FormField>
            </div>
          </template>
          <template #section-method>
            <BaseToggle model-value label="Use custom method paths" />
            <BaseSelect
              model-value=""
              placeholder="-- Select Method --"
              :options="[]"
              label="Method"
            />
          </template>
          <template #footer>
            <BaseButton variant="cta" style="width: 100%;">Generate Sequence</BaseButton>
          </template>
        </AppSidebar>
      </div>
    </Variant>

    <Variant title="Simple Toolkit">
      <template #default="{ state }">
        <div style="padding: 2rem; height: 500px; position: relative; background: var(--bg-primary, #f1f5f9);">
          <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
            <button
              v-for="v in ['analysis', 'results', 'settings']"
              :key="v"
              :style="{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--border-color, #e5e7eb)',
                background: state.activeView === v ? 'var(--color-primary, #3b82f6)' : 'var(--bg-card, #fff)',
                color: state.activeView === v ? '#fff' : 'var(--text-primary, #111827)',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }"
              @click="state.activeView = v"
            >
              {{ v }}
            </button>
          </div>
          <AppSidebar
            :panels="simplePanels"
            :active-view="state.activeView"
            :floating="state.floating"
            :width="state.width"
            :side="state.side"
          >
            <template #section-parameters>
              <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
              <BaseSelect v-model="method" label="Method" :options="methods" />
            </template>
            <template #section-filters>
              <BaseToggle v-model="showOutliers" label="Exclude outliers" />
            </template>
            <template #section-display>
              <BaseToggle v-model="showOutliers" label="Show outliers" />
              <BaseToggle v-model="logScale" label="Log scale" />
            </template>
            <template #section-export>
              <BaseButton size="sm" variant="secondary">Export CSV</BaseButton>
              <BaseButton size="sm" variant="secondary">Export PNG</BaseButton>
            </template>
          </AppSidebar>
        </div>
      </template>

      <template #controls="{ state }">
        <HstSelect
          v-model="state.activeView"
          title="Active View"
          :options="['analysis', 'results', 'settings'].map(v => ({ label: v, value: v }))"
        />
        <HstCheckbox v-model="state.floating" title="Floating" />
        <HstText v-model="state.width" title="Width" />
        <HstSelect
          v-model="state.side"
          title="Side"
          :options="[{ label: 'left', value: 'left' }, { label: 'right', value: 'right' }]"
        />
      </template>
    </Variant>

    <Variant title="With Header and Footer">
      <div style="padding: 2rem; height: 500px; position: relative; background: var(--bg-primary, #f1f5f9);">
        <AppSidebar
          :panels="simplePanels"
          active-view="analysis"
        >
          <template #header>
            <span style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary, #111827);">
              Analysis Tools
            </span>
          </template>
          <template #section-parameters>
            <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
            <BaseSelect v-model="method" label="Method" :options="methods" />
          </template>
          <template #section-filters>
            <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          </template>
          <template #footer>
            <BaseButton size="sm" variant="ghost" style="width: 100%;">Reset Defaults</BaseButton>
          </template>
        </AppSidebar>
      </div>
    </Variant>
  </Story>
</template>
