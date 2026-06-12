import * as fs from 'fs';

const enJson = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));
const keys = Object.keys(enJson);

const substancesKeys = keys.filter(k => k.startsWith('quit.substances.'));
console.log(`Total quit.substances.* keys: ${substancesKeys.length}`);

// Group by substance slug
const substanceGroups: Record<string, string[]> = {};
for (const k of substancesKeys) {
  const parts = k.split('.');
  // quit.substances.[slug]...
  const slug = parts[2];
  if (!substanceGroups[slug]) {
    substanceGroups[slug] = [];
  }
  substanceGroups[slug].push(k);
}

for (const [slug, subKeys] of Object.entries(substanceGroups)) {
  const articleKeys = subKeys.filter(k => k.includes('.articles.'));
  const emptyKeys = subKeys.filter(k => !enJson[k]);
  console.log(`- ${slug}: totalKeys=${subKeys.length}, articleKeys=${articleKeys.length}, emptyKeys=${emptyKeys.length}`);
}
