# Features

A concise, honest description of what QvReader does today and what it deliberately does not.

## Product position

QvReader is a **lightweight, fast, document-first Markdown reader** with just enough editing.
It targets the "read a README / AI-generated doc / local note quickly" moment — open it, read
it like a web page, edit on the spot if needed, close with `Esc`. It is **not** an IDE, a
knowledge-base, a cloud-synced vault, or a full CMS.

Core values (from the project charter):

1. Fast to open, small to install.
2. Clean reading surface, no clutter.
3. Reading is the default; editing is explicit so you can't accidentally change source.
4. Editing is enough for real fixes, never a heavy editor.
5. Local files, local-first, no required account or cloud.

## Feature Tiers & Edition Matrix

### Community Edition (100% Free Forever)

- **Instant High-Fidelity Reading**: Full CommonMark / GFM typography, <50ms cold launch, ultralow memory footprint.
- **Byte-Preserving Source Fidelity**: Source file is the sole source of truth. Unknown syntax, line endings (LF/CRLF), and character encodings (UTF-8/BOM) are preserved completely intact.
- **F2 In-Place Inline Edit (Core Feature, 100% Free)**: CodeMirror 6 powered editing right on the canvas. No trial count deductions, no popups, no restrictions.
- **F3 Real-Time Split View**: 20 free daily uses; exceeding 20 uses triggers a gentle, non-blocking Pro suggestion on new files, leaving split-view editing and live preview unrestricted upon dismissal.
- **Engineering Diagrams & Math**: Native Mermaid.js diagrams, KaTeX block and inline LaTeX math typesetting.
- **Reading Navigation & Interaction**: Floating right-click context menu, table of contents (TOC) outline drawer, pre-configured themes, and font zooming.
- **Native OS Printing**: Dedicated `@media print` layout invoked via `Cmd/Ctrl+P`, optimized for paper margins and ink economy.
- **Cross-Platform CLI**: Direct invocation from terminal (`qvreader <file>` / `qvreader .`).
- **Complete Internationalization**: Native support for 6 constitutional languages (English, 简体中文, 日本語, 한국어, Español, Português).

### Pro Edition ($9.99 USD One-Time Lifetime Buyout)

- **Evaluation Trial**: Community Edition comes with a 300-session free evaluation quota for Pro features to test directly on your local files.
- **Workspace Management**: Folder tree drawer (`Cmd/Ctrl+Shift+W`) to seamlessly browse and organize multi-document projects.
- **Advanced Export Pipeline**:
  - **Direct PDF Export** (`Cmd/Ctrl+Shift+P`): Guided direct PDF export process.
  - **High-Resolution PNG Image Export** (`Cmd/Ctrl+Shift+E`): 2x Retina pixel-perfect full-document image export with automatic clipboard copy.
  - **Standalone Self-Contained HTML Export** (`Cmd/Ctrl+Shift+H`): Self-contained offline HTML file with embedded styles and engines for portable sharing.
- **100% Offline Local Activation**: Lifetime license with ≥3 personal devices, authenticated locally with cryptographic signatures and zero cloud telemetry.

## Cross-platform

| Platform | Status |
|---|---|
| macOS (Apple Silicon + Intel, universal) | Primary, supported |
| Windows (x64) | Supported via CI |
| Linux (Debian / AppImage) | Evaluated after core stability |

## Explicitly out of scope

The project charter excludes the following to protect the "fast, small, focused" identity:

- Mandatory online connection and cloud content sync (strict adherence to Local-First principles; documents never leave your machine).
- Mandatory recurring monthly subscriptions (fair, transparent one-time lifetime buyout).
- Blog publishing, social-media formatting, or generic CMS platforms.
- Bloating into a heavy IDE or bulky knowledge base competing with VS Code or Obsidian.
- Forcing or silently setting default operating system file associations.
- Disruptive ads, sponsored banners, or visual noise (such as `PRO` badges) in the reading interface.

See also [roadmap.md](roadmap.md) for candidate future work.
