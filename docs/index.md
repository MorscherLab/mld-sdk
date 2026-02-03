# MLD SDK Documentation

SDK for building plugins that integrate with the MLD (MorscherLab Database) platform.

## Packages

| Package | Description | Language |
|---------|-------------|----------|
| [mld-sdk](./python/api-reference.md) | Backend plugin framework | Python 3.12+ |
| [@morscherlab/mld-sdk](./frontend/api-reference.md) | Frontend component library | Vue 3 + TypeScript |

## Quick Navigation

### Getting Started
- [Quick Start Guide](./getting-started.md) - Installation and first plugin

### Python SDK
- [API Reference](./python/api-reference.md) - Complete Python API
- [Plugin Development Guide](./python/plugin-guide.md) - Plugin lifecycle and patterns
- [Exception Handling](./python/exceptions.md) - Error handling patterns

### Frontend SDK
- [API Reference](./frontend/api-reference.md) - Complete Frontend API
- [Components](./frontend/components.md) - Component catalog with examples
- [Composables](./frontend/composables.md) - Composables reference
- [Theming](./frontend/theming.md) - CSS variables and customization

### Integration
- [Full-Stack Plugin Example](./integration/fullstack-plugin.md) - Complete plugin with backend and frontend

## Architecture Overview

```
MLD Platform
├── Plugin A (Python backend + Vue frontend)
│   ├── FastAPI routers
│   ├── PlatformContext access
│   └── Vue 3 UI components
├── Plugin B
└── Plugin C
```

### Python SDK Architecture

```
mld_sdk
├── plugin.py          # AnalysisPlugin ABC
├── models.py          # PluginMetadata, PluginCapabilities
├── context.py         # PlatformContext interface
├── repositories.py    # Data access protocols
└── exceptions.py      # Exception hierarchy
```

### Frontend SDK Architecture

```
@morscherlab/mld-sdk
├── components/        # 32 Vue 3 components
├── composables/       # 9 composables
├── stores/            # Pinia stores
├── types/             # TypeScript definitions
└── styles/            # CSS variables & utilities
```

## Version

Current version: **1.1.0** (Python) / **0.2.0** (Frontend)

Both packages are released together and designed to work in coordination.
