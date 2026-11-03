const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('Subdirectory deployment keeps the app identity, launch URL and scope separate', () => {
  const base = 'https://mgforever26.github.io/klaver/nodevaerk/';
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  for (const field of ['id', 'start_url', 'scope']) {
    assert.equal(new URL(manifest[field], base).href, base, field);
  }
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(root, icon.src)), icon.src);
    assert.ok(new URL(icon.src, base).pathname.startsWith('/klaver/nodevaerk/'));
  }
});

test('Every local HTML dependency exists within Nodeværk and no root path is required', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  assert.ok(references.length >= 8);
  for (const reference of references) {
    assert.ok(!reference.startsWith('/'), reference);
    assert.ok(fs.existsSync(path.join(root, reference)), reference);
  }
  assert.ok(html.includes('noindex,nofollow'));
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.ok(app.includes("serviceWorker.register('sw.js')"));
  assert.ok(app.includes("STORE='nodevaerk.progress.v1'"));
});
