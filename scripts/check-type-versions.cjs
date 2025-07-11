const fs = require('fs');
const lock = fs.readFileSync('yarn.lock', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

function getMajors(name) {
  const regex = new RegExp(`"${name}@[^"]*"\n  version \"([^\"]+)\"`, 'g');
  const majors = new Set();
  let m;
  while ((m = regex.exec(lock))) {
    majors.add(m[1].split('.')[0]);
  }
  return majors;
}

['@types/node', '@types/pg'].forEach(name => {
  const majors = getMajors(name);
  if (majors.size > 1) {
    console.error(`Multiple major versions for ${name}: ${[...majors].join(', ')}`);
    process.exit(1);
  }
});

if (pkg.resolutions) {
  for (const [name, version] of Object.entries(pkg.resolutions)) {
    if (!name.startsWith('@types/')) continue;
    const declared = pkg.dependencies?.[name] || pkg.devDependencies?.[name];
    if (declared && !version.startsWith(declared.split('.')[0])) {
      console.error(`Resolution ${name}@${version} conflicts with declared range ${declared}`);
      process.exit(1);
    }
  }
}

console.log('type package versions consistent');
