import * as fs from 'fs';

const enJson = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf8'));

console.log('Value in en.json for alcohol.articles.a1.title:', enJson['quit.substances.alcohol.articles.a1.title']);
console.log('Value in en.json for alcohol.articles.a1.content snippet:', enJson['quit.substances.alcohol.articles.a1.content']?.substring(0, 150));
console.log('Value in en.json for alcohol.articles.a14.title:', enJson['quit.substances.alcohol.articles.a14.title']);
