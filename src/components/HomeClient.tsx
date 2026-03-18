"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, ShieldCheck, Cpu, Server, Monitor, Smartphone,
  CheckCircle2, FlaskConical, Globe, Share2, Phone, ArrowUpRight,
  CheckCircle, Settings, Wrench, Image as ImageIcon, ZoomIn, RefreshCw, X,
  Volume2, VolumeX, Video
} from 'lucide-react';
import Product360Viewer from '../components/Product360Viewer';
import SmartImage from '../components/SmartImage';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Language, translations } from '../i18n';
// 类型定义（从 data.ts 迁移过来）
interface Category {
  id: string;
  name: string;
  nameEn: string;
}

interface VideoItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
}

interface AlbumItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  image: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  category: string;
  description: string;
  descriptionEn?: string;
  image: string;
  has360?: boolean;
  images360Count?: number;
  introImages?: string[];
  specs?: { label: string; labelEn: string; value: string }[];
  documents?: any[];
  manualUrl?: string;
}

interface Contact {
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

interface Consult {
  title?: string;
  description?: string;
  wechat?: { enabled?: boolean; label?: string; qrImage?: string };
  qq?: { enabled?: boolean; number?: string; label?: string; qrImage?: string };
}

interface About {
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
}

interface Hero {
  badge?: string;
  badgeEn?: string;
  title1?: string;
  title1En?: string;
  title2?: string;
  title2En?: string;
  title3?: string;
  title3En?: string;
  subtitle?: string;
  subtitleEn?: string;
  productsLabel?: string;
  productsLabelEn?: string;
  contactLabel?: string;
  contactLabelEn?: string;
  videoUrl?: string;
  poster?: string;
  backgroundImage?: string; // Hero 背景图片
}

interface Feature {
  icon: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
}
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
    features?: Feature[] | null;
    sections?: any;
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
    hero,
    features,
    sections
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
  const [isMuted, setIsMuted] = useState(true); // 默认静音

  const toggleMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroVideoRef.current.muted;
      setIsMuted(heroVideoRef.current.muted);
    }
  };

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
      {/* Hero Section - 沉浸式背景，延伸到导航栏下方 */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden -mt-20 pt-20">
        {/* 背景图片 */}
        {hero?.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={hero.backgroundImage}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-blue-900/70"></div>
          </div>
        )}
        {/* 默认渐变背景（无背景图时） */}
        {!hero?.backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/20 z-0"></div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                hero?.backgroundImage 
                  ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm' 
                  : 'bg-blue-50 text-[#2B4A7A] border-blue-100'
              }`}>
                <CheckCircle size={16} />
                <span>{lang === 'zh' ? (hero?.badge || t.hero.badge) : (hero?.badgeEn || t.hero.badge || t.hero.badge)}</span>
              </div>
              <h1 className={`text-5xl lg:text-6xl font-bold leading-tight ${
                hero?.backgroundImage ? 'text-white' : 'text-slate-900'
              }`}>
                {lang === 'zh' ? (hero?.title1 || t.hero.title1) : (hero?.title1En || t.hero.title1)}<br />
                <span className={hero?.backgroundImage ? 'text-blue-300' : 'text-[#2B4A7A]'}>{lang === 'zh' ? (hero?.title2 || t.hero.title2) : (hero?.title2En || t.hero.title2)}</span>
                {lang === 'zh' ? (hero?.title3 || t.hero.title3) : (hero?.title3En || t.hero.title3)}
              </h1>
              <p className={`text-lg max-w-lg leading-relaxed ${
                hero?.backgroundImage ? 'text-white/90' : 'text-slate-600'
              }`}>
                {lang === 'zh' ? (hero?.subtitle || t.hero.subtitle) : (hero?.subtitleEn || t.hero.subtitle)}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className={`px-8 py-3.5 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 shadow-lg hover:-translate-y-0.5 ${
                  hero?.backgroundImage 
                    ? 'bg-white text-[#2B4A7A] hover:bg-blue-50 shadow-white/20' 
                    : 'bg-[#2B4A7A] text-white hover:bg-[#1C3359] shadow-blue-900/20'
                }`}>
                  {hero?.productsLabel || t.hero.products} <ArrowUpRight size={18} />
                </a>
                <a href="#contact" className={`px-8 py-3.5 rounded-xl transition-all duration-300 font-medium hover:-translate-y-0.5 ${
                  hero?.backgroundImage 
                    ? 'bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}>
                  {hero?.contactLabel || t.hero.contact}
                </a>
              </div>
            </div>

            {/* Right Image/Video */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,255,255,0.3),0_10px_20px_-5px_rgba(255,255,255,0.2),0_8px_30px_rgba(0,0,0,0.15)] group bg-slate-50 aspect-video ring-1 ring-white/20"
            >
              {hero?.videoUrl ? (
                <>
                  <video
                    ref={heroVideoRef}
                    src={hero.videoUrl}
                    poster={hero.poster || undefined}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVideo(hero.videoUrl);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                  {/* 静音按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white transition-colors z-10 rounded-full shadow-lg"
                    title={isMuted ? '开启声音' : '静音'}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </>
              ) : (
                <>
                  <SmartImage
                    src={hero?.poster || "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=1200"}
                    alt="Industrial Weighing Scale"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                {lang === 'zh' ? (sections?.products?.title || t.sections.products) : (sections?.products?.titleEn || t.sections.products)}
              </h2>
              <p className="text-slate-600">
                {lang === 'zh' ? (sections?.products?.subtitle || t.sections.productsSub) : (sections?.products?.subtitleEn || t.sections.productsSub)}
              </p>
            </div>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                  }`}
              >
                {lang === 'en' ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                }}
                className="bg-white rounded-2xl overflow-hidden group hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer hover:-translate-y-1"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <div className="relative h-48 overflow-hidden bg-white p-4">
                  <Image
                    src={product.image}
                    alt={lang === 'en' && product.nameEn ? product.nameEn : product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-4"
                    loading="lazy"
                  />

                  {product.has360 && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#2B4A7A] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                      <RefreshCw size={14} className="animate-spin-slow" /> 360°
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-slate-50/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {product.code || product.id}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-medium text-[#2B4A7A] mb-2">
                    {lang === 'en'
                      ? categories.find(c => c.id === product.category)?.nameEn
                      : categories.find(c => c.id === product.category)?.name}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2B4A7A] transition-colors line-clamp-1">
                    {lang === 'en' && product.nameEn ? product.nameEn : product.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Video Gallery */}
      <section id="solutions" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">

            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{lang === 'zh' ? (sections?.solutions?.title || t.sections.solutions) : (sections?.solutions?.titleEn || t.sections.solutions)}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{lang === 'zh' ? (sections?.solutions?.subtitle || t.sections.solutionsSub) : (sections?.solutions?.subtitleEn || t.sections.solutionsSub)}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {solutionCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSolutionCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeSolutionCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                }`}
              >
                {lang === 'en' ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {filteredVideos.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                }}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
                onClick={() => setSelectedVideo(item.videoUrl)}
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Video size={48} />
                    </div>
                  )}
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
          </motion.div>
        </div>
      </section>

      {/* 服务和支持 */}
      <section id="support" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">

            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              {lang === 'zh' ? '服务和支持' : 'Service & Support'}
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {lang === 'zh'
                ? '我们提供全方位的售前咨询、售中支持和售后服务，确保您的设备始终保持最佳状态'
                : 'We provide comprehensive pre-sales consultation, sales support and after-sales service'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {(features && features.length > 0) ? (
              features.map((f, i) => {
                const IconComponent = i === 0 ? Cpu : i === 1 ? Monitor : i === 2 ? Server : ShieldCheck;
                const colors = i === 0 ? 'blue' : i === 1 ? 'emerald' : i === 2 ? 'violet' : 'amber';
                return (
                  <div key={i} className="bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-slate-200/50 rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 group">
                    <div className={`w-14 h-14 bg-${colors}-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`text-${colors}-600`} size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{lang === 'zh' ? f.title : (f.titleEn || f.title)}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{lang === 'zh' ? f.desc : (f.descEn || f.desc)}</p>
                  </div>
                );
              })
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="flex justify-center">
            <a href="#footer" className="bg-[#2B4A7A] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1C3359] transition-colors shadow-xl shadow-blue-900/20 inline-flex items-center gap-2">
              <Wrench size={20} /> {lang === 'zh' ? '联系我们获取服务' : 'Contact Us for Service'}
            </a>
          </div>
        </div>
      </section>

      {/* Company Album Section */}
      <section id="album" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">

            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t.sections.album}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">{t.sections.albumSub}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {albumCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveAlbumCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeAlbumCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200'
                }`}
              >
                {lang === 'en' ? cat.nameEn : cat.name}
              </button>
            ))}
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {filteredAlbum.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                }}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="relative h-56 overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src={about?.image || "/uploads/about/cctv.mp4_20260318_213140722.jpg"}
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
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{about?.title || t.about.title}</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {lang === 'zh' ? (about?.description || t.about.intro) : (about?.descriptionEn || t.about.intro)}
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

      {/* Modals */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </motion.button>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full h-full max-w-[90vw] max-h-[90vh]"
          >
            <SmartImage
              src={selectedImage}
              alt="View"
              fill
              className="object-contain rounded-lg"
            />
          </motion.div>
        </motion.div>
      )}

      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full"
          >
            <X size={24} />
          </motion.button>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-5xl aspect-video"
          >
            <video src={selectedVideo} controls autoPlay className="w-full h-full" />
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
