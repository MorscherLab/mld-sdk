"""
Local SQLite database for MLD plugins.

Provides per-plugin persistent storage using SQLModel + SQLite:
- High-level API: key-value/JSON storage with namespaces
- Low-level API: raw SQLModel engine + session for custom tables

SQLModel is an optional dependency. Install with:
    pip install mld-sdk[local-db]
"""

from __future__ import annotations

import json
from contextlib import contextmanager
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Generator

_SQLMODEL_AVAILABLE = False
try:
    from sqlmodel import Field as SQLField
    from sqlmodel import SQLModel

    _SQLMODEL_AVAILABLE = True
except ImportError:
    pass


def _require_sqlmodel() -> None:
    if not _SQLMODEL_AVAILABLE:
        from mld_sdk.exceptions import ConfigurationException

        raise ConfigurationException(
            "sqlmodel is required for local database support. "
            "Install it with: pip install mld-sdk[local-db]",
            config_key="local-db",
        )


if _SQLMODEL_AVAILABLE:

    class KeyValueEntry(SQLModel, table=True):
        """Built-in key-value table for simple plugin storage."""

        __tablename__ = "mld_key_value"

        id: int | None = SQLField(default=None, primary_key=True)
        namespace: str = SQLField(default="default", index=True)
        key: str = SQLField(index=True)
        value: str = SQLField(default="{}")
        created_at: str = SQLField(
            default_factory=lambda: datetime.now(timezone.utc).isoformat()
        )
        updated_at: str = SQLField(
            default_factory=lambda: datetime.now(timezone.utc).isoformat()
        )


@dataclass
class LocalDatabaseConfig:
    """Configuration for a plugin's local database."""

    storage_dir: Path | None = None
    db_filename: str = "data.db"
    echo_sql: bool = False


class LocalDatabase:
    """
    Per-plugin local SQLite database.

    Provides both a high-level key-value API and low-level SQLModel
    engine/session access for custom tables.
    """

    def __init__(self, plugin_name: str, config: LocalDatabaseConfig | None = None):
        _require_sqlmodel()
        self._plugin_name = plugin_name
        self._config = config or LocalDatabaseConfig()
        self._engine: Any = None
        self._initialized = False

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    @property
    def db_path(self) -> Path:
        storage_dir = self._config.storage_dir
        if storage_dir is None:
            storage_dir = Path.home() / ".mld" / "plugins" / self._plugin_name
        return storage_dir / self._config.db_filename

    @property
    def engine(self) -> Any:
        if not self._initialized:
            from mld_sdk.exceptions import ConfigurationException

            raise ConfigurationException(
                "LocalDatabase not initialized. Call initialize() first.",
                config_key="local_database",
            )
        return self._engine

    def initialize(self, models: list[type] | None = None) -> None:
        """Create the database and tables.

        Args:
            models: Optional list of SQLModel classes to create tables for.
                    The built-in KeyValueEntry table is always created.
        """
        _require_sqlmodel()
        from sqlmodel import SQLModel as _SQLModel
        from sqlmodel import create_engine

        self.db_path.parent.mkdir(parents=True, exist_ok=True)

        self._engine = create_engine(
            f"sqlite:///{self.db_path}",
            echo=self._config.echo_sql,
        )

        tables = [KeyValueEntry.__table__]
        if models:
            for model in models:
                if hasattr(model, "__table__"):
                    tables.append(model.__table__)
                elif hasattr(model, "metadata"):
                    _SQLModel.metadata.create_all(self._engine)
                    tables = []
                    break

        if tables:
            _SQLModel.metadata.create_all(self._engine, tables=tables)

        self._initialized = True

    def close(self) -> None:
        if self._engine is not None:
            self._engine.dispose()
            self._engine = None
        self._initialized = False

    @contextmanager
    def get_session(self) -> Generator[Any, None, None]:
        """Get a SQLModel Session for custom table operations."""
        _require_sqlmodel()
        from sqlmodel import Session

        with Session(self.engine) as session:
            yield session

    # --- High-level key-value API ---

    def set(
        self,
        key: str,
        value: Any,
        namespace: str = "default",
    ) -> None:
        """Store a value (serialized as JSON) under the given key."""
        from sqlmodel import Session, select

        serialized = json.dumps(value)

        with Session(self.engine) as session:
            statement = select(KeyValueEntry).where(
                KeyValueEntry.namespace == namespace,
                KeyValueEntry.key == key,
            )
            entry = session.exec(statement).first()

            if entry:
                entry.value = serialized
                entry.updated_at = datetime.now(timezone.utc).isoformat()
                session.add(entry)
            else:
                entry = KeyValueEntry(
                    namespace=namespace,
                    key=key,
                    value=serialized,
                )
                session.add(entry)
            session.commit()

    def get(
        self,
        key: str,
        namespace: str = "default",
        default: Any = None,
    ) -> Any:
        """Retrieve a value by key, returning default if not found."""
        from sqlmodel import Session, select

        with Session(self.engine) as session:
            statement = select(KeyValueEntry).where(
                KeyValueEntry.namespace == namespace,
                KeyValueEntry.key == key,
            )
            entry = session.exec(statement).first()
            if entry is None:
                return default
            return json.loads(entry.value)

    def delete(self, key: str, namespace: str = "default") -> bool:
        """Delete a key. Returns True if the key existed."""
        from sqlmodel import Session, select

        with Session(self.engine) as session:
            statement = select(KeyValueEntry).where(
                KeyValueEntry.namespace == namespace,
                KeyValueEntry.key == key,
            )
            entry = session.exec(statement).first()
            if entry is None:
                return False
            session.delete(entry)
            session.commit()
            return True

    def list_keys(self, namespace: str = "default") -> list[str]:
        """List all keys in a namespace."""
        from sqlmodel import Session, select

        with Session(self.engine) as session:
            statement = select(KeyValueEntry.key).where(
                KeyValueEntry.namespace == namespace,
            )
            return list(session.exec(statement).all())

    def get_all(self, namespace: str = "default") -> dict[str, Any]:
        """Get all key-value pairs in a namespace."""
        from sqlmodel import Session, select

        with Session(self.engine) as session:
            statement = select(KeyValueEntry).where(
                KeyValueEntry.namespace == namespace,
            )
            entries = session.exec(statement).all()
            return {e.key: json.loads(e.value) for e in entries}

    def clear(self, namespace: str | None = None) -> int:
        """Clear entries. If namespace is None, clears all namespaces.

        Returns the number of entries deleted.
        """
        from sqlmodel import Session, select

        with Session(self.engine) as session:
            if namespace is not None:
                statement = select(KeyValueEntry).where(
                    KeyValueEntry.namespace == namespace,
                )
            else:
                statement = select(KeyValueEntry)

            entries = session.exec(statement).all()
            count = len(entries)
            for entry in entries:
                session.delete(entry)
            session.commit()
            return count
