# Features & Capabilities

A concise and transparent overview of what QvReader does today, and what it intentionally avoids.

## Product Philosophy

QvReader is an **ultra-lightweight, high-speed, document-first Markdown reader** with just enough editing power.
It addresses the frequent scenario of "quickly opening a README, an AI-generated code doc, or a local note" — open it, read it like a clean web page, make in-place tweaks when needed, and press `Esc` to dismiss. It is **not** an IDE, a personal knowledge management graph, a cloud database, or a complex CMS.

Core values (from the project constitution):

1. Fast to open, minimal bundle footprint (~5MB native binary, <50ms cold launch).
2. Clean, distraction-free reading canvas without clutter.
3. Reading is default; editing is explicit, preventing accidental modifications.
4. Editing is powerful enough for genuine edits without becoming a heavy editor.
5. Local files, local-first: no internet connection required, 100% private.

---

## Editions & Feature Matrix

### Community Edition (Permanently Free)

- **Instant High-Performance Reading**: Full CommonMark / GFM support, <50ms cold launch, minimal memory usage. Smoothly handles 50,000+ line documents at 60 FPS.
- **Screen-Adaptive Fluid Layout**: Dynamic responsive reading width (896px–1280px) with 3 selectable modes (`adaptive`, `standard`, `full`) in Settings.
- **Source Byte Fidelity**: The source file remains the canonical truth. Line endings (LF/CRLF), encodings (UTF-8/BOM), and unsupported syntax are strictly preserved.
- **F2 Inline Editing (Core Feature, Free Forever)**: Powered by CodeMirror 6, edits right on the reading canvas with zero paywalls or quotas.
- **F3 Synchronized Split View**: Side-by-side editing and live preview. Comes with 300 free trial evaluation sessions; **never locked out after exhaustion** (a gentle purchase reminder appears when opening new files), and **document editing and saving are never blocked**.
- **Engineering Diagrams & Math**: Native Mermaid diagram rendering and KaTeX inline/block LaTeX formulas. Includes an **interactive double-click Mermaid zoom modal** with panning, dragging, and full-screen inspection.
- **Document Navigation**: Outline sidebar (TOC), right-click context menu, built-in themes, and font size scaling.
- **Native System Print**: `Cmd/Ctrl+P` launches the system print dialog with ink-friendly, margin-optimized styling.
- **Cross-Platform CLI**: Launch files or directories from terminal (`qvreader <file>` / `qvreader .`).
- **Full Internationalization**: Built-in support for 6 constitutional languages (English, 简体中文, 日本語, 한국어, Español, Português (Brasil)).

### Pro Edition ($9.99 Lifetime Buyout)

- **Extensive Free Trial**: Community Edition includes 300 evaluation sessions for Pro features without requiring up-front purchase.
- **Workspace File Management**: Drawer sidebar and project tree (`Cmd/Ctrl+Shift+W`) for seamless navigation across multi-file directories.
- **Full Export Pipeline**:
  - **Vector PDF Export** (`Cmd/Ctrl+Shift+P`): Direct high-fidelity PDF generation.
  - **Retina PNG Export** (`Cmd/Ctrl+Shift+E`): 2x Retina full-document screenshot with automatic clipboard copy.
  - **Standalone HTML Export** (`Cmd/Ctrl+Shift+H`): Portable offline single-file HTML bundle.
- **100% Offline Activation & Local-First**: Perpetual license valid for lifetime updates, supporting ≥3 personal devices across macOS and Windows with offline verification and no Pro reminder modals.

---

## Platform Support

| Platform / Architecture | Status | Release Package |
|---|---|---|
| macOS (Apple Silicon / arm64) | Primary Day-One | `QvReader-0.1.4-arm64.dmg` |
| macOS (Intel / x64) | Primary Day-One | `QvReader-0.1.4-x64.dmg` |
| Windows (x64) | Supported via CI | `QvReader-0.1.4-x64-setup.exe` / `.zip` |
| Linux (Debian / AppImage) | Evaluated post-stability | `QvReader-0.1.4-amd64.AppImage` |

---

## Intentionally Excluded Features

To protect QvReader's core mission of being fast, lightweight, and focused, the following are explicitly out of scope:

- Mandatory cloud accounts, online syncing, or remote telemetry.
- Monthly or recurring subscriptions (strictly one-time buyout).
- Blog publishing, social sharing platforms, or web CMS integrations.
- Heavy IDE features or bloated knowledge-graph databases.
- Intrusive popups, aggressive upsell dialogs, or visual badges during reading.

See [roadmap.md](roadmap.md) for planned and completed milestones.
