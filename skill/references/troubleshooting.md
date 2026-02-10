# Troubleshooting

Organized by symptom. Each entry: **Symptom** / **Cause** / **Fix** / **Prevention**.

---

## Build and Setup Issues

### Multiple Vue instances error

**Symptom:** Runtime error `Cannot read properties of undefined (reading '...')`, injection errors from Pinia/Vue Router, or components not reacting to state changes.

**Cause:** The plugin's `node_modules` contains a separate copy of Vue (or Pinia/Vue Router) from the one in `@morscherlab/mld-sdk`. Two Vue instances means reactive state is not shared.

**Fix:** Add deduplication to `vite.config.ts`:

```typescript
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'vue': resolve(__dirname, 'node_modules/vue'),
      'pinia': resolve(__dirname, 'node_modules/pinia'),
    },
    dedupe: ['vue', 'pinia', 'vue-router'],
  },
})
```

**Prevention:** Always include both `alias` and `dedupe` in every plugin's Vite config. Copy from [quick-start-templates.md](quick-start-templates.md) Vite config template.

---

### npm install fails for @morscherlab/mld-sdk

**Symptom:** `npm install` returns 401 or 404 when resolving `@morscherlab/mld-sdk`.

**Cause:** GitHub Packages requires authentication even for reading packages scoped to `@morscherlab`.

**Fix:**

1. Create a GitHub personal access token with `read:packages` scope.
2. Create or update `.npmrc` in the project root:

```
@morscherlab:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

3. Set the `GITHUB_TOKEN` environment variable or replace with the token value.

**Prevention:** Include `.npmrc` setup in your plugin's README. For CI, add `GITHUB_TOKEN` to your workflow secrets.

---

### TypeScript "Module not found" for SDK imports

**Symptom:** `Cannot find module '@morscherlab/mld-sdk/components'` or similar TypeScript error.

**Cause:** TypeScript cannot resolve the SDK's subpath exports. This happens when `moduleResolution` is set to `node` instead of `bundler`.

**Fix:** Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ESNext"
  }
}
```

**Prevention:** Use `"moduleResolution": "bundler"` in all Vite-based projects.

---

### Build fails: "Cannot find module 'vue'"

**Symptom:** `vue-tsc` or `vite build` fails with `Cannot find module 'vue'` even though Vue is installed.

**Cause:** Vue is listed in `devDependencies` instead of `dependencies`, or `node_modules` is corrupted.

**Fix:**

1. Ensure `vue` is in `dependencies` (not just `devDependencies`):

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "@morscherlab/mld-sdk": "^0.4.0"
  }
}
```

2. Clean and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Prevention:** Always list `vue`, `pinia`, and `vue-router` in `dependencies`.

---

### vue-tsc type errors after SDK update

**Symptom:** After updating `@morscherlab/mld-sdk`, `vue-tsc` reports type errors on previously working code.

**Cause:** Stale type declarations cached in `node_modules/.vite` or version mismatch between SDK and TypeScript peer dependencies.

**Fix:**

1. Clear Vite cache:

```bash
rm -rf node_modules/.vite
```

2. Ensure matching peer dependency versions:

```bash
npm ls vue typescript
```

3. Rebuild types:

```bash
npx vue-tsc --noEmit
```

**Prevention:** After SDK updates, always clear cache and run `vue-tsc` before committing.

---

## Runtime Backend Errors

### "Service not initialized" 503 error

**Symptom:** API calls return `503 Service Unavailable` with body `{"detail": "Service not initialized"}`.

**Cause:** A router handler was called before `initialize()` injected the service instance. Common triggers:
- Forgot to call `set_service()` in `initialize()`
- A health check or readiness probe hits the API before startup completes
- Service injection happens in `__init__` instead of `initialize()`

**Fix:** Ensure service injection happens inside `initialize()`:

```python
async def initialize(self, context: PlatformContext | None) -> None:
    self._context = context
    self._service = AnalysisService(context)

    # Inject into every router that needs it
    from .routers.analysis import set_service as set_analysis_service
    from .routers.settings import set_service as set_settings_service
    set_analysis_service(self._service)
    set_settings_service(self._service)
```

**Prevention:** Follow the service injection pattern from [python-backend.md](python-backend.md). Use the `get_service()` FastAPI dependency in every route handler — it raises 503 with a clear message if the service is missing.

---

### "Standalone database not initialized" RuntimeError

**Symptom:** `RuntimeError: Standalone database not initialized. Call _setup_standalone_db() first.`

**Cause:** `self.standalone_db` or `self.get_plugin_db_session()` was accessed before `_setup_standalone_db()` was called.

**Fix:** Call `_setup_standalone_db()` in `initialize()`:

```python
async def initialize(self, context: PlatformContext | None) -> None:
    self._context = context
    self._setup_standalone_db()  # Must come before any DB access
```

And call `_teardown_standalone_db()` in `shutdown()`:

```python
async def shutdown(self) -> None:
    self._teardown_standalone_db()
```

**Prevention:** Always pair `_setup_standalone_db()` in `initialize()` with `_teardown_standalone_db()` in `shutdown()`. The setup call is idempotent — safe to call in both standalone and integrated modes.

---

### Platform context methods fail in standalone

**Symptom:** `AttributeError: 'NoneType' object has no attribute 'get_experiment_repository'` or similar when calling `self._context.get_*()`.

**Cause:** `context` is `None` in standalone mode, but code accesses it without a guard.

**Fix:** Check before accessing:

```python
async def get_experiment(self, experiment_id: int) -> dict:
    if self._context is None:
        return self._load_mock_experiment(experiment_id)
    repo = self._context.get_experiment_repository()
    return await repo.get_by_id(experiment_id)
```

Or raise a clear error:

```python
from mld_sdk.exceptions import PermissionException

async def get_experiment(self, experiment_id: int) -> dict:
    if self._context is None:
        raise PermissionException("Experiment access requires platform integration")
    repo = self._context.get_experiment_repository()
    return await repo.get_by_id(experiment_id)
```

**Prevention:** Use a service-level `is_standalone` property and check it in every method that touches platform repositories. See the dual-mode pattern in [guideline.md](guideline.md).

---

### Entry point not discovered: plugin not loaded

**Symptom:** Plugin does not appear in the platform's plugin list. No error, just missing.

**Cause:** The entry point in `pyproject.toml` is misconfigured or the package is not installed.

**Fix:**

1. Verify entry point syntax:

```toml
[project.entry-points."mld.plugins"]
my_plugin = "mld_plugin_myanalysis.plugin:MyPlugin"
```

The key (`my_plugin`) must be unique. The value must be `module.path:ClassName`.

2. Verify the package is installed:

```bash
uv pip list | grep mld-plugin
```

3. Verify the entry point is registered:

```bash
python -c "from importlib.metadata import entry_points; print([e for e in entry_points(group='mld.plugins')])"
```

**Prevention:** Test entry point discovery with the Python snippet above before deploying.

---

### CORS errors during standalone development

**Symptom:** Browser console shows `Access-Control-Allow-Origin` errors when the frontend dev server (port 5173) calls the backend (port 8003).

**Cause:** The standalone app factory is missing CORS middleware, or the Vite proxy is not configured.

**Fix (option A — Vite proxy, recommended):** Configure the proxy in `vite.config.ts` so the browser never sees a cross-origin request:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8003',
      changeOrigin: true,
    },
  },
},
```

**Fix (option B — CORS middleware):** Add to the standalone app factory:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Prevention:** Always include both the Vite proxy and CORS middleware in new plugins. The proxy handles dev; CORS handles direct API testing.

---

### FastAPI router prefix duplication

**Symptom:** Routes are mounted at `/api/my-plugin/my-plugin/run` instead of `/api/my-plugin/run`.

**Cause:** `routes_prefix` is included in both `get_routers()` and when mounting in the standalone app factory.

**Fix:** Return the prefix from `get_routers()` and prepend `/api` only in the standalone factory:

```python
# Plugin class
def get_routers(self) -> list[tuple[APIRouter, str]]:
    return [(router, self.metadata.routes_prefix)]  # e.g., "/my-plugin"

# Standalone factory
for router, prefix in plugin.get_routers():
    app.include_router(router, prefix=f"/api{prefix}")  # → /api/my-plugin
```

Do **not** add the prefix again inside the router itself.

**Prevention:** Keep `APIRouter()` without a `prefix` argument. Let `get_routers()` provide the prefix, and let the host (standalone or platform) add the `/api` base.

---

## Runtime Frontend Errors

### Frontend not served in standalone mode

**Symptom:** Opening `http://localhost:8003` in the browser returns 404 or the FastAPI docs instead of the plugin frontend.

**Cause:** The frontend dist directory is not included in the Python wheel, or `get_frontend_dir()` returns the wrong path.

**Fix:**

1. Build the frontend first:

```bash
cd frontend && npm run build
```

2. Verify `get_frontend_dir()` returns the correct path:

```python
def get_frontend_dir(self) -> str | None:
    from pathlib import Path

    # Installed as package
    dist = Path(__file__).parent / "frontend"
    if dist.exists():
        return str(dist)

    # Development
    dev_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"
    if dev_dist.exists():
        return str(dev_dist)

    return None
```

3. Ensure `force-include` is correct in `pyproject.toml`:

```toml
[tool.hatch.build.targets.wheel.force-include]
"frontend/dist" = "mld_plugin_myanalysis/frontend"
```

4. Ensure the static file mount comes **last** in the standalone factory (after router mounts).

**Prevention:** Always build the frontend before testing standalone. Include `force-include` from the start.

---

### SDK styles not applied / components unstyled

**Symptom:** SDK components render but have no styling — no colors, no borders, raw HTML appearance.

**Cause:** SDK CSS was not imported in the application entry point.

**Fix:** Add the style import to `src/main.ts`:

```typescript
import '@morscherlab/mld-sdk/styles'
```

This must come before `app.mount('#app')`.

**Prevention:** Always import SDK styles in `main.ts`. Check [quick-start-templates.md](quick-start-templates.md) for the standard entry point.

---

### Dark mode not working

**Symptom:** `ThemeToggle` clicks but UI stays in light mode, or only some elements change.

**Cause:** The `html` element does not have the `dark` class applied, or custom CSS does not use CSS variables.

**Fix:**

1. Ensure `useTheme()` or `ThemeToggle` is initialized (included in your component tree).
2. Ensure your custom CSS uses CSS variables, not hardcoded colors:

```css
/* BAD: won't respond to dark mode */
.my-panel { background: white; color: #333; }

/* GOOD: responds to dark mode */
.my-panel { background: var(--bg-card); color: var(--text-primary); }
```

**Prevention:** Use CSS variables for all colors. `ThemeToggle` toggles the `dark` class on `<html>`, which switches all CSS variables.

---

### AppLayout content hidden (no scroll)

**Symptom:** Content placed in `AppLayout`'s default slot is cut off or invisible. No scrollbar appears.

**Cause:** `AppLayout` uses `overflow: hidden` on the main area. Content must be placed inside a scrollable container.

**Fix:** Wrap content in `AppContainer` with `scrollable`:

```vue
<AppLayout floating>
  <template #topbar>...</template>
  <template #sidebar>...</template>

  <!-- Content needs a scrollable container -->
  <AppContainer scrollable>
    <router-view />
  </AppContainer>
</AppLayout>
```

**Prevention:** Always wrap `AppLayout` default slot content in `<AppContainer scrollable>` unless you're composing a custom multi-panel layout with `direction`.

---

### Sidebar does not appear

**Symptom:** `AppSidebar` component is in the template but nothing renders in the sidebar area.

**Cause:** Common causes:
1. Sidebar content is not in the `#sidebar` slot of `AppLayout`
2. `activeView` does not match any key in `panels` (sidebar auto-hides)
3. `panels` object is empty or not populated

**Fix:**

1. Ensure sidebar is in the correct slot:

```vue
<AppLayout>
  <template #sidebar>
    <AppSidebar :panels="toolPanels" :active-view="currentPageId">
      <template #section-settings>...</template>
    </AppSidebar>
  </template>
</AppLayout>
```

2. Verify `panels` has an entry for the current `activeView` value:

```typescript
import type { SidebarToolSection } from '@morscherlab/mld-sdk/types'

// Sidebar only shows when activeView matches a key in panels
const toolPanels: Record<string, SidebarToolSection[]> = {
  analysis: [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ],
}
```

**Prevention:** Follow the layout pattern in [quick-start-templates.md](quick-start-templates.md). Use computed or ref for `navItems`.

---

### PostMessage communication fails

**Symptom:** `usePlatformContext().sendToPlatform()` calls are silently ignored. `isIntegrated` is always `false`.

**Cause:** The plugin is running in standalone mode (not embedded in an iframe by the MLD platform). PostMessage only works in integrated mode.

**Fix:** Check `isIntegrated` before calling platform-specific methods:

```typescript
const { isIntegrated, sendToPlatform, notify } = usePlatformContext()

function notifyComplete() {
  if (isIntegrated.value) {
    notify('Analysis complete!', 'success')
  } else {
    toast.success('Analysis complete!')
  }
}
```

**Prevention:** Always provide a standalone fallback for platform-specific features. See [integration.md](integration.md) for the full pattern.

---

## Deployment Issues

### Frontend not included in Python wheel

**Symptom:** Plugin works in development but after `pip install`, the frontend is missing. `get_frontend_dir()` returns `None`.

**Cause:** `force-include` in `pyproject.toml` is missing or the frontend was not built before packaging.

**Fix:**

1. Build the frontend:

```bash
cd frontend && npm run build
```

2. Add `force-include` to `pyproject.toml`:

```toml
[tool.hatch.build.targets.wheel.force-include]
"frontend/dist" = "mld_plugin_myanalysis/frontend"
```

3. Rebuild the wheel:

```bash
uv build
```

4. Verify the contents:

```bash
python -m zipfile -l dist/mld_plugin_myanalysis-*.whl | grep frontend
```

**Prevention:** Add a build step to your CI that builds the frontend before packaging. Always check the wheel contents before publishing.

---

### Plugin works standalone but fails integrated

**Symptom:** Plugin runs correctly with `uvicorn --factory` but throws errors when loaded by the MLD platform.

**Cause:** Common issues:
1. Hardcoded `localhost` URLs in frontend API calls
2. Missing `requires_auth` or `requires_shared_database` capabilities
3. Route prefix conflicts with other plugins
4. Frontend uses absolute paths instead of relative

**Fix:**

1. Use relative API paths or `useApi` (which auto-prefixes):

```typescript
// BAD
const response = await fetch('http://localhost:8003/api/my-plugin/run')

// GOOD
const api = useApi({ baseUrl: '/api/my-plugin' })
const response = await api.post('/run', data)
```

2. Declare all required capabilities:

```python
capabilities=PluginCapabilities(
    requires_auth=True,
    requires_shared_database=True,
)
```

3. Ensure `routes_prefix` is unique (check for conflicts with other installed plugins).

**Prevention:** Test with `useApi` composable from the start. Declare capabilities accurately. Never hardcode URLs.

---

### CSS conflicts with platform styles

**Symptom:** Plugin styles look different when embedded in the platform. Layout shifts, unexpected margins, or colors mismatch.

**Cause:** Platform CSS (VitePress, Tailwind preflight, normalize.css) overrides SDK or plugin styles, especially on semantic HTML elements.

**Fix:** Use `!important` longhand properties for element resets:

```css
/* Reset heading margins that platform CSS may override */
.my-component__title {
  margin-top: 0 !important;
  margin-bottom: 0.5rem !important;
}

/* Reset table styles from VitePress .vp-doc */
.my-component__table {
  border-collapse: collapse !important;
  border: none !important;
  margin: 0 !important;
}
.my-component__table tr {
  border: none !important;
  background: transparent !important;
}
.my-component__table th,
.my-component__table td {
  border: none !important;
  background: transparent !important;
}
```

**Prevention:** Always use CSS variables for colors and spacing. Use longhand `!important` resets on semantic HTML elements. Avoid using Tailwind utilities — they may not be available in the platform context.

---

## Performance Issues

### Slow plugin initialization

**Symptom:** Plugin takes several seconds to load. `initialize()` blocks the application startup.

**Cause:** Heavy imports at module level (e.g., NumPy, Pandas, ML models) execute on import, before the plugin is even needed.

**Fix:** Use lazy imports inside functions:

```python
# BAD: imported at module load time
import numpy as np
import pandas as pd

class AnalysisService:
    async def run_analysis(self, data):
        return np.mean(data)

# GOOD: imported when first needed
class AnalysisService:
    async def run_analysis(self, data):
        import numpy as np
        return np.mean(data)
```

For services that need the import at `__init__` time, defer to the first method call:

```python
class AnalysisService:
    def __init__(self, context):
        self._context = context
        self._np = None

    @property
    def np(self):
        if self._np is None:
            import numpy as np
            self._np = np
        return self._np
```

**Prevention:** Profile startup with `python -X importtime`. Move heavy imports into the functions that need them.

---

### Frontend freezes on large well plate data

**Symptom:** UI becomes unresponsive when loading 384-well plates with heatmap data or large datasets.

**Cause:** Vue's deep reactivity is tracking every property of every well object, causing excessive re-renders.

**Fix:** Use `shallowRef` for large data structures that change as a whole:

```typescript
import { shallowRef, triggerRef } from 'vue'

// Use shallowRef for large well data
const wellData = shallowRef<Record<string, Partial<Well>>>({})

// When updating, replace the entire object and trigger
function updateWells(newData: Record<string, Partial<Well>>) {
  wellData.value = { ...wellData.value, ...newData }
  triggerRef(wellData)
}
```

For heatmap data that updates frequently:

```typescript
const heatmapValues = shallowRef<Record<string, number>>({})

// Batch updates instead of per-well updates
function updateHeatmap(values: Record<string, number>) {
  heatmapValues.value = values  // Single reactive trigger
}
```

**Prevention:** Use `shallowRef` for any data structure with more than ~100 entries. Batch updates instead of mutating individual properties.
