#!/usr/bin/env bash
# ==============================================================================
# build-client.sh — Cross-platform client build dispatcher for QvReader
#
# Usage:
#   ./scripts/build-client.sh [macos|linux|windows] [options]
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

PLATFORM="auto"
DO_CLEAN="0"
FORWARD_ARGS=()

show_help() {
  cat <<HELP
Usage: $(basename "$0") [PLATFORM] [OPTIONS]

Cross-platform builder for the QvReader desktop client.
Detects your current operating system or targets a specific platform script.

Platforms:
  macos                        Build macOS DMG and application bundle
  linux                        Build Linux .deb and .AppImage packages
  windows                      Build Windows .exe (NSIS) and .msi packages
  (omitted)                    Auto-detect current platform

Options:
  --clean                      Clean previous build artifacts before building
  --skip-frontend              Skip frontend asset build (npm run build)
  -h, --help                   Show this help message and exit

Forwarded options:
  Additional options (e.g. --arch, --bundle) are passed to the platform script.
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    macos|linux|windows)
      PLATFORM="$1"
      shift
      ;;
    --clean)
      DO_CLEAN="1"
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      FORWARD_ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ "$PLATFORM" == "auto" ]]; then
  OS="$(uname -s)"
  case "$OS" in
    Darwin*) PLATFORM="macos" ;;
    Linux*) PLATFORM="linux" ;;
    MINGW*|MSYS*|CYGWIN*) PLATFORM="windows" ;;
    *)
      echo "❌ Unsupported operating system: $OS" >&2
      exit 1
      ;;
  esac
fi

if [[ "$DO_CLEAN" == "1" ]]; then
  echo "==> Cleaning previous build outputs..."
  rm -rf "$ROOT_DIR/dist-artifacts" "$ROOT_DIR/dist"
fi

mkdir -p "$ROOT_DIR/dist-artifacts"

case "$PLATFORM" in
  macos)
    TARGET_SCRIPT="$SCRIPT_DIR/build-macos.sh"
    ;;
  linux)
    TARGET_SCRIPT="$SCRIPT_DIR/build-linux.sh"
    ;;
  windows)
    TARGET_SCRIPT="$SCRIPT_DIR/build-windows.sh"
    ;;
  *)
    echo "❌ Unknown platform '$PLATFORM'." >&2
    exit 2
    ;;
esac

if [[ ! -x "$TARGET_SCRIPT" ]]; then
  chmod +x "$TARGET_SCRIPT"
fi

echo "==> Delegating build to: $TARGET_SCRIPT ${FORWARD_ARGS[*]:-}"
exec "$TARGET_SCRIPT" "${FORWARD_ARGS[@]}"
