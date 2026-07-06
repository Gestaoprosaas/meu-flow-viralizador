import React, { useEffect, useRef, useState } from 'react';
import { getOptimizedImageUrl } from './ImageWithSkeleton';

export const LazyVideo = ({ src, poster, className = 'w-full h-full', loop = true, muted = true, playsInline = true, autoPlay, ...props }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const posterOptimized = poster ? getOptimizedImageUrl(poster, 400) : undefined;

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-inherit" />
      )}
      <video
        ref={videoRef}
        src={isIntersecting ? src : ''}
        poster={posterOptimized}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        preload="none"
        onCanPlay={(e) => {
          setLoaded(true);
          if (autoPlay) {
            e.currentTarget.play().catch(() => {});
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 rounded-inherit ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};
