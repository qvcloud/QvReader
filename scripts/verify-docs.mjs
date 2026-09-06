#!/usr/bin/env node

/**
 * Documentation Integrity & Symmetry Verification Script for QvReader
 * Usage: node release/scripts/verify-docs.mjs [--scope all|readme|deep-dive|roadmap-changelog]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RELEASE_ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
let scope = 'all';
const scopeIndex = args.indexOf('--scope');
if (scopeIndex !== -1 && args[scopeIndex + 1]) {
  scope = args[scopeIndex + 1];
}

const LOCALES = [
  { code: 'en', readme: 'README.md', docsSubdir: '' },
  { code: 'zh-CN', readme: 'README.zh-CN.md', docsSubdir: 'zh-CN' },
  { code: 'ja', readme: 'README.ja.md', docsSubdir: 'ja' },
  { code: 'ko', readme: 'README.ko.md', docsSubdir: 'ko' },
  { code: 'es', readme: 'README.es.md', docsSubdir: 'es' },
  { code: 'pt-BR', readme: 'README.pt-BR.md', docsSubdir: 'pt-BR' },
];

let errors = [];
let warnings = [];
let checkedFiles = 0;

function logPass(msg) {
  console.log(`\x1b[32m✔\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m✘\x1b[0m ${msg}`);
  errors.push(msg);
}

function logWarn(msg) {
  console.warn(`\x1b[33m⚠\x1b[0m ${msg}`);
  warnings.push(msg);
}

// 1. Verify Root READMEs
function verifyReadmes() {
  console.log('\n--- Checking Root READMEs ---');
  for (const loc of LOCALES) {
    const readmePath = path.join(RELEASE_ROOT, loc.readme);
    if (!fs.existsSync(readmePath)) {
      logFail(`Missing root README: ${loc.readme}`);
      continue;
    }
    checkedFiles++;
    const content = fs.readFileSync(readmePath, 'utf-8');

    // Check language switcher
    if (!content.includes('README.md') || !content.includes('README.zh-CN.md')) {
      logFail(`[${loc.readme}] Missing multi-language switcher header`);
    }

    // Check version references
    if (!content.includes('0.1.4')) {
      logFail(`[${loc.readme}] Missing client version reference v0.1.4`);
    }

    // Check security trust guidance
    const hasGatekeeper = content.includes('xattr -cr') || content.includes('Gatekeeper') || content.includes('Apple');
    const hasSmartScreen = content.includes('SmartScreen') || content.includes('Windows');
    if (!hasGatekeeper || !hasSmartScreen) {
      logFail(`[${loc.readme}] Missing macOS or Windows security trust guidance`);
    }

    // Check fast mirrors
    if (!content.includes('ghfast.top') && !content.includes('gh-proxy.com')) {
      logFail(`[${loc.readme}] Missing download acceleration mirror links`);
    }

    // Check core highlights
    if (!content.includes('Mermaid')) {
      logFail(`[${loc.readme}] Missing Mermaid diagram feature mention`);
    }

    logPass(`[${loc.readme}] Verified structure and required sections (${loc.code})`);
  }
}

// 2. Verify Deep-Dive Docs
function verifyDeepDiveDocs() {
  console.log('\n--- Checking Deep-Dive Documentation (docs/) ---');
  for (const loc of LOCALES) {
    const dir = loc.docsSubdir ? path.join(RELEASE_ROOT, 'docs', loc.docsSubdir) : path.join(RELEASE_ROOT, 'docs');
    const featuresFile = path.join(dir, 'features.md');
    const usageFile = path.join(dir, 'usage.md');

    // features.md
    if (!fs.existsSync(featuresFile)) {
      logFail(`Missing features.md for locale ${loc.code}: ${path.relative(RELEASE_ROOT, featuresFile)}`);
    } else {
      checkedFiles++;
      const featContent = fs.readFileSync(featuresFile, 'utf-8');
      if (!featContent.includes('Mermaid')) {
        logFail(`[docs/${loc.docsSubdir || 'en'}/features.md] Missing Mermaid documentation`);
      }
      logPass(`[docs/${loc.docsSubdir || 'en'}/features.md] Verified`);
    }

    // usage.md
    if (!fs.existsSync(usageFile)) {
      logFail(`Missing usage.md for locale ${loc.code}: ${path.relative(RELEASE_ROOT, usageFile)}`);
    } else {
      checkedFiles++;
      const usageContent = fs.readFileSync(usageFile, 'utf-8');
      if (!usageContent.includes('F2') || !usageContent.includes('F3')) {
        logFail(`[docs/${loc.docsSubdir || 'en'}/usage.md] Missing F2/F3 shortcuts`);
      }
      logPass(`[docs/${loc.docsSubdir || 'en'}/usage.md] Verified`);
    }
  }
}

// 3. Verify Roadmap and Changelog
function verifyRoadmapAndChangelog() {
  console.log('\n--- Checking Roadmap and Changelog ---');
  // CHANGELOG.md
  const changelogPath = path.join(RELEASE_ROOT, 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) {
    logFail('Missing CHANGELOG.md');
  } else {
    checkedFiles++;
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
    if (!changelogContent.includes('0.1.4')) {
      logFail('[CHANGELOG.md] Missing entry for version 0.1.4');
    } else {
      logPass('[CHANGELOG.md] Verified v0.1.4 entry');
    }
  }

  // roadmap.md across locales
  for (const loc of LOCALES) {
    const dir = loc.docsSubdir ? path.join(RELEASE_ROOT, 'docs', loc.docsSubdir) : path.join(RELEASE_ROOT, 'docs');
    const roadmapFile = path.join(dir, 'roadmap.md');
    if (!fs.existsSync(roadmapFile)) {
      logFail(`Missing roadmap.md for locale ${loc.code}`);
    } else {
      checkedFiles++;
      const roadmapContent = fs.readFileSync(roadmapFile, 'utf-8');
      if (!roadmapContent.includes('0.1.4') && !roadmapContent.includes('v0.1.4')) {
        logFail(`[docs/${loc.docsSubdir || 'en'}/roadmap.md] Missing v0.1.4 milestone reference`);
      } else {
        logPass(`[docs/${loc.docsSubdir || 'en'}/roadmap.md] Verified`);
      }
    }
  }
}

// 4. Verify Relative Markdown Links
function verifyRelativeLinks() {
  console.log('\n--- Checking Relative Markdown Links ---');
  function findMarkdownFiles(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git') {
          results = results.concat(findMarkdownFiles(fullPath));
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const allMdFiles = findMarkdownFiles(RELEASE_ROOT);
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkCount = 0;
  let brokenLinks = 0;

  for (const mdFile of allMdFiles) {
    const content = fs.readFileSync(mdFile, 'utf-8');
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const rawTarget = match[2].trim();
      // Skip absolute URLs, anchors, mailto
      if (
        rawTarget.startsWith('http://') ||
        rawTarget.startsWith('https://') ||
        rawTarget.startsWith('mailto:') ||
        rawTarget.startsWith('#')
      ) {
        continue;
      }

      linkCount++;
      // Split path and anchor
      const [targetPathWithoutHash] = rawTarget.split('#');
      if (!targetPathWithoutHash) continue; // Pure anchor on same file

      const targetPath = path.resolve(path.dirname(mdFile), targetPathWithoutHash);
      if (!fs.existsSync(targetPath)) {
        logFail(`Broken link in ${path.relative(RELEASE_ROOT, mdFile)}: [${match[1]}](${rawTarget}) -> Target not found`);
        brokenLinks++;
      }
    }
  }

  if (brokenLinks === 0) {
    logPass(`All ${linkCount} relative markdown links verified across ${allMdFiles.length} files`);
  }
}

// Execute selected scope
console.log(`Starting documentation verification (scope: ${scope})...`);

if (scope === 'all' || scope === 'readme') {
  verifyReadmes();
}
if (scope === 'all' || scope === 'deep-dive') {
  verifyDeepDiveDocs();
}
if (scope === 'all' || scope === 'roadmap-changelog') {
  verifyRoadmapAndChangelog();
}
if (scope === 'all') {
  verifyRelativeLinks();
}

console.log('\n=========================================');
console.log(`Summary: Checked ${checkedFiles} files | Errors: ${errors.length} | Warnings: ${warnings.length}`);
console.log('=========================================');

if (errors.length > 0) {
  console.error('\x1b[31mVerification FAILED with errors.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32mVerification PASSED successfully!\x1b[0m');
  process.exit(0);
}
