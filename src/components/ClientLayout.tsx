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
  return (
    <>
      <Header lang={lang} onLangChange={setLang} phone={contact?.phone} />
      <main className="min-h-screen">{children}</main>
      <Footer lang={lang} contact={contact} consult={consult} />
    </>
  );
}
