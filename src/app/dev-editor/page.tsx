"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 强制动态渲染，不生成静态页面
export const dynamic = 'force-dynamic';

import {
  Save, Upload, Plus, Trash2, Edit2, ChevronRight,
  Settings, Package, FolderOpen, Video, Image as ImageIcon,
  Phone, Globe, AlertCircle, CheckCircle2, X, Download,
  RotateCcw, FileText, Monitor
} from 'lucide-react';
import Editor from 'react-simple-wysiwyg';

const DOC_TYPES = ['使用说明书', '安装手册', '驱动程序', 'CAD图纸', '产品规格书', '维护手册', '其他'];
const FILE_FORMATS = ['PDF', 'ZIP', 'DXF', 'EXE', 'DOC', 'STEP', 'IGES'];

export default function DevEditor() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  // 开发环境检查
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      router.push('/');
    }
  }, [router]);
  const [editingItem, setEditingItem] = useState<{ index: number; data: any } | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dev/save-data');
      if (res.ok) setData(await res.json());
      else showMsg('error', '无法加载数据');
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

  const handleSave = useCallback(async (newData = data) => {
    setSaving(true);
    try {
      const res = await fetch('/api/dev/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (res.ok) { showMsg('success', '保存成功'); setData(newData); }
      else showMsg('error', '保存失败');
    } catch (e) {
      showMsg('error', '保存失败: ' + (e as Error).message);
    } finally { setSaving(false); }
  }, [data]);

  const handleFileUpload = async (file: File, category: string): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    try {
      const res = await fetch('/api/dev/upload', { method: 'POST', body: fd });
      if (res.ok) return (await res.json()).url;
    } catch (e) { console.error(e); }
    return null;
  };

  const updateProduct = (index: number, productData: any) => {
    const nd = { ...data };
    if (index === -1) nd.products.push({ ...productData, id: Date.now().toString() });
    else nd.products[index] = productData;
    handleSave(nd);
    setEditingItem(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#2B4A7A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-slate-500">加载数据中...</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'products', label: '产品管理', icon: Package },
    { id: 'categories', label: '分类管理', icon: FolderOpen },
    { id: 'album', label: '企业相册', icon: ImageIcon },
    { id: 'videos', label: '解决方案', icon: Video },
    { id: 'hero', label: '首页首屏', icon: Monitor },
    { id: 'contact', label: '联系/咨询', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1a2e4a] text-white flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-white/10 flex items-center gap-2.5">
          <Settings size={20} />
          <h1 className="text-base font-bold">数据管理后台</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === tab.id ? 'bg-white/20 text-white font-medium' : 'text-blue-200 hover:bg-white/10'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 text-[11px] text-blue-300 leading-relaxed">
          ⚠️ 仅限开发环境使用
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-6 min-h-screen">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-xs text-slate-400 mt-0.5">修改将自动同步到 src/data.json</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-[#2B4A7A] hover:underline">← 返回前台</a>
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="bg-[#2B4A7A] text-white px-4 py-2 rounded-lg hover:bg-[#1C3359] disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              保存
            </button>
          </div>
        </header>

        {message && (
          <div className={`mb-5 p-3 rounded-lg flex items-center gap-2.5 text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl p-6">

          {/* ——— 产品管理 ——— */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">共 {data.products.length} 个产品</p>
                <button
                  onClick={() => setEditingItem({ index: -1, data: { name: '', nameEn: '', code: '', category: data.categories[1]?.id || '', description: '', descriptionEn: '', image: '', specs: [], documents: [] } })}
                  className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
                >
                  <Plus size={15} /> 新增产品
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {data.products.map((p: any, i: number) => (
                  <div key={p.id} className="rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors group relative">
                    {p.image ? (
                      <img src={p.image} className="w-16 h-16 object-contain rounded-lg bg-slate-50 flex-shrink-0" alt={p.name} />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon size={24} className="text-slate-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{p.name}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{p.code}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded font-medium">
                        {data.categories.find((c: any) => c.id === p.category)?.name || p.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingItem({ index: i, data: { ...p } })} className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-50">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => { if (confirm('确认删除该产品?')) { const nd = { ...data }; nd.products.splice(i, 1); handleSave(nd); } }} className="p-1.5 bg-white text-red-500 rounded hover:bg-red-50">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ——— 分类管理 ——— */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              {(['categories', 'albumCategories', 'solutionCategories'] as const).map(key => (
                <CategoryTable
                  key={key}
                  title={key === 'categories' ? '产品分类' : key === 'albumCategories' ? '相册分类' : '视频分类'}
                  items={data[key]}
                  onUpdate={(items: any[]) => { const nd = { ...data }; nd[key] = items; handleSave(nd); }}
                />
              ))}
            </div>
          )}

          {/* ——— 企业相册 ——— */}
          {activeTab === 'album' && (
            <AlbumEditor data={data} handleSave={handleSave} handleFileUpload={handleFileUpload} />
          )}

          {/* ——— 解决方案视频 ——— */}
          {activeTab === 'videos' && (
            <VideoEditor data={data} handleSave={handleSave} handleFileUpload={handleFileUpload} />
          )}

          {/* ——— 联系/咨询 ——— */}
          {activeTab === 'contact' && (
            <ContactEditor data={data} handleSave={handleSave} handleFileUpload={handleFileUpload} />
          )}

          {/* ——— 首页首屏 ——— */}
          {activeTab === 'hero' && (
            <HeroEditor data={data} handleSave={handleSave} handleFileUpload={handleFileUpload} />
          )}

        </div>
      </main>

      {/* 产品编辑弹窗 */}
      {editingItem && (
        <ProductForm
          data={data}
          item={editingItem.data}
          onClose={() => setEditingItem(null)}
          onSave={(p: any) => updateProduct(editingItem.index, p)}
          upload={handleFileUpload}
        />
      )}
    </div>
  );
}

/* ==================== 分类表格 ==================== */
function CategoryTable({ title, items, onUpdate }: { title: string; items: any[]; onUpdate: (items: any[]) => void }) {
  const [rows, setRows] = useState(items);

  const update = (i: number, field: string, val: string) => {
    const nr = [...rows]; nr[i] = { ...nr[i], [field]: val }; setRows(nr);
  };

  const addRow = () => {
    setRows([...rows, { id: '', name: '', nameEn: '' }]);
  };

  const removeRow = (i: number) => {
    if (rows[i].id === 'all') return alert('"全部" 分类不可删除');
    const nr = rows.filter((_, idx) => idx !== i);
    setRows(nr);
    onUpdate(nr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <button onClick={addRow} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <Plus size={13} /> 新增
        </button>
      </div>
      <div className="rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 w-36">ID (唯一标识)</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">中文名</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">英文名</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="">
                <td className="px-4 py-2">
                  <input
                    className="w-full text-xs font-mono bg-transparent outline-none py-1 bg-slate-50 rounded px-2"
                    value={row.id}
                    placeholder="e.g. platform_scale"
                    disabled={row.id === 'all'}
                    onChange={e => update(i, 'id', e.target.value)}
                    onBlur={() => onUpdate(rows)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    className="w-full text-sm bg-transparent outline-none py-1 bg-slate-50 rounded px-2"
                    value={row.name}
                    placeholder="中文名称"
                    onChange={e => update(i, 'name', e.target.value)}
                    onBlur={() => onUpdate(rows)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    className="w-full text-sm bg-transparent outline-none py-1 bg-slate-50 rounded px-2"
                    value={row.nameEn || ''}
                    placeholder="English Name"
                    onChange={e => update(i, 'nameEn', e.target.value)}
                    onBlur={() => onUpdate(rows)}
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  {row.id !== 'all' && (
                    <button onClick={() => removeRow(i)} className="text-slate-300 hover:text-red-500 p-1">
                      <X size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==================== 企业相册编辑器 ==================== */
function AlbumEditor({ data, handleSave, handleFileUpload }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">共 {data.companyAlbum.length} 张</p>
        <button
          onClick={() => { const nd = { ...data }; nd.companyAlbum.push({ id: `a${Date.now()}`, title: '新图片', titleEn: 'New Image', category: 'all', image: '' }); handleSave(nd); }}
          className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
        >
          <Plus size={15} /> 添加
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data.companyAlbum.map((item: any, i: number) => (
          <div key={item.id} className="rounded-xl overflow-hidden bg-slate-50 relative group">
            <div className="aspect-square bg-white relative">
              {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={36} /></div>}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Upload className="text-white" size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) { const url = await handleFileUpload(f, 'albums'); if (url) { const nd = { ...data }; nd.companyAlbum[i].image = url; handleSave(nd); } }
                }} />
              </label>
            </div>
            <div className="p-2 space-y-1">
              <input className="w-full bg-transparent text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1" value={item.title} onChange={e => { const nd = { ...data }; nd.companyAlbum[i].title = e.target.value; }} onBlur={() => handleSave(data)} placeholder="中文标题" />
              <input className="w-full bg-transparent text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1" value={item.titleEn || ''} onChange={e => { const nd = { ...data }; nd.companyAlbum[i].titleEn = e.target.value; }} onBlur={() => handleSave(data)} placeholder="English Title" />
              <select className="w-full mt-1 text-[10px] bg-slate-100 rounded px-1 py-0.5" value={item.category} onChange={e => { const nd = { ...data }; nd.companyAlbum[i].category = e.target.value; handleSave(nd); }}>
                {data.albumCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button onClick={() => { if (confirm('删除?')) { const nd = { ...data }; nd.companyAlbum.splice(i, 1); handleSave(nd); } }} className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== 视频编辑器 ==================== */
function VideoEditor({ data, handleSave, handleFileUpload }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">共 {data.solutionVideos.length} 条</p>
        <button onClick={() => { const nd = { ...data }; nd.solutionVideos.push({ id: `v${Date.now()}`, title: '新视频', titleEn: 'New Video', category: 'all', thumbnail: '', videoUrl: '' }); handleSave(nd); }} className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
          <Plus size={15} /> 添加
        </button>
      </div>
      <div className="space-y-3">
        {data.solutionVideos.map((item: any, i: number) => (
          <div key={item.id} className="rounded-xl p-4 flex gap-4 group relative hover:bg-slate-50 transition-colors bg-white">
            <div className="w-28 h-18 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0 aspect-video">
              {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Video size={20} /></div>}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <ImageIcon className="text-white" size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={async e => {
                  const f = e.target.files?.[0]; if (f) { const url = await handleFileUpload(f, 'videos'); if (url) { const nd = {...data}; nd.solutionVideos[i].thumbnail = url; handleSave(nd); } }
                }} />
              </label>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">中文标题</label>
                <input className="w-full bg-slate-50 rounded text-sm focus:outline-none py-1 px-2" value={item.title} onChange={e => { data.solutionVideos[i].title = e.target.value; }} onBlur={() => handleSave(data)} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">English Title</label>
                <input className="w-full bg-slate-50 rounded text-sm focus:outline-none py-1 px-2" value={item.titleEn || ''} onChange={e => { data.solutionVideos[i].titleEn = e.target.value; }} onBlur={() => handleSave(data)} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">视频链接/文件</label>
                <div className="flex gap-2 items-center">
                  <input className="flex-1 bg-slate-50 rounded text-xs font-mono focus:outline-none py-1 px-2" value={item.videoUrl} onChange={e => { data.solutionVideos[i].videoUrl = e.target.value; }} onBlur={() => handleSave(data)} />
                  <label className="cursor-pointer text-slate-400 hover:text-slate-600">
                    <Upload size={14} />
                    <input type="file" className="hidden" accept="video/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const url = await handleFileUpload(f, 'videos'); if (url) { const nd = {...data}; nd.solutionVideos[i].videoUrl = url; handleSave(nd); } } }} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">分类</label>
                <select className="w-full text-sm bg-slate-50 rounded py-1 px-2" value={item.category} onChange={e => { data.solutionVideos[i].category = e.target.value; handleSave(data); }}>
                  {data.solutionCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => { if (confirm('删除?')) { const nd = {...data}; nd.solutionVideos.splice(i, 1); handleSave(nd); } }} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== 联系方式编辑器 ==================== */
function ContactEditor({ data, handleSave, handleFileUpload }: any) {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Phone size={15} className="text-blue-500" />基础联系方式</h3>
        <div className="space-y-3">
          {[
            { key: 'phone', label: '固话' },
            { key: 'mobile', label: '手机' },
            { key: 'email', label: '邮箱' },
            { key: 'address', label: '地址' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-slate-400 mb-1">{label}</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                value={data.contact[key] || ''}
                onChange={e => { const nd = {...data}; nd.contact[key] = e.target.value; handleSave(nd); }}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2"><Globe size={15} className="text-emerald-500" />在线咨询 (扫码)</h3>
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border">
          <div>
            <label className="block text-xs text-slate-400 mb-1">标题</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" value={data.consult?.title || ''} onChange={e => { data.consult.title = e.target.value; handleSave(data); }} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">描述</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" rows={2} value={data.consult?.description || ''} onChange={e => { data.consult.description = e.target.value; handleSave(data); }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['wechat', 'qq'].map(type => (
              <div key={type} className="bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-600">{type}</span>
                  <input type="checkbox" checked={data.consult?.[type]?.enabled ?? false} onChange={e => { data.consult[type].enabled = e.target.checked; handleSave(data); }} />
                </div>
                <div className="aspect-square bg-slate-50 rounded-lg relative overflow-hidden">
                  {data.consult?.[type]?.qrImage ? <img src={data.consult[type].qrImage} className="w-full h-full object-contain" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">暂无二维码</div>}
                  <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="text-white" size={18} />
                    <input type="file" className="hidden" accept="image/*" onChange={async e => {
                      const f = e.target.files?.[0]; if (f) { const url = await handleFileUpload(f, 'others'); if (url) { const nd = {...data}; nd.consult[type].qrImage = url; handleSave(nd); } }
                    }} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== 首页首屏编辑器 ==================== */
function HeroEditor({ data, handleSave, handleFileUpload }: any) {
  if (!data.hero) data.hero = { videoUrl: '', poster: '' };
  const [extracting, setExtracting] = useState(false);
  
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Monitor size={15} className="text-blue-500" />首页首屏多媒体</h3>
      <div className="bg-slate-50 p-6 rounded-xl border space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">背景视频 (MP4)</label>
          <div className="flex gap-3 items-center">
            <input 
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" 
              value={data.hero?.videoUrl || ''} 
              onChange={e => { data.hero.videoUrl = e.target.value; handleSave(data); }} 
              placeholder="例如: /uploads/videos/hero-video.mp4 或是外部链接"
            />
            <label className={`cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors ${extracting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {extracting ? <RotateCcw size={16} className="text-blue-500 animate-spin" /> : <Upload size={16} className="text-slate-500" />} 
              {extracting ? '上传及处理中...' : '上传视频'}
              <input type="file" className="hidden" accept="video/*" disabled={extracting} onChange={async e => { 
                const f = e.target.files?.[0]; 
                if (f) { 
                  setExtracting(true);
                  try {
                    const url = await handleFileUpload(f, 'videos'); 
                    if (url) { 
                      const nd = {...data}; 
                      if (!nd.hero) nd.hero = {};
                      nd.hero.videoUrl = url; 

                      // 自动提取视频第一帧作为封面图
                      const frameFile = await new Promise<File | null>((resolve) => {
                        const video = document.createElement('video');
                        const objUrl = URL.createObjectURL(f);
                        video.src = objUrl;
                        video.muted = true;
                        video.playsInline = true;
                        video.onloadeddata = () => { 
                          video.currentTime = Math.min(0.5, video.duration / 2 || 0.5); 
                        };
                        video.onseeked = () => {
                          const canvas = document.createElement('canvas');
                          canvas.width = video.videoWidth || 1920;
                          canvas.height = video.videoHeight || 1080;
                          const ctx = canvas.getContext('2d');
                          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                          canvas.toBlob((blob) => {
                            if (blob) {
                              resolve(new File([blob], f.name.replace(/\.[^/.]+$/, "") + "_poster.jpg", { type: 'image/jpeg' }));
                            } else {
                              resolve(null);
                            }
                            URL.revokeObjectURL(objUrl);
                          }, 'image/jpeg', 0.8);
                        };
                        video.onerror = () => { URL.revokeObjectURL(objUrl); resolve(null); };
                      });

                      if (frameFile) {
                        const posterUrl = await handleFileUpload(frameFile, 'hero');
                        if (posterUrl) {
                          nd.hero.poster = posterUrl;
                        }
                      }
                      
                      handleSave(nd); 
                    } 
                  } catch (err) {
                    console.error("上传或截图失败", err);
                  } finally {
                    setExtracting(false);
                  }
                } 
              }} />
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-2">推荐尺寸 1920x1080，大小不要超过 20MB。上传后将自动提取第0.5秒作为海报封面。</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">封面图片 (海报/备用图)</label>
          <div className="flex gap-4">
            <div className="w-48 h-28 bg-white border border-slate-200 rounded-lg overflow-hidden relative group">
              {data.hero?.poster ? (
                <img src={data.hero.poster} className="w-full h-full object-cover" alt="Hero Poster" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">无图片</div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                <Upload size={20} className="mb-1" />
                <span className="text-[10px]">上传图片</span>
                <input type="file" className="hidden" accept="image/*" onChange={async e => {
                  const f = e.target.files?.[0]; 
                  if (f) { 
                    const url = await handleFileUpload(f, 'hero'); 
                    if (url) { 
                      const nd = {...data}; 
                      if (!nd.hero) nd.hero = {};
                      nd.hero.poster = url; 
                      handleSave(nd); 
                    } 
                  }
                }} />
              </label>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <input 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" 
                value={data.hero?.poster || ''} 
                onChange={e => { data.hero.poster = e.target.value; handleSave(data); }} 
                placeholder="图片链接"
              />
              <p className="text-xs text-slate-500">此图片用作视频加载前的海报图。上传视频时已自动生成，你也可以单独上传覆盖该图。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== 产品编辑弹窗 ==================== */
function ProductForm({ data, item, onClose, onSave, upload }: any) {
  const [form, setForm] = useState<any>(item);
  const [images360, setImages360] = useState<string[]>([]);
  const [loading360, setLoading360] = useState(false);
  const [uploading360, setUploading360] = useState(false);

  // 加载已有的360图片
  const load360Images = useCallback(async (code: string) => {
    if (!code) return;
    setLoading360(true);
    try {
      const res = await fetch(`/api/dev/upload-360?productCode=${encodeURIComponent(code)}`);
      if (res.ok) {
        const { files, count } = await res.json();
        setImages360(files);
        setForm((prev: any) => ({ ...prev, has360: count > 0, images360Count: count }));
      }
    } finally { setLoading360(false); }
  }, []);

  useEffect(() => {
    if (form.code) load360Images(form.code);
  }, []);

  const upload360Images = async (files: FileList) => {
    if (!form.code) return alert('请先填写产品编码');
    setUploading360(true);
    try {
      const fd = new FormData();
      fd.append('productCode', form.code);
      Array.from(files).forEach(f => fd.append('files', f));
      const res = await fetch('/api/dev/upload-360', { method: 'POST', body: fd });
      if (res.ok) {
        await load360Images(form.code);
      }
    } finally { setUploading360(false); }
  };

  const delete360Image = async (filename: string) => {
    const res = await fetch('/api/dev/upload-360', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCode: form.code, filename }),
    });
    if (res.ok) await load360Images(form.code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">编辑产品信息</h3>
            <p className="text-xs text-slate-400 mt-0.5">点击「保存」提交所有更改</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* === Section 1: 基础信息 === */}
          <section>
            <SectionTitle num="1" label="基础识别信息" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 md:col-span-1">
                <FormField label="产品名称 (中文)">
                  <input className={inputCls} value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
                </FormField>
              </div>
              <div className="col-span-2 md:col-span-1">
                <FormField label="Product Name (English)">
                  <input className={inputCls} value={form.nameEn || ''} onChange={e => setForm({...form, nameEn: e.target.value})} />
                </FormField>
              </div>
              <div>
                <FormField label="产品编码">
                  <input className={`${inputCls} font-mono`} value={form.code || ''} onChange={e => setForm({...form, code: e.target.value})} onBlur={() => form.code && load360Images(form.code)} />
                </FormField>
              </div>
              <div>
                <FormField label="所属分类">
                  <select className={inputCls} value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}>
                    {data.categories.filter((c: any) => c.id !== 'all').map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="产品描述 (中文)">
                  <div className="border rounded-lg bg-white overflow-hidden">
                    <Editor 
                      value={form.description || ''} 
                      onChange={e => setForm({...form, description: e.target.value})} 
                      containerProps={{ style: { height: '300px', overflowY: 'auto' } }}
                    />
                  </div>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="Description (English)">
                  <div className="border rounded-lg bg-white overflow-hidden">
                    <Editor 
                      value={form.descriptionEn || ''} 
                      onChange={e => setForm({...form, descriptionEn: e.target.value})} 
                      containerProps={{ style: { height: '300px', overflowY: 'auto' } }}
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </section>

          {/* === Section 2: 封面图 === */}
          <section>
            <SectionTitle num="2" label="封面主图" />
            <div className="mt-4 flex gap-4 items-start">
              <div className="w-40 h-40 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden flex items-center justify-center bg-slate-50 group flex-shrink-0">
                {form.image ? <img src={form.image} className="w-full h-full object-contain" alt="" /> : <ImageIcon className="text-slate-300" size={36} />}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                  <Upload size={22} className="mb-1" />
                  <span className="text-xs font-medium">上传图片</span>
                  <input type="file" className="hidden" accept="image/*" onChange={async e => {
                    const f = e.target.files?.[0]; if (f) { const url = await upload(f, 'products'); if (url) setForm({...form, image: url}); }
                  }} />
                </label>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed pt-2">
                <p>• 建议尺寸：800×800px 或以上</p>
                <p>• 支持格式：JPG / PNG / WebP</p>
                <p>• 建议白色或透明背景</p>
                {form.image && <p className="text-blue-500 mt-2 font-mono break-all">{form.image}</p>}
              </div>
            </div>
          </section>

          {/* === Section 3: 360° 图片上传 === */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle num="3" label="360° 交互图片序列" />
              {loading360 && <span className="text-xs text-blue-500 animate-pulse">加载中...</span>}
              {images360.length > 0 && <span className="text-xs text-emerald-600 font-medium">已有 {images360.length} 张</span>}
            </div>
            <div className="mt-4 space-y-3">
              <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3 leading-relaxed">
                上传后图片将按顺序命名为 1.png、2.png...，存储至 <code className="bg-slate-200 px-1 rounded">/public/360/{form.code || '[产品编码]'}/</code>。上传前请确保已填写产品编码。
              </div>
              {/* 图片网格 */}
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {images360.map((src, i) => {
                  const filename = src.split('/').pop() || '';
                  return (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border bg-slate-50">
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5">{i + 1}</div>
                      <button
                        onClick={() => { if (confirm(`删除第 ${i+1} 张?`)) delete360Image(filename); }}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
                {/* 上传按钮 */}
                <label className="aspect-square rounded-lg border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-blue-400 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer bg-blue-50/50">
                  {uploading360 ? (
                    <RotateCcw size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Plus size={20} />
                      <span className="text-[10px] mt-0.5 font-medium">上传</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" multiple disabled={uploading360} onChange={e => { if (e.target.files?.length) upload360Images(e.target.files); }} />
                </label>
              </div>
            </div>
          </section>

          {/* === Section 4: 技术规格 === */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle num="4" label="技术规格参数" />
              <button onClick={() => setForm({...form, specs: [...(form.specs||[]), {label: '', labelEn: '', value: ''}]})} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus size={13} /> 新增行
              </button>
            </div>
            <div className="mt-4 border rounded-xl overflow-hidden">
              {(form.specs || []).length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-400">暂无规格，点击「新增行」添加</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">中文参数名</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">English Label</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">数值</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.specs || []).map((s: any, i: number) => (
                      <tr key={i} className="">
                        <td className="px-3 py-2">
                          <input className="w-full text-sm bg-slate-50 rounded outline-none py-1 px-2" placeholder="e.g. 工作电压" value={s.label} onChange={e => { const n = [...form.specs]; n[i].label = e.target.value; setForm({...form, specs: n}); }} />
                        </td>
                        <td className="px-3 py-2">
                          <input className="w-full text-sm bg-slate-50 rounded outline-none py-1 px-2" placeholder="e.g. Working Voltage" value={s.labelEn || ''} onChange={e => { const n = [...form.specs]; n[i].labelEn = e.target.value; setForm({...form, specs: n}); }} />
                        </td>
                        <td className="px-3 py-2">
                          <input className="w-full text-sm bg-slate-50 rounded outline-none py-1 px-2" placeholder="e.g. 480V / 3相" value={s.value} onChange={e => { const n = [...form.specs]; n[i].value = e.target.value; setForm({...form, specs: n}); }} />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button onClick={() => { const n = [...form.specs]; n.splice(i, 1); setForm({...form, specs: n}); }} className="text-slate-300 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>


          {/* === Section 6: 文档下载 === */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle num="6" label="文档下载资料" />
              <button
                onClick={() => setForm({...form, documents: [...(form.documents||[]), { title: '', titleEn: '', docType: '使用说明书', format: 'PDF', fileSize: '', url: '' }]})}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={13} /> 新增文档
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(form.documents || []).length === 0 && (
                <div className="text-center py-6 text-sm text-slate-400 rounded-xl bg-slate-50">暂无文档，点击「新增文档」添加</div>
              )}
              {(form.documents || []).map((d: any, i: number) => (
                <div key={i} className="rounded-xl p-4 grid grid-cols-2 gap-3 relative group hover:bg-slate-50 transition-colors">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档标题 (中)</label>
                    <input className={inputCls} placeholder="e.g. 安装使用手册" value={d.title || ''} onChange={e => { const n = [...form.documents]; n[i].title = e.target.value; setForm({...form, documents: n}); }} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Document Title (EN)</label>
                    <input className={inputCls} placeholder="e.g. Installation Manual" value={d.titleEn || ''} onChange={e => { const n = [...form.documents]; n[i].titleEn = e.target.value; setForm({...form, documents: n}); }} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档描述 (中)</label>
                    <input className={inputCls} placeholder="e.g. 含安装步骤与注意事项" value={d.description || ''} onChange={e => { const n = [...form.documents]; n[i].description = e.target.value; setForm({...form, documents: n}); }} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description (EN)</label>
                    <input className={inputCls} placeholder="e.g. Including installation steps" value={d.descriptionEn || ''} onChange={e => { const n = [...form.documents]; n[i].descriptionEn = e.target.value; setForm({...form, documents: n}); }} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档类型</label>
                    <select className={inputCls} value={d.docType || '使用说明书'} onChange={e => { const n = [...form.documents]; n[i].docType = e.target.value; setForm({...form, documents: n}); }}>
                      {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文件格式</label>
                    <select className={inputCls} value={d.format || 'PDF'} onChange={e => { const n = [...form.documents]; n[i].format = e.target.value; setForm({...form, documents: n}); }}>
                      {FILE_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">上传文件</label>
                    <div className="flex gap-2 items-center">
                      <span className={`flex-1 text-xs font-mono text-slate-400 px-3 py-2 border rounded-lg bg-slate-50 truncate ${d.url ? 'text-blue-600' : ''}`}>{d.url || '未上传'}</span>
                      <label className="flex items-center gap-1.5 px-3 py-2 bg-[#2B4A7A] text-white text-xs rounded-lg cursor-pointer hover:bg-[#1C3359] transition-colors whitespace-nowrap">
                        <Upload size={13} /> 上传文档
                        <input type="file" className="hidden" onChange={async e => {
                          const f = e.target.files?.[0]; if (f) {
                            const url = await upload(f, 'documents');
                            if (url) {
                              const ext = f.name.split('.').pop()?.toUpperCase() || 'PDF';
                              const size = f.size < 1024 * 1024 ? `${(f.size/1024).toFixed(0)} KB` : `${(f.size/1024/1024).toFixed(1)} MB`;
                              const n = [...form.documents]; n[i] = {...n[i], url, format: ext, fileSize: size }; setForm({...form, documents: n});
                            }
                          }
                        }} />
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => { const n = [...form.documents]; n.splice(i, 1); setForm({...form, documents: n}); }}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50">
          <button onClick={onClose} className="px-6 py-2 border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">取消</button>
          <button onClick={() => onSave(form)} className="px-10 py-2 bg-[#2B4A7A] text-white rounded-xl text-sm font-bold hover:bg-[#1C3359] shadow-md transition-all">保存修改</button>
        </div>
      </div>
    </div>
  );
}

/* ==================== Helper Components ==================== */
const inputCls = 'w-full h-9 border rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white';

function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-[#2B4A7A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{num}</span>
      <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// Video icon for VideoEditor (needed in a sub-component)
function Video({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}
