"""
MLD Plugin SDK

SDK for building analysis plugins that integrate with the MLD platform.

Example usage:
    from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities

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

        async def shutdown(self):
            pass

Exception handling:
    from mld_sdk.exceptions import ValidationException, NotFoundException

    async def get_experiment(self, experiment_id: str):
        experiment = await self.repo.get_by_id(experiment_id)
        if not experiment:
            raise NotFoundException(f"Experiment {experiment_id} not found")
        return experiment

Repository access:
    from mld_sdk.repositories import ExperimentRepository, PluginDataRepository

    # Type annotations for IDE support
    def setup_repos(self, context: PlatformContext):
        self.experiments: ExperimentRepository | None = context.get_experiment_repository()
        self.plugin_data: PluginDataRepository | None = context.get_plugin_data_repository()
"""

from mld_sdk.plugin import (
    AnalysisPlugin,
    HealthStatus,
    PluginHealth,
    LifecycleHookResult,
)
from mld_sdk.models import PluginMetadata, PluginCapabilities, PluginType
from mld_sdk.context import PlatformContext

# Exceptions
from mld_sdk.exceptions import (
    PluginException,
    ValidationException,
    PermissionException,
    ConfigurationException,
    RepositoryException,
    NotFoundException,
    ConflictException,
    PluginLifecycleException,
)

# Local database (optional dependency)
from mld_sdk.local_database import LocalDatabase, LocalDatabaseConfig

# Repository protocols and data models
from mld_sdk.repositories import (
    # Data models
    Experiment,
    PluginExperimentData,
    PluginAnalysisResult,
    User,
    AnalysisArtifact,
    MetadataTemplate,
    # Repository protocols
    ExperimentRepository,
    PluginDataRepository,
    UserRepository,
    AnalysisArtifactRepository,
    MetadataTemplateRepository,
    PlatformConfig,
)

__version__ = "0.3.2"

__all__ = [
    # Core plugin classes
    "AnalysisPlugin",
    "PluginMetadata",
    "PluginCapabilities",
    "PluginType",
    "PlatformContext",
    # Lifecycle types
    "HealthStatus",
    "PluginHealth",
    "LifecycleHookResult",
    # Exceptions
    "PluginException",
    "ValidationException",
    "PermissionException",
    "ConfigurationException",
    "RepositoryException",
    "NotFoundException",
    "ConflictException",
    "PluginLifecycleException",
    # Local database
    "LocalDatabase",
    "LocalDatabaseConfig",
    # Data models
    "Experiment",
    "PluginExperimentData",
    "PluginAnalysisResult",
    "User",
    "AnalysisArtifact",
    "MetadataTemplate",
    # Repository protocols
    "ExperimentRepository",
    "PluginDataRepository",
    "UserRepository",
    "AnalysisArtifactRepository",
    "MetadataTemplateRepository",
    "PlatformConfig",
]
