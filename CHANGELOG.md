# Changelog

All notable changes are tracked here. Format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.5] - 2026-09-06

### Added
- On-demand CodeMirror 6 code splitting: `InlineEditor` and `SplitContainer` (~508 kB bundle) dynamically loaded on demand via `React.lazy` and `<Suspense>`, completely excluded from the cold reading critical path.
- Idle background preloader hook (`useEditorPrefetch`): leverages `requestIdleCallback` to preheat editor assets, ensuring instantaneous (<50ms) activation on `F2` (inline) and `F3` (split) triggers.
- Dynamic KaTeX mathematics engine: decoupled ~260 kB KaTeX bundle from startup; standard Markdown documents load 0 KB KaTeX, hydrating asynchronously on demand only when math syntax (`$`) is detected.
- Single-step startup IPC bootstrapping (`get_initial_launch_data`): replaces 3 sequential IPC roundtrips (`getInitialFile` -> `classifyPath` -> `openFile`) with a single frame-1 payload, auto-registering file watcher.
- macOS Finder double-click cold-start synchronization: buffered 75ms synchronization window in Rust event loop completely eliminates `sample.md` placeholder flash.
- Anti-white-flash inline theme probe: `<head>` inline script detects dark mode preferences before first paint; native window visibility synchronized with `showWindow()` IPC.

### Fixed
- Fixed high-resolution PNG image export width mismatch and right-side truncation:
  - Dynamically calculates displayed content width matching screen layout instead of hardcoded 860px clamping.
  - Automatically accounts for container padding in canvas dimensions (`totalWidth = contentWidth + paddingX * 2`), preventing right-side and bottom truncation.
  - Injected anti-truncation export CSS with soft word-wrap (`white-space: pre-wrap !important; word-break: break-word !important;`) and responsive tables (`display: table !important; overflow: visible !important;`) ensuring long code lines and multi-column tables are 100% visible.

---

## [0.1.4] - 2026-09-06

### Added
- Automated bundle size budget and performance test harness (`bundle_budget.test.ts`, `markdown_math.test.ts`, `syntax_highlight.test.ts`, `export_pipeline.test.ts`) guarding against bundle bloat and ensuring sub-50ms cold document render latency.
- Tailored WOFF2-only KaTeX typography stylesheet (`katex-woff2.css`) providing full mathematical coverage with zero legacy format overhead.

### Changed
- Major client package and distribution footprint optimization:
  - Frontend static assets directory (`dist/`) reduced by 28.1% (from 6.75 MB down to 4.67 MB, shaving off 1.91 MB).
  - Main JavaScript entry bundle (`index.js`) reduced by 64.3% (from 1.72 MB down to 614 KB).
  - Web font assets reduced by 77.7% (from 1,150 KB down to 256 KB), completely eliminating 40 redundant `.ttf` and `.woff` duplicates.
  - Syntax highlighting refactored to `highlight.js/lib/common`, shedding ~150 unused language grammars while preserving complete fidelity across 38 core languages.
  - Heavy canvas export dependencies (`html-to-image`) decoupled into an asynchronous chunk (12 KB), removing export overhead from initial boot.
  - Rust native release compilation profile switched to `opt-level = "z"` for optimal executable compactness.
  - Windows NSIS installer configured with solid LZMA compression (`compression: "lzma"`).

---

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
- `F3` split-view editing includes 300 free trial evaluation sessions in Community edition; remains accessible without hard-locking after trial exhaustion (non-blocking Pro purchase prompt upon file change; document saving never blocked).
- Pro feature free evaluation trial quota expanded to 300 sessions (workspace management, diagram rendering, and advanced exports).
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
