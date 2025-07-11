const { execSync } = require('child_process');
const fs = require('fs');

if (fs.existsSync('package-lock.json')) {
  console.error('Error: package-lock.json found. Please use yarn instead of npm.');
  process.exit(1);
}

try {
  execSync('yarn install --immutable --check-cache', { stdio: 'inherit' });
} catch (err) {
  console.error('Error: yarn.lock is not in sync with package.json.');
  process.exit(1);
}
