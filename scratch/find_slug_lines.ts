import * as fs from 'fs';

const content = fs.readFileSync('src/data/substances.ts', 'utf8');
const lines = content.split('\n');

console.log('Slugs and line numbers:');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('slug:')) {
    console.log(`- Line ${i + 1}: ${line.trim()}`);
  }
}
