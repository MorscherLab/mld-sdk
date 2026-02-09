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
        """Required: Plugin identification and configuration."""
        ...

    @property
    def capabilities(self) -> PluginCapabilities:
        """Required: What platform features the plugin needs."""
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

    async def check_health(self) -> dict:
        """Optional: Health check endpoint data."""
        return {"status": "healthy"}

    def get_frontend_dir(self) -> str | None:
        """Optional: Path to frontend dist for serving static files."""
        return None

    def get_frontend_config(self) -> dict:
        """Optional: Frontend configuration (nav items, routes)."""
        return {}
```

---

## PluginMetadata

```python
from mld_sdk import PluginMetadata

PluginMetadata(
    name="my-plugin",              # Unique identifier (kebab-case)
    version="1.0.0",               # Semantic version string
    description="Description",     # User-facing description
    analysis_type="mass-spec",     # Category for grouping plugins
    routes_prefix="/my-plugin",    # API route prefix (/api/my-plugin/*)
    frontend_route="/my-plugin",   # Frontend URL path (optional)
    author="Your Name",            # Plugin author (optional)
    documentation_url="https://",  # External docs link (optional)
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
| `frontend_route` | str | No | Frontend URL path |
| `author` | str | No | Plugin author |
| `documentation_url` | str | No | Link to docs |

---

## PluginCapabilities

```python
from mld_sdk import PluginCapabilities, PluginType

PluginCapabilities(
    plugin_type=PluginType.ANALYSIS,      # Database access level
    requires_auth=True,                    # Needs user authentication
    requires_database=True,                # Needs platform database
    requires_experiments=True,             # Needs experiment access
    requires_compound_lists=True,          # Needs compound list access
    requires_samples=True,                 # Needs sample access
    supports_experiment_linking=True,      # Can link to experiments
    supports_sample_mapping=True,          # Can map sample data
    supported_file_types=[".csv", ".xlsx"],# Files this plugin handles
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
from mld_sdk.repositories import ExperimentRepository, AnalysisArtifactRepository

class AnalysisService:
    def __init__(self, context: PlatformContext | None):
        self._context = context
        self._settings: dict = {}

        # Initialize repositories if in integrated mode
        if context is not None:
            self._experiment_repo = context.get_experiment_repository()
            self._artifact_repo = context.get_analysis_artifact_repository()

    @property
    def is_standalone(self) -> bool:
        return self._context is None

    async def run_analysis(self, experiment_id: str) -> dict:
        if self.is_standalone:
            return {"mode": "standalone", "experiment_id": experiment_id}

        experiment = await self._experiment_repo.get_by_id(experiment_id)
        # ... perform analysis
        return {"status": "completed", "experiment": experiment}

    async def cleanup(self) -> None:
        """Clean up resources on shutdown."""
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
    experiment_id: str,
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
    status="completed",  # planned|ready_to_extract|extracting|completed|failed
    project="Project Name",
)

# Get single experiment
experiment = await repo.get_by_id(experiment_id)

# Create (EXPERIMENT_DESIGN only)
experiment = await repo.create(
    name="Experiment Name",
    experiment_type="drp",  # drp|gene_edit|method_dev|custom
    created_by=user_id,
    compound_list_id=list_id,
    cell_line="HeLa",
    project="Project Name",
    tags={"key": "value"},
)

# Update (EXPERIMENT_DESIGN only)
await repo.update(experiment_id, status="extracting", notes="Started")

# Delete (EXPERIMENT_DESIGN only)
await repo.delete(experiment_id)
```

### Plate Operations

```python
# Get plates for experiment
plates = await repo.get_plates_for_experiment(experiment_id)

# Get single plate
plate = await repo.get_plate_by_id(plate_id)

# Create plate (EXPERIMENT_DESIGN only)
plate = await repo.create_plate(experiment_id, name="Plate-001", layout_type="96-well")

# Get samples for plate
samples = await repo.get_samples_for_plate(plate_id)
```

### AnalysisArtifactRepository

Store JSON data linked to experiments. Available to all plugin types.

```python
artifact_repo = context.get_analysis_artifact_repository()

# Create artifact
artifact = await artifact_repo.create(
    plugin_name="MyPlugin",
    artifact_type="peak_data",  # Custom type string
    data={"peaks": [...], "metadata": {...}},
    experiment_id=exp_id,  # Optional
    created_by=user_id,    # Optional
)

# List by experiment
artifacts = await artifact_repo.list_for_experiment(
    experiment_id,
    plugin_name="MyPlugin",    # Optional filter
    artifact_type="peak_data"  # Optional filter
)

# List by plugin
artifacts = await artifact_repo.list_for_plugin(
    "MyPlugin",
    artifact_type="peak_data",
    limit=100
)

# Update
await artifact_repo.update(artifact_id, data={"updated": True})

# Delete
await artifact_repo.delete(artifact_id)
```

### CompoundListRepository

```python
repo = context.get_compound_list_repository()

# List compound lists
lists = await repo.list_all(owner_id=user_id, include_master=True)

# Get compounds for list
compounds = await repo.get_compounds_for_list(compound_list_id)

# Create compound list
compound_list = await repo.create(name="My List", owner_id=user_id, is_master=False)

# Create compounds
compounds = await repo.create_compounds_batch(compound_list_id, [
    {"name": "Glucose", "formula": "C6H12O6", "adduct": "[M+H]+", "expected_rt": 2.5},
    {"name": "Lactate", "formula": "C3H6O3", "adduct": "[M-H]-", "expected_rt": 1.8},
])
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
        self._setup_local_database()

        # Store/retrieve JSON-serializable values
        self.local_db.set("threshold", 0.05, namespace="settings")
        self.local_db.set("columns", ["name", "rt", "intensity"])

        val = self.local_db.get("threshold", namespace="settings")  # 0.05
        all_settings = self.local_db.get_all(namespace="settings")  # dict
        keys = self.local_db.list_keys()  # list[str]

        self.local_db.delete("columns")
        self.local_db.clear(namespace="settings")

    async def shutdown(self) -> None:
        self._teardown_local_database()
```

### Custom SQLModel Tables

```python
from sqlmodel import SQLModel, Field, select

class InstrumentReading(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    experiment_id: str = Field(index=True)
    intensity: float
    channel: str

class MyPlugin(AnalysisPlugin):
    def get_local_models(self):
        return [InstrumentReading]

    async def initialize(self, context=None):
        self._context = context
        self._setup_local_database()

    async def store_reading(self, exp_id, intensity, channel):
        with self.local_db.get_session() as session:
            session.add(InstrumentReading(
                experiment_id=exp_id, intensity=intensity, channel=channel
            ))
            session.commit()

    async def query_readings(self, exp_id):
        with self.local_db.get_session() as session:
            return session.exec(
                select(InstrumentReading).where(
                    InstrumentReading.experiment_id == exp_id
                )
            ).all()
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

Persist plugin-specific settings:

```python
# Get config (returns dict or None)
config = await context.get_plugin_config()
value = config.get("key", default) if config else default

# Set config
await context.set_plugin_config({"key": "value", "nested": {"a": 1}})
```

**Dual-mode pattern:**

```python
async def get_settings(self) -> dict:
    if self.is_standalone:
        return self._in_memory_settings
    return await self._context.get_plugin_config() or {}

async def save_settings(self, settings: dict) -> None:
    if self.is_standalone:
        self._in_memory_settings = settings
    else:
        await self._context.set_plugin_config(settings)
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
    PluginError,          # Base for all plugin errors
    PluginConfigError,    # Configuration issues
    PluginInitError,      # Initialization failures
    PluginRuntimeError,   # Runtime errors
    PermissionError,      # Access denied (e.g., ANALYSIS trying to write)
)

# Raise with serialization support
raise PluginRuntimeError(
    message="Analysis failed",
    details={"experiment_id": exp_id, "reason": "Missing data"},
)
```

---

## Health Check

```python
async def check_health(self) -> dict:
    health = {
        "status": "healthy",
        "mode": "integrated" if self._context else "standalone",
        "version": self.metadata.version,
    }

    # Check service health
    if hasattr(self, '_service'):
        try:
            await self._service.verify_connection()
        except Exception as e:
            health["status"] = "degraded"
            health["error"] = str(e)

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

# SampleType
"sample" | "qc" | "blank"

# PlateLayoutType
"96-well" | "54-vial"
```

### Entity Fields

**Experiment:** id, name, status, experiment_type, method_id, compound_list_id, cell_line, project, notes, tags, created_at, created_by

**Plate:** id, experiment_id, name, layout_type, sequence_file_path, created_at

**Sample:** id, plate_id, well_position, sample_name, sample_type, replicate_number, timepoint, tags

**CompoundList:** id, name, owner_id, is_master, method_id, description, created_at

**Compound:** id, compound_list_id, name, formula, adduct, expected_rt, rt_source, mass

**User:** id, username, shortname, email, role, is_active, created_at

**AnalysisArtifact:** id, plugin_name, experiment_id, artifact_type, data (JSON), created_at, created_by
