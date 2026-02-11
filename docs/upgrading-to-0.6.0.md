# Upgrading to 0.6.0

This guide covers breaking changes and migration steps when upgrading from 0.5.x to 0.6.0.

## What changed

The platform renamed its `plugin_data` database column to `design_data` to better describe its purpose: storing experiment design configuration (samples, plate layouts, parameters) written by EXPERIMENT_DESIGN plugins. The SDK is updated to match.

## Breaking: `has_plugin_data()` → `has_design_data()`

The `ExperimentRepository` protocol method was renamed. This is a **breaking change** — any plugin calling this method must update.

```python
# Before (0.5.x)
has_data = await experiment_repo.has_plugin_data(experiment_id)

# After (0.6.0)
has_data = await experiment_repo.has_design_data(experiment_id)
```

**Find and replace:** Search your codebase for `has_plugin_data` and replace with `has_design_data`.

## Non-breaking: `PluginExperimentData` → `DesignData`

The data model class was renamed, but a backward compatibility alias is provided. **No code changes required** — existing imports will continue to work.

```python
# Both work in 0.6.0:
from mld_sdk import DesignData            # new name (preferred)
from mld_sdk import PluginExperimentData  # still works (alias)

# These are the same class:
assert DesignData is PluginExperimentData  # True
```

**Recommended:** Update imports to `DesignData` when convenient, but this is not urgent.

## No changes needed

The following are **unchanged** and require no migration:

| Element | Status |
|---------|--------|
| `PluginDataRepository` class name | Unchanged — handles both design data and analysis results |
| `save_experiment_data()` / `get_experiment_data()` | Unchanged — plugin-facing method names stay the same |
| `get_plugin_data_repository()` on PlatformContext | Unchanged |
| `PluginAnalysisResult` model | Unchanged |
| All analysis result methods | Unchanged |
| Frontend SDK (`@morscherlab/mld-sdk`) | No changes — frontend has no experiment data types |

## Platform compatibility

SDK 0.6.0 requires MLD platform with the `design_data` column rename applied. If you're running the platform from the `main` branch, this is already included.

## Quick checklist

1. Update SDK: `uv add mld-sdk>=0.6.0`
2. Search for `has_plugin_data` → replace with `has_design_data`
3. Optionally update `PluginExperimentData` imports to `DesignData`
4. Run tests to verify
