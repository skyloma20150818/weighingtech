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
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  X,
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
  { id: 'password', label: '修改密码', icon: KeyRound },
];

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  
  // 密码修改状态
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

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

  // 密码修改处理
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showMsg('error', '两次输入的密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      showMsg('error', '新密码至少6位');
      return;
    }
    
    setChangingPwd(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();
      if (res.ok) {
        showMsg('success', '密码修改成功');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showMsg('error', result.error || '修改失败');
      }
    } catch (e) {
      showMsg('error', '网络错误');
    } finally {
      setChangingPwd(false);
    }
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

          {/* 密码修改模态框 */}
          {activeTab === 'password' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">修改密码</h3>
                    <p className="text-sm text-slate-500">定期修改密码有助于账户安全</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">当前密码</label>
                    <div className="relative">
                      <input
                        type={showCurrentPwd ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入当前密码"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">新密码</label>
                    <div className="relative">
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入新密码（至少6位）"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">确认新密码</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                  
                  <button
                    onClick={handlePasswordChange}
                    disabled={changingPwd || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {changingPwd ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        修改中...
                      </>
                    ) : (
                      <>确认修改</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
