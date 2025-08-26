#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

const appDir = path.join(process.cwd(), 'app');
let failed = false;

if (fs.existsSync(appDir)) {
  const files = walk(appDir);
  const layoutIssues = [];
  const headerIssues = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    if (/\/layout\.tsx?$/.test(file) && /['"]use client['"]/.test(content)) {
      layoutIssues.push(file);
    }
    if (/from ['"]next\/headers['"]/.test(content)) {
      headerIssues.push(file);
    }
  }

  if (layoutIssues.length) {
    console.error('layout.tsx files must not use "use client":');
    layoutIssues.forEach(f => console.error(' - ' + f));
    failed = true;
  }

  if (headerIssues.length) {
    console.error('Files under app/ must not import next/headers:');
    headerIssues.forEach(f => console.error(' - ' + f));
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
