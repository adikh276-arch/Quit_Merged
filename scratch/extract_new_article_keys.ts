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

console.log('Extracted new keys count:', Object.keys(newKeys).length);
for (const [k, v] of Object.entries(newKeys).slice(0, 6)) {
  console.log(`- ${k}: "${v.substring(0, 60)}..."`);
}
