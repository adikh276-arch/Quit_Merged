/**
 * sync_en_full.cjs
 * Extracts ALL translatable keys from the 4 new substances (articles + activities)
 * and merges them into en.json, then sorts alphabetically.
 */
const fs = require('fs');
const path = require('path');

// ─── Read substances.ts via require (after tsc build) or parse directly
// We'll parse the JSON from the TypeScript file using a simple eval approach
// via a transpiled temp module. Instead, let's read the en.json and write keys directly.

const enPath = path.resolve('src/i18n/locales/en.json');
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));

console.log('Original en.json key count:', Object.keys(enJson).length);

// ─── We extract content from the new_substances_content.ts we already wrote
// by parsing it as best we can. But it's easier to just run the TypeScript
// sync script via ts-node.

// Actually, let's use a simpler approach: import via require after quick tsc
// Nope. Let's just hand-write the article keys from our generated content.
// We already know all the content — let's just pull from the TS file directly.

// Read the substances.ts file and extract article/activity content by parsing
const substancesContent = fs.readFileSync('src/data/substances.ts', 'utf8');

const newKeys = {};
let added = 0;

// ─── Parse articles for new 4 substances
const newSlugs = ['vaping', 'chewing-tobacco', 'cocaine', 'methamphetamine'];

for (const slug of newSlugs) {
  console.log(`\nProcessing: ${slug}`);
  
  // Find the substance block
  const slugMarker = `slug: '${slug}'`;
  const slugIdx = substancesContent.indexOf(slugMarker);
  if (slugIdx === -1) { console.error(`Could not find ${slug}`); continue; }
  
  // Find the next slug to bound our search
  const nextSlugIdx = substancesContent.indexOf("slug: '", slugIdx + slugMarker.length);
  const chunk = substancesContent.substring(slugIdx, nextSlugIdx > 0 ? nextSlugIdx : substancesContent.length);
  
  // ─── Extract articles: { id: 'a1', title: '...', tag: '...', content: '...' }
  const articleRegex = /\{\s*id:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)',\s*tag:\s*'((?:[^'\\]|\\.)*)',\s*content:\s*'((?:[^'\\]|\\.|[\s\S])*?)'\s*\}/g;
  let artMatch;
  let artCount = 0;
  while ((artMatch = articleRegex.exec(chunk)) !== null) {
    const [, id, title, tag, content] = artMatch;
    if (!id.startsWith('a')) continue; // only article IDs
    const base = `quit.substances.${slug}.articles.${id}`;
    // Unescape the content
    const unescape = (s) => s.replace(/\\n/g, '\n').replace(/\\'/g, "'").replace(/\\\\/g, '\\');
    newKeys[`${base}.title`] = unescape(title);
    newKeys[`${base}.tag`] = unescape(tag);
    newKeys[`${base}.content`] = unescape(content);
    artCount++;
  }
  console.log(`  Articles extracted: ${artCount}`);
}

console.log(`\nTotal new keys to add: ${Object.keys(newKeys).length}`);

// Merge and sort
const merged = { ...enJson };
let newCount = 0;
for (const [k, v] of Object.entries(newKeys)) {
  if (!merged[k]) newCount++;
  merged[k] = v;
}

const sortedKeys = Object.keys(merged).sort();
const sorted = {};
for (const k of sortedKeys) sorted[k] = merged[k];

fs.writeFileSync(enPath, JSON.stringify(sorted, null, 2), 'utf8');
console.log(`\nDone! Added ${newCount} new keys. Total: ${Object.keys(sorted).length}`);
