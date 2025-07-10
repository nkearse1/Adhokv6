const pkg = require('../package.json');
if (pkg.dependencies && pkg.dependencies['@netlify/plugin-nextjs']) {
  console.error('Forbidden dependency @netlify/plugin-nextjs detected');
  process.exit(1);
}
