const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['node_modules', '.git', 'tabby-cache', 'functions']);
const skipFiles = new Set(['public/index.html']);

const checks = [
  ['description', /<meta[^>]+name=["']description["']/i],
  ['canonical', /<link[^>]+rel=["']canonical["']/i],
  ['og:title', /<meta[^>]+property=["']og:title["']/i],
  ['twitter:card', /<meta[^>]+name=["']twitter:card["']/i],
  ['jsonld', /<script[^>]+type=["']application\/ld\+json["']/i],
];

const missing = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.html')) continue;

    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (skipFiles.has(rel)) continue;

    const html = fs.readFileSync(full, 'utf8');
    const missingTags = checks.filter(([, regex]) => !regex.test(html)).map(([name]) => name);

    if (missingTags.length) {
      missing.push({ path: rel, missing: missingTags });
    }
  }
}

walk(root);

console.log(`Missing core tags pages: ${missing.length}`);
if (missing.length) {
  for (const row of missing) {
    console.log(`${row.path}: ${row.missing.join(', ')}`);
  }
}
