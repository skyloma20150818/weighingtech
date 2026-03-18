'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

// 判断是否为外部图片
function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

export default function SmartImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  fallbackSrc = '/logo.png',
  priority = false,
  sizes,
  loading,
}: SmartImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageSrc = error ? fallbackSrc : src;
  const isExternal = isExternalImage(imageSrc);

  // 外部图片使用原生 img
  if (isExternal) {
    return (
      <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <ImageIcon className="text-slate-300" size={32} />
          </div>
        )}
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${fill ? 'w-full h-full object-cover' : ''}`}
          onError={() => setError(true)}
          onLoad={() => setIsLoading(false)}
          loading={loading}
        />
      </div>
    );
  }

  // 本地图片使用 Next.js Image
  // priority 和 loading 不能同时使用
  const imageProps: any = {};
  if (priority) {
    imageProps.priority = true;
  } else if (loading) {
    imageProps.loading = loading;
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <ImageIcon className="text-slate-300" size={32} />
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        sizes={sizes}
        {...imageProps}
      />
    </div>
  );
}
