'use client';

import React from 'react';
import { Phone, Globe, Upload } from 'lucide-react';
import type { ContactConfig, ConsultConfig } from '../types';

interface ContactSectionEditorProps {
  config: ContactConfig;
  consult: ConsultConfig;
  updateConfig: (key: string, value: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function ContactSectionEditor({
  config,
  consult,
  updateConfig,
  handleFileUpload,
}: ContactSectionEditorProps) {
  const contact = config || {};
  const consultData = consult || { wechat: { enabled: false, qrImage: '' }, qq: { enabled: false, qrImage: '' } };

  const updateContact = (field: keyof ContactConfig, value: string) => {
    updateConfig('contact', { ...contact, [field]: value });
  };

  const updateConsult = (field: keyof ConsultConfig, value: any) => {
    updateConfig('consult', { ...consultData, [field]: value });
  };

  const updateConsultItem = (type: 'wechat' | 'qq', field: 'enabled' | 'qrImage', value: any) => {
    updateConfig('consult', {
      ...consultData,
      [type]: { ...consultData[type], [field]: value },
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Phone size={15} className="text-blue-500" />
          基础联系方式
        </h3>
        <div className="space-y-3">
          {[
            { key: 'phone', label: '固话' },
            { key: 'mobile', label: '手机' },
            { key: 'email', label: '邮箱' },
            { key: 'address', label: '地址' },
            { key: 'addressEn', label: 'Address (EN)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-slate-400 mb-1">{label}</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                value={(contact as any)[key] || ''}
                onChange={(e) => updateContact(key as keyof ContactConfig, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Globe size={15} className="text-emerald-500" />
          在线咨询
        </h3>
        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border">
          <div>
            <label className="block text-xs text-slate-400 mb-1">标题</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={consultData.title || ''}
              onChange={(e) => updateConsult('title', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">描述</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              rows={2}
              value={consultData.description || ''}
              onChange={(e) => updateConsult('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(['wechat', 'qq'] as const).map((type) => (
              <div key={type} className="bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-600">{type}</span>
                  <input
                    type="checkbox"
                    checked={consultData[type]?.enabled ?? false}
                    onChange={(e) => updateConsultItem(type, 'enabled', e.target.checked)}
                  />
                </div>
                <div className="aspect-square bg-slate-50 rounded-lg relative overflow-hidden">
                  {consultData[type]?.qrImage ? (
                    <img
                      src={consultData[type].qrImage}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                      暂无二维码
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="text-white" size={18} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await handleFileUpload(f, 'others');
                          if (url) updateConsultItem(type, 'qrImage', url);
                        }
                      }}
                    />
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
