import React, { useState } from 'react';

export const getOptimizedImageUrl = (url: string, width: number = 400) => {
  if (!url || !url.includes('supabase.co')) return url;
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('width', width.toString());
    urlObj.searchParams.set('quality', '80');
    urlObj.searchParams.set('format', 'webp');
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};

export const ImageWithSkeleton = ({ src, alt, className = '', containerClassName = 'w-full h-full', width = 400, ...props }: any) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const finalSrc = getOptimizedImageUrl(src, width);

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
          src={finalSrc}
          alt={alt || ''}
          loading="lazy"
          decoding="async"
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover rounded-inherit`}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
          {...props}
        />
      )}
    </div>
  );
};
