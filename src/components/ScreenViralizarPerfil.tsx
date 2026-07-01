import React from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

export default function ScreenViralizarPerfil() {
  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0F]/90 border border-[#1E1E2E] p-4 sm:p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-[#FE2C55]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#FE2C55]/15 p-1.5 rounded-xl border border-[#FE2C55]/30">
              <Flame className="w-5 h-5 text-[#FE2C55] animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Viralizar Perfil 🚀</h1>
              <span className="text-[10px] sm:text-xs font-bold text-[#8888AA]">Ganhe seguidores orgânicos para desbloquear o TikTok Shop (Meta: 2.000 seguidores)</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAINTENANCE STATE */}
      <div className="bg-[#111118]/80 border border-[#1E1E2E] rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)] mb-2">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Módulo em Manutenção</h2>
          <p className="text-sm text-[#8888AA] leading-relaxed">
            Estamos preparando novidades incríveis para turbinar o crescimento do seu perfil. 
            Esta funcionalidade está temporariamente indisponível enquanto realizamos melhorias no sistema.
          </p>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/25 rounded-full">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Voltaremos em Breve</span>
        </div>
      </div>

    </div>
  );
}
