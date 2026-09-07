#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  QvReader macOS Client Build Script     "
echo "=========================================="

export PATH="/opt/homebrew/bin:$HOME/.cargo/bin:$PATH"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# 1. Build frontend assets
echo "==> Building frontend assets with Vite..."
npm run build

# 2. Check Universal Binary support
BUILD_TARGET=""
if command -v rustup >/dev/null 2>&1; then
    echo "==> rustup detected. Ensuring both Apple Silicon and Intel targets are installed..."
    rustup target add aarch64-apple-darwin x86_64-apple-darwin || true
    echo "==> Building Universal macOS Binary (Intel x86_64 + Apple Silicon arm64)..."
    BUILD_TARGET="--target universal-apple-darwin"
else
    NATIVE_ARCH=$(uname -m)
    echo "==> Building native macOS binary ($NATIVE_ARCH)..."
fi

# 3. Run Tauri Build
if [ -n "$BUILD_TARGET" ]; then
    npm run tauri build -- $BUILD_TARGET || true
else
    npm run tauri build || true
fi

# 4. Locate or create final compressed DMG
DMG_PATH=$(find "$ROOT_DIR/src-tauri/target" -name "*.dmg" ! -name "rw.*" 2>/dev/null | head -n 1)
APP_PATH=$(find "$ROOT_DIR/src-tauri/target" -name "*.app" -type d 2>/dev/null | head -n 1)

if [ -z "$DMG_PATH" ] && [ -n "$APP_PATH" ]; then
    echo "==> Packaging optimized compressed DMG (UDZO)..."
    STAGE_DIR="$ROOT_DIR/src-tauri/target/stage_dmg"
    rm -rf "$STAGE_DIR"
    mkdir -p "$STAGE_DIR"
    cp -r "$APP_PATH" "$STAGE_DIR/"
    ln -s /Applications "$STAGE_DIR/Applications"
    OUTPUT_DMG="$ROOT_DIR/src-tauri/target/release/bundle/dmg/QvReader.dmg"
    rm -f "$OUTPUT_DMG"
    mkdir -p "$(dirname "$OUTPUT_DMG")"
    hdiutil create -volname "QvReader" -srcfolder "$STAGE_DIR" -ov -format UDZO "$OUTPUT_DMG"
    rm -rf "$STAGE_DIR"
    DMG_PATH="$OUTPUT_DMG"
fi

if [ -n "$DMG_PATH" ]; then
    echo ""
    echo "=========================================="
    echo "  macOS Build Succeeded! 🎉               "
    echo "=========================================="
    echo "DMG Bundle: $DMG_PATH"
    if [ -n "$APP_PATH" ]; then
        echo "App Bundle: $APP_PATH"
    fi
fi
