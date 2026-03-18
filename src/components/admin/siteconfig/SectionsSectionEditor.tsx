'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import type { SectionConfig } from '../types';

interface SectionsSectionEditorProps {
  config: Record<string, SectionConfig>;
  updateConfig: (key: string, value: any) => void;
}

export function SectionsSectionEditor({ config, updateConfig }: SectionsSectionEditorProps) {
  const sections = config || {};

  const sectionFields = [
    { key: 'products', label: '产品中心', labelEn: 'Products' },
    { key: 'solutions', label: '解决方案', labelEn: 'Solutions' },
    { key: 'customization', label: '定制服务', labelEn: 'Customization' },
    { key: 'album', label: '企业相册', labelEn: 'Album' },
  ];

  const updateSection = (key: string, field: keyof SectionConfig, value: string) => {
    updateConfig('sections', {
      ...sections,
      [key]: { ...sections[key], [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <LayoutGrid size={15} className="text-purple-500" />
        各区块标题配置
      </h3>
      <div className="grid gap-4">
        {sectionFields.map(({ key, label, labelEn }) => (
          <div key={key} className="bg-slate-50 p-4 rounded-xl border">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">{label}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">区块标题</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  value={sections[key]?.title || ''}
                  onChange={(e) => updateSection(key, 'title', e.target.value)}
                  placeholder={`${label}标题`}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Section Title (EN)</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  value={sections[key]?.titleEn || ''}
                  onChange={(e) => updateSection(key, 'titleEn', e.target.value)}
                  placeholder={`${labelEn} Title`}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">副标题</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  value={sections[key]?.subtitle || ''}
                  onChange={(e) => updateSection(key, 'subtitle', e.target.value)}
                  placeholder="副标题内容"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subtitle (EN)</label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  value={sections[key]?.subtitleEn || ''}
                  onChange={(e) => updateSection(key, 'subtitleEn', e.target.value)}
                  placeholder="Subtitle content"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
