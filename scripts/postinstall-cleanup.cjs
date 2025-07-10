const fs = require('fs');
const paths = [
  'node_modules/drizzle-orm/mysql-core',
  'node_modules/drizzle-orm/sqlite-core',
  'node_modules/bun-types'
];
paths.forEach((p) => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`Removed ${p}`);
  }
});
