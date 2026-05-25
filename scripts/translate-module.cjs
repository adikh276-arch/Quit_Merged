const fs = require('fs');
const path = require('path');
require('dotenv').config();

const substances = [
  'alcohol', 'tobacco', 'opioids', 'cannabis', 'stimulants', 'benzodiazepines', 'kratom', 'mdma'
];

const allModules = ['dashboard', ...substances];

// Parse input arguments
const moduleName = process.argv[2];
if (!moduleName || !allModules.includes(moduleName)) {
  console.error(`Error: Please specify a valid module name. Options are:\n  ${allModules.join(', ')}`);
  process.exit(1);
}

const key = process.env.AZURE_TRANSLATOR_KEY;
const region = process.env.AZURE_TRANSLATOR_REGION || 'eastus';

if (!key) {
  console.error('Error: AZURE_TRANSLATOR_KEY is not defined in your .env file.');
  process.exit(1);
}

// target languages to translate
const targetLanguages = [
  'es', 'fr', 'de', 'pt', 'ru',
  'zh-Hans', 'zh-Hant',
  'ja', 'ko',
  'ar', 'hi', 'bn',
  'id', 'tr', 'vi',
  'it', 'pl', 'th', 'tl',
  'nl', 'sv', 'no', 'da', 'fi',
  'cs', 'el', 'ro', 'hu', 'uk',
  'he', 'ms', 'ta', 'te', 'ur'
];

const moduleDir = path.join(__dirname, `../src/modules/${moduleName}/i18n`);
const sourcePath = path.join(moduleDir, 'en.json');

if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source file not found at ${sourcePath}`);
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const sourceKeys = Object.keys(sourceData);

if (sourceKeys.length === 0) {
  console.log(`Module "${moduleName}" has no keys in en.json. Exiting.`);
  process.exit(0);
}

console.log(`Starting translation for module "${moduleName}". Total keys to process: ${sourceKeys.length}`);

// Protect variables by wrapping them in notranslate span
function protectVariables(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/\{\{[^}]+\}\}/g, (match) => {
    return `<span class="notranslate">${match}</span>`;
  });
}

// Restore variable format
function restoreVariables(text) {
  if (typeof text !== 'string') return text;
  // Strip the wrapping span and keep content intact
  return text.replace(/<span class="notranslate">(.*?)<\/span>/g, '$1');
}

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Call Azure API with retry mechanism
async function translateBatch(texts, toLang) {
  const azureToLang = toLang === 'tl' ? 'fil' : toLang; // Map Tagalog to Filipino for Azure
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${azureToLang}&textType=html`;

  const body = texts.map(t => ({ Text: protectVariables(t) }));
  
  let attempts = 0;
  const maxAttempts = 5;
  let delay = 1000;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Ocp-Apim-Subscription-Region': region,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Azure HTTP error ${response.status}: ${errText}`);
      }

      const results = await response.json();
      return results.map(r => restoreVariables(r.translations[0].text));
    } catch (err) {
      attempts++;
      console.warn(`Attempt ${attempts} failed for language ${toLang}: ${err.message}`);
      if (attempts >= maxAttempts) {
        throw err;
      }
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }
}

async function run() {
  for (const lang of targetLanguages) {
    const targetPath = path.join(moduleDir, `${lang}.json`);
    let existingData = {};

    if (fs.existsSync(targetPath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      } catch (err) {
        console.warn(`Failed to parse existing ${lang}.json, will overwrite.`);
      }
    }

    // Find missing keys (incremental mode)
    const missingKeys = sourceKeys.filter(k => !existingData[k] || existingData[k] === "");

    if (missingKeys.length === 0) {
      console.log(`[${lang}] Already translated fully. Skipping.`);
      continue;
    }

    console.log(`[${lang}] Found ${missingKeys.length} missing keys. Translating...`);

    const batchSize = 25;
    const newData = { ...existingData };

    for (let i = 0; i < missingKeys.length; i += batchSize) {
      const keysBatch = missingKeys.slice(i, i + batchSize);
      const textsBatch = keysBatch.map(k => sourceData[k]);

      try {
        const translations = await translateBatch(textsBatch, lang);
        
        keysBatch.forEach((key, idx) => {
          newData[key] = translations[idx];
        });

        console.log(`  [${lang}] Translated ${i + keysBatch.length}/${missingKeys.length} keys`);
        
        // Write incrementally to be safe from crashes
        fs.writeFileSync(targetPath, JSON.stringify(newData, null, 2), 'utf8');

        // Add safety gap
        await sleep(200);
      } catch (err) {
        console.error(`Fatal error translating batch for ${lang}:`, err.message);
        console.log(`Resume state saved in local ${lang}.json. You can run the script again to continue.`);
        process.exit(1);
      }
    }

    console.log(`[${lang}] Translation completed successfully! Saved to ${targetPath}`);
  }

  console.log(`\nModular translation completed successfully for "${moduleName}" across all 35 languages!`);
}

run().catch(err => {
  console.error('Unhandled script error:', err);
  process.exit(1);
});
