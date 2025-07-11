const { execSync } = require('child_process');

function search(pattern) {
  try {
    return execSync(`grep -R --include='*.ts' --include='*.tsx' --exclude-dir=node_modules --exclude-dir=.git "${pattern}"`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

let hasErrors = false;

const metadataMisuse = search("import { Metadata } from 'next'");
if (metadataMisuse) {
  console.error('Metadata must be imported using `import type`:\n' + metadataMisuse);
  hasErrors = true;
}

const metadataNamespace = search('Metadata\\.');
if (metadataNamespace) {
  console.error('Metadata must not be used as a namespace:\n' + metadataNamespace);
  hasErrors = true;
}

const typePatterns = [
  ['ControllerProps', 'react-hook-form'],
  ['FieldPath', 'react-hook-form'],
  ['FieldValues', 'react-hook-form'],
  ['NameType', 'recharts/types/component/DefaultTooltipContent'],
  ['Payload', 'recharts/types/component/DefaultTooltipContent'],
  ['ValueType', 'recharts/types/component/DefaultTooltipContent'],
  ['NextRequest', 'next/server'],
  ['NextApiRequest', 'next'],
  ['NextApiResponse', 'next'],
  ['ButtonProps', '@/components/ui/button'],
];

for (const [name, mod] of typePatterns) {
  const result = search(`import { ${name} } from '${mod}'`);
  if (result) {
    console.error(`${name} must be imported using \`import type\`:\n` + result);
    hasErrors = true;
  }
}

const legacyRequire = search('require(');
if (legacyRequire) {
  console.error('Legacy require() usage detected:\n' + legacyRequire);
  hasErrors = true;
}

if (hasErrors) process.exit(1);
