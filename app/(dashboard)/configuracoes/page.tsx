"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScreenConfiguracoes from '../../../src/components/ScreenConfiguracoes';

export default function NextConfiguracoesPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (e) {
      console.error("Erro ao sincronizar perfil Next.js:", e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (name: string, email: string) => {
    try {
      // Save changes back to server database state
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (e) {
      console.error("Erro ao atualizar perfil Next.js:", e);
    }
  };

  const handleResetDatabase = async () => {
    try {
      // Trigger database / credits reset
      const res = await fetch('/api/profile/credits/reset', { method: 'POST' });
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (e) {
      console.error("Erro ao resetar bases Next.js:", e);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-12 text-[#8888AA] text-xs">
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4 animate-pulse" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Sincronizando painel do assinante...</span>
      </div>
    );
  }

  const handleNavigate = (path: string) => {
    // Standard folder layout path to url conversions inside Next.js pages
    if (path === '/upgrade') {
      router.push('/upgrade');
    } else if (path === '/configuracoes') {
      router.push('/configuracoes');
    } else {
      router.push(path);
    }
  };

  return (
    <ScreenConfiguracoes
      profile={profile}
      onUpdateProfile={handleUpdateProfile}
      onResetDatabase={handleResetDatabase}
      onNavigate={handleNavigate}
    />
  );
}
