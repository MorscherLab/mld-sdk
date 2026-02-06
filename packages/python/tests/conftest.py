import pytest
from mld_sdk.models import PluginMetadata, PluginCapabilities, PluginType


@pytest.fixture
def sample_metadata() -> PluginMetadata:
    return PluginMetadata(
        name="test-plugin",
        version="1.0.0",
        description="A test plugin",
        analysis_type="metabolomics",
        routes_prefix="/test",
    )


@pytest.fixture
def sample_capabilities() -> PluginCapabilities:
    return PluginCapabilities(
        requires_auth=True,
        requires_database=True,
        requires_experiments=True,
    )
