const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/data/substances.ts'), 'utf8');

// Find all substance boundaries or objects
console.log('Substances list in file:');
const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
console.log('Slugs found:', matches.map(m => m[1]));

// Let's write a script that parses the typescript array roughly by matching objects in the top-level array.
// To do this, let's load substances.ts and evaluate it using a node cjs trick by changing import to require if possible,
// or by parsing it with regex more robustly.
// Let's parse each substance's slug and check the articles block size using a simple character loop or index.
for (const match of matches) {
  const slug = match[1];
  const slugIndex = match.index;
  // Let's find the nearest "articles: [" after this slug
  const afterSlug = content.substring(slugIndex);
  const nextSlugMatch = afterSlug.match(/slug:\s*['"]([^'"]+)['"]/);
  const searchBoundary = afterSlug.indexOf('slug:', 10);
  const substanceBlock = searchBoundary !== -1 ? afterSlug.substring(0, searchBoundary) : afterSlug;
  
  const articlesMatch = substanceBlock.match(/articles:\s*\[([\s\S]*?)\]/);
  if (articlesMatch) {
    const articlesArrayContent = articlesMatch[1].trim();
    // Count objects
    let count = 0;
    if (articlesArrayContent) {
      // Split on articles, which look like: { id: '...', ... }
      const items = articlesArrayContent.split(/},\s*{/);
      count = items.length;
    }
    console.log(`- ${slug}: ${count} articles`);
  } else {
    console.log(`- ${slug}: NO articles array found!`);
  }
}
