'use client';

import React from 'react';
import { Users, Upload } from 'lucide-react';
import type { AboutConfig } from '../types';

interface AboutSectionEditorProps {
  config: AboutConfig;
  updateConfig: (key: string, value: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function AboutSectionEditor({ config, updateConfig, handleFileUpload }: AboutSectionEditorProps) {
  const about = config || {};

  const updateAbout = (field: keyof AboutConfig, value: any) => {
    updateConfig('about', { ...about, [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <Users size={15} className="text-green-500" />
        关于我们
      </h3>
      <div className="bg-slate-50 p-6 rounded-xl border space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">标题 (中文)</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={about.title || ''}
              onChange={(e) => updateAbout('title', e.target.value)}
              placeholder="关于标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title (English)</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={about.titleEn || ''}
              onChange={(e) => updateAbout('titleEn', e.target.value)}
              placeholder="About Title"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">简介描述 (中文)</label>
          <textarea
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            rows={4}
            value={about.description || ''}
            onChange={(e) => updateAbout('description', e.target.value)}
            placeholder="公司简介描述内容..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description (EN)</label>
          <textarea
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            rows={4}
            value={about.descriptionEn || ''}
            onChange={(e) => updateAbout('descriptionEn', e.target.value)}
            placeholder="Company introduction..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">展示图片</label>
          <div className="flex gap-4">
            <div className="w-48 h-32 bg-white border border-slate-200 rounded-lg overflow-hidden relative group">
              {about.image ? (
                <img src={about.image} className="w-full h-full object-cover" alt="About" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                  无图片
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                <Upload size={20} className="mb-1" />
                <span className="text-[10px]">上传图片</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await handleFileUpload(f, 'about');
                      if (url) updateAbout('image', url);
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex-1">
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={about.image || ''}
                onChange={(e) => updateAbout('image', e.target.value)}
                placeholder="图片链接"
              />
              <p className="text-xs text-slate-500 mt-2">建议尺寸 800x600px 或 16:9 比例</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
