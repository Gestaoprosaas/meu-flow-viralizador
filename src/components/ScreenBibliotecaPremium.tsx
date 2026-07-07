import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Crown, ArrowRight, Play, Video, ExternalLink } from 'lucide-react';

interface PromptCard {
  id: string;
  titulo: string;
  categoria: string;
  prompt: string;
  icone: string;
  previewUrl?: string; // Link de pré-visualização cadastrado no código
}

const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  
  // Se contiver extensões de imagem comuns, com certeza NÃO é um vídeo
  if (
    lower.includes('.png') ||
    lower.includes('.jpg') ||
    lower.includes('.jpeg') ||
    lower.includes('.webp') ||
    lower.includes('.gif') ||
    lower.includes('.svg') ||
    lower.includes('.heic') ||
    lower.includes('.avif')
  ) {
    return false;
  }
  
  // Se contiver extensões de vídeo comuns, com certeza é um vídeo
  if (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?') ||
    lower.includes('.mov?') ||
    lower.includes('.m4v?') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('youtube-nocookie.com')
  ) {
    return true;
  }
  
  // Caso de fallback: se não tiver extensão explícita, mas for do supabase, assumir que é imagem
  return false;
};

const PROMPTS_PREMIUM: PromptCard[] = [
  {
    id: '1',
    titulo: 'Ambiente / Avatar / Camiseta',
    categoria: 'VIRAIS',
    icone: '🔥',
    prompt: "USE SEU AMBIENTE, AVATAR E CAMISETA.\n\nUse the first image ONLY as an environment + pose reference.\nUse the second image as the ONLY avatar identity reference.\nUse the third image ONLY as the TOP clothing/product reference.\nUse the fourth image ONLY as the BOTTOM clothing/product reference.\n\nIMPORTANT CONTEXT:\nThe first image may contain a model.\nThat model must be used ONLY to extract:\n• Camera angle\n• Body orientation\n• Pose\n• Distance to camera\n• Framing\n• Perspective\nThe identity of the model in the first image must NEVER be reused.\n\n────────────────────────\nENVIRONMENT + POSE EXTRACTION (CRITICAL)\n────────────────────────\n• Extract ONLY the environment from Image 1.\n• Completely remove the original model from Image 1.\n• The environment must look originally empty.\n\nFROM IMAGE 1, PRESERVE EXACTLY:\n• Camera angle\n• Camera height\n• Camera tilt\n• Distance from camera to subject\n• Body orientation\n• Pose silhouette\n• Framing and crop\n• Perspective and depth\n• Lighting direction and softness\n\n────────────────────────\nAVATAR INSERTION (CRITICAL)\n────────────────────────\n• Insert the avatar from Image 2 into the extracted environment.\n• Keep ONLY the identity from Image 2.\n• Do NOT reuse the woman from Image 1.\n• Match the exact pose and framing from Image 1.\n• Keep the arms naturally straight and relaxed.\n\n────────────────────────\nTOP PRODUCT APPLICATION (IMAGE 3)\n────────────────────────\n• Apply ONLY the product/clothing from Image 3.\n• Replicate it exactly as shown.\n• Preserve the exact fit, positioning, proportions, and style.\n• If it sits higher or lower on the body, preserve that exact placement.\n• No creative changes.\n\n────────────────────────\nBOTTOM PRODUCT APPLICATION (IMAGE 4)\n────────────────────────\n• Apply ONLY the product/clothing from Image 4.\n• Replicate it exactly as shown.\n• Preserve the exact waist height, fit, proportions, and style.\n• If it is low waist, keep it low waist.\n• If it is high waist, keep it high waist.\n• No creative changes.\n\n────────────────────────\nLIGHTING & INTEGRATION\n────────────────────────\n• Match environment lighting exactly.\n• Natural shadows consistent with Image 1.\n• Ultra realistic photographic realism.\n• No CGI look.\n• No beauty filter.\n• No stylization.\n• No text or watermarks.\n\n────────────────────────\nFINAL RESULT\n────────────────────────\nA realistic scene where:\n• Image 1 = environment + pose.\n• Image 2 = the ONLY avatar identity.\n• Image 3 = top product.\n• Image 4 = bottom product.\n\nThe final image must look like the woman from Image 2 was originally photographed in the environment from Image 1 while wearing the exact products from Images 3 and 4",
    previewUrl: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/BIBLIOTECA%20PREMIUM/ambiente%20avatar%20camiseta.png"
  },
  {
    id: '2',
    titulo: 'Ambiente / Modelo / Produto 1 x Produto 2',
    categoria: 'VIRAIS',
    icone: '⭐',
    prompt: "Use the first image ONLY as an environment + pose reference.\nUse the second image as the ONLY avatar identity reference.\nUse the third image as the ONLY TOP clothing/product reference.\nUse the fourth image as the ONLY BOTTOM clothing/product reference.\n\nIMPORTANT CONTEXT:\nThe first image may contain a model.\nThat model must be used ONLY to extract:\n• Camera angle\n• Body orientation\n• Pose\n• Distance to camera\n• Framing\n• Perspective\nThe identity of the model in the first image must NEVER be reused.\n\n────────────────────────\nENVIRONMENT + POSE EXTRACTION (CRITICAL)\n────────────────────────\n• Extract ONLY the environment from Image 1.\n• Completely remove the original model from Image 1.\n• The environment must look originally empty.\n\nFROM IMAGE 1, PRESERVE EXACTLY:\n• Camera angle\n• Camera height\n• Camera tilt\n• Distance from camera to subject\n• Body orientation\n• Pose silhouette\n• Framing and crop\n• Perspective and depth\n• Lighting direction and softness.\n\n────────────────────────\nAVATAR INSERTION (CRITICAL)\n────────────────────────\n• Insert the avatar from Image 2 into the extracted environment.\n• Keep ONLY the identity from Image 2.\n• Do NOT reuse the woman from Image 1.\n• Match the exact pose and framing from Image 1.\n• Keep the arms naturally straight and relaxed.\n\n────────────────────────\nTOP PRODUCT APPLICATION (IMAGE 3)\n────────────────────────\n• Apply ONLY the product/clothing from Image 3.\n• Replicate it exactly as shown.\n• Preserve the exact fit, positioning, proportions, and style.\n• If it sits higher or lower on the body, preserve that exact placement.\n• No creative changes.\n\n────────────────────────\nBOTTOM PRODUCT APPLICATION (IMAGE 4)\n────────────────────────\n• Apply ONLY the product/clothing from Image 4.\n• Replicate it exactly as shown.\n• Preserve the exact waist height, fit, proportions, and style.\n• If it is low waist, keep it low waist.\n• If it is high waist, keep it high waist.\n• No creative changes.\n\n────────────────────────\nLIGHTING & INTEGRATION\n────────────────────────\n• Match environment lighting exactly.\n• Natural shadows consistent with Image 1.\n• Ultra realistic photographic realism.\n• No CGI look.\n• No beauty filter.\n• No stylization.\n• No text or watermarks.\n\n────────────────────────\nFINAL RESULT\n────────────────────────\nA realistic scene where:\n• Image 1 = environment + pose.\n• Image 2 = the ONLY avatar identity.\n• Image 3 = top product.\n• Image 4 = bottom product.\n\nThe final image must look like the woman from Image 2 was originally photographed in the environment from Image 1 while wearing the exact products from Images 3 and 4.",
    previewUrl: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/BIBLIOTECA%20PREMIUM/AMBIENTE+MODELO+PROD+PROD.png_2K_202607062212.jpeg"
  },
  {
    id: '3',
    titulo: 'CTA Irresistível',
    categoria: 'Conversão',
    icone: '💰',
    prompt: "Crie 3 chamadas para ação (CTAs) de encerramento de vídeo que gerem senso de urgência e FOMO (Fear Of Missing Out). O objetivo é fazer a pessoa clicar no link da bio ou no botão de compra imediatamente.\n\nProduto: [INSERIR PRODUTO]\nOferta: [INSERIR OFERTA OU DESCONTO]",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
];

const CATEGORIAS = ['Todos', 'UGC', 'Vendas', 'Conversão', 'Conteúdo'];

export default function ScreenBibliotecaPremium() {
  const [showGallery, setShowGallery] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos');
  const [promptSelecionado, setPromptSelecionado] = useState<PromptCard | null>(null);

  const promptsFiltrados = filtroCategoria === 'Todos' 
    ? PROMPTS_PREMIUM 
    : PROMPTS_PREMIUM.filter(p => p.categoria === filtroCategoria);

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      {/* Hero */}
      <div className="relative w-full rounded-3xl overflow-hidden mb-8" style={{ minHeight: '340px' }}>
        <img
          src="https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Large_3D_letters_VIRALSELLER_night_202607062127.jpeg"
          alt="Biblioteca Premium"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradiente escuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Conteúdo centralizado sobre a imagem */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[340px] text-center px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 text-xs font-black uppercase tracking-widest">Biblioteca Premium</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Prompts que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE2C55] to-[#813EF6]">Vendem</span>
          </h1>
          <p className="text-zinc-300 text-sm max-w-md mb-8 leading-relaxed">
            Prompts testados e validados para criar conteúdo viral no TikTok Shop. Copie, cole e venda.
          </p>
          <button
            onClick={() => setShowGallery(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FE2C55] to-[#813EF6] text-white font-black text-sm rounded-2xl shadow-2xl shadow-[#FE2C55]/30 hover:shadow-[#FE2C55]/50 hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Crie Agora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {showGallery && (
        <div className="animate-fade-in space-y-6">
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filtroCategoria === cat
                    ? 'bg-[#813EF6] text-white shadow-lg shadow-[#813EF6]/30'
                    : 'bg-[#1E1E35]/50 text-zinc-400 hover:bg-[#1E1E35] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {promptsFiltrados.map((card) => {
              const isVideo = isVideoUrl(card.previewUrl);
              const hasPreview = !!card.previewUrl;
              
              return (
                <div 
                  key={card.id}
                  className="group relative bg-[#0A0A0F] border border-[#1E1E2E] hover:border-[#FE2C55]/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-[420px] shadow-lg shadow-black/40"
                  onClick={() => setPromptSelecionado(card)}
                >
                  {/* Media Preview (Fundo do Card) */}
                  <div className="absolute inset-0 z-0 bg-black overflow-hidden w-full h-full">
                    {hasPreview ? (
                      isVideo ? (
                        <video
                          src={card.previewUrl}
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={card.previewUrl}
                          alt={card.titulo}
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0F0F23] via-[#0D0D19] to-[#060610] flex items-center justify-center">
                        <span className="text-5xl opacity-15 group-hover:scale-110 transition-transform duration-500">{card.icone}</span>
                      </div>
                    )}
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-[#0A0A0F]/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  </div>

                  {/* Conteúdo sobreposto */}
                  <div className="relative z-20 flex flex-col h-full justify-between p-5">
                    
                    {/* Top HUD bar */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-md">
                        <span className="text-xl">{card.icone}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#FE2C55] text-white border border-[#FE2C55]/30 shadow-lg shadow-[#FE2C55]/20">
                        {card.categoria}
                      </span>
                    </div>

                    {/* Bottom Info & CTA */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-black text-white text-base leading-tight drop-shadow-md mb-1.5 group-hover:text-[#FE2C55] transition-colors line-clamp-1">
                          {card.titulo}
                        </h3>
                        <p className="text-zinc-300 text-[11px] leading-relaxed line-clamp-2 drop-shadow-sm opacity-90">
                          {card.prompt || 'Prompt em breve...'}
                        </p>
                      </div>

                      <div className="grid grid-cols-5 gap-2 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPromptSelecionado(card);
                          }}
                          className="col-span-2 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] font-bold transition-all backdrop-blur-md"
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(card.prompt);
                            setCopiedId(card.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="col-span-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FE2C55] hover:bg-[#ff4466] text-white text-[11px] font-extrabold transition-all shadow-md shadow-[#FE2C55]/25"
                        >
                          {copiedId === card.id ? (
                            <><Check className="w-3.5 h-3.5" /> Copiado!</>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copiar</>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Prompt Completo */}
      {promptSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setPromptSelecionado(null); }}>
          <div className="bg-[#0D0D1A] border border-[#1E1E35] rounded-3xl p-6 sm:p-8 max-w-5xl w-full shadow-2xl relative max-h-[95vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{promptSelecionado.icone}</span>
                <div>
                  <h2 className="text-xl font-black text-white">{promptSelecionado.titulo}</h2>
                  <span className="text-xs text-[#813EF6] font-bold uppercase tracking-wider">{promptSelecionado.categoria}</span>
                </div>
              </div>
              <button onClick={() => setPromptSelecionado(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Left Column: Preview (Pré-visualização) */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FE2C55]" />
                    Criativo de Referência (9:16)
                  </h4>
                  {promptSelecionado.previewUrl && isVideoUrl(promptSelecionado.previewUrl) && (
                    <span className="flex items-center gap-1 text-[10px] bg-[#FE2C55]/20 border border-[#FE2C55]/30 text-[#FE2C55] px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                      Vídeo Exemplo
                    </span>
                  )}
                </div>
                
                {promptSelecionado.previewUrl ? (
                  <div className="relative w-full aspect-[9/16] max-h-[520px] rounded-2xl overflow-hidden border border-[#2A2A48] bg-[#060610] flex items-center justify-center group shadow-2xl mx-auto">
                    {promptSelecionado.previewUrl.includes('youtube.com') || promptSelecionado.previewUrl.includes('youtube-nocookie.com') ? (
                      <iframe
                        src={promptSelecionado.previewUrl}
                        title={promptSelecionado.titulo}
                        className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : isVideoUrl(promptSelecionado.previewUrl) ? (
                      <video
                        src={promptSelecionado.previewUrl}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={promptSelecionado.previewUrl}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    {/* Floating HUD tag for custom videos */}
                    {isVideoUrl(promptSelecionado.previewUrl) && (
                      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10 pointer-events-none">
                        <Play className="w-3 h-3 text-[#25F4EE] fill-[#25F4EE]" />
                        <span>PREVIEW</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-[9/16] max-h-[520px] rounded-2xl border border-dashed border-[#1E1E35] bg-[#060610] flex flex-col items-center justify-center p-6 text-center shadow-inner mx-auto">
                    <span className="text-4xl mb-3">🎬</span>
                    <span className="text-xs text-zinc-400 font-bold">Nenhum link de pré-visualização</span>
                    <span className="text-[11px] text-zinc-600 mt-1">Insira o link do Supabase no código para reproduzir.</span>
                  </div>
                )}
                
                {promptSelecionado.previewUrl && (
                  <a
                    href={promptSelecionado.previewUrl}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E1E35] hover:bg-[#2A2A48] border border-[#2A2A48]/50 text-zinc-300 hover:text-white text-xs font-bold transition-all shadow-md"
                  >
                    <span>Abrir Link Externo em Nova Guia</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              
              {/* Right Column: Prompt text and copy button next to it */}
              <div className="flex flex-col gap-4 justify-between">
                <div className="flex flex-col gap-3 flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">Estrutura do Prompt</h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promptSelecionado.prompt);
                        setCopiedId(promptSelecionado.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                        copiedId === promptSelecionado.id
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          : 'bg-[#FE2C55]/10 border-[#FE2C55]/20 text-[#FE2C55] hover:bg-[#FE2C55]/20'
                      }`}
                    >
                      {copiedId === promptSelecionado.id ? (
                        <><Check className="w-3.5 h-3.5" /> Copiado!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copiar</>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-[#060610] border border-[#813EF6]/20 rounded-2xl p-5 relative overflow-y-auto min-h-[300px] max-h-[460px] flex-grow shadow-inner">
                    <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {promptSelecionado.prompt || 'Prompt em breve...'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(promptSelecionado.prompt);
                    setCopiedId(promptSelecionado.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#FE2C55] to-[#813EF6] text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-[#FE2C55]/20 text-xs sm:text-sm uppercase tracking-wide"
                >
                  {copiedId === promptSelecionado.id ? (
                    <><Check className="w-4 h-4" /> Prompt Copiado com Sucesso!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copiar Prompt Completo</>
                  )}
                </button>
              </div>
              
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
