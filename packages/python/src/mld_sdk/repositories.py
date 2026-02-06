"""
Repository protocols for MLD SDK.

These protocols define the interfaces that plugins can use to interact
with platform data. They are implemented by the platform and provided
to plugins via PlatformContext.

Repository types correspond to plugin capabilities:
- ExperimentRepository: Basic experiment access (read-only for ANALYSIS plugins)
- PluginDataRepository: Plugin-specific data storage
- UserRepository: User information
- AnalysisArtifactRepository: Analysis output artifacts
- MetadataTemplateRepository: Experiment metadata templates
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional, Protocol, runtime_checkable


# --- Data Models ---


@dataclass
class Experiment:
    """Experiment data model."""

    id: str
    name: str
    experiment_type: str
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    method_id: Optional[str] = None
    parent_experiment_id: Optional[str] = None
    cell_line: Optional[str] = None
    project: Optional[str] = None
    notes: Optional[str] = None
    tags: dict = field(default_factory=dict)
    extraction_trigger: str = "manual"
    output_folder_path: Optional[str] = None


@dataclass
class PluginExperimentData:
    """Plugin-specific experiment data."""

    id: str
    experiment_id: str
    plugin_id: str
    data: dict[str, Any]
    schema_version: str
    created_at: datetime
    updated_at: datetime


@dataclass
class PluginAnalysisResult:
    """Analysis result from a plugin."""

    id: str
    experiment_id: str
    plugin_id: str
    result: dict[str, Any]
    created_at: datetime
    updated_at: datetime


@dataclass
class User:
    """User data model."""

    id: str
    username: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    email: Optional[str] = None
    shortname: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


@dataclass
class AnalysisArtifact:
    """Analysis artifact data model."""

    id: str
    plugin_name: str
    artifact_type: str
    data: dict[str, Any]
    created_at: datetime
    experiment_id: Optional[str] = None
    created_by: Optional[str] = None


@dataclass
class MetadataTemplate:
    """Metadata template data model."""

    id: str
    name: str
    fields: list[dict]
    created_at: datetime
    updated_at: datetime
    owner_id: Optional[str] = None
    description: Optional[str] = None
    is_default: bool = False


# --- Repository Protocols ---


@runtime_checkable
class ExperimentRepository(Protocol):
    """
    Repository for experiment data.

    For ANALYSIS plugins: Read-only access (create/update/delete raise PermissionException)
    For EXPERIMENT_DESIGN plugins: Full CRUD access

    Note: This is a Protocol, not an ABC. It defines the interface that
    platform implementations must satisfy.
    """

    async def get_by_id(self, experiment_id: str) -> Optional[Experiment]:
        """Get experiment by ID.

        Args:
            experiment_id: UUID of the experiment

        Returns:
            Experiment if found, None otherwise

        Raises:
            RepositoryException: On database errors
        """
        ...

    async def list_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        experiment_type: Optional[str] = None,
        project: Optional[str] = None,
        created_by: Optional[str] = None,
        parent_experiment_id: Optional[str] = None,
        search: Optional[str] = None,
    ) -> tuple[list[Experiment], int]:
        """List experiments with filtering and pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum records to return
            status: Filter by status (planned, ready_to_extract, etc.)
            experiment_type: Filter by type
            project: Filter by project name
            created_by: Filter by creator user ID
            parent_experiment_id: Filter by parent experiment
            search: Search in name and notes

        Returns:
            Tuple of (experiments list, total count)

        Raises:
            RepositoryException: On database errors
        """
        ...

    async def create(
        self,
        name: str,
        experiment_type: str,
        created_by: Optional[str] = None,
        method_id: Optional[str] = None,
        parent_experiment_id: Optional[str] = None,
        cell_line: Optional[str] = None,
        project: Optional[str] = None,
        notes: Optional[str] = None,
        tags: Optional[dict] = None,
        extraction_trigger: str = "manual",
        output_folder_path: Optional[str] = None,
    ) -> Experiment:
        """Create a new experiment.

        Only available to EXPERIMENT_DESIGN plugins.

        Raises:
            PermissionException: If plugin type is ANALYSIS
            RepositoryException: On database errors
        """
        ...

    async def update(
        self,
        experiment_id: str,
        *,
        name: Optional[str] = None,
        status: Optional[str] = None,
        experiment_type: Optional[str] = None,
        method_id: Optional[str] = None,
        parent_experiment_id: Optional[str] = None,
        cell_line: Optional[str] = None,
        project: Optional[str] = None,
        notes: Optional[str] = None,
        tags: Optional[dict] = None,
        extraction_trigger: Optional[str] = None,
        output_folder_path: Optional[str] = None,
    ) -> Optional[Experiment]:
        """Update an experiment.

        Only available to EXPERIMENT_DESIGN plugins.

        Raises:
            PermissionException: If plugin type is ANALYSIS
            RepositoryException: On database errors
        """
        ...

    async def delete(self, experiment_id: str) -> bool:
        """Delete an experiment.

        Only available to EXPERIMENT_DESIGN plugins.

        Raises:
            PermissionException: If plugin type is ANALYSIS
            RepositoryException: On database errors
        """
        ...

    async def has_plugin_data(self, experiment_id: str) -> bool:
        """Check if experiment has plugin data attached."""
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
        experiment_id: str,
        plugin_id: str,
        data: dict[str, Any],
        schema_version: str = "1.0",
    ) -> PluginExperimentData:
        """Save or update experiment data for a plugin.

        Creates new data if none exists, or updates existing.
        Only one data record per experiment is allowed.

        Raises:
            ValidationException: If experiment_id or plugin_id invalid
            RepositoryException: On database errors
        """
        ...

    async def get_experiment_data(
        self, experiment_id: str
    ) -> Optional[PluginExperimentData]:
        """Get experiment data for an experiment.

        Returns:
            PluginExperimentData if exists, None otherwise
        """
        ...

    async def delete_experiment_data(self, experiment_id: str) -> bool:
        """Delete experiment data for an experiment.

        Returns:
            True if deleted, False if not found
        """
        ...

    async def save_analysis_result(
        self,
        experiment_id: str,
        plugin_id: str,
        result: dict[str, Any],
    ) -> PluginAnalysisResult:
        """Save or update analysis result.

        One result per experiment per plugin.

        Raises:
            ValidationException: If experiment_id or plugin_id invalid
            RepositoryException: On database errors
        """
        ...

    async def get_analysis_result(
        self,
        experiment_id: str,
        plugin_id: str,
    ) -> Optional[PluginAnalysisResult]:
        """Get analysis result for a specific plugin."""
        ...

    async def get_analysis_results(
        self, experiment_id: str
    ) -> list[PluginAnalysisResult]:
        """Get all analysis results for an experiment."""
        ...

    async def delete_analysis_result(
        self,
        experiment_id: str,
        plugin_id: str,
    ) -> bool:
        """Delete analysis result for a specific plugin.

        Returns:
            True if deleted, False if not found
        """
        ...


@runtime_checkable
class UserRepository(Protocol):
    """Repository for user data."""

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        ...

    async def get_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        ...

    async def list_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        """List all users with pagination."""
        ...


@runtime_checkable
class AnalysisArtifactRepository(Protocol):
    """
    Repository for analysis artifacts.

    Artifacts are output data from analysis plugins that need to be
    persisted (e.g., processed results, calibration curves, etc.)
    """

    async def create(
        self,
        plugin_name: str,
        artifact_type: str,
        data: dict,
        experiment_id: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> AnalysisArtifact:
        """Create a new analysis artifact."""
        ...

    async def get_by_id(self, artifact_id: str) -> Optional[AnalysisArtifact]:
        """Get artifact by ID."""
        ...

    async def list_for_experiment(
        self,
        experiment_id: str,
        plugin_name: Optional[str] = None,
        artifact_type: Optional[str] = None,
    ) -> list[AnalysisArtifact]:
        """List artifacts for an experiment."""
        ...

    async def list_for_plugin(
        self,
        plugin_name: str,
        artifact_type: Optional[str] = None,
        limit: int = 100,
    ) -> list[AnalysisArtifact]:
        """List artifacts for a plugin."""
        ...

    async def update(
        self,
        artifact_id: str,
        data: dict,
    ) -> Optional[AnalysisArtifact]:
        """Update artifact data."""
        ...

    async def delete(self, artifact_id: str) -> bool:
        """Delete an artifact by ID."""
        ...


@runtime_checkable
class MetadataTemplateRepository(Protocol):
    """Repository for experiment metadata templates."""

    async def get_by_id(self, template_id: str) -> Optional[MetadataTemplate]:
        """Get a metadata template by ID."""
        ...

    async def list_for_user(
        self,
        user_id: Optional[str] = None,
        include_defaults: bool = True,
    ) -> list[MetadataTemplate]:
        """List templates available to a user (their own + defaults)."""
        ...

    async def get_defaults(self) -> list[MetadataTemplate]:
        """Get all default templates."""
        ...


# Type alias for platform configuration
PlatformConfig = dict[str, Any]
