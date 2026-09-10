#!/usr/bin/env bash
# ==============================================================================
# verify-prerequisites.sh — Preflight toolchain & target validator for QvReader
#
# Usage:
#   ./scripts/verify-prerequisites.sh [--platform macos|linux|windows|auto]
# ==============================================================================
set -euo pipefail

PLATFORM="auto"

show_help() {
  cat <<HELP
Usage: $(basename "$0") [OPTIONS]

Validates the local developer and CI toolchains required to build QvReader.

Options:
  --platform <macos|linux|windows|auto>  Validate prerequisites for a specific platform (default: auto)
  -h, --help                             Show this help message and exit

Exit codes:
  0  All required tools and targets are installed and verified.
  1  One or more required tools are missing.
  2  Invalid command-line arguments.
HELP
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --platform)
      if [[ -z "${2:-}" ]]; then
        echo "❌ Error: --platform requires an argument." >&2
        exit 2
      fi
      PLATFORM="$2"
      shift 2
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

ERRORS=0
WARNINGS=0

log_pass() {
  echo "✅ $1"
}

log_warn() {
  echo "⚠️  $1"
  WARNINGS=$((WARNINGS + 1))
}

log_fail() {
  echo "❌ $1" >&2
  ERRORS=$((ERRORS + 1))
}

echo "=========================================================="
echo " QvReader Toolchain Preflight Validator"
echo " Target Platform: $PLATFORM"
echo "=========================================================="

# 1. Node.js & NPM
echo "Checking Node.js & NPM..."
if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node -v | sed 's/^v//')
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
  if [[ "$NODE_MAJOR" -ge 18 ]]; then
    log_pass "Node.js $NODE_VER detected (>= 18 required)."
  else
    log_fail "Node.js version $NODE_VER is too old. Node.js 18+ (20+ recommended) is required."
  fi
else
  log_fail "Node.js is not installed. Please install Node.js 20+: https://nodejs.org"
fi

if command -v npm >/dev/null 2>&1; then
  log_pass "npm $(npm -v) detected."
else
  log_fail "npm is not installed."
fi

# 2. Rust & Cargo
echo "Checking Rust toolchain..."
if command -v cargo >/dev/null 2>&1 && command -v rustc >/dev/null 2>&1; then
  RUSTC_VER=$(rustc --version)
  log_pass "$RUSTC_VER detected."
else
  log_fail "Rust / Cargo not found. Install Rust via https://rustup.rs"
fi

# 3. Platform-specific checks
case "$PLATFORM" in
  macos)
    echo "Checking macOS build prerequisites..."
    if command -v xcode-select >/dev/null 2>&1 && xcode-select -p >/dev/null 2>&1; then
      log_pass "Xcode Command Line Tools installed."
    else
      log_fail "Xcode Command Line Tools not found. Run: xcode-select --install"
    fi

    if command -v hdiutil >/dev/null 2>&1; then
      log_pass "macOS disk utility (hdiutil) available."
    else
      log_fail "hdiutil is required to produce compressed DMG packages."
    fi

    if command -v rustup >/dev/null 2>&1; then
      INSTALLED_TARGETS=$(rustup target list --installed)
      if echo "$INSTALLED_TARGETS" | grep -q "aarch64-apple-darwin" && echo "$INSTALLED_TARGETS" | grep -q "x86_64-apple-darwin"; then
        log_pass "Both Apple Silicon (aarch64) and Intel (x86_64) Rust targets installed (Universal Binary ready)."
      else
        log_warn "Universal binary targets missing. For universal macOS build, run: rustup target add aarch64-apple-darwin x86_64-apple-darwin"
      fi
    else
      log_warn "rustup not detected. Universal binary building might be limited to host native architecture."
    fi
    ;;

  linux)
    echo "Checking Linux build prerequisites..."
    if command -v pkg-config >/dev/null 2>&1; then
      log_pass "pkg-config available."
    else
      log_fail "pkg-config is required. Install via: sudo apt-get install -y pkg-config"
    fi

    MISSING_PKGS=()
    for pkg in libwebkit2gtk-4.1 libappindicator3-0.1 librsvg-2.0; do
      if ! pkg-config --exists "$pkg" 2>/dev/null; then
        # Check fallback webkit2gtk-4.0
        if [[ "$pkg" == "libwebkit2gtk-4.1" ]] && pkg-config --exists "libwebkit2gtk-4.0" 2>/dev/null; then
          log_pass "libwebkit2gtk-4.0 detected as fallback."
        else
          MISSING_PKGS+=("$pkg")
        fi
      else
        log_pass "$pkg development headers found."
      fi
    done

    if [[ ${#MISSING_PKGS[@]} -gt 0 ]]; then
      log_warn "Some Linux dev libraries were not detected via pkg-config (${MISSING_PKGS[*]}). Ensure libwebkit2gtk-4.1-dev, libappindicator3-dev, and librsvg2-dev are installed."
    fi
    ;;

  windows)
    echo "Checking Windows build prerequisites..."
    if command -v makensis >/dev/null 2>&1; then
      log_pass "NSIS (makensis) detected."
    else
      log_warn "NSIS compiler (makensis) not detected in PATH. NSIS installer (.exe) packaging requires NSIS."
    fi
    ;;
esac

echo "=========================================================="
if [[ "$ERRORS" -gt 0 ]]; then
  echo "❌ Preflight verification FAILED with $ERRORS error(s) and $WARNINGS warning(s)." >&2
  exit 1
elif [[ "$WARNINGS" -gt 0 ]]; then
  echo "⚠️  Preflight verification PASSED with $WARNINGS warning(s)."
  exit 0
else
  echo "✅ Preflight verification PASSED! All prerequisites satisfied."
  exit 0
fi
