# QvReader Architecture & Design

This document describes the technical architecture, module map, security boundaries, contract-change process, and data integrity guarantees of QvReader.

---

## 1. System Overview

QvReader is an ultra-fast, offline-first Markdown reader and editor built using a modern hybrid architecture:

```text
+----------------------------------------------------------------+
|                   Webview Frontend (React 18)                  |
|  - Reader Engine (markdown-it + KaTeX + Mermaid + Highlight)   |
|  - Editor Engine (CodeMirror 6 + Sync Scroll)                  |
|  - UI State & I18n (Contexts + Tailwind CSS)                   |
+-------------------------------+--------------------------------+
                                |
                   Tauri IPC (JSON Bridge)
                                |
+-------------------------------v--------------------------------+
|                     Native Core (Rust)                         |
|  - Fidelity Engine (Encoding & Line Ending Preservation)       |
|  - Workspace Scanner (Ignore junk, memory-bounded traversal)   |
|  - Entitlement Verifier (Asymmetric Ed25519 offline checking)  |
|  - Platform OS Keyring Integration                             |
+----------------------------------------------------------------+
```

---

## 2. Detailed Module Map

### Frontend Modules (`src/`)

- `src/components/`: UI view components including Reader view, Markdown canvas, CodeMirror editor integration, toolbar, settings modals, about dialog, and status bar.
- `src/contexts/`: React context providers for document state, workspace navigation, preferences, and licensing status.
- `src/lib/`: Core client logic including Markdown parser (`markdown-it` pipeline), syntax highlighter, KaTeX math engine, Mermaid diagram renderer, export formatters (HTML, PDF, PNG), and Tauri IPC wrappers (`ipc.ts`).
- `src/types/`: TypeScript type definitions for documents, workspaces, editor state, and signed entitlements (`license.ts`).
- `src/config/`: Edition configuration, version constants, and default settings.

### Native Rust Modules (`src-tauri/src/`)

- `lib.rs`: Tauri application initialization, plugin registration, and command routing.
- `main.rs`: Native desktop process entry point.
- `file_ops.rs`: High-fidelity file reading, encoding detection, line ending analysis, and atomic saving.
- `workspace.rs`: High-speed directory traversal with memory-bounded queue, excluding junk folders (`.git`, `node_modules`, `target`).
- `licensing/`:
  - `entitlement.rs`: Asymmetric Ed25519 digital signature verification and device binding validation.
  - `storage.rs`: Persistent credential management using platform keyring and application state files.
  - `creem.rs`: License activation client with sensitive token redaction and test isolation.

---

## 3. Public vs. Private Boundaries

| Boundary | Public Repository (`qvcloud/QvReader`) | Private Infrastructure |
|---|---|---|
| **Client Source** | 100% complete desktop client code | None (consumes pinned public submodule) |
| **Licensing Authority** | Public verification keys only; verifier | Private Ed25519 signing key, payment webhooks |
| **Commercial Portal** | None | Official website (`website/frontend`, `website/backend`) |
| **Release Signing** | Unsigned builds in pull requests | Platform Apple/Windows signing certificates in protected CI |

---

## 4. Cryptographic Entitlement Model

QvReader verifies Pro activation tokens entirely offline without contacting servers after the initial activation:

- **Asymmetric Cryptography**: The server signs a canonical entitlement payload using an Ed25519 private key.
- **No Embedded Private Keys**: The public client embeds only trusted public verification keys (`qv-key-1`).
- **Device Hash Binding**: Entitlements are bound to an anonymized SHA-256 hash of hardware identifiers.
- **Privacy First**: The signed entitlement contains zero customer email, payment identifiers, or document data.
- **Safe Fallback**: Entitlement invalidity affects Pro status only; it **never** impairs opening, reading, or saving local Markdown files.

---

## 5. Markdown Fidelity Guarantees

Preserving user documents without byte drift is a core design requirement:

- **Automatic Encoding Detection**: Accurately detects UTF-8 (with or without BOM), UTF-16LE, and UTF-16BE.
- **Line Ending Preservation**: Maintains CRLF vs. LF exactly as found on disk unless explicitly changed.
- **Atomic File Saving**: Disk writes use atomic write-then-rename semantics to prevent data loss on crash.
- **Clean Markdown Ingestion**: Skips `.git`, junk files, and binary assets during workspace folder scanning.

---

## 6. IPC Contract & Change Process

The boundary between the React webview and the native Rust layer is defined by typed Tauri IPC commands in `src/lib/ipc.ts` and `src-tauri/src/lib.rs`.

### Contract-Change Guidelines

1. **Backward Compatibility**: Existing IPC command signatures must maintain backward compatibility within the same major version.
2. **Type Symmetry**: Any field added to a native command payload must be mirrored in the corresponding TypeScript interface in `src/types/`.
3. **Hermetic Testing**: All IPC endpoints must have corresponding unit or contract tests in `tests/` and `src-tauri/tests/`.
4. **RFC for Major Changes**: Proposals that modify the core IPC interface or state model should be discussed via a GitHub Issue or RFC before implementation.

---

## 7. Community & Contribution Links

- **Getting Started**: Read the [First Contribution Guide](contributing/first-contribution.md) for newcomer tips and criteria for beginner-friendly tasks.
- **Product Roadmap**: View current milestones and intentionally excluded features in the [Roadmap](roadmap.md).
- **Contributor Validation**: Follow the [Contributor Validation Smoke Checklist](contributor-validation.md) to verify your local development environment.
- **Attribution Policy**: Contributors are recognized in the [Hall of Fame](contributing/first-contribution.md#contributor-attribution) and official release notes.
