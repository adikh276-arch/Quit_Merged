import * as fs from 'fs';

const enJson = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));
console.log('Top level keys in en.json:', Object.keys(enJson));
if (enJson.quit) {
  console.log('Keys in quit:', Object.keys(enJson.quit));
}
