'use client';

import React, { useState } from 'react';
import { Monitor, Star, Users, Phone, LayoutGrid } from 'lucide-react';
import { HeroSectionEditor } from './siteconfig/HeroSectionEditor';
import { FeaturesSectionEditor } from './siteconfig/FeaturesSectionEditor';
import { AboutSectionEditor } from './siteconfig/AboutSectionEditor';
import { ContactSectionEditor } from './siteconfig/ContactSectionEditor';
import { SectionsSectionEditor } from './siteconfig/SectionsSectionEditor';
import type { AppData } from './types';

interface SiteConfigEditorProps {
  data: AppData;
  onSave: (data: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function SiteConfigEditor({ data, onSave, handleFileUpload }: SiteConfigEditorProps) {
  const [activeSubTab, setActiveSubTab] = useState('hero');

  // 获取配置数据，支持向后兼容
  const getConfig = () => {
    const siteConfig = data.siteConfig || {};
    return {
      hero: siteConfig.hero || data.hero || {},
      features: siteConfig.features || [],
      about: siteConfig.about || {},
      contact: siteConfig.contact || data.contact || {},
      consult:
        siteConfig.consult ||
        data.consult || {
          wechat: { enabled: false, qrImage: '' },
          qq: { enabled: false, qrImage: '' },
        },
      sections: siteConfig.sections || {},
    };
  };

  const config = getConfig();

  const updateConfig = (key: string, value: any) => {
    const nd = { ...data };
    if (!nd.siteConfig) nd.siteConfig = { hero: {}, features: [], about: {}, contact: {}, consult: { wechat: { enabled: false, qrImage: '' }, qq: { enabled: false, qrImage: '' } }, sections: {} };
    (nd.siteConfig as any)[key] = value;
    // 保持向后兼容
    if (key === 'hero') nd.hero = value;
    if (key === 'contact') nd.contact = value;
    if (key === 'consult') nd.consult = value;
    onSave(nd);
  };

  const subTabs = [
    { id: 'hero', label: '首页首屏', icon: Monitor },
    { id: 'features', label: '特色功能', icon: Star },
    { id: 'about', label: '关于我们', icon: Users },
    { id: 'contact', label: '联系方式', icon: Phone },
    { id: 'sections', label: '区块标题', icon: LayoutGrid },
  ];

  return (
    <div>
      {/* 子选项卡 */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeSubTab === tab.id
                ? 'border-[#2B4A7A] text-[#2B4A7A]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 子选项卡内容 */}
      {activeSubTab === 'hero' && (
        <HeroSectionEditor
          config={config.hero}
          updateConfig={updateConfig}
          handleFileUpload={handleFileUpload}
        />
      )}
      {activeSubTab === 'features' && (
        <FeaturesSectionEditor config={config.features} updateConfig={updateConfig} />
      )}
      {activeSubTab === 'about' && (
        <AboutSectionEditor
          config={config.about}
          updateConfig={updateConfig}
          handleFileUpload={handleFileUpload}
        />
      )}
      {activeSubTab === 'contact' && (
        <ContactSectionEditor
          config={config.contact}
          consult={config.consult}
          updateConfig={updateConfig}
          handleFileUpload={handleFileUpload}
        />
      )}
      {activeSubTab === 'sections' && (
        <SectionsSectionEditor config={config.sections} updateConfig={updateConfig} />
      )}
    </div>
  );
}
