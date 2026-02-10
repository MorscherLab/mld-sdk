# Plugin Design Guidelines

Architecture patterns, UX conventions, and best practices for MLD plugins.

For API details, see [python-backend.md](python-backend.md). For component props, see [frontend-sdk.md](frontend-sdk.md). For starter code, see [quick-start-templates.md](quick-start-templates.md).

---

## Project Structure

### Backend-Only Plugin

```
mld-plugin-myanalysis/
├── pyproject.toml
├── src/mld_plugin_myanalysis/
│   ├── __init__.py
│   ├── plugin.py          # AnalysisPlugin subclass + standalone app factory
│   ├── routers/
│   │   ├── __init__.py
│   │   └── analysis.py    # FastAPI router(s)
│   └── schemas/
│       ├── __init__.py
│       └── requests.py    # Pydantic request/response models
└── tests/
    └── test_plugin.py
```

### Full-Stack Plugin

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
│   │   └── settings.py
│   └── schemas/
│       ├── __init__.py
│       └── requests.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.ts
│       ├── App.vue
│       ├── router/index.ts
│       └── views/
│           ├── DashboardView.vue
│           └── AnalysisView.vue
└── tests/
    └── test_plugin.py
```

**When to add the service layer:** Use `services/` when you have more than two routers or non-trivial business logic (calculations, multi-step workflows, external API calls). For simple CRUD plugins with one or two routers, put logic directly in route handlers.

---

## Choosing PluginType

| Type | Access | Real-World Examples |
|------|--------|---------------------|
| `ANALYSIS` | Read-only experiments, full artifact/plugin-data access | Mass spec peak analysis, data visualization dashboard, QC report generator |
| `EXPERIMENT_DESIGN` | Full CRUD on experiments and entities | Plate layout builder, experiment planner, sample registration wizard |

**Default to `ANALYSIS`.** Only use `EXPERIMENT_DESIGN` when the plugin must create, update, or delete experiments. Read-only access is sufficient for most analysis workflows — you can still write plugin-specific data via `PluginDataRepository`.

---

## Dual-Mode Design

Services should be mode-agnostic by default. Branch on mode only where the data source differs.

**Good — mode branch at the data boundary:**

```python
class AnalysisService:
    def __init__(self, context: PlatformContext | None):
        self._context = context

    async def run_analysis(self, experiment_id: int, params: dict) -> AnalysisResult:
        experiment = await self._get_experiment(experiment_id)
        # Analysis logic is identical in both modes
        return self._compute(experiment, params)

    async def _get_experiment(self, experiment_id: int) -> dict:
        if self._context is None:
            return self._load_mock_experiment(experiment_id)
        repo = self._context.get_experiment_repository()
        return await repo.get_by_id(experiment_id)
```

**Bad — duplicated logic per mode:**

```python
# DON'T: separate analysis paths per mode
async def run_analysis(self, experiment_id: int, params: dict):
    if self._context is None:
        experiment = self._load_mock_experiment(experiment_id)
        result = self._compute(experiment, params)  # duplicated
        return result
    else:
        repo = self._context.get_experiment_repository()
        experiment = await repo.get_by_id(experiment_id)
        result = self._compute(experiment, params)  # duplicated
        return result
```

**Guideline:** Push the standalone/integrated split as deep as possible — ideally only into data-fetching helpers. Keep computation, validation, and transformation logic shared.

---

## Database Decision Matrix

| Need | Solution | When to Use |
|------|----------|-------------|
| Plugin settings (key-value) | `standalone_db` key-value API | Settings, preferences, cached values |
| Plugin-specific tables | `get_plugin_db_session()` | Custom SQLModel tables (works in both modes) |
| Store per-experiment results | `PluginDataRepository` | Analysis results tied to experiments (integrated only) |
| No persistence | In-memory dict | Stateless analysis, transient cache |

**Decision flow:**

```
Need to persist data?
├── No  → In-memory dict or no storage
└── Yes
    ├── Key-value settings → standalone_db.set() / .get()
    ├── Structured tables → get_plugin_db_session() + SQLModel
    └── Per-experiment results → PluginDataRepository (integrated)
```

See [python-backend.md](python-backend.md) for database API details.

---

## Error Handling

**Use the SDK exception hierarchy.** Never raise bare `HTTPException` in service code — use SDK exceptions that carry structured context.

| Situation | Exception | Example |
|-----------|-----------|---------|
| Invalid user input | `ValidationException` | Bad experiment ID format, missing required field |
| Access denied | `PermissionException` | User lacks required plugin role |
| Resource not found | `NotFoundException` | Experiment ID does not exist |
| Resource conflict | `ConflictException` | Duplicate analysis name |
| Config error | `ConfigurationException` | Missing API key, bad database URL |
| Data layer error | `RepositoryException` | Database connection failed |
| Lifecycle error | `PluginLifecycleException` | Service failed to start |

```python
from mld_sdk.exceptions import ValidationException, NotFoundException

async def get_experiment(self, experiment_id: int) -> dict:
    if experiment_id <= 0:
        raise ValidationException(
            message="Experiment ID must be positive",
            field="experiment_id",
            value=experiment_id,
        )

    experiment = await self._repo.get_by_id(experiment_id)
    if experiment is None:
        raise NotFoundException(message=f"Experiment {experiment_id} not found")
    return experiment
```

**Reserve `HTTPException` for router-level concerns only** (e.g., the `get_service()` guard returning 503 when the service is not yet initialized). Services should raise SDK exceptions; let FastAPI's exception handlers translate them to HTTP responses.

---

## Auth and Roles

### When to Enable Auth

| Scenario | `requires_auth` | Notes |
|----------|-----------------|-------|
| Public data viewer | `False` | No login needed |
| User-specific analysis | `True` | Needs to identify user |
| Admin settings panel | `True` + plugin roles | Role-based access control |

### Plugin-Scoped Roles

Use `require_plugin_role()` for fine-grained access within your plugin:

```python
# Router-level guard
@router.get("/admin/settings")
async def admin_settings(user=context.require_plugin_role("admin")):
    return {"settings": ...}
```

### Standalone Auth Fallback

Always provide a mock user in standalone mode so routes work during development:

```python
def get_auth_dependency(self):
    if self._context:
        return self._context.get_current_user_dependency()

    async def standalone_user():
        return {"sub": "dev-user", "role": "admin", "username": "developer"}
    return standalone_user
```

---

## API Design

### Router Organization

One router per domain, tagged for OpenAPI grouping:

```python
# routers/analysis.py
router = APIRouter(tags=["analysis"])

# routers/settings.py
router = APIRouter(tags=["settings"])

# routers/health.py
router = APIRouter(tags=["health"])
```

Register in `get_routers()`:

```python
def get_routers(self) -> list[tuple[APIRouter, str]]:
    return [
        (analysis.router, self.metadata.routes_prefix),
        (settings.router, f"{self.metadata.routes_prefix}/settings"),
    ]
```

### Endpoint Naming

| Pattern | Example | Use |
|---------|---------|-----|
| Plural nouns | `GET /experiments` | List resources |
| Path param for ID | `GET /experiments/{id}` | Single resource |
| Query params for filtering | `GET /experiments?status=completed` | Filter/search |
| Verb for actions | `POST /experiments/{id}/analyze` | Trigger operations |

### Always Implement `check_health()`

Even a minimal health check makes debugging easier:

```python
async def check_health(self) -> PluginHealth:
    return PluginHealth(
        status=HealthStatus.HEALTHY,
        details={"mode": "integrated" if self._context else "standalone"},
    )
```

---

## Frontend Layout

### AppLayout as Root Shell

Every full-stack plugin should use `AppLayout` as the root component. Use the `floating` variant for a modern card-based layout with gaps:

```vue
<AppLayout floating>
  <template #topbar>...</template>
  <template #sidebar>
    <AppSidebar :panels="toolPanels" :active-view="currentPageId">
      <template #section-settings>...</template>
    </AppSidebar>
  </template>
  <AppContainer scrollable>
    <router-view />
  </AppContainer>
</AppLayout>
```

**Key rules:**
- `AppLayout` uses `height: 100vh; overflow: hidden` — the page never scrolls
- Only inner containers (`AppContainer` with `scrollable`) scroll
- The main slot is a flex column — compose panels with `AppContainer`
- Sidebar visibility is controlled by `AppSidebar` — it auto-hides when the active view has no matching panels

### Navigation Hierarchy

| Level | Component | Purpose | Example |
|-------|-----------|---------|---------|
| Major sections | `AppTopBar` pages dropdown | Top-level areas of the plugin | Dashboard, Analysis, Admin |
| Context tools | `AppSidebar` panels | Per-view tool sections (parameters, filters, display options) | Threshold slider, filter dropdowns |
| Peer views | `BaseTabs` | Switch between 2-5 views of the same data | Overview, Results, Raw Data |

**Guidelines:**
- Pages in `AppTopBar` represent distinct functional areas (different routes)
- Sidebar shows context-sensitive tool sections that change based on the active page
- Use tabs only when views share the same data scope (e.g., different views of one experiment)

### Component Selection Guide

| Use Case | Recommended Component |
|----------|-----------------------|
| Expandable content sections | `CollapsibleCard` |
| Form with labeled inputs | `FormField` + input components |
| Primary action button | `BaseButton variant="primary"` |
| Destructive action | `BaseButton variant="danger"` + `ConfirmDialog` |
| Status feedback | `AlertBox` (inline) or `useToast` (transient) |
| Loading state | `LoadingSpinner` (full area) or `BaseButton :loading` (inline) |
| Empty list/table | `EmptyState` |
| Data table | `DataFrame` |
| Settings panel | `SettingsModal` with custom tabs |
| Well plate work | `WellPlate` + `PlateMapEditor` + `SampleLegend` |
| Protocol workflow | `ExperimentTimeline` + `ProtocolStepEditor` |
| Chemical structures | `MoleculeInput` + `ChemicalFormula` |
| Dose planning | `ConcentrationInput` + `DoseCalculator` |
| Sample management | `SampleSelector` + `GroupAssigner` + `SampleHierarchyTree` |
| Multi-step wizard | `StepWizard` |
| Scheduling | `ScheduleCalendar` + `ResourceCard` + `DateTimePicker` |

### Content Organization

- Use `CollapsibleCard` to group related form fields or content sections
- One primary CTA per view — place it prominently with `variant="primary"`
- Use `AppContainer` for scrollable content panels within `AppLayout`
- For multi-panel layouts, nest `AppContainer` with `direction="row"` or `direction="column"`

```vue
<!-- Two-panel layout: fixed sidebar + scrollable content -->
<AppContainer direction="row">
  <AppContainer scrollable style="width: 280px; flex: none;">
    <!-- Fixed-width sidebar panel -->
  </AppContainer>
  <AppContainer scrollable>
    <!-- Main scrollable content -->
  </AppContainer>
</AppContainer>
```

### Theme and Settings

**Always include theme support:**
- Add `ThemeToggle` in the topbar actions, or use `AppTopBar` with `show-theme-toggle`
- For a settings panel, use `SettingsModal` with `show-appearance` to get theme, color palette, and table density controls for free

```vue
<!-- Option A: Manual ThemeToggle + SettingsButton in actions slot -->
<AppTopBar plugin-name="My Plugin" :title="currentPage">
  <template #actions>
    <ThemeToggle />
    <SettingsButton @click="showSettings = true" />
  </template>
</AppTopBar>

<!-- Option B: Built-in (cleaner, recommended for simple plugins) -->
<AppTopBar
  plugin-name="My Plugin"
  :title="currentPage"
  show-theme-toggle
  show-settings
  :settings-config="{ tabs: [{ id: 'general', label: 'General' }], showAppearance: true }"
>
  <template #settings-tab-general>
    <!-- Custom settings content -->
  </template>
</AppTopBar>
```

---

## CSS Rules

**CRITICAL: Never use Tailwind utility classes in plugin views that wrap SDK components.** SDK components use CSS variables. Consumers may not have Tailwind configured to scan your files.

### Naming Convention

BEM with `mld-` prefix for SDK-level code, plain BEM for plugin views:

```css
/* SDK components: mld- prefix */
.mld-sidebar__item--active { ... }

/* Plugin views: component-scoped, no prefix needed */
.analysis-view { ... }
.analysis-view__actions { ... }
.analysis-view__results { ... }
```

### Use CSS Variables

```css
.analysis-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 1rem);
}

.analysis-view__results {
  background-color: var(--bg-tertiary);
  padding: var(--spacing-md, 1rem);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}
```

### Element Reset with `!important`

When plugin views use semantic HTML elements (`<h3>`, `<p>`, `<table>`), consumers' frameworks may override margins. Use **longhand** `!important` properties:

```css
/* BAD: shorthand !important doesn't override longhand rules */
.my-title {
  margin: 0 !important;
}

/* GOOD: longhand !important overrides any source */
.my-title {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
```

### CSS Variable Reference

| Category | Variables |
|----------|-----------|
| Backgrounds | `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-hover`, `--bg-tertiary` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted` |
| Borders | `--border-color` |
| Brand colors | `--color-primary`, `--color-success`, `--color-error`, `--color-warning` |
| Spacing | `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg` |
| Shadows | `--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg` |
| Radius | `--radius-sm`, `--radius`, `--radius-md`, `--radius-lg` |

---

## Testing

### Test Both Modes

Every service should be tested in standalone and integrated mode:

```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from my_plugin.services.analysis_service import AnalysisService

@pytest.fixture
def standalone_service():
    return AnalysisService(context=None)

@pytest.fixture
def mock_context():
    ctx = MagicMock()
    repo = AsyncMock()
    repo.get_by_id = AsyncMock(return_value={"id": 1, "name": "Test"})
    ctx.get_experiment_repository.return_value = repo
    return ctx

@pytest.fixture
def integrated_service(mock_context):
    return AnalysisService(context=mock_context)

@pytest.mark.asyncio
async def test_standalone_returns_mock(standalone_service):
    result = await standalone_service.run_analysis(1, {})
    assert result["mode"] == "standalone"

@pytest.mark.asyncio
async def test_integrated_calls_repo(integrated_service, mock_context):
    result = await integrated_service.run_analysis(1, {})
    mock_context.get_experiment_repository().get_by_id.assert_called_once_with(1)
```

### Router Testing with FastAPI TestClient

```python
import pytest
from httpx import AsyncClient, ASGITransport
from my_plugin.plugin import create_standalone_app

@pytest.fixture
def app():
    return create_standalone_app()

@pytest.mark.asyncio
async def test_analysis_endpoint(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/my-analysis/run", json={
            "experiment_id": 1,
            "parameters": {},
        })
        assert response.status_code == 200
        assert response.json()["status"] == "complete"

@pytest.mark.asyncio
async def test_health_endpoint(app):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
```

### What to Test

| Layer | What to Assert |
|-------|---------------|
| Service | Business logic, mode branching, error cases |
| Router | HTTP status codes, response shapes, validation errors |
| Plugin lifecycle | `initialize()` sets up services, `shutdown()` cleans up |
| Frontend | Component rendering, user interactions (via Vitest + Vue Test Utils) |
