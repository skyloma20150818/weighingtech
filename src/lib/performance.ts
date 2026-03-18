export function reportWebVitals(metric: any) {
  console.log('[Web Vitals]', metric);
  // 可以发送到分析服务，如 Google Analytics
}

export function measurePerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // 测量关键性能指标
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('[Performance]', entry.name, entry.startTime);
      }
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.error('PerformanceObserver error:', e);
    }
  }
}

export function measureImageLoadTime(imageUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    const startTime = performance.now();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };
    
    img.onerror = () => {
      resolve(-1);
    };
    
    img.src = imageUrl;
  });
}
