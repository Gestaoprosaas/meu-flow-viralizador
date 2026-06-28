"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  User, 
  AlertTriangle, 
  HeartCrack,
  Flame,
  Volume2,
  Tv,
  Clock
} from 'lucide-react';

interface ScriptFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
  creditsLeft: number;
  onInsufficientCredits?: () => void;
}

export default function ScriptForm({ onSubmit, loading, creditsLeft, onInsufficientCredits }: ScriptFormProps) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mainPain, setMainPain] = useState('');
  const [mainDesire, setMainDesire] = useState('');
  const [tone, setTone] = useState('empolgante');
  const [platform, setPlatform] = useState('tiktok');
  const [duration, setDuration] = useState('30s');

   useEffect(() => {
    try {
      // Check query params first
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const qProdName = params.get('product_name') || params.get('name');
        const qDesc = params.get('product_description') || params.get('description');
        const qAudience = params.get('target_audience') || params.get('trend_reason') || params.get('reason');
        const qPain = params.get('main_pain') || params.get('pain');
        const qDesire = params.get('main_desire') || params.get('desire');

        if (qProdName) setProductName(decodeURIComponent(qProdName));
        if (qDesc) setDescription(decodeURIComponent(qDesc));
        if (qAudience) setTargetAudience(decodeURIComponent(qAudience));
        if (qPain) setMainPain(decodeURIComponent(qPain));
        if (qDesire) setMainDesire(decodeURIComponent(qDesire));
      }

      // Fallback/override with local storage
      const stored = localStorage.getItem('viral_library_prefill');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.productName) setProductName(parsed.productName);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.targetAudience) setTargetAudience(parsed.targetAudience);
        if (parsed.mainPain) setMainPain(parsed.mainPain);
        if (parsed.mainDesire) setMainDesire(parsed.mainDesire);
        if (parsed.tone) setTone(parsed.tone);
        if (parsed.platform) setPlatform(parsed.platform);
        
        // Remove so it doesn't prefill on refresh
        localStorage.removeItem('viral_library_prefill');
      }
    } catch (err) {
      console.error('Error prefilling form from library or query:', err);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creditsLeft <= 0) {
      if (onInsufficientCredits) {
        onInsufficientCredits();
      } else {
        alert('Você não possui créditos de Roteiro restantes. Faça upgrade para continuar!');
      }
      return;
    }
    onSubmit({
      productName,
      description,
      targetAudience,
      mainPain,
      mainDesire,
      tone,
      platform,
      duration
    });
  };

  const handlePreseedProduct = () => {
    setProductName('Mini Liquidificador Portátil Fresh Juice');
    setDescription('Liquidificador portátil super potente, à prova d\'água, recarregável via USB. Ideal para shakes e sucos rápidos na academia ou trabalho, com design ultra clean e tampa metálica.');
    setTargetAudience('Jovens adultos, praticantes de academia, profissionais ocupados que buscam alimentação saudável');
    setMainPain('Dificuldade de manter uma rotina saudável fora de casa, sujeira com liquidificadores trambolhos ou falta de tempo');
    setMainDesire('Praticidade em fazer shakes de proteína frescos em 30 segundos em qualquer lugar com um acessório estiloso');
    setTone('curioso');
    setPlatform('tiktok');
    setDuration('45s');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 sm:p-6 relative">
      <div className="flex items-center justify-between border-b border-[#1E1E2E]/60 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">Configurar Inteligência de Criação</h3>
        <button
          type="button"
          onClick={handlePreseedProduct}
          className="text-[11px] font-bold text-[#06B6D4] hover:underline flex items-center gap-1 bg-[#06B6D4]/5 border border-[#06B6D4]/10 rounded-lg px-2.5 py-1"
        >
          🪄 Preencher Exemplo Lucrativo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            Nome do Produto / Oferta
            <span className="text-[#7C3AED]">*</span>
          </label>
          <input
            type="text"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ex: Mini Liquidificador Portátil Fresh Juice"
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          />
        </div>

        {/* Product Description */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            Descrição Principal / Diferenciais
            <span className="text-[#7C3AED]">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o produto, benefícios, material e a oferta TikTok Shop que deseja divulgar..."
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition resize-none"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#06B6D4]" />
            Público-Alvo Específico
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Ex: Praticantes de academia focados em dieta"
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          />
        </div>

        {/* Main Pain point */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <HeartCrack className="w-3.5 h-3.5 text-red-400" />
            Dor Principal / Frustração
          </label>
          <input
            type="text"
            value={mainPain}
            onChange={(e) => setMainPain(e.target.value)}
            placeholder="Ex: Preguiça de lavar liquidificador convencional"
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          />
        </div>

        {/* Desired benefit */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            Desejo Principal / Sonho de Consumo
          </label>
          <input
            type="text"
            value={mainDesire}
            onChange={(e) => setMainDesire(e.target.value)}
            placeholder="Ex: Fazer shakes frescos chiques com um clique"
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-[#7C3AED]" />
            Tom de Comunicação
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          >
            <option value="empolgante">💥 Empolgante / Energético</option>
            <option value="curioso">🤔 Curioso / Intriga Secreta</option>
            <option value="cientifico">🔬 Técnico / Científico / Benefícios</option>
            <option value="narrativo">📖 Storytelling / Narrativa Pessoal</option>
            <option value="ironico">😏 Irônico / Quebra de Padrão</option>
          </select>
        </div>

        {/* Video Platform destination */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-[#06B6D4]" />
            Plataforma do Vídeo
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          >
            <option value="tiktok">🎵 TikTok Shop Ad</option>
            <option value="instagram">📸 Instagram Reels</option>
            <option value="youtube">📺 YouTube Shorts</option>
          </select>
        </div>

        {/* Estimated Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#10B981]" />
            Duração Recomendada
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          >
            <option value="30s">⚡ Flash (30 segundos)</option>
            <option value="45s">⏳ Médio (45 segundos)</option>
            <option value="60s">🚀 Completo (60 segundos)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || creditsLeft <= 0}
        className="w-full py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/20 disabled:opacity-40"
      >
        <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
        {loading ? 'Sincronizando Cópias...' : 'Gerar Roteiro Viral (Debita 1 Crédito)'}
      </button>

      {creditsLeft <= 0 && (
        <p className="text-[10px] text-center text-red-400 font-semibold animate-pulse">
          ⚠️ Você atingiu seu limite de Roteiro IA grátis. Faça upgrade para gerar mais!
        </p>
      )}
    </form>
  );
}
