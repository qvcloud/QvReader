#!/usr/bin/env bash
# ==============================================================================
# QvReader Release Preparation Script (Public Repository)
# Validates clean tree, main ancestry, tag immutability, bumps versions,
# updates/validates changelog, and checks version consistency before tagging.
#
# Usage:
#   ./scripts/release.sh <version>          # e.g., 0.2.0 or v0.2.0
#   DRY_RUN=1 ./scripts/release.sh 0.2.0
# ==============================================================================
set -euo pipefail

DRY_RUN="${DRY_RUN:-0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

RAW_VER="${1:-}"
if [ -z "$RAW_VER" ]; then
  echo "Usage: $0 <version> (e.g. 0.2.0 or v0.2.0)" >&2
  exit 1
fi

VER="${RAW_VER#v}"
if ! echo "$VER" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'; then
  echo "❌ Error: Invalid semver format '$RAW_VER'. Expected X.Y.Z (e.g. 0.2.0)" >&2
  exit 1
fi
TAG="v$VER"

echo "=========================================================="
echo " Preparing QvReader Release: $TAG (version: $VER)"
echo " Repository: $REPO_ROOT"
if [ "$DRY_RUN" = "1" ]; then
  echo " Mode: DRY-RUN (no files will be modified or tagged)"
fi
echo "=========================================================="

# 1. Clean working tree check
echo "[1/6] Checking working tree status..."
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Working tree has uncommitted changes. Please commit or stash them first." >&2
  git status --short >&2
  exit 1
fi
echo "✔ Working tree is clean."

# 2. Main branch ancestry preflight
echo "[2/6] Checking branch ancestry..."
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "⚠️ Warning: Currently on branch '$CURRENT_BRANCH', not 'main'."
  if ! git merge-base --is-ancestor HEAD main 2>/dev/null; then
    echo "❌ Error: Commit $(git rev-parse --short HEAD) is not on or an ancestor of 'main'." >&2
    exit 1
  fi
fi
echo "✔ Branch ancestry verified."

# 3. Immutable tag check (tag must not exist)
echo "[3/6] Verifying tag immutability for $TAG..."
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "❌ Error: Tag '$TAG' already exists locally. Published tags are immutable and cannot be moved or reused." >&2
  exit 1
fi
if git ls-remote --tags origin "$TAG" 2>/dev/null | grep -q "$TAG"; then
  echo "❌ Error: Tag '$TAG' already exists on remote origin. Published tags are immutable." >&2
  exit 1
fi
echo "✔ Tag '$TAG' is available and unique."

# 4. Bump version in manifests
echo "[4/6] Bumping versions across public manifests..."
if [ "$DRY_RUN" != "1" ]; then
  # package.json
  perl -0pi -e 's/^(\s*)"version": *"[^"]+"/${1}"version": "'"$VER"'"/m' package.json

  # src-tauri/Cargo.toml
  perl -0pi -e 's/(\[package\][\s\S]*?version\s*=\s*)"[^"]+"/${1}"'"$VER"'"/' src-tauri/Cargo.toml

  # src-tauri/tauri.conf.json
  perl -0pi -e 's/("version":\s*)"[^"]+"/${1}"'"$VER"'"/' src-tauri/tauri.conf.json
  perl -0pi -e 's/("title":\s*"QvReader\s+)[^"]*("\s*,)/${1}v'"$VER"'$2/' src-tauri/tauri.conf.json

  # src/config/version.ts
  if [ -f "src/config/version.ts" ]; then
    perl -0pi -e 's/(CLIENT_VERSION\s*=\s*)[^;]+;/${1}'"'$VER'"';/' src/config/version.ts
  fi
  echo "✔ Updated package.json, Cargo.toml, tauri.conf.json, and src/config/version.ts."
else
  echo "✔ [dry-run] Would bump version to $VER in package.json, Cargo.toml, tauri.conf.json, and version.ts."
fi

# 5. Changelog validation & update
echo "[5/6] Validating CHANGELOG.md..."
CHANGELOG="CHANGELOG.md"
TODAY="$(date +%Y-%m-%d)"
if ! grep -q "## \[$VER\]" "$CHANGELOG"; then
  if [ "$DRY_RUN" != "1" ]; then
    perl -0pi -e 's/(## \[)/## ['"$VER"'] - '"$TODAY"'\n\n### Changed\n- Release version '"$VER"'\n\n---\n\n${1}/' "$CHANGELOG"
    echo "✔ Added entry for [$VER] in CHANGELOG.md."
  else
    echo "✔ [dry-run] Would prepend entry for [$VER] to CHANGELOG.md."
  fi
else
  echo "✔ Existing entry for [$VER] found in CHANGELOG.md."
fi

# 6. Run automated version consistency check
echo "[6/6] Verifying version consistency..."
if [ "$DRY_RUN" != "1" ]; then
  node scripts/verify-version.mjs --tag "$TAG"
  echo ""
  echo "=========================================================="
  echo " Successfully prepared release $TAG!"
  echo " Next steps to publish:"
  echo "   1. Review changes: git diff"
  echo "   2. Commit bump:   git commit -am 'chore(release): bump version to $VER'"
  echo "   3. Create tag:    git tag -a $TAG -m 'QvReader release $TAG'"
  echo "   4. Push to main:  git push origin main && git push origin $TAG"
  echo "=========================================================="
else
  echo "✔ [dry-run] Preflight checks passed cleanly for $TAG."
fi
