'use client';

import { useState } from 'react';
import { X, FileText, Download } from 'lucide-react';

interface FilePreviewProps {
  url: string;
  title: string;
  format: string;
  onClose: () => void;
}

export default function FilePreview({ url, title, format, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  const isPDF = format.toLowerCase() === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(format.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" size={24} />
            <h3 className="font-semibold text-slate-800">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download size={18} />
              下载
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* 预览内容 */}
        <div className="p-4 bg-slate-50 min-h-[400px] flex items-center justify-center">
          {isPDF ? (
            <iframe
              src={url}
              className="w-full h-[600px] rounded-lg"
              onLoad={() => setIsLoading(false)}
            />
          ) : isImage ? (
            <img
              src={url}
              alt={title}
              className="max-w-full max-h-[600px] rounded-lg shadow-lg"
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="text-center">
              <FileText size={64} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">此文件类型不支持在线预览</p>
              <a
                href={url}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={18} />
                下载文件
              </a>
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
