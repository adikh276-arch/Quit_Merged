const fs = require('fs');
const content = fs.readFileSync('src/data/substances.ts', 'utf-8');
const chunks = content.split('// ===== ');
for (let i = 1; i < chunks.length; i++) {
  const chunk = chunks[i];
  const nameMatch = chunk.match(/===== *\n\s*\{\s*slug:\s*'([^']+)'/);
  const name = nameMatch ? nameMatch[1] : `Unknown ${i}`;
  
  const calcMatch = chunk.match(/calculator:\s*\{([\s\S]*?compute:\s*\([\s\S]*?=>\s*\{[\s\S]*?\})\s*,\n\s*(?:note|})/);
  if (calcMatch) {
    console.log(`=== ${name.toUpperCase()} CALCULATOR ===`);
    console.log(calcMatch[1]);
    console.log('\n');
  }
}
