import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, Crown, ArrowRight, Play, ExternalLink, Lock, Hourglass, Gift } from 'lucide-react';
import { LazyVideo } from './LazyVideo';
import { ImageWithSkeleton } from './ImageWithSkeleton';

interface PromptCard {
  id: string;
  titulo: string;
  categoria: string;
  prompt: string;
  icone: string;
  previewUrl?: string;
}

const isVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase();
  
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
  
  return false;
};

const PROMPTS_PREMIUM: PromptCard[] = [
  {
    id: '1',
    titulo: 'Ambiente / Avatar / Camiseta',
    categoria: 'VIRAIS',
    icone: '🔥',
    prompt: "USE SEU AMBIENTE, AVATAR E CAMISETA.\n\nUse the first image ONLY as an environment + pose reference.\nUse the second image as the ONLY avatar identity reference.\nUse the third image ONLY as the TOP clothing/product reference.\nUse the fourth image ONLY as the BOTTOM clothing/product reference.\n\nIMPORTANT CONTEXT:\nThe first image may contain a model.\nThat model must be used ONLY to extract:\n• Camera angle\n• Body orientation\n• Pose\n• Distance to camera\n• Framing\n• Perspective\nThe identity of the model in the first image must NEVER be reused.\n\n────────────────────────\nENVIRONMENT + POSE EXTRACTION (CRITICAL)\n────────────────────────\n• Extract ONLY the environment from Image 1.\n• Completely remove the original model from Image 1.\n• The environment must look originally empty.\n\nFROM IMAGE 1, PRESERVE EXACTLY:\n• Camera angle\n• Camera height\n• Camera tilt\n• Distance from camera to subject\n• Body orientation\n• Pose silhouette\n• Framing and crop\n• Perspective and depth\n• Lighting direction and softness\n\n────────────────────────\nAVATAR INSERTION (CRITICAL)\n────────────────────────\n• Insert the avatar from Image 2 into the extracted environment.\n• Keep ONLY the identity from Image 2.\n• Do NOT reuse the woman from Image 1.\n• Match the exact pose and framing from Image 1.\n• Keep the arms naturally straight and relaxed.\n\n────────────────────────\nTOP PRODUCT APPLICATION (IMAGE 3)\n────────────────────────\n• Apply ONLY the product/clothing from Image 3.\n• Replicate it exactly as shown.\n• Preserve the exact fit, positioning, proportions, and style.\n• If it sits higher or lower on the body, preserve that exact placement.\n• No creative changes.\n\n────────────────────────\nBOTTOM PRODUCT APPLICATION (IMAGE 4)\n────────────────────────\n• Apply ONLY the product/clothing from Image 4.\n• Replicate it exactly as shown.\n• Preserve the exact waist height, fit, proportions, and style.\n• If it is low waist, keep it low waist.\n• If it is high waist, keep it high waist.\n• No creative changes.\n\n────────────────────────\nLIGHTING & INTEGRATION\n────────────────────────\n• Match environment lighting exactly.\n• Natural shadows consistent with Image 1.\n• Ultra realistic photographic realism.\n• No CGI look.\n• No beauty filter.\n• No stylization.\n• No text or watermarks.\n\n────────────────────────\nFINAL RESULT\n────────────────────────\nA realistic scene where:\n• Image 1 = environment + pose.\n• Image 2 = the ONLY avatar identity.\n• Image 3 = top product.\n• Image 4 = bottom product.\n\nThe final image must look like the woman from Image 2 was originally photographed in the environment from Image 1 while wearing the exact products from Images 3 and 4",
    previewUrl: "/images/cenarios/ambiente_avatar_camiseta.png"
  },
  {
    id: '2',
    titulo: 'Ambiente / Modelo / Produto 1 x Produto 2',
    categoria: 'VIRAIS',
    icone: '⭐',
    prompt: "Use the first image ONLY as an environment + pose reference.\nUse the second image as the ONLY avatar identity reference.\nUse the third image as the ONLY TOP clothing/product reference.\nUse the fourth image as the ONLY BOTTOM clothing/product reference.\n\nIMPORTANT CONTEXT:\nThe first image may contain a model.\nThat model must be used ONLY to extract:\n• Camera angle\n• Body orientation\n• Pose\n• Distance to camera\n• Framing\n• Perspective\nThe identity of the model in the first image must NEVER be reused.\n\n────────────────────────\nENVIRONMENT + POSE EXTRACTION (CRITICAL)\n────────────────────────\n• Extract ONLY the environment from Image 1.\n• Completely remove the original model from Image 1.\n• The environment must look originally empty.\n\nFROM IMAGE 1, PRESERVE EXACTLY:\n• Camera angle\n• Camera height\n• Camera tilt\n• Distance from camera to subject\n• Body orientation\n• Pose silhouette\n• Framing and crop\n• Perspective and depth\n• Lighting direction and softness.\n\n────────────────────────\nAVATAR INSERTION (CRITICAL)\n────────────────────────\n• Insert the avatar from Image 2 into the extracted environment.\n• Keep ONLY the identity from Image 2.\n• Do NOT reuse the woman from Image 1.\n• Match the exact pose and framing from Image 1.\n• Keep the arms naturally straight and relaxed.\n\n────────────────────────\nTOP PRODUCT APPLICATION (IMAGE 3)\n────────────────────────\n• Apply ONLY the product/clothing from Image 3.\n• Replicate it exactly as shown.\n• Preserve the exact fit, positioning, proportions, and style.\n• If it sits higher or lower on the body, preserve that exact placement.\n• No creative changes.\n\n────────────────────────\nBOTTOM PRODUCT APPLICATION (IMAGE 4)\n────────────────────────\n• Apply ONLY the product/clothing from Image 4.\n• Replicate it exactly as shown.\n• Preserve the exact waist height, fit, proportions, and style.\n• If it is low waist, keep it low waist.\n• If it is high waist, keep it high waist.\n• No creative changes.\n\n────────────────────────\nLIGHTING & INTEGRATION\n────────────────────────\n• Match environment lighting exactly.\n• Natural shadows consistent with Image 1.\n• Ultra realistic photographic realism.\n• No CGI look.\n• No beauty filter.\n• No stylization.\n• No text or watermarks.\n\n────────────────────────\nFINAL RESULT\n────────────────────────\nA realistic scene where:\n• Image 1 = environment + pose.\n• Image 2 = the ONLY avatar identity.\n• Image 3 = top product.\n• Image 4 = bottom product.\n\nThe final image must look like the woman from Image 2 was originally photographed in the environment from Image 1 while wearing the exact products from Images 3 and 4.",
    previewUrl: "/images/cenarios/AMBIENTE_MODELO_PROD_PROD.png"
  },
  {
    id: '3',
    titulo: 'CTA Irresistível',
    categoria: 'Conversão',
    icone: '💰',
    prompt: "Crie 3 chamadas para ação (CTAs) de encerramento de vídeo que gerem senso de urgência e FOMO (Fear Of Missing Out). O objetivo é fazer a pessoa clicar no link da bio ou no botão de compra imediatamente.\n\nProduto: [INSERIR PRODUTO]\nOferta: [INSERIR OFERTA OU DESCONTO]",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: '4',
    titulo: 'Storytelling de Produto',
    categoria: 'UGC',
    icone: '🎯',
    prompt: "Crie um roteiro de storytelling de 30 segundos contando a história de como esse produto resolveu um problema muito irritante que quase todo mundo tem.\n\nUse o formato: Problema > Frustração > Descoberta do Produto > Solução > CTA.\n\nProduto: [INSERIR PRODUTO]",
    previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: '5',
    titulo: 'Gatilho de Escassez',
    categoria: 'Vendas',
    icone: '⚡',
    prompt: "Escreva um texto curto e persuasivo para colocar na tela (overlay de texto) de um vídeo, focando inteiramente no gatilho mental de escassez e urgência de tempo/estoque.\n\nProduto: [INSERIR PRODUTO]",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: '6',
    titulo: 'Comparativo Antes/Depois',
    categoria: 'Conteúdo',
    icone: '✨',
    prompt: "Estruture um roteiro visual para um vídeo de transição 'Antes e Depois'.\n\nDescreva exatamente o que deve aparecer na tela durante os primeiros 5 segundos (o problema) e depois a transição impactante mostrando o resultado nos próximos 5 segundos.\n\nProduto: [INSERIR PRODUTO]",
    previewUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: '7',
    titulo: 'Unboxing com Emoção',
    categoria: 'UGC',
    icone: '📦',
    prompt: "Crie um roteiro para um vídeo de unboxing estilo ASMR/UGC, descrevendo as emoções, expressões faciais e o texto que deve ser narrado ao abrir a caixa e ver o produto pela primeira vez.\n\nProduto: [INSERIR PRODUTO]",
    previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: '8',
    titulo: 'Objeção Destruída',
    categoria: 'Vendas',
    icone: '🎤',
    prompt: "Liste as 3 principais objeções (motivos para não comprar) que um cliente teria sobre este produto e crie um roteiro de 20 segundos que quebre todas essas objeções de forma lógica e emocional.\n\nProduto: [INSERIR PRODUTO]",
    previewUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80"
  },
];

const CATEGORIAS = ['Todos', 'UGC', 'Vendas', 'Conversão', 'Conteúdo'];

export default function ScreenBibliotecaPremium() {
  const [showGallery, setShowGallery] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos');
  const [promptSelecionado, setPromptSelecionado] = useState<PromptCard | null>(null);

  // Simulação de dias do cliente na plataforma
  const diasComoCliente = 2;

  const promptsFiltrados = filtroCategoria === 'Todos' 
    ? PROMPTS_PREMIUM 
    : PROMPTS_PREMIUM.filter(p => p.categoria === filtroCategoria);

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      {!showGallery ? (
        <div className="animate-fade-in space-y-8">
          {/* Hero */}
          <div className="relative w-full rounded-3xl overflow-hidden" style={{ minHeight: '340px' }}>
            <img
              src="/images/avatares/Large_3D_letters_VIRALSELLER_night_202607062127.jpeg"
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

          {/* Seção Clube de Clientes Fiéis */}
          <div className="w-full bg-[#0A0A14] rounded-3xl relative overflow-hidden shadow-2xl">
            {/* Borda superior em gradiente */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FE2C55] to-[#813EF6]"></div>
            
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center gap-2 mb-3">
                  🏆 CLUBE DE CLIENTES FIÉIS
                </h2>
                <p className="text-zinc-400 text-sm md:text-base">
                  Benefícios exclusivos para quem está com a gente há mais tempo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Card 1 */}
                <div className="bg-[#111118] border border-[#1E1E35] p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FE2C55]/20 to-[#813EF6]/20 flex items-center justify-center mb-4 border border-[#FE2C55]/20">
                    <Lock className="w-6 h-6 text-[#FE2C55]" />
                  </div>
                  <h3 className="text-white font-bold mb-3">Aba Exclusiva</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Esta biblioteca é reservada para clientes que demonstram comprometimento com a plataforma. Conteúdo premium selecionado a dedo pela nossa equipe.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#111118] border border-[#1E1E35] p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FE2C55]/20 to-[#813EF6]/20 flex items-center justify-center mb-4 border border-[#FE2C55]/20">
                    <Hourglass className="w-6 h-6 text-[#FE2C55]" />
                  </div>
                  <h3 className="text-white font-bold mb-3">Como Liberar</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Após 7 dias como cliente ativo, você receberá acesso automático a todo o conteúdo desta biblioteca. Fique atento ao seu email!
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-[#111118] border border-[#1E1E35] p-6 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FE2C55]/20 to-[#813EF6]/20 flex items-center justify-center mb-4 border border-[#FE2C55]/20">
                    <Gift className="w-6 h-6 text-[#FE2C55]" />
                  </div>
                  <h3 className="text-white font-bold mb-3">Benefícios Exclusivos</h3>
                  <ul className="text-zinc-400 text-sm space-y-2">
                    <li className="flex items-start gap-2"><span className="text-[#813EF6]">•</span> Templates premium de alta conversão</li>
                    <li className="flex items-start gap-2"><span className="text-[#813EF6]">•</span> Prompts avançados testados e validados</li>
                    <li className="flex items-start gap-2"><span className="text-[#FE2C55]">•</span> Estratégias secretas de afiliados top</li>
                    <li className="flex items-start gap-2"><span className="text-[#FE2C55]">•</span> Atualizações semanais de conteúdo</li>
                  </ul>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="max-w-2xl mx-auto bg-[#111118] border border-[#1E1E35] p-6 rounded-2xl text-center">
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-3 px-1">
                  <span>Seu progresso para desbloquear:</span>
                  <span className="text-[#FE2C55]">7 dias necessários</span>
                </div>
                <div className="w-full bg-[#1E1E35] h-3 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FE2C55] to-[#813EF6] rounded-full animate-pulse" 
                    style={{ width: `${Math.min((diasComoCliente / 7) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-zinc-500 font-medium">Continue usando a plataforma para desbloquear</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                        <LazyVideo
                          src={card.previewUrl}
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <ImageWithSkeleton
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
                      <LazyVideo
                        src={promptSelecionado.previewUrl}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <ImageWithSkeleton
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
