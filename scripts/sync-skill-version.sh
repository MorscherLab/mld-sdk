#!/bin/bash
# Sync skill version with SDK version
#
# Usage: ./scripts/sync-skill-version.sh <version>
# Example: ./scripts/sync-skill-version.sh 0.3.1

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.3.1"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Synchronizing skill version to $VERSION..."

# Update skill SKILL.md metadata
if [ -f "$REPO_ROOT/skill/SKILL.md" ]; then
  sed -i.bak "s/^version: .*/version: $VERSION/" "$REPO_ROOT/skill/SKILL.md"
  sed -i.bak "s/^sdk_version: .*/sdk_version: $VERSION/" "$REPO_ROOT/skill/SKILL.md"
  rm -f "$REPO_ROOT/skill/SKILL.md.bak"
  echo "  Updated skill/SKILL.md"
fi

# Update skill README.md
if [ -f "$REPO_ROOT/skill/README.md" ]; then
  sed -i.bak "s/\*\*Current Version:\*\* .*/\*\*Current Version:\*\* $VERSION/" "$REPO_ROOT/skill/README.md"
  sed -i.bak "s/mld-sdk-skill-v[0-9]*\.[0-9]*\.[0-9]*/mld-sdk-skill-v$VERSION/g" "$REPO_ROOT/skill/README.md"
  rm -f "$REPO_ROOT/skill/README.md.bak"
  echo "  Updated skill/README.md"
fi

echo "Skill version synchronized to $VERSION"
