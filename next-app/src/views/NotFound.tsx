"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location);
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-5">
      <button 
        onClick={() => {
          if (window.parent !== window) {
            window.parent.postMessage({ action: 'exit' }, 'https://web.mantracare.com');
          } else {
            window.location.href = 'https://web.mantracare.com';
          }
        }} 
        className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> {t('quit.app.back')}
      </button>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t('quit.app.notfound.title')}</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          {t('quit.app.notfound.return')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
