'use client';

import React from 'react';
import { Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import type { AlbumItem, Category } from './types';

interface AlbumManagerProps {
  data: {
    companyAlbum: AlbumItem[];
    albumCategories: Category[];
  };
  onSave: (data: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function AlbumManager({ data, onSave, handleFileUpload }: AlbumManagerProps) {
  const handleAdd = () => {
    const nd = { ...data };
    nd.companyAlbum.push({
      id: `a${Date.now()}`,
      title: '新图片',
      titleEn: 'New Image',
      category: 'all',
      image: ''
    });
    onSave(nd);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const url = await handleFileUpload(file, 'albums');
    if (url) {
      const nd = { ...data };
      nd.companyAlbum[index].image = url;
      onSave(nd);
    }
  };

  const handleUpdate = (index: number, field: keyof AlbumItem, value: string) => {
    const nd = { ...data };
    nd.companyAlbum[index] = { ...nd.companyAlbum[index], [field]: value };
    onSave(nd);
  };

  const handleDelete = (index: number) => {
    if (!confirm('删除?')) return;
    const nd = { ...data };
    nd.companyAlbum.splice(index, 1);
    onSave(nd);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">共 {data.companyAlbum.length} 张</p>
        <button
          onClick={handleAdd}
          className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
        >
          <Plus size={15} /> 添加
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {data.companyAlbum.map((item, i) => (
          <div key={item.id} className="rounded-xl overflow-hidden bg-slate-50 relative group">
            <div className="aspect-square bg-white relative">
              {item.image ? (
                <img src={item.image} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <ImageIcon size={36} />
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Upload className="text-white" size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(i, f);
                  }}
                />
              </label>
            </div>
            <div className="p-2 space-y-1">
              <input
                className="w-full bg-transparent text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                value={item.title}
                onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                onBlur={() => onSave(data)}
                placeholder="中文标题"
              />
              <input
                className="w-full bg-transparent text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                value={item.titleEn || ''}
                onChange={(e) => handleUpdate(i, 'titleEn', e.target.value)}
                onBlur={() => onSave(data)}
                placeholder="English Title"
              />
              <select
                className="w-full mt-1 text-[10px] bg-slate-100 rounded px-1 py-0.5"
                value={item.category}
                onChange={(e) => handleUpdate(i, 'category', e.target.value)}
              >
                {data.albumCategories.map((c: Category) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
