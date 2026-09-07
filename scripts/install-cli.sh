#!/usr/bin/env bash
#
# install-cli.sh — register `qvreader` as a global terminal command.
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT_DIR/scripts/qvreader"

if [[ ! -f "$SRC" ]]; then
  echo "install-cli: source launcher not found at $SRC" >&2
  exit 1
fi

BIN_DIR="${1:-$HOME/.local/bin}"
mkdir -p "$BIN_DIR"

chmod +x "$SRC"
DEST="$BIN_DIR/qvreader"
ln -sf "$SRC" "$DEST"
echo "Linked: $DEST -> $SRC"

# Ensure BIN_DIR is on PATH
if ! printf '%s' "$PATH" | tr ':' '\n' | grep -qxF "$BIN_DIR"; then
  echo "NOTICE: $BIN_DIR is not on your PATH."
  if [[ -n "${ZSH_VERSION:-}" || "$(basename "${SHELL:-}")" == "zsh" ]]; then
    RC="$HOME/.zshrc"
    LINE="export PATH=\"$BIN_DIR:\$PATH\""
  else
    RC="$HOME/.bashrc"
    LINE="export PATH=\"$BIN_DIR:\$PATH\""
  fi
  if [[ -f "$RC" ]] && grep -qF "qvreader" "$RC"; then
    echo "PATH line already present in $RC (skipped append)."
  else
    {
      echo ""
      echo "# Added by QvReader install-cli.sh (qvreader terminal command)"
      echo "$LINE"
    } >> "$RC"
    echo "Appended to $RC: $LINE"
    echo "Run \`source $RC\` (or open a new terminal) to start using \`qvreader\`."
  fi
else
  echo "OK: $BIN_DIR already on PATH."
fi

echo ""
echo "Done. Usage:"
echo "  qvreader file.md    # open a Markdown file"
echo "  qvreader .          # open current folder as a workspace"
echo "  qvreader --help     # launch QvReader without a file"
