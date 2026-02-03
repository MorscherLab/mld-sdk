# MLD SDK (Python)

SDK for building analysis plugins that integrate with the MLD platform.

> **Full Documentation:** See the [comprehensive docs](../../docs/index.md) for detailed API reference and guides.
> - [API Reference](../../docs/python/api-reference.md)
> - [Plugin Development Guide](../../docs/python/plugin-guide.md)
> - [Exception Handling](../../docs/python/exceptions.md)

## Installation

```bash
# From PyPI (when published)
uv add mld-sdk

# From git
uv add git+https://github.com/EstrellaXD/mld#subdirectory=sdk
```

## Quick Start

Create a plugin by implementing the `AnalysisPlugin` interface:

```python
from mld_sdk import AnalysisPlugin, PluginMetadata, PluginCapabilities
from fastapi import APIRouter

router = APIRouter()

@router.get("/hello")
async def hello():
    return {"message": "Hello from my plugin!"}

class MyPlugin(AnalysisPlugin):
    @property
    def metadata(self) -> PluginMetadata:
        return PluginMetadata(
            name="My Plugin",
            version="1.0.0",
            description="My analysis plugin",
            analysis_type="metabolomics",
            routes_prefix="/my-plugin",
            capabilities=PluginCapabilities(
                requires_auth=True,
                requires_experiments=True,
            ),
        )

    def get_routers(self):
        return [(router, "")]

    async def initialize(self, context=None):
        self._context = context

    async def shutdown(self):
        pass
```

## Plugin Package Structure

```
mld-plugin-example/
├── pyproject.toml
├── README.md
└── src/mld_plugin_example/
    ├── __init__.py
    └── plugin.py
```

### pyproject.toml

```toml
[project]
name = "mld-plugin-example"
version = "1.0.0"
dependencies = ["mld-sdk>=1.0.0"]

[project.entry-points."mld.plugins"]
example = "mld_plugin_example.plugin:MyPlugin"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/mld_plugin_example"]
```

The entry point `mld.plugins` is how the platform discovers your plugin.

## Platform Context

When running integrated with the platform, your plugin receives a `PlatformContext` that provides access to:

- Authentication dependencies (`get_current_user_dependency()`)
- Repositories for experiments, samples, users, etc.
- Platform configuration

```python
async def initialize(self, context=None):
    self._context = context
    if context:
        # Running integrated - use platform services
        self.experiment_repo = context.get_experiment_repository()
    else:
        # Running standalone
        pass
```

## Installation Commands

```bash
# Install from GitHub
uv add git+https://github.com/org/mld-plugin-example

# Install specific version
uv add git+https://github.com/org/mld-plugin-example@v1.0.0

# Install from PyPI
uv add mld-plugin-example

# Install local plugin for development
uv add --editable ./my-plugin
```
