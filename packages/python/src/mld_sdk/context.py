"""
Platform context interface for plugins.

Plugins receive a PlatformContext when running integrated with the platform,
which provides access to platform services like auth, experiments, etc.
"""

from abc import ABC, abstractmethod
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator, Callable, Optional

from mld_sdk.repositories import (
    ExperimentRepository,
    PlatformConfig,
    PluginDataRepository,
    PluginRoleRepository,
    UserRepository,
)


class PlatformContext(ABC):
    """
    Context provided by the platform to plugins.

    When running in standalone mode, context will be None.
    When running as a plugin, this provides access to platform services.

    Repository availability depends on plugin type and platform configuration:
    - ANALYSIS plugins get read-only experiment access
    - EXPERIMENT_DESIGN plugins get full CRUD access
    """

    @property
    @abstractmethod
    def is_authenticated(self) -> bool:
        """Check if the current request is authenticated."""
        pass

    @abstractmethod
    def get_current_user_dependency(self) -> Callable:
        """Get FastAPI dependency for current user."""
        pass

    @abstractmethod
    def get_optional_user_dependency(self) -> Callable:
        """Get FastAPI dependency for optional user."""
        pass

    @abstractmethod
    def get_user_repository(self) -> Optional[UserRepository]:
        """Get the user repository for user lookups."""
        pass

    @abstractmethod
    def get_experiment_repository(self) -> Optional[ExperimentRepository]:
        """Get the experiment repository for experiment management.

        For ANALYSIS plugins: Returns read-only wrapper.
        For EXPERIMENT_DESIGN plugins: Returns full access.
        """
        pass

    @abstractmethod
    def get_plugin_data_repository(self) -> Optional[PluginDataRepository]:
        """Get the plugin data repository for experiment data and analysis results."""
        pass

    @abstractmethod
    def get_plugin_role_repository(self) -> Optional["PluginRoleRepository"]:
        """Get the plugin role repository for plugin-scoped user roles."""

    @abstractmethod
    def require_plugin_role(self, *allowed_roles: str) -> Any:
        """Return a FastAPI Depends() that checks plugin role for current plugin.

        Platform admins automatically bypass plugin role checks.

        Usage::

            @router.get("/admin/settings")
            async def settings(user=context.require_plugin_role("admin")):
                ...
        """

    @abstractmethod
    def get_config(self) -> PlatformConfig:
        """Get platform configuration."""
        pass

    @abstractmethod
    @asynccontextmanager
    async def get_shared_db_session(self) -> AsyncGenerator[Any, None]:
        """Get an async database session scoped to the plugin's schema.

        Used by plugins that declare `requires_shared_database=True`.
        The session's search_path is set to the plugin's schema so
        plugin tables are accessible without schema-qualifying names.

        Yields:
            AsyncSession bound to the plugin's Postgres schema.
        """
        yield  # type: ignore[misc]
