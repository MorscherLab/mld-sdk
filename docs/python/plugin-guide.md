# Plugin Development Guide

This guide covers the plugin lifecycle, patterns, and best practices for developing MLD plugins.

## Plugin Lifecycle

### 1. Discovery

Plugins are discovered via Python entry points:

```toml
# pyproject.toml
[project.entry-points."mld.plugins"]
my_plugin = "my_package.plugin:MyPlugin"
```

The platform scans all installed packages with `mld.plugins` entry points.

### 2. Instantiation

The plugin class is instantiated (constructor called). At this point, the plugin has no access to platform services.

### 3. Initialization

`initialize(context)` is called with the platform context:

```python
async def initialize(self, context: PlatformContext | None = None) -> None:
    self._context = context

    if context:
        # Running integrated - set up platform services
        self.experiment_repo = context.get_experiment_repository()
        self.plugin_data_repo = context.get_plugin_data_repository()
        self.user_repo = context.get_user_repository()
    else:
        # Running standalone - no platform services
        self.experiment_repo = None
```

**Initialization failures:** If `initialize()` raises `PluginLifecycleException`, the plugin will not be loaded.

### 4. Serving

After initialization, the plugin's routers are mounted and it begins serving requests.

### 5. Shutdown

When the platform shuts down, `shutdown()` is called:

```python
async def shutdown(self) -> None:
    # Close database connections
    if self.db_pool:
        await self.db_pool.close()

    # Flush caches
    if self.cache:
        await self.cache.flush()

    # Stop background tasks
    if self.background_task:
        self.background_task.cancel()
```

**Important:** `shutdown()` should not raise exceptions. Log errors instead.

## Operating Modes

### Standalone Mode

When `context` is `None`, the plugin runs without platform services:

```python
if self.is_standalone:
    # Use local configuration
    # No access to experiments, users, etc.
    pass
```

Use standalone mode for:
- Local development
- Testing
- Plugins that don't need platform integration

### Integrated Mode

When `context` is provided, the plugin has full access to platform services:

```python
if not self.is_standalone:
    # Access platform services
    experiments = await self.experiment_repo.list_all()
    user = await self.user_repo.get_by_id(user_id)
```

## Plugin Types

### ANALYSIS Plugins

Read-only access to experiments:

```python
PluginMetadata(
    plugin_type=PluginType.ANALYSIS,
    ...
)
```

- Can read experiments
- Can save analysis results
- Cannot create/update/delete experiments
- Write operations raise `PermissionException`

### EXPERIMENT_DESIGN Plugins

Full CRUD access:

```python
PluginMetadata(
    plugin_type=PluginType.EXPERIMENT_DESIGN,
    ...
)
```

- Full experiment management
- Can create, update, delete experiments
- Can save experiment data

## Routers

Plugins provide FastAPI routers:

```python
from fastapi import APIRouter, Depends

router = APIRouter()

@router.get("/experiments")
async def list_experiments():
    return {"experiments": []}

@router.post("/analyze/{experiment_id}")
async def analyze(experiment_id: str):
    return {"result": "done"}

class MyPlugin(AnalysisPlugin):
    def get_routers(self) -> list[tuple[APIRouter, str]]:
        return [
            (router, ""),                    # Mounted at /my-plugin/
            (admin_router, "/admin"),        # Mounted at /my-plugin/admin/
            (api_router, "/api/v1"),         # Mounted at /my-plugin/api/v1/
        ]
```

### Protected Routes

Use context dependencies for authentication:

```python
@router.get("/protected")
async def protected_route(
    user: dict = Depends(context.get_current_user_dependency())
):
    return {"user": user["username"]}

@router.get("/public")
async def public_route(
    user: dict | None = Depends(context.get_optional_user_dependency())
):
    if user:
        return {"message": f"Hello, {user['username']}"}
    return {"message": "Hello, guest"}
```

## Lifecycle Hooks

### Health Checks

Override `check_health()` to report plugin health:

```python
async def check_health(self) -> PluginHealth:
    try:
        # Check critical dependencies
        if not await self.db.is_connected():
            return PluginHealth(
                status=HealthStatus.UNHEALTHY,
                message="Database connection lost",
            )

        # Check non-critical services
        cache_ok = await self.cache.ping()
        if not cache_ok:
            return PluginHealth(
                status=HealthStatus.DEGRADED,
                message="Cache unavailable",
            )

        return PluginHealth(status=HealthStatus.HEALTHY)

    except Exception as e:
        return PluginHealth(
            status=HealthStatus.UNKNOWN,
            message=f"Health check failed: {e}",
        )
```

### Experiment Hooks

Respond to experiment lifecycle events:

```python
async def on_before_experiment_save(
    self, experiment_id: str, data: dict
) -> LifecycleHookResult:
    """Validate data before save."""
    errors = self.validate_schema(data)
    if errors:
        return LifecycleHookResult(
            success=False,
            message="Validation failed",
            data={"errors": errors},
        )
    return LifecycleHookResult(success=True)

async def on_after_experiment_save(
    self, experiment_id: str, data: dict
) -> None:
    """Trigger follow-up processing."""
    await self.queue_analysis(experiment_id)

async def on_experiment_status_change(
    self, experiment_id: str, old_status: str, new_status: str
) -> None:
    """React to status changes."""
    if new_status == "completed":
        await self.run_analysis(experiment_id)
```

## Working with Data

### Saving Plugin Data

Store plugin-specific experiment data:

```python
async def save_experiment_config(self, experiment_id: str, config: dict):
    data_repo = self.context.get_plugin_data_repository()

    await data_repo.save_experiment_data(
        experiment_id=experiment_id,
        plugin_id=self.metadata.name,
        data=config,
        schema_version="1.0",
    )

async def get_experiment_config(self, experiment_id: str) -> dict | None:
    data_repo = self.context.get_plugin_data_repository()
    result = await data_repo.get_experiment_data(experiment_id)
    return result.data if result else None
```

### Saving Analysis Results

Store analysis results:

```python
async def save_analysis(self, experiment_id: str, result: dict):
    data_repo = self.context.get_plugin_data_repository()

    await data_repo.save_analysis_result(
        experiment_id=experiment_id,
        plugin_id=self.metadata.name,
        result=result,
    )

async def get_analysis(self, experiment_id: str) -> dict | None:
    data_repo = self.context.get_plugin_data_repository()
    result = await data_repo.get_analysis_result(
        experiment_id=experiment_id,
        plugin_id=self.metadata.name,
    )
    return result.result if result else None
```

### Saving Artifacts

Store persistent analysis outputs:

```python
async def save_calibration_curve(self, experiment_id: str, curve_data: dict):
    artifact_repo = self.context.get_analysis_artifact_repository()

    return await artifact_repo.create(
        plugin_name=self.metadata.name,
        artifact_type="calibration_curve",
        data=curve_data,
        experiment_id=experiment_id,
    )

async def get_calibration_curves(self, experiment_id: str):
    artifact_repo = self.context.get_analysis_artifact_repository()

    return await artifact_repo.list_for_experiment(
        experiment_id=experiment_id,
        plugin_name=self.metadata.name,
        artifact_type="calibration_curve",
    )
```

## Frontend Integration

### Providing Frontend Configuration

```python
def get_frontend_config(self) -> dict:
    return {
        "name": self.metadata.name,
        "version": self.metadata.version,
        "routePrefix": self.metadata.routes_prefix,
        "analysisType": self.metadata.analysis_type,
        "features": {
            "advancedMode": True,
            "exportFormats": ["csv", "xlsx", "json"],
        },
    }
```

### Serving Frontend Files

```python
def get_frontend_dir(self) -> str | None:
    from pathlib import Path
    return str(Path(__file__).parent.parent / "frontend" / "dist")
```

The platform will serve these files under the plugin's route prefix.

## Version Compatibility

Declare compatible platform versions:

```python
def get_compatible_platform_versions(self) -> tuple[str, str] | None:
    return ("1.0.0", "2.0.0")  # Compatible with 1.x
```

Use `"*"` for unbounded min or max:

```python
return ("1.0.0", "*")  # 1.0.0 and above
return ("*", "2.0.0")  # Up to 2.0.0
```

## Error Handling

Use SDK exceptions for consistent error handling:

```python
from mld_sdk import (
    ValidationException,
    NotFoundException,
    PermissionException,
    ConfigurationException,
    RepositoryException,
)

async def get_experiment(self, experiment_id: str):
    if not experiment_id:
        raise ValidationException(
            "Experiment ID is required",
            field="experiment_id",
        )

    experiment = await self.experiment_repo.get_by_id(experiment_id)
    if not experiment:
        raise NotFoundException(
            "Experiment not found",
            entity="experiment",
            entity_id=experiment_id,
        )

    return experiment
```

See [Exception Handling](./exceptions.md) for the full exception reference.

## Testing

### Unit Testing

```python
import pytest
from my_plugin import MyPlugin

@pytest.fixture
def plugin():
    return MyPlugin()

async def test_metadata(plugin):
    assert plugin.metadata.name == "My Plugin"
    assert plugin.metadata.version == "1.0.0"

async def test_standalone_initialization(plugin):
    await plugin.initialize(None)
    assert plugin.is_standalone
```

### Integration Testing

```python
from unittest.mock import AsyncMock, MagicMock

@pytest.fixture
def mock_context():
    context = MagicMock()
    context.get_experiment_repository.return_value = AsyncMock()
    context.get_plugin_data_repository.return_value = AsyncMock()
    return context

async def test_integrated_initialization(plugin, mock_context):
    await plugin.initialize(mock_context)
    assert not plugin.is_standalone
    assert plugin.experiment_repo is not None
```

## Best Practices

1. **Handle missing context gracefully** - Always check if repositories are available
2. **Use schema versioning** - Include `schema_version` when saving data
3. **Implement health checks** - Help the platform monitor plugin status
4. **Log errors in shutdown** - Don't raise exceptions during cleanup
5. **Validate input early** - Use `ValidationException` for invalid requests
6. **Keep routes prefix unique** - Avoid conflicts with other plugins
