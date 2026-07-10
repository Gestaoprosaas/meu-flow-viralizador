import React, { useState, useEffect } from 'react';

// Bypassing Supabase image transformation as it causes 7-10s delays on cold starts
// and fails on videos causing fallback delays. 
export const getOptimizedImageUrl = (url: string, width: number = 400) => {
  return url;
};

export const ImageWithSkeleton = ({ src, alt, className = '', containerClassName = 'w-full h-full', width = 400, onError, onLoad, ...props }: any) => {
  const isLocal = src && (src.startsWith('data:') || src.startsWith('blob:'));
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setLoaded(false); // sempre exibe skeleton até a imagem estar pronta
    setError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleError = (e: any) => {
    setError(true);
    setLoaded(true);
    if (onError) onError(e);
  };

  const handleLoad = (e: any) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  const isVideo = src && (
    src.toLowerCase().endsWith('.mp4') || 
    src.toLowerCase().endsWith('.webm') || 
    src.toLowerCase().includes('.mp4?') || 
    src.toLowerCase().includes('/videos/')
  );

  return (
    <div className={`relative ${containerClassName}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-inherit" />
      )}
      {error && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center rounded-inherit">
          <span className="text-zinc-600 text-[10px]">Indisponível</span>
        </div>
      )}
      {src && isVideo && (
        <video
          src={currentSrc}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover rounded-inherit`}
          onLoadedData={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      {src && !isVideo && (
        <img
          src={currentSrc}
          alt={alt || ''}
          loading="eager"
          decoding="sync"
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover rounded-inherit`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};
