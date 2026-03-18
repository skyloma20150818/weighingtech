import { FileText, FileSpreadsheet, FileArchive, File, FileCode, Image as ImageIcon } from 'lucide-react';

interface FileIconProps {
  format: string;
  size?: number;
}

const fileConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  doc: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  docx: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  xls: { icon: FileSpreadsheet, color: 'text-green-500', bg: 'bg-green-50' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-500', bg: 'bg-green-50' },
  zip: { icon: FileArchive, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  rar: { icon: FileArchive, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  '7z': { icon: FileArchive, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  txt: { icon: FileCode, color: 'text-slate-500', bg: 'bg-slate-50' },
  jpg: { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
  jpeg: { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
  png: { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
  default: { icon: File, color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function FileIcon({ format, size = 24 }: FileIconProps) {
  const config = fileConfig[format.toLowerCase()] || fileConfig.default;
  const Icon = config.icon;
  
  // 根据图标大小调整容器大小
  const containerSize = size <= 20 ? 'w-8 h-8' : 'w-12 h-12';
  const roundedSize = size <= 20 ? 'rounded-lg' : 'rounded-xl';
  
  return (
    <div className={`${containerSize} ${config.bg} ${roundedSize} flex items-center justify-center ${config.color} shrink-0`}>
      <Icon size={size} />
    </div>
  );
}
