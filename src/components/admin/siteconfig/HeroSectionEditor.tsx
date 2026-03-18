'use client';

import React, { useState } from 'react';
import { Monitor, Upload, RotateCcw, Image } from 'lucide-react';
import type { HeroConfig } from '../types';

interface HeroSectionEditorProps {
  config: HeroConfig;
  updateConfig: (key: string, value: any) => void;
  handleFileUpload: (file: File, category: string) => Promise<string | null>;
}

export function HeroSectionEditor({ config, updateConfig, handleFileUpload }: HeroSectionEditorProps) {
  const [extracting, setExtracting] = useState(false);
  const hero = config || {};

  return (
    <div className="space-y-6">
      {/* 首页首屏背景 */}
      <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Image size={15} className="text-blue-500" />首页首屏背景
        </h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">背景图片</label>
          <div className="flex gap-4">
            <div className="w-48 h-28 bg-white border border-slate-200 rounded-lg overflow-hidden relative group">
              {hero.backgroundImage ? (
                <img src={hero.backgroundImage} className="w-full h-full object-cover" alt="Hero Background" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                  无图片
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                <Upload size={20} className="mb-1" />
                <span className="text-[10px]">上传图片</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await handleFileUpload(f, 'hero');
                      if (url) updateConfig('hero', { ...hero, backgroundImage: url });
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={hero.backgroundImage || ''}
                onChange={(e) => updateConfig('hero', { ...hero, backgroundImage: e.target.value })}
                placeholder="背景图片链接"
              />
              <p className="text-xs text-slate-500">
                建议尺寸：1920x1080 像素。不设置则使用默认背景。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 多媒体 */}
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <Monitor size={15} className="text-blue-500" />首页首屏多媒体
      </h3>
      <div className="bg-slate-50 p-6 rounded-xl border space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">背景视频 (MP4)</label>
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={hero.videoUrl || ''}
              onChange={(e) => updateConfig('hero', { ...hero, videoUrl: e.target.value })}
              placeholder="例如: /uploads/videos/hero-video.mp4 或是外部链接"
            />
            <button
              type="button"
              onClick={() => document.getElementById('hero-video-upload')?.click()}
              disabled={extracting}
              className={`bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors ${
                extracting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {extracting ? (
                <RotateCcw size={16} className="text-blue-500 animate-spin" />
              ) : (
                <Upload size={16} className="text-slate-500" />
              )}
              {extracting ? '上传及处理中...' : '上传视频'}
            </button>
            <input
              id="hero-video-upload"
              type="file"
              className="hidden"
              accept="video/*"
              disabled={extracting}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setExtracting(true);
                  try {
                    const url = await handleFileUpload(f, 'videos');
                    if (!url) {
                      alert('视频上传失败，请检查网络连接');
                      setExtracting(false);
                      return;
                    }
                    const updatedHero = { ...hero, videoUrl: url };

                    // 提取视频第一帧
                    const frameFile = await new Promise<File | null>((resolve) => {
                      const video = document.createElement('video');
                      const objUrl = URL.createObjectURL(f);
                      video.src = objUrl;
                      video.muted = true;
                      video.playsInline = true;
                      video.onloadeddata = () => {
                        video.currentTime = Math.min(0.5, video.duration / 2 || 0.5);
                      };
                      video.onseeked = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth || 1920;
                        canvas.height = video.videoHeight || 1080;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob((blob) => {
                          if (blob)
                            resolve(
                              new File([blob], f.name.replace(/\.[^/.]+$/, '') + '_poster.jpg', {
                                type: 'image/jpeg',
                              })
                            );
                          else resolve(null);
                          URL.revokeObjectURL(objUrl);
                        }, 'image/jpeg', 0.8);
                      };
                      video.onerror = () => {
                        URL.revokeObjectURL(objUrl);
                        resolve(null);
                      };
                    });

                    if (frameFile) {
                      const posterUrl = await handleFileUpload(frameFile, 'hero');
                      if (posterUrl) updatedHero.poster = posterUrl;
                    }
                    updateConfig('hero', updatedHero);
                  } catch (err) {
                    console.error('上传或截图失败', err);
                    alert('处理失败: ' + err);
                  } finally {
                    setExtracting(false);
                  }
                }
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            推荐尺寸 1920x1080，大小不要超过 20MB。上传后将自动提取第0.5秒作为海报封面。
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            封面图片 (海报/备用图)
          </label>
          <div className="flex gap-4">
            <div className="w-48 h-28 bg-white border border-slate-200 rounded-lg overflow-hidden relative group">
              {hero.poster ? (
                <img src={hero.poster} className="w-full h-full object-cover" alt="Hero Poster" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                  无图片
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                <Upload size={20} className="mb-1" />
                <span className="text-[10px]">上传图片</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const url = await handleFileUpload(f, 'hero');
                      if (url) updateConfig('hero', { ...hero, poster: url });
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                value={hero.poster || ''}
                onChange={(e) => updateConfig('hero', { ...hero, poster: e.target.value })}
                placeholder="图片链接"
              />
              <p className="text-xs text-slate-500">
                此图片用作视频加载前的海报图。上传视频时已自动生成，你也可以单独上传覆盖该图。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
