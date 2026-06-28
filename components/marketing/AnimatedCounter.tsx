import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number; // in ms
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = target;
    const range = end - start;
    const increment = Math.ceil(range / (duration / 16)); // 16ms approx frame
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  };

  return (
    <span ref={elementRef} id="animated-counter-span-alt">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}
