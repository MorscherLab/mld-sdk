<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  AppSidebar,
  BaseSlider,
  BaseSelect,
  BaseToggle,
  BaseButton,
  type SidebarToolSection,
} from '@morscherlab/mld-sdk'

/* ============================================================
   SVG icon paths (Lucide-style, used for icon demos)
   ============================================================ */
const icons = {
  settings: [
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  ],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3'],
  eye: [
    'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  ],
  download: [
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'M7 10l5 5 5-5',
    'M12 15V3',
  ],
}

/* ============================================================
   1. Basic Toolkit -- emoji icons, simple sections
   ============================================================ */
const basicPanels: Record<string, SidebarToolSection[]> = {
  main: [
    {
      id: 'parameters',
      label: 'Parameters',
      subtitle: 'Adjust thresholds',
      icon: '\u2699\uFE0F',
    },
    {
      id: 'filters',
      label: 'Filters',
      subtitle: 'Refine results',
      icon: '\uD83D\uDD0D',
      defaultOpen: false,
    },
    {
      id: 'display',
      label: 'Display',
      subtitle: 'Visual options',
      icon: '\uD83D\uDCCA',
      defaultOpen: false,
    },
  ],
}

const threshold = ref(50)
const method = ref('linear')
const showOutliers = ref(true)
const logScale = ref(false)

/* ============================================================
   2. With Icons & Toggles -- SVG paths, custom colors, toggles
   ============================================================ */
const iconPanels: Record<string, SidebarToolSection[]> = {
  analysis: [
    {
      id: 'params',
      label: 'Analysis Parameters',
      subtitle: 'Configure algorithm',
      icon: icons.settings,
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
      showToggle: true,
    },
    {
      id: 'data-filter',
      label: 'Data Filters',
      subtitle: '3 active filters',
      icon: icons.filter,
      iconColor: '#0ea5e9',
      iconBg: '#e0f2fe',
      showToggle: true,
    },
    {
      id: 'viz',
      label: 'Visualization',
      subtitle: 'Chart settings',
      icon: icons.eye,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
    },
    {
      id: 'export',
      label: 'Export',
      subtitle: 'Download data',
      icon: icons.download,
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      defaultOpen: false,
    },
  ],
}

const iconToggleState = reactive<Record<string, boolean>>({
  params: true,
  'data-filter': false,
})

function handleIconToggle(id: string, value: boolean) {
  iconToggleState[id] = value
}

const algorithm = ref('pca')
const dimensions = ref(3)
const normalize = ref(true)
const confidence = ref(95)

/* ============================================================
   3. View Switching -- changing activeView shows different panels
   ============================================================ */
const viewPanels: Record<string, SidebarToolSection[]> = {
  setup: [
    {
      id: 'experiment',
      label: 'Experiment',
      subtitle: 'Define parameters',
      icon: icons.settings,
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
    },
    {
      id: 'samples',
      label: 'Samples',
      subtitle: 'Sample configuration',
      icon: icons.filter,
      iconColor: '#0ea5e9',
      iconBg: '#e0f2fe',
      defaultOpen: false,
    },
  ],
  results: [
    {
      id: 'chart-options',
      label: 'Chart Options',
      subtitle: 'Configure display',
      icon: icons.eye,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
    },
    {
      id: 'download',
      label: 'Download',
      subtitle: 'Export results',
      icon: icons.download,
      iconColor: '#10b981',
      iconBg: '#d1fae5',
      defaultOpen: false,
    },
  ],
}

const currentView = ref('setup')
const sampleCount = ref(48)
const chartType = ref('scatter')

/* ============================================================
   4. With Header & Footer -- using named slots
   ============================================================ */
const headerFooterPanels: Record<string, SidebarToolSection[]> = {
  tools: [
    {
      id: 'settings',
      label: 'Settings',
      subtitle: 'Global preferences',
      icon: icons.settings,
      iconColor: '#6366f1',
      iconBg: '#e0e7ff',
    },
    {
      id: 'display-opts',
      label: 'Display',
      subtitle: 'Visual tweaks',
      icon: icons.eye,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
      defaultOpen: false,
    },
  ],
}

const darkMode = ref(false)
const fontSize = ref(14)
</script>

<template>
  <!-- 1. Basic Toolkit -->
  <DemoSection title="Basic Toolkit">
    <p class="sidebar-demo__desc">
      Simple panels using emoji icons, subtitle text, and basic controls.
      Sections render as CollapsibleCards via <code>panels</code> config.
      Controls go into named <code>#section-{id}</code> slots.
    </p>
    <div class="sidebar-demo__container" style="height: 480px;">
      <AppSidebar
        :panels="basicPanels"
        active-view="main"
        :floating="true"
        width="280px"
      >
        <template #section-parameters>
          <BaseSlider v-model="threshold" label="Threshold" :min="0" :max="100" />
          <BaseSelect
            v-model="method"
            label="Method"
            :options="[
              { value: 'linear', label: 'Linear' },
              { value: 'quadratic', label: 'Quadratic' },
              { value: 'logistic', label: 'Logistic' },
            ]"
          />
        </template>
        <template #section-filters>
          <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          <BaseToggle v-model="logScale" label="Log scale" />
        </template>
        <template #section-display>
          <BaseSelect
            model-value="bar"
            label="Chart type"
            :options="[
              { value: 'bar', label: 'Bar chart' },
              { value: 'line', label: 'Line chart' },
              { value: 'scatter', label: 'Scatter plot' },
            ]"
          />
        </template>
      </AppSidebar>
    </div>
    <p class="sidebar-demo__state">Threshold: {{ threshold }} | Method: {{ method }}</p>
  </DemoSection>

  <!-- 2. With Icons & Toggles -->
  <DemoSection title="With Icons &amp; Toggles">
    <p class="sidebar-demo__desc">
      Panels using SVG path arrays for icons with custom <code>iconColor</code>
      and <code>iconBg</code>. Sections with <code>showToggle: true</code>
      display an inline toggle switch in the header. Toggle state is managed
      via <code>:toggle-state</code> and <code>@update:toggle</code>.
    </p>
    <div class="sidebar-demo__container" style="height: 560px;">
      <AppSidebar
        :panels="iconPanels"
        active-view="analysis"
        :toggle-state="iconToggleState"
        width="300px"
        @update:toggle="handleIconToggle"
      >
        <template #section-params>
          <BaseSelect
            v-model="algorithm"
            label="Algorithm"
            :options="[
              { value: 'pca', label: 'PCA' },
              { value: 'tsne', label: 't-SNE' },
              { value: 'umap', label: 'UMAP' },
            ]"
          />
          <BaseSlider v-model="dimensions" label="Dimensions" :min="2" :max="5" :step="1" />
          <BaseToggle v-model="normalize" label="Normalize data" />
          <BaseSlider v-model="confidence" label="Confidence (%)" :min="80" :max="99" :step="1" />
        </template>
        <template #section-data-filter>
          <BaseToggle v-model="showOutliers" label="Exclude outliers" />
          <BaseToggle v-model="logScale" label="Log scale" />
        </template>
        <template #section-viz>
          <BaseSelect
            model-value="scatter"
            label="Chart type"
            :options="[
              { value: 'scatter', label: 'Scatter' },
              { value: 'heatmap', label: 'Heatmap' },
              { value: 'violin', label: 'Violin' },
            ]"
          />
        </template>
        <template #section-export>
          <BaseButton size="sm" variant="secondary">Export CSV</BaseButton>
          <BaseButton size="sm" variant="secondary">Export PNG</BaseButton>
        </template>
      </AppSidebar>
    </div>
    <p class="sidebar-demo__state">
      Toggle state: params={{ iconToggleState.params }}, data-filter={{ iconToggleState['data-filter'] }}
    </p>
  </DemoSection>

  <!-- 3. View Switching -->
  <DemoSection title="View Switching">
    <p class="sidebar-demo__desc">
      The <code>activeView</code> prop selects which panel set to display.
      Views with no matching panels cause the sidebar to hide automatically.
      Click the buttons below to switch views.
    </p>
    <div class="sidebar-demo__view-buttons">
      <BaseButton
        v-for="v in ['setup', 'results', 'settings']"
        :key="v"
        :variant="currentView === v ? 'primary' : 'secondary'"
        size="sm"
        @click="currentView = v"
      >
        {{ v }}
      </BaseButton>
    </div>
    <div class="sidebar-demo__container" style="height: 400px;">
      <AppSidebar
        :panels="viewPanels"
        :active-view="currentView"
        width="280px"
      >
        <template #section-experiment>
          <BaseSelect
            model-value="dose-response"
            label="Type"
            :options="[
              { value: 'dose-response', label: 'Dose-Response' },
              { value: 'time-course', label: 'Time Course' },
              { value: 'single-point', label: 'Single Point' },
            ]"
          />
        </template>
        <template #section-samples>
          <BaseSlider v-model="sampleCount" label="Sample count" :min="6" :max="96" :step="6" />
        </template>
        <template #section-chart-options>
          <BaseSelect
            v-model="chartType"
            label="Chart type"
            :options="[
              { value: 'scatter', label: 'Scatter' },
              { value: 'bar', label: 'Bar chart' },
              { value: 'heatmap', label: 'Heatmap' },
            ]"
          />
        </template>
        <template #section-download>
          <BaseButton size="sm" variant="secondary">Download CSV</BaseButton>
          <BaseButton size="sm" variant="secondary">Download PDF</BaseButton>
        </template>
      </AppSidebar>
    </div>
    <p class="sidebar-demo__state">
      Active view: {{ currentView }}
      <span v-if="!viewPanels[currentView]"> (no panels -- sidebar hidden)</span>
    </p>
  </DemoSection>

  <!-- 4. With Header & Footer -->
  <DemoSection title="With Header &amp; Footer">
    <p class="sidebar-demo__desc">
      The <code>#header</code> and <code>#footer</code> slots render
      fixed content above and below the scrollable sections area.
    </p>
    <div class="sidebar-demo__container" style="height: 420px;">
      <AppSidebar
        :panels="headerFooterPanels"
        active-view="tools"
        width="280px"
      >
        <template #header>
          <div class="sidebar-demo__header-content">
            <div class="sidebar-demo__header-icon">
              <span class="sidebar-demo__header-letter">P</span>
            </div>
            <span class="sidebar-demo__header-title">Plugin Tools</span>
          </div>
        </template>
        <template #section-settings>
          <BaseToggle v-model="darkMode" label="Dark mode" />
          <BaseSlider v-model="fontSize" label="Font size (px)" :min="10" :max="24" :step="1" />
        </template>
        <template #section-display-opts>
          <BaseToggle model-value label="Show grid lines" />
          <BaseToggle model-value label="Animate transitions" />
        </template>
        <template #footer>
          <BaseButton size="sm" variant="ghost" style="width: 100%;">Reset Defaults</BaseButton>
        </template>
      </AppSidebar>
    </div>
  </DemoSection>
</template>

<style>
.sidebar-demo__desc {
  font-size: 0.8125rem !important;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
  margin: 0 0 1rem 0 !important;
}

.sidebar-demo__desc code {
  font-size: 0.75rem;
  background: var(--bg-hover, #f1f5f9);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  color: var(--text-primary, #1e293b);
}

.sidebar-demo__container {
  position: relative;
  background: var(--bg-primary, #f1f5f9);
  border-radius: 0.5rem;
  overflow: hidden;
}

.sidebar-demo__state {
  font-size: 0.75rem !important;
  color: var(--text-muted, #94a3b8);
  margin: 0.5rem 0 0 0 !important;
}

.sidebar-demo__view-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

/* Header slot styling */
.sidebar-demo__header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-demo__header-icon {
  width: 1.75rem;
  height: 1.75rem;
  background-color: var(--color-primary, #3b82f6);
  border-radius: var(--radius, 0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-demo__header-letter {
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
}

.sidebar-demo__header-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary, #1e293b);
}
</style>
