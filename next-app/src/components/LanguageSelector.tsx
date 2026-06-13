"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { languages } from '@/i18n';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update URL param if it exists or was requested
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-55">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={i18n.language || 'en'}
        onChange={handleLanguageChange}
        className="bg-transparent text-sm text-muted-foreground border-none outline-none cursor-pointer focus:ring-0 appearance-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-background text-foreground">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;

