const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dev = pkg.devDependencies || {};
const expected = '6.21.0';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (dev['@typescript-eslint/eslint-plugin'] !== expected) {
  fail(`@typescript-eslint/eslint-plugin must be pinned to ${expected}`);
}
if (dev['@typescript-eslint/parser'] !== expected) {
  fail(`@typescript-eslint/parser must be pinned to ${expected}`);
}
if (pkg.resolutions && (pkg.resolutions['@typescript-eslint/eslint-plugin'] || pkg.resolutions['@typescript-eslint/parser'])) {
  fail('Do not use resolutions for @typescript-eslint packages');
}
const lock = fs.readFileSync('yarn.lock', 'utf8');
const parserOk =
  lock.includes(`@typescript-eslint/parser/-/parser-${expected}.tgz`) ||
  lock.includes(`@typescript-eslint/parser@npm:${expected}`);
if (!parserOk) {
  fail('yarn.lock missing parser version');
}
const pluginOk =
  lock.includes(`@typescript-eslint/eslint-plugin/-/eslint-plugin-${expected}.tgz`) ||
  lock.includes(`@typescript-eslint/eslint-plugin@npm:${expected}`);
if (!pluginOk) {
  fail('yarn.lock missing eslint-plugin version');
}
