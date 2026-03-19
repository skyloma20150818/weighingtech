'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, Upload, X, RotateCcw } from 'lucide-react';
import type { Product, Category } from './types';

interface ProductManagerProps {
  data: {
    products: Product[];
    categories: Category[];
  };
  onSave: (data: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function ProductManager({ data, onSave, handleFileUpload }: ProductManagerProps) {
  const [editingItem, setEditingItem] = useState<{ index: number; data: Product } | null>(null);

  const handleAdd = () => {
    setEditingItem({
      index: -1,
      data: {
        id: '',
        name: '',
        nameEn: '',
        code: '',
        category: data.categories[1]?.id || '',
        description: '',
        descriptionEn: '',
        image: '',
        specs: [],
        documents: [],
      },
    });
  };

  const handleEdit = (index: number, product: Product) => {
    setEditingItem({ index, data: { ...product } });
  };

  const handleDelete = (index: number) => {
    if (!confirm('确认删除该产品?')) return;
    const nd = { ...data };
    nd.products.splice(index, 1);
    onSave(nd);
  };

  const handleSaveProduct = (product: Product) => {
    const nd = { ...data };
    if (editingItem?.index === -1) {
      nd.products.push({ ...product, id: Date.now().toString() });
    } else if (editingItem) {
      nd.products[editingItem.index] = product;
    }
    onSave(nd);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
        >
          <Plus size={15} /> 新增产品
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {(data.products || []).map((p, i) => (
          <div
            key={p.id}
            className="rounded-xl p-4 flex gap-3 hover:bg-slate-50 transition-colors group relative border border-transparent hover:border-slate-200"
          >
            {p.image ? (
              <img
                src={p.image}
                className="w-16 h-16 object-contain rounded-lg bg-slate-50 flex-shrink-0"
                alt={p.name}
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={24} className="text-slate-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 truncate">{p.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{p.code}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded font-medium">
                {data.categories.find((c) => c.id === p.category)?.name || p.category}
              </span>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(i, p)}
                className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-50 border border-slate-200"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="p-1.5 bg-white text-red-500 rounded hover:bg-red-50 border border-slate-200"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 产品编辑弹窗 */}
      {editingItem && (
        <ProductForm
          data={data}
          item={editingItem.data}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveProduct}
          upload={handleFileUpload}
        />
      )}
    </div>
  );
}

// ==================== 产品编辑弹窗 ====================

import Editor from 'react-simple-wysiwyg';
import { SectionTitle, FormField, inputCls } from './common';
import { DOC_TYPES, FILE_FORMATS } from './constants';

interface ProductFormProps {
  data: { products: Product[]; categories: Category[] };
  item: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
  upload: (file: File, category: string) => Promise<string | null>;
}

function ProductForm({ data, item, onClose, onSave, upload }: ProductFormProps) {
  const [form, setForm] = useState<Product>(item);
  const [images360, setImages360] = useState<string[]>([]);
  const [loading360, setLoading360] = useState(false);
  const [uploading360, setUploading360] = useState(false);

  // 加载已有的360图片
  const load360Images = useCallback(async (code: string) => {
    if (!code) return;
    setLoading360(true);
    try {
      const res = await fetch(`/api/admin/upload-360?productCode=${encodeURIComponent(code)}`);
      if (res.ok) {
        const { files, count } = await res.json();
        setImages360(files);
        setForm((prev) => ({ ...prev, has360: count > 0, images360Count: count }));
      }
    } finally {
      setLoading360(false);
    }
  }, []);

  useEffect(() => {
    if (form.code) load360Images(form.code);
  }, [form.code, load360Images]);

  const upload360Images = async (files: FileList) => {
    if (!form.code) return alert('请先填写产品编码');
    setUploading360(true);
    try {
      const fd = new FormData();
      fd.append('productCode', form.code);
      Array.from(files).forEach((f) => fd.append('files', f));
      const res = await fetch('/api/admin/upload-360', { method: 'POST', body: fd });
      if (res.ok) {
        await load360Images(form.code);
      }
    } finally {
      setUploading360(false);
    }
  };

  const delete360Image = async (filename: string) => {
    const res = await fetch('/api/admin/upload-360', {
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
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* === Section 1: 基础信息 === */}
          <section>
            <SectionTitle num="1" label="基础识别信息" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 md:col-span-1">
                <FormField label="产品名称 (中文)">
                  <input
                    className={inputCls}
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </FormField>
              </div>
              <div className="col-span-2 md:col-span-1">
                <FormField label="Product Name (English)">
                  <input
                    className={inputCls}
                    value={form.nameEn || ''}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  />
                </FormField>
              </div>
              <div>
                <FormField label="产品编码">
                  <input
                    className={`${inputCls} font-mono`}
                    value={form.code || ''}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    onBlur={() => form.code && load360Images(form.code)}
                  />
                </FormField>
              </div>
              <div>
                <FormField label="所属分类">
                  <select
                    className={inputCls}
                    value={form.category || ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {data.categories
                      .filter((c) => c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </FormField>
              </div>
              <div className="col-span-2">
                <FormField label="产品描述 (中文)">
                  <div className="border rounded-lg bg-white overflow-hidden">
                    <Editor
                      value={form.description || ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
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
                {form.image ? (
                  <img src={form.image} className="w-full h-full object-contain" alt="" />
                ) : (
                  <ImageIcon className="text-slate-300" size={36} />
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                  <Upload size={22} className="mb-1" />
                  <span className="text-xs font-medium">上传图片</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = await upload(f, 'products');
                        if (url) setForm({ ...form, image: url });
                      }
                    }}
                  />
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
              {images360.length > 0 && (
                <span className="text-xs text-emerald-600 font-medium">已有 {images360.length} 张</span>
              )}
            </div>
            <div className="mt-4 space-y-3">
              <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3 leading-relaxed">
                上传后图片将按顺序命名为 1.png、2.png...，存储至{' '}
                <code className="bg-slate-200 px-1 rounded">
                  /public/360/{form.code || '[产品编码]'}/
                </code>
                。上传前请确保已填写产品编码。
              </div>
              {/* 图片网格 */}
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {images360.map((src, i) => {
                  const filename = src.split('/').pop() || '';
                  return (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-lg overflow-hidden border bg-slate-50"
                    >
                      <img src={src} className="w-full h-full object-cover" alt="" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5">
                        {i + 1}
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`删除第 ${i + 1} 张?`)) delete360Image(filename);
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
                {/* 上传按钮 */}
                <label
                  className="aspect-square rounded-lg border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-blue-400 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer bg-blue-50/50"
                >
                  {uploading360 ? (
                    <RotateCcw size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Plus size={20} />
                      <span className="text-[10px] mt-0.5 font-medium">上传</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    disabled={uploading360}
                    onChange={(e) => {
                      if (e.target.files?.length) upload360Images(e.target.files);
                    }}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* === Section 4: 技术规格 === */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle num="4" label="技术规格参数" />
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    specs: [...(form.specs || []), { label: '', labelEn: '', value: '' }],
                  })
                }
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={13} /> 新增行
              </button>
            </div>
            <div className="mt-4 border rounded-xl overflow-hidden">
              {(form.specs || []).length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-400">
                  暂无规格，点击「新增行」添加
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                        中文参数名
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">
                        English Label
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500">数值</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.specs || []).map((s, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <input
                            className="w-full text-sm bg-slate-50 rounded outline-none py-1 px-2"
                            placeholder="e.g. 工作电压"
                            value={s.label}
                            onChange={(e) => {
                              const n = [...(form.specs || [])];
                              n[i].label = e.target.value;
                              setForm({ ...form, specs: n });
                            }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full text-sm bg-slate-50 rounded outline-none py-1 px-2"
                            placeholder="e.g. Working Voltage"
                            value={s.labelEn || ''}
                            onChange={(e) => {
                              const n = [...(form.specs || [])];
                              n[i].labelEn = e.target.value;
                              setForm({ ...form, specs: n });
                            }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            className="w-full text-sm bg-slate-50 rounded outline-none py-1 px-2"
                            placeholder="e.g. 480V / 3相"
                            value={s.value}
                            onChange={(e) => {
                              const n = [...(form.specs || [])];
                              n[i].value = e.target.value;
                              setForm({ ...form, specs: n });
                            }}
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            onClick={() => {
                              const n = [...(form.specs || [])];
                              n.splice(i, 1);
                              setForm({ ...form, specs: n });
                            }}
                            className="text-slate-300 hover:text-red-500"
                          >
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

          {/* === Section 5: 文档下载 === */}
          <section>
            <div className="flex items-center justify-between">
              <SectionTitle num="5" label="文档下载资料" />
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    documents: [
                      ...(form.documents || []),
                      { title: '', titleEn: '', docType: '使用说明书', format: 'PDF', fileSize: '', url: '' },
                    ],
                  })
                }
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={13} /> 新增文档
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(form.documents || []).length === 0 && (
                <div className="text-center py-6 text-sm text-slate-400 rounded-xl bg-slate-50">
                  暂无文档，点击「新增文档」添加
                </div>
              )}
              {(form.documents || []).map((d, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 grid grid-cols-2 gap-3 relative group hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档标题 (中)</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. 安装使用手册"
                      value={d.title || ''}
                      onChange={(e) => {
                        const n = [...(form.documents || [])];
                        n[i].title = e.target.value;
                        setForm({ ...form, documents: n });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Document Title (EN)</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Installation Manual"
                      value={d.titleEn || ''}
                      onChange={(e) => {
                        const n = [...(form.documents || [])];
                        n[i].titleEn = e.target.value;
                        setForm({ ...form, documents: n });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档描述 (中)</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. 含安装步骤与注意事项"
                      value={d.description || ''}
                      onChange={(e) => {
                        const n = [...(form.documents || [])];
                        n[i].description = e.target.value;
                        setForm({ ...form, documents: n });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description (EN)</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Including installation steps"
                      value={d.descriptionEn || ''}
                      onChange={(e) => {
                        const n = [...(form.documents || [])];
                        n[i].descriptionEn = e.target.value;
                        setForm({ ...form, documents: n });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文档类型</label>
                    <select
                      className={inputCls}
                      value={d.docType || '使用说明书'}
                      onChange={(e) => {
                        const n = [...(form.documents || [])];
                        n[i].docType = e.target.value;
                        setForm({ ...form, documents: n });
                      }}
                    >
                      {DOC_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">文件格式</label>
                    <select
                      className={inputCls}
                      value={d.format || 'PDF'}
                      onChange={(e) => {
                        const n = [...(form.documents || [])];
                        n[i].format = e.target.value;
                        setForm({ ...form, documents: n });
                      }}
                    >
                      {FILE_FORMATS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">上传文件</label>
                    <div className="flex gap-2 items-center">
                      <span
                        className={`flex-1 text-xs font-mono text-slate-400 px-3 py-2 border rounded-lg bg-slate-50 truncate ${
                          d.url ? 'text-blue-600' : ''
                        }`}
                      >
                        {d.url || '未上传'}
                      </span>
                      <label className="flex items-center gap-1.5 px-3 py-2 bg-[#2B4A7A] text-white text-xs rounded-lg cursor-pointer hover:bg-[#1C3359] transition-colors whitespace-nowrap">
                        <Upload size={13} /> 上传文档
                        <input
                          type="file"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = await upload(f, 'documents');
                              if (url) {
                                const ext = f.name.split('.').pop()?.toUpperCase() || 'PDF';
                                const size =
                                  f.size < 1024 * 1024
                                    ? `${(f.size / 1024).toFixed(0)} KB`
                                    : `${(f.size / 1024 / 1024).toFixed(1)} MB`;
                                const n = [...(form.documents || [])];
                                n[i] = { ...n[i], url, format: ext, fileSize: size };
                                setForm({ ...form, documents: n });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const n = [...(form.documents || [])];
                      n.splice(i, 1);
                      setForm({ ...form, documents: n });
                    }}
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
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-10 py-2 bg-[#2B4A7A] text-white rounded-xl text-sm font-bold hover:bg-[#1C3359] shadow-md transition-all"
          >
            保存修改
          </button>
        </div>
      </div>
    </div>
  );
}
