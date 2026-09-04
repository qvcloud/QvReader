# Release Process

How installers get built and land on this repo's **GitHub Releases**.

## Architecture (two repos)

| Repo | Visibility | Role |
|---|---|---|
| **Private dev repo** (`qvcloud/markdown-viewer`) | private | Holds the actual source code, frontend, Rust backend, and the **CI build workflow** (`build-desktop.yml`). Binaries can only be built here — this is where source lives. |
| **This repo** (`qvcloud/QvReader`) | public | **Community + release home.** README, docs, LICENSE, changelog, and the downloadable installers published under Releases. |

Why two repos? Building a desktop app needs the source and build toolchain. The public repo
is meant to be the community face — but the code is not yet open. So builds happen in the
private repo, and finished installers are pushed to the public repo's Releases.

## How a release happens

1. A maintainer pushes a version tag `v*` to the **private dev repo**.
2. `build-desktop.yml` runs three parallel jobs (macOS universal / Windows / Linux) and
   builds the installers.
3. A final `create-release` job downloads all artifacts and publishes them as a GitHub
   Release on **`qvcloud/QvReader`** via `softprops/action-gh-release`.
   - Requires the GitHub Actions secret `QVREADER_RELEASE_TOKEN` on the private repo — a
     fine-grained PAT with **Contents: read/write** on `qvcloud/QvReader`.
   - If that secret is unset, the release falls back to the private repo (so the workflow
     never hard-fails).

## Publishing this community content

The files in this repository are pushed directly to `qvcloud/QvReader`:

```bash
./scripts/publish.sh
```

The script initializes this directory as its own git repo (remote =
`git@github.com:qvcloud/QvReader.git`), commits, and pushes to `main`.

## Versioning

- Follow [SemVer](https://semver.org/).
- Tag names are `v<major>.<minor>.<patch>` (e.g. `v1.0.1`).
- Update `CHANGELOG.md` before tagging.

## Release checklist

- [ ] `CHANGELOG.md` updated.
- [ ] Version bumped in the app manifest.
- [ ] Tag `v*` pushed to the private dev repo.
- [ ] Confirm the public Release on `qvcloud/QvReader` carries all three platform installers.
- [ ] Spot-check the download links in README point at the new tag.
