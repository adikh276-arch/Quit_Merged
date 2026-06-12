/**
 * inject_new_substances.cjs
 * Reads new_substances_content.ts (pure TS content) and splices it into substances.ts
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/substances.ts');
const contentFile = path.join(__dirname, 'new_substances_content.ts');

let original = fs.readFileSync(filePath, 'utf8');
const newSubstances = fs.readFileSync(contentFile, 'utf8');

// Find the start of the vaping block — search for the comment OR the slug
let startIdx = original.indexOf("// ===== VAPING =====");
if (startIdx === -1) {
  // Fallback: find the line with slug: 'vaping' and walk back to the {
  startIdx = original.indexOf("slug: 'vaping'");
  if (startIdx === -1) {
    console.error('ERROR: Cannot find vaping block');
    process.exit(1);
  }
  let braceIdx = original.lastIndexOf('{', startIdx);
  startIdx = braceIdx;
} else {
  // Walk back to find the newline before the comment
  let lineStart = original.lastIndexOf('\n', startIdx);
  startIdx = lineStart + 1;
}

// Find the end of the methamphetamine block
// The pattern: last achievements: [] followed by closing }
let searchFrom = startIdx;
let lastAchievementsIdx = -1;
while (true) {
  let found = original.indexOf('achievements: []', searchFrom);
  if (found === -1) break;
  lastAchievementsIdx = found;
  searchFrom = found + 1;
}

if (lastAchievementsIdx === -1) {
  console.error('ERROR: Cannot find last achievements: [] block');
  process.exit(1);
}

// Find the closing } after achievements: []
let endIdx = original.indexOf('}', lastAchievementsIdx + 'achievements: []'.length);
if (endIdx === -1) {
  console.error('ERROR: Cannot find closing } after last achievements block');
  process.exit(1);
}
endIdx += 1; // past the }

// Build new content
const before = original.slice(0, startIdx).trimEnd() + '\n';
const after = '\n' + original.slice(endIdx).replace(/^\s*\n/, '');

const result = before + newSubstances.trim() + after;

fs.writeFileSync(filePath, result);

console.log(`Done! Old size: ${original.length} bytes, New size: ${result.length} bytes`);

// Verify article counts
for (const slug of ['vaping', 'chewing-tobacco', 'cocaine', 'methamphetamine']) {
  const si = result.indexOf(`slug: '${slug}'`);
  const ei = result.indexOf(`slug: '`, si + 10);
  const chunk = result.substring(si, ei > 0 ? ei : si + 200000);
  const articles = (chunk.match(/id: 'a\d+'/g) || []).length;
  const trackers = (chunk.match(/chartType:/g) || []).length;
  const activities = (chunk.match(/type: '(quiz|visualization|breathing|affirmation|body-scan)'/g) || []).length;
  console.log(`${slug}: trackers=${trackers}, activities=${activities}, articles=${articles}`);
}
