"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Eye, ShieldCheck, Cpu, Server, Monitor, Smartphone,
  CheckCircle2, FlaskConical, Globe, Share2, Phone, ArrowUpRight,
  Menu, X, CheckCircle, Settings, Wrench, Image as ImageIcon, ZoomIn, RefreshCw
} from 'lucide-react';
import { products, categories, companyAlbum, albumCategories, solutionVideos, solutionCategories, contact, consult, about, hero, Product } from '../data';
import Product360Viewer from '../components/Product360Viewer';
import ProductDetailModal from '../components/ProductDetailModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Language, translations } from '../i18n';

export default function App() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!heroVideoRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroVideoRef.current?.play().catch(console.error);
          } else {
            heroVideoRef.current?.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(heroVideoRef.current);
    
    return () => {
      if (heroVideoRef.current) observer.unobserve(heroVideoRef.current);
    };
  }, [hero?.videoUrl]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAlbumCategory, setActiveAlbumCategory] = useState('all');
  const [activeSolutionCategory, setActiveSolutionCategory] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selected360Product, setSelected360Product] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    e.preventDefault();
    setActiveNav(id);
    setIsMobileMenuOpen(false);

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80; // height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const filteredAlbum = activeAlbumCategory === 'all'
    ? companyAlbum
    : companyAlbum.filter(item => item.category === activeAlbumCategory);

  const filteredVideos = activeSolutionCategory === 'all'
    ? solutionVideos
    : solutionVideos.filter(item => item.category === activeSolutionCategory);



  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="唯英科技 Logo"
                className="h-12 object-contain"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'home', label: t.nav.home, href: '#' },
                { id: 'products', label: t.nav.products, href: '#products' },
                { id: 'solutions', label: t.nav.solutions, href: '#solutions' },
                { id: 'album', label: t.nav.album, href: '#album' },
                { id: 'about', label: t.nav.about, href: '#about' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.id, item.href)}
                  className={`relative font-medium transition-colors duration-300 py-2 ${activeNav === item.id
                      ? 'text-[#2B4A7A]'
                      : 'text-slate-600 hover:text-[#2B4A7A]'
                    }`}
                >
                  {item.label}
                  {activeNav === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2B4A7A] rounded-full shadow-[0_0_8px_rgba(43,74,122,0.8)] animate-pulse"></span>
                  )}
                </a>
              ))}
            </div>

            {/* Contact Info & Lang Toggle */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-slate-500">{t.nav.hotline}</div>
                <div className="font-bold text-[#2B4A7A]">023-68283031</div>
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setLang('zh')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${lang === 'zh' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  中
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${lang === 'en' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  EN
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <a
                  href="/dev-editor"
                  className="ml-4 px-3 py-1.5 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  管理
                </a>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setLang('zh')}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${lang === 'zh' ? 'bg-white text-[#2B4A7A] shadow-sm' : 'text-slate-500'}`}
                >
                  中
                </button>
                <button
                  onClick={() => setLang('en')}
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
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {[
                { id: 'home', label: t.nav.home, href: '#' },
                { id: 'products', label: t.nav.products, href: '#products' },
                { id: 'solutions', label: t.nav.solutions, href: '#solutions' },
                { id: 'album', label: t.nav.album, href: '#album' },
                { id: 'about', label: t.nav.about, href: '#about' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.id, item.href)}
                  className={`block py-3 text-base font-medium border-b border-slate-100 ${activeNav === item.id
                      ? 'text-[#2B4A7A] bg-blue-50/50 px-2 rounded-lg border-none mb-1'
                      : 'text-slate-600 px-2'
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2B4A7A] px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
                <CheckCircle size={16} />
                <span>{t.hero.badge}</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
                {t.hero.title1}<br />
                <span className="text-[#2B4A7A]">{t.hero.title2}</span>{t.hero.title3}
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="bg-[#2B4A7A] text-white px-8 py-3.5 rounded-xl hover:bg-[#1C3359] transition-all duration-300 font-medium flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5">
                  {t.hero.products} <ArrowUpRight size={18} />
                </a>
                <a href="#contact" className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-300 font-medium hover:-translate-y-0.5">
                  {t.hero.contact}
                </a>
              </div>
            </div>

            {/* Right Image/Video - Built-in MP4 Player Component */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)] group cursor-pointer border-4 border-white h-[460px] bg-slate-100"
              onClick={() => {
                if (hero?.videoUrl) {
                  setSelectedVideo(hero.videoUrl);
                }
              }}
            >
              {hero?.videoUrl ? (
                <>
                  <video
                    ref={heroVideoRef}
                    src={hero.videoUrl}
                    poster={hero.poster}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-slate-900/10 transition-colors"></div>
                </>
              ) : (
                <>
                  <img
                    src={hero?.poster || "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=1200"}
                    alt="Industrial Weighing Scale"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/30 transition-colors"></div>
                </>
              )}

              {/* Video Label */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md text-slate-900 px-6 py-4 rounded-2xl font-medium flex items-center justify-between shadow-lg">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">{t.hero.videoLabel1}</div>
                    <div className="font-bold text-base">{t.hero.videoLabel2}</div>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="text-[#2B4A7A]" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.sections.products}</h2>
              <p className="text-slate-600">{t.sections.productsSub}</p>
            </div>

          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                  ? 'bg-[#2B4A7A] text-white shadow-md shadow-blue-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {lang === 'en' ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden group hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-100 flex flex-col">
                <div
                  className="relative h-48 overflow-hidden bg-white p-4 cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={lang === 'en' && product.nameEn ? product.nameEn : product.name}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Quick View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductDetail(product);
                    }}
                    className="absolute inset-0 m-auto w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#2B4A7A] shadow-lg z-20 hover:scale-110 hover:bg-white"
                    title={lang === 'en' ? 'Quick View' : '快速预览'}
                  >
                    <Eye size={24} />
                  </button>

                  {product.has360 && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#2B4A7A] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                      <RefreshCw size={14} className="animate-spin-slow" /> 360°
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-slate-50/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {product.code || product.id}
                  </div>
                </div>
                <div className="p-5 cursor-pointer flex-1 flex flex-col" onClick={() => router.push(`/product/${product.id}`)}>
                  <div className="text-xs font-medium text-[#2B4A7A] mb-2">
                    {lang === 'en'
                      ? categories.find(c => c.id === product.category)?.nameEn
                      : categories.find(c => c.id === product.category)?.name}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 truncate">{lang === 'en' && product.nameEn ? product.nameEn : product.name}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description}</p>


                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anti-Cheating Features / Solutions Video Gallery */}
      <section id="solutions" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2B4A7A] px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-100">
              <ShieldCheck size={16} /> {t.sections.solutionsBadge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.sections.solutions}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.sections.solutionsSub}</p>
          </div>

          {/* Solution Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {solutionCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSolutionCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSolutionCategory === cat.id
                  ? 'bg-[#2B4A7A] text-white shadow-md shadow-blue-900/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {lang === 'en' ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
                onClick={() => setSelectedVideo(item.videoUrl)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full text-white">
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-xs font-semibold text-blue-300 mb-1 tracking-wider">
                    {lang === 'en'
                      ? solutionCategories.find(c => c.id === item.category)?.nameEn
                      : solutionCategories.find(c => c.id === item.category)?.name}
                  </div>
                  <h4 className="text-white font-medium text-lg line-clamp-2">{lang === 'en' && item.titleEn ? item.titleEn : item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Service */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=2000"
            alt="Customization Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-white/95 to-slate-100/95 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white text-[#2B4A7A] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100 shadow-sm">
              <Settings size={16} /> {t.sections.customizationBadge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{t.sections.customization}</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {t.sections.customizationSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* 硬件定制 */}
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.hardware}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.customization.hardwareDesc}
              </p>
            </div>

            {/* 软件定制 */}
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Monitor className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.software}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.customization.softwareDesc}
              </p>
            </div>

            {/* 通信协议 */}
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Server className="text-violet-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.protocol}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.customization.protocolDesc}
              </p>
            </div>

            {/* 场景解决方案 */}
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.system}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.customization.systemDesc}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <a href="#contact" className="bg-[#2B4A7A] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1C3359] transition-colors shadow-xl shadow-blue-900/20 inline-flex items-center gap-2">
              <Wrench size={20} /> 提交定制需求，获取专属方案
            </a>
          </div>
        </div>
      </section>

      {/* Company Album Section */}
      <section id="album" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2B4A7A] px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-100">
              <ImageIcon size={16} /> {t.sections.albumBadge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.sections.album}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.sections.albumSub}</p>
          </div>

          {/* Album Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {albumCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveAlbumCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeAlbumCategory === cat.id
                  ? 'bg-[#2B4A7A] text-white shadow-md shadow-blue-900/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {lang === 'en' ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          {/* Album Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAlbum.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-xs font-semibold text-blue-300 mb-1 tracking-wider">
                    {lang === 'en'
                      ? albumCategories.find(c => c.id === item.category)?.nameEn
                      : albumCategories.find(c => c.id === item.category)?.name}
                  </div>
                  <h4 className="text-white font-medium text-lg line-clamp-2">{lang === 'en' && item.titleEn ? item.titleEn : item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Strength Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                alt="Modern Factory"
                className="rounded-3xl shadow-lg w-full h-[500px] object-cover"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100">
                <div className="text-4xl font-bold text-[#2B4A7A] mb-1">20,000m²+</div>
                <div className="text-slate-600 font-medium">{t.about.factoryLabel}</div>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-10 lg:pl-8 mt-12 lg:mt-0">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{t.about.title}</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {lang === 'zh' ? about?.description : about?.descriptionEn}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="text-[#2B4A7A]" size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{t.about.feature1Title}</h4>
                    <p className="text-slate-600 leading-relaxed">{t.about.feature1Desc}</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <FlaskConical className="text-[#2B4A7A]" size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{t.about.feature2Title}</h4>
                    <p className="text-slate-600 leading-relaxed">{t.about.feature2Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0F172A] text-slate-300 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

            {/* Brand & Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="唯英科技 Logo"
                  className="h-12 object-contain brightness-0 invert opacity-90"
                />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t.footer.description}
              </p>
              <div className="space-y-3 pt-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0">{t.footer.phone}</span>
                  <span className="text-white font-medium">{contact?.phone || '023-68283031'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0">{t.footer.mobile}</span>
                  <span className="text-white font-medium">{contact?.mobile || '13696475082'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0">{t.footer.email}</span>
                  <span className="text-white font-medium">{contact?.email || ''}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 shrink-0">{t.footer.address}</span>
                  <span className="text-white font-medium leading-relaxed">{contact?.address || '重庆市北碚区龙凤桥街道龙凤三村200号附16号'}</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="text-white font-bold mb-6 text-lg">{t.footer.quickLinks}</h4>
              <ul className="space-y-4">
                <li><a href="#products" className="text-slate-400 hover:text-white transition-colors">{t.footer.products}</a></li>
                <li><a href="#solutions" className="text-slate-400 hover:text-white transition-colors">{t.footer.solutions}</a></li>
                <li><a href="#about" className="text-slate-400 hover:text-white transition-colors">{t.footer.about}</a></li>
              </ul>
            </div>

            {/* QR Codes - 从 data.json 读取配置 */}
            {(consult?.wechat?.enabled || consult?.qq?.enabled) && (
              <div className="lg:col-span-5">
                <h4 className="text-white font-bold mb-6 text-lg">{consult?.title || t.footer.onlineConsulting}</h4>
                <p className="text-slate-400 text-sm mb-6">{consult?.description || t.footer.scanQr}</p>

                <div className="flex flex-wrap gap-8">
                  {consult?.wechat?.enabled && consult?.wechat?.qrImage && (
                    <div className="text-center">
                      <div className="w-28 h-28 bg-white rounded-2xl p-2 mb-3 shadow-lg">
                        <img src={consult.wechat.qrImage} alt="微信咨询" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{consult.wechat?.label || t.footer.wechat}</span>
                    </div>
                  )}
                  {consult?.qq?.enabled && consult?.qq?.qrImage && (
                    <div className="text-center">
                      <div className="w-28 h-28 bg-white rounded-2xl p-2 mb-3 shadow-lg">
                        <img src={consult.qq.qrImage} alt="QQ咨询" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{consult.qq?.label || t.footer.qq}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col items-center gap-4 text-sm text-slate-500">
            <div className="text-center">
              Copyright © 2002-2019 Chongqing Weighing Technology Co., Ltd. All rights reserved
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                ICP:渝ICP备14003796号-1
              </a>
              <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010902001488" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                <img src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png" alt="公安备案图标" className="w-4 h-4" />
                渝公网安备 50010902001488号
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(null);
            }}
          >
            <X size={24} />
          </button>
          <div
            className="w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* 360 Viewer Modal */}
      {selected360Product && (
        <Product360Viewer
          productCode={selected360Product.code || selected360Product.id}
          image={selected360Product.image}
          images360Count={selected360Product.images360Count}
          title={lang === 'en' && selected360Product.nameEn ? selected360Product.nameEn : selected360Product.name}
          onClose={() => setSelected360Product(null)}
        />
      )}


      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          categories={categories}
          lang={lang}
          onClose={() => setSelectedProductDetail(null)}
          onOpen360={(product) => {
            setSelectedProductDetail(null);
            setSelected360Product(product);
          }}
          onDownload={() => {}} // Disabled as per user request '首页不要在产品资料下载的功能'
        />
      )}
    </div>
  );
}
