"use client";

import React from 'react';
import { X, Download, RefreshCw, ZoomIn } from 'lucide-react';
import { Product, Category } from '../data';

interface ProductDetailModalProps {
  product: Product;
  categories: Category[];
  lang: 'zh' | 'en';
  onClose: () => void;
  onOpen360: (product: Product) => void;
  onDownload: (e: React.MouseEvent, product: Product) => void;
}

export default function ProductDetailModal({ product, categories, lang, onClose, onOpen360, onDownload }: ProductDetailModalProps) {
  const categoryName = lang === 'en' 
    ? categories.find(c => c.id === product.category)?.nameEn 
    : categories.find(c => c.id === product.category)?.name;

  const title = lang === 'en' && product.nameEn ? product.nameEn : product.name;
  const description = lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-100 hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">
            {lang === 'en' ? 'Product Details' : '产品详情'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-4">
                <img 
                  src={product.image} 
                  alt={title} 
                  className="max-w-full max-h-full object-contain"
                />
                {product.has360 && (
                  <button 
                    onClick={() => onOpen360(product)}
                    className="absolute bottom-4 right-4 bg-[#2B4A7A] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <RefreshCw size={16} className="animate-spin-slow" /> 
                    {lang === 'en' ? '360° View' : '360° 预览'}
                  </button>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="mb-2">
                <span className="inline-block bg-blue-50 text-[#2B4A7A] px-3 py-1 rounded-full text-xs font-medium">
                  {categoryName}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {title}
              </h2>
              <div className="text-sm text-slate-500 mb-6 font-mono bg-slate-50 inline-block px-2 py-1 rounded">
                {lang === 'en' ? 'Code' : '产品编码'}: {product.code || product.id}
              </div>
              
              <div className="prose prose-slate prose-sm max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <a 
                  href={product.manualUrl || '#'} 
                  download={product.manualUrl ? `${product.code || product.id}_manual.pdf` : undefined}
                  onClick={(e) => {
                    if (!product.manualUrl) {
                      onDownload(e, product);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2B4A7A] hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm hover:shadow-[0_8px_20px_rgba(43,74,122,0.2)]"
                >
                  <Download size={20} /> 
                  {lang === 'en' ? 'Download Product Manual' : '下载产品资料'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
