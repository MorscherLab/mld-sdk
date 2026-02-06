"""
Base plugin class for MLD analysis plugins.

This module provides the AnalysisPlugin base class that all plugins must inherit
from, as well as lifecycle hooks and health status interfaces.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING, Any, Optional

from mld_sdk.context import PlatformContext
from mld_sdk.models import PluginMetadata

if TYPE_CHECKING:
    from fastapi import APIRouter


class HealthStatus(str, Enum):
    """Plugin health status values."""

    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


@dataclass
class PluginHealth:
    """
    Plugin health status report.

    Returned by check_health() to indicate the plugin's operational state.
    The platform uses this for monitoring and load balancing decisions.

    Example:
        async def check_health(self) -> PluginHealth:
            try:
                # Check critical dependencies
                if not self.db_connection.is_alive():
                    return PluginHealth(
                        status=HealthStatus.UNHEALTHY,
                        message="Database connection lost",
                        details={"db_host": self.db_host},
                    )

                # Check non-critical services
                cache_ok = await self.check_cache()
                if not cache_ok:
                    return PluginHealth(
                        status=HealthStatus.DEGRADED,
                        message="Cache unavailable, performance may be reduced",
                    )

                return PluginHealth(status=HealthStatus.HEALTHY)
            except Exception as e:
                return PluginHealth(
                    status=HealthStatus.UNKNOWN,
                    message=f"Health check failed: {e}",
                )
    """

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


@dataclass
class LifecycleHookResult:
    """
    Result from a lifecycle hook.

    Hooks can return success/failure with optional message and data.

    Example:
        async def on_before_experiment_save(
            self, experiment_id: str, data: dict
        ) -> LifecycleHookResult:
            # Validate experiment data
            errors = self.validate_schema(data)
            if errors:
                return LifecycleHookResult(
                    success=False,
                    message="Validation failed",
                    data={"errors": errors},
                )
            return LifecycleHookResult(success=True)
    """

    success: bool = True
    message: Optional[str] = None
    data: dict[str, Any] = field(default_factory=dict)


class AnalysisPlugin(ABC):
    """
    Abstract base class for analysis plugins.

    Plugins implement this interface to integrate with the MLD platform.
    They can run in two modes:
    - Standalone: No platform context, minimal features
    - Integrated: Full platform context with auth, experiments, etc.

    Lifecycle:
        1. Plugin discovered via entry point or path
        2. Plugin instantiated (constructor called)
        3. initialize(context) called - set up resources
        4. Plugin serves requests
        5. shutdown() called on platform stop

    Example:
        class MyPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="My Plugin",
                    version="1.0.0",
                    description="My analysis plugin",
                    analysis_type="metabolomics",
                    routes_prefix="/my-plugin",
                )

            def get_routers(self):
                return [(my_router, "")]

            async def initialize(self, context=None):
                self._context = context
                # Set up database connections, caches, etc.

            async def shutdown(self):
                # Clean up resources
                pass

            async def check_health(self) -> PluginHealth:
                return PluginHealth(status=HealthStatus.HEALTHY)
    """

    _context: Optional[PlatformContext] = None

    @property
    @abstractmethod
    def metadata(self) -> PluginMetadata:
        """Return plugin metadata.

        Must return a PluginMetadata instance describing the plugin.
        This is called during plugin discovery.
        """
        pass

    @abstractmethod
    def get_routers(self) -> list[tuple["APIRouter", str]]:
        """
        Return list of (router, sub_prefix) tuples.

        Each router is mounted at {routes_prefix}{sub_prefix}.

        Example:
            return [
                (extraction_router, "/extraction"),  # /my-plugin/extraction
                (charts_router, "/charts"),          # /my-plugin/charts
                (api_router, ""),                    # /my-plugin/
            ]

        Returns:
            List of (APIRouter, prefix) tuples
        """
        pass

    @abstractmethod
    async def initialize(self, context: Optional[PlatformContext] = None) -> None:
        """
        Initialize the plugin.

        Called once when the plugin is loaded. Use this to:
        - Store the platform context
        - Set up database connections
        - Initialize caches
        - Start background tasks

        Args:
            context: Platform context if running integrated, None if standalone.

        Raises:
            PluginLifecycleException: If initialization fails fatally.
                The plugin will not be loaded if this raises.

        Example:
            async def initialize(self, context=None):
                self._context = context
                if context:
                    self.experiment_repo = context.get_experiment_repository()
                    self.data_repo = context.get_plugin_data_repository()
        """
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        """
        Clean up plugin resources.

        Called when the platform is shutting down. Use this to:
        - Close database connections
        - Stop background tasks
        - Flush caches

        This should not raise exceptions - log errors instead.

        Example:
            async def shutdown(self):
                if self.db_pool:
                    await self.db_pool.close()
                if self.cache:
                    await self.cache.flush()
        """
        pass

    # --- Optional lifecycle hooks ---

    async def check_health(self) -> PluginHealth:
        """
        Check plugin health status.

        Override this to report plugin health to the platform.
        Called periodically by the platform health check system.

        Returns:
            PluginHealth with status and optional details.

        Default implementation returns HEALTHY.
        """
        return PluginHealth(status=HealthStatus.HEALTHY)

    async def on_before_experiment_save(
        self, experiment_id: str, data: dict[str, Any]
    ) -> LifecycleHookResult:
        """
        Called before experiment data is saved.

        Use this hook to:
        - Validate experiment data against plugin schema
        - Transform or enrich data before save
        - Reject invalid data

        Args:
            experiment_id: ID of the experiment
            data: Data being saved (can be modified in place)

        Returns:
            LifecycleHookResult with success=False to prevent save.

        Default implementation allows all saves.
        """
        return LifecycleHookResult(success=True)

    async def on_after_experiment_save(
        self, experiment_id: str, data: dict[str, Any]
    ) -> None:
        """
        Called after experiment data is saved successfully.

        Use this hook to:
        - Trigger follow-up processing
        - Update caches
        - Send notifications

        Args:
            experiment_id: ID of the experiment
            data: Data that was saved

        Default implementation does nothing.
        """
        pass

    async def on_experiment_status_change(
        self, experiment_id: str, old_status: str, new_status: str
    ) -> None:
        """
        Called when experiment status changes.

        Use this hook to:
        - Trigger analysis when status becomes "completed"
        - Update UI state
        - Log status transitions

        Args:
            experiment_id: ID of the experiment
            old_status: Previous status
            new_status: New status

        Default implementation does nothing.
        """
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
        """
        Return frontend configuration for this plugin.

        Override to provide custom frontend config.
        This is sent to the plugin frontend on load.

        Default returns basic metadata.
        """
        return {
            "name": self.metadata.name,
            "version": self.metadata.version,
            "routePrefix": self.metadata.routes_prefix,
            "analysisType": self.metadata.analysis_type,
        }

    def get_frontend_dir(self) -> Optional[str]:
        """
        Return the path to the plugin's built frontend directory.

        Override this method to provide the path to your plugin's
        built frontend files (typically the 'dist' folder from Vite/webpack).

        The platform will serve these files under the plugin's route prefix.

        Returns:
            Path to frontend dist directory, or None if no frontend.

        Example:
            def get_frontend_dir(self) -> Optional[str]:
                from pathlib import Path
                return str(Path(__file__).parent.parent / "frontend" / "dist")
        """
        return None

    def get_compatible_platform_versions(self) -> Optional[tuple[str, str]]:
        """
        Return the range of compatible platform versions.

        Override to specify version constraints. The platform will
        warn if versions are incompatible.

        Returns:
            Tuple of (min_version, max_version) or None for no constraints.
            Use "*" for unbounded min or max.

        Example:
            def get_compatible_platform_versions(self):
                return ("1.0.0", "2.0.0")  # Compatible with 1.x
        """
        return None
