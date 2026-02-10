---
name: mld-sdk-plugin
version: 0.5.0
sdk_version: 0.5.0
description: |
  Build full-stack analysis plugins for MorscherLabDatabase platform using mld-sdk.

  **Use this skill when:**
  - Creating new MLD plugins with Python FastAPI backend
  - Implementing AnalysisPlugin subclass with metadata, routers, lifecycle methods
  - Accessing platform services via PlatformContext (experiments, compounds, artifacts)
  - Building Vue 3 frontends with @morscherlab/mld-sdk components
  - Working with lab-specific components (WellPlate, PlateMapEditor, ExperimentTimeline, RackEditor)
  - Using scientific components (ChemicalFormula, FormulaInput, SequenceInput, MoleculeInput)
  - Building workflow UIs (StepWizard, AuditTrail, BatchProgressList)
  - Creating scheduling interfaces (ScheduleCalendar, ResourceCard, DateTimePicker)
  - Using data display components (DataFrame, Calendar, BasePill, DropdownButton)
  - Configuring standalone vs integrated plugin modes
  - Setting up pyproject.toml with mld.plugins entry points

  **Triggers:** "mld plugin", "analysis plugin", "mld-sdk", "PlatformContext",
  "AnalysisPlugin", "PluginType", "@morscherlab/mld-sdk", "plugin frontend",
  "AppLayout", "WellPlate", "PlateMapEditor", "ExperimentTimeline", "MoleculeInput",
  "ConcentrationInput", "DoseCalculator", "ReagentList", "SampleHierarchyTree",
  "ProtocolStepEditor", "RackEditor", "StepWizard", "AuditTrail", "BatchProgressList",
  "ScheduleCalendar", "ResourceCard", "DateTimePicker", "DataFrame", "Calendar",
  "BasePill", "DropdownButton", "FormulaInput", "SequenceInput", "ChemicalFormula",
  "useConcentrationUnits", "useDoseCalculator", "useProtocolTemplates",
  "useForm", "useAsync", "useWellPlateEditor", "useRackEditor",
  "useChemicalFormula", "useSequenceUtils", "useTimeUtils", "useScheduleDrag"
---

## Quick Start

### Minimal Analysis Plugin (3 Steps)

**Step 1: Create plugin class**
```python
# src/mld_plugin_example/plugin.py
from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities, PluginType, PluginHealth, HealthStatus
from mld_sdk.context import PlatformContext
from fastapi import APIRouter

router = APIRouter()

@router.get("/analyze/{experiment_id}")
async def analyze(experiment_id: int):
    return {"status": "analyzed", "experiment_id": experiment_id}

class ExamplePlugin(AnalysisPlugin):
    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="example-plugin",
            version="1.0.0",
            description="Example analysis plugin",
            analysis_type="example",
            routes_prefix="/example",
            plugin_type=PluginType.ANALYSIS,
            capabilities=PluginCapabilities(
                requires_auth=False,
            ),
        )

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [(router, self.metadata.routes_prefix)]

    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context

    async def shutdown(self) -> None:
        pass
```

**Step 2: Register entry point**
```toml
# pyproject.toml
[project.entry-points."mld.plugins"]
example = "mld_plugin_example.plugin:ExamplePlugin"
```

**Step 3: Test standalone**
```bash
cd your-plugin && uv run uvicorn mld_plugin_example.plugin:create_standalone_app --factory --reload
```

---

## Decision Tree

### What type of plugin do you need?

```
Need to CREATE/UPDATE experiments?
├── Yes → PluginType.EXPERIMENT_DESIGN (full CRUD access)
└── No  → PluginType.ANALYSIS (read-only, default)

Need user authentication?
├── Yes → requires_auth=True, use useAuth composable
└── No  → requires_auth=False (anonymous access)

Need to persist plugin data/settings?
├── Yes (shared DB) → requires_shared_database=True, use get_plugin_db_session()
└── Yes (local)     → Use standalone_db (SQLite), JSON file, or localStorage
└── No              → Skip persistence

Need a frontend UI?
├── Yes → Create frontend/ with Vue 3 + @morscherlab/mld-sdk
└── No  → API-only plugin, skip frontend

Working with well plates?
├── Yes → Use WellPlate, PlateMapEditor, SampleLegend components
└── No  → Use standard form/display components
```

---

## Core Workflow

### Step 1: Define Plugin Metadata

```python
from mld_sdk import PluginMetadata, PluginCapabilities, PluginType

@property
def metadata(self) -> PluginMetadata:
    return PluginMetadata(
        name="my-plugin",           # Unique identifier (kebab-case)
        version="1.0.0",            # Semantic version
        description="Description",  # User-facing description
        analysis_type="my-type",    # Category (e.g., "mass-spec", "genomics")
        routes_prefix="/my-plugin", # API route prefix
        plugin_type=PluginType.ANALYSIS,  # or EXPERIMENT_DESIGN
        capabilities=PluginCapabilities(
            requires_auth=True,               # Needs user login
            requires_shared_database=True,    # Needs shared DB access
        ),
    )
```

### Step 2: Create FastAPI Routers

**Recommended structure:**
```
routers/
├── analysis.py   # Core analysis endpoints
├── health.py     # Health check endpoints
└── settings.py   # Plugin settings endpoints
```

**Service injection pattern (recommended):**
```python
# routers/analysis.py
from fastapi import APIRouter, Depends, HTTPException
from ..services.analysis_service import AnalysisService

router = APIRouter(tags=["analysis"])
_service: AnalysisService | None = None

def set_service(service: AnalysisService) -> None:
    global _service
    _service = service

def get_service() -> AnalysisService:
    if _service is None:
        raise HTTPException(status_code=503, detail="Service not initialized")
    return _service

@router.post("/run")
async def run_analysis(
    request: AnalysisRequest,
    service: AnalysisService = Depends(get_service),
):
    return await service.run_analysis(request)
```

### Step 3: Implement Lifecycle Methods

```python
async def initialize(self, context: PlatformContext | None) -> None:
    """Called when plugin is loaded. context=None means standalone mode."""
    self._context = context

    # Create services with context for platform integration
    self._service = AnalysisService(context)

    # Inject services into routers
    from .routers.analysis import set_service
    set_service(self._service)

async def shutdown(self) -> None:
    """Called when plugin is unloaded. Clean up resources."""
    if hasattr(self, '_service'):
        await self._service.cleanup()

async def check_health(self) -> PluginHealth:
    """Optional health check. Returns PluginHealth."""
    return PluginHealth(
        status=HealthStatus.HEALTHY,
        details={"mode": "integrated" if self._context else "standalone"},
    )
```

### Step 4: Add Frontend (if needed)

See [frontend-sdk.md](references/frontend-sdk.md) for component reference.

**Create frontend directory:**
```
frontend/
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.ts
    ├── App.vue
    ├── router/index.ts
    └── views/
```

**Package.json dependencies:**
```json
{
  "dependencies": {
    "@morscherlab/mld-sdk": "^0.4.0",
    "vue": "^3.4.0",
    "vue-router": "^4.0.0",
    "pinia": "^2.1.0"
  }
}
```

**Vite config (CRITICAL for SDK integration):**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // CRITICAL: Dedupe Vue/Pinia to avoid multiple instances
      'vue': resolve(__dirname, 'node_modules/vue'),
      'pinia': resolve(__dirname, 'node_modules/pinia'),
    },
    dedupe: ['vue', 'pinia', 'vue-router'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

**Main entry (src/main.ts):**
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import SDK styles
import '@morscherlab/mld-sdk/styles'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

**Basic plugin layout (src/App.vue):**

Use `AppLayout` + `AppTopBar` + `AppSidebar` for a standard plugin shell with topbar, context-sensitive sidebar, and main content area.

```vue
<template>
  <AppLayout floating>
    <template #topbar>
      <AppTopBar
        plugin-name="My Plugin"
        :title="currentPageTitle"
        variant="floating"
        :pages="pages"
        :current-page-id="currentPageId"
        :tabs="tabs"
        :current-tab-id="currentTabId"
        @page-select="handlePageSelect"
        @tab-select="handleTabSelect"
      >
        <template #actions>
          <ThemeToggle />
          <SettingsButton @click="showSettings = true" />
        </template>
      </AppTopBar>
    </template>

    <template #sidebar>
      <AppSidebar :panels="toolPanels" :active-view="currentPageId">
        <template #section-parameters>
          <FormField label="Threshold">
            <NumberInput v-model="threshold" :min="0" :max="100" />
          </FormField>
        </template>
        <template #section-display>
          <BaseCheckbox v-model="showOutliers" label="Show outliers" />
        </template>
        <template #section-filters>
          <BaseSelect v-model="statusFilter" :options="statusOptions" placeholder="All statuses" />
        </template>
      </AppSidebar>
    </template>

    <AppContainer scrollable>
      <router-view />
    </AppContainer>

    <!-- Settings modal with custom tabs + built-in appearance -->
    <SettingsModal
      v-model="showSettings"
      title="Plugin Settings"
      :tabs="settingsTabs"
      show-appearance
    >
      <template #tab-general>
        <div class="settings-section">
          <FormField label="API Endpoint">
            <BaseInput v-model="apiEndpoint" placeholder="https://..." />
          </FormField>
          <FormField label="Max Results">
            <NumberInput v-model="maxResults" :min="1" :max="1000" />
          </FormField>
        </div>
      </template>
    </SettingsModal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  AppLayout, AppTopBar, AppSidebar, AppContainer, ThemeToggle, SettingsButton,
  SettingsModal, FormField, BaseInput, BaseSelect, BaseCheckbox, NumberInput,
} from '@morscherlab/mld-sdk/components'
import type { SidebarToolSection, TopBarPage, TopBarTab } from '@morscherlab/mld-sdk/types'

const router = useRouter()
const route = useRoute()

// --- Settings ---
const showSettings = ref(false)
const settingsTabs = [{ id: 'general', label: 'General' }]
const apiEndpoint = ref('https://api.example.com')
const maxResults = ref(100)

// --- TopBar breadcrumb pages (dropdown under plugin name) ---
const pages: TopBarPage[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/' },
  { id: 'analysis', label: 'Analysis', to: '/analysis' },
  { id: 'results', label: 'Results', to: '/results' },
]

const currentPageId = computed(() => {
  return pages.find(p => p.to === route.path)?.id ?? ''
})
const currentPageTitle = computed(() => {
  return pages.find(p => p.id === currentPageId.value)?.label ?? ''
})

function handlePageSelect(page: TopBarPage) {
  if (page.to) router.push(page.to)
}

// --- TopBar center tabs (optional) ---
const tabs: TopBarTab[] = [
  { id: 'overview', label: 'Overview', to: '/analysis' },
  { id: 'details', label: 'Details', to: '/analysis/details' },
]
const currentTabId = computed(() => {
  return tabs.find(t => t.to === route.path)?.id ?? ''
})
function handleTabSelect(tab: TopBarTab) {
  if (tab.to) router.push(tab.to)
}

// --- Sidebar tool panels (per-view sections) ---
const toolPanels: Record<string, SidebarToolSection[]> = {
  analysis: [
    { id: 'parameters', label: 'Parameters', icon: '⚙️' },
    { id: 'display', label: 'Display', icon: '👁️', defaultOpen: false },
  ],
  results: [
    { id: 'filters', label: 'Filters', icon: '🔍' },
  ],
  // dashboard has no panels → sidebar hides automatically
}

// --- Sidebar tool state ---
const threshold = ref(50)
const showOutliers = ref(false)
const statusFilter = ref('')
const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
]
</script>
```

**Key layout concepts:**
- `AppLayout` orchestrates topbar + sidebar + main with `floating` variant (cards with gaps)
- `AppTopBar` supports breadcrumb navigation (`pluginName` > `title`), page dropdown, center tabs, and action slots
- `AppSidebar` shows context-sensitive tool sections based on the active view via `panels` config
- Sidebar auto-hides when the active view has no matching panels (e.g., dashboard page)
- Section content is provided through `#section-{id}` named slots
- `AppContainer scrollable` wraps main content for proper scrolling inside the fixed viewport
- `ThemeToggle` toggles light/dark mode (uses `useTheme` composable internally)
- `SettingsButton` is a gear icon button placed in `#actions` to open the settings modal
- `SettingsModal` provides a tabbed modal with custom `#tab-{id}` slots plus a built-in Appearance tab (theme, color palette, table density) via `showAppearance`

### Step 5: Configure pyproject.toml

```toml
[project]
name = "mld-plugin-example"
version = "1.0.0"
requires-python = ">=3.12"
dependencies = [
    "mld-sdk>=0.4.0",
    "fastapi>=0.109.0",
]

[project.entry-points."mld.plugins"]
example = "mld_plugin_example.plugin:ExamplePlugin"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/mld_plugin_example"]

# Include frontend build in package
[tool.hatch.build.targets.wheel.force-include]
"frontend/dist" = "mld_plugin_example/frontend"
```

---

## Reference Navigation

| Need to... | Read |
|------------|------|
| Understand PluginMetadata/Capabilities fields | [python-backend.md](references/python-backend.md) |
| Use repository protocols (experiments, plugin data, roles) | [python-backend.md](references/python-backend.md) |
| Handle exceptions properly | [python-backend.md](references/python-backend.md) |
| Use SDK components (buttons, inputs, modals) | [frontend-sdk.md](references/frontend-sdk.md) |
| Work with WellPlate, PlateMapEditor, Timeline | [frontend-sdk.md](references/frontend-sdk.md) |
| Use composables (useApi, useAuth, useToast) | [frontend-sdk.md](references/frontend-sdk.md) |
| Understand standalone vs integrated modes | [integration.md](references/integration.md) |
| Set up PostMessage communication | [integration.md](references/integration.md) |
| Get starter code templates | [quick-start-templates.md](references/quick-start-templates.md) |
| Follow architecture patterns and UX conventions | [guideline.md](references/guideline.md) |
| Debug a build, runtime, or deployment error | [troubleshooting.md](references/troubleshooting.md) |

---

## Common Patterns

### Accessing Experiments (Integrated Mode)

```python
# In your service class
async def get_experiment_data(self, experiment_id: int):
    if self._context is None:
        raise HTTPException(503, "Not available in standalone mode")

    repo = self._context.get_experiment_repository()
    experiment = await repo.get_by_id(experiment_id)
    return experiment
```

### Using SDK Components in Vue

```vue
<template>
  <div class="analysis-view">
    <BaseCard title="Run Analysis">
      <BaseInput v-model="experimentId" label="Experiment ID" />
      <BaseButton @click="runAnalysis" :loading="isLoading">
        Analyze
      </BaseButton>
    </BaseCard>

    <BaseModal v-model="showResults" title="Results">
      <pre>{{ results }}</pre>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput, BaseButton, BaseModal, CollapsibleCard as BaseCard } from '@morscherlab/mld-sdk/components'
import { useApi, useToast } from '@morscherlab/mld-sdk/composables'

const api = useApi({ baseUrl: '/api/example' })
const toast = useToast()

const experimentId = ref('')
const isLoading = ref(false)
const showResults = ref(false)
const results = ref(null)

async function runAnalysis() {
  isLoading.value = true
  try {
    results.value = await api.post('/run', { experiment_id: experimentId.value })
    showResults.value = true
  } catch (error) {
    toast.error('Analysis failed')
  } finally {
    isLoading.value = false
  }
}
</script>
```

### Well Plate Display

```vue
<template>
  <WellPlate
    v-model="selectedWells"
    :format="96"
    :wells="wellData"
    selection-mode="multiple"
    @well-click="handleWellClick"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { WellPlate } from '@morscherlab/mld-sdk/components'
import type { Well } from '@morscherlab/mld-sdk/types'

const wellData = ref<Record<string, Partial<Well>>>({
  A1: { sampleType: 'sample' },
  A2: { sampleType: 'control' },
})

const selectedWells = ref<string[]>([])

function handleWellClick(wellId: string) {
  console.log('Clicked:', wellId)
}

function handleSelectionChange(wellIds: string[]) {
  selectedWells.value = wellIds
}
</script>
```

### Dual-Mode Service Pattern

```python
class AnalysisService:
    def __init__(self, context: PlatformContext | None):
        self._context = context
        self._settings: dict = {}

        if context is not None:
            self._experiment_repo = context.get_experiment_repository()
            self._plugin_data_repo = context.get_plugin_data_repository()

    @property
    def is_standalone(self) -> bool:
        return self._context is None

    async def get_settings(self) -> dict:
        if self.is_standalone:
            return self._settings
        config = self._context.get_config()
        return config.get("plugin_settings", {})
```

---

## CSS Rules for SDK Components

**CRITICAL: Never use Tailwind utilities in SDK component wrappers.**

SDK components use CSS variables. Always use dedicated classes:

```vue
<!-- BAD: Tailwind won't work for SDK consumers -->
<div class="flex items-center gap-4 p-4">

<!-- GOOD: Dedicated CSS classes -->
<div class="analysis-controls">
```

```css
.analysis-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 1rem);
  padding: var(--spacing-md, 1rem);
}
```

**CSS naming convention:** BEM with `mld-` prefix: `.mld-{component}__{element}--{modifier}`

**Use `!important` with longhand properties for element resets:**

When SDK components use semantic HTML elements (`<h3>`, `<h4>`, `<p>`, `<table>`), consumers' frameworks (VitePress, Tailwind preflight, normalize.css) may override SDK margins/padding. Use **longhand** `!important` properties (not shorthand):

```css
/* BAD: shorthand !important does NOT override longhand rules */
.mld-component__title {
  margin: 0 !important;  /* Won't override VitePress margin-top: 32px */
}

/* GOOD: longhand !important overrides any source */
.mld-component__title {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding: 0 !important;
}
```

**Table reset pattern (for VitePress `.vp-doc` overrides):**

```css
.mld-component__table {
  border-collapse: collapse !important;
  border: none !important;
  margin: 0 !important;
}
.mld-component__table tr {
  border: none !important;
  background: transparent !important;
}
.mld-component__table tr:nth-child(2n) {
  background: transparent !important;  /* Reset VitePress zebra striping */
}
.mld-component__table th,
.mld-component__table td {
  border: none !important;
  background: transparent !important;
}
```

**CSS Variable Reference:**
- Colors: `--bg-primary`, `--bg-secondary`, `--bg-card`, `--text-primary`, `--text-muted`
- Spacing: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`
- Shadows: `--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg`
- Radius: `--radius-sm`, `--radius`, `--radius-md`, `--radius-lg`

---

## Troubleshooting

See [troubleshooting.md](references/troubleshooting.md) for the full guide covering build/setup, runtime backend, runtime frontend, deployment, and performance issues.
