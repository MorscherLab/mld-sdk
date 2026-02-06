from mld_sdk.models import PluginMetadata, PluginCapabilities, PluginType


class TestPluginType:
    def test_analysis_value(self):
        assert PluginType.ANALYSIS == "analysis"

    def test_experiment_design_value(self):
        assert PluginType.EXPERIMENT_DESIGN == "experiment_design"

    def test_is_str_subclass(self):
        assert isinstance(PluginType.ANALYSIS, str)


class TestPluginCapabilities:
    def test_defaults(self):
        caps = PluginCapabilities()
        assert caps.requires_auth is False
        assert caps.requires_database is False
        assert caps.requires_experiments is False
        assert caps.supports_experiment_linking is False

    def test_custom_values(self, sample_capabilities: PluginCapabilities):
        assert sample_capabilities.requires_auth is True
        assert sample_capabilities.requires_database is True
        assert sample_capabilities.requires_experiments is True


class TestPluginMetadata:
    def test_required_fields(self, sample_metadata: PluginMetadata):
        assert sample_metadata.name == "test-plugin"
        assert sample_metadata.version == "1.0.0"
        assert sample_metadata.description == "A test plugin"
        assert sample_metadata.analysis_type == "metabolomics"
        assert sample_metadata.routes_prefix == "/test"

    def test_default_plugin_type(self, sample_metadata: PluginMetadata):
        assert sample_metadata.plugin_type == PluginType.ANALYSIS

    def test_default_capabilities(self, sample_metadata: PluginMetadata):
        assert isinstance(sample_metadata.capabilities, PluginCapabilities)
        assert sample_metadata.capabilities.requires_auth is False

    def test_optional_fields_default_empty(self, sample_metadata: PluginMetadata):
        assert sample_metadata.author == ""
        assert sample_metadata.homepage == ""
        assert sample_metadata.license == ""

    def test_experiment_design_type(self):
        metadata = PluginMetadata(
            name="design-plugin",
            version="1.0.0",
            description="Design plugin",
            analysis_type="design",
            routes_prefix="/design",
            plugin_type=PluginType.EXPERIMENT_DESIGN,
        )
        assert metadata.plugin_type == PluginType.EXPERIMENT_DESIGN
