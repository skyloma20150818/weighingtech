'use client';

import React from 'react';
import { Plus, X, Upload, Video, Image as ImageIcon } from 'lucide-react';
import type { VideoItem, Category } from './types';

interface VideoManagerProps {
  data: {
    solutionVideos: VideoItem[];
    solutionCategories: Category[];
  };
  onSave: (data: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function VideoManager({ data, onSave, handleFileUpload }: VideoManagerProps) {
  const handleAdd = () => {
    const nd = { ...data };
    nd.solutionVideos.push({
      id: `v${Date.now()}`,
      title: '新视频',
      titleEn: 'New Video',
      category: 'all',
      thumbnail: '',
      videoUrl: '',
      douyinUrl: null,
      isExternal: false
    });
    onSave(nd);
  };

  const handleThumbnailUpload = async (index: number, file: File) => {
    const url = await handleFileUpload(file, 'videos');
    if (url) {
      const nd = { ...data };
      nd.solutionVideos[index].thumbnail = url;
      onSave(nd);
    }
  };

  const handleVideoUpload = async (index: number, file: File) => {
    const url = await handleFileUpload(file, 'videos');
    if (url) {
      const nd = { ...data };
      nd.solutionVideos[index].videoUrl = url;
      onSave(nd);
    }
  };

  const handleUpdate = (index: number, field: keyof VideoItem, value: string) => {
    const nd = { ...data };
    nd.solutionVideos[index] = { ...nd.solutionVideos[index], [field]: value };
    onSave(nd);
  };

  const handleDelete = (index: number) => {
    if (!confirm('删除?')) return;
    const nd = { ...data };
    nd.solutionVideos.splice(index, 1);
    onSave(nd);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">共 {data.solutionVideos?.length || 0} 条</p>
        <button
          onClick={handleAdd}
          className="bg-[#2B4A7A] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5"
        >
          <Plus size={15} /> 添加
        </button>
      </div>
      <div className="space-y-3">
        {(data.solutionVideos || []).map((item, i) => (
          <div
            key={item.id}
            className="rounded-xl p-4 flex gap-4 group relative hover:bg-slate-50 transition-colors bg-white"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">封面图片</label>
              <div className="w-28 h-18 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0 aspect-video">
                {item.thumbnail ? (
                  <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Video size={20} />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity flex-col gap-1">
                  <ImageIcon className="text-white" size={18} />
                  <span className="text-white text-xs">{item.thumbnail ? '更换' : '上传'}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) handleThumbnailUpload(i, f);
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">中文标题</label>
                <input
                  className="w-full bg-slate-50 rounded text-sm focus:outline-none py-1 px-2"
                  value={item.title}
                  onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                  onBlur={() => onSave(data)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">English Title</label>
                <input
                  className="w-full bg-slate-50 rounded text-sm focus:outline-none py-1 px-2"
                  value={item.titleEn || ''}
                  onChange={(e) => handleUpdate(i, 'titleEn', e.target.value)}
                  onBlur={() => onSave(data)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">视频链接/文件</label>
                <div className="flex gap-2 items-center">
                  <input
                    className="flex-1 bg-slate-50 rounded text-xs font-mono focus:outline-none py-1 px-2"
                    value={item.videoUrl}
                    onChange={(e) => handleUpdate(i, 'videoUrl', e.target.value)}
                    onBlur={() => onSave(data)}
                  />
                  <label className="cursor-pointer text-slate-400 hover:text-slate-600">
                    <Upload size={14} />
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) handleVideoUpload(i, f);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">分类</label>
                <select
                  className="w-full text-sm bg-slate-50 rounded py-1 px-2"
                  value={item.category}
                  onChange={(e) => handleUpdate(i, 'category', e.target.value)}
                  onBlur={() => onSave(data)}
                >
                  {(data.solutionCategories || []).map((c: Category) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
