# Full-Stack Plugin Example

Complete guide to building an MLD plugin with both Python backend and Vue frontend.

## Overview

This guide walks through creating a complete analysis plugin called "Peak Analyzer" that:
- Accepts experiment data via the backend API
- Runs analysis and stores results
- Displays results in a Vue frontend
- Integrates with the MLD platform

## Project Structure

```
peak-analyzer/
├── backend/
│   ├── pyproject.toml
│   └── src/peak_analyzer/
│       ├── __init__.py
│       ├── plugin.py
│       └── analysis.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       └── components/
│           └── AnalysisResults.vue
└── README.md
```

## Backend Implementation

### pyproject.toml

```toml
[project]
name = "peak-analyzer"
version = "1.0.0"
description = "Peak analysis plugin for MLD"
requires-python = ">=3.12"
dependencies = [
    "mld-sdk>=1.0.0",
    "fastapi>=0.100.0",
    "numpy>=1.24.0",
]

[project.entry-points."mld.plugins"]
peak_analyzer = "peak_analyzer.plugin:PeakAnalyzerPlugin"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/peak_analyzer"]

[tool.uv]
dev-dependencies = ["pytest>=8.0.0", "pytest-asyncio>=0.23.0"]
```

### plugin.py

```python
"""Peak Analyzer Plugin - Main plugin class."""

from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from mld_sdk import (
    AnalysisPlugin,
    PluginMetadata,
    PluginCapabilities,
    PluginType,
    PlatformContext,
    HealthStatus,
    PluginHealth,
    NotFoundException,
    ValidationException,
)

from .analysis import PeakAnalyzer

# --- Request/Response Models ---

class AnalysisRequest(BaseModel):
    experiment_id: str
    threshold: float = 0.1
    min_peak_width: int = 3


class AnalysisResponse(BaseModel):
    experiment_id: str
    peak_count: int
    peaks: list[dict[str, Any]]
    status: str


# --- Router ---

router = APIRouter()


def get_plugin() -> "PeakAnalyzerPlugin":
    """Dependency to get plugin instance."""
    return PeakAnalyzerPlugin._instance


@router.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@router.get("/experiments/{experiment_id}/results")
async def get_results(
    experiment_id: str,
    plugin: "PeakAnalyzerPlugin" = Depends(get_plugin),
):
    """Get analysis results for an experiment."""
    if plugin.is_standalone:
        raise HTTPException(503, "Not available in standalone mode")

    data_repo = plugin.context.get_plugin_data_repository()
    result = await data_repo.get_analysis_result(
        experiment_id=experiment_id,
        plugin_id=plugin.metadata.name,
    )

    if not result:
        raise HTTPException(404, "No analysis results found")

    return result.result


@router.post("/analyze", response_model=AnalysisResponse)
async def run_analysis(
    request: AnalysisRequest,
    plugin: "PeakAnalyzerPlugin" = Depends(get_plugin),
):
    """Run peak analysis on an experiment."""
    if plugin.is_standalone:
        raise HTTPException(503, "Not available in standalone mode")

    # Get experiment
    exp_repo = plugin.context.get_experiment_repository()
    experiment = await exp_repo.get_by_id(request.experiment_id)

    if not experiment:
        raise HTTPException(404, "Experiment not found")

    # Get experiment data
    data_repo = plugin.context.get_plugin_data_repository()
    exp_data = await data_repo.get_experiment_data(request.experiment_id)

    if not exp_data:
        raise HTTPException(400, "No data available for this experiment")

    # Run analysis
    analyzer = PeakAnalyzer(
        threshold=request.threshold,
        min_peak_width=request.min_peak_width,
    )
    peaks = analyzer.find_peaks(exp_data.data.get("signal", []))

    # Save results
    result = {
        "experiment_id": request.experiment_id,
        "experiment_name": experiment.name,
        "peak_count": len(peaks),
        "peaks": peaks,
        "parameters": {
            "threshold": request.threshold,
            "min_peak_width": request.min_peak_width,
        },
        "status": "completed",
    }

    await data_repo.save_analysis_result(
        experiment_id=request.experiment_id,
        plugin_id=plugin.metadata.name,
        result=result,
    )

    return AnalysisResponse(**result)


# --- Plugin Class ---

class PeakAnalyzerPlugin(AnalysisPlugin):
    """Peak analysis plugin for MLD platform."""

    _instance: "PeakAnalyzerPlugin | None" = None

    def __init__(self):
        super().__init__()
        PeakAnalyzerPlugin._instance = self

    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="peak-analyzer",
            version="1.0.0",
            description="Peak detection and analysis for chromatography data",
            analysis_type="metabolomics",
            routes_prefix="/peak-analyzer",
            plugin_type=PluginType.ANALYSIS,
            capabilities=PluginCapabilities(
                requires_auth=True,
                requires_experiments=True,
            ),
            author="MorscherLab",
            homepage="https://github.com/MorscherLab/peak-analyzer",
        )

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [(router, "")]

    async def initialize(self, context: PlatformContext | None = None) -> None:
        self._context = context

        if context:
            # Verify required repositories are available
            exp_repo = context.get_experiment_repository()
            data_repo = context.get_plugin_data_repository()

            if not exp_repo or not data_repo:
                from mld_sdk import PluginLifecycleException
                raise PluginLifecycleException(
                    "Required repositories not available",
                    phase="initialize",
                    plugin_name=self.metadata.name,
                )

    async def shutdown(self) -> None:
        pass

    async def check_health(self) -> PluginHealth:
        if self.is_standalone:
            return PluginHealth(
                status=HealthStatus.DEGRADED,
                message="Running in standalone mode",
            )
        return PluginHealth(status=HealthStatus.HEALTHY)

    def get_frontend_config(self) -> dict[str, Any]:
        return {
            "name": self.metadata.name,
            "version": self.metadata.version,
            "routePrefix": self.metadata.routes_prefix,
            "analysisType": self.metadata.analysis_type,
            "features": {
                "batchAnalysis": True,
                "exportFormats": ["csv", "json"],
            },
        }

    def get_frontend_dir(self) -> str | None:
        return str(Path(__file__).parent.parent.parent / "frontend" / "dist")
```

### analysis.py

```python
"""Peak detection algorithm."""

from dataclasses import dataclass
from typing import Any


@dataclass
class Peak:
    index: int
    position: float
    height: float
    width: float
    area: float


class PeakAnalyzer:
    """Simple peak detection for demonstration."""

    def __init__(self, threshold: float = 0.1, min_peak_width: int = 3):
        self.threshold = threshold
        self.min_peak_width = min_peak_width

    def find_peaks(self, signal: list[float]) -> list[dict[str, Any]]:
        """Find peaks in signal data."""
        if not signal or len(signal) < self.min_peak_width:
            return []

        peaks = []
        max_val = max(signal) if signal else 1
        threshold_abs = self.threshold * max_val

        i = 1
        while i < len(signal) - 1:
            # Simple peak detection: local maximum above threshold
            if (
                signal[i] > threshold_abs
                and signal[i] > signal[i - 1]
                and signal[i] > signal[i + 1]
            ):
                # Find peak boundaries
                left = i
                while left > 0 and signal[left - 1] < signal[left]:
                    left -= 1

                right = i
                while right < len(signal) - 1 and signal[right + 1] < signal[right]:
                    right += 1

                width = right - left
                if width >= self.min_peak_width:
                    # Calculate area (simple trapezoidal)
                    area = sum(signal[left : right + 1])

                    peaks.append({
                        "index": i,
                        "position": float(i),
                        "height": signal[i],
                        "width": width,
                        "area": area,
                    })

                i = right + 1
            else:
                i += 1

        return peaks
```

## Frontend Implementation

### package.json

```json
{
  "name": "peak-analyzer-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": {
    "@morscherlab/mld-sdk": "^0.2.0",
    "pinia": "^2.1.7",
    "vue": "^3.4.0",
    "vue-router": "^4.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/peak-analyzer/',  // Match routes_prefix
  build: {
    outDir: 'dist',
    emptyOutDir: true,
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

### main.ts

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@morscherlab/mld-sdk/styles'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### App.vue

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  BaseButton,
  BaseInput,
  BaseSelect,
  AlertBox,
  CollapsibleCard,
  ToastNotification,
} from '@morscherlab/mld-sdk'
import {
  useApi,
  useAuth,
  useToast,
  usePlatformContext,
} from '@morscherlab/mld-sdk'
import type { SelectOption } from '@morscherlab/mld-sdk'
import AnalysisResults from './components/AnalysisResults.vue'

const api = useApi()
const auth = useAuth()
const toast = useToast()
const { isIntegrated, plugin } = usePlatformContext()

// State
const experiments = ref<SelectOption[]>([])
const selectedExperiment = ref('')
const threshold = ref(0.1)
const minPeakWidth = ref(3)
const isLoading = ref(false)
const results = ref<any>(null)

// Initialize
onMounted(async () => {
  await auth.initializeAuth()
  await loadExperiments()
})

async function loadExperiments() {
  try {
    const response = await api.get<{ experiments: any[]; total: number }>('/experiments')
    experiments.value = response.experiments.map(exp => ({
      value: exp.id,
      label: exp.name,
    }))
  } catch (error) {
    toast.error('Failed to load experiments')
  }
}

async function runAnalysis() {
  if (!selectedExperiment.value) {
    toast.warning('Please select an experiment')
    return
  }

  isLoading.value = true
  try {
    results.value = await api.post('/peak-analyzer/analyze', {
      experiment_id: selectedExperiment.value,
      threshold: threshold.value,
      min_peak_width: minPeakWidth.value,
    })
    toast.success('Analysis complete!')
  } catch (error: any) {
    toast.error(error.response?.data?.detail || 'Analysis failed')
  } finally {
    isLoading.value = false
  }
}

async function loadResults() {
  if (!selectedExperiment.value) return

  try {
    results.value = await api.get(`/peak-analyzer/experiments/${selectedExperiment.value}/results`)
  } catch {
    // No results yet
    results.value = null
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-text-primary">Peak Analyzer</h1>
      <p class="text-text-secondary mt-1">
        Detect and analyze peaks in chromatography data
      </p>
      <p v-if="isIntegrated" class="text-xs text-text-muted mt-2">
        Running as: {{ plugin?.name }} v{{ plugin?.version }}
      </p>
    </header>

    <CollapsibleCard title="Analysis Settings" :default-open="true">
      <div class="space-y-4">
        <BaseSelect
          v-model="selectedExperiment"
          :options="experiments"
          label="Experiment"
          placeholder="Select an experiment"
          @update:model-value="loadResults"
        />

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model.number="threshold"
            type="number"
            label="Threshold"
            :step="0.01"
            :min="0"
            :max="1"
          />
          <BaseInput
            v-model.number="minPeakWidth"
            type="number"
            label="Min Peak Width"
            :step="1"
            :min="1"
          />
        </div>

        <div class="flex gap-2">
          <BaseButton
            variant="primary"
            :loading="isLoading"
            :disabled="!selectedExperiment"
            @click="runAnalysis"
          >
            Run Analysis
          </BaseButton>
        </div>
      </div>
    </CollapsibleCard>

    <div v-if="results" class="mt-6">
      <AnalysisResults :results="results" />
    </div>

    <AlertBox v-else-if="selectedExperiment" type="info" class="mt-6">
      No analysis results yet. Click "Run Analysis" to start.
    </AlertBox>

    <ToastNotification />
  </div>
</template>
```

### components/AnalysisResults.vue

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { CollapsibleCard, AlertBox } from '@morscherlab/mld-sdk'

interface Peak {
  index: number
  position: number
  height: number
  width: number
  area: number
}

interface Results {
  experiment_id: string
  experiment_name?: string
  peak_count: number
  peaks: Peak[]
  parameters: {
    threshold: number
    min_peak_width: number
  }
  status: string
}

const props = defineProps<{
  results: Results
}>()

const sortedPeaks = computed(() =>
  [...props.results.peaks].sort((a, b) => b.height - a.height)
)
</script>

<template>
  <CollapsibleCard :title="`Results: ${results.peak_count} peaks found`" :default-open="true">
    <div class="space-y-4">
      <AlertBox :type="results.peak_count > 0 ? 'success' : 'warning'">
        <template v-if="results.peak_count > 0">
          Found {{ results.peak_count }} peaks in {{ results.experiment_name || results.experiment_id }}
        </template>
        <template v-else>
          No peaks detected with current parameters
        </template>
      </AlertBox>

      <div v-if="results.peak_count > 0" class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-2 px-3 text-text-secondary font-medium">#</th>
              <th class="text-left py-2 px-3 text-text-secondary font-medium">Position</th>
              <th class="text-left py-2 px-3 text-text-secondary font-medium">Height</th>
              <th class="text-left py-2 px-3 text-text-secondary font-medium">Width</th>
              <th class="text-left py-2 px-3 text-text-secondary font-medium">Area</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(peak, i) in sortedPeaks"
              :key="peak.index"
              class="border-b border-border-light hover:bg-bg-hover"
            >
              <td class="py-2 px-3 text-text-primary">{{ i + 1 }}</td>
              <td class="py-2 px-3 text-text-primary">{{ peak.position.toFixed(2) }}</td>
              <td class="py-2 px-3 text-text-primary">{{ peak.height.toFixed(4) }}</td>
              <td class="py-2 px-3 text-text-primary">{{ peak.width }}</td>
              <td class="py-2 px-3 text-text-primary">{{ peak.area.toFixed(4) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-xs text-text-muted">
        Parameters: threshold={{ results.parameters.threshold }},
        min_peak_width={{ results.parameters.min_peak_width }}
      </div>
    </div>
  </CollapsibleCard>
</template>
```

## Building and Testing

### Build Backend

```bash
cd backend
uv sync
uv run pytest
```

### Build Frontend

```bash
cd frontend
npm install
npm run build
```

### Run Locally

For development, run the backend and frontend separately:

```bash
# Terminal 1 - Backend (if you have a test server)
cd backend
uv run uvicorn peak_analyzer.main:app --reload

# Terminal 2 - Frontend dev server
cd frontend
npm run dev
```

## Installation in MLD Platform

### Install Plugin

```bash
# Install from local path
uv add --editable ./path/to/peak-analyzer/backend

# Or from git
uv add git+https://github.com/org/peak-analyzer

# Or from PyPI (if published)
uv add peak-analyzer
```

### Platform Configuration

The platform will automatically:
1. Discover the plugin via `mld.plugins` entry point
2. Mount routes at `/peak-analyzer/`
3. Serve frontend files from the `get_frontend_dir()` path

## API Communication Patterns

### Request Flow

```
Frontend                    Backend                     Platform
   |                           |                           |
   |-- POST /analyze --------->|                           |
   |                           |-- get_experiment -------->|
   |                           |<-- Experiment ------------|
   |                           |-- get_experiment_data --->|
   |                           |<-- Data ------------------|
   |                           |-- [run analysis] ---------|
   |                           |-- save_analysis_result -->|
   |                           |<-- Result ----------------|
   |<-- AnalysisResponse ------|                           |
```

### Error Handling

Backend exceptions map to HTTP status codes:

| Exception | HTTP Status | Use Case |
|-----------|-------------|----------|
| `ValidationException` | 400 | Invalid input |
| `NotFoundException` | 404 | Resource not found |
| `PermissionException` | 403 | Access denied |
| `RepositoryException` | 500 | Database error |

Frontend handles errors via try/catch:

```typescript
try {
  const result = await api.post('/peak-analyzer/analyze', data)
} catch (error: any) {
  if (error.response?.status === 400) {
    toast.error('Invalid parameters')
  } else if (error.response?.status === 404) {
    toast.error('Experiment not found')
  } else {
    toast.error('Analysis failed')
  }
}
```

## Best Practices

### Backend

1. **Validate early** - Check inputs before processing
2. **Use typed models** - Pydantic models for requests/responses
3. **Handle standalone mode** - Return appropriate errors when context unavailable
4. **Implement health checks** - Help platform monitor plugin status

### Frontend

1. **Initialize auth first** - Call `initializeAuth()` on mount
2. **Use composables** - Prefer SDK composables over raw axios
3. **Handle loading states** - Show spinners during async operations
4. **Show meaningful errors** - Extract error messages from responses

### Both

1. **Match route prefixes** - Frontend base URL should match `routes_prefix`
2. **Version your schemas** - Include `schema_version` in saved data
3. **Log appropriately** - Debug logs in dev, errors in prod
