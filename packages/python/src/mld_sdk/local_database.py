"""
Local SQLite database for MLD plugins (standalone mode).

Provides per-plugin persistent storage using SQLModel + SQLite
with both sync and async session support.

SQLModel is an optional dependency. Install with:
    pip install mld-sdk[local-db]
"""

from __future__ import annotations

from contextlib import asynccontextmanager, contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, AsyncGenerator, Generator

if TYPE_CHECKING:
    from sqlalchemy import Engine
    from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
    from sqlmodel import Session

_SQLMODEL_AVAILABLE = False
try:
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


@dataclass(slots=True)
class LocalDatabaseConfig:
    """Configuration for a plugin's local database."""

    storage_dir: Path | None = None
    db_filename: str = "data.db"
    echo_sql: bool = False


class LocalDatabase:
    """
    Per-plugin local SQLite database for standalone mode.

    Provides sync and async session access for plugin tables.
    """

    def __init__(self, plugin_name: str, config: LocalDatabaseConfig | None = None):
        _require_sqlmodel()
        self._plugin_name = plugin_name
        self._config = config or LocalDatabaseConfig()
        self._engine: Engine | None = None
        self._async_engine: AsyncEngine | None = None
        self._initialized: bool = False

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
    def engine(self) -> Engine:
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
        """
        _require_sqlmodel()
        from sqlmodel import SQLModel as _SQLModel
        from sqlmodel import create_engine

        self.db_path.parent.mkdir(parents=True, exist_ok=True)

        self._engine = create_engine(
            f"sqlite:///{self.db_path}",
            echo=self._config.echo_sql,
        )

        if models:
            tables = []
            for model in models:
                if hasattr(model, "__table__"):
                    tables.append(model.__table__)
            if tables:
                _SQLModel.metadata.create_all(self._engine, tables=tables)
        else:
            _SQLModel.metadata.create_all(self._engine)

        self._initialized = True

    def close(self) -> None:
        if self._engine is not None:
            self._engine.dispose()
            self._engine = None
        if self._async_engine is not None:
            # async engine disposal is sync-safe in SQLAlchemy
            import asyncio

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(self._async_engine.dispose())
            except RuntimeError:
                asyncio.run(self._async_engine.dispose())
            self._async_engine = None
        self._initialized = False

    @contextmanager
    def get_session(self) -> Generator[Session, None, None]:
        """Get a sync SQLModel Session."""
        _require_sqlmodel()
        from sqlmodel import Session

        with Session(self.engine) as session:
            yield session

    @asynccontextmanager
    async def get_async_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get an async SQLAlchemy session (uses aiosqlite)."""
        if self._async_engine is None:
            from sqlalchemy.ext.asyncio import create_async_engine

            self._async_engine = create_async_engine(
                f"sqlite+aiosqlite:///{self.db_path}",
                echo=self._config.echo_sql,
            )

        from sqlalchemy.ext.asyncio import AsyncSession as _AsyncSession
        from sqlalchemy.orm import sessionmaker

        async_session = sessionmaker(
            self._async_engine, class_=_AsyncSession, expire_on_commit=False
        )
        async with async_session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
