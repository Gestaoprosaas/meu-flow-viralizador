import React, { useState, useEffect } from 'react';

export const getOptimizedImageUrl = (url: string, width: number = 400) => {
  if (!url || !url.includes('supabase.co')) return url;
  try {
    let optimizedUrl = url;
    if (url.includes('/storage/v1/object/public/')) {
      optimizedUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
    }
    const urlObj = new URL(optimizedUrl);
    urlObj.searchParams.set('width', width.toString());
    urlObj.searchParams.set('quality', '75');
    urlObj.searchParams.set('format', 'webp');
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};

export const ImageWithSkeleton = ({ src, alt, className = '', containerClassName = 'w-full h-full', width = 400, onError, onLoad, ...props }: any) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [triedOriginal, setTriedOriginal] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => getOptimizedImageUrl(src, width));

  useEffect(() => {
    setLoaded(false);
    setError(false);
    setTriedOriginal(false);
    setCurrentSrc(getOptimizedImageUrl(src, width));
  }, [src, width]);

  const handleError = (e: any) => {
    const original = src;
    if (!triedOriginal && original && currentSrc !== original) {
      setTriedOriginal(true);
      setCurrentSrc(original);
    } else {
      setError(true);
      setLoaded(true);
      if (onError) onError(e);
    }
  };

  const handleLoad = (e: any) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

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
      {src && (
        <img
          src={currentSrc}
          alt={alt || ''}
          loading="lazy"
          decoding="async"
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover rounded-inherit`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};
