import React, { useState } from 'react';
import { Target, Sparkles, ImageIcon, Download, Bookmark, Layers, RefreshCw, Eye, Check, Clipboard, ExternalLink, Save, CheckCircle2 } from 'lucide-react';
import { ImageGeneration } from '../types';

interface ScreenImagensProps {
  images: ImageGeneration[];
  onImageGenerated: (newImg: ImageGeneration) => void;
}

export default function ScreenImagens({ images, onImageGenerated }: ScreenImagensProps) {
  // Input fields
  const [produto, setProduto] = useState('');
  const [estilo, setEstilo] = useState<'lifestyle' | 'banner' | 'thumbnail' | 'studio' | 'social'>('lifestyle');
  const [plataforma, setPlataforma] = useState<'tiktok' | 'instagram' | 'shopee' | 'mercadolivre' | 'pinterest'>('shopee');
  const [cor, setCor] = useState('');
  const [obs, setObs] = useState('');

  // Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery'>('generate');
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  // New prompt-centric states
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [savingImage, setSavingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const FLOWY_URL = process.env.NEXT_PUBLIC_FLOWY_URL || "https://flowy.ai-placeholder.com";

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto) {
      setErrorMsg("O nome do produto é obrigatório.");
      return;
    }

    setErrorMsg('');
    setOptimizedPrompt('');
    setSaveSuccess(false);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gerar-imagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto,
          estilo,
          plataforma,
          cor_predominante: cor,
          observacoes: obs
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado");
      }

      setOptimizedPrompt(data.optimizedPrompt);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao conectar com o gerador.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedPrompt) return;
    try {
      navigator.clipboard.writeText(optimizedPrompt);
    } catch (err) {
      console.warn("Erro ao copiar para a área de transferência:", err);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setErrorMsg("Por favor, cole a URL da imagem gerada no Flowy.");
      return;
    }

    setSavingImage(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/imagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt_used: optimizedPrompt || `Fotografia comercial de ${produto}`,
          image_type: estilo,
          platform: plataforma,
          product_name: produto
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado ao salvar.");
      }

      onImageGenerated(data);
      setSaveSuccess(true);
      setImageUrl('');
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao salvar imagem.");
    } finally {
      setSavingImage(false);
    }
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in">
      
      {/* Header Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-[#06B6D4]" />
          Estúdio de Fotos Comerciais IA (Flowy Integration)
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Gere prompts ultra-otimizados por IA baseados em copywriting de alta conversão, crie no Flowy e salve na sua galeria pessoal.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E1E2E] gap-6">
        <button
          onClick={() => setActiveTab('generate')}
          className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'generate' ? 'border-[#06B6D4] text-[#06B6D4]' : 'border-transparent text-[#8888AA] hover:text-[#F0F0FF]'
          }`}
        >
          Otimizar Prompt & Gerar no Flowy
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'gallery' ? 'border-[#06B6D4] text-[#06B6D4]' : 'border-transparent text-[#8888AA] hover:text-[#F0F0FF]'
          }`}
        >
          Minhas Fotos Salvas ({images.length})
        </button>
      </div>

      {activeTab === 'generate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form Option */}
          <div className="lg:col-span-5 bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1E1E2E] pb-2">Configurar Prompt</h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-900/30 border border-red-500/30 text-red-400 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Product */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] block">Produto Comercial</label>
                <input
                  type="text"
                  value={produto}
                  onChange={(e) => setProduto(e.target.value)}
                  placeholder="Ex: Massageador Elétrico de Pescoço, Garrafa Premium"
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#06B6D4]"
                />
              </div>

              {/* Style & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8888AA] block">Estilo Visual</label>
                  <select
                    value={estilo}
                    onChange={(e: any) => setEstilo(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] outline-none focus:border-[#06B6D4]"
                  >
                    <option value="lifestyle">Lifestyle / Com Modelo</option>
                    <option value="studio">Estúdio Limpo Comercial</option>
                    <option value="social">Post Redes Sociais</option>
                    <option value="banner">Banner Publicitário</option>
                    <option value="thumbnail">Miniatura Capa de Vídeo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8888AA] block">Proporção / Plataforma</label>
                  <select
                    value={plataforma}
                    onChange={(e: any) => setPlataforma(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] outline-none focus:border-[#06B6D4]"
                  >
                    <option value="shopee">Shopee / M. Livre (1:1)</option>
                    <option value="tiktok">TikTok Shop (9:16)</option>
                    <option value="instagram">Instagram Ads (9:16)</option>
                    <option value="pinterest">Pinterest Organico (2:3)</option>
                  </select>
                </div>
              </div>

              {/* Palette Accent */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] block">Paleta de Cores Predominante (Opcional)</label>
                <input
                  type="text"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  placeholder="Ex: Tons pastéis claros, roxo neon, cinza escuro de luxo..."
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] outline-none focus:border-[#06B6D4]"
                />
              </div>

              {/* Instructions details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] block">Observações do Cenário ou Fundo (Opcional)</label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={2}
                  placeholder="Ex: Em cima de uma mesa de mármore minimalista com luz periférica..."
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] outline-none resize-none focus:border-[#06B6D4]"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] text-white hover:opacity-95 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Buscando Engenharia de Prompt...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Otimizar Prompt (1 Créd. Roteiro)
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Preview Side */}
          <div className="lg:col-span-7 bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 min-h-[420px] flex flex-col justify-between">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4] animate-pulse">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Criando Engenharia de Prompt Copia</h3>
                  <p className="text-xs text-[#8888AA] max-w-xs mt-1">O GPT-4o está projetando um prompt hiperestético em inglês estruturado para faturamento comercial.</p>
                </div>
              </div>
            ) : optimizedPrompt ? (
              <div className="space-y-5 animate-fade-in flex flex-col justify-between h-full">
                
                {/* Prompt Output Card */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2">
                    <span className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Prompt Otimizado por IA
                    </span>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-[#1E1E2E] hover:bg-[#2A2A3E] text-xs font-bold text-white flex items-center gap-1.5 transition active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5 text-[#06B6D4]" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="p-3.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl text-xs text-white leading-relaxed font-mono select-all">
                    {optimizedPrompt}
                  </p>
                </div>

                {/* Steps Section */}
                <div className="bg-[#16132D]/35 border border-[#7C3AED]/15 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#8888AA]">Próximos Passos no Fluxo:</h4>
                  <ol className="list-decimal list-inside text-xs text-[#A0A0C0] space-y-2">
                    <li>Copie o prompt estético detalhado acima em inglês.</li>
                    <li>Clique no botão abaixo para abrir a ferramenta central de geração **Flowy**.</li>
                    <li>Gere sua colagem de imagem realista no Flowy usando o seu prompt otimizado.</li>
                    <li>Copie a URL direta da imagem gerada lá no Flowy e cole de volta abaixo para integrá-la ao seu catálogo local.</li>
                  </ol>
                </div>

                {/* Extern Flowy Link */}
                <div className="pt-2">
                  <a
                    href={FLOWY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Gerar Imagem no Flowy AI
                  </a>
                </div>

                {/* Save image form integration */}
                <form onSubmit={handleSave} className="border-t border-[#1E1E2E] pt-4 mt-2 space-y-3">
                  <label className="text-xs font-bold text-white block">Sua Imagem Pronta? Cole o link da Imagem Gerada no Flowy:</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Ex: https://flowy.com/renders/sua_foto.jpg"
                      className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] outline-none focus:border-[#06B6D4]"
                    />
                    <button
                      type="submit"
                      disabled={savingImage || !imageUrl}
                      className="px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap active:scale-95"
                    >
                      {savingImage ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      Salvar na Galeria
                    </button>
                  </div>
                  {saveSuccess && (
                    <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Imagem salva com sucesso! Confira na aba "Minhas Fotos Salvas".
                    </p>
                  )}
                </form>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 p-8">
                <ImageIcon className="w-12 h-12 text-[#1E1E2E]" />
                <h3 className="text-sm sm:text-base font-bold text-white">Pronto para Otimização</h3>
                <p className="text-xs text-[#8888AA] max-w-xs">Insira os termos comerciais do produto na barra lateral, e o GPT-4o irá formular o prompt fotográfico perfeito focado em conversão e realismo.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Personal Image Gallery List view */
        <div className="space-y-4">
          {images.length === 0 ? (
            <div className="text-center py-16 bg-[#111118]/40 border border-[#1E1E2E] rounded-xl space-y-2">
              <ImageIcon className="w-10 h-10 text-[#1E1E2E] mx-auto" />
              <h3 className="text-sm font-bold text-white">Galeria vazia por enquanto</h3>
              <p className="text-xs text-[#8888AA] max-w-xs mx-auto">Você não tem fotos coladas do Flowy por enquanto. Gere o seu primeiro prompt em "Otimizar Prompt & Gerar no Flowy"!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="group relative bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden hover:border-[#06B6D4]/60 transition"
                >
                  <img
                    src={img.image_url}
                    alt={img.prompt_used}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-500 bg-[#0A0A0F]"
                  />

                  {/* Absolute subtle badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[9px] font-extrabold uppercase bg-black/75 px-2 py-0.5 rounded text-white border border-white/15">
                      {img.image_type || 'lifestyle'}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase bg-[#06B6D4] text-black px-2 py-0.5 rounded">
                      {img.platform || 'shopee'}
                    </span>
                  </div>

                  {/* Hover Overlay triggers */}
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 gap-3">
                    <button
                      onClick={() => setZoomImg(img.image_url)}
                      className="p-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#06B6D4] rounded-lg transition"
                      title="Ver Imagem Inteira"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={img.image_url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="p-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#10B981] rounded-lg transition"
                      title="Abrir URL original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Prompt Text details */}
                  <div className="p-3">
                    <p className="text-[10px] text-[#A0A0C0] font-bold truncate mb-1">{img.product_name || "Produto comercial"}</p>
                    <p className="text-[9px] text-[#8888AA] line-clamp-2 italic">“{img.prompt_used}”</p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full-screen Single Zoom ImageViewer Modal */}
      {zoomImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full">
            <XCloseButton onClick={() => setZoomImg(null)} />
            <img
              src={zoomImg}
              alt="High Definition Product Rendering Zoom View"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl border border-white/10 mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
}

// X button helper
function XCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -top-10 right-0 sm:-right-10 p-1.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white rounded-lg transition"
    >
      <Eye className="w-5 h-5 rotate-45" />
    </button>
  );
}
