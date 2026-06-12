const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, 'new_substances_content.ts');
let content = fs.readFileSync(contentPath, 'utf8').trim();

if (content.startsWith('`')) {
  content = content.slice(1);
}
if (content.endsWith('`')) {
  content = content.slice(0, -1);
}

content = content.trim();

fs.writeFileSync(contentPath, content, 'utf8');
console.log('Successfully cleaned new_substances_content.ts by removing leading/trailing backticks.');
