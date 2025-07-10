#!/usr/bin/env node
const fs = require('fs');
const paths = [
  'node_modules/drizzle-orm/mysql-core',
  'node_modules/drizzle-orm/sqlite-core',
  'node_modules/bun-types',
  'node_modules/@netlify/plugin-nextjs'
];
paths.forEach(p => {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch (e) {
    // ignore errors
  }
});
