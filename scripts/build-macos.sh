#!/usr/bin/env bash
# ==============================================================================
# build-macos.sh — Single-responsibility macOS build and DMG packaging script
#
# Usage:
#   ./scripts/build-macos.sh [options]
# ==============================================================================
set -euo pipefail

export PATH="/opt/homebrew/bin:$HOME/.cargo/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ARCH="auto"
SKIP_FRONTEND="0"

show_help() {
  cat <<HELP
Usage: $(basename "$0") [OPTIONS]

Compiles and packages the QvReader desktop application for macOS.

Options:
  --arch <universal|native|aarch64|x86_64>  Target architecture (default: universal if rustup supports both targets, otherwise native)
  --skip-frontend                           Skip frontend asset build (npm run build)
  -h, --help                                Show this help message and exit

Artifacts are staged to: release/dist-artifacts/
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --arch)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --arch requires an argument." >&2
        exit 2
      fi
      ARCH="$2"
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
echo "  QvReader macOS Build & Packaging                       "
echo "=========================================================="

# 1. Preflight Validation
if [[ -f "$SCRIPT_DIR/verify-prerequisites.sh" ]]; then
  "$SCRIPT_DIR/verify-prerequisites.sh" --platform macos
fi

# 2. Build frontend assets if requested
if [[ "$SKIP_FRONTEND" != "1" ]]; then
  echo "==> [1/3] Building frontend assets with Vite..."
  npm run build
else
  echo "==> [1/3] Skipping frontend build as requested."
fi

# 3. Determine Rust build target
BUILD_FLAGS=()
if [[ "$ARCH" == "universal" ]]; then
  echo "==> [2/3] Building Universal macOS Binary (Intel x86_64 + Apple Silicon arm64)..."
  if command -v rustup >/dev/null 2>&1; then
    rustup target add aarch64-apple-darwin x86_64-apple-darwin || true
  fi
  BUILD_FLAGS=(--target universal-apple-darwin)
elif [[ "$ARCH" == "aarch64" ]]; then
  echo "==> [2/3] Building Apple Silicon native binary (aarch64-apple-darwin)..."
  BUILD_FLAGS=(--target aarch64-apple-darwin)
elif [[ "$ARCH" == "x86_64" ]]; then
  echo "==> [2/3] Building Intel native binary (x86_64-apple-darwin)..."
  BUILD_FLAGS=(--target x86_64-apple-darwin)
else
  # auto mode
  if command -v rustup >/dev/null 2>&1; then
    echo "==> rustup detected. Preparing Universal Binary targets..."
    rustup target add aarch64-apple-darwin x86_64-apple-darwin 2>/dev/null || true
    echo "==> [2/3] Building Universal macOS Binary (Intel x86_64 + Apple Silicon arm64)..."
    BUILD_FLAGS=(--target universal-apple-darwin)
  else
    NATIVE_ARCH=$(uname -m)
    echo "==> [2/3] Building native macOS binary ($NATIVE_ARCH)..."
  fi
fi

# 4. Execute Tauri Build
echo "==> Executing npm run tauri build ${BUILD_FLAGS[*]}..."
if [[ ${#BUILD_FLAGS[@]} -gt 0 ]]; then
  npm run tauri build -- "${BUILD_FLAGS[@]}"
else
  npm run tauri build
fi

# 5. Stage artifacts into dist-artifacts/
echo "==> [3/3] Packaging and staging macOS artifacts..."
ARTIFACTS_DIR="$ROOT_DIR/dist-artifacts"
mkdir -p "$ARTIFACTS_DIR"

DMG_PATH=$(find "$ROOT_DIR/src-tauri/target" -name "*.dmg" ! -name "rw.*" 2>/dev/null | head -n 1 || true)
APP_PATH=$(find "$ROOT_DIR/src-tauri/target" -name "*.app" -type d 2>/dev/null | head -n 1 || true)

if [[ -z "$DMG_PATH" && -n "$APP_PATH" ]]; then
  echo "==> Packaging optimized compressed DMG (UDZO) using hdiutil..."
  STAGE_DIR="$ROOT_DIR/src-tauri/target/stage_dmg"
  rm -rf "$STAGE_DIR"
  mkdir -p "$STAGE_DIR"
  cp -r "$APP_PATH" "$STAGE_DIR/"
  ln -s /Applications "$STAGE_DIR/Applications"
  OUTPUT_DMG="$ARTIFACTS_DIR/QvReader-macOS.dmg"
  rm -f "$OUTPUT_DMG"
  hdiutil create -volname "QvReader" -srcfolder "$STAGE_DIR" -ov -format UDZO "$OUTPUT_DMG"
  rm -rf "$STAGE_DIR"
  DMG_PATH="$OUTPUT_DMG"
elif [[ -n "$DMG_PATH" ]]; then
  cp "$DMG_PATH" "$ARTIFACTS_DIR/"
  DMG_PATH="$ARTIFACTS_DIR/$(basename "$DMG_PATH")"
fi

if [[ -n "$APP_PATH" ]]; then
  rm -rf "$ARTIFACTS_DIR/$(basename "$APP_PATH")"
  cp -r "$APP_PATH" "$ARTIFACTS_DIR/"
fi

echo "=========================================================="
echo "  macOS Build Succeeded! 🎉                               "
echo "=========================================================="
if [[ -n "$DMG_PATH" && -f "$DMG_PATH" ]]; then
  DMG_SIZE=$(ls -lh "$DMG_PATH" | awk '{print $5}')
  echo "  DMG Package: $DMG_PATH ($DMG_SIZE)"
fi
if [[ -n "$APP_PATH" ]]; then
  echo "  App Bundle:  $ARTIFACTS_DIR/$(basename "$APP_PATH")"
fi
echo "=========================================================="
