#!/usr/bin/env node
const { rmSync } = require('fs');

const MIN_NODE_MAJOR = 18;
const currentMajor = parseInt(process.versions.node.split('.')[0], 10);

if (currentMajor < MIN_NODE_MAJOR) {
  console.warn(
    `[postinstall-cleanup] Node ${MIN_NODE_MAJOR}+ required. Detected ${process.version}.`
  );
}


// These modules are installed as transitive dependencies by some packages
// but are not needed in this project. Removing them keeps the production
// bundle smaller and avoids accidentally bundling native drivers.
const paths = [
  // Unused type packages or helpers
  'node_modules/@types/better-sqlite3',
  'node_modules/@types/mysql',
  'node_modules/@types/sqlite3',
  'node_modules/bun-types',

  // Netlify plugin automatically added by Next.js in some setups
  'node_modules/@netlify/plugin-nextjs',
];

for (const p of paths) {
  try {
    rmSync(p, { recursive: true, force: true });
  } catch {
    // ignore errors
  }
}
