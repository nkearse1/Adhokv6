const { execSync } = require('child_process');

const patterns = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'createClient',
  '@supabase/supabase-js',
  'supabaseClient'
];

const globs = "--include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx'";

let found = false;
patterns.forEach((pattern) => {
  try {
    const result = execSync(`grep -R ${globs} --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next "${pattern}"`, { encoding: 'utf8' });
    if (result.trim()) {
      console.error(`Forbidden Supabase reference found for pattern "${pattern}":\n${result}`);
      found = true;
    }
  } catch (err) {
    // grep exits with code 1 when no matches are found; ignore
  }
});

if (found) {
  console.error('Supabase references are not allowed.');
  process.exit(1);
}
