# QvReader Release Process & Operations

This document describes the end-to-end release lifecycle, cryptographic evidence generation, security boundaries, and emergency operational procedures for official QvReader desktop releases.

---

## 1. Single Authoritative Architecture

Following the open-source client migration, **`qvcloud/QvReader` is the sole authoritative repository** for client source, issue tracking, CI verification, and official binary releases.

| Concern | Policy |
|---|---|
| **Authoritative Source** | All client source code lives in this repository (`qvcloud/QvReader`). |
| **Release Pipeline** | Triggered exclusively by pushing protected tags (`v*`) to this repository. |
| **Untrusted Builds** | Pull requests and branch pushes run with read-only repository permissions and **zero secrets**. |
| **Official Signing** | Runs in a separate, approval-gated GitHub Environment named `release`. |
| **Evidence & Provenance** | Every official release includes SHA256 checksums, per-platform SBOMs, and a signed `release-provenance.json` manifest. |

---

## 2. Release Steps

### Step 1: Preflight Preparation

Run the preflight release script to bump versions, check clean working tree, verify branch ancestry on `main`, and ensure tag immutability:

```bash
# Verify preflight in dry-run mode
DRY_RUN=1 ./scripts/release.sh 0.2.0

# Prepare release commit and bump manifests
./scripts/release.sh 0.2.0
```

### Step 2: Automated Preflight Checks

The script runs `scripts/verify-version.mjs --tag v0.2.0`, verifying that:
- `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, and `src/config/version.ts` have matching versions.
- `CHANGELOG.md` has an entry for the version.

### Step 3: Tag and Push

```bash
git commit -am "chore(release): prepare v0.2.0"
git tag -a v0.2.0 -m "QvReader release v0.2.0"
git push origin main
git push origin v0.2.0
```

### Step 4: GitHub Actions Release Workflow

Pushing the tag triggers `.github/workflows/release.yml`:
1. **Preflight**: Verifies version symmetry and `main` ancestry.
2. **Build Matrix**: Compiles clean native packages across macOS (Universal DMG), Windows (NSIS EXE & MSI), and Linux (AppImage & DEB).
3. **Evidence Generation**: Computes SHA256 hashes, generates per-package SPDX SBOMs, creates SLSA-compatible build attestations, and builds the canonical `release-provenance.json` manifest.
4. **Protected Publication**: Prompts designated maintainers for approval in the `release` environment, attaches digital signatures, and publishes the release on GitHub Releases.

---

## 3. Environment Secrets & Access Control

Official code signing credentials are stored exclusively in the protected GitHub Environment named `release`:

| Secret Name | Purpose | Rotation Policy |
|---|---|---|
| `APPLE_CERTIFICATE_P12` | macOS Developer ID Application Certificate | Annually (upon Apple cert renewal) |
| `APPLE_CERTIFICATE_PASSWORD` | Passphrase for Apple Developer ID P12 | Rotated on every certificate change |
| `APPLE_NOTARIZATION_API_KEY` | App Store Connect API Key for notarization | 180 days |
| `APPLE_NOTARIZATION_KEY_ID` | Key identifier for notarization API key | Coupled with API key |
| `APPLE_NOTARIZATION_TEAM_ID` | Apple Developer Team ID | Static |
| `WINDOWS_CERTIFICATE_TOKEN` | Windows Authenticode Signing Token (SignPath / HSM) | 90 days |

---

## 4. Protected Environment & Reviewer Gates

- **Environment Name**: `release`
- **Required Reviewers**: Releases require approval from at least **two members** of the `@qvcloud/core-team`.
- **Deployment Branches**: Restrict deployment to protected tags matching `refs/tags/v*`.
- **Prevent Fork Triggers**: The release job explicitly evaluates `github.repository == 'qvcloud/QvReader'` and fails safely if triggered from a fork.

---

## 5. Legacy vs. Source-Backed Releases

| Version Range | Status | Reproducibility | Notes |
|---|---|---|---|
| `< v0.2.0` (`v0.1.0` ~ `v0.1.5`) | `pre-source-publication` | Historical binary only | Built before the open-source client migration. Tags remain permanently immutable; binary correspondence cannot be re-derived. |
| `>= v0.2.0` | `source-backed` | 100% Verifiable | Every artifact matches public commit SHA, published SBOM, checksums, and `release-provenance.json`. |

---

## 6. Emergency Release & Rollback Procedures

### Emergency Security Patch

1. Branch from the released tag: `git checkout -b fix/cve-hotfix v0.2.0`.
2. Apply the security patch and commit.
3. Run local quality gates: `npm test && cargo test --locked && node scripts/verify-docs.mjs --scope all`.
4. Merge into `main` and tag the next patch version (e.g., `v0.2.1`).
5. **Never overwrite or re-tag `v0.2.0`**. Tags are strictly immutable.

### Leaked Credential Procedure

1. **Immediate Revocation**: Revoke the compromised certificate or API token at the issuer (Apple Developer portal, SignPath, GitHub) immediately.
2. **Rotate Secrets**: Generate a replacement keypair and update the GitHub Environment secret.
3. **Audit & Disclose**: File an incident report in `specs/015-open-source-client/migration/security-audit.md` and disclose in release notes if binaries were impacted.
