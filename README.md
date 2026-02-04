# MLD SDK

SDK for building plugins that integrate with the MLD (MorscherLab Database) platform.

## Packages

This monorepo contains two packages:

| Package | Description | Registry |
|---------|-------------|----------|
| [`mld-sdk`](./packages/python) | Python SDK for backend plugin development | GitHub Packages PyPI |
| [`@morscherlab/mld-sdk`](./packages/frontend) | Vue 3 SDK for frontend plugin development | GitHub Packages npm |

## Installation

### Python SDK

```bash
# Configure uv to use GitHub Packages
# Add to pyproject.toml:
# [[tool.uv.index]]
# name = "github"
# url = "https://ghcr.io/v2/MorscherLab"

uv add mld-sdk
```

### Frontend SDK

```bash
# Create .npmrc with:
# @morscherlab:registry=https://npm.pkg.github.com

npm install @morscherlab/mld-sdk
```

### Claude Code Skill

For AI-assisted plugin development with Claude Code, install the MLD SDK skill:

```bash
# Download latest skill package from releases
curl -LO https://github.com/MorscherLab/mld-sdk/releases/latest/download/mld-sdk-skill-v0.3.0.zip

# Extract to Claude skills directory
unzip mld-sdk-skill-v0.3.0.zip -d ~/.claude/skills/mld-sdk-plugin/
```

The skill provides:
- Quick start templates for analysis plugins
- Decision tree for choosing SDK features
- Complete API reference optimized for AI assistants
- Integration patterns and examples

See [Skill Setup Guide](./docs/skill-setup.md) for details.

## Documentation

### Comprehensive Docs

- **[Getting Started Guide](./docs/getting-started.md)** - Installation and first plugin
- **[Full Documentation](./docs/index.md)** - Complete SDK documentation

### Python SDK
- [API Reference](./docs/python/api-reference.md) - Complete Python API
- [Plugin Development Guide](./docs/python/plugin-guide.md) - Lifecycle and patterns
- [Exception Handling](./docs/python/exceptions.md) - Error handling

### Frontend SDK
- [API Reference](./docs/frontend/api-reference.md) - Complete Frontend API
- [Component Catalog](./docs/frontend/components.md) - All 32 components
- [Composables Reference](./docs/frontend/composables.md) - All 9 composables
- [Theming Guide](./docs/frontend/theming.md) - CSS variables and customization

### Integration
- [Full-Stack Plugin Example](./docs/integration/fullstack-plugin.md) - Complete plugin with backend + frontend

### Quick Links
- [Python SDK README](./packages/python/README.md)
- [Frontend SDK README](./packages/frontend/README.md)
- [MLD Platform](https://github.com/MorscherLab/mld)

## Development

### Prerequisites

- Python 3.12+
- Node.js 20+
- uv (Python package manager)

### Setup

```bash
# Clone the repository
git clone https://github.com/MorscherLab/mld-sdk.git
cd mld-sdk

# Python SDK
cd packages/python
uv sync

# Frontend SDK
cd packages/frontend
npm install
npm run build
```

### Testing

```bash
# Python SDK
cd packages/python
uv run pytest

# Frontend SDK
cd packages/frontend
npm run typecheck
```

## Release

Releases are automated via GitHub Actions. To create a new release:

1. Update version in both `packages/python/pyproject.toml` and `packages/frontend/package.json`
2. Update `CHANGELOG.md`
3. Create and push a tag: `git tag v0.2.0 && git push --tags`

Both packages will be published to GitHub Packages automatically.

## License

MIT
