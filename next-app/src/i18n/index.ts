import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Comprehensive list of supported languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'zh', name: '中文 (简体)' },
  { code: 'zh-Hans', name: '中文 (简体)' },
  { code: 'zh-Hant', name: '中文 (繁體)' },
  { code: 'ja', name: '日本語' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'cs', name: 'Čeština' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'ro', name: 'Română' },
  { code: 'hu', name: 'Magyar' },
  { code: 'uk', name: 'Українська' },
  { code: 'he', name: 'עברית' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ur', name: 'اردو' }
];

export const getInitialLanguage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langQuery = urlParams.get('lang');
  
  if (langQuery && languages.some(l => l.code === langQuery)) {
    localStorage.setItem('language', langQuery);
    return langQuery;
  }
  
  const localLang = localStorage.getItem('language');
  if (localLang && languages.some(l => l.code === localLang)) {
    return localLang;
  }
  
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    },
    react: {
      useSuspense: false // Ensure smooth rendering transitions without suspense flashing
    }
  });

export default i18n;
