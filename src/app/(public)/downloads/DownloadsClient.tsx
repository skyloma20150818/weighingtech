'use client';

import { useState } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import FileIcon from '@/components/FileIcon';
import { useLanguage } from '@/components/LanguageContext';

interface Document {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  format: string;
  fileSize?: string | null;
  category: string;
  url: string;
}

interface ProductWithDocs {
  id: string;
  name: string;
  nameEn?: string | null;
  code?: string | null;
  image?: string | null;
  documents: Document[];
}

interface DownloadsClientProps {
  documents: Document[];
  productDocs: ProductWithDocs[];
}

const translations = {
  zh: {
    title: '下载中心',
    subtitle: 'Download Center',
    description: '查找产品文档、技术资料和资质证书',
    searchPlaceholder: '搜索文档...',
    all: '全部',
    noResults: '未找到匹配的文档',
    totalDocs: (count: number) => `共 ${count} 个文档`,
    categories: {
      certificates: '资质证书',
      manuals: '产品手册',
      technical: '技术资料',
      other: '其他',
    },
    fileSize: '未知大小',
  },
  en: {
    title: 'Download Center',
    subtitle: '',
    description: 'Find product manuals, technical documents and certificates',
    searchPlaceholder: 'Search documents...',
    all: 'All',
    noResults: 'No matching documents found',
    totalDocs: (count: number) => `${count} document${count !== 1 ? 's' : ''}`,
    categories: {
      certificates: 'Certificates',
      manuals: 'Manuals',
      technical: 'Technical',
      other: 'Other',
    },
    fileSize: 'Unknown size',
  },
};

const categoryOrder = ['certificates', 'manuals', 'technical', 'other'];

export default function DownloadsClient({ documents, productDocs }: DownloadsClientProps) {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredDocs = documents.filter(doc => {
    const searchText = searchQuery.toLowerCase();
    const title = lang === 'en' && doc.titleEn ? doc.titleEn : doc.title;
    const desc = lang === 'en' && doc.descriptionEn ? doc.descriptionEn : doc.description;
    
    const matchesSearch = title.toLowerCase().includes(searchText) ||
      desc?.toLowerCase().includes(searchText);
    const matchesCategory = !activeCategory || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // 获取分类名称
  const getCategoryName = (catId: string) => {
    return t.categories[catId as keyof typeof t.categories] || catId;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#1a2e4a] text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              {lang === 'zh' && <p className="text-blue-200 text-sm">{t.subtitle}</p>}
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-[#2B4A7A] text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.all}
          </button>
          {categoryOrder.map(catId => (
            <button
              key={catId}
              onClick={() => setActiveCategory(catId)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === catId
                  ? 'bg-[#2B4A7A] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {getCategoryName(catId)}
            </button>
          ))}
        </div>

        {/* 文档列表 */}
        {filteredDocs.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredDocs.map((doc, index) => {
              const title = lang === 'en' && doc.titleEn ? doc.titleEn : doc.title;
              const desc = lang === 'en' && doc.descriptionEn ? doc.descriptionEn : doc.description;
              
              return (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors group ${
                    index !== filteredDocs.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <FileIcon format={doc.format} size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 text-sm truncate">{title}</span>
                      <span className="text-xs text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded uppercase">
                        {doc.format}
                      </span>
                    </div>
                    {desc && (
                      <p className="text-xs text-slate-500 truncate">{desc}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{doc.fileSize || t.fileSize}</span>
                    <Download size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            <FileText size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t.noResults}</p>
          </div>
        )}

        {/* 统计 */}
        <div className="mt-4 text-xs text-slate-400 text-center">
          {t.totalDocs(filteredDocs.length)}
        </div>

        {/* 产品文档 */}
        {productDocs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {lang === 'zh' ? '产品文档' : 'Product Documents'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {productDocs.map(product => (
                <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="font-medium text-slate-800 text-sm">
                        {lang === 'en' && product.nameEn ? product.nameEn : product.name}
                      </h3>
                      <p className="text-xs text-slate-400">{product.code}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {product.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        <span className="text-slate-700 truncate">
                          {lang === 'en' && doc.titleEn ? doc.titleEn : doc.title}
                        </span>
                        <span className="text-xs text-slate-400 uppercase">{doc.format}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
