'use client';

import React from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { IconPicker } from '../IconPicker';
import type { Feature } from '../types';

interface FeaturesSectionEditorProps {
  config: Feature[];
  updateConfig: (key: string, value: any) => void;
}

export function FeaturesSectionEditor({ config, updateConfig }: FeaturesSectionEditorProps) {
  const features = config || [];

  const addFeature = () => {
    const newFeatures: Feature[] = [
      ...features,
      { icon: 'Star', title: '新特性', titleEn: 'New Feature', desc: '描述内容', descEn: 'Description' },
    ];
    updateConfig('features', newFeatures);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateConfig('features', newFeatures);
  };

  const removeFeature = (index: number) => {
    if (!confirm('确定删除此特性?')) return;
    const newFeatures = features.filter((_, i) => i !== index);
    updateConfig('features', newFeatures);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Star size={15} className="text-yellow-500" />
          服务和支持列表
        </h3>
        <button
          onClick={addFeature}
          className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
        >
          <Plus size={15} /> 服务和支持
        </button>
      </div>

      {features.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl">
          暂无服务和支持配置，点击&quot;添加服务和支持&quot;开始配置
        </div>
      ) : (
        <div className="grid gap-4">
          {features.map((feature, i) => (
            <div key={i} className="bg-slate-50 p-4 rounded-xl border relative group">
              <button
                onClick={() => removeFeature(i)}
                className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <IconPicker
                    value={feature.icon || 'Star'}
                    onChange={(icon) => updateFeature(i, 'icon', icon)}
                  />
                </div>
                <div></div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">中文标题</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={feature.title || ''}
                    onChange={(e) => updateFeature(i, 'title', e.target.value)}
                    placeholder="服务和支持标题"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">English Title</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={feature.titleEn || ''}
                    onChange={(e) => updateFeature(i, 'titleEn', e.target.value)}
                    placeholder="Feature Title"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">中文描述</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    rows={2}
                    value={feature.desc || ''}
                    onChange={(e) => updateFeature(i, 'desc', e.target.value)}
                    placeholder="服务和支持描述内容"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Description (EN)</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    rows={2}
                    value={feature.descEn || ''}
                    onChange={(e) => updateFeature(i, 'descEn', e.target.value)}
                    placeholder="Feature description"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
