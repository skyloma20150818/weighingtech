'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, FileText, RotateCcw } from 'lucide-react';
import { DOC_TYPES, FILE_FORMATS } from './constants';
import type { DocumentItem } from './types';

export function DocumentManager() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (doc: DocumentItem) => {
    setSaving(true);
    try {
      const isNew = !doc.id || doc.id.startsWith('doc_');
      const res = await fetch('/api/admin/documents', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (res.ok) {
        await fetchDocuments();
        setEditingId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除?')) return;
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) await fetchDocuments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'documents');
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      const err = await res.json();
      console.error('Upload error:', err.error);
      alert('上传失败: ' + (err.error || '未知错误'));
    } catch (e) {
      console.error(e);
      alert('上传失败: ' + (e as Error).message);
    }
    return null;
  };

  const handleAdd = () => {
    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: '新文档',
      titleEn: 'New Document',
      description: '',
      descriptionEn: '',
      docType: '其他',
      format: 'PDF',
      fileSize: '',
      url: '',
      category: 'other',
      sort: documents.length,
    };
    setDocuments([...documents, newDoc]);
    setEditingId(newDoc.id);
  };

  const categories = [
    { id: 'certificates', name: '资质证书', nameEn: 'Certificates' },
    { id: 'manuals', name: '产品手册', nameEn: 'Manuals' },
    { id: 'technical', name: '技术资料', nameEn: 'Technical' },
    { id: 'other', name: '其他', nameEn: 'Other' },
  ];

  const updateDocument = (index: number, field: keyof DocumentItem, value: any) => {
    const nd = [...documents];
    nd[index] = { ...nd[index], [field]: value };
    setDocuments(nd);
  };

  if (loading) return <div className="text-center py-8 text-slate-400">加载中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">共 {documents.length} 个文档</p>
        <button
          onClick={handleAdd}
          className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
        >
          <Plus size={15} /> 添加文档
        </button>
      </div>

      <div className="space-y-3">
        {documents.map((doc, i) => (
          <div
            key={doc.id}
            className="rounded-xl p-4 bg-white border transition-colors hover:border-blue-200"
          >
            {editingId === doc.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档标题 (中)</label>
                    <input
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.title}
                      onChange={(e) => updateDocument(i, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">标题 (英)</label>
                    <input
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.titleEn || ''}
                      onChange={(e) => updateDocument(i, 'titleEn', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">描述 (中)</label>
                    <input
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.description || ''}
                      onChange={(e) => updateDocument(i, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">描述 (英)</label>
                    <input
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.descriptionEn || ''}
                      onChange={(e) => updateDocument(i, 'descriptionEn', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档类型</label>
                    <select
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.docType || '其他'}
                      onChange={(e) => updateDocument(i, 'docType', e.target.value)}
                    >
                      {DOC_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文件格式</label>
                    <select
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.format || 'PDF'}
                      onChange={(e) => updateDocument(i, 'format', e.target.value)}
                    >
                      {FILE_FORMATS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">分类</label>
                    <select
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.category || 'other'}
                      onChange={(e) => updateDocument(i, 'category', e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文件大小</label>
                    <input
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.fileSize || ''}
                      onChange={(e) => updateDocument(i, 'fileSize', e.target.value)}
                      placeholder="如: 2.5MB"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">排序</label>
                    <input
                      type="number"
                      className="w-full border rounded text-sm py-1.5 px-2"
                      value={doc.sort || 0}
                      onChange={(e) => updateDocument(i, 'sort', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">文件链接</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded text-sm py-1.5 px-2 font-mono"
                      value={doc.url || ''}
                      onChange={(e) => updateDocument(i, 'url', e.target.value)}
                      placeholder="/uploads/documents/xxx.pdf"
                    />
                    <label
                      className={`cursor-pointer px-3 rounded flex items-center gap-1 ${
                        uploadingIndex === i
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {uploadingIndex === i ? (
                        <RotateCcw size={14} className="animate-spin" />
                      ) : (
                        <Upload size={14} />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.zip,.doc,.docx,.dxf"
                        disabled={uploadingIndex === i}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setUploadingIndex(i);
                            const url = await handleFileUpload(f);
                            if (url) {
                              const fileSize = f.size > 1024 * 1024
                                ? `${(f.size / 1024 / 1024).toFixed(1)}MB`
                                : `${(f.size / 1024).toFixed(0)}KB`;
                              // 合并更新：同时更新 url 和 fileSize
                              const nd = [...documents];
                              nd[i] = { ...nd[i], url, fileSize };
                              setDocuments(nd);
                            }
                            setUploadingIndex(null);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleSave(doc)}
                    disabled={saving}
                    className="bg-green-600 text-white px-3 py-1.5 rounded text-sm"
                  >
                    {saving ? '保存中...' : '保存'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{doc.title}</div>
                  <div className="text-xs text-slate-400">
                    {doc.format} · {doc.fileSize || '未知大小'} ·{' '}
                    {categories.find((c) => c.id === doc.category)?.name || '未分类'}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingId(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-500"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-8 text-slate-400">暂无文档，点击上方添加</div>
        )}
      </div>
    </div>
  );
}
