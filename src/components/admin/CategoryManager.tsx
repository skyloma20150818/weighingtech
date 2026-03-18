'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Category } from './types';

interface CategoryTableProps {
  title: string;
  items: Category[];
  onUpdate: (items: Category[]) => void;
}

function CategoryTable({ title, items, onUpdate }: CategoryTableProps) {
  const [rows, setRows] = useState<Category[]>(items);

  const update = (i: number, field: keyof Category, val: string) => {
    const nr = [...rows];
    nr[i] = { ...nr[i], [field]: val };
    setRows(nr);
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

interface CategoryManagerProps {
  data: {
    categories: Category[];
    albumCategories: Category[];
    solutionCategories: Category[];
  };
  onSave: (data: any) => void;
}

export function CategoryManager({ data, onSave }: CategoryManagerProps) {
  const handleUpdate = (key: 'categories' | 'albumCategories' | 'solutionCategories', items: Category[]) => {
    const nd = { ...data, [key]: items };
    onSave(nd);
  };

  return (
    <div className="space-y-8">
      <CategoryTable
        title="产品分类"
        items={data.categories}
        onUpdate={(items) => handleUpdate('categories', items)}
      />
      <CategoryTable
        title="相册分类"
        items={data.albumCategories}
        onUpdate={(items) => handleUpdate('albumCategories', items)}
      />
      <CategoryTable
        title="视频分类"
        items={data.solutionCategories}
        onUpdate={(items) => handleUpdate('solutionCategories', items)}
      />
    </div>
  );
}
