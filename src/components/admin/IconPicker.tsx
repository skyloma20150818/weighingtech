'use client';

import React, { useState } from 'react';
import { ICON_LIST } from './constants';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = ICON_LIST.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedIcon = ICON_LIST.find(i => i.name === value);

  return (
    <div className="relative">
      <label className="block text-xs text-slate-400 mb-1">选择图标</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none flex items-center gap-2 bg-white hover:bg-slate-50"
      >
        {selectedIcon ? (
          <>
            <selectedIcon.icon size={18} className="text-[#2B4A7A]" />
            <span>{value}</span>
          </>
        ) : (
          <span className="text-slate-400">点击选择图标</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-80 bg-white border rounded-xl shadow-lg max-h-64 flex flex-col">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="搜索图标..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              autoFocus
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map(item => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onChange(item.name);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`p-2 rounded-lg hover:bg-slate-100 flex items-center justify-center ${
                    value === item.name ? 'bg-blue-50 ring-1 ring-blue-400' : ''
                  }`}
                  title={item.name}
                >
                  <item.icon size={18} className="text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
