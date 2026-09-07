# GitHub Repository Settings & Security Baseline

This document specifies the required GitHub repository configuration, protection rules, and access permissions for `qvcloud/QvReader`.

---

## 1. Branch Protection Rules (`main`)

The `main` branch is protected with the following requirements:

- **Require a pull request before merging**: Enabled.
  - **Required approvals**: At least 1 approving review from `@qvcloud/maintainers`.
  - **Dismiss stale pull request approvals when new commits are pushed**: Enabled.
  - **Require review from Code Owners**: Enabled (enforces `.github/CODEOWNERS`).
- **Require status checks to pass before merging**: Enabled.
  - Required checks:
    - `Lint & Typecheck (Node.js 20)`
    - `Frontend Tests & Bundle Budget`
    - `Native Rust Tests (cargo test --locked)`
    - `Native Code Style & Clippy (cargo fmt & clippy)`
    - `Documentation & Symmetry Verification (verify-docs.mjs)`
    - `Source Boundary & Secret Scan`
- **Require linear history**: Enabled (Squash merge or rebase merge only; no merge commits).
- **Include administrators**: Enabled (enforces branch protections even for admins).
- **Restrict who can push to matching branches**: No direct pushes; all changes must arrive via approved PRs.
- **Allow force pushes**: **Disabled**.
- **Allow deletions**: **Disabled**.

---

## 2. Tag Protection Rules (`v*`)

- **Pattern**: `v*` (e.g., `v0.2.0`)
- **Allowed Roles**: Only members of `@qvcloud/core-team` may create matching tags.
- **Immutability**: Once created, tags cannot be deleted, updated, or re-pointed.

---

## 3. GitHub Actions & Security Policy

- **Action Permissions**: Restricted.
  - Allowed actions: Local repository actions and approved, immutable actions pinned by exact full commit SHA (e.g., `actions/checkout@v4`, `softprops/action-gh-release@c062e08bd5...`).
- **Fork Pull Request Workflows**:
  - `Send write tokens to workflows from fork pull requests`: **Disabled**.
  - `Send secrets to workflows from fork pull requests`: **Disabled**.
- **Secret Scanning & Push Protection**:
  - GitHub Secret Scanning: **Enabled**.
  - Push Protection: **Enabled** (blocks commits containing recognized API keys or tokens).

---

## 4. GitHub Environments (`release`)

- **Environment Name**: `release`
- **Deployment Protection Rules**:
  - **Required Reviewers**: Must include at least 2 approvers from `@qvcloud/core-team`.
  - **Deployment Branch Policy**: Selected tags only (`v*`).
- **Environment Secrets**:
  - `APPLE_CERTIFICATE_P12`
  - `APPLE_CERTIFICATE_PASSWORD`
  - `APPLE_NOTARIZATION_API_KEY`
  - `APPLE_NOTARIZATION_KEY_ID`
  - `APPLE_NOTARIZATION_TEAM_ID`
  - `WINDOWS_CERTIFICATE_TOKEN`

---

## 5. Third-Party Action Allowlist

All external GitHub Actions used in workflows must be pinned by commit SHA:

| Action | Pinned Version / SHA | Purpose |
|---|---|---|
| `actions/checkout` | `v4` | Checkout code repository |
| `actions/setup-node` | `v4` | Setup Node.js runtime and cache |
| `dtolnay/rust-toolchain` | `stable` | Pinned stable Rust toolchain |
| `actions/upload-artifact` | `v4` | Upload build artifacts |
| `actions/download-artifact`| `v4` | Download build artifacts |
| `softprops/action-gh-release` | `c062e08bd532815e2082a85e87e3ef29c3e6d191` | Publish to GitHub Releases |
