<div align="center">

<img src="assets/logo.png" alt="QvReader" width="128" height="128" />

# QvReader

**Ultra-lightweight, instant Markdown reader and editor for macOS and Windows**

Open a `.md` file and read it like a clean web page — sub-50ms cold launch, instantaneous response. Distraction-free and document-focused.  
Press `F2` to edit inline, press `F3` for live synchronized split preview. Hit `Esc` when finished to close instantly.

[![Version](https://img.shields.io/badge/Desktop-v0.1.4-blue.svg)](https://github.com/qvcloud/QvReader/releases/tag/v0.1.4)
[![Website](https://img.shields.io/badge/Website-v1.0.8-emerald.svg)](https://qvreader.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-orange.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](#downloads--mirrors)

</div>

**Languages:** [English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md)

---

## Why QvReader?

Most Markdown editors are built for heavy document authoring or complex networked databases. QvReader is built specifically for **instant reading and lightweight editing of local Markdown files** — READMEs, AI-generated code documentation, technical specifications, meeting notes, and release announcements.

- ⚡ **Ultra-Fast Native Performance**: Powered by Rust and Tauri, with a ~5MB compact binary footprint, a 614KB JS entry bundle, and sub-50ms cold startup. Effortlessly renders 50,000+ line documents at 60 FPS smooth scrolling.
- 📐 **Screen-Adaptive Fluid Layout**: Dynamic width management (896px–1280px) eliminating excessive margin whitespace on wide monitors, offering 3 layout modes: `adaptive`, `standard`, and `full`.
- 📊 **Mermaid Diagram Zoom Modal**: Native rendering of flowcharts, sequence diagrams, and architecture graphs with an interactive double-click modal for panning, dragging, and full-screen inspection.
- 📤 **4-Way Export Pipeline**: Ink-friendly Print (`Cmd/Ctrl+P`), high-fidelity vector PDF (`Cmd/Ctrl+Shift+P`), 2x Retina PNG with auto-clipboard sync (`Cmd/Ctrl+Shift+E`), and standalone self-contained offline HTML (`Cmd/Ctrl+Shift+H`).
- 🔒 **Local-First & Pure Privacy**: Your documents never leave your local disk. No internet connection required, zero document telemetry, and no mandatory account sign-up.
- ⌨️ **Minimal Interaction Contract**: Double-click `.md` to open instantly in reading mode; press `Esc` to close; press `F2` to edit inline; press `F3` for live split preview.

---

## Downloads & Mirrors

Download the v0.1.4 installer from GitHub Releases or verified high-speed CDN mirrors:

| Platform / Architecture | Package File | Official GitHub Releases | Fast Mirror 1 (ghfast) | Fast Mirror 2 (gh-proxy) |
|---|---|---|---|---|
| **macOS** (Apple Silicon) | `QvReader-0.1.4-arm64.dmg` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [Fast Mirror](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) | [Alternate](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-arm64.dmg) |
| **macOS** (Intel x64) | `QvReader-0.1.4-x64.dmg` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [Fast Mirror](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) | [Alternate](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64.dmg) |
| **Windows** (x64 Installer) | `QvReader-0.1.4-x64-setup.exe` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [Fast Mirror](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) | [Alternate](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-x64-setup.exe) |
| **Windows** (x64 Portable) | `QvReader-0.1.4-windows-x64.zip` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [Fast Mirror](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) | [Alternate](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-windows-x64.zip) |
| **Linux** (x64 AppImage) | `QvReader-0.1.4-amd64.AppImage` | [Download](https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [Fast Mirror](https://ghfast.top/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) | [Alternate](https://gh-proxy.com/https://github.com/qvcloud/QvReader/releases/download/v0.1.4/QvReader-0.1.4-amd64.AppImage) |

Checksums and earlier versions are available on the [GitHub Releases Page](https://github.com/qvcloud/QvReader/releases).

---

## Installation & Security Trust Guidance

QvReader community packages are built with full transparency via GitHub Actions CI with published SHA256 checksums. Until official commercial EV code signing certificates are applied, OS security tools may show an unsigned developer dialog. Please follow these simple steps to trust and launch the application:

### macOS (Apple Gatekeeper)

If macOS shows: *"QvReader cannot be opened because the developer cannot be verified"* or *"The app is damaged and can’t be opened"*:

1. **GUI Quick Trust**:
   - Drag `QvReader.app` into `/Applications`.
   - **Right-click** (or Control-click) `QvReader.app` and choose **Open**.
   - In the system prompt dialog, click **Open**. The app will launch and will not prompt again.
2. **Terminal One-Liner (Recommended)**:
   ```bash
   xattr -cr /Applications/QvReader.app
   ```

### Windows (Microsoft Defender SmartScreen)

If Windows displays a blue modal stating: *"Windows protected your PC"*:

1. Click the **"More info"** link inside the dialog.
2. Click the **"Run anyway"** button that appears in the bottom right corner.

---

## Key Shortcuts

| Action / Mode | Shortcut (macOS) | Shortcut (Windows/Linux) | Description |
|---|---|---|---|
| **Inline Edit** | `F2` | `F2` | In-place editing on the reading canvas; **100% permanently free** |
| **Split Preview** | `F3` | `F3` | Side-by-side source code and live synchronized preview |
| **Exit / Close** | `Esc` | `Esc` | Exits edit mode; immediately closes the window when unmodified |
| **Save Document** | `Cmd + S` | `Ctrl + S` | Saves preserving line endings (LF/CRLF) and encoding (UTF-8) |
| **Print Document** | `Cmd + P` | `Ctrl + P` | System native print dialog with ink-friendly styling |
| **Export to PDF** | `Cmd + Shift + P` | `Ctrl + Shift + P` | High-fidelity vector PDF generation |
| **Export to Retina PNG** | `Cmd + Shift + E` | `Ctrl + Shift + E` | 2x Retina full-page screenshot with automatic clipboard copy |
| **Export to Standalone HTML** | `Cmd + Shift + H` | `Ctrl + Shift + H` | Self-contained offline HTML file bundle |
| **Settings Center** | `Cmd + ,` | `Ctrl + ,` | Themes, layout modes (adaptive/standard/full), and font adjustments |

## Editions, Privacy & Commercial Boundaries

QvReader adheres to a transparent, local-first commercial model:

- **100% Open-Source Client**:
  - The complete desktop client source code (React UI, markdown parser, Tauri Rust core, offline entitlement verifier) is available under the [Apache License 2.0](LICENSE).
  - Build directly from source using `npm ci && npm run build` without proprietary dependencies.
  - In local development (`NODE_ENV !== 'production'`), Pro features are unlocked by default so contributors can test freely.
- **Redistribution & Trademark Rules**:
  - You are free to fork, modify, and redistribute under Apache-2.0.
  - Forks and unofficial builds MUST identify as a **"Community Build"** or **"非官方构建"** in the window title and About dialog per [TRADEMARKS.md](TRADEMARKS.md).
  - Official code signing certificates (Apple notarization, Windows Authenticode) are reserved exclusively for official maintainer distributions.
- **Privacy & Local-First Guarantees**:
  - QvReader operates completely offline. Document contents and file paths are **never** transmitted to remote servers.
  - Pro activation transmits only an anonymized device hash, device label, and license key over TLS.
  - License validation failures never lock, modify, or block saving local Markdown files.
- **Community vs. Pro Editions (Official Distributions)**:
  - **Community Edition**: Core reading and `F2` inline editing are 100% free with no time limits or ads. `F3` split-view includes evaluation trial sessions with zero lockouts on document saving.
  - **Pro Edition ($9.99 One-Time Lifetime Buyout)**: One-time buyout for 3+ devices, 100% local offline activation, zero subscriptions via [qvreader.com](https://qvreader.com).
- **Support Scope**:
  - Technical support from maintainers is provided for official distributions per [SUPPORT.md](SUPPORT.md). Forks are supported by their respective creators.

---

## Documentation & Community

- [Architecture & Design](docs/architecture.md)
- [Detailed Feature Guide](docs/features.md)
- [Usage Manual & Shortcuts](docs/usage.md)
- [Roadmap & Planned Features](docs/roadmap.md)
- [Building from Source](docs/development.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [First Contribution Guide](docs/contributing/first-contribution.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Governance](GOVERNANCE.md)
- [Support Policy](SUPPORT.md)
- [Release Process](docs/release-process.md)
- [Changelog](CHANGELOG.md)

---

## License & Trademarks

- **Source Code**: Distributed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- **Trademarks & Branding**: The "QvReader" name, logos, and official distributions are governed separately by [TRADEMARKS.md](TRADEMARKS.md).
