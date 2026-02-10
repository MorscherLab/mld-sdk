# Quick Start Templates

Copy-paste starter code for common plugin scenarios.

## Minimal Analysis Plugin

```python
# src/mld_plugin_example/plugin.py
from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities, PluginType
from mld_sdk.context import PlatformContext
from fastapi import APIRouter

router = APIRouter(tags=["example"])

@router.get("/hello")
async def hello():
    return {"message": "Hello from example plugin!"}

@router.get("/analyze/{experiment_id}")
async def analyze(experiment_id: int):
    return {"status": "analyzed", "experiment_id": experiment_id}


class ExamplePlugin(AnalysisPlugin):
    def __init__(self):
        self._context: PlatformContext | None = None

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


# Standalone runner
def create_standalone_app():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware

    app = FastAPI(title="Example Plugin (Standalone)")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

    plugin = ExamplePlugin()

    @app.on_event("startup")
    async def startup():
        await plugin.initialize(context=None)

    for router, prefix in plugin.get_routers():
        app.include_router(router, prefix=f"/api{prefix}")

    return app


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("plugin:create_standalone_app", factory=True, reload=True, port=8003)
```

---

## pyproject.toml Template

```toml
[project]
name = "mld-plugin-example"
version = "1.0.0"
description = "Example MLD analysis plugin"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "mld-sdk>=0.4.0",
    "fastapi>=0.109.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.23.0",
    "httpx>=0.27.0",
]

[project.entry-points."mld.plugins"]
example = "mld_plugin_example.plugin:ExamplePlugin"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/mld_plugin_example"]

# Include frontend build in package (if applicable)
[tool.hatch.build.targets.wheel.force-include]
"frontend/dist" = "mld_plugin_example/frontend"
```

---

## Plugin with Local Database

For plugins that need persistent local storage (settings, cached data, instrument readings):

```python
# src/mld_plugin_example/plugin.py
from mld_sdk import AnalysisPlugin, PluginMetadata, LocalDatabaseConfig
from mld_sdk.context import PlatformContext
from sqlmodel import SQLModel, Field, select
from fastapi import APIRouter

router = APIRouter(tags=["example"])


class InstrumentReading(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    experiment_id: int = Field(index=True)
    intensity: float
    channel: str


class ExamplePlugin(AnalysisPlugin):
    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="example-local-db",
            version="1.0.0",
            description="Example plugin with local database",
            analysis_type="example",
            routes_prefix="/example",
        )

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [(router, self.metadata.routes_prefix)]

    def get_shared_models(self) -> list[type]:
        return [InstrumentReading]

    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context
        self._setup_standalone_db()

        # High-level: key-value settings
        self.standalone_db.set("default_channel", "A", namespace="settings")

    async def shutdown(self) -> None:
        self._teardown_standalone_db()

    def store_reading(self, exp_id: int, intensity: float, channel: str):
        with self.standalone_db.get_session() as session:
            session.add(InstrumentReading(
                experiment_id=exp_id, intensity=intensity, channel=channel
            ))
            session.commit()

    def get_readings(self, exp_id: int) -> list[InstrumentReading]:
        with self.standalone_db.get_session() as session:
            return list(session.exec(
                select(InstrumentReading).where(
                    InstrumentReading.experiment_id == exp_id
                )
            ).all())
```

> **Note:** For unified async database access (e.g., in route handlers), use `get_plugin_db_session()` which yields an async SQLAlchemy session from either the standalone or platform database.

**pyproject.toml** addition for local-db dependency:

```toml
dependencies = [
    "mld-sdk[local-db]>=0.4.0",
    "fastapi>=0.109.0",
]
```

---

## Plugin with Service Layer

### Directory Structure

```
mld-plugin-myanalysis/
├── pyproject.toml
├── src/mld_plugin_myanalysis/
│   ├── __init__.py
│   ├── plugin.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── analysis_service.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── analysis.py
│   │   └── health.py
│   └── schemas/
│       ├── __init__.py
│       └── requests.py
└── tests/
    └── test_plugin.py
```

### Service Class

```python
# services/analysis_service.py
from mld_sdk.context import PlatformContext

class AnalysisService:
    def __init__(self, context: PlatformContext | None):
        self._context = context
        self._settings: dict = {}

    @property
    def is_standalone(self) -> bool:
        return self._context is None

    async def run_analysis(self, experiment_id: int, params: dict) -> dict:
        if self.is_standalone:
            return {"mode": "standalone", "experiment_id": experiment_id}

        repo = self._context.get_experiment_repository()
        experiment = await repo.get_by_id(experiment_id)
        # ... perform analysis
        return {"status": "complete", "experiment": experiment}

    async def get_settings(self) -> dict:
        if self.is_standalone:
            return self._settings
        config = self._context.get_config()
        return config.get("plugin_settings", {})

    async def save_settings(self, settings: dict) -> None:
        if self.is_standalone:
            self._settings = settings
        # In integrated mode, settings are managed by the platform

    async def cleanup(self) -> None:
        pass
```

### Router with Service Injection

```python
# routers/analysis.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
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


class AnalysisRequest(BaseModel):
    experiment_id: int
    parameters: dict = {}


class AnalysisResponse(BaseModel):
    status: str
    results: dict = {}


@router.post("/run", response_model=AnalysisResponse)
async def run_analysis(
    request: AnalysisRequest,
    service: AnalysisService = Depends(get_service),
) -> AnalysisResponse:
    result = await service.run_analysis(request.experiment_id, request.parameters)
    return AnalysisResponse(status="complete", results=result)


@router.get("/settings")
async def get_settings(service: AnalysisService = Depends(get_service)):
    return await service.get_settings()


@router.put("/settings")
async def update_settings(
    settings: dict,
    service: AnalysisService = Depends(get_service),
):
    await service.save_settings(settings)
    return {"status": "saved"}
```

### Plugin Class

```python
# plugin.py
from mld_sdk import (
    AnalysisPlugin, PluginMetadata, PluginCapabilities, PluginType,
    PluginHealth, HealthStatus,
)
from mld_sdk.context import PlatformContext
from fastapi import APIRouter

from .services.analysis_service import AnalysisService
from .routers import analysis, health


class MyAnalysisPlugin(AnalysisPlugin):
    def __init__(self):
        self._context: PlatformContext | None = None
        self._service: AnalysisService | None = None

    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="my-analysis",
            version="1.0.0",
            description="My analysis plugin",
            analysis_type="custom",
            routes_prefix="/my-analysis",
            plugin_type=PluginType.ANALYSIS,
            capabilities=PluginCapabilities(
                requires_auth=True,
                requires_database=True,
            ),
        )

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [
            (analysis.router, f"{self.metadata.routes_prefix}"),
            (health.router, f"{self.metadata.routes_prefix}/health"),
        ]

    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context
        self._service = AnalysisService(context)

        # Inject service into routers
        analysis.set_service(self._service)

    async def shutdown(self) -> None:
        if self._service:
            await self._service.cleanup()

    async def check_health(self) -> PluginHealth:
        return PluginHealth(
            status=HealthStatus.HEALTHY,
            details={
                "mode": "integrated" if self._context else "standalone",
                "version": self.metadata.version,
            },
        )
```

---

## Full-Stack Plugin with Frontend

### Frontend package.json

```json
{
  "name": "mld-plugin-example-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@morscherlab/mld-sdk": "^0.4.0",
    "pinia": "^2.1.7",
    "vue": "^3.4.0",
    "vue-router": "^4.2.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "~5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0"
  }
}
```

**For local SDK development:**

```json
{
  "dependencies": {
    "@estrellaxd/mld-sdk": "file:../../packages/frontend"
  }
}
```

### Vite Configuration

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
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8003',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```

### Main Entry

```typescript
// src/main.ts
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

### App.vue with Layout

```vue
<!-- src/App.vue -->
<template>
  <AppLayout floating>
    <template #topbar>
      <AppTopBar
        plugin-name="My Analysis Plugin"
        :title="currentPageTitle"
        :pages="pages"
        :current-page-id="currentPageId"
        show-theme-toggle
        @page-select="handlePageSelect"
      />
    </template>

    <template #sidebar>
      <AppSidebar :panels="toolPanels" :active-view="currentPageId">
        <template #section-settings>
          <FormField label="Threshold">
            <NumberInput v-model="threshold" :min="0" :max="100" />
          </FormField>
        </template>
      </AppSidebar>
    </template>

    <!-- Single card (simple pages) -->
    <AppContainer scrollable>
      <router-view />
    </AppContainer>

    <!-- Multi-panel layout (use direction prop) -->
    <!-- <AppContainer direction="row">
      <AppContainer scrollable style="width: 280px; flex: none;">List</AppContainer>
      <AppContainer scrollable>Detail</AppContainer>
    </AppContainer> -->

    <ToastNotification />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  AppLayout,
  AppTopBar,
  AppSidebar,
  AppContainer,
  FormField,
  NumberInput,
  ToastNotification,
} from '@morscherlab/mld-sdk/components'
import type { SidebarToolSection, TopBarPage } from '@morscherlab/mld-sdk/types'

const router = useRouter()
const route = useRoute()
const threshold = ref(50)

const pages: TopBarPage[] = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'analysis', label: 'Analysis', to: '/analysis' },
]

const currentPageId = computed(() => pages.find(p => p.to === route.path)?.id ?? '')
const currentPageTitle = computed(() => pages.find(p => p.id === currentPageId.value)?.label ?? '')

function handlePageSelect(page: TopBarPage) {
  if (page.to) router.push(page.to)
}

// Sidebar shows tool sections only on the analysis page
const toolPanels: Record<string, SidebarToolSection[]> = {
  analysis: [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ],
}
</script>
```

### Router

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/AnalysisView.vue'),
    },
  ],
})

export default router
```

### Analysis View

```vue
<!-- src/views/AnalysisView.vue -->
<template>
  <div class="analysis-view">
    <CollapsibleCard title="Run Analysis" :default-open="true">
      <FormField label="Experiment ID" required>
        <BaseInput v-model="experimentId" placeholder="Enter experiment ID" />
      </FormField>

      <div class="analysis-view__actions">
        <BaseButton
          variant="primary"
          :loading="isLoading"
          :disabled="!experimentId"
          @click="runAnalysis"
        >
          Run Analysis
        </BaseButton>
      </div>
    </CollapsibleCard>

    <AlertBox v-if="error" type="error" :dismissible="true" @dismiss="error = ''">
      {{ error }}
    </AlertBox>

    <CollapsibleCard v-if="results" title="Results" :default-open="true">
      <pre class="analysis-view__results">{{ JSON.stringify(results, null, 2) }}</pre>
    </CollapsibleCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BaseButton,
  BaseInput,
  CollapsibleCard,
  FormField,
  AlertBox,
} from '@morscherlab/mld-sdk/components'
import { useApi, useToast } from '@morscherlab/mld-sdk/composables'

const api = useApi({ baseUrl: '/api/my-analysis' })
const toast = useToast()

const experimentId = ref('')
const isLoading = ref(false)
const error = ref('')
const results = ref<object | null>(null)

async function runAnalysis() {
  if (!experimentId.value) return

  isLoading.value = true
  error.value = ''

  try {
    const response = await api.post('/run', {
      experiment_id: experimentId.value,
      parameters: {},
    })
    results.value = response
    toast.success('Analysis complete!')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Analysis failed'
    toast.error('Analysis failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.analysis-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analysis-view__actions {
  margin-top: 1rem;
}

.analysis-view__results {
  background-color: var(--bg-tertiary);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  overflow-x: auto;
}
</style>
```

---

## Frontend Directory in Plugin

Add frontend serving to your plugin:

```python
# plugin.py
def get_frontend_dir(self) -> str | None:
    from pathlib import Path

    # When installed as package
    dist = Path(__file__).parent / "frontend"
    if dist.exists():
        return str(dist)

    # Development: check relative path
    dev_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"
    if dev_dist.exists():
        return str(dev_dist)

    return None

def get_frontend_config(self) -> dict:
    return {
        "name": self.metadata.name,
        "routePrefix": self.metadata.routes_prefix,
        "navItems": [
            {"path": "/", "label": "Home", "requiresAuth": False},
            {"path": "/analysis", "label": "Analysis", "requiresAuth": True},
        ],
    }
```

Add to standalone app:

```python
def create_standalone_app():
    # ... setup ...

    # Serve frontend
    frontend_dir = plugin.get_frontend_dir()
    if frontend_dir:
        from fastapi.staticfiles import StaticFiles
        app.mount("/", StaticFiles(directory=frontend_dir, html=True))

    return app
```

---

## TypeScript Types

```typescript
// src/types/index.ts
export interface AnalysisRequest {
  experiment_id: string
  parameters?: Record<string, unknown>
}

export interface AnalysisResponse {
  status: 'pending' | 'running' | 'complete' | 'failed'
  results?: Record<string, unknown>
  error?: string
}

export interface PluginSettings {
  autoSave: boolean
  defaultParameters: Record<string, unknown>
}
```

---

## Lab Components Example

### Dose Calculator with Well Plate

```vue
<!-- src/views/DoseCalculatorView.vue -->
<template>
  <div class="dose-view">
    <CollapsibleCard title="Concentration Calculator" :default-open="true">
      <ConcentrationInput
        v-model="stockConcentration"
        :allowed-units="['M', 'mM', 'uM', 'nM']"
        :show-conversion="true"
        :molecular-weight="molecularWeight"
      />

      <DoseCalculator
        mode="serial"
        :molecular-weight="molecularWeight"
        :target-wells="selectedWells"
        @apply-to-wells="handleApplyToWells"
        @calculate="handleCalculate"
      />
    </CollapsibleCard>

    <CollapsibleCard title="Target Plate" :default-open="true">
      <WellPlate
        v-model="selectedWells"
        :format="96"
        :wells="wellData"
        selection-mode="rectangle"
        show-labels
        @selection-change="handleSelectionChange"
      />
    </CollapsibleCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CollapsibleCard,
  ConcentrationInput,
  DoseCalculator,
  WellPlate,
} from '@morscherlab/mld-sdk/components'
import { useConcentrationUnits, useDoseCalculator, useToast } from '@morscherlab/mld-sdk/composables'
import type { ConcentrationValue, Well, SerialDilutionResult } from '@morscherlab/mld-sdk/types'

const toast = useToast()
const { formatWithUnit } = useConcentrationUnits()

const molecularWeight = ref(342.3)
const stockConcentration = ref<ConcentrationValue>({ value: 10, unit: 'mM' })
const selectedWells = ref<string[]>([])
const wellData = ref<Record<string, Partial<Well>>>({})

function handleSelectionChange(wellIds: string[]) {
  selectedWells.value = wellIds
}

function handleApplyToWells(wellConcentrations: Record<string, ConcentrationValue>) {
  Object.entries(wellConcentrations).forEach(([wellId, conc]) => {
    wellData.value[wellId] = {
      ...wellData.value[wellId],
      sampleType: 'sample',
      value: conc.value,
    }
  })
  toast.success(`Applied concentrations to ${Object.keys(wellConcentrations).length} wells`)
}

function handleCalculate(result: SerialDilutionResult) {
  console.log('Serial dilution series:', result)
}
</script>

<style>
.dose-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
```

---

### Protocol Editor with Timeline

```vue
<!-- src/views/ProtocolView.vue -->
<template>
  <div class="protocol-view">
    <div class="protocol-view__sidebar">
      <ExperimentTimeline
        v-model="protocolSteps"
        orientation="vertical"
        editable
        collapsible
        color-by-status
        @step-click="handleStepClick"
        @step-add="handleStepAdd"
        @step-remove="handleStepRemove"
      />
    </div>

    <div class="protocol-view__editor">
      <ProtocolStepEditor
        v-if="activeStep"
        v-model="activeStep"
        :templates="builtInTemplates"
        :custom-templates="customTemplates"
        mode="edit"
        show-preview
      />
      <AlertBox v-else type="info">
        Select a step from the timeline to edit, or add a new step.
      </AlertBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ExperimentTimeline,
  ProtocolStepEditor,
  AlertBox,
} from '@morscherlab/mld-sdk/components'
import { useProtocolTemplates } from '@morscherlab/mld-sdk/composables'
import type { ProtocolStep } from '@morscherlab/mld-sdk/types'

const { builtInTemplates, customTemplates, createStepFromTemplate } = useProtocolTemplates()

const protocolSteps = ref<ProtocolStep[]>([
  {
    id: '1',
    type: 'addition',
    name: 'Add cells',
    description: 'Seed cells into plate',
    duration: 15,
    status: 'completed',
    order: 0,
  },
  {
    id: '2',
    type: 'incubation',
    name: 'Overnight incubation',
    description: 'Incubate at 37C overnight',
    duration: 960,
    status: 'in_progress',
    order: 1,
  },
])

const activeStepId = ref<string>('2')

const activeStep = computed({
  get: () => protocolSteps.value.find(s => s.id === activeStepId.value),
  set: (step) => {
    if (step) {
      const index = protocolSteps.value.findIndex(s => s.id === step.id)
      if (index >= 0) protocolSteps.value[index] = step
    }
  },
})

function handleStepClick(stepId: string) {
  activeStepId.value = stepId
}

function handleStepAdd(afterStepId?: string) {
  const newStep = createStepFromTemplate('addition', {
    name: 'New Step',
    status: 'pending',
  })
  const insertIndex = afterStepId
    ? protocolSteps.value.findIndex(s => s.id === afterStepId) + 1
    : protocolSteps.value.length
  protocolSteps.value.splice(insertIndex, 0, newStep)
  activeStepId.value = newStep.id
}

function handleStepRemove(stepId: string) {
  protocolSteps.value = protocolSteps.value.filter(s => s.id !== stepId)
  if (activeStepId.value === stepId) {
    activeStepId.value = protocolSteps.value[0]?.id || ''
  }
}
</script>

<style>
.protocol-view {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  min-height: 500px;
}

.protocol-view__sidebar {
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.protocol-view__editor {
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}
</style>
```

---

### Reagent Inventory with Molecule Display

```vue
<!-- src/views/ReagentInventoryView.vue -->
<template>
  <div class="inventory-view">
    <CollapsibleCard title="Add New Reagent" :default-open="false">
      <FormField label="Compound Structure">
        <MoleculeInput
          v-model="newMolecule"
          :height="300"
          show-smiles
        />
      </FormField>

      <FormField label="Name" required>
        <BaseInput v-model="newReagentName" placeholder="Reagent name" />
      </FormField>

      <FormField label="Stock Concentration">
        <ConcentrationInput
          v-model="newConcentration"
          :molecular-weight="newMolecule.weight"
          show-conversion
        />
      </FormField>

      <BaseButton variant="primary" @click="addReagent">
        Add to Inventory
      </BaseButton>
    </CollapsibleCard>

    <CollapsibleCard title="Reagent Inventory" :default-open="true">
      <ReagentList
        v-model="reagents"
        :show-stock-level="true"
        :low-stock-threshold="15"
        :columns="['name', 'concentration', 'volume', 'stockLevel', 'location']"
        sortable
        searchable
      />
    </CollapsibleCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CollapsibleCard,
  FormField,
  BaseInput,
  BaseButton,
  MoleculeInput,
  ConcentrationInput,
  ReagentList,
} from '@morscherlab/mld-sdk/components'
import { useToast } from '@morscherlab/mld-sdk/composables'
import type { MoleculeData, ConcentrationValue, Reagent } from '@morscherlab/mld-sdk/types'

const toast = useToast()

const newMolecule = ref<MoleculeData>({ smiles: '', molfile: '' })
const newReagentName = ref('')
const newConcentration = ref<ConcentrationValue>({ value: 10, unit: 'mM' })

const reagents = ref<Reagent[]>([
  {
    id: '1',
    name: 'DMSO',
    concentration: { value: 100, unit: '%' },
    volume: { value: 500, unit: 'mL' },
    stockLevel: 85,
    location: 'Cabinet A',
  },
  {
    id: '2',
    name: 'Dexamethasone',
    concentration: { value: 10, unit: 'mM' },
    volume: { value: 10, unit: 'mL' },
    stockLevel: 12,
    location: 'Freezer -20C',
  },
])

function addReagent() {
  if (!newReagentName.value) {
    toast.error('Please enter a reagent name')
    return
  }

  reagents.value.push({
    id: crypto.randomUUID(),
    name: newReagentName.value,
    concentration: { ...newConcentration.value },
    stockLevel: 100,
  })

  toast.success(`Added ${newReagentName.value} to inventory`)
  newReagentName.value = ''
  newMolecule.value = { smiles: '', molfile: '' }
}
</script>

<style>
.inventory-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
```
