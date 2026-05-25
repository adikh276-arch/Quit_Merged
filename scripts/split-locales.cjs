const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const srcDir = path.join(__dirname, '../src');
const modulesDir = path.join(srcDir, 'modules');

const substances = [
  'alcohol', 'tobacco', 'opioids', 'cannabis', 'stimulants', 'benzodiazepines', 'kratom', 'mdma'
];

// Ensure modules directory exists
if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

// Ensure each module has an i18n directory
substances.forEach(sub => {
  const dir = path.join(modulesDir, sub, 'i18n');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
const dashboardI18nDir = path.join(modulesDir, 'dashboard', 'i18n');
if (!fs.existsSync(dashboardI18nDir)) {
  fs.mkdirSync(dashboardI18nDir, { recursive: true });
}

// Find all JSON files in the locales directory
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

console.log(`Found ${files.length} existing translation files to split.`);

files.forEach(file => {
  const lang = path.basename(file, '.json');
  const filePath = path.join(localesDir, file);
  
  let translations;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    translations = JSON.parse(content);
  } catch (err) {
    console.error(`Failed to parse ${file}:`, err);
    return;
  }

  // Initialize module buckets
  const buckets = {
    dashboard: {}
  };
  substances.forEach(sub => {
    buckets[sub] = {};
  });

  // Distribute keys based on naming patterns
  Object.keys(translations).forEach(key => {
    let matched = false;
    
    // Check if key belongs to a substance
    for (const sub of substances) {
      if (key.startsWith(`quit.substances.${sub}.`)) {
        buckets[sub][key] = translations[key];
        matched = true;
        break;
      }
    }
    
    // Default to dashboard
    if (!matched) {
      buckets['dashboard'][key] = translations[key];
    }
  });

  // Save the buckets
  // Handle language code mappings
  const targetLangs = [lang];
  if (lang === 'zh') {
    targetLangs.push('zh-Hans');
  }

  targetLangs.forEach(targetLang => {
    // Write dashboard translations
    fs.writeFileSync(
      path.join(dashboardI18nDir, `${targetLang}.json`),
      JSON.stringify(buckets['dashboard'], null, 2),
      'utf8'
    );

    // Write substance translations
    substances.forEach(sub => {
      fs.writeFileSync(
        path.join(modulesDir, sub, 'i18n', `${targetLang}.json`),
        JSON.stringify(buckets[sub], null, 2),
        'utf8'
      );
    });
  });

  console.log(`Successfully split ${file} into ${Object.keys(buckets).length} modules.`);
});

console.log('All existing translations have been modularized successfully!');
