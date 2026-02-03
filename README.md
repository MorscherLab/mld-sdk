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

## Documentation

- [Python SDK Documentation](./packages/python/README.md)
- [Frontend SDK Documentation](./packages/frontend/README.md)
- [MLD Platform Documentation](https://github.com/MorscherLab/mld)

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
