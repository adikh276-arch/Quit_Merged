import { substances } from '../src/data/substances';

for (const s of substances) {
  console.log(`\n================= SUBSTANCE: ${s.slug.toUpperCase()} =================`);
  const articles = s.articles || [];
  console.log(`Total articles: ${articles.length}`);
  if (articles.length > 0) {
    console.log(`First Article Title: "${articles[0].title}"`);
    console.log(`First Article Content Snippet: "${articles[0].content.substring(0, 150)}..."`);
    console.log(`Last Article Title: "${articles[articles.length - 1].title}"`);
  }
}
