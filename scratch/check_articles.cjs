const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/data/substances.ts'), 'utf8');

// We will parse substances by looking at their "slug:" property and then find the articles list length.
// To do this simply, we will use a quick regex or direct extraction since it is a typescript file.
// Let's print out slices of the file or use a simple parsing strategy.
console.log('Inspecting substances.ts articles...');

// Let's count how many times "slug:" and "articles:" appear or inspect them.
const substancesList = [];
// We can use a regex to find all slugs
const slugRegex = /slug:\s*'([^']+)'/g;
let match;
while ((match = slugRegex.exec(content)) !== null) {
  const slug = match[1];
  // Find where this slug starts
  const startIndex = match.index;
  // Find the next slug or the end of the file
  const nextMatch = slugRegex.exec(content);
  const endIndex = nextMatch ? nextMatch.index : content.length;
  // reset regex lastIndex since we consumed one match
  if (nextMatch) {
    slugRegex.lastIndex = nextMatch.index + 1;
  }
  
  const substanceBody = content.substring(startIndex, endIndex);
  // Find articles block in this substance
  const articlesMatch = substanceBody.match(/articles:\s*\[([\s\S]*?)\]/);
  if (articlesMatch) {
    const articlesContent = articlesMatch[1].trim();
    // Count how many objects are in the array
    const articleObjects = articlesContent.split(/},\s*{/);
    const count = articlesContent ? articleObjects.length : 0;
    substancesList.push({ slug, articlesCount: count, hasArticles: count > 0 });
  } else {
    substancesList.push({ slug, articlesCount: 0, hasArticles: false });
  }
}

console.log(JSON.stringify(substancesList, null, 2));
