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
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsIntersecting(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (isIntersecting) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0,
        rootMargin: '1000px' // Load 1000px before entering viewport
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isIntersecting, src]);

  // Forçar reprodução no mobile assim que o vídeo estiver visível e marcado como autoPlay
  useEffect(() => {
    if (isIntersecting && autoPlay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isIntersecting, autoPlay]);

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
        ref={videoRef}
        src={isIntersecting ? src : undefined}
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
