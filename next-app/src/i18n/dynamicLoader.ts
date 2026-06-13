import i18n from 'i18next';

/**
 * Dynamically loads translation resources for a specific module and language.
 * Falls back to English ('en') if the specified language is not found.
 */
export const loadModuleTranslations = async (moduleName: string, lang: string) => {
  // Normalize language tags if they contain regions or sub-tags
  let targetLang = lang;
  if (lang === 'zh-CN') targetLang = 'zh-Hans';
  if (lang === 'zh-TW') targetLang = 'zh-Hant';

  let resources: any = null;

  try {
    resources = (await import(`../modules/${moduleName}/i18n/${targetLang}.json`)).default;
  } catch (err) {
    if (targetLang.startsWith('zh')) {
      try {
        resources = (await import(`../modules/${moduleName}/i18n/zh-Hans.json`)).default;
      } catch (err2) {
        try {
          resources = (await import(`../modules/${moduleName}/i18n/zh.json`)).default;
        } catch (err3) {
          // ignore
        }
      }
    }
    
    if (!resources) {
      try {
        // Fallback to English
        resources = (await import(`../modules/${moduleName}/i18n/en.json`)).default;
      } catch (e) {
        console.warn(`Locale file not found for module ${moduleName} in lang ${targetLang} or en`);
        return;
      }
    }
  }

  if (resources) {
    // 1. Add translations to the module-specific namespace
    i18n.addResourceBundle(targetLang, moduleName, resources, true, true);

    // 2. Deep-merge into the default 'translation' namespace to ensure 100% compatibility with global t() lookups
    i18n.addResourceBundle(targetLang, 'translation', resources, true, true);

    console.log(`[i18n] Successfully loaded module "${moduleName}" for language "${targetLang}"`);
  }
};
