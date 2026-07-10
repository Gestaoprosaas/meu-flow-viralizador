import React, { useEffect, useState } from 'react';
import { getOptimizedImageUrl } from './ImageWithSkeleton';

export const LazyVideo = ({
  src,
  poster,
  className = 'w-full h-full',
  loop = true,
  muted = true,
  playsInline = true,
  autoPlay,
  showSkeleton = true,
  ...props
}: any) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const isPosterVideo = poster && (
    poster.toLowerCase().endsWith('.mp4') || 
    poster.toLowerCase().endsWith('.webm') || 
    poster.toLowerCase().includes('.mp4?') || 
    poster.toLowerCase().includes('/videos/')
  );

  const posterOptimized = poster && !isPosterVideo ? getOptimizedImageUrl(poster, 400) : undefined;

  const handleLoaded = () => {
    setLoaded(true);
  };

  return (
    <div className={`relative ${className}`}>
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-inherit" />
      )}
      <video
        src={src}
        poster={posterOptimized}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        preload="auto"
        {...props}
        onLoadedData={handleLoaded}
        onCanPlay={handleLoaded}
        onPlay={handleLoaded}
        onPlaying={handleLoaded}
        onLoadedMetadata={handleLoaded}
        className={`w-full h-full object-cover transition-opacity duration-300 rounded-inherit ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
