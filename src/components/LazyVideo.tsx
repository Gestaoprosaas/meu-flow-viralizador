import React, { useEffect, useRef, useState } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIsIntersecting(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (isIntersecting) return;

    // Sem timer: deixar o IntersectionObserver decidir quando carregar.
    // O timer antigo fazia TODOS os vídeos carregarem ao mesmo tempo após o tempo limite.
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
        threshold: 0.01,
        rootMargin: '200px' // pré-carrega 200px antes de entrar na tela
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
      {showSkeleton && !loaded && (
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
        preload="none"
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
