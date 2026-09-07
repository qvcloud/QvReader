#!/usr/bin/env bash
# ==============================================================================
# Public Source Boundary Validator for QvReader (release/)
# Rejects missing allowlist files, generated artifacts, and private dependencies.
# ==============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

ERRORS=0

log_err() {
  echo "❌ [BOUNDARY ERROR] $1" >&2
  ERRORS=$((ERRORS + 1))
}

log_ok() {
  echo "✅ $1"
}

echo "=========================================================="
echo " Validating Public Source Boundary in: $REPO_ROOT"
echo "=========================================================="

# 1. Required root-level client files & configuration
REQUIRED_ROOT_FILES=(
  "package.json"
  "package-lock.json"
  "vite.config.ts"
  "tsconfig.json"
  "rust-toolchain.toml"
  "Makefile"
  "LICENSE"
  "README.md"
  "src-tauri/Cargo.toml"
  "src-tauri/Cargo.lock"
  "src-tauri/tauri.conf.json"
  "src-tauri/src/main.rs"
  "src/main.tsx"
  "src/App.tsx"
)

for file in "${REQUIRED_ROOT_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    log_err "Missing required public client file: $file"
  fi
done

# 2. Rejection of forbidden build outputs, caches, or secrets
FORBIDDEN_PATTERNS=(
  "dist"
  "src-tauri/target"
  ".env"
  ".env.local"
  ".env.production"
  "*.pem"
  "*.key"
)

for pat in "${FORBIDDEN_PATTERNS[@]}"; do
  matches=$(find . -maxdepth 3 -name "$pat" ! -path "./.git/*" ! -path "./node_modules/*" 2>/dev/null || true)
  if [ -n "$matches" ]; then
    while IFS= read -r m; do
      log_err "Forbidden build output or secret file detected in public tree: $m"
    done <<< "$matches"
  fi
done

# 3. Check for forbidden private path references or private internal URLs
if [ -f "package.json" ]; then
  if grep -rnEI "(\.\./website|QV_INTERNAL|private_token)" . \
      --exclude-dir=.git \
      --exclude-dir=node_modules \
      --exclude-dir=target \
      --exclude="*.lock" \
      --exclude="verify-source-boundary.sh" \
      2>/dev/null; then
    log_err "Found forbidden private path or token reference in public source tree"
  fi
fi

echo "=========================================================="
if [ "$ERRORS" -eq 0 ]; then
  log_ok "Public Source Boundary check PASSED cleanly."
  echo "=========================================================="
  exit 0
else
  echo "❌ Public Source Boundary check FAILED with $ERRORS error(s)."
  echo "=========================================================="
  exit 1
fi
