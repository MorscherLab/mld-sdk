# Python SDK API Reference

Complete API reference for the MLD Python SDK.

## Core Classes

### AnalysisPlugin

Abstract base class that all plugins must inherit from.

```python
from mld_sdk import AnalysisPlugin
```

**Lifecycle:**
1. Plugin discovered via entry point
2. Plugin instantiated (constructor called)
3. `initialize(context)` called
4. Plugin serves requests
5. `shutdown()` called on platform stop

#### Abstract Methods

| Method | Description |
|--------|-------------|
| `metadata` | Property returning `PluginMetadata` |
| `get_routers()` | Returns list of `(APIRouter, prefix)` tuples |
| `initialize(context)` | Called once when plugin is loaded |
| `shutdown()` | Called when platform is shutting down |

#### Optional Methods

| Method | Description |
|--------|-------------|
| `check_health()` | Returns `PluginHealth` for monitoring |
| `on_before_experiment_save(experiment_id, data)` | Hook before experiment save |
| `on_after_experiment_save(experiment_id, data)` | Hook after experiment save |
| `on_experiment_status_change(experiment_id, old_status, new_status)` | Status change hook |
| `get_frontend_config()` | Returns frontend configuration dict |
| `get_frontend_dir()` | Returns path to built frontend directory |
| `get_compatible_platform_versions()` | Returns `(min_version, max_version)` tuple |
| `get_local_models()` | Returns list of SQLModel classes for custom local tables |
| `get_local_database_config()` | Returns `LocalDatabaseConfig` or `None` for defaults |

#### Local Database Helpers

| Method | Description |
|--------|-------------|
| `_setup_local_database()` | Initialize local database. Call from `initialize()` |
| `_teardown_local_database()` | Close local database. Call from `shutdown()` |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `context` | `PlatformContext \| None` | Platform context (None if standalone) |
| `is_standalone` | `bool` | True if running without platform |
| `local_db` | `LocalDatabase \| None` | Local database instance (None if not set up) |

#### Example

```python
from mld_sdk import AnalysisPlugin, PluginMetadata, PlatformContext
from fastapi import APIRouter

router = APIRouter()

@router.get("/hello")
async def hello():
    return {"message": "Hello!"}

class MyPlugin(AnalysisPlugin):
    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="My Plugin",
            version="1.0.0",
            description="Example plugin",
            analysis_type="metabolomics",
            routes_prefix="/my-plugin",
        )

    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [(router, "")]

    async def initialize(self, context: PlatformContext | None = None) -> None:
        self._context = context
        if context:
            self.experiments = context.get_experiment_repository()

    async def shutdown(self) -> None:
        pass
```

---

### PluginMetadata

Metadata describing a plugin.

```python
from mld_sdk import PluginMetadata
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `str` | Yes | Display name |
| `version` | `str` | Yes | Semantic version |
| `description` | `str` | Yes | Short description |
| `analysis_type` | `str` | Yes | Type: "metabolomics", "proteomics", etc. |
| `routes_prefix` | `str` | Yes | URL prefix for routes (e.g., "/my-plugin") |
| `plugin_type` | `PluginType` | No | Default: `ANALYSIS` |
| `capabilities` | `PluginCapabilities` | No | Required platform features |
| `author` | `str` | No | Plugin author |
| `homepage` | `str` | No | Plugin homepage URL |
| `license` | `str` | No | License identifier |

---

### PluginCapabilities

Declares what platform features a plugin needs.

```python
from mld_sdk import PluginCapabilities
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `requires_auth` | `bool` | `False` | Requires authentication |
| `requires_database` | `bool` | `False` | Requires database access |
| `requires_experiments` | `bool` | `False` | Requires experiment repository |
| `requires_local_database` | `bool` | `False` | Requires local SQLite database |
| `requires_compound_lists` | `bool` | `False` | Requires compound list access |
| `supports_experiment_linking` | `bool` | `False` | Supports experiment linking |

---

### PluginType

Plugin category determining database access permissions.

```python
from mld_sdk import PluginType
```

| Value | Description |
|-------|-------------|
| `ANALYSIS` | Read-only experiment access |
| `EXPERIMENT_DESIGN` | Full CRUD access to experiments |

---

### PlatformContext

Context provided by the platform to plugins.

```python
from mld_sdk import PlatformContext
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_authenticated` | `bool` | Current request is authenticated |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `get_current_user_dependency()` | `Callable` | FastAPI dependency for required auth |
| `get_optional_user_dependency()` | `Callable` | FastAPI dependency for optional auth |
| `get_experiment_repository()` | `ExperimentRepository \| None` | Experiment data access |
| `get_plugin_data_repository()` | `PluginDataRepository \| None` | Plugin-specific data storage |
| `get_user_repository()` | `UserRepository \| None` | User data access |
| `get_compound_list_repository()` | `CompoundListRepository \| None` | Compound list access |
| `get_metadata_template_repository()` | `MetadataTemplateRepository \| None` | Metadata templates |
| `get_tracing_preset_repository()` | `TracingPresetRepository \| None` | Tracing presets |
| `get_analysis_artifact_repository()` | `AnalysisArtifactRepository \| None` | Analysis artifacts |
| `get_config()` | `PlatformConfig` | Platform configuration dict |

#### Example

```python
async def initialize(self, context: PlatformContext | None = None) -> None:
    self._context = context
    if context:
        # Get repositories
        self.experiments = context.get_experiment_repository()
        self.plugin_data = context.get_plugin_data_repository()

        # Use auth dependencies in routes
        @router.get("/protected")
        async def protected_route(
            user: dict = Depends(context.get_current_user_dependency())
        ):
            return {"user": user["username"]}
```

---

### HealthStatus

Plugin health status values.

```python
from mld_sdk import HealthStatus
```

| Value | Description |
|-------|-------------|
| `HEALTHY` | Plugin is fully operational |
| `DEGRADED` | Plugin is operational with reduced functionality |
| `UNHEALTHY` | Plugin is not operational |
| `UNKNOWN` | Health status cannot be determined |

---

### PluginHealth

Plugin health status report.

```python
from mld_sdk import PluginHealth, HealthStatus
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `HealthStatus` | `HEALTHY` | Current status |
| `message` | `str \| None` | `None` | Human-readable message |
| `details` | `dict[str, Any]` | `{}` | Additional context |
| `checked_at` | `datetime` | Now | Timestamp |

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `to_dict()` | `dict[str, Any]` | Convert to dict for API responses |

---

### LifecycleHookResult

Result from a lifecycle hook.

```python
from mld_sdk import LifecycleHookResult
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `success` | `bool` | `True` | Hook succeeded |
| `message` | `str \| None` | `None` | Result message |
| `data` | `dict[str, Any]` | `{}` | Additional data |

---

## Local Database

Per-plugin local SQLite storage using SQLModel. Requires optional dependency: `pip install mld-sdk[local-db]`

### LocalDatabaseConfig

Configuration for a plugin's local database.

```python
from mld_sdk import LocalDatabaseConfig
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `storage_dir` | `Path \| None` | `None` | Custom storage directory (default: `~/.mld/plugins/{name}/`) |
| `db_filename` | `str` | `"data.db"` | Database filename |
| `echo_sql` | `bool` | `False` | Echo SQL statements for debugging |

---

### LocalDatabase

Per-plugin local SQLite database with high-level key-value API and low-level SQLModel access.

```python
from mld_sdk import LocalDatabase, LocalDatabaseConfig
```

#### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `initialize(models=None)` | Create database and tables. Pass custom SQLModel classes in `models`. |
| `close()` | Dispose engine and reset state |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `is_initialized` | `bool` | Whether the database has been initialized |
| `db_path` | `Path` | Resolved path to the SQLite file |
| `engine` | `Engine` | SQLAlchemy engine (raises if not initialized) |

#### Low-Level API

| Method | Description |
|--------|-------------|
| `get_session()` | Context manager yielding a SQLModel `Session` |

#### High-Level Key-Value API

| Method | Returns | Description |
|--------|---------|-------------|
| `set(key, value, namespace="default")` | `None` | Store a JSON-serializable value |
| `get(key, namespace="default", default=None)` | `Any` | Retrieve value or default |
| `delete(key, namespace="default")` | `bool` | Delete key, returns True if existed |
| `list_keys(namespace="default")` | `list[str]` | List all keys in namespace |
| `get_all(namespace="default")` | `dict[str, Any]` | Get all key-value pairs in namespace |
| `clear(namespace=None)` | `int` | Clear entries, returns count deleted |

#### Example: High-Level API

```python
from mld_sdk import AnalysisPlugin, LocalDatabaseConfig

class MyPlugin(AnalysisPlugin):
    def get_local_database_config(self):
        return LocalDatabaseConfig()  # uses default path

    async def initialize(self, context=None):
        self._context = context
        self._setup_local_database()

        # Store settings
        self.local_db.set("threshold", 0.05, namespace="settings")
        self.local_db.set("last_run", "2024-01-15")

    async def shutdown(self):
        self._teardown_local_database()
```

#### Example: Custom Tables

```python
from sqlmodel import SQLModel, Field

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
```

---

## Repository Protocols

All repositories are Protocol classes defining interfaces for data access.

### ExperimentRepository

Repository for experiment data.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_by_id(experiment_id)` | `Experiment \| None` | Get experiment by ID |
| `list_all(skip, limit, status, experiment_type, project, created_by, parent_experiment_id, search)` | `tuple[list[Experiment], int]` | List with filtering |
| `create(name, experiment_type, ...)` | `Experiment` | Create experiment (EXPERIMENT_DESIGN only) |
| `update(experiment_id, ...)` | `Experiment \| None` | Update experiment (EXPERIMENT_DESIGN only) |
| `delete(experiment_id)` | `bool` | Delete experiment (EXPERIMENT_DESIGN only) |
| `has_design_data(experiment_id)` | `bool` | Check for design data |

**Note:** ANALYSIS plugins have read-only access. Write operations raise `PermissionException`.

---

### PluginDataRepository

Repository for plugin-specific data and analysis results.

| Method | Returns | Description |
|--------|---------|-------------|
| `save_experiment_data(experiment_id, plugin_id, data, schema_version)` | `DesignData` | Save experiment data |
| `get_experiment_data(experiment_id)` | `DesignData \| None` | Get experiment data |
| `delete_experiment_data(experiment_id)` | `bool` | Delete experiment data |
| `save_analysis_result(experiment_id, plugin_id, result)` | `PluginAnalysisResult` | Save analysis result |
| `get_analysis_result(experiment_id, plugin_id)` | `PluginAnalysisResult \| None` | Get analysis result |
| `get_analysis_results(experiment_id)` | `list[PluginAnalysisResult]` | Get all results for experiment |
| `delete_analysis_result(experiment_id, plugin_id)` | `bool` | Delete analysis result |

---

### UserRepository

Repository for user data.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_by_id(user_id)` | `User \| None` | Get user by ID |
| `get_by_username(username)` | `User \| None` | Get user by username |
| `list_all(skip, limit)` | `list[User]` | List all users |

---

### AnalysisArtifactRepository

Repository for analysis artifacts.

| Method | Returns | Description |
|--------|---------|-------------|
| `create(plugin_name, artifact_type, data, experiment_id, created_by)` | `AnalysisArtifact` | Create artifact |
| `get_by_id(artifact_id)` | `AnalysisArtifact \| None` | Get artifact by ID |
| `list_for_experiment(experiment_id, plugin_name, artifact_type)` | `list[AnalysisArtifact]` | List for experiment |
| `list_for_plugin(plugin_name, artifact_type, limit)` | `list[AnalysisArtifact]` | List for plugin |
| `update(artifact_id, data)` | `AnalysisArtifact \| None` | Update artifact |
| `delete(artifact_id)` | `bool` | Delete artifact |

---

### CompoundListRepository

Repository for compound/target lists.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_by_id(compound_list_id)` | `CompoundList \| None` | Get list by ID |
| `list_all(owner_id, include_master)` | `list[CompoundList]` | List all compound lists |
| `get_master_lists()` | `list[CompoundList]` | Get master lists only |
| `get_compounds_for_list(compound_list_id)` | `list[Compound]` | Get compounds in list |
| `get_compound_count(compound_list_id)` | `int` | Get compound count |

---

### MetadataTemplateRepository

Repository for metadata templates.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_by_id(template_id)` | `MetadataTemplate \| None` | Get template by ID |
| `list_for_user(user_id, include_defaults)` | `list[MetadataTemplate]` | List templates for user |
| `get_defaults()` | `list[MetadataTemplate]` | Get default templates |

---

### TracingPresetRepository

Repository for isotope tracing presets.

| Method | Returns | Description |
|--------|---------|-------------|
| `get_by_id(preset_id)` | `TracingPreset \| None` | Get preset by ID |
| `list_for_user(user_id, include_defaults)` | `list[TracingPreset]` | List presets for user |

---

## Data Models

### Experiment

```python
from mld_sdk import Experiment
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `name` | `str` | Experiment name |
| `experiment_type` | `str` | Type identifier |
| `status` | `str` | Current status |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |
| `created_by` | `str \| None` | Creator user ID |
| `method_id` | `str \| None` | Associated method ID |
| `compound_list_id` | `str \| None` | Associated compound list |
| `parent_experiment_id` | `str \| None` | Parent experiment ID |
| `cell_line` | `str \| None` | Cell line |
| `project` | `str \| None` | Project name |
| `notes` | `str \| None` | Notes |
| `tags` | `dict` | Custom tags |
| `extraction_trigger` | `str` | Extraction trigger mode |
| `output_folder_path` | `str \| None` | Output folder path |

---

### DesignData

Experiment design data owned by an experiment design plugin.

```python
from mld_sdk import DesignData

# Backward compatibility alias:
from mld_sdk import PluginExperimentData  # same as DesignData
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Unique identifier |
| `experiment_id` | `int` | Associated experiment |
| `plugin_id` | `str` | Plugin identifier |
| `data` | `dict[str, Any]` | Plugin-defined experiment design data |
| `schema_version` | `str` | Data schema version |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |

---

### PluginAnalysisResult

```python
from mld_sdk import PluginAnalysisResult
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `experiment_id` | `str` | Associated experiment |
| `plugin_id` | `str` | Plugin identifier |
| `result` | `dict[str, Any]` | Analysis result data |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |

---

### User

```python
from mld_sdk import User
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `username` | `str` | Username |
| `role` | `str` | User role |
| `is_active` | `bool` | Account active status |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |
| `email` | `str \| None` | Email address |
| `shortname` | `str \| None` | Display shortname |
| `first_name` | `str \| None` | First name |
| `last_name` | `str \| None` | Last name |

---

### AnalysisArtifact

```python
from mld_sdk import AnalysisArtifact
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `plugin_name` | `str` | Plugin name |
| `artifact_type` | `str` | Artifact type |
| `data` | `dict[str, Any]` | Artifact data |
| `created_at` | `datetime` | Creation timestamp |
| `experiment_id` | `str \| None` | Associated experiment |
| `created_by` | `str \| None` | Creator user ID |

---

### CompoundList

```python
from mld_sdk import CompoundList
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `name` | `str` | List name |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |
| `owner_id` | `str \| None` | Owner user ID |
| `is_master` | `bool` | Is master list |
| `method_id` | `str \| None` | Associated method |
| `description` | `str \| None` | Description |

---

### Compound

```python
from mld_sdk import Compound
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `compound_list_id` | `str` | Parent list ID |
| `name` | `str` | Compound name |
| `formula` | `str` | Chemical formula |
| `adduct` | `str` | Adduct type |
| `expected_rt` | `float` | Expected retention time |
| `created_at` | `datetime` | Creation timestamp |
| `mass` | `float \| None` | Molecular mass |
| `rt_source` | `str` | RT source (default: "default") |

---

### MetadataTemplate

```python
from mld_sdk import MetadataTemplate
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `name` | `str` | Template name |
| `fields` | `list[dict]` | Field definitions |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |
| `owner_id` | `str \| None` | Owner user ID |
| `description` | `str \| None` | Description |
| `is_default` | `bool` | Is default template |

---

### TracingPreset

```python
from mld_sdk import TracingPreset
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `str` | Unique identifier |
| `name` | `str` | Preset name |
| `entries` | `list[dict]` | Tracing entries |
| `created_at` | `datetime` | Creation timestamp |
| `updated_at` | `datetime` | Last update timestamp |
| `owner_id` | `str \| None` | Owner user ID |
| `description` | `str \| None` | Description |
| `is_default` | `bool` | Is default preset |

---

## Type Alias

### PlatformConfig

```python
from mld_sdk import PlatformConfig

# PlatformConfig = dict[str, Any]
```

Platform configuration dictionary containing settings for auth, database, features, and plugins.
