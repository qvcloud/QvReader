#!/usr/bin/env node

/**
 * Version Consistency Verification Script for QvReader
 * Usage:
 *   node release/scripts/verify-version.mjs [--tag <vX.Y.Z>] [--provenance <path/to/provenance.json>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let expectedTag = null;
let provenancePath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--tag' && args[i + 1]) {
    expectedTag = args[i + 1];
    i++;
  } else if (args[i] === '--provenance' && args[i + 1]) {
    provenancePath = path.resolve(process.cwd(), args[i + 1]);
    i++;
  }
}

const errors = [];

function logPass(msg) {
  console.log(`\x1b[32m✔\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m✘\x1b[0m ${msg}`);
  errors.push(msg);
}

console.log('==========================================================');
console.log(' Verifying Version Consistency across QvReader Artifacts');
console.log('==========================================================');

// 1. package.json
const pkgPath = path.join(REPO_ROOT, 'package.json');
if (!fs.existsSync(pkgPath)) {
  logFail(`Missing package.json at ${pkgPath}`);
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const baseVersion = pkg.version;
if (!baseVersion) {
  logFail('package.json has no "version" field');
  process.exit(1);
}
logPass(`Base version from package.json: ${baseVersion}`);

// 2. src-tauri/Cargo.toml
const cargoTomlPath = path.join(REPO_ROOT, 'src-tauri/Cargo.toml');
if (!fs.existsSync(cargoTomlPath)) {
  logFail(`Missing src-tauri/Cargo.toml at ${cargoTomlPath}`);
} else {
  const cargoContent = fs.readFileSync(cargoTomlPath, 'utf-8');
  const cargoMatch = cargoContent.match(/\[package\][\s\S]*?version\s*=\s*"([^"]+)"/);
  if (!cargoMatch) {
    logFail('Failed to extract version from src-tauri/Cargo.toml');
  } else if (cargoMatch[1] !== baseVersion) {
    logFail(`Cargo.toml version (${cargoMatch[1]}) does not match package.json (${baseVersion})`);
  } else {
    logPass(`src-tauri/Cargo.toml version matches: ${cargoMatch[1]}`);
  }
}

// 3. src-tauri/Cargo.lock (package version must match so `cargo test --locked` passes)
const cargoLockPath = path.join(REPO_ROOT, 'src-tauri/Cargo.lock');
if (!fs.existsSync(cargoLockPath)) {
  logFail(`Missing src-tauri/Cargo.lock at ${cargoLockPath}`);
} else {
  const cargoLockContent = fs.readFileSync(cargoLockPath, 'utf-8');
  const pkgMatch = cargoLockContent.match(/name = "qvreader"[\s\S]*?version = "([^"]+)"/);
  if (!pkgMatch) {
    logFail('Failed to extract qvreader version from src-tauri/Cargo.lock');
  } else if (pkgMatch[1] !== baseVersion) {
    logFail(`Cargo.lock qvreader version (${pkgMatch[1]}) does not match package.json (${baseVersion})`);
  } else {
    logPass(`src-tauri/Cargo.lock qvreader version matches: ${pkgMatch[1]}`);
  }
}

// 4. src-tauri/tauri.conf.json
const tauriConfPath = path.join(REPO_ROOT, 'src-tauri/tauri.conf.json');
if (!fs.existsSync(tauriConfPath)) {
  logFail(`Missing src-tauri/tauri.conf.json at ${tauriConfPath}`);
} else {
  const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
  if (tauriConf.version !== baseVersion) {
    logFail(`tauri.conf.json version (${tauriConf.version}) does not match package.json (${baseVersion})`);
  } else {
    logPass(`src-tauri/tauri.conf.json version matches: ${tauriConf.version}`);
  }
}

// 5. src/config/version.ts (must derive from git-injected __CLIENT_VERSION__,
//    never a hardcoded literal — the git tag is the single source of truth)
const versionTsPath = path.join(REPO_ROOT, 'src/config/version.ts');
if (fs.existsSync(versionTsPath)) {
  const versionTsContent = fs.readFileSync(versionTsPath, 'utf-8');
  const hardcoded = versionTsContent.match(/CLIENT_VERSION\s*[:=]\s*['"][^'"]+['"]/);
  const derivesFromInjection = versionTsContent.includes('__CLIENT_VERSION__');
  if (hardcoded) {
    logFail(`src/config/version.ts still hardcodes CLIENT_VERSION (${hardcoded[0]}). Version must be git-injected.`);
  } else if (!derivesFromInjection) {
    logFail('src/config/version.ts does not derive CLIENT_VERSION from the git-injected __CLIENT_VERSION__ global.');
  } else {
    logPass('src/config/version.ts derives CLIENT_VERSION from git (no hardcoded literal).');
  }
}

// 6. CHANGELOG.md
const changelogPath = path.join(REPO_ROOT, 'CHANGELOG.md');
if (!fs.existsSync(changelogPath)) {
  logFail(`Missing CHANGELOG.md at ${changelogPath}`);
} else {
  const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
  const changelogHeaderRegex = new RegExp(`##\\s*\\[${baseVersion.replace('.', '\\.')}\\]`);
  if (!changelogHeaderRegex.test(changelogContent)) {
    logFail(`CHANGELOG.md missing release section for version [${baseVersion}]`);
  } else {
    logPass(`CHANGELOG.md includes section for [${baseVersion}]`);
  }
}

// 7. Optional Tag check
if (expectedTag) {
  const normalizedTag = expectedTag.startsWith('v') ? expectedTag : `v${expectedTag}`;
  const targetTag = `v${baseVersion}`;
  if (normalizedTag !== targetTag) {
    logFail(`Provided tag (${expectedTag}) does not match expected tag (${targetTag}) for version ${baseVersion}`);
  } else {
    logPass(`Git tag matches expected version: ${normalizedTag}`);
  }
}

// 8. Optional Provenance check
if (provenancePath) {
  if (!fs.existsSync(provenancePath)) {
    logFail(`Specified provenance file does not exist: ${provenancePath}`);
  } else {
    try {
      const prov = JSON.parse(fs.readFileSync(provenancePath, 'utf-8'));
      if (prov.version !== baseVersion) {
        logFail(`Provenance manifest version (${prov.version}) does not match package.json (${baseVersion})`);
      } else {
        logPass(`Provenance manifest version matches: ${prov.version}`);
      }
      if (prov.tag !== `v${baseVersion}`) {
        logFail(`Provenance manifest tag (${prov.tag}) does not match v${baseVersion}`);
      } else {
        logPass(`Provenance manifest tag matches: ${prov.tag}`);
      }
    } catch (e) {
      logFail(`Failed to parse provenance manifest as JSON: ${e.message}`);
    }
  }
}

console.log('==========================================================');
if (errors.length > 0) {
  console.error(`\x1b[31mVersion verification FAILED with ${errors.length} error(s).\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32mAll version consistency checks PASSED for v${baseVersion}!\x1b[0m`);
  process.exit(0);
}
