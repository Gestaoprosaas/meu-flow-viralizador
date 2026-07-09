import React, { useEffect, useRef, useState } from 'react';
import { getOptimizedImageUrl } from './ImageWithSkeleton';

export const LazyVideo = ({ src, poster, className = 'w-full h-full', loop = true, muted = true, playsInline = true, autoPlay, ...props }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Safety fallback: if IntersectionObserver is not supported, or does not fire in 300ms
    // inside the nested iframe, we force loading to begin.
    const timer = setTimeout(() => {
      setIsIntersecting(true);
    }, 300);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            clearTimeout(timer);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.01,
        rootMargin: '300px' // Começa a carregar o vídeo 300px antes de entrar na tela (ideal para mobile!)
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Forçar reprodução no mobile assim que o vídeo estiver visível e marcado como autoPlay
  useEffect(() => {
    if (isIntersecting && autoPlay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Tratar restrição de interação do navegador silenciosamente
        });
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
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-inherit" />
      )}
      <video
        ref={videoRef}
        src={isIntersecting && src ? src : undefined}
        poster={posterOptimized}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        {...props}
        preload="auto"
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
