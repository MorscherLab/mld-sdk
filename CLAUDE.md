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
| `local_database.py` | `LocalDatabase`, `LocalDatabaseConfig` - per-plugin SQLite storage |
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
| `components/` | 70 Vue 3 components (base inputs, forms, feedback, layout, data display, scientific, lab, workflow, scheduling) |
| `composables/` | `useApi`, `useAuth`, `usePasskey`, `useTheme`, `useToast`, `usePlatformContext`, `useForm`, `useAsync`, `useWellPlateEditor`, `useConcentrationUnits`, `useDoseCalculator`, `useProtocolTemplates`, `useChemicalFormula`, `useSequenceUtils`, `useTimeUtils`, `useScheduleDrag` |
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

### Frontend SDK CSS Rules

**CRITICAL: Never use Tailwind utility classes directly in SDK components.**

SDK components must use dedicated CSS classes with CSS variables to ensure they work regardless of the consumer's Tailwind configuration. Consumers may not have Tailwind, or may not configure content scanning to include SDK files.

```vue
<!-- BAD: Tailwind utilities won't work for SDK consumers -->
<div class="fixed inset-0 z-50 flex items-center justify-center">

<!-- GOOD: Dedicated CSS classes with variables -->
<div class="mld-modal">
```

**CSS naming convention:** BEM with `mld-` prefix: `.mld-{component}__{element}--{modifier}`

**Required CSS variables** (defined in `styles/variables.css`):
- Colors: `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-hover`, `--text-primary`, `--text-muted`, `--border-color`
- Shadows: `--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg`
- Radius: `--radius-sm`, `--radius`, `--radius-md`, `--radius-lg`
- Aliases with `--mld-` prefix for backwards compatibility

**After CSS changes:** Always rebuild SDK (`npm run build`) before testing in showcase.

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

Both packages share the same version number. Current: 0.4.0

## Documentation Sync

**Keep these in sync when adding components or changing APIs:**
- This file (`CLAUDE.md`) - update component counts, composable lists
- Skill at `skill/` (in repository) - update reference docs
- Run `./scripts/sync-skill-version.sh X.Y.Z` before releasing

**Skill distribution:** Skill files are packaged as `mld-sdk-skill-vX.Y.Z.zip` and attached to GitHub Releases automatically by the release workflow.

### Current Component List (71)

**Base Inputs:** BaseButton, BaseInput, BaseSelect, BaseTabs, BaseTextarea, BaseCheckbox, BaseRadioGroup, BaseToggle, BaseSlider, BaseModal, NumberInput, TagsInput, DatePicker, ColorSlider, FileUploader, SegmentedControl, MultiSelect

**Layout:** AppTopBar, AppSidebar, AppLayout, AppContainer, CollapsibleCard, FormField, Divider, Breadcrumb, ConfirmDialog, SettingsModal

**Feedback:** AlertBox, ToastNotification, LoadingSpinner, ProgressBar, StatusIndicator, EmptyState, BasePill

**Action:** IconButton, ThemeToggle, SettingsButton, DropdownButton

**Data Display:** Avatar, Tooltip, ChartContainer, DataFrame, Calendar, Skeleton, ScientificNumber, ChemicalFormula

**Scientific Input:** FormulaInput, SequenceInput, UnitInput

**Lab/Domain:** WellPlate, RackEditor, PlateMapEditor, SampleLegend, ExperimentTimeline, SampleSelector, GroupAssigner, GroupingModal, MoleculeInput, ConcentrationInput, DoseCalculator, ReagentList, SampleHierarchyTree, ProtocolStepEditor

**Workflow:** StepWizard, AuditTrail, BatchProgressList

**Scheduling:** TimePicker, DateTimePicker, TimeRangeInput, ScheduleCalendar, ResourceCard
