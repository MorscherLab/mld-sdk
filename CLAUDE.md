# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MLD SDK is a monorepo containing two coordinated packages for building plugins that integrate with the MorscherLab Database (MLD) platform:

- **Python SDK** (`packages/python`): Backend plugin framework using FastAPI
- **Frontend SDK** (`packages/frontend`): Vue 3 component library for plugin UIs

## Development Commands

### Python SDK (`packages/python`)
```bash
uv sync                    # Install dependencies
uv sync --all-extras       # Install with dev dependencies
uv run pytest -v           # Run tests
uv build                   # Build distribution
```

### Frontend SDK (`packages/frontend`)
```bash
npm install                # Install dependencies
npm run build              # Build for distribution
npm run typecheck          # Type check with vue-tsc
npm run dev                # Watch mode build
npm run clean              # Remove dist/
```

### CI/CD
Tests run automatically on push to main and PRs. Release workflow triggers on `v*` tags.

## Architecture

### Python SDK

**Core modules in `src/mld_sdk/`:**

| Module | Purpose |
|--------|---------|
| `plugin.py` | `AnalysisPlugin` ABC - base class all plugins inherit |
| `models.py` | `PluginMetadata`, `PluginCapabilities`, `PluginType` |
| `context.py` | `PlatformContext` - platform services interface |
| `repositories.py` | Protocol-based data access (experiments, users, compounds, etc.) |
| `exceptions.py` | Exception hierarchy with serialization support |

**Plugin system:**
- Plugins discovered via Python entry points (`mld.plugins`)
- Dual-mode operation: standalone (no context) or integrated (full platform access)
- `PluginType.ANALYSIS` = read-only experiment access; `PluginType.EXPERIMENT_DESIGN` = full CRUD
- Plugins provide FastAPI `APIRouter` objects mounted at configurable prefixes

**Repository protocols:** `ExperimentRepository`, `PluginDataRepository`, `UserRepository`, `AnalysisArtifactRepository`, `CompoundListRepository`, `MetadataTemplateRepository`, `TracingPresetRepository`

### Frontend SDK

**Structure in `src/`:**

| Directory | Contents |
|-----------|----------|
| `components/` | 29 Vue 3 components (base inputs, forms, feedback, layout, well plates) |
| `composables/` | `useApi`, `useAuth`, `usePasskey`, `useTheme`, `useToast`, `usePlatformContext`, `useForm`, `useAsync`, `useWellPlateEditor` |
| `stores/` | `useAuthStore` (auth state), `useSettingsStore` (app settings) |
| `types/` | TypeScript definitions for all components and platform types |
| `styles/` | CSS with CSS variables for theming |

**Domain-specific components:** `WellPlate`, `SampleLegend`, `PlateMapEditor`, `ExperimentTimeline` - for biological lab workflows

**Multiple export paths:**
```typescript
import { BaseButton } from '@morscherlab/mld-sdk/components'
import { useAuth } from '@morscherlab/mld-sdk/composables'
import { useAuthStore } from '@morscherlab/mld-sdk/stores'
import type { WellPlateFormat } from '@morscherlab/mld-sdk/types'
```

## Key Patterns

### Python Plugin Structure
```python
from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities, PlatformContext
from fastapi import APIRouter

class MyPlugin(AnalysisPlugin):
    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="my-plugin",
            version="1.0.0",
            description="...",
            analysis_type="custom",
            routes_prefix="/my-plugin"
        )

    def get_routers(self) -> list[APIRouter]:
        return [router]

    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context

    async def shutdown(self) -> None:
        pass
```

### Entry Point Registration
```toml
# pyproject.toml
[project.entry-points."mld.plugins"]
my_plugin = "my_package.plugin:MyPlugin"
```

### Frontend Auth Pattern
```typescript
const auth = useAuth()
await auth.initializeAuth()
if (!auth.isAuthenticated.value) {
    await auth.login(username, password)
}
```

## Tech Stack

- **Python**: 3.12+, FastAPI, Pydantic 2.x, uv package manager
- **Frontend**: Vue 3.4+, TypeScript 5.3+, Pinia, Vite, Tailwind CSS 4.x
- **Build**: Hatchling (Python), Vite library mode (frontend)
- **Registry**: GitHub Packages (both npm and PyPI)

## Version Coordination

Both packages share the same version number. Current: 0.2.0
