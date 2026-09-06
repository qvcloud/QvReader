# Roadmap

A transparent view of what QvReader is planning, what has been delivered, and what is intentionally excluded.
Only features that pass strict specification gates and are proven not to harm launch speed, binary size, Markdown fidelity, or the core reading experience will be built.

---

## Completed Milestones (v0.1.0 ~ v0.1.4)

- [x] **Extreme Performance & Bundle Optimization (v0.1.4)**: ~5MB native binary, 614KB JS entry bundle, 100% WOFF2 mathematics typography, <50ms cold startup, 50,000+ lines at 60 FPS smooth scrolling.
- [x] **Screen-Adaptive Fluid Layout Engine (v0.1.3)**: Dynamic responsive width (896px–1280px) eliminating wide monitor blank gutters, with 3 selectable modes (`adaptive`, `standard`, `full`).
- [x] **Mermaid Interactive Full-Screen Zoom Modal (v0.1.3)**: Native rendering of flowcharts, sequence diagrams, and architecture graphs with double-click full-screen zoom, pan, and drag modal.
- [x] **4-Way Multi-Channel Export Pipeline (v0.1.3)**: Native ink-friendly print, high-fidelity vector PDF, 2x Retina PNG with auto-clipboard sync, and standalone self-contained offline HTML.
- [x] **Minimal Core Interaction Contract (v0.1.0)**: Instant reading mode on `.md` double-click, `Esc` to close, `F2` inline editing on canvas, `F3` live synchronized split view.
- [x] **Source Byte Fidelity & Safe Saving (v0.1.0)**: Preserves LF/CRLF line endings and UTF-8 encoding, external file change conflict detection, and unsaved change guards.
- [x] **Complete 6-Language Localization (v0.1.0 ~ v0.1.3)**: Full parity across English, 简体中文, 日本語, 한국어, Español, and Português (Brasil).

---

## Upcoming Candidates (v0.1.5+)

- 🔄 **Code Signing & Notarization Integration**: Official Apple Developer ID signing and notarization (eliminating Gatekeeper prompts) and Windows SignPath open-source code signing certificates.
- 🔄 **Automatic Update Notifications**: Lightweight silent check against GitHub Releases on launch, presenting release notes and non-intrusive update options.
- 🔄 **Code Block Enhancements**: Optional line numbering toggle, copy-to-clipboard animation feedback, and large code block folding.
- 🔄 **Linux Distribution Packages**: Expanding official Flatpak and Snap package distribution channels.

---

## Intentionally Excluded Features

To protect QvReader's core mission of being fast, lightweight, and focused, the following are explicitly out of scope:

- Mandatory cloud synchronization, remote drive syncing, or remote Git management (strictly Local-First).
- Monthly or recurring subscriptions (strictly one-time buyout).
- Blog publishing, social sharing integrations, or web CMS platforms.
- Heavy IDE functionality or bloated knowledge graphs.
- Silent file association takeovers.
- Intrusive advertisements or visually noisy badges during reading.

Feature discussions happen openly on the [GitHub Issues Tracker](https://github.com/qvcloud/QvReader/issues).
