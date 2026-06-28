"use client";

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Video, 
  BookMarked, 
  FileText, 
  Instagram, 
  Share2, 
  BadgeHelp,
  CheckCircle,
  HelpCircle,
  Play
} from 'lucide-react';

interface ScriptResultProps {
  productName: string;
  hook: string;
  scriptBody: string;
  cta: string;
  variations: {
    alternate_hook_1?: string;
    alternate_cta_1?: string;
    alternate_hook_2?: string;
  };
  platform: string;
  onSaveToLibrary: () => void;
  onUseForVideo: () => void;
}

export default function ScriptResult({
  productName,
  hook,
  scriptBody,
  cta,
  variations,
  platform,
  onSaveToLibrary,
  onUseForVideo
}: ScriptResultProps) {
  const [activeTab, setActiveTab] = useState<'principal' | 'ganchos' | 'ctas'>('principal');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleLibrarySave = () => {
    onSaveToLibrary();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Build complete script format for copying
  const fullScriptText = `[PRODUTO: ${productName}]
[PLATAFORMA: ${platform.toUpperCase()}]

GANCHO INICIAL DE ATENÇÃO:
${hook}

CONTEÚDO / BENEFÍCIOS DO CRIATIVO:
${scriptBody}

CHAMADA PARA AÇÃO (CTA) FINAL:
${cta}`;

  const altHooksText = `GANCHO ALTERNATIVO 1:
${variations?.alternate_hook_1 || 'Experimente prender o público nos primeiros 3 segundos mostrando o produto em ação de cabeça para baixo!'}

GANCHO ALTERNATIVO 2:
${variations?.alternate_hook_2 || 'Comece dizendo: "Se você tem esse item em casa, assiste até o final, porque você está usando totalmente errado!"'}`;

  const altCtasText = `CTA ALTERNATIVO:
${variations?.alternate_cta_1 || 'Comente a palavra QUERO aqui nos comentários ou clique no link do perfil para cupom exclusivo de 20% off de hoje!'}`;

  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl space-y-6">
      
      {/* Result Card Header */}
      <div className="bg-gradient-to-r from-[#17152F] to-[#111118] p-5 sm:p-6 border-b border-[#1E1E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white font-extrabold shadow-md shadow-[#7C3AED]/15">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{productName}</h3>
              <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                {platform}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#8888AA] mt-0.5">Criativo validado gerado com sucesso!</p>
          </div>
        </div>

        {/* Global Copier Action buttons */}
        <div className="flex items-center gap-2">
          {copiedSection === 'completo' ? (
            <span className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Copiado!
            </span>
          ) : (
            <button
              onClick={() => handleCopyText(fullScriptText, 'completo')}
              className="px-3.5 py-2 bg-[#1E1E2E]/60 hover:bg-[#1E1E2E] border border-[#1E1E2E] hover:text-white text-[#8888AA] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar Todo Roteiro
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="px-5 sm:px-6">
        <div className="flex border-b border-[#1E1E2E]/60 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('principal')}
            className={`pb-3 pr-4 font-bold border-b-2 transition ${
              activeTab === 'principal' 
                ? 'border-[#7C3AED] text-white' 
                : 'border-transparent text-[#8888AA] hover:text-white'
            }`}
          >
            📋 Criativo Principal
          </button>
          <button
            onClick={() => setActiveTab('ganchos')}
            className={`pb-3 px-4 font-bold border-b-2 transition ${
              activeTab === 'ganchos' 
                ? 'border-[#7C3AED] text-white' 
                : 'border-transparent text-[#8888AA] hover:text-white'
            }`}
          >
            🪝 Ganchos Alternativos (Secundários)
          </button>
          <button
            onClick={() => setActiveTab('ctas')}
            className={`pb-3 px-4 font-bold border-b-2 transition ${
              activeTab === 'ctas' 
                ? 'border-[#7C3AED] text-white' 
                : 'border-transparent text-[#8888AA] hover:text-white'
            }`}
          >
            📢 CTAs de Fechamento
          </button>
        </div>
      </div>

      {/* Structured Copy display area */}
      <div className="px-5 sm:px-6 pb-6">
        {activeTab === 'principal' && (
          <div className="space-y-4">
            
            {/* Hook Section */}
            <div className="space-y-1.5 bg-[#0A0A0F]/65 border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#06B6D4] tracking-wide">
                <span>⚡ Gancho de Atenção (Primeiros 3 segundos):</span>
                <button 
                  onClick={() => handleCopyText(hook, 'hook')} 
                  className="p-1 hover:text-white text-[#8888AA] transition flex items-center gap-1 text-[9px]"
                >
                  {copiedSection === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'hook' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed font-sans italic">
                &ldquo;{hook}&rdquo;
              </p>
            </div>

            {/* Script body section */}
            <div className="space-y-1.5 bg-[#0A0A0F]/65 border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#7C3AED] tracking-wide">
                <span>📖 Roteiro Principal / Conteúdo e Diferenciais:</span>
                <button 
                  onClick={() => handleCopyText(scriptBody, 'body')} 
                  className="p-1 hover:text-white text-[#8888AA] transition flex items-center gap-1 text-[9px]"
                >
                  {copiedSection === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'body' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-[#D1D1E9] leading-relaxed whitespace-pre-line font-sans">
                {scriptBody}
              </p>
            </div>

            {/* Final CTA call to action section */}
            <div className="space-y-1.5 bg-[#0A0A0F]/65 border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#10B981] tracking-wide">
                <span>🛍️ Chamada Para Ação (Conversão / TikTok Shop link):</span>
                <button 
                  onClick={() => handleCopyText(cta, 'cta')} 
                  className="p-1 hover:text-white text-[#8888AA] transition flex items-center gap-1 text-[9px]"
                >
                  {copiedSection === 'cta' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'cta' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed font-sans">
                {cta}
              </p>
            </div>

          </div>
        )}

        {activeTab === 'ganchos' && (
          <div className="space-y-4">
            <div className="space-y-1.5 bg-[#0A0A0F]/65 border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#06B6D4] tracking-wide">
                <span>🪝 Variante de Gancho 1 (Curiosidade Aguda):</span>
                <button 
                  onClick={() => handleCopyText(variations?.alternate_hook_1 || '', 'v_hook1')} 
                  className="p-1 hover:text-white text-[#8888AA] transition flex items-center gap-1 text-[9px]"
                >
                  {copiedSection === 'v_hook1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'v_hook1' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white italic font-medium leading-relaxed">
                &ldquo;{variations?.alternate_hook_1 || 'Você não faz ideia de como eu consegui manter minha rotina saudável sem ficar lavando louça pesada o dia todo!'}&rdquo;
              </p>
            </div>

            <div className="space-y-1.5 bg-[#0A0A0F]/65 border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#06B6D4] tracking-wide">
                <span>🪝 Variante de Gancho 2 (Quebra de Padrão Comercial):</span>
                <button 
                  onClick={() => handleCopyText(variations?.alternate_hook_2 || '', 'v_hook2')} 
                  className="p-1 hover:text-white text-[#8888AA] transition flex items-center gap-1 text-[9px]"
                >
                  {copiedSection === 'v_hook2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'v_hook2' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white italic font-medium leading-relaxed">
                &ldquo;{variations?.alternate_hook_2 || 'Para de rolar esse feed! Se você quer facilidade para bater seus suplementos, esse mini acessório vai salvar sua vida!'}&rdquo;
              </p>
            </div>
          </div>
        )}

        {activeTab === 'ctas' && (
          <div className="space-y-4">
            <div className="space-y-1.5 bg-[#0A0A0F]/65 border border-[#1E1E2E] rounded-xl p-4">
              <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#10B981] tracking-wide">
                <span>📢 Variante de CTA 1 (Urgência com Cupom):</span>
                <button 
                  onClick={() => handleCopyText(variations?.alternate_cta_1 || '', 'v_cta1')} 
                  className="p-1 hover:text-white text-[#8888AA] transition flex items-center gap-1 text-[9px]"
                >
                  {copiedSection === 'v_cta1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSection === 'v_cta1' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                {variations?.alternate_cta_1 || 'Aproveite o frete grátis e a garantia de reembolso hoje mesmo clicando no botão amarelo da sacola do vídeo!'}
              </p>
            </div>
          </div>
        )}

        {/* Action button triggers for secondary workflows */}
        <div className="mt-8 pt-6 border-t border-[#1E1E2E]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Save to library database */}
          <button
            onClick={handleLibrarySave}
            disabled={saved}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              saved 
                ? 'bg-emerald-500/10 text-[#10B981] border-emerald-500/20' 
                : 'bg-[#111118] border-[#1E1E2E] hover:border-[#7C3AED]/40 text-[#8888AA] hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            {saved ? 'Salvo na Biblioteca!' : 'Salvar na Biblioteca Virais'}
          </button>

          {/* Prompt with video tool redirection */}
          <button
            onClick={onUseForVideo}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#10B981]/15 animate-bounce-slow"
          >
            <Video className="w-4 h-4" />
            Usar Roteiro para Gerar Vídeo IA
          </button>

        </div>
      </div>

    </div>
  );
}
