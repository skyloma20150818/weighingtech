"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, MoveHorizontal } from 'lucide-react';

interface Product360ViewerProps {
  productCode: string;
  image: string;
  images360Count?: number;
  images360?: string[];
  title: string;
  onClose: () => void;
  autoRotate?: boolean;
  isEmbedded?: boolean;
}

export default function Product360Viewer({ productCode, image, images360Count, images360 = [], title, onClose, autoRotate = true, isEmbedded = false }: Product360ViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const currentFrameIndex = useRef(0);
  
  // Backward compatibility: if explicit images360 array is provided, use it. Otherwise guess pngs.
  const hasSequence = images360.length > 1 || (images360Count && images360Count > 1);

  const images360Urls = React.useMemo(() => {
    if (images360 && images360.length > 0) return images360;
    if (!hasSequence) return [];
    return Array.from({ length: images360Count || 0 }, (_, i) => `/360/${productCode}/${i + 1}.png`);
  }, [hasSequence, images360Count, productCode, images360]);

  // Auto rotation logic
  useEffect(() => {
    if (autoRotate && hasSequence && !isDragging) {
      const interval = setInterval(() => {
        setFrameIndex(prev => {
          const next = (prev + 1) % images360Urls.length;
          currentFrameIndex.current = next;
          return next;
        });
      }, 150); // Slow rotation
      return () => clearInterval(interval);
    }
  }, [autoRotate, hasSequence, isDragging, images360Urls.length]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = clientX - startX.current;
      
      if (hasSequence) {
        // For sequence, map delta to frame index
        // e.g., 10px drag = 1 frame
        const sensitivity = 10;
        const frameDelta = Math.floor(delta / sensitivity);
        let newIndex = (currentFrameIndex.current - frameDelta) % images360Urls.length;
        if (newIndex < 0) newIndex += images360Urls.length;
        setFrameIndex(newIndex);
      } else {
        // For 3D box, map delta to rotation
        setRotation(currentRotation.current + delta * 0.5);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        currentRotation.current = rotation;
        currentFrameIndex.current = frameIndex;
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, rotation, frameIndex, hasSequence, images360Urls]);

  // Preload images
  useEffect(() => {
    if (hasSequence) {
      images360Urls.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [hasSequence, images360Urls]);

  return (
    <div className={isEmbedded ? "relative w-full h-full flex items-center justify-center bg-transparent" : "fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"}>
      {!isEmbedded && (
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
        >
          <X size={24} />
        </button>
      )}

      {!isEmbedded && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center text-white z-10 pointer-events-none w-full px-4">
          <h3 className="text-2xl font-bold mb-3">{title} - 360° 视角</h3>
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20">
            <MoveHorizontal size={18} className="animate-pulse" /> 
            左右拖动以全方位查看
          </div>
        </div>
      )}

      {/* 3D Container */}
      <div 
        className={`relative ${isEmbedded ? 'w-full h-full' : 'w-[300px] h-[300px] md:w-[400px] md:h-[400px]'} cursor-grab active:cursor-grabbing flex items-center justify-center`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ perspective: hasSequence ? 'none' : '1200px' }}
      >
        {hasSequence ? (
           <img 
             src={images360Urls[frameIndex]} 
             alt="360 View" 
             className="w-full h-full object-contain pointer-events-none select-none" 
             draggable="false" 
           />
        ) : (
          <div 
            className="w-[300px] h-[300px] md:w-[360px] md:h-[360px] relative"
            style={{ 
              transformStyle: 'preserve-3d', 
              transform: `rotateY(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {/* Front */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-slate-200/20 overflow-hidden flex items-center justify-center" style={{ transform: 'translateZ(150px)' }}>
              {image ? <img src={image} alt="Front" className="w-full h-full object-cover" draggable="false" /> : null}
            </div>
            {/* Back */}
            <div className="absolute inset-0 bg-slate-100 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-slate-200/20 overflow-hidden flex items-center justify-center" style={{ transform: 'rotateY(180deg) translateZ(150px)' }}>
              <img src={image} alt="Back" className="w-full h-full object-cover opacity-50 grayscale" draggable="false" />
            </div>
            {/* Left */}
            <div className="absolute inset-0 bg-slate-50 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-slate-200/20 overflow-hidden flex items-center justify-center" style={{ transform: 'rotateY(-90deg) translateZ(150px)' }}>
              <img src={image} alt="Left" className="w-full h-full object-cover opacity-80" draggable="false" />
            </div>
            {/* Right */}
            <div className="absolute inset-0 bg-slate-50 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-slate-200/20 overflow-hidden flex items-center justify-center" style={{ transform: 'rotateY(90deg) translateZ(150px)' }}>
              <img src={image} alt="Right" className="w-full h-full object-cover opacity-80" draggable="false" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
