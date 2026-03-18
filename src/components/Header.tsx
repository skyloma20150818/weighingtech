"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import SmartImage from './SmartImage';
import { Language, translations } from '../i18n';

interface HeaderProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  phone?: string;
}

export default function Header({ lang, onLangChange, phone }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const t = translations[lang];
  const isHomePage = pathname === '/';
  
  // 首页未滚动时使用透明导航栏，其他情况使用白色背景
  const isTransparentNav = isHomePage && !isScrolled;

  useEffect(() => {
    // 初始检测滚动位置（处理页面加载时直接跳转到锚点的情况）
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // 立即检查一次
    checkScroll();
    
    // 延迟再检查一次（处理浏览器自动滚动到锚点的情况）
    const timer = setTimeout(checkScroll, 100);
    
    // 监听滚动
    window.addEventListener('scroll', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkScroll);
    };
  }, [pathname]); // pathname 变化时重新检测

  const navItems = isHomePage
    ? [
        { id: 'home', label: t.nav.home, href: '#' },
        { id: 'products', label: t.nav.products, href: '#products' },
        { id: 'solutions', label: t.nav.solutions, href: '#solutions' },
        { id: 'support', label: lang === 'zh' ? '服务支持' : 'Support', href: '#support' },
        { id: 'album', label: t.nav.album, href: '#album' },
        { id: 'about', label: t.nav.about, href: '#about' },
        { id: 'downloads', label: t.nav.downloads, href: '/downloads' },
      ]
    : [
        { id: 'home', label: t.nav.home, href: '/' },
        { id: 'products', label: t.nav.products, href: '/#products' },
        { id: 'solutions', label: t.nav.solutions, href: '/#solutions' },
        { id: 'support', label: lang === 'zh' ? '服务支持' : 'Support', href: '/#support' },
        { id: 'album', label: t.nav.album, href: '/#album' },
        { id: 'about', label: t.nav.about, href: '/#about' },
        { id: 'downloads', label: t.nav.downloads, href: '/downloads' },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparentNav
        ? 'bg-white/10 backdrop-blur-md border-b border-white/10'
        : 'bg-white/95 backdrop-blur-lg shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <SmartImage 
              src="/logo.png" 
              alt="唯英科技 Logo" 
              width={160}
              height={48}
              className={`h-12 w-auto object-contain transition-all duration-300 ${isTransparentNav ? 'brightness-0 invert' : ''}`}
              priority
            />
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => isHomePage && scrollToSection(e, item.id, item.href)}
                className={`relative font-medium transition-colors duration-300 py-2 group ${
                  isTransparentNav ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-[#2B4A7A]'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isTransparentNav ? 'bg-white' : 'bg-[#2B4A7A]'
                }`} />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className={`text-right transition-colors duration-300 ${isTransparentNav ? 'text-white' : ''}`}>
              <div className={`text-sm ${isTransparentNav ? 'text-white/70' : 'text-slate-500'}`}>{t.nav.hotline}</div>
              <div className={`font-bold ${isTransparentNav ? 'text-white' : 'text-[#2B4A7A]'}`}>{phone || '023-68283031'}</div>
            </div>
            <div className={`flex rounded-lg p-1 transition-all duration-300 ${isTransparentNav ? 'bg-white/10 backdrop-blur-sm' : 'bg-slate-100'}`}>
              <button
                onClick={() => onLangChange('zh')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 ${lang === 'zh' ? 'bg-white text-[#2B4A7A] shadow-sm scale-105' : isTransparentNav ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
              >
                中
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 ${lang === 'en' ? 'bg-white text-[#2B4A7A] shadow-sm scale-105' : isTransparentNav ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <div className={`flex rounded-lg p-1 transition-all duration-300 ${isTransparentNav ? 'bg-white/10 backdrop-blur-sm' : 'bg-slate-100'}`}>
              <button
                onClick={() => onLangChange('zh')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-300 ${lang === 'zh' ? 'bg-white text-[#2B4A7A] shadow-sm' : isTransparentNav ? 'text-white/80' : 'text-slate-500'}`}
              >
                中
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-300 ${lang === 'en' ? 'bg-white text-[#2B4A7A] shadow-sm' : isTransparentNav ? 'text-white/80' : 'text-slate-500'}`}
              >
                EN
              </button>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`transition-colors duration-300 ${isTransparentNav ? 'text-white' : 'text-slate-600'}`}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`backdrop-blur-lg border-t transition-colors duration-300 ${isTransparentNav ? 'bg-slate-900/90 border-white/10' : 'bg-white/95 border-slate-200'}`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (isHomePage) {
                    scrollToSection(e, item.id, item.href);
                  }
                }}
                className={`block py-3 text-base font-medium px-2 transform transition-all duration-300 hover:translate-x-2 ${
                  isTransparentNav 
                    ? 'border-b border-white/10 text-white/90 hover:text-white' 
                    : 'border-b border-slate-100 text-slate-600 hover:text-[#2B4A7A]'
                }`}
                style={{ 
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)'
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
