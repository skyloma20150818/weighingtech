"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Language, translations } from '../i18n';

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export default function Header({ lang, onLangChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = translations[lang];
  const isHomePage = pathname === '/';

  const navItems = isHomePage
    ? [
        { id: 'home', label: t.nav.home, href: '#' },
        { id: 'products', label: t.nav.products, href: '#products' },
        { id: 'solutions', label: t.nav.solutions, href: '#solutions' },
        { id: 'album', label: t.nav.album, href: '#album' },
        { id: 'about', label: t.nav.about, href: '#about' },
      ]
    : [
        { id: 'home', label: t.nav.home, href: '/' },
        { id: 'products', label: t.nav.products, href: '/#products' },
        { id: 'solutions', label: t.nav.solutions, href: '/#solutions' },
        { id: 'album', label: t.nav.album, href: '/#album' },
        { id: 'about', label: t.nav.about, href: '/#about' },
      ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="唯英科技 Logo" className="h-12 object-contain" />
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => isHomePage && scrollToSection(e, item.id, item.href)}
                className="relative font-medium transition-colors duration-300 py-2 text-slate-600 hover:text-[#2B4A7A]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-slate-500">{t.nav.hotline}</div>
              <div className="font-bold text-[#2B4A7A]">023-68283031</div>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => onLangChange('zh')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${lang === 'zh' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                中
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${lang === 'en' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <Link
                href="/admin"
                className="ml-4 px-3 py-1.5 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
              >
                管理
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => onLangChange('zh')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${lang === 'zh' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500'}`}
              >
                中
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${lang === 'en' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500'}`}
              >
                EN
              </button>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (isHomePage) {
                    scrollToSection(e, item.id, item.href);
                  }
                }}
                className="block py-3 text-base font-medium border-b border-slate-100 text-slate-600 px-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
