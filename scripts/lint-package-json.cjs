const fs = require('fs');
const { execSync } = require('child_process');

const file = 'package.json';
let src;
try {
  src = fs.readFileSync(file, 'utf8');
} catch (err) {
  console.error(`Failed to read ${file}`);
  process.exit(1);
}

try {
  execSync(`prettier --write ${file}`, { stdio: 'ignore' });
} catch (err) {
  console.error('Prettier formatting failed');
  process.exit(1);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (err) {
  console.error('package.json is not valid JSON');
  process.exit(1);
}

function assert(cond, msg) {
  if (!cond) {
    console.error(msg);
    process.exit(1);
  }
}

assert(typeof pkg.name === 'string', 'package.json: name must be a string');
assert(typeof pkg.version === 'string', 'package.json: version must be a string');
if (pkg.dependencies) assert(typeof pkg.dependencies === 'object', 'dependencies must be an object');
if (pkg.devDependencies) assert(typeof pkg.devDependencies === 'object', 'devDependencies must be an object');

function checkDeps(obj, name) {
  for (const [k, v] of Object.entries(obj || {})) {
    if (!v) {
      console.error(`${name} dependency ${k} has empty version`);
      process.exit(1);
    }
  }
}
checkDeps(pkg.dependencies, '');
checkDeps(pkg.devDependencies, 'dev');

console.log('package.json lint passed');
