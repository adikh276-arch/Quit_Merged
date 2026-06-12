const fs = require('fs');

const files = [
  'src/pages/Landing.tsx',
  'src/pages/SubstancePage.tsx',
  'src/components/SubstanceIcon.tsx',
  'src/index.css',
  'tailwind.config.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/smoking/g, 'tobacco');
  content = content.replace(/prescription-stimulants/g, 'stimulants');
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
