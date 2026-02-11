"""
Repository protocols for MLD SDK.

These protocols define the interfaces that plugins can use to interact
with platform data. They are implemented by the platform and provided
to plugins via PlatformContext.

Repository types correspond to plugin capabilities:
- ExperimentRepository: Basic experiment access (read-only for ANALYSIS plugins)
- PluginDataRepository: Design data and analysis result storage
- UserRepository: User information
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional, Protocol, runtime_checkable


# --- Data Models ---


@dataclass(slots=True)
class Experiment:
    """Experiment data model."""

    id: int
    name: str
    experiment_type: str
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    parent_experiment_id: Optional[int] = None
    project: Optional[str] = None
    notes: Optional[str] = None
    tags: dict = field(default_factory=dict)
    custom_metadata: dict = field(default_factory=dict)


@dataclass(slots=True)
class DesignData:
    """Experiment design data owned by an experiment design plugin."""

    id: int
    experiment_id: int
    plugin_id: str
    data: dict[str, Any]
    schema_version: str
    created_at: datetime
    updated_at: datetime


# Backward compatibility alias
PluginExperimentData = DesignData


@dataclass(slots=True)
class PluginAnalysisResult:
    """Analysis result from a plugin."""

    id: int
    experiment_id: int
    plugin_id: str
    result: dict[str, Any]
    created_at: datetime
    updated_at: datetime


@dataclass(slots=True)
class User:
    """User data model."""

    id: int
    username: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    email: Optional[str] = None
    shortname: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


@dataclass(slots=True)
class UserPluginRole:
    """Per-plugin role assignment for a user."""

    id: int
    user_id: int
    plugin_id: str
    role: str
    created_at: datetime
    updated_at: datetime


# --- Repository Protocols ---


@runtime_checkable
class ExperimentRepository(Protocol):
    """
    Repository for experiment data.

    For ANALYSIS plugins: Read-only access (create/update/delete raise PermissionException)
    For EXPERIMENT_DESIGN plugins: Full CRUD access
    """

    async def get_by_id(self, experiment_id: int) -> Optional[Experiment]:
        """Get experiment by ID."""
        ...

    async def list_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        experiment_type: Optional[str] = None,
        project: Optional[str] = None,
        created_by: Optional[int] = None,
        parent_experiment_id: Optional[int] = None,
        search: Optional[str] = None,
    ) -> tuple[list[Experiment], int]:
        """List experiments with filtering and pagination."""
        ...

    async def create(
        self,
        name: str,
        experiment_type: str,
        created_by: Optional[int] = None,
        parent_experiment_id: Optional[int] = None,
        project: Optional[str] = None,
        notes: Optional[str] = None,
        tags: Optional[dict] = None,
    ) -> Experiment:
        """Create a new experiment.

        Only available to EXPERIMENT_DESIGN plugins.
        """
        ...

    async def update(
        self,
        experiment_id: int,
        *,
        name: Optional[str] = None,
        status: Optional[str] = None,
        experiment_type: Optional[str] = None,
        parent_experiment_id: Optional[int] = None,
        project: Optional[str] = None,
        notes: Optional[str] = None,
        tags: Optional[dict] = None,
    ) -> Optional[Experiment]:
        """Update an experiment.

        Only available to EXPERIMENT_DESIGN plugins.
        """
        ...

    async def delete(self, experiment_id: int) -> bool:
        """Delete an experiment.

        Only available to EXPERIMENT_DESIGN plugins.
        """
        ...

    async def has_design_data(self, experiment_id: int) -> bool:
        """Check if experiment has design data attached."""
        ...


@runtime_checkable
class PluginDataRepository(Protocol):
    """
    Repository for plugin-specific experiment data and analysis results.

    Experiment data: One record per experiment, owned by experiment design plugin
    Analysis results: One record per experiment per analysis plugin
    """

    async def save_experiment_data(
        self,
        experiment_id: int,
        plugin_id: str,
        data: dict[str, Any],
        schema_version: str = "1.0",
    ) -> DesignData:
        """Save or update experiment data for a plugin."""
        ...

    async def get_experiment_data(
        self, experiment_id: int
    ) -> Optional[DesignData]:
        """Get experiment data for an experiment."""
        ...

    async def delete_experiment_data(self, experiment_id: int) -> bool:
        """Delete experiment data for an experiment."""
        ...

    async def save_analysis_result(
        self,
        experiment_id: int,
        plugin_id: str,
        result: dict[str, Any],
    ) -> PluginAnalysisResult:
        """Save or update analysis result."""
        ...

    async def get_analysis_result(
        self,
        experiment_id: int,
        plugin_id: str,
    ) -> Optional[PluginAnalysisResult]:
        """Get analysis result for a specific plugin."""
        ...

    async def get_analysis_results(
        self, experiment_id: int
    ) -> list[PluginAnalysisResult]:
        """Get all analysis results for an experiment."""
        ...

    async def delete_analysis_result(
        self,
        experiment_id: int,
        plugin_id: str,
    ) -> bool:
        """Delete analysis result for a specific plugin."""
        ...


@runtime_checkable
class UserRepository(Protocol):
    """Repository for user data."""

    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        ...

    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        ...

    async def list_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        """List all users with pagination."""
        ...


@runtime_checkable
class PluginRoleRepository(Protocol):
    """Repository for plugin-scoped user roles.

    Allows plugins to define their own admin/role system independent
    of platform-level roles. Platform admins bypass plugin role checks.
    """

    async def get_role(self, plugin_id: str, user_id: int) -> Optional[str]:
        """Get a user's role in a plugin. Returns None if no role assigned."""

    async def set_role(self, plugin_id: str, user_id: int, role: str) -> UserPluginRole:
        """Set (insert or update) a user's role in a plugin."""

    async def remove_role(self, plugin_id: str, user_id: int) -> bool:
        """Remove a user's role in a plugin."""

    async def list_plugin_roles(self, plugin_id: str) -> list[UserPluginRole]:
        """List all role assignments for a plugin."""

    async def list_user_roles(self, user_id: int) -> list[UserPluginRole]:
        """List all plugin role assignments for a user."""


# Type alias for platform configuration
PlatformConfig = dict[str, Any]
