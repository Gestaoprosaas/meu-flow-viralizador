"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScreenAfiliados from '../../../src/components/ScreenAfiliados';

export default function NextAfiliadosPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);

  const fetchState = async () => {
    try {
      // Profile
      const pRes = await fetch('/api/profile');
      if (pRes.ok) {
        setProfile(await pRes.json());
      }

      // Referrals
      const rRes = await fetch('/api/afiliados');
      if (rRes.ok) {
        setReferrals(await rRes.json());
      }
    } catch (e) {
      console.error("Erro ao sincronizar dados do Afiliado:", e);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleAddMockReferral = async () => {
    try {
      const res = await fetch('/api/afiliados/mock', { method: 'POST' });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error("Erro ao adicionar indicação simulada:", e);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center p-12 text-[#8888AA] text-xs">
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4 animate-pulse" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Sincronizando painel de afiliado...</span>
      </div>
    );
  }

  return (
    <ScreenAfiliados
      profile={profile}
      referrals={referrals}
      onAddMockReferral={handleAddMockReferral}
      onRefresh={fetchState}
    />
  );
}
