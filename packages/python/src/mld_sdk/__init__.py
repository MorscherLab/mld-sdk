"""
MLD Plugin SDK

SDK for building analysis plugins that integrate with the MLD platform.
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
    UserPluginRole,
    # Repository protocols
    ExperimentRepository,
    PluginDataRepository,
    PluginRoleRepository,
    UserRepository,
    PlatformConfig,
)

try:
    from importlib.metadata import version as _get_version

    __version__ = _get_version("mld-sdk")
except Exception:
    __version__ = "0.0.0"

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
    "UserPluginRole",
    # Repository protocols
    "ExperimentRepository",
    "PluginDataRepository",
    "PluginRoleRepository",
    "UserRepository",
    "PlatformConfig",
]
