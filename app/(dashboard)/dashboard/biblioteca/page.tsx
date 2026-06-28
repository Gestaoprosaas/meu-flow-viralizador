"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ScreenBiblioteca from '../../../../src/components/ScreenBiblioteca';

export default function NextBibliotecaPage() {
  const router = useRouter();

  const handleNextNavigate = (path: string) => {
    // Map SPA paths to Next.js dashboard routes
    if (path === '/roteiros') {
      router.push('/dashboard/roteiros');
    } else if (path === '/videos') {
      router.push('/dashboard/videos');
    } else if (path === '/imagens') {
      router.push('/dashboard/imagens');
    } else {
      router.push(path);
    }
  };

  return <ScreenBiblioteca onNavigate={handleNextNavigate} />;
}
