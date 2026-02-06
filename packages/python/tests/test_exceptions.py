import pytest
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


class TestPluginException:
    def test_basic(self):
        exc = PluginException("something failed")
        assert str(exc) == "something failed"
        assert exc.message == "something failed"
        assert exc.code == "PLUGIN_ERROR"
        assert exc.details == {}

    def test_custom_code_and_details(self):
        exc = PluginException("fail", code="CUSTOM", details={"key": "val"})
        assert exc.code == "CUSTOM"
        assert exc.details == {"key": "val"}

    def test_to_dict(self):
        exc = PluginException("fail", details={"ctx": 1})
        d = exc.to_dict()
        assert d["error"] == "PLUGIN_ERROR"
        assert d["message"] == "fail"
        assert d["details"] == {"ctx": 1}

    def test_to_dict_no_details(self):
        exc = PluginException("fail")
        d = exc.to_dict()
        assert "details" not in d

    def test_is_exception(self):
        exc = PluginException("test")
        assert isinstance(exc, Exception)


class TestValidationException:
    def test_basic(self):
        exc = ValidationException("invalid input")
        assert exc.code == "VALIDATION_ERROR"
        assert exc.field is None
        assert exc.value is None

    def test_with_field_and_value(self):
        exc = ValidationException("bad", field="email", value="not-an-email")
        assert exc.field == "email"
        assert exc.value == "not-an-email"
        assert exc.details["field"] == "email"
        assert exc.details["value"] == "not-an-email"

    def test_value_truncation(self):
        long_value = "x" * 200
        exc = ValidationException("bad", value=long_value)
        assert len(exc.details["value"]) == 103  # 100 + "..."
        assert exc.details["value"].endswith("...")

    def test_short_value_not_truncated(self):
        exc = ValidationException("bad", value="short")
        assert exc.details["value"] == "short"

    def test_inherits_plugin_exception(self):
        exc = ValidationException("test")
        assert isinstance(exc, PluginException)


class TestPermissionException:
    def test_basic(self):
        exc = PermissionException("denied")
        assert exc.code == "PERMISSION_DENIED"
        assert exc.required_permission is None

    def test_with_permission(self):
        exc = PermissionException("denied", required_permission="admin:write")
        assert exc.required_permission == "admin:write"
        assert exc.details["required_permission"] == "admin:write"


class TestConfigurationException:
    def test_basic(self):
        exc = ConfigurationException("bad config")
        assert exc.code == "CONFIGURATION_ERROR"

    def test_with_config_key(self):
        exc = ConfigurationException("missing", config_key="api_url")
        assert exc.config_key == "api_url"
        assert exc.details["config_key"] == "api_url"


class TestRepositoryException:
    def test_basic(self):
        exc = RepositoryException("db error")
        assert exc.code == "REPOSITORY_ERROR"

    def test_with_operation_and_entity(self):
        exc = RepositoryException("fail", operation="save", entity="experiment")
        assert exc.operation == "save"
        assert exc.entity == "experiment"
        assert exc.details["operation"] == "save"
        assert exc.details["entity"] == "experiment"


class TestNotFoundException:
    def test_code(self):
        exc = NotFoundException("not found")
        assert exc.code == "NOT_FOUND"

    def test_inherits_repository_exception(self):
        exc = NotFoundException("not found")
        assert isinstance(exc, RepositoryException)

    def test_with_entity_id(self):
        exc = NotFoundException("not found", entity="experiment", entity_id="abc-123")
        assert exc.entity_id == "abc-123"
        assert exc.entity == "experiment"
        assert exc.details["entity_id"] == "abc-123"


class TestConflictException:
    def test_code(self):
        exc = ConflictException("conflict")
        assert exc.code == "CONFLICT"

    def test_inherits_repository_exception(self):
        exc = ConflictException("conflict")
        assert isinstance(exc, RepositoryException)

    def test_with_conflict_field(self):
        exc = ConflictException("dup", entity="user", conflict_field="username")
        assert exc.conflict_field == "username"


class TestPluginLifecycleException:
    def test_basic(self):
        exc = PluginLifecycleException("init failed")
        assert exc.code == "LIFECYCLE_ERROR"

    def test_with_phase_and_plugin(self):
        exc = PluginLifecycleException(
            "failed", phase="initialize", plugin_name="my-plugin"
        )
        assert exc.phase == "initialize"
        assert exc.plugin_name == "my-plugin"
        assert exc.details["phase"] == "initialize"
        assert exc.details["plugin_name"] == "my-plugin"


class TestExceptionHierarchy:
    def test_all_inherit_from_plugin_exception(self):
        exceptions = [
            ValidationException("test"),
            PermissionException("test"),
            ConfigurationException("test"),
            RepositoryException("test"),
            NotFoundException("test"),
            ConflictException("test"),
            PluginLifecycleException("test"),
        ]
        for exc in exceptions:
            assert isinstance(exc, PluginException)

    def test_not_found_and_conflict_inherit_repository(self):
        assert isinstance(NotFoundException("test"), RepositoryException)
        assert isinstance(ConflictException("test"), RepositoryException)
