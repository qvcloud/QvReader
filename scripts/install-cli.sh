#!/usr/bin/env bash
# ==============================================================================
# install-cli.sh — register `qvreader` as a terminal command
#
# Symlinks the launcher script into a directory on your PATH so you can run
# `qvreader <path>` from anywhere. Defaults to ~/.local/bin.
#
# Usage:
#   ./scripts/install-cli.sh [target_bin_dir]
#   ./scripts/install-cli.sh --help
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$SCRIPT_DIR/qvreader"

show_help() {
  cat <<HELP
Usage: $(basename "$0") [TARGET_BIN_DIR]

Registers the \`qvreader\` CLI command by symlinking into a directory on your PATH.

Arguments:
  TARGET_BIN_DIR   Directory to link \`qvreader\` into (default: \$HOME/.local/bin)

Options:
  -h, --help       Show this help message and exit
HELP
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  show_help
  exit 0
fi

if [[ ! -f "$SRC" ]]; then
  echo "❌ Error: source launcher not found at $SRC" >&2
  exit 1
fi

BIN_DIR="${1:-$HOME/.local/bin}"
mkdir -p "$BIN_DIR" 2>/dev/null || {
  echo "❌ Error: Unable to create or access target directory: $BIN_DIR" >&2
  exit 1
}

chmod +x "$SRC"
DEST="$BIN_DIR/qvreader"
ln -sf "$SRC" "$DEST"
echo "✅ Linked: $DEST -> $SRC"

# Check if BIN_DIR is on PATH
if ! printf '%s' "$PATH" | tr ':' '\n' | grep -qxF "$BIN_DIR"; then
  echo "⚠️  NOTICE: $BIN_DIR is not currently in your \$PATH."
  if [[ -n "${ZSH_VERSION:-}" || "$(basename "${SHELL:-}")" == "zsh" ]]; then
    RC="$HOME/.zshrc"
  else
    RC="$HOME/.bashrc"
  fi
  LINE="export PATH=\"$BIN_DIR:\$PATH\""
  if [[ -w "$RC" ]] 2>/dev/null; then
    if ! grep -qF "qvreader" "$RC" 2>/dev/null; then
      {
        echo ""
        echo "# Added by QvReader install-cli.sh"
        echo "$LINE"
      } >> "$RC" 2>/dev/null || true
      echo "  Appended to $RC: $LINE"
    fi
  else
    echo "  To use \`qvreader\` globally, please add this line to your shell config:"
    echo "    $LINE"
  fi
else
  echo "✅ Target directory $BIN_DIR is already in your \$PATH."
fi

echo ""
echo "QvReader CLI is ready! Usage:"
echo "  qvreader file.md    # open a Markdown file"
echo "  qvreader .          # open current folder as a workspace"
echo "  qvreader --help     # launch QvReader without a file"
