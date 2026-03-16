"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rotate3d, Cpu, Zap, ShieldCheck, Cloud, FileText, Box, BarChart3, Download, ExternalLink, ArrowRight, Home, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../../components/LanguageContext';
import Product360Viewer from '../../../components/Product360Viewer';
import { Product, products, categories } from '../../../data';
import Link from 'next/link';

interface ProductDetailProps {
  product: Product;
  consult: any;
  recommendations: Product[];
}

export default function ProductDetail({ product, consult, recommendations }: ProductDetailProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [show360Modal, setShow360Modal] = useState(false);

  const isEn = lang === 'en';
  const displayName = isEn && product?.nameEn ? product.nameEn : product?.name;
  const displayDesc = isEn && product?.descriptionEn ? product.descriptionEn : product?.description;
  const categoryName = categories.find(c => c.id === product?.category)?.name || product?.category;

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{isEn ? 'Product Not Found' : '产品未找到'}</h1>
          <button onClick={() => router.back()} className="text-blue-700 hover:underline flex items-center gap-2 mx-auto">
             {isEn ? 'Back' : '返回'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-blue-700 flex items-center gap-1">
             <Home size={14} /> {isEn ? 'Home' : '首页'}
          </Link>
          <ChevronRight size={14} />
          <span>{categoryName}</span>
          <ChevronRight size={14} />
          <span className="text-slate-800 font-semibold truncate">{displayName}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-7">
            <div className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-12 transition-all duration-500">
              {product.has360 ? (
                <div className="w-full h-full relative cursor-pointer" onClick={() => setShow360Modal(true)}>
                  <img src={product.image} alt={displayName} className="w-full h-full object-contain rounded-lg transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-slate-200/20">
                    <Rotate3d className="text-blue-700" size={20} />
                    <span className="text-xs font-semibold tracking-widest uppercase text-slate-600">
                      {isEn ? 'Interactive Viewer' : '互动查看器'}
                    </span>
                  </div>
                </div>
              ) : (
                <img src={product.image} alt={displayName} className="w-full h-full object-contain rounded-lg transition-transform duration-700 group-hover:scale-105 mix-blend-multiply" />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                {categoryName}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">{displayName}</h1>
            <p className="text-blue-700 font-mono text-xl font-bold mb-6 tracking-tight">{product.code}</p>
            
            <div 
              className="text-slate-600 leading-relaxed text-lg mb-8 max-w-md prose prose-slate"
              dangerouslySetInnerHTML={{ __html: displayDesc || '' }}
            />
            
            {product.specs && product.specs.length > 0 && (
              <div className="space-y-4 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {isEn ? 'Specifications' : '规格参数'}
                </h3>
                {product.specs.slice(0, 5).map((spec, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-sm text-slate-600">{isEn ? spec.labelEn : spec.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Features Section */}
        {product.introImages && product.introImages.length > 0 && (
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                  {isEn ? 'Advanced Engineering for Industrial Durability' : '先进工程助力工业耐用性'}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mt-12">
                  {[
                    { icon: Cpu, title: isEn ? "Precision Logic" : "精密逻辑", desc: isEn ? "Sub-micron accuracy" : "亚微米级精度" },
                    { icon: Zap, title: isEn ? "Ultra Efficiency" : "超高效率", desc: isEn ? "15% reduced energy" : "能耗降低 15%" },
                    { icon: ShieldCheck, title: isEn ? "IP67 Rating" : "IP67 等级", desc: isEn ? "Full protection" : "全面防护" },
                    { icon: Cloud, title: isEn ? "IoT Ready" : "物联网就绪", desc: isEn ? "Real-time telemetry" : "实时遥测" },
                  ].map((feat, i) => (
                    <div key={i} className="p-6 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-default">
                      <feat.icon className="text-blue-700 mb-3" size={32} />
                      <h4 className="font-bold text-slate-900 mb-1">{feat.title}</h4>
                      <p className="text-xs text-slate-600">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-100 rounded-lg p-4 shadow-sm relative">
                <img src={product.introImages[0]} alt="Technical Details" className="rounded-lg w-full h-[600px] object-cover" />
              </div>
            </div>
            
            {product.introImages.length > 1 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 pt-16 border-t border-slate-200">
                 {product.introImages.slice(1).map((img, idx) => (
                    <img key={idx} src={img} className="rounded-lg w-full h-64 object-cover shadow-sm border border-slate-200" alt="" />
                 ))}
               </div>
            )}
          </section>
        )}

        {/* Documents Section */}
        {product.documents && product.documents.length > 0 && (
          <section className="bg-slate-100 rounded-xl p-8 lg:p-12">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-900">{isEn ? 'Documents & Downloads' : '文档与下载'}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.documents.map((doc, i) => {
                const title = isEn ? doc.titleEn : doc.title;
                const desc = isEn ? doc.descriptionEn : doc.description;
                
                return (
                  <div key={i} className="bg-white p-8 rounded-lg flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6 text-blue-700 group-hover:bg-blue-100 transition-colors">
                        {doc.docType === 'CAD图纸' ? <Box /> : 
                         doc.docType === '产品规格书' ? <BarChart3 /> : <FileText />}
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{title || doc.title}</h4>
                      <p className="text-sm text-slate-600 mb-8 max-h-[40px] overflow-hidden text-ellipsis line-clamp-2">{desc}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.format} • {doc.fileSize}</span>
                      {doc.url ? (
                        <a href={doc.url} download className="flex items-center gap-2 text-blue-700 text-sm font-bold uppercase tracking-wider group-hover:underline">
                          {isEn ? 'Download' : '下载'} <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 uppercase">{isEn ? 'Pending' : '待上传'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 360 Fullscreen Modal */}
      {show360Modal && (
        <Product360Viewer
          productCode={product.code}
          image={product.image}
          images360Count={product.images360Count}
          title={displayName || ''}
          onClose={() => setShow360Modal(false)}
          autoRotate={false}
        />
      )}
    </div>
  );
}
