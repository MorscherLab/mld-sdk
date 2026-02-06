import pytest
from datetime import datetime, timezone
from mld_sdk.plugin import (
    AnalysisPlugin,
    HealthStatus,
    PluginHealth,
    LifecycleHookResult,
)
from mld_sdk.models import PluginMetadata


class TestHealthStatus:
    def test_values(self):
        assert HealthStatus.HEALTHY == "healthy"
        assert HealthStatus.DEGRADED == "degraded"
        assert HealthStatus.UNHEALTHY == "unhealthy"
        assert HealthStatus.UNKNOWN == "unknown"

    def test_is_str(self):
        assert isinstance(HealthStatus.HEALTHY, str)


class TestPluginHealth:
    def test_defaults(self):
        health = PluginHealth()
        assert health.status == HealthStatus.HEALTHY
        assert health.message is None
        assert health.details == {}
        assert isinstance(health.checked_at, datetime)

    def test_checked_at_is_utc(self):
        health = PluginHealth()
        assert health.checked_at.tzinfo == timezone.utc

    def test_custom_status(self):
        health = PluginHealth(
            status=HealthStatus.DEGRADED,
            message="Cache down",
            details={"cache": "unreachable"},
        )
        assert health.status == HealthStatus.DEGRADED
        assert health.message == "Cache down"
        assert health.details["cache"] == "unreachable"

    def test_to_dict_minimal(self):
        health = PluginHealth()
        d = health.to_dict()
        assert d["status"] == "healthy"
        assert "checked_at" in d
        assert "message" not in d
        assert "details" not in d

    def test_to_dict_full(self):
        health = PluginHealth(
            status=HealthStatus.UNHEALTHY,
            message="DB down",
            details={"db": "timeout"},
        )
        d = health.to_dict()
        assert d["status"] == "unhealthy"
        assert d["message"] == "DB down"
        assert d["details"]["db"] == "timeout"


class TestLifecycleHookResult:
    def test_defaults(self):
        result = LifecycleHookResult()
        assert result.success is True
        assert result.message is None
        assert result.data == {}

    def test_failure(self):
        result = LifecycleHookResult(
            success=False,
            message="Validation failed",
            data={"errors": ["field required"]},
        )
        assert result.success is False
        assert result.message == "Validation failed"
        assert result.data["errors"] == ["field required"]


class TestAnalysisPlugin:
    def test_cannot_instantiate_directly(self):
        with pytest.raises(TypeError):
            AnalysisPlugin()

    def test_must_implement_abstract_methods(self):
        class IncompletePlugin(AnalysisPlugin):
            pass

        with pytest.raises(TypeError):
            IncompletePlugin()

    def test_concrete_plugin(self):
        class ConcretePlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="concrete",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context

            async def shutdown(self):
                pass

        plugin = ConcretePlugin()
        assert plugin.metadata.name == "concrete"
        assert plugin.is_standalone is True
        assert plugin.context is None

    @pytest.mark.asyncio
    async def test_default_check_health(self):
        class MinimalPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="minimal",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context

            async def shutdown(self):
                pass

        plugin = MinimalPlugin()
        health = await plugin.check_health()
        assert health.status == HealthStatus.HEALTHY

    @pytest.mark.asyncio
    async def test_default_lifecycle_hooks(self):
        class MinimalPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="minimal",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context

            async def shutdown(self):
                pass

        plugin = MinimalPlugin()
        result = await plugin.on_before_experiment_save("exp-1", {})
        assert result.success is True

        # on_after_experiment_save and on_experiment_status_change should not raise
        await plugin.on_after_experiment_save("exp-1", {})
        await plugin.on_experiment_status_change("exp-1", "draft", "active")

    def test_get_frontend_config(self):
        class ConfigPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="config-test",
                    version="2.0.0",
                    description="test",
                    analysis_type="metabolomics",
                    routes_prefix="/config",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context

            async def shutdown(self):
                pass

        plugin = ConfigPlugin()
        config = plugin.get_frontend_config()
        assert config["name"] == "config-test"
        assert config["version"] == "2.0.0"
        assert config["routePrefix"] == "/config"
        assert config["analysisType"] == "metabolomics"

    def test_get_frontend_dir_default(self):
        class MinimalPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="minimal",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context

            async def shutdown(self):
                pass

        plugin = MinimalPlugin()
        assert plugin.get_frontend_dir() is None

    def test_get_compatible_platform_versions_default(self):
        class MinimalPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="minimal",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context

            async def shutdown(self):
                pass

        plugin = MinimalPlugin()
        assert plugin.get_compatible_platform_versions() is None
