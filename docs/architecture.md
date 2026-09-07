# QvReader Architecture & Design

This document describes the technical architecture, security boundaries, and data integrity guarantees of QvReader.

---

## 1. System Overview

QvReader is an ultra-fast, offline-first Markdown reader and editor built using a modern hybrid architecture:

```
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

## 2. Public vs. Private Boundaries

| Boundary | Public Repository (`qvcloud/QvReader`) | Private Infrastructure |
|---|---|---|
| **Client Source** | 100% complete desktop client code | None (consumes pinned public tag) |
| **Licensing Authority** | Public verification keys only; verifier | Private Ed25519 signing key, payment webhooks |
| **Commercial Portal** | None | Official website (`website/frontend`, `website/backend`) |
| **Release Signing** | Unsigned builds in pull requests | Platform Apple/Windows signing certificates in protected CI |

---

## 3. Cryptographic Entitlement Model

QvReader verifies Pro activation tokens entirely offline without contacting servers after the initial activation:

- **Asymmetric Cryptography**: The server signs a canonical entitlement payload using an Ed25519 private key.
- **No Embedded Private Keys**: The public client embeds only trusted public verification keys (`qv-key-1`).
- **Device Hash Binding**: Entitlements are bound to an anonymized SHA-256 hash of hardware identifiers.
- **Privacy First**: The signed entitlement contains zero customer email, payment identifiers, or document data.
- **Safe Fallback**: Entitlement invalidity affects Pro status only; it **never** impairs opening, reading, or saving local Markdown files.

---

## 4. Markdown Fidelity Guarantees

Preserving user documents without byte drift is a core design requirement:

- **Automatic Encoding Detection**: Accurately detects UTF-8 (with or without BOM), UTF-16LE, and UTF-16BE.
- **Line Ending Preservation**: Maintains CRLF vs. LF exactly as found on disk unless explicitly changed.
- **Atomic File Saving**: Disk writes use atomic write-then-rename semantics to prevent data loss on crash.
- **Clean Markdown Ingestion**: Skips `.git`, junk files, and binary assets during workspace folder scanning.
