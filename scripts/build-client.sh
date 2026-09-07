#!/usr/bin/env bash
set -e

OS="$(uname -s)"

case "$OS" in
    Darwin*)
        echo "Detected macOS environment."
        ./scripts/build-macos.sh
        ;;
    Linux*)
        echo "Detected Linux environment. Building .deb and .AppImage..."
        npm run tauri build
        ;;
    MINGW*|MSYS*|CYGWIN*)
        echo "Detected Windows environment. Building .msi and .exe..."
        npm run tauri build
        ;;
    *)
        echo "Unknown operating system: $OS"
        exit 1
        ;;
esac
