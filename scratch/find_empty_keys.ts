import * as fs from 'fs';

const enJson = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));
const keys = Object.keys(enJson);

console.log('Empty keys in en.json:');
for (const k of keys) {
  if (enJson[k] === '' || enJson[k] === null || enJson[k] === undefined) {
    console.log(`- ${k}: "${enJson[k]}"`);
  }
}
