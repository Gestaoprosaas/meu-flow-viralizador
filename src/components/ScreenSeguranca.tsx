import React, { useEffect, useState } from 'react';
import { Shield, Lock, Zap, BarChart, Crosshair, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ScreenSegurancaProps {
  onNavigate: (path: string) => void;
}

export default function ScreenSeguranca({ onNavigate }: ScreenSegurancaProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`space-y-8 sm:space-y-12 pb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      
      {/* 1. Hero Section */}
      <div className="text-center space-y-4 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-[#FE2C55] text-xs font-black uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5" />
          Sua Segurança é Nossa Prioridade
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          ViralSeller — <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE2C55] to-[#813EF6]">
            Sua Plataforma Segura
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-[#8888AA] text-sm sm:text-base leading-relaxed px-4">
          Construído com tecnologia sólida para criadores e afiliados do TikTok Shop que levam resultados a sério.
        </p>
      </div>

      {/* 2. Nosso Compromisso */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-6 sm:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE2C55]/5 rounded-full blur-3xl group-hover:bg-[#FE2C55]/10 transition-colors duration-500 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
          <div className="shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#FE2C55]/20 to-[#813EF6]/20 rounded-full flex items-center justify-center border border-[#1E1E2E] p-4 shadow-xl shadow-[#FE2C55]/5">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-[#FE2C55]" />
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Compromisso com Você</h2>
            <p className="text-[#8888AA] text-sm sm:text-base leading-relaxed max-w-3xl">
              Nossa plataforma é independente e foi desenvolvida exclusivamente para criadores e afiliados do TikTok Shop. Nosso foco é fornecer ferramentas inteligentes, geração de prompts de avatar avançados, descoberta de produtos em alta e recursos de criação de conteúdo para maximizar suas vendas de forma ética e segura.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-start gap-3 sm:gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#06060B] border border-[#1E1E2E] px-4 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tecnologia Confiável
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#06060B] border border-[#1E1E2E] px-4 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Plataforma Segura
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#06060B] border border-[#1E1E2E] px-4 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Comprometidos com Você
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Grid 2x2 Por que confiar */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white">Por que confiar na ViralSeller</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-[#111118] border border-[#1E1E2E] p-6 rounded-3xl hover:border-[#FE2C55]/30 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-[#FE2C55]/10 flex items-center justify-center text-[#FE2C55] mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-2">Ferramentas Sempre Atualizadas</h3>
            <p className="text-[#8888AA] text-xs sm:text-sm leading-relaxed">
              Produtos em alta sincronizados com o mercado do TikTok Shop para você nunca ficar para trás.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-[#111118] border border-[#1E1E2E] p-6 rounded-3xl hover:border-purple-500/30 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-2">Seus Dados Protegidos</h3>
            <p className="text-[#8888AA] text-xs sm:text-sm leading-relaxed">
              Autenticação segura via Supabase, nenhum dado sensível armazenado localmente no dispositivo.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111118] border border-[#1E1E2E] p-6 rounded-3xl hover:border-blue-500/30 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <BarChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-2">Inteligência de Conteúdo</h3>
            <p className="text-[#8888AA] text-xs sm:text-sm leading-relaxed">
              Prompts gerados com base em tendências reais para maximizar seu alcance e conversão.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#111118] border border-[#1E1E2E] p-6 rounded-3xl hover:border-emerald-500/30 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Crosshair className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-white mb-2">Suporte Dedicado</h3>
            <p className="text-[#8888AA] text-xs sm:text-sm leading-relaxed">
              Plataforma em constante evolução com base no feedback real dos criadores.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Como protegemos você - Linha do tempo horizontal */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-6 sm:p-10 text-center space-y-8">
        <h2 className="text-xl sm:text-2xl font-black text-white">Como protegemos você</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1E1E2E] to-transparent -translate-y-1/2 z-0" />
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-3 z-10 w-full md:w-1/3 px-4">
            <div className="w-12 h-12 rounded-full bg-[#06060B] border border-[#1E1E2E] flex items-center justify-center text-[#FE2C55] shadow-lg">
              <Lock className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
              Acesso seguro por email e senha com autenticação Supabase
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-3 z-10 w-full md:w-1/3 px-4">
            <div className="w-12 h-12 rounded-full bg-[#06060B] border border-[#1E1E2E] flex items-center justify-center text-[#813EF6] shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
              Seus dados e criações ficam apenas na sua conta, sem compartilhamento
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-3 z-10 w-full md:w-1/3 px-4">
            <div className="w-12 h-12 rounded-full bg-[#06060B] border border-[#1E1E2E] flex items-center justify-center text-emerald-400 shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
              Atualizações automáticas de produtos e ferramentas sem interrupção
            </p>
          </div>
        </div>
      </div>

      {/* 5. Banner Final CTA */}
      <div className="bg-gradient-to-r from-[#FE2C55]/10 to-[#813EF6]/10 border border-[#FE2C55]/20 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Pronto para criar conteúdo que vende de verdade?</h2>
          
          <button 
            onClick={() => onNavigate('/produtos')}
            className="inline-flex items-center gap-2 bg-[#FE2C55] hover:bg-[#ff3d64] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all transform hover:-translate-y-1 shadow-lg shadow-[#FE2C55]/25"
          >
            Ir para Produtos em Alta <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
