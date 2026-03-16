"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { Language } from '../i18n';
import { useLanguage } from './LanguageContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // 首页和开发工具页面不显示公共 Header/Footer
  const isDevEditor = pathname === '/dev-editor';
  if (isHomePage || isDevEditor) {
    return <>{children}</>;
  }

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />
      <main className="min-h-screen">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
