# Integration Reference

Guide for standalone vs integrated plugin modes and platform communication.

## Operating Modes

| Mode | Context | Features | Use Case |
|------|---------|----------|----------|
| **Standalone** | `None` | No auth, no database, local settings | Development, testing |
| **Integrated** | `PlatformContext` | Full auth, repositories, config | Production in MLD platform |

---

## Detecting Mode

### Python Backend

```python
class MyPlugin(AnalysisPlugin):
    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context

    @property
    def is_standalone(self) -> bool:
        return self._context is None
```

### Service Layer

```python
class AnalysisService:
    def __init__(self, context: PlatformContext | None):
        self._context = context

    @property
    def is_standalone(self) -> bool:
        return self._context is None

    async def get_experiment(self, experiment_id: int):
        if self.is_standalone:
            # Return mock data for development
            return {"id": experiment_id, "name": "Mock Experiment"}

        repo = self._context.get_experiment_repository()
        return await repo.get_by_id(experiment_id)
```

### Vue Frontend

```typescript
import { usePlatformContext } from '@morscherlab/mld-sdk/composables'

const { isIntegrated, context, user } = usePlatformContext()

if (isIntegrated.value) {
  console.log('Running under MLD Platform')
  console.log('User:', user.value?.username)
} else {
  console.log('Running in standalone mode')
}
```

---

## Dual-Mode Patterns

### Settings Persistence (In-Memory Fallback)

```python
class AnalysisService:
    def __init__(self, context: PlatformContext | None):
        self._context = context
        self._local_settings: dict = {}

    async def get_settings(self) -> dict:
        if self.is_standalone:
            return self._local_settings
        config = self._context.get_config()
        return config.get("plugin_settings", {})

    async def save_settings(self, settings: dict) -> None:
        if self.is_standalone:
            self._local_settings = settings
        # In integrated mode, settings are managed by the platform
```

### Settings Persistence (Local Database)

For persistent storage that works in both modes, use the standalone database:

```python
from mld_sdk import AnalysisPlugin

class MyPlugin(AnalysisPlugin):
    async def initialize(self, context=None):
        self._context = context
        if self.is_standalone:
            self._setup_standalone_db()

    async def get_settings(self) -> dict:
        return self.standalone_db.get_all(namespace="settings")

    async def save_setting(self, key: str, value) -> None:
        self.standalone_db.set(key, value, namespace="settings")

    async def shutdown(self):
        self._teardown_standalone_db()
```

This eliminates the standalone vs integrated split for plugin-internal data -- settings persist across restarts in both modes.

For unified async database access that works in both modes (PostgreSQL in integrated, SQLite in standalone):

```python
# Unified async DB access (PostgreSQL or SQLite depending on mode)
async with self.get_plugin_db_session() as session:
    ...
```

### Authentication

```python
def get_auth_dependency(self):
    if self._context:
        return self._context.get_current_user_dependency()

    # Standalone: return mock user
    async def standalone_user():
        return {"sub": "dev-user", "role": "admin", "username": "developer"}
    return standalone_user
```

### Feature Availability

```python
async def analyze_experiment(self, experiment_id: int):
    if self.is_standalone:
        raise HTTPException(
            status_code=503,
            detail="Experiment analysis requires platform integration"
        )

    repo = self._context.get_experiment_repository()
    experiment = await repo.get_by_id(experiment_id)
    # ... perform analysis
```

---

## Standalone App Factory

Run plugins independently for development:

```python
# plugin.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

PLUGIN_NAME = "my-plugin"

def create_standalone_app() -> FastAPI:
    app = FastAPI(
        title=f"{PLUGIN_NAME} (Standalone)",
        description="Development server for standalone testing",
    )

    # CORS for frontend development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Restrict in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    plugin = MyPlugin()

    @app.on_event("startup")
    async def startup():
        await plugin.initialize(context=None)  # None = standalone

    @app.on_event("shutdown")
    async def shutdown():
        await plugin.shutdown()

    # Mount API routers
    for router, prefix in plugin.get_routers():
        app.include_router(router, prefix=f"/api{prefix}")

    # Health check
    @app.get("/health")
    async def health():
        result = await plugin.check_health()
        return result.to_dict()

    # Serve frontend if available
    frontend_dir = plugin.get_frontend_dir()
    if frontend_dir and Path(frontend_dir).exists():
        app.mount("/", StaticFiles(directory=frontend_dir, html=True))

    return app

# Run with: uvicorn plugin:create_standalone_app --factory --reload --port 8003
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "plugin:create_standalone_app",
        factory=True,
        reload=True,
        port=8003,
    )
```

---

## Frontend Integration

### Platform Context Detection

The `usePlatformContext` composable detects if running inside MLD platform:

```typescript
import { usePlatformContext } from '@morscherlab/mld-sdk/composables'

const { isIntegrated, plugin, user, theme, features, navigate, notify } = usePlatformContext()

// Check integration status
watchEffect(() => {
  if (isIntegrated.value) {
    console.log('Plugin info:', plugin.value)
    console.log('Current user:', user.value)
    console.log('Platform theme:', theme.value)
  }
})

// Navigate within platform (integrated only)
function goToExperiment(id: string) {
  if (isIntegrated.value) {
    navigate(`/experiments/${id}`)
  } else {
    router.push(`/experiments/${id}`)
  }
}

// Send notification to platform
function notifyComplete() {
  if (isIntegrated.value) {
    notify('Analysis complete!', 'success')
  } else {
    toast.success('Analysis complete!')
  }
}
```

### PostMessage Communication

The SDK handles PostMessage internally, but you can send custom events:

```typescript
const { sendToPlatform } = usePlatformContext()

// Send custom event to platform
sendToPlatform({
  type: 'plugin:custom-event',
  payload: { experimentId: '123', status: 'complete' },
})
```

### Theme Synchronization

In integrated mode, theme follows platform settings:

```typescript
const { theme } = usePlatformContext()

// theme.value is 'light' | 'dark' | 'system'
// SDK components automatically adapt
```

---

## API Configuration

### Vite Development Proxy

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8003',  // Plugin backend
        changeOrigin: true,
      },
    },
  },
})
```

### Dynamic API Base URL

```typescript
// Use environment variable for API prefix
const apiBaseUrl = import.meta.env.VITE_API_PREFIX || '/api/my-plugin'
const api = useApi({ baseUrl: apiBaseUrl })
```

### Environment Variables

```bash
# .env.development
VITE_API_PREFIX=/api/my-plugin

# .env.production (integrated)
VITE_API_PREFIX=  # Uses relative path
```

---

## Frontend Directory Setup

### Plugin Method

```python
def get_frontend_dir(self) -> str | None:
    """Return path to frontend dist for serving static files."""
    from pathlib import Path

    # When installed as package
    dist = Path(__file__).parent / "frontend"
    if dist.exists():
        return str(dist)

    # Development: check relative to project root
    dev_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"
    if dev_dist.exists():
        return str(dev_dist)

    return None
```

### pyproject.toml Configuration

```toml
# Include frontend build in wheel
[tool.hatch.build.targets.wheel.force-include]
"frontend/dist" = "mld_plugin_example/frontend"
```

### Frontend Config

```python
def get_frontend_config(self) -> dict:
    """Return frontend configuration for platform integration."""
    return {
        "name": self.metadata.name,
        "routePrefix": self.metadata.routes_prefix,
        "navItems": [
            {"path": "/", "label": "Home", "requiresAuth": False},
            {"path": "/analysis", "label": "Analysis", "requiresAuth": True},
            {"path": "/settings", "label": "Settings", "requiresAuth": True},
        ],
    }
```

---

## Health Checks

### Basic Health Check

```python
async def check_health(self) -> PluginHealth:
    return PluginHealth(
        status=HealthStatus.HEALTHY,
        details={
            "mode": "integrated" if self._context else "standalone",
            "version": self.metadata.version,
        }
    )
```

### Comprehensive Health Check

```python
async def check_health(self) -> PluginHealth:
    details = {
        "mode": "integrated" if self._context else "standalone",
        "version": self.metadata.version,
    }
    status = HealthStatus.HEALTHY

    if hasattr(self, '_service'):
        try:
            await asyncio.wait_for(
                self._service.verify_connection(),
                timeout=5.0
            )
            details["service"] = "ok"
        except Exception as e:
            status = HealthStatus.DEGRADED
            details["service"] = f"error: {e}"

    return PluginHealth(status=status, details=details)
```

---

## Error Handling

### Graceful Degradation

```python
async def get_data(self, experiment_id: int) -> dict:
    try:
        if self._context:
            repo = self._context.get_experiment_repository()
            return await repo.get_by_id(experiment_id)
    except Exception as e:
        logger.warning(f"Failed to fetch from platform: {e}")

    # Fall back to cached/mock data
    return self._get_cached_data(experiment_id)
```

### Mode-Specific Errors

```python
from mld_sdk.exceptions import PermissionException

async def platform_only_feature(self):
    if self.is_standalone:
        raise PermissionException(
            "This feature requires platform integration",
        )
    # ... implementation
```

---

## Testing Both Modes

### Standalone Testing

```bash
# Start plugin in standalone mode
cd my-plugin
uv run uvicorn plugin:create_standalone_app --factory --reload --port 8003

# Start frontend dev server
cd frontend
npm run dev
```

### Integrated Testing

```bash
# Start MLD platform with plugin installed
cd mld-platform
uv add --editable ../my-plugin
uv run python -m mld.server

# Plugin is now available at /api/my-plugin/*
```

### Unit Tests

```python
import pytest
from my_plugin.services import AnalysisService

@pytest.fixture
def standalone_service():
    return AnalysisService(context=None)

@pytest.fixture
def integrated_service(mock_context):
    return AnalysisService(context=mock_context)

async def test_standalone_mode(standalone_service):
    assert standalone_service.is_standalone is True
    # Test standalone behavior

async def test_integrated_mode(integrated_service):
    assert integrated_service.is_standalone is False
    # Test integrated behavior
```
