const fs = require('fs');
let content = fs.readFileSync('src/data/substances.ts', 'utf-8');

// Fix duplicates created by bad replace
content = content.replace(/note: '[^']*',\n\s*},\n\s*note: "[^"]*",\n\s*},/g, (match) => {
  return match.split('\n').slice(0, 2).join('\n') + ',';
});

// some might be without a note originally?
content = content.replace(/},\n\s*},\n\s*activities:/g, '},\n    activities:');
content = content.replace(/},\n\s*note: "[^"]*",\n\s*},/g, '},'); // wait, if there are any others

fs.writeFileSync('src/data/substances.ts', content);
