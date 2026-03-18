'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ChevronRight,
  Settings,
  Package,
  FolderOpen,
  Image as ImageIcon,
  Video,
  FileText,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  ProductManager,
  CategoryManager,
  AlbumManager,
  VideoManager,
  DocumentManager,
  SiteConfigEditor,
} from '@/components/admin';
import type { AppData } from '@/components/admin';

export const dynamic = 'force-dynamic';

const tabs = [
  { id: 'products', label: '产品管理', icon: Package },
  { id: 'categories', label: '分类管理', icon: FolderOpen },
  { id: 'album', label: '企业相册', icon: ImageIcon },
  { id: 'videos', label: '解决方案', icon: Video },
  { id: 'documents', label: '文档管理', icon: FileText },
  { id: 'siteconfig', label: '网站配置', icon: LayoutGrid },
];

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/save-data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        showMsg('error', '无法加载数据');
      }
    } catch (e) {
      showMsg('error', '加载失败: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = useCallback(
    async (newData = data) => {
      if (!newData) return;
      setSaving(true);
      try {
        const res = await fetch('/api/admin/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newData),
        });
        if (res.ok) {
          showMsg('success', '保存成功');
          setData(newData);
        } else {
          showMsg('error', '保存失败');
        }
      } catch (e) {
        showMsg('error', '保存失败: ' + (e as Error).message);
      } finally {
        setSaving(false);
      }
    },
    [data]
  );

  const handleFileUpload = async (file: File, category: string): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    try {
      const res = await fetch('/api/upload-direct', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        return url;
      }
      const err = await res.json();
      console.error('Upload error:', err.error);
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2B4A7A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500">加载数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1a2e4a] text-white flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-white/10 flex items-center gap-2.5">
          <Settings size={20} />
          <h1 className="text-base font-bold">后台管理系统</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 text-[11px] text-blue-300 leading-relaxed">
          唯英科技 版权所有
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-6 min-h-screen">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">修改将同步同步到数据库</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-[#2B4A7A] hover:underline">
              ← 返回前台
            </a>
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-[#2B4A7A] text-white px-4 py-2 rounded-lg hover:bg-[#1C3359] disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              保存
            </button>
          </div>
        </header>

        {message && (
          <div
            className={`mb-5 p-3 rounded-lg flex items-center gap-2.5 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl p-6">
          {activeTab === 'products' && (
            <ProductManager data={data} onSave={handleSave} handleFileUpload={handleFileUpload} />
          )}
          {activeTab === 'categories' && (
            <CategoryManager
              data={{
                categories: data.categories,
                albumCategories: data.albumCategories,
                solutionCategories: data.solutionCategories,
              }}
              onSave={handleSave}
            />
          )}
          {activeTab === 'album' && (
            <AlbumManager
              data={{ companyAlbum: data.companyAlbum, albumCategories: data.albumCategories }}
              onSave={handleSave}
              handleFileUpload={handleFileUpload}
            />
          )}
          {activeTab === 'videos' && (
            <VideoManager
              data={{
                solutionVideos: data.solutionVideos,
                solutionCategories: data.solutionCategories,
              }}
              onSave={handleSave}
              handleFileUpload={handleFileUpload}
            />
          )}
          {activeTab === 'documents' && <DocumentManager />}
          {activeTab === 'siteconfig' && (
            <SiteConfigEditor data={data} onSave={handleSave} handleFileUpload={handleFileUpload} />
          )}
        </div>
      </main>
    </div>
  );
}
