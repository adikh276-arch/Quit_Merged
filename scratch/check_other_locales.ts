import * as fs from 'fs';
import * as path from 'path';

const localesDir = 'src/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
  const keys = Object.keys(content);
  const substanceKeys = keys.filter(k => k.startsWith('quit.substances.'));
  const articleKeys = substanceKeys.filter(k => k.includes('.articles.'));
  const emptyKeys = articleKeys.filter(k => !content[k]);
  
  // Count articles by slug
  const slugs: Record<string, number> = {};
  for (const k of articleKeys) {
    const parts = k.split('.');
    const slug = parts[2];
    slugs[slug] = (slugs[slug] || 0) + 1;
  }
  
  console.log(`\nLocale: ${file} (total keys: ${keys.length})`);
  console.log(`- quit.substances.* keys: ${substanceKeys.length}`);
  console.log(`- article keys: ${articleKeys.length}`);
  console.log(`- empty article keys: ${emptyKeys.length}`);
  console.log(`- Slugs with article keys:`, slugs);
}
