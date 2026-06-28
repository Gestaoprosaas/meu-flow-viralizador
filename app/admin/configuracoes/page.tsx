"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Key, Globe, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminConfiguracoesPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    openai_api_key: '',
    kling_api_key: '',
    elevenlabs_api_key: '',
    resend_api_key: '',
    supabase_url: '',
    supabase_anon_key: ''
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) setSettings(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccessMsg('Chaves de ambiente salvas na tabela public.settings!');
      } else {
        setErrorMsg('Erro de confirmação de persistência.');
      }
    } catch (err) {
      setErrorMsg('Erro de rede.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-red-500" />
          Chaves do Sistema & Conexões
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Configurações gerais e credenciais salvas no banco Supabase.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-xs">Aguarde...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
          
          <div className="flex items-center gap-2 border-b border-[#1E1E2E] pb-3 text-red-500">
            <Key className="w-4 h-4" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider">Chaves de API (Seguras e Ocultas)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="space-y-1">
              <label className="text-[#8888AA] block font-semibold">OpenAI API Key</label>
              <input
                type="password"
                value={settings.openai_api_key || ''}
                onChange={(e) => setSettings({...settings, openai_api_key: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA] block font-semibold">Resend Email API Key</label>
              <input
                type="password"
                value={settings.resend_api_key || ''}
                onChange={(e) => setSettings({...settings, resend_api_key: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA] block font-semibold">Kling AI Video API Key</label>
              <input
                type="password"
                value={settings.kling_api_key || ''}
                onChange={(e) => setSettings({...settings, kling_api_key: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA] block font-semibold">ElevenLabs Audio API Key</label>
              <input
                type="password"
                value={settings.elevenlabs_api_key || ''}
                onChange={(e) => setSettings({...settings, elevenlabs_api_key: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 col-span-2 border-t border-[#1E1E2E]/50 pt-3 flex items-center gap-1.5 text-cyan-400 font-bold">
              <Globe className="w-4 h-4" />
              <span>Conexão Supabase</span>
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA] block font-semibold">Supabase URL</label>
              <input
                type="text"
                value={settings.supabase_url || ''}
                onChange={(e) => setSettings({...settings, supabase_url: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA] block font-semibold">Supabase Public Anon Key</label>
              <input
                type="text"
                value={settings.supabase_anon_key || ''}
                onChange={(e) => setSettings({...settings, supabase_anon_key: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-red-500 focus:outline-none text-[11px]"
              />
            </div>

          </div>

          <div className="flex justify-end pt-3 border-t border-[#1E1E2E]/40">
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 transition rounded-xl font-bold text-white flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              Sincronizar Settings
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
