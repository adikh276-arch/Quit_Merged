import { substances } from '../src/data/substances';
import * as fs from 'fs';
import * as path from 'path';

const slugs = ['vaping', 'chewing-tobacco', 'cocaine', 'methamphetamine'];
const enPath = path.resolve('src/i18n/locales/en.json');
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));

console.log('Original keys in en.json count:', Object.keys(enJson).length);

const newKeys: Record<string, string> = {};

for (const s of substances) {
  if (slugs.includes(s.slug)) {
    console.log(`Extracting articles for ${s.slug} (${s.articles ? s.articles.length : 0} articles)...`);
    const articles = s.articles || [];
    for (const art of articles) {
      const baseKey = `quit.substances.${s.slug}.articles.${art.id}`;
      newKeys[`${baseKey}.title`] = art.title;
      newKeys[`${baseKey}.tag`] = art.tag;
      newKeys[`${baseKey}.content`] = art.content;
    }
  }
}

// Merge new keys into enJson
const merged = { ...enJson, ...newKeys };

// Sort all keys alphabetically
const sortedKeys = Object.keys(merged).sort();
const sortedEnJson: Record<string, string> = {};
for (const k of sortedKeys) {
  sortedEnJson[k] = merged[k];
}

fs.writeFileSync(enPath, JSON.stringify(sortedEnJson, null, 2), 'utf8');
console.log('Keys synced and en.json sorted successfully!');
console.log('New total keys count in en.json:', Object.keys(sortedEnJson).length);
