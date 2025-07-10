const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const banned = ['@netlify/plugin-nextjs'];
const found = banned.filter(dep =>
  (pkg.dependencies && pkg.dependencies[dep]) ||
  (pkg.devDependencies && pkg.devDependencies[dep])
);
if (found.length) {
  console.error(`Forbidden packages detected: ${found.join(', ')}`);
  process.exit(1);
}
