import pytest
from pathlib import Path

from sqlmodel import SQLModel, Field as SQLField

from mld_sdk.local_database import (
    LocalDatabase,
    LocalDatabaseConfig,
)
from mld_sdk.models import PluginMetadata
from mld_sdk.plugin import AnalysisPlugin
from mld_sdk.exceptions import ConfigurationException


# --- Fixtures ---


@pytest.fixture
def tmp_storage(tmp_path: Path) -> Path:
    return tmp_path / "test-plugin"


@pytest.fixture
def db(tmp_storage: Path) -> LocalDatabase:
    config = LocalDatabaseConfig(storage_dir=tmp_storage)
    ldb = LocalDatabase("test-plugin", config)
    ldb.initialize()
    yield ldb
    ldb.close()


# --- Config resolution ---


class TestLocalDatabaseConfig:
    def test_defaults(self):
        config = LocalDatabaseConfig()
        assert config.storage_dir is None
        assert config.db_filename == "data.db"
        assert config.echo_sql is False

    def test_custom_values(self, tmp_path: Path):
        config = LocalDatabaseConfig(
            storage_dir=tmp_path / "custom",
            db_filename="custom.db",
            echo_sql=True,
        )
        assert config.storage_dir == tmp_path / "custom"
        assert config.db_filename == "custom.db"
        assert config.echo_sql is True


class TestLocalDatabasePath:
    def test_default_path(self):
        ldb = LocalDatabase("my-plugin")
        expected = Path.home() / ".mld" / "plugins" / "my-plugin" / "data.db"
        assert ldb.db_path == expected

    def test_custom_storage_dir(self, tmp_path: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_path / "plugins" / "test")
        ldb = LocalDatabase("test", config)
        assert ldb.db_path == tmp_path / "plugins" / "test" / "data.db"

    def test_custom_filename(self, tmp_path: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_path, db_filename="store.sqlite3")
        ldb = LocalDatabase("test", config)
        assert ldb.db_path == tmp_path / "store.sqlite3"


# --- Lifecycle ---


class TestLocalDatabaseLifecycle:
    def test_not_initialized_by_default(self, tmp_storage: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        assert ldb.is_initialized is False

    def test_initialize_creates_db_file(self, tmp_storage: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        ldb.initialize()
        assert ldb.db_path.exists()
        assert ldb.is_initialized is True
        ldb.close()

    def test_initialize_creates_parent_dirs(self, tmp_path: Path):
        deep_path = tmp_path / "a" / "b" / "c"
        config = LocalDatabaseConfig(storage_dir=deep_path)
        ldb = LocalDatabase("test", config)
        ldb.initialize()
        assert deep_path.exists()
        ldb.close()

    def test_close_resets_state(self, tmp_storage: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        ldb.initialize()
        ldb.close()
        assert ldb.is_initialized is False

    def test_engine_before_init_raises(self, tmp_storage: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        with pytest.raises(ConfigurationException, match="not initialized"):
            _ = ldb.engine

    def test_double_close_is_safe(self, tmp_storage: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        ldb.initialize()
        ldb.close()
        ldb.close()  # should not raise


# --- High-level key-value API ---


class TestKeyValueAPI:
    def test_set_and_get(self, db: LocalDatabase):
        db.set("threshold", 0.05)
        assert db.get("threshold") == 0.05

    def test_get_missing_returns_default(self, db: LocalDatabase):
        assert db.get("missing") is None
        assert db.get("missing", default=42) == 42

    def test_set_overwrites(self, db: LocalDatabase):
        db.set("key", "v1")
        db.set("key", "v2")
        assert db.get("key") == "v2"

    def test_complex_json_values(self, db: LocalDatabase):
        data = {"nested": {"list": [1, 2, 3], "flag": True}}
        db.set("config", data)
        assert db.get("config") == data

    def test_namespace_isolation(self, db: LocalDatabase):
        db.set("key", "settings_val", namespace="settings")
        db.set("key", "cache_val", namespace="cache")
        assert db.get("key", namespace="settings") == "settings_val"
        assert db.get("key", namespace="cache") == "cache_val"
        assert db.get("key") is None  # default namespace

    def test_delete_existing(self, db: LocalDatabase):
        db.set("key", "value")
        assert db.delete("key") is True
        assert db.get("key") is None

    def test_delete_missing(self, db: LocalDatabase):
        assert db.delete("nonexistent") is False

    def test_list_keys(self, db: LocalDatabase):
        db.set("a", 1)
        db.set("b", 2)
        db.set("c", 3, namespace="other")
        keys = db.list_keys()
        assert sorted(keys) == ["a", "b"]

    def test_get_all(self, db: LocalDatabase):
        db.set("x", 10)
        db.set("y", 20)
        db.set("z", 30, namespace="other")
        result = db.get_all()
        assert result == {"x": 10, "y": 20}

    def test_clear_namespace(self, db: LocalDatabase):
        db.set("a", 1)
        db.set("b", 2)
        db.set("c", 3, namespace="other")
        count = db.clear(namespace="default")
        assert count == 2
        assert db.get("a") is None
        assert db.get("c", namespace="other") == 3

    def test_clear_all(self, db: LocalDatabase):
        db.set("a", 1)
        db.set("b", 2, namespace="other")
        count = db.clear()
        assert count == 2
        assert db.list_keys() == []
        assert db.list_keys(namespace="other") == []


# --- Low-level API (custom models) ---


class CustomReading(SQLModel, table=True):
    """Test model for custom table operations."""

    __tablename__ = "custom_reading"

    id: int | None = SQLField(default=None, primary_key=True)
    experiment_id: str = SQLField(index=True)
    intensity: float
    channel: str


class TestCustomModels:
    def test_create_custom_table(self, tmp_storage: Path):
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        ldb.initialize(models=[CustomReading])

        with ldb.get_session() as session:
            session.add(
                CustomReading(experiment_id="exp-1", intensity=42.5, channel="A")
            )
            session.commit()

        with ldb.get_session() as session:
            from sqlmodel import select

            results = session.exec(select(CustomReading)).all()
            assert len(results) == 1
            assert results[0].experiment_id == "exp-1"
            assert results[0].intensity == 42.5
            assert results[0].channel == "A"

        ldb.close()

    def test_custom_model_with_kv(self, tmp_storage: Path):
        """Custom models and built-in KV table coexist."""
        config = LocalDatabaseConfig(storage_dir=tmp_storage)
        ldb = LocalDatabase("test-plugin", config)
        ldb.initialize(models=[CustomReading])

        ldb.set("last_run", "2024-01-01")

        with ldb.get_session() as session:
            session.add(
                CustomReading(experiment_id="exp-2", intensity=10.0, channel="B")
            )
            session.commit()

        assert ldb.get("last_run") == "2024-01-01"

        with ldb.get_session() as session:
            from sqlmodel import select

            results = session.exec(select(CustomReading)).all()
            assert len(results) == 1

        ldb.close()


# --- Plugin integration ---


class TestPluginIntegration:
    def _make_plugin_class(self):
        class TestPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="integration-test",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            async def initialize(self, context=None):
                self._context = context
                self._setup_local_database()

            async def shutdown(self):
                self._teardown_local_database()

        return TestPlugin

    @pytest.mark.asyncio
    async def test_plugin_local_db_lifecycle(self, tmp_path: Path):
        TestPlugin = self._make_plugin_class()

        class ConfiguredPlugin(TestPlugin):
            def get_local_database_config(self):
                return LocalDatabaseConfig(storage_dir=tmp_path / "plugin-data")

        plugin = ConfiguredPlugin()
        assert plugin.local_db is None

        await plugin.initialize()
        assert plugin.local_db is not None
        assert plugin.local_db.is_initialized

        plugin.local_db.set("key", "value")
        assert plugin.local_db.get("key") == "value"

        await plugin.shutdown()
        assert plugin.local_db is None

    @pytest.mark.asyncio
    async def test_plugin_with_custom_models(self, tmp_path: Path):
        class ModelPlugin(AnalysisPlugin):
            @property
            def metadata(self) -> PluginMetadata:
                return PluginMetadata(
                    name="model-test",
                    version="1.0.0",
                    description="test",
                    analysis_type="test",
                    routes_prefix="/test",
                )

            def get_routers(self):
                return []

            def get_local_models(self):
                return [CustomReading]

            def get_local_database_config(self):
                return LocalDatabaseConfig(storage_dir=tmp_path / "model-data")

            async def initialize(self, context=None):
                self._context = context
                self._setup_local_database()

            async def shutdown(self):
                self._teardown_local_database()

        plugin = ModelPlugin()
        await plugin.initialize()

        with plugin.local_db.get_session() as session:
            session.add(
                CustomReading(experiment_id="exp-1", intensity=99.9, channel="C")
            )
            session.commit()

        with plugin.local_db.get_session() as session:
            from sqlmodel import select

            results = session.exec(select(CustomReading)).all()
            assert len(results) == 1

        await plugin.shutdown()

    def test_local_db_defaults_to_none(self):
        TestPlugin = self._make_plugin_class()
        plugin = TestPlugin()
        assert plugin.local_db is None
        assert plugin.get_local_models() == []
        assert plugin.get_local_database_config() is None

    @pytest.mark.asyncio
    async def test_setup_with_storage_dir_override(self, tmp_path: Path):
        """_setup_local_database(storage_dir=...) should override the storage directory."""
        TestPlugin = self._make_plugin_class()

        class ConfiguredPlugin(TestPlugin):
            def get_local_database_config(self):
                return LocalDatabaseConfig(storage_dir=tmp_path / "default-dir")

            async def initialize(self, context=None):
                self._context = context

        plugin = ConfiguredPlugin()
        await plugin.initialize()

        override_dir = tmp_path / "override-dir"
        plugin._setup_local_database(storage_dir=override_dir)

        assert plugin.local_db is not None
        assert plugin.local_db.is_initialized
        assert plugin.local_db.db_path == override_dir / "data.db"
        assert override_dir.exists()

        await plugin.shutdown()

    @pytest.mark.asyncio
    async def test_setup_is_idempotent(self, tmp_path: Path):
        """_setup_local_database() should be idempotent (calling twice doesn't reinitialize)."""
        TestPlugin = self._make_plugin_class()

        class ConfiguredPlugin(TestPlugin):
            def get_local_database_config(self):
                return LocalDatabaseConfig(storage_dir=tmp_path / "plugin-data")

        plugin = ConfiguredPlugin()
        await plugin.initialize()

        first_db = plugin.local_db
        assert first_db is not None
        assert first_db.is_initialized

        plugin._setup_local_database()

        second_db = plugin.local_db
        assert second_db is first_db
        assert second_db.is_initialized

        await plugin.shutdown()

    @pytest.mark.asyncio
    async def test_setup_without_args_backward_compatible(self, tmp_path: Path):
        """_setup_local_database() should work with no args (backward compatible)."""
        TestPlugin = self._make_plugin_class()

        class ConfiguredPlugin(TestPlugin):
            def get_local_database_config(self):
                return LocalDatabaseConfig(storage_dir=tmp_path / "plugin-data")

        plugin = ConfiguredPlugin()
        await plugin.initialize()

        assert plugin.local_db is not None
        assert plugin.local_db.is_initialized
        assert plugin.local_db.db_path == tmp_path / "plugin-data" / "data.db"

        await plugin.shutdown()
