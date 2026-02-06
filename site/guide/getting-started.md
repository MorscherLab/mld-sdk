# Getting Started

This guide walks you through creating your first MLD plugin with both backend and frontend components.

## Prerequisites

- Python 3.12+
- Node.js 20+
- uv (Python package manager)
- npm

## Installation

### Python SDK

```bash
# Configure GitHub Packages in pyproject.toml:
# [[tool.uv.index]]
# name = "github"
# url = "https://ghcr.io/v2/MorscherLab"

uv add mld-sdk
```

### Frontend SDK

```bash
# Create .npmrc with:
# @morscherlab:registry=https://npm.pkg.github.com

npm install @morscherlab/mld-sdk
```

## Project Structure

A typical MLD plugin has this structure:

```
my-plugin/
├── backend/
│   ├── pyproject.toml
│   └── src/my_plugin/
│       ├── __init__.py
│       └── plugin.py
└── frontend/
    ├── package.json
    ├── src/
    │   ├── main.ts
    │   └── App.vue
    └── vite.config.ts
```

## Creating the Backend

### 1. Set Up Project

```bash
mkdir -p my-plugin/backend
cd my-plugin/backend
uv init
uv add mld-sdk fastapi
```

### 2. Create Plugin Class

```python
# src/my_plugin/plugin.py
from mld_sdk import (
    AnalysisPlugin,
    PluginMetadata,
    PluginCapabilities,
    PluginType,
    PlatformContext,
)
from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
async def get_status():
    return {"status": "running"}

@router.get("/analyze/{experiment_id}")
async def analyze(experiment_id: str):
    return {"experiment_id": experiment_id, "result": "analysis complete"}


class MyPlugin(AnalysisPlugin):
    """My first MLD plugin."""

    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="My Plugin",
            version="1.0.0",
            description="My first analysis plugin",
            analysis_type="metabolomics",
            routes_prefix="/my-plugin",
            plugin_type=PluginType.ANALYSIS,
            capabilities=PluginCapabilities(
                requires_auth=True,
                requires_experiments=True,
            ),
        )

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [(router, "")]

    async def initialize(self, context: PlatformContext | None = None) -> None:
        self._context = context
        if context:
            # Access platform services
            self.experiment_repo = context.get_experiment_repository()
            self.data_repo = context.get_plugin_data_repository()

    async def shutdown(self) -> None:
        # Clean up resources
        pass
```

### 3. Register Entry Point

```toml
# pyproject.toml
[project]
name = "my-plugin"
version = "1.0.0"
dependencies = ["mld-sdk>=1.0.0", "fastapi"]

[project.entry-points."mld.plugins"]
my_plugin = "my_plugin.plugin:MyPlugin"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/my_plugin"]
```

## Creating the Frontend

### 1. Set Up Project

```bash
cd my-plugin
npm create vite@latest frontend -- --template vue-ts
cd frontend
npm install @morscherlab/mld-sdk pinia vue-router
```

### 2. Configure Styles

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@morscherlab/mld-sdk/styles'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### 3. Create UI

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  BaseButton,
  BaseInput,
  AlertBox,
  CollapsibleCard,
} from '@morscherlab/mld-sdk'
import { useApi, useToast, useAuth } from '@morscherlab/mld-sdk'

const api = useApi()
const toast = useToast()
const { initializeAuth, isAuthenticated } = useAuth()

const experimentId = ref('')
const result = ref<string | null>(null)
const loading = ref(false)

// Initialize auth on mount
initializeAuth()

async function runAnalysis() {
  if (!experimentId.value) {
    toast.warning('Please enter an experiment ID')
    return
  }

  loading.value = true
  try {
    const data = await api.get<{ result: string }>(
      `/my-plugin/analyze/${experimentId.value}`
    )
    result.value = data.result
    toast.success('Analysis complete!')
  } catch (error) {
    toast.error('Analysis failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">My Plugin</h1>

    <CollapsibleCard title="Run Analysis" :default-open="true">
      <div class="space-y-4">
        <BaseInput
          v-model="experimentId"
          label="Experiment ID"
          placeholder="Enter experiment ID"
        />

        <BaseButton
          variant="primary"
          :loading="loading"
          @click="runAnalysis"
        >
          Run Analysis
        </BaseButton>

        <AlertBox v-if="result" type="success">
          {{ result }}
        </AlertBox>
      </div>
    </CollapsibleCard>
  </div>
</template>
```

## Testing

### Run Backend Tests

```bash
cd backend
uv run pytest
```

### Run Frontend Type Check

```bash
cd frontend
npm run typecheck
```

## Next Steps

- [Python API Reference](/python/api-reference) - Full Python SDK documentation
- [Frontend Components](/frontend/components) - All available components
- [Plugin Development Guide](/python/plugin-guide) - Advanced plugin patterns
- [Full-Stack Example](/integration/fullstack-plugin) - Complete plugin walkthrough
