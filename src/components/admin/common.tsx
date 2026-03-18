import React from 'react';

export const inputCls = 'w-full h-9 border rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white';

interface SectionTitleProps {
  num: string;
  label: string;
}

export function SectionTitle({ num, label }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-[#2B4A7A] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{num}</span>
      <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
