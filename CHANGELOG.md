# Changelog

All notable changes are tracked here. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.3] - 2026-09-06

### Added
- Smart screen-adaptive reading layout: fluid responsive width (896px–1280px) dynamically optimizes reading comfort across Mac Retina and external wide displays without massive blank side gutters.
- Configurable reading width modes: `adaptive` (screen-responsive), `standard` (compact 768px), and `full` (edge-to-edge), accessible in the Settings Center.
- Full 6-locale key parity: comprehensive multi-language verification across English, 简体中文, 日本語, 한국어, Español, and Português (Brasil).
- Native Mermaid diagram double-click interactive zoom modal.
- Multi-channel export: 2x Retina PNG snapshot with clipboard copy and standalone HTML bundle.

### Changed
- Streamlined right-click context menu: removed redundant appearance, width, and zoom toolbars from the document context menu, consolidating all preferences into the dedicated Settings Center (`⌘,`).
- `F2` inline editing is permanently free with zero trial deductions and zero paywalls.
- `F3` split-view editing includes 20 free uses daily in Community edition with non-blocking guidance beyond quota.
- Pro feature free evaluation trial quota expanded from 100 to 300 sessions (workspace management, diagram rendering, and advanced exports).
- Official website downloads and API manifests synchronized with desktop client v0.1.3.

---

## [1.0.1] - 2026-09-05

### Added
- Native Mermaid diagram rendering with interactive double-click full-screen zoom modal (`DiagramZoomModal`).
- Floating right-click context menu with complete shortcuts and boundary-aware placement.
- Multi-channel export pipeline: native print (`Cmd/Ctrl+P`), direct PDF export (`Cmd/Ctrl+Shift+P`), 2x Retina PNG image export (`Cmd/Ctrl+Shift+E`), and standalone HTML export (`Cmd/Ctrl+Shift+H`).
- Dynamic multi-language sample documents matching active locale across all 6 constitutional languages (`zh`, `en`, `ja`, `ko`, `es`, `pt-BR`).
- Client-side tamper-resistant licensing architecture with cryptographic trial checksums, `.sentinel` high-watermark persistence, and monotonic rollback guards.
- Production runtime lockdown: disabled developer tools and stripped test bypass keys from release binaries.
- Dual-channel download accelerator mirror on official website.

### Changed
- `F2` inline editing established as a permanent, 100% free core feature with zero trial deductions and zero paywall interruptions.
- `F3` split-view editing updated with daily 20-usage quota and non-blocking Pro guidance on new files beyond 20 uses.
- Pro feature boundaries refined: 100-session free evaluation trial covers workspace management and advanced exports.
- Official website edition comparison table updated across all 6 locales.

---

## [1.0.0] - 2026-09-04

### Added
- Instant Markdown reading mode — double-click any `.md` file to read.
- `F3` split view: source editor (CodeMirror 6) + live synced preview.
- `F2` inline editing directly on the reading canvas.
- GFM rendering: tables, task lists, strikethrough, blockquotes, code blocks (highlight.js).
- KaTeX math (inline & block).
- Local relative images resolved against the document directory.
- TOC outline with active-heading highlight.
- Light / dark / follow-system themes + presets.
- Adjustable text size.
- External file-change detection with overwrite guard.
- Line-ending (LF/CRLF) & encoding (UTF-8/BOM) fidelity on save.
- Unsaved-change protection on close/exit/mode switch.
- `qvreader` global CLI: open a file or a folder as a workspace.
- Folder workspace with file-tree sidebar.
- Multi-language UI (English, 简体中文, 日本語, 한국어, Português, Español).
- macOS `.dmg`, Windows `.exe`/`.msi`, Linux `.deb`/`.AppImage` via CI.
