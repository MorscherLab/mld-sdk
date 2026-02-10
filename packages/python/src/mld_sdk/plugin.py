"""
Base plugin class for MLD analysis plugins.

This module provides the AnalysisPlugin base class that all plugins must inherit
from, as well as lifecycle hooks and health status interfaces.
"""

from abc import ABC, abstractmethod
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING, Any, AsyncGenerator, Optional

from mld_sdk.context import PlatformContext
from mld_sdk.models import PluginMetadata

if TYPE_CHECKING:
    from fastapi import APIRouter

    from mld_sdk.local_database import LocalDatabase


class HealthStatus(str, Enum):
    """Plugin health status values."""

    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


@dataclass(slots=True)
class PluginHealth:
    """Plugin health status report."""

    status: HealthStatus = HealthStatus.HEALTHY
    message: Optional[str] = None
    details: dict[str, Any] = field(default_factory=dict)
    checked_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict[str, Any]:
        """Convert to dict for API responses."""
        result = {
            "status": self.status.value,
            "checked_at": self.checked_at.isoformat(),
        }
        if self.message:
            result["message"] = self.message
        if self.details:
            result["details"] = self.details
        return result


@dataclass(slots=True)
class LifecycleHookResult:
    """Result from a lifecycle hook."""

    success: bool = True
    message: Optional[str] = None
    data: dict[str, Any] = field(default_factory=dict)


class AnalysisPlugin(ABC):
    """
    Abstract base class for analysis plugins.

    Plugins implement this interface to integrate with the MLD platform.
    They can run in two modes:
    - Standalone: No platform context, uses local SQLite for plugin tables
    - Integrated: Full platform context with PostgreSQL shared schema
    """

    _context: Optional[PlatformContext] = None
    _standalone_db: Optional["LocalDatabase"] = None

    @property
    @abstractmethod
    def metadata(self) -> PluginMetadata:
        """Return plugin metadata."""
        pass

    @abstractmethod
    def get_routers(self) -> list[tuple["APIRouter", str]]:
        """Return list of (router, sub_prefix) tuples."""
        pass

    @abstractmethod
    async def initialize(self, context: Optional[PlatformContext] = None) -> None:
        """Initialize the plugin."""
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        """Clean up plugin resources."""
        pass

    # --- Optional lifecycle hooks ---

    async def check_health(self) -> PluginHealth:
        """Check plugin health status."""
        return PluginHealth(status=HealthStatus.HEALTHY)

    async def on_before_experiment_save(
        self, experiment_id: int, data: dict[str, Any]
    ) -> LifecycleHookResult:
        """Called before experiment data is saved."""
        return LifecycleHookResult(success=True)

    async def on_after_experiment_save(
        self, experiment_id: int, data: dict[str, Any]
    ) -> None:
        """Called after experiment data is saved successfully."""
        pass

    async def on_experiment_status_change(
        self, experiment_id: int, old_status: str, new_status: str
    ) -> None:
        """Called when experiment status changes."""
        pass

    # --- Properties ---

    @property
    def context(self) -> Optional[PlatformContext]:
        """Get the platform context (None if standalone)."""
        return self._context

    @property
    def is_standalone(self) -> bool:
        """Check if running in standalone mode."""
        return self._context is None

    # --- Optional overrides ---

    def get_frontend_config(self) -> dict[str, Any]:
        """Return frontend configuration for this plugin."""
        return {
            "name": self.metadata.name,
            "version": self.metadata.version,
            "routePrefix": self.metadata.routes_prefix,
            "analysisType": self.metadata.analysis_type,
        }

    def get_frontend_dir(self) -> Optional[str]:
        """Return the path to the plugin's built frontend directory."""
        return None

    def get_compatible_platform_versions(self) -> Optional[tuple[str, str]]:
        """Return the range of compatible platform versions."""
        return None

    # --- Shared database support ---

    def get_shared_models(self) -> list[type]:
        """Return SQLModel/SQLAlchemy model classes for plugin tables.

        Override this to declare tables that will be created in the plugin's
        shared database schema (PostgreSQL when integrated, SQLite when standalone).

        Returns:
            List of model classes with __table__ attribute.
        """
        return []

    @asynccontextmanager
    async def get_plugin_db_session(self) -> AsyncGenerator[Any, None]:
        """Unified DB access -- PostgreSQL (platform) or SQLite (standalone).

        Yields an async session. When running integrated, delegates to the
        platform's shared schema session. When standalone, uses local SQLite.
        """
        if self._context:
            async with self._context.get_shared_db_session() as session:
                yield session
        else:
            if self._standalone_db is None:
                raise RuntimeError(
                    "Standalone database not initialized. "
                    "Call _setup_standalone_db() in initialize()."
                )
            async with self._standalone_db.get_async_session() as session:
                yield session

    # --- Standalone database (SQLite fallback) ---

    @property
    def standalone_db(self) -> Optional["LocalDatabase"]:
        """Get the standalone database instance, or None if not set up."""
        return self._standalone_db

    def _setup_standalone_db(self, storage_dir: "Any | None" = None) -> None:
        """Initialize the standalone SQLite database.

        Args:
            storage_dir: Override the storage directory for the database.
        """
        if self._standalone_db is not None and self._standalone_db.is_initialized:
            return

        from mld_sdk.local_database import LocalDatabase, LocalDatabaseConfig
        from pathlib import Path

        config = LocalDatabaseConfig()
        if storage_dir is not None:
            config.storage_dir = Path(storage_dir) if not isinstance(storage_dir, Path) else storage_dir
        self._standalone_db = LocalDatabase(self.metadata.name, config)
        self._standalone_db.initialize(models=self.get_shared_models())

    def _teardown_standalone_db(self) -> None:
        """Close the standalone database."""
        if self._standalone_db is not None:
            self._standalone_db.close()
            self._standalone_db = None

    # --- Backward compatibility ---

    @property
    def local_db(self) -> Optional["LocalDatabase"]:
        """Backward compat: alias for standalone_db."""
        return self._standalone_db

    def get_local_models(self) -> list[type]:
        """Backward compat: alias for get_shared_models()."""
        return self.get_shared_models()

    def _setup_local_database(self, storage_dir: "Any | None" = None) -> None:
        """Backward compat: alias for _setup_standalone_db()."""
        self._setup_standalone_db(storage_dir)

    def _teardown_local_database(self) -> None:
        """Backward compat: alias for _teardown_standalone_db()."""
        self._teardown_standalone_db()
