#!/usr/bin/env node
const { rmSync } = require('fs');

const MIN_NODE_MAJOR = 18;
const currentMajor = parseInt(process.versions.node.split('.')[0], 10);

if (currentMajor < MIN_NODE_MAJOR) {
  console.warn(
    `[postinstall-cleanup] Node ${MIN_NODE_MAJOR}+ required. Detected ${process.version}.`
  );
}


const paths = [
  'node_modules/drizzle-orm/mysql-core',
  'node_modules/drizzle-orm/sqlite-core',
  'node_modules/bun-types',
  'node_modules/@netlify/plugin-nextjs'
];

for (const p of paths) {
  try {
    rmSync(p, { recursive: true, force: true });
  } catch {
    // ignore errors
  }
}
