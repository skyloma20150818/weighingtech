"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Eye, ShieldCheck, Cpu, Server, Monitor, Smartphone,
  CheckCircle2, FlaskConical, Globe, Share2, Phone, ArrowUpRight,
  CheckCircle, Settings, Wrench, Image as ImageIcon, ZoomIn, RefreshCw, X
} from 'lucide-react';
import Product360Viewer from '../components/Product360Viewer';
import ProductDetailModal from '../components/ProductDetailModal';
import { useRouter } from 'next/navigation';
import { Language, translations } from '../i18n';
import type { Category, VideoItem, AlbumItem, Product, Contact, Consult, About, Hero } from '../data';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from './LanguageContext';

interface HomeClientProps {
  initialData: {
    categories: Category[];
    albumCategories: Category[];
    solutionCategories: Category[];
    solutionVideos: VideoItem[];
    companyAlbum: AlbumItem[];
    products: Product[];
    contact: Contact | null;
    consult: any; // Simplified for now
    about: About | null;
    hero: Hero | null;
  };
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const {
    categories,
    albumCategories,
    solutionCategories,
    solutionVideos,
    companyAlbum,
    products,
    contact,
    consult,
    about,
    hero
  } = initialData;

  const router = useRouter();
  const { lang, setLang } = useLanguage();
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

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAlbumCategory, setActiveAlbumCategory] = useState('all');
  const [activeSolutionCategory, setActiveSolutionCategory] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selected360Product, setSelected360Product] = useState<Product | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    e.preventDefault();
    setActiveNav(id);

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const navHeight = 80;
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
      <Header lang={lang} onLangChange={setLang} phone={contact?.phone} />

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

            {/* Right Image/Video */}
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
                    poster={hero.poster || undefined}
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

      {/* Solutions Video Gallery */}
      <section id="solutions" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2B4A7A] px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-100">
              <ShieldCheck size={16} /> {t.sections.solutionsBadge}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.sections.solutions}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.sections.solutionsSub}</p>
          </div>

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
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.hardware}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.customization.hardwareDesc}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Monitor className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.software}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.customization.softwareDesc}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Server className="text-violet-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.protocol}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.customization.protocolDesc}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.customization.system}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{t.customization.systemDesc}</p>
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

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                alt="Modern Factory"
                className="rounded-3xl shadow-lg w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100">
                <div className="text-4xl font-bold text-[#2B4A7A] mb-1">20,000m²+</div>
                <div className="text-slate-600 font-medium">{t.about.factoryLabel}</div>
              </div>
            </div>

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
      <Footer lang={lang} contact={contact} consult={consult} />

      {/* Modals */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full"><X size={24} /></button>
          <img src={selectedImage} alt="View" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full"><X size={24} /></button>
          <div className="w-full max-w-5xl aspect-video"><video src={selectedVideo} controls autoPlay className="w-full h-full" /></div>
        </div>
      )}

      {selected360Product && (
        <Product360Viewer
          productCode={selected360Product.code || selected360Product.id}
          image={selected360Product.image}
          images360Count={selected360Product.images360Count}
          title={lang === 'en' && selected360Product.nameEn ? selected360Product.nameEn : selected360Product.name}
          onClose={() => setSelected360Product(null)}
        />
      )}

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
          onDownload={() => { }}
        />
      )}
    </div>
  );
}
