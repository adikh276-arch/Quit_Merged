import { substances } from '../src/data/substances';

console.log('Real Substance Article Counts:');
for (const s of substances) {
  console.log(`- ${s.slug}: ${s.articles ? s.articles.length : 0} articles`);
}
