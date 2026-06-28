import React, { useEffect, useRef, useState } from 'react';

export default function GlassmorphicLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 }); // Target mouse position
  const [isVisible, setIsVisible] = useState(false);

  // Define 8 tracking points for our buttery-smooth tapering comet tail
  const TRAIL_LENGTH = 6;
  const points = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );

  // References to individual DOM nodes to avoid React state re-renders at 60+ FPS
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        setIsVisible(true);
        // Instant snap on first move so trail doesn't glide in from the corner
        points.current.forEach((pt) => {
          pt.x = e.clientX;
          pt.y = e.clientY;
        });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;

    const updateLoop = () => {
      // Step 1: Head moves towards the target cursor with medium responsiveness (0.28)
      const head = points.current[0];
      head.x += (pos.current.x - head.x) * 0.28;
      head.y += (pos.current.y - head.y) * 0.28;

      // Step 2: Each trailing dot chases the one right before it with a smooth lag (0.22)
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const prev = points.current[i - 1];
        const curr = points.current[i];
        
        // This math is linear interpolation (lerp). It gives the organic "fluid tail" effect.
        curr.x += (prev.x - curr.x) * 0.22;
        curr.y += (prev.y - curr.y) * 0.22;
      }

      // Step 3: Draw each node by updating translate3d directly
      points.current.forEach((pt, i) => {
        const el = nodeRefs.current[i];
        if (el) {
          // Subtract half the diameter of current node to keep it centered perfectly
          const size = getParticleSize(i);
          const radius = size / 2;
          el.style.transform = `translate3d(${pt.x - radius}px, ${pt.y - radius}px, 0)`;
        }
      });

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    updateLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  // Taper sizes dynamically from head to tail (e.g. 8px down to 2px)
  const getParticleSize = (index: number) => {
    return Math.max(2, 7 - index * 0.95);
  };

  // Give each point a slightly offset color/gradient to create chromatic aberration and dynamic exclusion blending
  const getParticleColor = (index: number) => {
    if (index === 0) return 'rgba(255, 255, 255, 0.45)'; // Main bright cursor point
    // High-contrast neon gradients with extremely low opacity
    const hue = (index * 32) % 360;
    return `hsla(${hue}, 70%, 75%, ${Math.max(0.04, (1 - index / TRAIL_LENGTH) * 0.22)})`;
  };

  return (
    <div
      ref={containerRef}
      className="hidden md:block pointer-events-none fixed inset-0"
      style={{
        zIndex: 9999, // Floating on top of the UI
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: 'none',
      }}
      id="glassmorphic-lens-trail"
    >
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
        const size = getParticleSize(i);
        const color = getParticleColor(i);
        const isHead = i === 0;

        return (
          <div
            key={i}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: isHead ? 'white' : color,
              // mix-blend-mode: exclusion or difference creates the majestic "following colors underneath" effect
              mixBlendMode: isHead ? 'normal' : 'exclusion',
              pointerEvents: 'none',
              boxShadow: isHead
                ? '0 0 6px rgba(255, 255, 255, 0.4)'
                : `0 0 3px ${color}`,
              border: isHead 
                ? '1px solid rgba(255, 255, 255, 0.4)' 
                : '1px solid rgba(255, 255, 255, 0.08)',
              // Add a bit of glassmorphic glow effect for secondary elements
              backdropFilter: !isHead && i < 3 ? 'blur(2px) brightness(1.1)' : 'none',
              WebkitBackdropFilter: !isHead && i < 3 ? 'blur(2px) brightness(1.1)' : 'none',
            }}
            className="will-change-transform"
          />
        );
      })}
    </div>
  );
}
