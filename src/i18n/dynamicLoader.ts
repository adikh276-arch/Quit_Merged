import i18n from 'i18next';

// Use Vite's import.meta.glob to dynamically locate and load module translation files
const localeModules = import.meta.glob('../modules/*/i18n/*.json');

/**
 * Dynamically loads translation resources for a specific module and language.
 * Falls back to English ('en') if the specified language is not found.
 */
export const loadModuleTranslations = async (moduleName: string, lang: string) => {
  // Normalize language tags if they contain regions or sub-tags
  let targetLang = lang;
  if (lang === 'zh-CN') targetLang = 'zh-Hans';
  if (lang === 'zh-TW') targetLang = 'zh-Hant';

  const path = `../modules/${moduleName}/i18n/${targetLang}.json`;
  const fallbackPath = `../modules/${moduleName}/i18n/en.json`;

  let globFn = localeModules[path];
  
  if (!globFn) {
    // Attempt standard zh mapping if exact match fails
    if (targetLang.startsWith('zh')) {
      globFn = localeModules[`../modules/${moduleName}/i18n/zh.json`] || localeModules[`../modules/${moduleName}/i18n/zh-Hans.json`];
    }
  }

  // Fallback to English
  if (!globFn) {
    globFn = localeModules[fallbackPath];
  }

  if (!globFn) {
    console.warn(`Locale file not found for module ${moduleName} in lang ${targetLang} or en`);
    return;
  }

  try {
    const module = (await globFn()) as { default: Record<string, string> };
    const resources = module.default;

    // 1. Add translations to the module-specific namespace
    i18n.addResourceBundle(targetLang, moduleName, resources, true, true);

    // 2. Deep-merge into the default 'translation' namespace to ensure 100% compatibility with global t() lookups
    i18n.addResourceBundle(targetLang, 'translation', resources, true, true);

    console.log(`[i18n] Successfully loaded module "${moduleName}" for language "${targetLang}"`);
  } catch (err) {
    console.error(`[i18n] Error loading translations for module "${moduleName}" in language "${targetLang}"`, err);
  }
};
