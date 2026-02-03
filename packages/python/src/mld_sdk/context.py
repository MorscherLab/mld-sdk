"""
Platform context interface for plugins.

Plugins receive a PlatformContext when running integrated with the platform,
which provides access to platform services like auth, experiments, etc.

Example:
    class MyPlugin(AnalysisPlugin):
        async def initialize(self, context: Optional[PlatformContext] = None) -> None:
            self._context = context
            if context:
                # Running integrated - access platform services
                self.experiment_repo = context.get_experiment_repository()
            else:
                # Running standalone - no platform services

        async def get_experiment(self, experiment_id: str) -> Optional[Experiment]:
            if self.experiment_repo is None:
                raise ConfigurationException("Experiment repository not available")
            return await self.experiment_repo.get_by_id(experiment_id)
"""

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Callable, Optional

from mld_sdk.repositories import (
    AnalysisArtifactRepository,
    CompoundListRepository,
    ExperimentRepository,
    MetadataTemplateRepository,
    PlatformConfig,
    PluginDataRepository,
    TracingPresetRepository,
    UserRepository,
)

if TYPE_CHECKING:
    pass


class PlatformContext(ABC):
    """
    Context provided by the platform to plugins.

    When running in standalone mode, context will be None.
    When running as a plugin, this provides access to platform services.

    Repository availability depends on plugin type and platform configuration:
    - ANALYSIS plugins get read-only experiment access
    - EXPERIMENT_DESIGN plugins get full CRUD access
    - Some repositories may be None in "none" database mode

    Example:
        # In your plugin
        async def analyze(self, experiment_id: str) -> dict:
            experiment_repo = self.context.get_experiment_repository()
            if experiment_repo is None:
                raise ConfigurationException("Experiments not available")

            experiment = await experiment_repo.get_by_id(experiment_id)
            if experiment is None:
                raise NotFoundException("Experiment not found", entity="experiment")

            # Perform analysis...
            result = await self.run_analysis(experiment)

            # Save result
            data_repo = self.context.get_plugin_data_repository()
            await data_repo.save_analysis_result(
                experiment_id=experiment_id,
                plugin_id=self.metadata.name,
                result=result,
            )

            return result
    """

    @property
    @abstractmethod
    def is_authenticated(self) -> bool:
        """Check if the current request is authenticated.

        Returns:
            True if user is authenticated, False otherwise.

        Note:
            This reflects the platform auth state, not plugin-specific auth.
            In dev mode (devMode: true), this may always return False.
        """
        pass

    @abstractmethod
    def get_current_user_dependency(self) -> Callable:
        """Get FastAPI dependency for current user.

        Returns:
            FastAPI dependency function that returns current user dict.

        Usage:
            @router.get("/protected")
            async def protected_route(
                user: dict = Depends(context.get_current_user_dependency())
            ):
                return {"user": user["username"]}

        Raises:
            HTTPException(401): If user not authenticated (when auth enabled)
        """
        pass

    @abstractmethod
    def get_optional_user_dependency(self) -> Callable:
        """Get FastAPI dependency for optional user.

        Returns:
            FastAPI dependency function that returns user dict or None.

        Usage:
            @router.get("/public")
            async def public_route(
                user: dict | None = Depends(context.get_optional_user_dependency())
            ):
                if user:
                    return {"greeting": f"Hello, {user['username']}"}
                return {"greeting": "Hello, guest"}
        """
        pass

    @abstractmethod
    def get_user_repository(self) -> Optional[UserRepository]:
        """Get the user repository for user lookups.

        Returns:
            UserRepository instance, or None if not available.

        Note:
            Returns None in "none" database mode.

        Raises:
            RepositoryException: On database errors during operations.
        """
        pass

    @abstractmethod
    def get_experiment_repository(self) -> Optional[ExperimentRepository]:
        """Get the experiment repository for experiment management.

        Returns:
            ExperimentRepository instance, or None if not available.

        Note:
            - For ANALYSIS plugins: Returns read-only wrapper that blocks
              create/update/delete operations.
            - For EXPERIMENT_DESIGN plugins: Returns full access.
            - Returns None in "none" database mode.

        Raises:
            RepositoryException: On database errors during operations.
            PermissionException: On write operations for ANALYSIS plugins.
        """
        pass

    @abstractmethod
    def get_compound_list_repository(self) -> Optional[CompoundListRepository]:
        """Get the compound list repository.

        Returns:
            CompoundListRepository instance, or None if not available.

        Note:
            Returns None in "none" database mode.
        """
        pass

    @abstractmethod
    def get_plugin_data_repository(self) -> Optional[PluginDataRepository]:
        """Get the plugin data repository for experiment data and analysis results.

        Returns:
            PluginDataRepository instance, or None if not available.

        Note:
            This repository is available to all plugin types.
            - EXPERIMENT_DESIGN plugins: Save experiment data
            - ANALYSIS plugins: Read experiment data, save analysis results

        Raises:
            RepositoryException: On database errors during operations.
        """
        pass

    @abstractmethod
    def get_metadata_template_repository(self) -> Optional[MetadataTemplateRepository]:
        """Get the metadata template repository.

        Returns:
            MetadataTemplateRepository instance, or None if not available.

        Note:
            Returns None in "none" database mode.
        """
        pass

    @abstractmethod
    def get_tracing_preset_repository(self) -> Optional[TracingPresetRepository]:
        """Get the tracing preset repository.

        Returns:
            TracingPresetRepository instance, or None if not available.

        Note:
            Returns None in "none" database mode.
        """
        pass

    @abstractmethod
    def get_config(self) -> PlatformConfig:
        """Get platform configuration.

        Returns:
            Dict containing platform settings. Structure varies by platform
            version, but typically includes:
            - auth: Authentication settings
            - database: Database configuration
            - features: Enabled feature flags
            - plugins: Plugin-specific settings
        """
        pass

    @abstractmethod
    def get_analysis_artifact_repository(self) -> Optional[AnalysisArtifactRepository]:
        """Get repository for storing analysis artifacts.

        Returns:
            AnalysisArtifactRepository instance, or None if not available.

        Note:
            Available to all plugins. Use for persisting analysis outputs
            like processed results, calibration curves, etc.

        Raises:
            RepositoryException: On database errors during operations.
        """
        pass
