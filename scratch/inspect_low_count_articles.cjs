const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/data/substances.ts'), 'utf8');

const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];

for (const match of matches) {
  const slug = match[1];
  const slugIndex = match.index;
  const afterSlug = content.substring(slugIndex);
  const searchBoundary = afterSlug.indexOf('slug:', 10);
  const substanceBlock = searchBoundary !== -1 ? afterSlug.substring(0, searchBoundary) : afterSlug;
  
  const articlesMatch = substanceBlock.match(/articles:\s*\[([\s\S]*?)\]/);
  if (articlesMatch) {
    const articlesArrayContent = articlesMatch[1].trim();
    const items = [];
    if (articlesArrayContent) {
      // Find each article object
      const artRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*tag:\s*['"]([^'"]+)['"]/g;
      let artMatch;
      while ((artMatch = artRegex.exec(articlesArrayContent)) !== null) {
        items.push({ id: artMatch[1], title: artMatch[2], tag: artMatch[3] });
      }
    }
    if (items.length < 10) {
      console.log(`Substance: ${slug} (${items.length} articles)`);
      items.forEach(it => {
        console.log(`  - [${it.id}] ${it.title} (${it.tag})`);
      });
    }
  }
}
