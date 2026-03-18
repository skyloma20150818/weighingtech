import prisma from '@/lib/prisma';
import { Download, FileText, Search, Filter } from 'lucide-react';
import Link from 'next/link';

// 获取通用文档数据
async function getDocuments() {
  try {
    const docs = await prisma.document.findMany({
      orderBy: { sort: 'asc' },
    });
    return docs;
  } catch (e) {
    console.error('Failed to fetch documents:', e);
    return [];
  }
}

// 获取产品文档数据
async function getProductDocuments() {
  try {
    const products = await prisma.product.findMany({
      include: {
        documents: true,
      },
    });
    return products.filter(p => p.documents.length > 0);
  } catch (e) {
    console.error('Failed to fetch product documents:', e);
    return [];
  }
}

export default async function DownloadsPage() {
  const documents = await getDocuments();
  const productDocs = await getProductDocuments();

  const categories = [
    { id: 'certificates', name: '资质证书', nameEn: 'Certificates', icon: '🏆' },
    { id: 'manuals', name: '产品手册', nameEn: 'Manuals', icon: '📖' },
    { id: 'technical', name: '技术资料', nameEn: 'Technical', icon: '📊' },
    { id: 'other', name: '其他', nameEn: 'Other', icon: '📁' },
  ];

  const groupedDocs = categories.map(cat => ({
    ...cat,
    docs: documents.filter(d => d.category === cat.id),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-[#1a2e4a] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">下载中心</h1>
          <p className="text-blue-200 text-lg">Download Center</p>
          <p className="mt-4 text-slate-300">查找产品文档、技术资料和资质证书</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 通用文档部分 */}
        {groupedDocs.some(g => g.docs.length > 0) && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <FileText className="text-blue-600" />
              文档下载
            </h2>
            <div className="space-y-8">
              {groupedDocs.filter(g => g.docs.length > 0).map(group => (
                <div key={group.id} className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span>{group.icon}</span>
                    <span>{group.name}</span>
                    <span className="text-slate-400 font-normal text-sm">/ {group.nameEn}</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {group.docs.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 truncate">{doc.title}</div>
                          <div className="text-sm text-slate-400">
                            {doc.format} · {doc.fileSize || '未知大小'}
                          </div>
                        </div>
                        <Download size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 产品文档部分 */}
        {productDocs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <span className="text-2xl">📦</span>
              产品文档
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {productDocs.map(product => (
                <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex items-center gap-4 mb-4">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-800">{product.name}</h3>
                      <p className="text-sm text-slate-400">{product.code}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {product.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-red-500" />
                          <span className="text-sm text-slate-700">{doc.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{doc.format}</span>
                          {doc.fileSize && <span>· {doc.fileSize}</span>}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 空状态 */}
        {documents.length === 0 && productDocs.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p>暂无下载内容</p>
          </div>
        )}
      </div>
    </div>
  );
}
