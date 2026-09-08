#!/usr/bin/env bash
# ==============================================================================
# QvReader Release Script (Public Repository)
# Validates clean tree, main ancestry, tag immutability, bumps versions,
# updates/validates changelog, checks version consistency, then commits,
# pushes main, waits for Public CI, and publishes the immutable tag.
#
# Usage:
#   ./scripts/release.sh [patch|minor|major]   # auto-derive (default patch) then publish
#   ./scripts/release.sh <version>             # e.g., 0.2.0 or v0.2.0
#   DRY_RUN=1 ./scripts/release.sh             # preflight only, no changes at all
#   PUBLISH=0 ./scripts/release.sh             # prepare + commit locally, no push/tag
#   YES=1 ./scripts/release.sh                 # skip interactive confirmations
# ==============================================================================
set -euo pipefail

DRY_RUN="${DRY_RUN:-0}"
PUBLISH="${PUBLISH:-1}"
YES="${YES:-0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

RAW_VER="${1:-}"
BUMP_KIND="${1:-}"

# --- Helpers -----------------------------------------------------------------
# Interactive guard for irreversible external actions (push / tag).
# Non-interactive shells auto-confirm so the script still works in CI or when
# piped; set YES=1 to skip the prompt explicitly.
confirm() {
  local msg="$1"
  if [ "$YES" = "1" ]; then
    return 0
  fi
  if [ ! -t 0 ]; then
    echo "   (non-interactive shell: auto-confirming)"
    return 0
  fi
  local ans=""
  read -r -p "$msg [y/N] " ans || true
  case "$ans" in
    y|Y|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}


# --- Resolve the target version -------------------------------------------
# Version lives only in git tags. Auto-derive the next release from the most
# recent semver tag (scripts/derive-version.mjs) unless an explicit version or
# a bump kind (patch|minor|major) is given.
derive_next_version() {
  local kind="${1:-patch}"
  local base
  base="$(node "$SCRIPT_DIR/derive-version.mjs")"
  # strip any dev/dirty suffix (e.g. 0.1.8-3-gabc123 -> 0.1.8)
  base="${base%%-*}"
  local major minor patch
  IFS='.' read -r major minor patch <<EOF
$base
EOF
  case "$kind" in
    major) major=$((major + 1)); minor=0; patch=0 ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    patch|*) patch=$((patch + 1)) ;;
  esac
  echo "${major}.${minor}.${patch}"
}

if [ -z "$RAW_VER" ] || [ "$RAW_VER" = "patch" ] || [ "$RAW_VER" = "minor" ] || [ "$RAW_VER" = "major" ]; then
  RAW_VER="$(derive_next_version "${BUMP_KIND:-patch}")"
  echo "→ No explicit version. Auto-derived next ${BUMP_KIND:-patch} release: $RAW_VER"
fi

VER="${RAW_VER#v}"
if ! echo "$VER" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$'; then
  echo "❌ Error: Invalid semver format '$RAW_VER'. Expected X.Y.Z or patch|minor|major (e.g. 0.2.0)" >&2
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
echo "[1/9] Checking working tree status..."
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Working tree has uncommitted changes. Please commit or stash them first." >&2
  git status --short >&2
  exit 1
fi
echo "✔ Working tree is clean."

# 2. Main branch ancestry preflight
echo "[2/9] Checking branch ancestry..."
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
echo "[3/9] Verifying tag immutability for $TAG..."
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
echo "[4/9] Bumping versions across public manifests..."
if [ "$DRY_RUN" != "1" ]; then
  # package.json
  perl -0pi -e 's/^(\s*)"version": *"[^"]+"/${1}"version": "'"$VER"'"/m' package.json

  # src-tauri/Cargo.toml
  perl -0pi -e 's/(\[package\][\s\S]*?version\s*=\s*)"[^"]+"/${1}"'"$VER"'"/' src-tauri/Cargo.toml

  # src-tauri/Cargo.lock (keep in sync so `cargo test --locked` passes)
  if [ -f "src-tauri/Cargo.lock" ]; then
    perl -0pi -e 's/(name = "qvreader"\nversion = ")[^"]+"/${1}'"$VER"'"/' src-tauri/Cargo.lock
  fi

  # src-tauri/tauri.conf.json
  perl -0pi -e 's/("version":\s*)"[^"]+"/${1}"'"$VER"'"/' src-tauri/tauri.conf.json
  perl -0pi -e 's/("title":\s*"QvReader\s+)[^"]*("\s*,)/${1}v'"$VER"'$2/' src-tauri/tauri.conf.json

  # NOTE: src/config/version.ts is intentionally NOT bumped here. CLIENT_VERSION
  # is injected at build/test time from git (vite.config.ts define +
  # scripts/derive-version.mjs). The git tag is the single source of truth.
  echo "✔ Updated package.json, Cargo.toml, Cargo.lock, and tauri.conf.json."
else
  echo "✔ [dry-run] Would bump version to $VER in package.json, Cargo.toml, Cargo.lock, and tauri.conf.json."
fi

# 5. Changelog validation & update
echo "[5/9] Validating CHANGELOG.md..."
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
echo "[6/9] Verifying version consistency..."
if [ "$DRY_RUN" = "1" ]; then
  echo "✔ [dry-run] Preflight checks passed cleanly for $TAG."
  echo "=========================================================="
  echo " DRY-RUN complete. No files changed, nothing pushed."
  echo "=========================================================="
  exit 0
fi
node scripts/verify-version.mjs --tag "$TAG"

# 7. Commit the release bump
echo "[7/9] Committing release bump for $TAG..."
if git diff --quiet; then
  echo "✔ Nothing to commit — manifests and changelog already at $VER."
else
  BUMP_FILES=(package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json CHANGELOG.md)
  [ -f "src-tauri/Cargo.lock" ] && BUMP_FILES+=(src-tauri/Cargo.lock)
  git add "${BUMP_FILES[@]}"
  git commit -q -m "chore(release): bump version to $VER"
  echo "✔ Committed $(git rev-parse --short HEAD)."
fi
RELEASE_SHA="$(git rev-parse HEAD)"
RELEASE_SHA_SHORT="$(git rev-parse --short "$RELEASE_SHA")"

if [ "$PUBLISH" != "1" ]; then
  echo "=========================================================="
  echo " Prepared $TAG locally (PUBLISH=0)."
  echo " Commit:  $RELEASE_SHA_SHORT"
  echo " To publish manually:"
  echo "   git push origin main"
  echo "   git tag -a $TAG -m 'QvReader release $TAG' && git push origin $TAG"
  echo "=========================================================="
  exit 0
fi

# 8. Push main and wait for Public CI
echo "[8/9] Pushing main to origin..."
if ! confirm "   Push $RELEASE_SHA_SHORT to origin/main?"; then
  echo "Aborted before push. Nothing was pushed or tagged."
  exit 1
fi

PUSH_ERR="$(mktemp)"
if ! git push origin main 2> "$PUSH_ERR"; then
  cat "$PUSH_ERR" >&2
  if grep -qiE 'workflow|refusing to allow|pre-receive hook declined' "$PUSH_ERR"; then
    echo "" >&2
    echo "❌ Push rejected. This push contains .github/workflows changes and the" >&2
    echo "   credential lacks the 'workflow' scope." >&2
    echo "" >&2
    echo "   Being the repository owner is not enough — GitHub enforces the" >&2
    echo "   'workflow' scope on OAuth tokens regardless of account permission." >&2
    echo "   Pick one:" >&2
    echo "     a) push over SSH (not subject to the OAuth scope rule):" >&2
    echo "          git remote set-url origin git@github.com:qvcloud/QvReader.git" >&2
    echo "     b) use a classic PAT that has both 'repo' and 'workflow':" >&2
    echo "          git remote set-url origin https://<PAT>@github.com/qvcloud/QvReader.git" >&2
    echo "     c) gh auth refresh -s workflow   (adds the scope to the gh token)" >&2
    echo "" >&2
    echo "   The release commit $RELEASE_SHA_SHORT is committed locally and safe." >&2
  fi
  rm -f "$PUSH_ERR"
  exit 1
fi
rm -f "$PUSH_ERR"
echo "✔ Pushed $RELEASE_SHA_SHORT to origin/main."

# 9. Create and push the immutable tag (triggers Official Release Pipeline)
echo "[9/9] Creating and pushing tag $TAG..."
if ! confirm "   Create and push tag $TAG on $RELEASE_SHA_SHORT? (triggers the 3-platform release build)"; then
  echo "Aborted before tagging. main was pushed, no tag created."
  exit 1
fi
git tag -a "$TAG" -m "QvReader release $TAG"
git push origin "$TAG"
echo ""
echo "=========================================================="
echo " Published $TAG  (commit $RELEASE_SHA_SHORT)"
echo " Official Release Pipeline is now building 3 platforms:"
echo "   https://github.com/qvcloud/QvReader/actions"
echo ""
echo " Once green, pin the private submodule to $RELEASE_SHA_SHORT."
echo " Tags are immutable — never reuse or force-move $TAG."
echo "=========================================================="
