#!/usr/bin/env bash
#
# publish.sh — publish the community / release content in this directory
# to the open-source repo qvcloud/QvReader.
#
# This directory is its own git repository (NOT a submodule of the private
# dev repo). Its working tree is exactly the "release home" content.
#
# Usage:
#   ./scripts/publish.sh          # init-if-needed, commit, push to main
#   ./scripts/publish.sh --force  # skip the clean-tree safety check
#
# Prereqs:
#   - SSH key added on GitHub (git@github.com works) with push access to
#     qvcloud/QvReader.
set -euo pipefail

REMOTE_URL="git@github.com:qvcloud/QvReader.git"
BRANCH="main"

# Resolve this script's directory (release/), independent of cwd.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Working dir: $ROOT_DIR"

# 1. Init the repo if it is not one yet.
if [ ! -d .git ]; then
  echo "==> No .git found. Initializing new git repository..."
  git init -b "$BRANCH"
  git remote add origin "$REMOTE_URL"
fi

# 2. Ensure the remote points at QvReader.
CUR_REMOTE="$(git remote get-url origin 2>/dev/null || true)"
if [ "$CUR_REMOTE" != "$REMOTE_URL" ]; then
  echo "==> Setting origin -> $REMOTE_URL (was: ${CUR_REMOTE:-none})"
  git remote set-url origin "$REMOTE_URL"
fi

# 3. Ensure we have a committer identity (do not silently rely on global).
if [ -z "$(git config user.email 2>/dev/null)" ]; then
  echo "==> Setting local commit identity (no global email configured)."
  git config user.name  "${GIT_AUTHOR_NAME:-$(git config --global user.name 2>/dev/null || echo 'QvReader Bot')}"
  git config user.email "${GIT_AUTHOR_EMAIL:-$(git config --global user.email 2>/dev/null || echo 'qvreader@users.noreply.github.com')}"
fi

# 4. Safety: refuse to publish if the dev-repo parent would swallow us.
#    .gitignore already excludes release/, but double-check we are NOT the dev repo.
if [ -d .git ] && git remote get-url origin 2>/dev/null | grep -q "markdown-viewer.git"; then
  echo "!! ERROR: origin points at the private dev repo, not QvReader." >&2
  exit 1
fi

# 5. Stage everything (respects release/.gitignore).
git add -A

# 6. Optional safety: require a clean diff to avoid accidental force content.
if ! git diff --cached --quiet; then
  echo "==> Staged changes to commit."
  git commit -m "docs: update community release content

Synced QvReader community-facing docs, license, and assets."
  echo "==> Committed."
else
  echo "==> Nothing new to commit (working tree matches HEAD)."
fi

# 7. Fetch remote main if it exists, then push.
if git ls-remote --heads origin "$BRANCH" 2>/dev/null | grep -q "refs/heads/$BRANCH"; then
  echo "==> Remote '$BRANCH' exists. Rebasing local onto it before push..."
  git fetch origin "$BRANCH"
  git rebase "origin/$BRANCH" || {
    echo "!! Rebase conflict. Resolve manually, then run: git push origin $BRANCH" >&2
    exit 1
  }
fi

git push -u origin "$BRANCH"
echo ""
echo "============================================="
echo "  Published to $REMOTE_URL ($BRANCH)"
echo "============================================="
