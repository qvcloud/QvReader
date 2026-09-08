#!/usr/bin/env node

/**
 * Derive the QvReader version from git — the single source of truth.
 *
 * Rules:
 *   - HEAD sits exactly on a clean semver tag `vX.Y.Z` (no commits ahead):
 *       -> return the pure version without the leading `v` (e.g. "0.1.9").
 *   - HEAD is not on a clean tag (dev / unreleased build):
 *       -> return `git describe --tags --long`, leading `v` stripped and any
 *          dirty marker normalized, e.g. "0.1.8-3-gabc123".
 *   - No semver tags exist at all:
 *       -> return "0.0.0-dev".
 *
 * Usage:
 *   node scripts/derive-version.mjs            # plain version string, no newline
 *   node scripts/derive-version.mjs --tag      # tag form prefixed with v (v0.1.9)
 */

import { execFileSync } from 'node:child_process';

const SEMVER_TAG = /^v?(\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?)$/;

function git(...args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf-8',
      cwd: new URL('..', import.meta.url).pathname,
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
}

function latestTagVersion() {
  // Highest reachable semver tag that is an ancestor of HEAD.
  const tag = git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*.[0-9]*.[0-9]*');
  if (!tag) return null;
  const m = SEMVER_TAG.exec(tag);
  return m ? m[1] : null;
}

function headExactTag() {
  // Returns the version if HEAD is exactly tagged vX.Y.Z with no commits ahead.
  const exact = git('describe', '--tags', '--exact-match', '--match', 'v[0-9]*.[0-9]*.[0-9]*');
  if (!exact) return null;
  const m = SEMVER_TAG.exec(exact);
  return m ? m[1] : null;
}

function deriveVersion() {
  const exact = headExactTag();
  if (exact) return exact;

  const long = git('describe', '--tags', '--long', '--match', 'v[0-9]*.[0-9]*.[0-9]*');
  if (long) {
    // e.g. "v0.1.8-3-gabc123" -> "0.1.8-3-gabc123"
    let v = long.replace(/^v/, '');
    // normalize any dirty marker "…-dirty" stays; describe --long keeps count.
    return v;
  }

  const base = latestTagVersion();
  if (base) return base;
  return '0.0.0-dev';
}

const version = deriveVersion();

if (process.argv.includes('--tag')) {
  process.stdout.write(version.startsWith('v') ? version : `v${version}`);
} else {
  process.stdout.write(version);
}
