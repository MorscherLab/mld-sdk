<script setup lang="ts">
/**
 * Full-page standalone demo showcasing different layout patterns.
 * Each page demonstrates a different way to compose content
 * inside AppLayout's flex main container.
 */
import { ref, computed } from 'vue'
import {
  AppLayout,
  AppSidebar,
  AppTopBar,
  AppContainer,
  BaseSelect,
  BaseToggle,
  BaseSlider,
  BaseInput,
  SegmentedControl,
  BasePill,
  Divider,
  StatusIndicator,
  ProgressBar,
  type SidebarItem,
} from '@morscherlab/mld-sdk'

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  {
    id: 'experiments-group',
    label: 'Experiments',
    children: [
      { id: 'experiments', label: 'All Experiments' },
      { id: 'new-experiment', label: 'New Experiment' },
    ],
  },
  { id: 'analysis', label: 'Analysis' },
  { id: 'compounds', label: 'Compounds' },
  { id: 'settings', label: 'Settings' },
]

const activePage = ref('dashboard')
const collapsed = ref(false)

// Dashboard settings
const dashboardTimeRange = ref('7d')
const dashboardAutoRefresh = ref(true)
const dashboardRefreshInterval = ref(30)
const dashboardLayout = ref('grid')

// Experiment settings
const experimentStatus = ref('all')
const experimentSort = ref('newest')
const experimentPageSize = ref(25)
const selectedExperiment = ref<number | null>(1)

// Analysis settings
const analysisAlgorithm = ref('pca')
const analysisDimensions = ref(2)
const analysisNormalize = ref(true)
const analysisConfidence = ref(95)

// Compound settings
const compoundSearch = ref('')
const compoundSource = ref('all')
const compoundShowStructures = ref(true)

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    dashboard: 'Dashboard',
    experiments: 'All Experiments',
    'new-experiment': 'New Experiment',
    analysis: 'Analysis',
    compounds: 'Compound Library',
    settings: 'Settings',
  }
  return map[activePage.value] ?? activePage.value
})

const mockMetrics = [
  { label: 'Active Experiments', value: 12, status: 'active' as const },
  { label: 'Completed Today', value: 3, status: 'success' as const },
  { label: 'Pending Reviews', value: 7, status: 'warning' as const },
  { label: 'Total Compounds', value: 1842, status: 'info' as const },
]

const mockActivity = [
  { id: 1, text: 'Experiment EXP-042 completed successfully', time: '2 min ago', type: 'success' },
  { id: 2, text: 'New compound batch CPD-200 imported', time: '15 min ago', type: 'info' },
  { id: 3, text: 'Analysis job PCA-17 started', time: '32 min ago', type: 'info' },
  { id: 4, text: 'Review requested for EXP-039', time: '1h ago', type: 'warning' },
  { id: 5, text: 'User Dr. Smith joined the workspace', time: '2h ago', type: 'info' },
  { id: 6, text: 'Backup completed', time: '3h ago', type: 'success' },
  { id: 7, text: 'Compound validation failed for CPD-198', time: '4h ago', type: 'error' },
  { id: 8, text: 'Experiment EXP-041 completed', time: '5h ago', type: 'success' },
  { id: 9, text: 'Scheduled maintenance window', time: '6h ago', type: 'warning' },
  { id: 10, text: 'New tracing preset uploaded', time: '8h ago', type: 'info' },
]

const mockExperiments = [
  { id: 1, name: 'Cell Viability Assay - HeLa', date: '2024-12-15', status: 'running', progress: 65, desc: 'Testing cell viability under varying compound concentrations using MTT assay.' },
  { id: 2, name: 'Dose-Response Curve - Compound A', date: '2024-12-14', status: 'completed', progress: 100, desc: 'Full dose-response characterization with 8-point curve.' },
  { id: 3, name: 'Western Blot - p53 Expression', date: '2024-12-13', status: 'draft', progress: 0, desc: 'Investigating p53 protein expression levels across treatment groups.' },
  { id: 4, name: 'ELISA - TNF-alpha Quantification', date: '2024-12-12', status: 'running', progress: 40, desc: 'Quantifying TNF-alpha levels in supernatant samples from stimulated PBMCs.' },
  { id: 5, name: 'qPCR - Gene Panel Screening', date: '2024-12-11', status: 'completed', progress: 100, desc: 'Screening 48-gene expression panel across 6 treatment conditions.' },
  { id: 6, name: 'Flow Cytometry - CD4/CD8 Ratio', date: '2024-12-10', status: 'completed', progress: 100, desc: 'Measuring CD4/CD8 T-cell ratios in peripheral blood samples.' },
]

const filteredExperiments = computed(() => {
  let list = [...mockExperiments]
  if (experimentStatus.value !== 'all') {
    list = list.filter(e => e.status === experimentStatus.value)
  }
  if (experimentSort.value === 'oldest') list.reverse()
  if (experimentSort.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
  return list.slice(0, experimentPageSize.value)
})

const selectedExp = computed(() => mockExperiments.find(e => e.id === selectedExperiment.value))

const mockCompounds = [
  { id: 'CPD-001', name: 'Staurosporine', mw: 466.5, source: 'internal' },
  { id: 'CPD-002', name: 'Doxorubicin', mw: 543.5, source: 'internal' },
  { id: 'CPD-003', name: 'Metformin', mw: 129.2, source: 'external' },
  { id: 'CPD-004', name: 'Rapamycin', mw: 914.2, source: 'internal' },
  { id: 'CPD-005', name: 'Cisplatin', mw: 300.1, source: 'external' },
  { id: 'CPD-006', name: 'Tamoxifen', mw: 371.5, source: 'custom' },
  { id: 'CPD-007', name: 'Imatinib', mw: 493.6, source: 'internal' },
  { id: 'CPD-008', name: 'Erlotinib', mw: 393.4, source: 'external' },
  { id: 'CPD-009', name: 'Paclitaxel', mw: 853.9, source: 'internal' },
]

const filteredCompounds = computed(() => {
  let list = [...mockCompounds]
  if (compoundSource.value !== 'all') {
    list = list.filter(c => c.source === compoundSource.value)
  }
  if (compoundSearch.value) {
    const q = compoundSearch.value.toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
  }
  return list
})

function statusToVariant(status: string) {
  const map: Record<string, string> = { running: 'info', completed: 'success', draft: 'warning' }
  return (map[status] ?? 'default') as 'info' | 'success' | 'warning'
}

function activityDot(type: string) {
  const map: Record<string, string> = {
    success: 'var(--mld-success, #22c55e)',
    info: 'var(--color-primary, #3b82f6)',
    warning: 'var(--mld-warning, #f59e0b)',
    error: 'var(--mld-error, #ef4444)',
  }
  return map[type] ?? map.info
}
</script>

<template>
  <div class="sidebar-panel-demo">
    <AppLayout
      floating
      v-model:sidebar-collapsed="collapsed"
      sidebar-width="280px"
    >
      <template #topbar>
        <AppTopBar variant="default" show-theme-toggle>
          <template #logo>
            <div class="sidebar-panel-demo__logo">
              <div class="sidebar-panel-demo__logo-icon">
                <span class="sidebar-panel-demo__logo-letter">M</span>
              </div>
              <span class="sidebar-panel-demo__logo-text">MLD Platform</span>
            </div>
          </template>
          <template #center>
            <span class="sidebar-panel-demo__page-label">{{ pageTitle }}</span>
          </template>
        </AppTopBar>
      </template>

      <template #sidebar="{ collapsed: isCollapsed }">
        <AppSidebar
          :floating="false"
          :items="sidebarItems"
          :active-id="activePage"
          :collapsed="isCollapsed"
          @select="(item) => activePage = item.id"
          @update:collapsed="collapsed = $event"
        >
          <template #panel="{ activeId }">
            <!-- Dashboard panel -->
            <template v-if="activeId === 'dashboard'">
              <p class="sidebar-panel-demo__section-title">Dashboard</p>
              <BaseSelect
                label="Time Range"
                v-model="dashboardTimeRange"
                :options="[
                  { value: '24h', label: 'Last 24 hours' },
                  { value: '7d', label: 'Last 7 days' },
                  { value: '30d', label: 'Last 30 days' },
                  { value: '90d', label: 'Last 90 days' },
                ]"
                size="sm"
              />
              <SegmentedControl
                v-model="dashboardLayout"
                :options="[
                  { value: 'grid', label: 'Grid' },
                  { value: 'list', label: 'List' },
                ]"
                size="sm"
              />
              <BaseToggle
                label="Auto-refresh"
                v-model="dashboardAutoRefresh"
                size="sm"
              />
              <BaseSlider
                v-if="dashboardAutoRefresh"
                label="Interval (sec)"
                v-model="dashboardRefreshInterval"
                :min="5"
                :max="120"
                :step="5"
                size="sm"
              />
            </template>

            <!-- Experiments panel -->
            <template v-if="activeId === 'experiments' || activeId === 'new-experiment'">
              <p class="sidebar-panel-demo__section-title">Experiments</p>
              <BaseSelect
                label="Status Filter"
                v-model="experimentStatus"
                :options="[
                  { value: 'all', label: 'All statuses' },
                  { value: 'running', label: 'Running' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'draft', label: 'Draft' },
                ]"
                size="sm"
              />
              <BaseSelect
                label="Sort By"
                v-model="experimentSort"
                :options="[
                  { value: 'newest', label: 'Newest first' },
                  { value: 'oldest', label: 'Oldest first' },
                  { value: 'name', label: 'Name A-Z' },
                ]"
                size="sm"
              />
              <BaseSlider
                label="Page Size"
                v-model="experimentPageSize"
                :min="10"
                :max="100"
                :step="5"
                size="sm"
              />
            </template>

            <!-- Analysis panel -->
            <template v-if="activeId === 'analysis'">
              <p class="sidebar-panel-demo__section-title">Analysis</p>
              <BaseSelect
                label="Algorithm"
                v-model="analysisAlgorithm"
                :options="[
                  { value: 'pca', label: 'PCA' },
                  { value: 'tsne', label: 't-SNE' },
                  { value: 'umap', label: 'UMAP' },
                  { value: 'hclust', label: 'Hierarchical Clustering' },
                ]"
                size="sm"
              />
              <BaseSlider
                label="Dimensions"
                v-model="analysisDimensions"
                :min="2"
                :max="5"
                :step="1"
                size="sm"
              />
              <BaseToggle
                label="Normalize data"
                v-model="analysisNormalize"
                size="sm"
              />
              <BaseSlider
                label="Confidence (%)"
                v-model="analysisConfidence"
                :min="80"
                :max="99"
                :step="1"
                size="sm"
              />
            </template>

            <!-- Compounds panel -->
            <template v-if="activeId === 'compounds'">
              <p class="sidebar-panel-demo__section-title">Compounds</p>
              <BaseInput
                label="Search"
                v-model="compoundSearch"
                placeholder="Filter compounds..."
                size="sm"
              />
              <BaseSelect
                label="Source"
                v-model="compoundSource"
                :options="[
                  { value: 'all', label: 'All sources' },
                  { value: 'internal', label: 'Internal library' },
                  { value: 'external', label: 'External' },
                  { value: 'custom', label: 'Custom uploads' },
                ]"
                size="sm"
              />
              <BaseToggle
                label="Show structures"
                v-model="compoundShowStructures"
                size="sm"
              />
            </template>

            <!-- Settings: no panel -->
            <template v-if="activeId === 'settings'">
              <p class="sidebar-panel-demo__hint">No page-specific settings.</p>
            </template>
          </template>
        </AppSidebar>
      </template>

      <!-- ============================================================
           Main content: each page uses a different layout pattern
           ============================================================ -->

      <!-- Dashboard: Two side-by-side AppContainer cards -->
      <template v-if="activePage === 'dashboard'">
        <AppContainer direction="row">
          <!-- Left: Metrics -->
          <AppContainer scrollable>
            <div class="spd-page-header">
              <h1 class="spd-page-header__title">Dashboard</h1>
              <div class="spd-page-header__meta">
                <BasePill variant="info" size="sm">{{ dashboardTimeRange }}</BasePill>
                <span v-if="dashboardAutoRefresh" class="spd-meta-text">
                  Refreshing every {{ dashboardRefreshInterval }}s
                </span>
              </div>
            </div>
            <Divider />
            <div :class="dashboardLayout === 'grid' ? 'spd-metrics-grid' : 'spd-metrics-list'">
              <div
                v-for="metric in mockMetrics"
                :key="metric.label"
                class="spd-metric-card"
              >
                <div class="spd-metric-card__header">
                  <span class="spd-metric-card__label">{{ metric.label }}</span>
                  <StatusIndicator :status="metric.status" size="sm" />
                </div>
                <span class="spd-metric-card__value">{{ metric.value }}</span>
              </div>
            </div>
          </AppContainer>
          <!-- Right: Activity feed -->
          <AppContainer scrollable style="width: 280px; flex: none;">
            <p class="spd-aside-title">Activity</p>
            <div class="spd-activity-feed">
              <div
                v-for="item in mockActivity"
                :key="item.id"
                class="spd-activity-item"
              >
                <span class="spd-activity-item__dot" :style="{ backgroundColor: activityDot(item.type) }" />
                <div class="spd-activity-item__content">
                  <span class="spd-activity-item__text">{{ item.text }}</span>
                  <span class="spd-activity-item__time">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </AppContainer>
        </AppContainer>
      </template>

      <!-- Experiments: Master-detail (list + detail AppContainers) -->
      <template v-else-if="activePage === 'experiments' || activePage === 'new-experiment'">
        <AppContainer direction="row">
          <!-- List panel -->
          <AppContainer style="width: 320px; flex: none;">
            <div class="spd-master-detail__list-header">
              <span class="spd-aside-title">{{ filteredExperiments.length }} Experiments</span>
              <BasePill v-if="experimentStatus !== 'all'" variant="info" size="sm">{{ experimentStatus }}</BasePill>
            </div>
            <div class="spd-master-detail__items">
              <div
                v-for="exp in filteredExperiments"
                :key="exp.id"
                class="spd-master-detail__item"
                :class="{ 'spd-master-detail__item--active': selectedExperiment === exp.id }"
                @click="selectedExperiment = exp.id"
              >
                <span class="spd-master-detail__item-name">{{ exp.name }}</span>
                <div class="spd-master-detail__item-row">
                  <span class="spd-meta-text">{{ exp.date }}</span>
                  <BasePill :variant="statusToVariant(exp.status)" size="sm">{{ exp.status }}</BasePill>
                </div>
              </div>
            </div>
          </AppContainer>
          <!-- Detail panel -->
          <AppContainer scrollable>
            <template v-if="selectedExp">
              <div class="spd-page-header">
                <h1 class="spd-page-header__title">{{ selectedExp.name }}</h1>
                <BasePill :variant="statusToVariant(selectedExp.status)" size="sm">{{ selectedExp.status }}</BasePill>
              </div>
              <Divider />
              <div class="spd-detail-body">
                <p class="spd-detail-body__desc">{{ selectedExp.desc }}</p>
                <div class="spd-detail-body__fields">
                  <div class="spd-detail-field">
                    <span class="spd-detail-field__label">Date</span>
                    <span class="spd-detail-field__value">{{ selectedExp.date }}</span>
                  </div>
                  <div class="spd-detail-field">
                    <span class="spd-detail-field__label">Progress</span>
                    <ProgressBar :value="selectedExp.progress" size="sm" />
                  </div>
                  <div class="spd-detail-field">
                    <span class="spd-detail-field__label">ID</span>
                    <span class="spd-detail-field__value">EXP-{{ String(selectedExp.id).padStart(3, '0') }}</span>
                  </div>
                </div>
                <div class="spd-detail-body__placeholder">
                  <span class="spd-meta-text">Charts and data tables would go here</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="spd-empty-state">
                <span class="spd-meta-text">Select an experiment to view details</span>
              </div>
            </template>
          </AppContainer>
        </AppContainer>
      </template>

      <!-- Analysis: Toolbar strip + plot AppContainer -->
      <template v-else-if="activePage === 'analysis'">
        <AppContainer direction="column" gap="0.5rem">
        <!-- Toolbar strip (no card, just a row) -->
        <div class="spd-toolbar-strip">
          <div class="spd-toolbar-strip__left">
            <h1 class="spd-toolbar-strip__title">Analysis</h1>
            <BasePill variant="info" size="sm">{{ analysisAlgorithm.toUpperCase() }}</BasePill>
            <BasePill variant="default" size="sm">{{ analysisDimensions }}D</BasePill>
            <BasePill variant="default" size="sm">{{ analysisConfidence }}% CI</BasePill>
            <span v-if="analysisNormalize" class="spd-meta-text">Normalized</span>
          </div>
        </div>
        <!-- Plot area in AppContainer -->
        <AppContainer>
          <div class="spd-plot-area">
            <div class="spd-plot-area__label">
              {{ analysisAlgorithm.toUpperCase() }} Plot ({{ analysisDimensions }}D)
            </div>
            <div class="spd-plot-area__dots">
              <div
                v-for="i in 30"
                :key="i"
                class="spd-plot-area__dot"
                :style="{
                  left: `${8 + Math.random() * 84}%`,
                  top: `${8 + Math.random() * 84}%`,
                  backgroundColor: ['var(--color-primary)', 'var(--mld-success)', 'var(--color-purple)'][i % 3],
                  opacity: 0.4 + Math.random() * 0.6,
                  width: (6 + Math.random() * 8) + 'px',
                  height: (6 + Math.random() * 8) + 'px',
                }"
              />
            </div>
            <!-- Axis labels -->
            <span class="spd-plot-area__x-label">Component 1</span>
            <span class="spd-plot-area__y-label">Component 2</span>
          </div>
        </AppContainer>
        </AppContainer>
      </template>

      <!-- Compounds: Single scrollable AppContainer -->
      <template v-else-if="activePage === 'compounds'">
        <AppContainer scrollable>
          <div class="spd-scrollable-page">
            <div class="spd-page-header">
              <h1 class="spd-page-header__title">Compound Library</h1>
              <div class="spd-page-header__meta">
                <BasePill v-if="compoundSource !== 'all'" variant="info" size="sm">{{ compoundSource }}</BasePill>
                <span class="spd-meta-text">{{ filteredCompounds.length }} compounds</span>
              </div>
            </div>
            <Divider />
            <div :class="compoundShowStructures ? 'spd-compound-grid' : 'spd-compound-list'">
              <div
                v-for="cpd in filteredCompounds"
                :key="cpd.id"
                class="spd-compound-card"
              >
                <div v-if="compoundShowStructures" class="spd-compound-card__structure">
                  <span class="spd-meta-text">2D</span>
                </div>
                <div class="spd-compound-card__info">
                  <span class="spd-compound-card__name">{{ cpd.name }}</span>
                  <span class="spd-meta-text">{{ cpd.id }} | MW: {{ cpd.mw }}</span>
                </div>
                <BasePill variant="default" size="sm">{{ cpd.source }}</BasePill>
              </div>
            </div>
          </div>
        </AppContainer>
      </template>

      <!-- Settings: Single scrollable AppContainer -->
      <template v-else-if="activePage === 'settings'">
        <AppContainer scrollable>
          <div class="spd-scrollable-page">
            <div class="spd-page-header">
              <h1 class="spd-page-header__title">Settings</h1>
            </div>
            <Divider />
            <p class="spd-meta-text">
              Application settings are managed here. This page has no sidebar panel configuration.
            </p>
          </div>
        </AppContainer>
      </template>
    </AppLayout>
  </div>
</template>

<style>
.sidebar-panel-demo {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ==============================
   Logo & top bar
   ============================== */
.sidebar-panel-demo__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-panel-demo__logo-icon {
  width: 1.75rem;
  height: 1.75rem;
  background-color: var(--color-primary, #3b82f6);
  border-radius: var(--radius, 0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-panel-demo__logo-letter {
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
}

.sidebar-panel-demo__logo-text {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary, #1e293b);
}

.sidebar-panel-demo__page-label {
  font-size: 0.8125rem;
  color: var(--text-secondary, #64748b);
}

/* Sidebar panel helpers */
.sidebar-panel-demo__section-title {
  font-size: 0.6875rem !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #94a3b8);
  margin: 0 !important;
}

.sidebar-panel-demo__hint {
  font-size: 0.75rem !important;
  color: var(--text-muted, #94a3b8);
  font-style: italic;
  margin: 0 !important;
}

/* ==============================
   Shared page primitives
   ============================== */
.spd-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem 0;
}

.spd-page-header__title {
  font-size: 1.25rem !important;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 !important;
}

.spd-page-header__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spd-meta-text {
  font-size: 0.75rem !important;
  color: var(--text-muted, #94a3b8);
  margin: 0 !important;
}

.spd-aside-title {
  font-size: 0.6875rem !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #94a3b8);
  margin: 0 !important;
}

/* ==============================
   Layout 1: Two-column split (Dashboard)
   ============================== */

/* Metrics grid/list */
.spd-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.5rem 0;
}

.spd-metrics-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.5rem 0;
}

.spd-metric-card {
  padding: 1rem;
  border-radius: var(--radius-md, 0.5rem);
  border: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--bg-secondary, #fff);
}

.spd-metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.spd-metric-card__label {
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
}

.spd-metric-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary, #1e293b);
}

/* Activity feed */
.spd-activity-feed {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.spd-activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.spd-activity-item:last-child {
  border-bottom: none;
}

.spd-activity-item__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.375rem;
}

.spd-activity-item__content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.spd-activity-item__text {
  font-size: 0.75rem;
  color: var(--text-primary, #1e293b);
  line-height: 1.3;
}

.spd-activity-item__time {
  font-size: 0.6875rem;
  color: var(--text-muted, #94a3b8);
}

/* ==============================
   Layout 2: Master-detail (Experiments)
   ============================== */

.spd-master-detail__list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  flex-shrink: 0;
}

.spd-master-detail__items {
  flex: 1;
  overflow-y: auto;
}

.spd-master-detail__item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  transition: background-color 0.1s;
}

.spd-master-detail__item:hover {
  background-color: var(--bg-hover, #f1f5f9);
}

.spd-master-detail__item--active {
  background-color: var(--color-primary-light, rgba(59, 130, 246, 0.08));
  border-left: 3px solid var(--color-primary, #3b82f6);
}

.spd-master-detail__item-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
  display: block;
  margin-bottom: 0.25rem;
}

.spd-master-detail__item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.spd-detail-body {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spd-detail-body__desc {
  font-size: 0.875rem !important;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
  margin: 0 !important;
}

.spd-detail-body__fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.spd-detail-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.spd-detail-field__label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #94a3b8);
}

.spd-detail-field__value {
  font-size: 0.875rem;
  color: var(--text-primary, #1e293b);
}

.spd-detail-body__placeholder {
  border: 2px dashed var(--border-color, #e5e7eb);
  border-radius: var(--radius-md, 0.5rem);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spd-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* ==============================
   Layout 3: Toolbar strip + plot AppContainer (Analysis)
   ============================== */
.spd-toolbar-strip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}

.spd-toolbar-strip__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spd-toolbar-strip__title {
  font-size: 1rem !important;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 !important;
  margin-right: 0.5rem !important;
}

.spd-plot-area {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.spd-plot-area__label {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
}

.spd-plot-area__dots {
  position: absolute;
  inset: 2.5rem;
}

.spd-plot-area__dot {
  position: absolute;
  border-radius: 50%;
}

.spd-plot-area__x-label {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6875rem;
  color: var(--text-muted, #94a3b8);
}

.spd-plot-area__y-label {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  font-size: 0.6875rem;
  color: var(--text-muted, #94a3b8);
}

/* ==============================
   Layout 4: Scrollable page (Compounds, Settings)
   ============================== */
.spd-scrollable-page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 1.5rem;
}

/* Compounds grid/list */
.spd-compound-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 1rem 1.5rem 0;
}

.spd-compound-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.5rem 0;
}

.spd-compound-list .spd-compound-card {
  flex-direction: row;
  align-items: center;
}

.spd-compound-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--radius-md, 0.5rem);
  border: 1px solid var(--border-color, #e5e7eb);
  background-color: var(--bg-secondary, #fff);
}

.spd-compound-card__structure {
  height: 64px;
  border-radius: var(--radius, 0.375rem);
  background-color: var(--bg-hover, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spd-compound-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.spd-compound-card__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
}
</style>
