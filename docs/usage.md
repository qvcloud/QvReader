# Usage & Keyboard Shortcuts

QvReader is designed around three primary view states. You always begin in **reading mode** (the default and safest view — clicking and selecting will never modify your source files).

## Core Keyboard Shortcuts

| Action / Mode | Shortcut (macOS) | Shortcut (Windows/Linux) | Description |
|---|---|---|---|
| Open File | Double-click `.md`, or `qvreader file.md` | Same | Sub-50ms instant launch |
| Open Folder as Workspace | `qvreader .` | Same | Loads folder drawer sidebar |
| **Inline Edit** | `F2` | `F2` | In-place editing on reading canvas; **100% permanently free** |
| **Split Preview** | `F3` | `F3` | Side-by-side editing; 300 trial sessions, non-blocking |
| Exit / Return to Reading | `Esc` or press `F2`/`F3` again | Same | Returns to clean reading view |
| Save Document | `Cmd + S` | `Ctrl + S` | Preserves LF/CRLF line endings and UTF-8 encoding |
| Print Document | `Cmd + P` | `Ctrl + P` | System native print dialog with ink-friendly layout |
| Export to PDF | `Cmd + Shift + P` | `Ctrl + Shift + P` | High-fidelity vector PDF generation |
| Export to Retina PNG | `Cmd + Shift + E` | `Ctrl + Shift + E` | 2x Retina screenshot with auto-clipboard copy |
| Export to Standalone HTML | `Cmd + Shift + H` | `Ctrl + Shift + H` | Self-contained offline HTML file bundle |
| Toggle Outline Sidebar | `Cmd + Shift + O` | `Ctrl + Shift + O` | Navigate document headings (TOC) |
| Toggle Workspace Sidebar | `Cmd + Shift + W` | `Ctrl + Shift + W` | Browse multi-file folder tree |
| Keyboard Cheat Sheet | `Cmd + /` | `Ctrl + /` | Quick popup shortcut reference |
| Zoom In / Out | `Cmd + Wheel` | `Ctrl + Wheel` | Scales typography and interface |
| Close / Dismiss Window | `Esc` (when unmodified) | `Esc` | Instant dismiss |
| Open Settings Center | `Cmd + ,` | `Ctrl + ,` | Themes, layout modes, font settings |

---

## Reading Mode

- **Default Safety**: Read, scroll, select text, click links, and view embedded images.
- **Screen-Adaptive Layout**: Choose between `adaptive` (896px–1280px fluid), `standard` (896px fixed), or `full` in Settings (`Cmd/Ctrl+,`).
- **Mermaid Zoom Modal**: Double-click any rendered Mermaid diagram to open a full-screen interactive modal supporting click-and-drag panning and wheel zooming.
- **Outline Navigation**: Sidebar (`Cmd/Ctrl+Shift+O`) highlights the current section as you read.
- **Standard Print**: `Cmd/Ctrl+P` opens the system print dialog with optimized margins and ink-saving styles.

---

## Inline Editing (F2)

- **Core Feature, Free Forever**: No trial limits, zero popups.
- Edit directly on the reading canvas at the current cursor position, preserving visual reading context.
- Perfect for quickly fixing typos, updating links, or making minor revisions. Press `Esc` or `F2` to seamlessly return to rendered reading mode.
- Press `Cmd/Ctrl+S` to save, strictly preserving source line endings and encoding.

---

## Split View (F3)

- Left pane: Markdown source editor; right pane: synchronized live preview.
- Input updates the preview in real-time with smart debouncing for fluid typing.
- Scrolling either pane synchronizes the other; the **active cursor line is highlighted in the preview**.
- **Trial Policy**: Includes 300 free trial evaluation sessions. **Never hard-locked upon trial exhaustion**: You can continue using F3 mode freely (a gentle purchase reminder appears when opening new files), and **document editing and saving are never blocked**.

---

## Workspace & Advanced Export (Pro Features)

- **Workspace Drawer** (`Cmd/Ctrl+Shift+W`): Browse and manage entire directories of Markdown files.
- **Advanced Export Pipeline**: Direct PDF export (`Cmd/Ctrl+Shift+P`), 2x Retina PNG export (`Cmd/Ctrl+Shift+E`), and standalone offline HTML export (`Cmd/Ctrl+Shift+H`).
- Community Edition includes 300 trial uses; Pro users enjoy unlimited lifetime access.

---

## Saving & File Safety

- QvReader respects your **source bytes**: line endings (LF/CRLF) and character encoding (UTF-8 with/without BOM) are detected on load and preserved on save.
- If a file is modified externally while open in QvReader, you will be prompted before overwriting.
- Closing or switching modes with unsaved changes prompts to save, discard, or keep editing. **File saving is never locked under any circumstances**.

---

## Installation & Security Trust

- **macOS**: If Gatekeeper shows an unidentified developer warning, right-click `QvReader.app` and choose "Open", or run `xattr -cr /Applications/QvReader.app` in Terminal.
- **Windows**: If SmartScreen appears, click "More info" and select "Run anyway".
