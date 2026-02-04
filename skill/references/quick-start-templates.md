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
async def analyze(experiment_id: str):
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
        )

    @property
    def capabilities(self) -> PluginCapabilities:
        return PluginCapabilities(
            plugin_type=PluginType.ANALYSIS,
            requires_auth=False,
            requires_database=False,
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
    "mld-sdk>=0.3.0",
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

    async def run_analysis(self, experiment_id: str, params: dict) -> dict:
        if self.is_standalone:
            return {"mode": "standalone", "experiment_id": experiment_id}

        repo = self._context.get_experiment_repository()
        experiment = await repo.get_by_id(experiment_id)
        # ... perform analysis
        return {"status": "complete", "experiment": experiment}

    async def get_settings(self) -> dict:
        if self.is_standalone:
            return self._settings
        return await self._context.get_plugin_config() or {}

    async def save_settings(self, settings: dict) -> None:
        if self.is_standalone:
            self._settings = settings
        else:
            await self._context.set_plugin_config(settings)

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
    experiment_id: str
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
from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities, PluginType
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
        )

    @property
    def capabilities(self) -> PluginCapabilities:
        return PluginCapabilities(
            plugin_type=PluginType.ANALYSIS,
            requires_auth=True,
            requires_database=True,
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

    async def check_health(self) -> dict:
        return {
            "status": "healthy",
            "mode": "integrated" if self._context else "standalone",
            "version": self.metadata.version,
        }
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
    "@morscherlab/mld-sdk": "^0.3.0",
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
  <div class="app">
    <AppTopBar title="My Analysis Plugin">
      <template #actions>
        <ThemeToggle />
      </template>
    </AppTopBar>

    <div class="app__content">
      <router-view />
    </div>

    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { AppTopBar, ThemeToggle, ToastNotification } from '@morscherlab/mld-sdk/components'
</script>

<style>
.app {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.app__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
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
