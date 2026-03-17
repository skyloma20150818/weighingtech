"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { Language } from '../i18n';
import { useLanguage } from './LanguageContext';
import { Contact, Consult } from '../data';

interface ClientLayoutProps {
  children: React.ReactNode;
  contact?: Contact | null;
  consult?: Consult | null;
}

export default function ClientLayout({ children, contact, consult }: ClientLayoutProps) {
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
      <Header lang={lang} onLangChange={setLang} phone={contact?.phone} />
      <main className="min-h-screen">{children}</main>
      <Footer lang={lang} contact={contact} consult={consult} />
    </>
  );
}
