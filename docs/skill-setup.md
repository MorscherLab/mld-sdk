# MLD SDK Skill Setup Guide

This guide covers installing and using the MLD SDK skill for AI-assisted plugin development with Claude Code.

## What's Included

The skill package contains reference documentation optimized for Claude Code:

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition with quick start guide and decision tree |
| `references/python-backend.md` | Complete Python SDK API reference |
| `references/frontend-sdk.md` | Vue 3 component catalog (32 components) and composables |
| `references/integration.md` | Standalone vs integrated mode patterns |
| `references/quick-start-templates.md` | Copy-paste starter code for common scenarios |

## Installation

### Option 1: Download from GitHub Release (Recommended)

Download the versioned skill package from the latest release:

```bash
# Download the skill package
curl -LO https://github.com/MorscherLab/mld-sdk/releases/latest/download/mld-sdk-skill-v0.3.0.zip

# Create skills directory if it doesn't exist
mkdir -p ~/.claude/skills/mld-sdk-plugin

# Extract to Claude skills directory
unzip mld-sdk-skill-v0.3.0.zip -d ~/.claude/skills/mld-sdk-plugin/

# Clean up the zip file
rm mld-sdk-skill-v0.3.0.zip
```

### Option 2: Copy from Repository

If you've cloned the mld-sdk repository:

```bash
# Copy skill files to Claude skills directory
cp -r /path/to/mld-sdk/skill/ ~/.claude/skills/mld-sdk-plugin/
```

## Verify Installation

Check that the skill files are in place:

```bash
ls ~/.claude/skills/mld-sdk-plugin/
```

Expected output:
```
README.md  SKILL.md  references/
```

Verify the references directory:

```bash
ls ~/.claude/skills/mld-sdk-plugin/references/
```

Expected output:
```
frontend-sdk.md  integration.md  python-backend.md  quick-start-templates.md
```

## Usage

### Automatic Activation

The skill activates automatically when you mention MLD SDK-related topics:

**Python SDK triggers:**
- "mld plugin", "analysis plugin"
- "PlatformContext", "AnalysisPlugin", "PluginType"
- "mld-sdk"

**Frontend SDK triggers:**
- "@morscherlab/mld-sdk", "plugin frontend"
- "WellPlate", "PlateMapEditor", "ExperimentTimeline"
- SDK component names

### Example Prompts

**Creating a new plugin:**
```
Create a new MLD analysis plugin for processing mass spectrometry data.
It should have a /run endpoint that accepts an experiment ID.
```

**Adding a frontend:**
```
Add a Vue frontend to my plugin that displays experiment data in a WellPlate component.
```

**Understanding modes:**
```
How do I handle the difference between standalone and integrated mode in my plugin?
```

**Using SDK components:**
```
Show me how to use the PlateMapEditor with custom sample types.
```

## Updating

When a new SDK version is released, update your skill installation:

```bash
# Remove old skill
rm -rf ~/.claude/skills/mld-sdk-plugin/

# Download new version (replace VERSION with actual version)
curl -LO https://github.com/MorscherLab/mld-sdk/releases/latest/download/mld-sdk-skill-vVERSION.zip

# Extract
unzip mld-sdk-skill-vVERSION.zip -d ~/.claude/skills/mld-sdk-plugin/

# Clean up
rm mld-sdk-skill-vVERSION.zip
```

### Version Compatibility

The skill version matches the SDK version. For best results, keep them synchronized:

| SDK Version | Skill Version |
|-------------|---------------|
| 0.3.0 | 0.3.0 |

## Troubleshooting

### Skill not activating

1. Verify the skill is installed in the correct location:
   ```bash
   ls ~/.claude/skills/mld-sdk-plugin/SKILL.md
   ```

2. Restart Claude Code if it was running during installation

3. Check that SKILL.md has the correct frontmatter format:
   ```bash
   head -20 ~/.claude/skills/mld-sdk-plugin/SKILL.md
   ```

### Outdated information

If the skill provides outdated API information:

1. Check your installed skill version:
   ```bash
   grep "^version:" ~/.claude/skills/mld-sdk-plugin/SKILL.md
   ```

2. Compare with the latest SDK release on GitHub

3. Update using the instructions above

### Missing references

If Claude can't find reference documents:

1. Verify the references directory exists:
   ```bash
   ls ~/.claude/skills/mld-sdk-plugin/references/
   ```

2. Re-install the skill from a fresh download

## Related Resources

- [MLD SDK Repository](https://github.com/MorscherLab/mld-sdk)
- [Python SDK Documentation](../packages/python/README.md)
- [Frontend SDK Documentation](../packages/frontend/README.md)
- [Full Documentation](./index.md)
