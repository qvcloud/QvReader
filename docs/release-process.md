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

### Step 1: Run the Release

The script derives the version from git, so **no argument is required**. It performs the whole
release: preflight → bump → commit → push → wait for Public CI → tag:

```bash
# Preflight only: derive the next patch version and change nothing
DRY_RUN=1 ./scripts/release.sh

# Full release: auto-derived next patch
./scripts/release.sh

# Optional: explicit increment kind or exact version
./scripts/release.sh minor
./scripts/release.sh 0.2.0
```

With no argument the script takes the most recent reachable semver tag and increments the patch
component (for example, latest tag `v0.1.8` derives `0.1.9`).

Useful switches:

| Variable | Effect |
|---|---|
| `DRY_RUN=1` | Preflight only — no files changed, nothing pushed |
| `PUBLISH=0` | Bump and commit locally, but do not push or tag |
| `SKIP_CI_WAIT=1` | Tag without waiting for Public CI to turn green |
| `YES=1` | Skip the interactive push/tag confirmations |
| `CI_WAIT_TIMEOUT` | Seconds to wait for a CI run (default `1800`) |

### Step 2: Automated Preflight Checks

The script runs `scripts/verify-version.mjs --tag vX.Y.Z`, verifying that:

- `package.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock` and `src-tauri/tauri.conf.json` all match the tag version (`Cargo.lock` must be included or `cargo test --locked` fails);
- `src/config/version.ts` derives `CLIENT_VERSION` from the build-time `__CLIENT_VERSION__` injection and **contains no version literal** — the git tag is the single source of truth;
- `CHANGELOG.md` has an entry for the version.

> Never write a version number into `src/config/version.ts`. Duplicate version literals across files
> caused three consecutive failed releases (`v0.1.6`, `v0.1.7`, `v0.1.8`). See the version authority
> rules below.

### Step 3: Commit, Push, CI Gate, and Tag

`./scripts/release.sh` performs these steps automatically and stops at the first failure:

1. Commits the manifest + changelog bump (skipped if there is nothing to commit).
2. Pushes `main` to `origin`.
3. Waits for the **Public CI** run on that commit (`ci.yml`). If it turns red the script refuses to
   tag. If `gh` is unavailable or no run appears, it asks for confirmation before continuing.
4. Creates the annotated tag `vX.Y.Z` on the pushed commit and pushes it.

Pushing `main` requires a credential with the **`workflow` scope** whenever the push contains
`.github/workflows` changes. If GitHub rejects the push for that reason the script prints an
explicit hint; the release commit stays local and safe, so re-running after fixing the credential
is enough.

If a run has to be completed by hand (for example, CI was green but the script was interrupted):

```bash
git tag -a v0.2.0 -m "QvReader release v0.2.0"
git push origin v0.2.0
```

Tags are immutable. If a release fails after tagging, cut a **new** version rather than moving or
deleting the existing tag — `v0.1.6`, `v0.1.7` and `v0.1.8` were all burned this way.

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
