const { execSync } = require('child_process');

const substances = [
  'dashboard', 'alcohol', 'tobacco', 'opioids', 'cannabis', 'stimulants', 'benzodiazepines', 'kratom', 'mdma'
];

console.log('--- Starting Orchestrated Substances & Dashboard Translation ---');

for (const sub of substances) {
  console.log(`\n==================================================`);
  console.log(`Translating module: ${sub.toUpperCase()}`);
  console.log(`==================================================`);
  try {
    execSync(`node scripts/translate-module.cjs ${sub}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error translating module ${sub}:`, err.message);
    process.exit(1);
  }
}

console.log('\n--- All Modules and Substances Translated Successfully ---');
