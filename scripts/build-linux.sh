#!/usr/bin/env bash
# ==============================================================================
# build-linux.sh — Single-responsibility Linux packaging script (Deb & AppImage)
#
# Usage:
#   ./scripts/build-linux.sh [options]
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

BUNDLE="all"
SKIP_FRONTEND="0"

show_help() {
  cat <<HELP
Usage: $(basename "$0") [OPTIONS]

Compiles and packages the QvReader desktop application for Linux.

Options:
  --bundle <all|deb|appimage>  Package format to produce (default: all)
  --skip-frontend              Skip frontend asset build (npm run build)
  -h, --help                   Show this help message and exit

Artifacts are staged to: release/dist-artifacts/
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --bundle)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --bundle requires an argument." >&2
        exit 2
      fi
      BUNDLE="$2"
      shift 2
      ;;
    --skip-frontend)
      SKIP_FRONTEND="1"
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "❌ Error: Unknown argument '$1'." >&2
      show_help >&2
      exit 2
      ;;
  esac
done

echo "=========================================================="
echo "  QvReader Linux Build & Packaging                       "
echo "  Bundle Target: $BUNDLE                                 "
echo "=========================================================="

# 1. Preflight Validation
if [[ -f "$SCRIPT_DIR/verify-prerequisites.sh" ]]; then
  "$SCRIPT_DIR/verify-prerequisites.sh" --platform linux
fi

# 2. Build frontend assets
if [[ "$SKIP_FRONTEND" != "1" ]]; then
  echo "==> [1/3] Building frontend assets with Vite..."
  npm run build
else
  echo "==> [1/3] Skipping frontend build as requested."
fi

# 3. Determine Tauri bundles
TAURI_BUNDLES="deb,appimage"
case "$BUNDLE" in
  deb) TAURI_BUNDLES="deb" ;;
  appimage) TAURI_BUNDLES="appimage" ;;
  all) TAURI_BUNDLES="deb,appimage" ;;
  *)
    echo "❌ Error: Unsupported bundle format '$BUNDLE'. Use all, deb, or appimage." >&2
    exit 2
    ;;
esac

echo "==> [2/3] Running Tauri Linux build (bundles: $TAURI_BUNDLES)..."
npm run tauri build -- --bundles "$TAURI_BUNDLES"

# 4. Stage artifacts into dist-artifacts/
echo "==> [3/3] Staging Linux packages into dist-artifacts/..."
ARTIFACTS_DIR="$ROOT_DIR/dist-artifacts"
mkdir -p "$ARTIFACTS_DIR"

FOUND_COUNT=0
for ext in deb AppImage; do
  matches=$(find "$ROOT_DIR/src-tauri/target" -name "*.$ext" 2>/dev/null || true)
  if [[ -n "$matches" ]]; then
    while IFS= read -r file; do
      if [[ -f "$file" ]]; then
        cp "$file" "$ARTIFACTS_DIR/"
        file_size=$(ls -lh "$file" | awk '{print $5}')
        echo "  Staged: $ARTIFACTS_DIR/$(basename "$file") ($file_size)"
        FOUND_COUNT=$((FOUND_COUNT + 1))
      fi
    done <<< "$matches"
  fi
done

echo "=========================================================="
if [[ "$FOUND_COUNT" -gt 0 ]]; then
  echo "  Linux Build Succeeded! ($FOUND_COUNT package(s) staged)"
else
  echo "  Linux Build finished, but no .deb or .AppImage files found."
fi
echo "=========================================================="
