# MLD SDK Skill for Claude Code

This skill provides AI-assisted plugin development for the MLD (MorscherLab Database) platform.

**Current Version:** 0.5.1

## What's Included

- **SKILL.md** - Main skill definition with quick start guide and decision tree
- **references/python-backend.md** - Complete Python SDK API reference
- **references/frontend-sdk.md** - Vue 3 component catalog and composables
- **references/integration.md** - Standalone vs integrated mode patterns
- **references/quick-start-templates.md** - Copy-paste starter code

## Installation

### Option 1: Download from GitHub Release

```bash
# Download the latest skill package
curl -LO https://github.com/MorscherLab/mld-sdk/releases/latest/download/mld-sdk-skill-v0.5.1.zip

# Extract to Claude skills directory
unzip mld-sdk-skill-v0.5.1.zip -d ~/.claude/skills/mld-sdk-plugin/

# Clean up
rm mld-sdk-skill-v0.5.1.zip
```

### Option 2: Clone from Repository

```bash
# Clone the repository
git clone https://github.com/MorscherLab/mld-sdk.git

# Copy skill files to Claude skills directory
cp -r mld-sdk/skill/ ~/.claude/skills/mld-sdk-plugin/
```

## Verify Installation

After installation, verify the skill is recognized by checking:

```bash
ls ~/.claude/skills/mld-sdk-plugin/
# Should show: SKILL.md  README.md  references/
```

## Usage

The skill activates automatically when you mention:
- "mld plugin", "analysis plugin", "mld-sdk"
- "PlatformContext", "AnalysisPlugin", "PluginType"
- "@morscherlab/mld-sdk", "plugin frontend"
- "WellPlate", "PlateMapEditor", "ExperimentTimeline"

### Example Prompts

```
Create a new MLD analysis plugin for processing mass spec data
```

```
Add a Vue frontend to my plugin using WellPlate components
```

```
How do I access experiments in integrated mode?
```

## Updating

When a new SDK version is released, download the updated skill package:

```bash
# Remove old skill
rm -rf ~/.claude/skills/mld-sdk-plugin/

# Download and install new version
curl -LO https://github.com/MorscherLab/mld-sdk/releases/latest/download/mld-sdk-skill-v{VERSION}.zip
unzip mld-sdk-skill-v{VERSION}.zip -d ~/.claude/skills/mld-sdk-plugin/
```

## Related Resources

- [MLD SDK Documentation](https://github.com/MorscherLab/mld-sdk)
- [Python SDK README](https://github.com/MorscherLab/mld-sdk/tree/main/packages/python)
- [Frontend SDK README](https://github.com/MorscherLab/mld-sdk/tree/main/packages/frontend)
