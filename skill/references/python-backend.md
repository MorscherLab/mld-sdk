# Python Backend Reference

Complete reference for the MLD Python SDK (`mld-sdk`).

## AnalysisPlugin Abstract Base Class

All plugins inherit from `AnalysisPlugin`:

```python
from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities
from mld_sdk.context import PlatformContext
from fastapi import APIRouter

class MyPlugin(AnalysisPlugin):
    @property
    def metadata(self) -> PluginMetadata:
        """Required: Plugin identification, type, and capabilities."""
        ...

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        """Required: FastAPI routers with their prefixes."""
        ...

    async def initialize(self, context: PlatformContext | None) -> None:
        """Required: Called on plugin load. context=None means standalone."""
        ...

    async def shutdown(self) -> None:
        """Required: Called on plugin unload. Clean up resources."""
        ...

    async def check_health(self) -> PluginHealth:
        """Optional: Health check. Returns PluginHealth."""
        return PluginHealth(status=HealthStatus.HEALTHY)

    def get_frontend_dir(self) -> str | None:
        """Optional: Path to frontend dist for serving static files."""
        return None

    def get_frontend_config(self) -> dict:
        """Optional: Frontend configuration (nav items, routes)."""
        return {}

    def get_shared_models(self) -> list[type]:
        """Optional: SQLModel classes for plugin tables (shared DB)."""
        return []
```

---

## PluginMetadata

```python
from mld_sdk import PluginMetadata, PluginCapabilities, PluginType

PluginMetadata(
    name="my-plugin",              # Unique identifier (kebab-case)
    version="1.0.0",               # Semantic version string
    description="Description",     # User-facing description
    analysis_type="mass-spec",     # Category for grouping plugins
    routes_prefix="/my-plugin",    # API route prefix (/api/my-plugin/*)
    plugin_type=PluginType.ANALYSIS,      # Plugin type (default: ANALYSIS)
    capabilities=PluginCapabilities(       # Capabilities declaration
        requires_auth=True,
        requires_shared_database=True,
    ),
    author="Your Name",            # Plugin author (optional)
    homepage="https://...",        # Project homepage (optional)
    license="MIT",                 # License identifier (optional)
)
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | str | Yes | Unique plugin identifier |
| `version` | str | Yes | Semantic version |
| `description` | str | Yes | User-facing description |
| `analysis_type` | str | Yes | Plugin category |
| `routes_prefix` | str | Yes | API route prefix |
| `plugin_type` | PluginType | No | Plugin type (default: ANALYSIS) |
| `capabilities` | PluginCapabilities | No | What platform features are needed |
| `author` | str | No | Plugin author |
| `homepage` | str | No | Project homepage URL |
| `license` | str | No | License identifier |

---

## PluginCapabilities

```python
from mld_sdk import PluginCapabilities, PluginType

PluginCapabilities(
    requires_auth=True,                    # Needs user authentication
    requires_database=True,                # Needs platform database
    requires_experiments=True,             # Needs experiment access
    requires_shared_database=True,         # Needs shared DB schema (PostgreSQL/SQLite)
    supports_experiment_linking=True,      # Can link to experiments
)
```

### PluginType

| Type | Database Access | Use Case |
|------|-----------------|----------|
| `ANALYSIS` | Read-only experiments, full artifact access | Data analysis, reporting |
| `EXPERIMENT_DESIGN` | Full CRUD on all entities | Experiment creation, plate design |

---

## Service Pattern

**Recommended architecture:** Services encapsulate business logic, injected into routers.

### Service Class

```python
# services/analysis_service.py
from mld_sdk.context import PlatformContext

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

    async def run_analysis(self, experiment_id: int) -> dict:
        if self.is_standalone:
            return {"mode": "standalone", "experiment_id": experiment_id}

        experiment = await self._experiment_repo.get_by_id(experiment_id)
        return {"status": "completed", "experiment": experiment}

    async def cleanup(self) -> None:
        pass
```

### Router with Service Injection

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

@router.post("/run/{experiment_id}")
async def run_analysis(
    experiment_id: int,
    service: AnalysisService = Depends(get_service),
):
    return await service.run_analysis(experiment_id)
```

### Plugin Integration

```python
# plugin.py
async def initialize(self, context: PlatformContext | None) -> None:
    self._context = context
    self._service = AnalysisService(context)

    # Inject into routers
    from .routers.analysis import set_service
    set_service(self._service)

async def shutdown(self) -> None:
    if hasattr(self, '_service'):
        await self._service.cleanup()
```

---

## Repository Reference

Available via `PlatformContext`. Returns `None` in standalone mode.

### ExperimentRepository

```python
repo = context.get_experiment_repository()

# List experiments
experiments, total = await repo.list_all(
    skip=0, limit=100,
    status="completed",             # planned|ready_to_extract|extracting|completed|failed
    experiment_type="drp",          # drp|gene_edit|method_dev|custom
    project="Project Name",
    created_by=1,                   # User ID
    parent_experiment_id=42,        # Parent experiment ID
    search="keyword",               # Search term
)

# Get single experiment
experiment = await repo.get_by_id(experiment_id)

# Create (EXPERIMENT_DESIGN only)
experiment = await repo.create(
    name="Experiment Name",
    experiment_type="drp",  # drp|gene_edit|method_dev|custom
    created_by=user_id,
    parent_experiment_id=parent_id,
    project="Project Name",
    notes="Notes",
    tags={"key": "value"},
)

# Update (EXPERIMENT_DESIGN only)
await repo.update(experiment_id, status="extracting", notes="Started")

# Delete (EXPERIMENT_DESIGN only)
await repo.delete(experiment_id)

# Check if experiment has plugin data
has_data = await repo.has_plugin_data(experiment_id)
```

### PluginDataRepository

Store plugin-specific experiment data and analysis results. Available to all plugin types.

```python
repo = context.get_plugin_data_repository()

# Save experiment data (one per experiment per plugin)
data = await repo.save_experiment_data(
    experiment_id=exp_id,
    plugin_id="my-plugin",
    data={"key": "value"},
    schema_version="1.0",
)

# Get experiment data
data = await repo.get_experiment_data(experiment_id)

# Save analysis result
result = await repo.save_analysis_result(
    experiment_id=exp_id,
    plugin_id="my-plugin",
    result={"peaks": [...]},
)

# Get analysis results
result = await repo.get_analysis_result(experiment_id, "my-plugin")
results = await repo.get_analysis_results(experiment_id)
```

### PluginRoleRepository

Plugin-scoped user roles, independent of platform-level roles.

```python
repo = context.get_plugin_role_repository()

# Get user's role in this plugin
role = await repo.get_role("my-plugin", user_id)  # Returns str | None

# Set user's role
await repo.set_role("my-plugin", user_id, "admin")

# Remove role
await repo.remove_role("my-plugin", user_id)

# List all roles for this plugin
roles = await repo.list_plugin_roles("my-plugin")

# List all plugin roles for a user
user_roles = await repo.list_user_roles(user_id)
```

### Role-Based Access Control

```python
# FastAPI dependency for role-based access control
@router.get("/admin/settings")
async def settings(user=context.require_plugin_role("admin")):
    # Only users with "admin" role in this plugin can access
    # Platform admins automatically bypass plugin role checks
    return {"settings": ...}
```

### UserRepository

```python
repo = context.get_user_repository()

user = await repo.get_by_id(user_id)
user = await repo.get_by_username(username)
users = await repo.list_all(skip=0, limit=100)
```

---

## Local Database

Per-plugin local SQLite storage using SQLModel. Works in both standalone and integrated modes.

**Install:** `pip install mld-sdk[local-db]`

### High-Level Key-Value API

```python
class MyPlugin(AnalysisPlugin):
    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context
        if self.is_standalone:
            self._setup_standalone_db()

        # Store/retrieve JSON-serializable values
        self.standalone_db.set("threshold", 0.05, namespace="settings")
        self.standalone_db.set("columns", ["name", "rt", "intensity"])

        val = self.standalone_db.get("threshold", namespace="settings")  # 0.05
        all_settings = self.standalone_db.get_all(namespace="settings")  # dict
        keys = self.standalone_db.list_keys()  # list[str]

        self.standalone_db.delete("columns")
        self.standalone_db.clear(namespace="settings")

    async def shutdown(self) -> None:
        self._teardown_standalone_db()
```

### Custom SQLModel Tables

```python
from sqlmodel import SQLModel, Field, select

class InstrumentReading(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    experiment_id: int = Field(index=True)
    intensity: float
    channel: str

class MyPlugin(AnalysisPlugin):
    def get_shared_models(self):
        return [InstrumentReading]

    async def initialize(self, context=None):
        self._context = context
        if self.is_standalone:
            self._setup_standalone_db()

    async def save_data(self, experiment_id: int, data: dict):
        async with self.get_plugin_db_session() as session:
            # Works with both PostgreSQL (integrated) and SQLite (standalone)
            ...

    async def store_reading(self, exp_id, intensity, channel):
        with self.standalone_db.get_session() as session:
            session.add(InstrumentReading(
                experiment_id=exp_id, intensity=intensity, channel=channel
            ))
            session.commit()

    async def query_readings(self, exp_id):
        with self.standalone_db.get_session() as session:
            return session.exec(
                select(InstrumentReading).where(
                    InstrumentReading.experiment_id == exp_id
                )
            ).all()
```

### Unified Database Access

```python
class MyPlugin(AnalysisPlugin):
    async def initialize(self, context: PlatformContext | None) -> None:
        self._context = context
        if self.is_standalone:
            self._setup_standalone_db()

    async def save_data(self, experiment_id: int, data: dict):
        async with self.get_plugin_db_session() as session:
            # Works with both PostgreSQL (integrated) and SQLite (standalone)
            ...

    async def shutdown(self) -> None:
        self._teardown_standalone_db()
```

### Custom Path

```python
from mld_sdk import LocalDatabaseConfig

class MyPlugin(AnalysisPlugin):
    def get_local_database_config(self):
        return LocalDatabaseConfig(
            storage_dir=Path("/data/my-plugin"),
            db_filename="analysis.db",
        )
```

Default: `~/.mld/plugins/{plugin-name}/data.db`

---

## Plugin Configuration

Access platform configuration:

```python
# Get platform config (returns dict)
config = context.get_config()
value = config.get("key", default)
```

**Dual-mode pattern for plugin settings:**

```python
async def get_settings(self) -> dict:
    if self.is_standalone:
        return self._in_memory_settings
    # Use plugin data repository or local database for persistence
    data = await self._plugin_data_repo.get_experiment_data(experiment_id)
    return data.data if data else {}

async def save_settings(self, settings: dict) -> None:
    if self.is_standalone:
        self._in_memory_settings = settings
    else:
        await self._plugin_data_repo.save_experiment_data(
            experiment_id=0, plugin_id=self.metadata.name,
            data=settings, schema_version="1.0",
        )
```

---

## Authentication

### Get Current User Dependency

```python
def get_auth_dependency(self):
    if self._context:
        return self._context.get_current_user_dependency()

    # Standalone fallback
    async def standalone_user():
        return {"sub": "dev-user", "role": "admin"}
    return standalone_user

# Usage in router
@router.get("/protected")
async def protected(user: dict = Depends(plugin.get_auth_dependency())):
    return {"user_id": user["sub"], "role": user.get("role")}
```

---

## Exception Hierarchy

```python
from mld_sdk.exceptions import (
    PluginException,          # Base for all plugin errors
    ValidationException,      # Invalid input data
    PermissionException,      # Access denied
    ConfigurationException,   # Plugin configuration issues
    RepositoryException,      # Database/storage errors
    NotFoundException,        # Resource not found (subclass of RepositoryException)
    ConflictException,        # Resource conflict (subclass of RepositoryException)
    PluginLifecycleException, # Plugin startup/shutdown errors
)

raise ValidationException(
    message="Analysis failed",
    field="experiment_id",
    value=exp_id,
)
```

---

## Health Check

```python
from mld_sdk.plugin import PluginHealth, HealthStatus

async def check_health(self) -> PluginHealth:
    health = PluginHealth(
        status=HealthStatus.HEALTHY,
        details={
            "mode": "integrated" if self._context else "standalone",
            "version": self.metadata.version,
        },
    )

    # Check service health
    if hasattr(self, '_service'):
        try:
            await self._service.verify_connection()
        except Exception as e:
            health.status = HealthStatus.DEGRADED
            health.message = str(e)

    return health
```

---

## Standalone App Factory

For running plugins independently during development:

```python
def create_standalone_app():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles

    app = FastAPI(title=f"{PLUGIN_NAME} (Standalone)")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    plugin = MyPlugin()

    @app.on_event("startup")
    async def startup():
        await plugin.initialize(context=None)

    @app.on_event("shutdown")
    async def shutdown():
        await plugin.shutdown()

    # Mount routers
    for router, prefix in plugin.get_routers():
        app.include_router(router, prefix=f"/api{prefix}")

    # Health check
    @app.get("/health")
    async def health():
        result = await plugin.check_health()
        return result.to_dict()

    # Serve frontend if available
    frontend_dir = plugin.get_frontend_dir()
    if frontend_dir:
        app.mount("/", StaticFiles(directory=frontend_dir, html=True))

    return app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("plugin:create_standalone_app", factory=True, reload=True, port=8003)
```

---

## Data Models

### Enums

```python
# ExperimentStatus
"planned" | "ready_to_extract" | "extracting" | "completed" | "failed"

# ExperimentType
"drp" | "gene_edit" | "method_dev" | "custom"
```

### Entity Fields

**Experiment:** id (int), name, experiment_type, status, created_at, updated_at, created_by (int|None), parent_experiment_id (int|None), project, notes, tags, custom_metadata

**PluginExperimentData:** id (int), experiment_id (int), plugin_id (str), data (dict), schema_version (str), created_at, updated_at

**PluginAnalysisResult:** id (int), experiment_id (int), plugin_id (str), result (dict), created_at, updated_at

**User:** id (int), username, role, is_active, created_at, updated_at, email, shortname, first_name, last_name

**UserPluginRole:** id (int), user_id (int), plugin_id (str), role (str), created_at, updated_at
