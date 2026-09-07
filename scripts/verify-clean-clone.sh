#!/usr/bin/env bash
# ==============================================================================
# Clean-Clone Validation Harness for QvReader (release/)
# Simulates an external contributor building strictly from public repository.
# ==============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP_DIR="$(mktemp -d -t qvreader-clean-clone-XXXXXX)"

cleanup() {
  echo "--- Cleaning up temporary clean clone: $TEMP_DIR ---"
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo "=========================================================="
echo " Starting Clean-Clone Validation Harness"
echo " Working Directory: $TEMP_DIR"
echo " Source Repo: $REPO_ROOT"
echo "=========================================================="

# 1. Clone local release repository into hermetic sandbox
git clone --depth 1 "file://$REPO_ROOT" "$TEMP_DIR/qvreader"
cd "$TEMP_DIR/qvreader"

# 2. Verify source boundary
if [ -f "./scripts/verify-source-boundary.sh" ]; then
  echo "--- Step 1/5: Verifying source boundary ---"
  chmod +x ./scripts/verify-source-boundary.sh
  ./scripts/verify-source-boundary.sh
else
  echo "❌ Error: ./scripts/verify-source-boundary.sh missing from public repository" >&2
  exit 1
fi

# 3. Verify dependency installation using locked files
echo "--- Step 2/5: Installing dependencies via npm ci ---"
npm ci --ignore-scripts

# 4. Run sequential tests and builds
echo "--- Step 3/5: Building frontend dist ---"
npm run build

echo "--- Step 4/5: Running test suite ---"
npm test -- --run

echo "--- Step 5/5: Running native locked tests ---"
cargo test --manifest-path src-tauri/Cargo.toml --locked

echo "=========================================================="
echo "✅ Clean clone build and test pipeline PASSED completely!"
echo "=========================================================="
