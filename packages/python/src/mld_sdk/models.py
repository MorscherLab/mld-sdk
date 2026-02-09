"""
Data models for MLD plugin metadata and capabilities.
"""

from dataclasses import dataclass, field
from enum import Enum


class PluginType(str, Enum):
    """Plugin category determining database access permissions."""

    ANALYSIS = "analysis"
    EXPERIMENT_DESIGN = "experiment_design"


@dataclass
class PluginCapabilities:
    """Declares what platform features a plugin needs."""

    requires_auth: bool = False
    requires_database: bool = False
    requires_experiments: bool = False
    requires_local_database: bool = False
    # Optional integrations
    supports_experiment_linking: bool = False


@dataclass
class PluginMetadata:
    """Metadata describing an analysis plugin."""

    name: str
    version: str
    description: str
    analysis_type: str  # "metabolomics", "proteomics", "genomics", etc.
    routes_prefix: str  # "/rfa", "/proteo", etc.
    plugin_type: PluginType = PluginType.ANALYSIS
    capabilities: PluginCapabilities = field(default_factory=PluginCapabilities)

    # Optional metadata
    author: str = ""
    homepage: str = ""
    license: str = ""
