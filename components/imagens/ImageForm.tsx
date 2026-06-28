"use client";

import React, { useState } from 'react';
import { Sparkles, Palette, Image as ImageIcon, Layers, HelpCircle } from 'lucide-react';

interface ImageFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
  creditsLeft: number;
  onInsufficientCredits?: () => void;
}

export default function ImageForm({ onSubmit, loading, creditsLeft, onInsufficientCredits }: ImageFormProps) {
  const [productName, setProductName] = useState('');
  const [style, setStyle] = useState('Lifestyle');
  const [platform, setPlatform] = useState('tiktok');
  const [dominantColor, setDominantColor] = useState('neon cyan');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creditsLeft <= 0) {
      if (onInsufficientCredits) {
        onInsufficientCredits();
      } else {
        alert('Você não possui créditos de imagem restantes. Faça upgrade para continuar!');
      }
      return;
    }
    onSubmit({
      productName,
      style,
      platform,
      dominantColor,
      notes,
      quantity
    });
  };

  const handlePreseed = () => {
    setProductName('Garrafa Térmica Inteligente com Display de Temperatura LED');
    setStyle('Lifestyle');
    setPlatform('instagram');
    setDominantColor('black and luxury warm orange');
    setNotes('A garrafa deve estar sobre uma mesa de escritório moderna, com algumas gotas de água condensada na superfície externa, transmitindo frescor. Display LED mostrando 5°C bem nítido.');
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 sm:p-6 relative">
      <div className="flex items-center justify-between border-b border-[#1E1E2E]/60 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">Criar Imagem de Alta Conversão</h3>
        <button
          type="button"
          onClick={handlePreseed}
          className="text-[11px] font-bold text-[#06B6D4] hover:underline flex items-center gap-1 bg-[#06B6D4]/5 border border-[#06B6D4]/10 rounded-lg px-2.5 py-1"
        >
          ✨ Preencher Exemplo de Produto
        </button>
      </div>

      <div className="space-y-4">
        {/* Product / Offer description */}
        <div className="space-y-1.5Box">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            Nome do Produto / Cena Desejada
            <span className="text-[#7C3AED]">*</span>
          </label>
          <input
            type="text"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ex: Garrafa térmica com display LED inteligente"
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          />
        </div>

        {/* Style Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
            Estilo Visual
          </label>
          <select
            value={style}
            onChange={(e: any) => setStyle(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
          >
            <option value="Lifestyle">🌿 Lifestyle (Uso Real no dia a dia)</option>
            <option value="Estúdio">📸 Estúdio (Fundo limpo e iluminação profissional)</option>
            <option value="Influenciador">🤳 Influenciador (Estilo selfie segurando produto)</option>
            <option value="Banner">🎨 Banner (Promocional para e-commerce)</option>
            <option value="Thumbnail">🎬 Thumbnail (Focada em cliques para YouTube/TikTok)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Platform destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
              Plataforma Principal
            </label>
            <select
              value={platform}
              onChange={(e: any) => setPlatform(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
            >
              <option value="tiktok">🎵 TikTok shop / Criativo Vertical</option>
              <option value="instagram">📸 Instagram Reels / Stories</option>
              <option value="facebook">👥 Facebook Ads / Feed Quadrado</option>
              <option value="youtube">📺 YouTube Thumbnail (16:9)</option>
            </select>
          </div>

          {/* Color palette */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-[#06B6D4]" />
              Cor Predominante / Paleta
            </label>
            <input
              type="text"
              value={dominantColor}
              onChange={(e) => setDominantColor(e.target.value)}
              placeholder="Ex: Neon Azul, Clean Branco, Luxo Preto"
              className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition"
            />
          </div>
        </div>

        {/* Notes & Special instructions */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            Recomendações e Observações Extras
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Abaixo do produto, adicione luzes escuras... Foque na alta resolução e realismo das texturas..."
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/45 outline-none transition resize-none"
          />
        </div>

        {/* Quantity Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#10B981]" />
            Quantidade de Imagens
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 4].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setQuantity(num)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  quantity === num
                    ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white'
                    : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                }`}
              >
                {num === 1 ? '1 Imagem (1 d.)' : `${num} Imagens (${num} d.)`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || creditsLeft <= 0}
        className="w-full py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/20 disabled:opacity-40"
      >
        <Sparkles className="w-4 h-4 animate-pulse text-yellow-300" />
        {loading ? 'Moldando Criativos...' : `Gerar Criativo Realista (Debita ${quantity} d.)`}
      </button>

      {creditsLeft < quantity && creditsLeft > 0 && (
        <p className="text-[10px] text-center text-red-400 font-semibold animate-pulse">
          ⚠️ Créditos insuficientes para gerar a quantidade selecionada. Escolha menos imagens.
        </p>
      )}

      {creditsLeft <= 0 && (
        <p className="text-[10px] text-center text-red-400 font-semibold animate-pulse">
          ⚠️ Você atingiu o limite de imagens gratuitas. Faça upgrade do seu plano para gerar criativos!
        </p>
      )}
    </form>
  );
}
