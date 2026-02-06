# Exception Handling

The MLD SDK provides a structured exception hierarchy for consistent error handling across plugins.

## Exception Hierarchy

```
PluginException
├── ValidationException     - Invalid input data
├── PermissionException     - Access denied
├── ConfigurationException  - Invalid plugin configuration
├── RepositoryException     - Database/storage errors
│   ├── NotFoundException   - Resource not found
│   └── ConflictException   - Resource conflict (duplicate, etc.)
└── PluginLifecycleException - Plugin startup/shutdown errors
```

## Base Exception

### PluginException

Base exception for all plugin errors.

```python
from mld_sdk import PluginException
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `message` | `str` | Human-readable error description |
| `code` | `str` | Machine-readable error code |
| `details` | `dict[str, Any]` | Additional error context |

#### Constructor

```python
PluginException(
    message: str,
    code: str = "PLUGIN_ERROR",
    details: dict[str, Any] | None = None,
)
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `to_dict()` | `dict[str, Any]` | Convert to dict for API responses |

#### Example

```python
raise PluginException(
    "Operation failed",
    code="CUSTOM_ERROR",
    details={"reason": "timeout"},
)

# to_dict() output:
# {
#     "error": "CUSTOM_ERROR",
#     "message": "Operation failed",
#     "details": {"reason": "timeout"}
# }
```

---

## Validation Errors

### ValidationException

Raised when input validation fails.

```python
from mld_sdk import ValidationException
```

**Use for:**
- Invalid parameter formats (bad UUIDs, malformed data)
- Missing required fields
- Out-of-range values
- Schema validation failures

#### Constructor

```python
ValidationException(
    message: str,
    field: str | None = None,
    value: Any = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `field` | `str \| None` | Name of the invalid field |
| `value` | `Any` | The invalid value |

**Error code:** `VALIDATION_ERROR`

#### Examples

```python
# Missing required field
if not experiment_id:
    raise ValidationException(
        "Experiment ID is required",
        field="experiment_id",
    )

# Invalid format
if not is_valid_uuid(experiment_id):
    raise ValidationException(
        "Invalid experiment ID format",
        field="experiment_id",
        value=experiment_id,
    )

# Out of range
if threshold < 0 or threshold > 1:
    raise ValidationException(
        "Threshold must be between 0 and 1",
        field="threshold",
        value=threshold,
    )

# Schema validation
errors = validate_schema(data)
if errors:
    raise ValidationException(
        "Data validation failed",
        details={"errors": errors},
    )
```

---

## Permission Errors

### PermissionException

Raised when access is denied.

```python
from mld_sdk import PermissionException
```

**Use for:**
- User lacks required role
- Resource not owned by user
- Operation not allowed for plugin type

#### Constructor

```python
PermissionException(
    message: str,
    required_permission: str | None = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `required_permission` | `str \| None` | Permission that was required |

**Error code:** `PERMISSION_DENIED`

#### Examples

```python
# Plugin type restriction
if plugin_type == PluginType.ANALYSIS:
    raise PermissionException(
        "Analysis plugins cannot modify experiments",
        required_permission="experiment:write",
    )

# Role check
if user["role"] != "admin":
    raise PermissionException(
        "Admin access required",
        required_permission="admin",
    )

# Ownership check
if experiment.created_by != user["id"]:
    raise PermissionException(
        "You do not own this experiment",
        details={"owner": experiment.created_by},
    )
```

---

## Configuration Errors

### ConfigurationException

Raised when plugin configuration is invalid.

```python
from mld_sdk import ConfigurationException
```

**Use for:**
- Missing required configuration
- Invalid configuration values
- Configuration schema validation failures

#### Constructor

```python
ConfigurationException(
    message: str,
    config_key: str | None = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `config_key` | `str \| None` | Configuration key with the issue |

**Error code:** `CONFIGURATION_ERROR`

#### Examples

```python
# Missing configuration
if not config.get("api_endpoint"):
    raise ConfigurationException(
        "Plugin requires 'api_endpoint' configuration",
        config_key="api_endpoint",
    )

# Invalid value
if config["timeout"] < 0:
    raise ConfigurationException(
        "Timeout must be positive",
        config_key="timeout",
    )

# Required service unavailable
if not context:
    raise ConfigurationException(
        "Plugin requires platform context to operate",
    )
```

---

## Repository Errors

### RepositoryException

Base class for database/storage errors.

```python
from mld_sdk import RepositoryException
```

**Use for:**
- Database connection failures
- Query errors
- Storage system failures

#### Constructor

```python
RepositoryException(
    message: str,
    operation: str | None = None,
    entity: str | None = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `operation` | `str \| None` | Operation that failed (get, save, delete) |
| `entity` | `str \| None` | Entity type involved |

**Error code:** `REPOSITORY_ERROR`

#### Example

```python
try:
    await session.commit()
except DatabaseError as e:
    raise RepositoryException(
        f"Failed to save experiment: {e}",
        operation="save",
        entity="experiment",
    )
```

---

### NotFoundException

Raised when a requested resource is not found. Subclass of `RepositoryException`.

```python
from mld_sdk import NotFoundException
```

#### Constructor

```python
NotFoundException(
    message: str,
    entity: str | None = None,
    entity_id: str | None = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `entity_id` | `str \| None` | ID of the missing entity |

**Error code:** `NOT_FOUND`

#### Examples

```python
experiment = await repo.get_by_id(experiment_id)
if not experiment:
    raise NotFoundException(
        "Experiment not found",
        entity="experiment",
        entity_id=experiment_id,
    )

user = await user_repo.get_by_username(username)
if not user:
    raise NotFoundException(
        f"User '{username}' not found",
        entity="user",
    )
```

---

### ConflictException

Raised when a resource conflict occurs. Subclass of `RepositoryException`.

```python
from mld_sdk import ConflictException
```

**Use for:**
- Duplicate unique values (e.g., username already exists)
- Concurrent modification conflicts
- State conflicts (e.g., can't delete experiment in progress)

#### Constructor

```python
ConflictException(
    message: str,
    entity: str | None = None,
    conflict_field: str | None = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `conflict_field` | `str \| None` | Field that caused the conflict |

**Error code:** `CONFLICT`

#### Examples

```python
# Duplicate name
if await repo.get_by_name(name):
    raise ConflictException(
        f"Experiment '{name}' already exists",
        entity="experiment",
        conflict_field="name",
    )

# State conflict
if experiment.status == "in_progress":
    raise ConflictException(
        "Cannot delete experiment while in progress",
        entity="experiment",
        details={"status": experiment.status},
    )

# Concurrent modification
if experiment.version != expected_version:
    raise ConflictException(
        "Experiment was modified by another user",
        entity="experiment",
    )
```

---

## Lifecycle Errors

### PluginLifecycleException

Raised when plugin lifecycle operations fail.

```python
from mld_sdk import PluginLifecycleException
```

**Use for:**
- Plugin initialization failures
- Plugin shutdown errors
- Health check failures

#### Constructor

```python
PluginLifecycleException(
    message: str,
    phase: str | None = None,
    plugin_name: str | None = None,
    details: dict[str, Any] | None = None,
)
```

| Attribute | Type | Description |
|-----------|------|-------------|
| `phase` | `str \| None` | Lifecycle phase (initialize, shutdown, health_check) |
| `plugin_name` | `str \| None` | Name of the plugin |

**Error code:** `LIFECYCLE_ERROR`

#### Examples

```python
# Initialization failure
try:
    await self.db.connect()
except ConnectionError as e:
    raise PluginLifecycleException(
        f"Failed to connect to database: {e}",
        phase="initialize",
        plugin_name=self.metadata.name,
    )

# Required dependency unavailable
if not context.get_experiment_repository():
    raise PluginLifecycleException(
        "Experiment repository required but not available",
        phase="initialize",
        plugin_name=self.metadata.name,
    )
```

---

## Error Handling Patterns

### In Route Handlers

```python
from mld_sdk import ValidationException, NotFoundException
from fastapi import HTTPException

@router.get("/experiments/{experiment_id}")
async def get_experiment(experiment_id: str):
    try:
        return await plugin.get_experiment(experiment_id)
    except ValidationException as e:
        raise HTTPException(status_code=400, detail=e.to_dict())
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=e.to_dict())
    except PermissionException as e:
        raise HTTPException(status_code=403, detail=e.to_dict())
    except RepositoryException as e:
        raise HTTPException(status_code=500, detail=e.to_dict())
```

### Global Exception Handler

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from mld_sdk import PluginException

app = FastAPI()

@app.exception_handler(PluginException)
async def plugin_exception_handler(request: Request, exc: PluginException):
    status_codes = {
        "VALIDATION_ERROR": 400,
        "PERMISSION_DENIED": 403,
        "NOT_FOUND": 404,
        "CONFLICT": 409,
        "CONFIGURATION_ERROR": 500,
        "REPOSITORY_ERROR": 500,
        "LIFECYCLE_ERROR": 500,
    }
    status_code = status_codes.get(exc.code, 500)
    return JSONResponse(status_code=status_code, content=exc.to_dict())
```

### In Service Methods

```python
async def analyze_experiment(self, experiment_id: str) -> dict:
    # Validate input
    if not experiment_id:
        raise ValidationException(
            "Experiment ID required",
            field="experiment_id",
        )

    # Check existence
    experiment = await self.experiments.get_by_id(experiment_id)
    if not experiment:
        raise NotFoundException(
            "Experiment not found",
            entity="experiment",
            entity_id=experiment_id,
        )

    # Check state
    if experiment.status != "completed":
        raise ConflictException(
            "Can only analyze completed experiments",
            entity="experiment",
            details={"status": experiment.status},
        )

    # Perform analysis
    return await self._run_analysis(experiment)
```

---

## Exception Reference Table

| Exception | Code | HTTP Status | Use Case |
|-----------|------|-------------|----------|
| `PluginException` | `PLUGIN_ERROR` | 500 | Generic plugin errors |
| `ValidationException` | `VALIDATION_ERROR` | 400 | Invalid input |
| `PermissionException` | `PERMISSION_DENIED` | 403 | Access denied |
| `ConfigurationException` | `CONFIGURATION_ERROR` | 500 | Bad configuration |
| `RepositoryException` | `REPOSITORY_ERROR` | 500 | Database errors |
| `NotFoundException` | `NOT_FOUND` | 404 | Resource not found |
| `ConflictException` | `CONFLICT` | 409 | Resource conflicts |
| `PluginLifecycleException` | `LIFECYCLE_ERROR` | 500 | Lifecycle failures |
