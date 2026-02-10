"""
Exception hierarchy for MLD SDK plugins.

All exceptions inherit from PluginException, which allows platform
code to catch and handle plugin errors consistently.

Exception Hierarchy:
    PluginException
    ├── ValidationException     - Invalid input data
    ├── PermissionException     - Access denied
    ├── ConfigurationException  - Invalid plugin configuration
    ├── RepositoryException     - Database/storage errors
    │   ├── NotFoundException   - Resource not found
    │   └── ConflictException   - Resource conflict (duplicate, etc.)
    └── PluginLifecycleException - Plugin startup/shutdown errors

Usage:
    from mld_sdk.exceptions import ValidationException, NotFoundException

    async def get_experiment(self, experiment_id: int) -> Experiment:
        if not experiment_id:
            raise ValidationException("experiment_id is required")

        experiment = await self.repo.get_by_id(experiment_id)
        if not experiment:
            raise NotFoundException(f"Experiment {experiment_id} not found")

        return experiment
"""

from typing import Any, Optional


class PluginException(Exception):
    """
    Base exception for all plugin errors.

    Attributes:
        message: Human-readable error description
        code: Machine-readable error code (e.g., "VALIDATION_ERROR")
        details: Optional dict with additional error context
    """

    def __init__(
        self,
        message: str,
        code: str = "PLUGIN_ERROR",
        details: Optional[dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}

    def to_dict(self) -> dict[str, Any]:
        """Convert exception to dict for API responses."""
        result = {
            "error": self.code,
            "message": self.message,
        }
        if self.details:
            result["details"] = self.details
        return result


class ValidationException(PluginException):
    """
    Raised when input validation fails.

    Use for:
    - Invalid parameter formats or malformed data
    - Missing required fields
    - Out-of-range values
    - Schema validation failures

    Example:
        if experiment_id <= 0:
            raise ValidationException(
                "Invalid experiment ID",
                field="experiment_id",
                value=experiment_id,
            )
    """

    def __init__(
        self,
        message: str,
        field: Optional[str] = None,
        value: Any = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if field:
            _details["field"] = field
        if value is not None:
            value_str = str(value)
            _details["value"] = value_str[:100] + ("..." if len(value_str) > 100 else "")

        super().__init__(message, code="VALIDATION_ERROR", details=_details)
        self.field = field
        self.value = value


class PermissionException(PluginException):
    """
    Raised when access is denied.

    Use for:
    - User lacks required role
    - Resource not owned by user
    - Operation not allowed for plugin type

    Example:
        if plugin_type == PluginType.ANALYSIS:
            raise PermissionException(
                "Analysis plugins cannot modify experiments",
                required_permission="experiment:write",
            )
    """

    def __init__(
        self,
        message: str,
        required_permission: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if required_permission:
            _details["required_permission"] = required_permission

        super().__init__(message, code="PERMISSION_DENIED", details=_details)
        self.required_permission = required_permission


class ConfigurationException(PluginException):
    """
    Raised when plugin configuration is invalid.

    Use for:
    - Missing required configuration
    - Invalid configuration values
    - Configuration schema validation failures

    Example:
        if not config.get("api_endpoint"):
            raise ConfigurationException(
                "Plugin requires 'api_endpoint' configuration",
                config_key="api_endpoint",
            )
    """

    def __init__(
        self,
        message: str,
        config_key: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if config_key:
            _details["config_key"] = config_key

        super().__init__(message, code="CONFIGURATION_ERROR", details=_details)
        self.config_key = config_key


class RepositoryException(PluginException):
    """
    Raised when repository operations fail.

    Base class for database/storage errors. Use subclasses for
    specific error types (NotFoundException, ConflictException).

    Example:
        try:
            await session.commit()
        except DatabaseError as e:
            raise RepositoryException(
                f"Failed to save experiment: {e}",
                operation="save",
                entity="experiment",
            )
    """

    def __init__(
        self,
        message: str,
        operation: Optional[str] = None,
        entity: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if operation:
            _details["operation"] = operation
        if entity:
            _details["entity"] = entity

        super().__init__(message, code="REPOSITORY_ERROR", details=_details)
        self.operation = operation
        self.entity = entity


class NotFoundException(RepositoryException):
    """
    Raised when a requested resource is not found.

    Example:
        experiment = await repo.get_by_id(experiment_id)
        if not experiment:
            raise NotFoundException(
                f"Experiment not found",
                entity="experiment",
                entity_id=experiment_id,
            )
    """

    def __init__(
        self,
        message: str,
        entity: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if entity_id:
            _details["entity_id"] = entity_id

        super().__init__(
            message,
            operation="get",
            entity=entity,
            details=_details,
        )
        self.code = "NOT_FOUND"
        self.entity_id = entity_id


class ConflictException(RepositoryException):
    """
    Raised when a resource conflict occurs.

    Use for:
    - Duplicate unique values (e.g., username already exists)
    - Concurrent modification conflicts
    - State conflicts (e.g., can't delete experiment in progress)

    Example:
        if await repo.get_by_name(name):
            raise ConflictException(
                f"Experiment '{name}' already exists",
                entity="experiment",
                conflict_field="name",
            )
    """

    def __init__(
        self,
        message: str,
        entity: Optional[str] = None,
        conflict_field: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if conflict_field:
            _details["conflict_field"] = conflict_field

        super().__init__(
            message,
            operation="create_or_update",
            entity=entity,
            details=_details,
        )
        self.code = "CONFLICT"
        self.conflict_field = conflict_field


class PluginLifecycleException(PluginException):
    """
    Raised when plugin lifecycle operations fail.

    Use for:
    - Plugin initialization failures
    - Plugin shutdown errors
    - Health check failures

    Example:
        try:
            await plugin.initialize(context)
        except Exception as e:
            raise PluginLifecycleException(
                f"Plugin failed to initialize: {e}",
                phase="initialize",
                plugin_name=plugin.metadata.name,
            )
    """

    def __init__(
        self,
        message: str,
        phase: Optional[str] = None,
        plugin_name: Optional[str] = None,
        details: Optional[dict[str, Any]] = None,
    ):
        _details = details or {}
        if phase:
            _details["phase"] = phase
        if plugin_name:
            _details["plugin_name"] = plugin_name

        super().__init__(message, code="LIFECYCLE_ERROR", details=_details)
        self.phase = phase
        self.plugin_name = plugin_name
