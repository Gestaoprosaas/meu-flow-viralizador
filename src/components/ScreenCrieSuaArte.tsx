import React, { useState, useEffect } from 'react';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { Sparkles, ImageIcon, Download, Bookmark, Layers, RefreshCw, Eye, Check, Clipboard, Image as LucideImage, AlertCircle, User, Upload } from 'lucide-react';
import { ImageGeneration } from '../types';

interface ScreenCrieSuaArteProps {
  images: ImageGeneration[];
  onImageGenerated: (newImg: ImageGeneration) => void;
  profileCredits: number;
  onRefreshProfile: () => void;
  profile?: any;
}

export default function ScreenCrieSuaArte({ images, onImageGenerated, profileCredits, onRefreshProfile, profile }: ScreenCrieSuaArteProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [estilo, setEstilo] = useState<'lifestyle' | 'banner' | 'thumbnail' | 'studio' | 'social'>('lifestyle');
  const [productName, setProductName] = useState('');
  
  // Status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedImg, setGeneratedImg] = useState<ImageGeneration | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [justCopied, setJustCopied] = useState(false);

  // Daily client limit state (with a safe large buffer for text prompts)
  const [limitInfo, setLimitInfo] = useState<{ remaining: number; max: number; ip: string } | null>(null);

  // Own Avatar custom properties
  const [hasOwnAvatar, setHasOwnAvatar] = useState<boolean>(() => {
    if (profile && typeof profile.has_own_avatar === 'boolean') return profile.has_own_avatar;
    return localStorage.getItem('has_own_avatar') === 'true';
  });
  const [avatarDetails, setAvatarDetails] = useState<string>(() => {
    if (profile && typeof profile.custom_avatar_details === 'string') return profile.custom_avatar_details;
    return localStorage.getItem('custom_avatar_details') || '';
  });
  const [customAvatarImg, setCustomAvatarImg] = useState<string | null>(() => {
    if (profile && profile.custom_avatar_preview !== undefined) return profile.custom_avatar_preview;
    return localStorage.getItem('custom_avatar_preview') || null;
  });

  // Keep state in sync with profile updates
  useEffect(() => {
    if (profile) {
      if (typeof profile.has_own_avatar === 'boolean') {
        setHasOwnAvatar(profile.has_own_avatar);
        localStorage.setItem('has_own_avatar', String(profile.has_own_avatar));
      }
      if (typeof profile.custom_avatar_details === 'string') {
        setAvatarDetails(profile.custom_avatar_details);
        localStorage.setItem('custom_avatar_details', profile.custom_avatar_details);
      }
      if (profile.custom_avatar_preview !== undefined) {
        setCustomAvatarImg(profile.custom_avatar_preview);
        if (profile.custom_avatar_preview) {
          localStorage.setItem('custom_avatar_preview', profile.custom_avatar_preview);
        } else {
          localStorage.removeItem('custom_avatar_preview');
        }
      }
    }
  }, [profile]);

  // Synchronize avatar settings to the server database
  const syncAvatarSettings = async (hasOwn: boolean, details: string, img: string | null) => {
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          has_own_avatar: hasOwn,
          custom_avatar_details: details,
          custom_avatar_preview: img
        })
      });
      onRefreshProfile(); // Keep other sessions / devices updated
    } catch (e) {
      console.error("Erro ao sincronizar avatar com o servidor:", e);
    }
  };

  // Preferred generator site
  const [favGenerator, setFavGenerator] = useState<string>(() => {
    return localStorage.getItem('fav_image_generator') || 'https://flux1ai.com/';
  });
  const [customUrl, setCustomUrl] = useState<string>(() => {
    return localStorage.getItem('custom_image_generator_url') || '';
  });

  const fetchLimitInfo = async () => {
    try {
      const response = await fetch('/api/crie-sua-arte/limit');
      if (response.ok) {
        const data = await response.json();
        setLimitInfo({ remaining: data.remaining, max: data.max, ip: data.ip });
      }
    } catch (e) {
      console.error("Erro ao obter cota diária de IP:", e);
    }
  };

  useEffect(() => {
    fetchLimitInfo();
  }, []);

  const savePreferredGenerator = (url: string) => {
    setFavGenerator(url);
    localStorage.setItem('fav_image_generator', url);
  };

  const saveCustomUrl = (url: string) => {
    setCustomUrl(url);
    localStorage.setItem('custom_image_generator_url', url);
  };

  const activeGeneratorUrl = favGenerator === 'custom' ? (customUrl || 'https://flux1ai.com/') : favGenerator;

  const getGeneratorName = () => {
    switch (favGenerator) {
      case 'https://flux1ai.com/':
        return 'ViralSeller (Flux 1 AI)';
      case 'https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell':
        return 'HuggingFace FLUX';
      case 'https://seaart.ai':
        return 'SeaArt AI';
      case 'https://leonardo.ai':
        return 'Leonardo AI';
      case 'https://www.bing.com/images/create':
        return 'Bing Creator';
      case 'custom':
        if (customUrl) {
          try {
            const hostname = new URL(customUrl).hostname.replace('www.', '');
            return hostname || 'Gerador Customizado';
          } catch (e) {
            return 'Gerador Customizado';
          }
        }
        return 'Gerador Customizado';
      default:
        return 'ViralSeller (Flux 1 AI)';
    }
  };

  // Filter images to only show those that are generated as arts
  const arteImages = images.filter(img => 
    img.id.startsWith('arte-') || 
    img.product_name?.includes('ViralSeller') || 
    img.product_name === 'Arte Criativa' || 
    img.prompt_used?.length > 10
  );

  const handleGenerateArte = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setErrorMsg("Por favor, descreva o que você deseja criar.");
      return;
    }

    setErrorMsg('');
    setGeneratedImg(null);
    setIsGenerating(true);
    setJustCopied(false);

    try {
      const response = await fetch('/api/crie-sua-arte/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          aspectRatio: aspectRatio,
          estilo: estilo,
          product_name: productName || 'Arte Otimizada para ViralSeller',
          platform: 'instagram',
          hasOwnAvatar: hasOwnAvatar,
          avatarDetails: hasOwnAvatar ? avatarDetails : ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro desconhecido ao otimizar prompt.");
      }

      setGeneratedImg(data.image);
      onImageGenerated(data.image);
      onRefreshProfile();
      fetchLimitInfo();

      // Auto-copy the resulting optimized English prompt to clipboard immediately!
      if (data.image && data.image.prompt_used) {
        try {
          navigator.clipboard.writeText(data.image.prompt_used);
        } catch (err) {
          console.warn("Clipboard copy blocked:", err);
        }
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro inesperado ao conectar com o estúdio de prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn("Clipboard copy blocked:", err);
    }
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleOpenAndCopy = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn("Clipboard copy blocked:", err);
    }
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1500);
    window.open(activeGeneratorUrl, '_blank');
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#25F4EE]" />
            Crie Arte
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Nossa inteligência converte ideias em fórmulas fotorrealistas em inglês para colar e gerar imagens 100% grátis no ViralSeller/Flux!</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
          {limitInfo && (
            <div className="bg-[#111118] border border-[#1E1E2E] px-4 py-2 rounded-2xl flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-zinc-300">Consultas da sua Máquina:</span>
              <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {limitInfo.remaining} de {limitInfo.max} restantes hoje (Plano)
              </span>
            </div>
          )}
          <div className="bg-[#111118] border border-[#1E1E2E] px-4 py-2 rounded-2xl flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#25F4EE]" />
            <span className="text-[11px] font-black text-white bg-[#25F4EE]/10 px-2.5 py-0.5 rounded-full border border-[#25F4EE]/20">
              Prompt Assist: Grátis & Ilimitado
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E1E2E] gap-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeTab === 'create' ? 'border-[#25F4EE] text-[#25F4EE]' : 'border-transparent text-[#8888AA] hover:text-[#F0F0FF]'
          }`}
        >
          Otimizar Novo Prompt
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'gallery' ? 'border-[#25F4EE] text-[#25F4EE]' : 'border-transparent text-[#8888AA] hover:text-[#F0F0FF]'
          }`}
        >
          Meus Prompts Otimizados ({arteImages.length})
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Create form */}
          <div className="lg:col-span-5 bg-[#07070C] border border-[#1E1E2E] rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#25F4EE]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="border-b border-[#1E1E2E] pb-3">
              <h2 className="text-base font-extrabold text-white">1. Propriedades da Foto</h2>
              <p className="text-[11px] text-[#8888AA]">Escreva a ideia do seu produto e veja a mágica acontecer</p>
            </div>

            {errorMsg && (
              <div className="bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-[#FE2C55] text-xs p-3.5 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleGenerateArte} className="space-y-4">
              {/* Product Name (Optional) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#8888AA]">
                  Nome do seu Produto (Opcional)
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Garrafa de Aço Slim, Creme Rejuvenescedor"
                  className="w-full bg-[#050508] border border-[#1E1E2E] rounded-xl py-2.5 px-4 text-xs text-zinc-200 outline-none focus:border-[#25F4EE] transition"
                />
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#8888AA] flex justify-between">
                  <span>Descreva a ideia em português *</span>
                  <span className="text-[#25F4EE] normal-case text-[9px] font-bold">A IA vai expandir em inglês técnico</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Um fone de ouvido deitado em cima de uma pedra com água espirrando em volta e iluminação azul neon ao fundo."
                  className="w-full bg-[#050508] border border-[#1E1E2E] rounded-xl py-3 px-4 text-xs text-zinc-200 outline-none focus:border-[#25F4EE] transition resize-none placeholder-[#555577] min-h-[90px]"
                />
              </div>

              {/* Aspect Ratio Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#8888AA]">
                  Formato Sugerido (Proporção)
                </label>
                <div className="flex flex-wrap sm:grid sm:grid-cols-5 gap-1.5">
                  {(['1:1', '3:4', '4:3', '9:16', '16:9'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`flex-1 min-w-[55px] py-2 rounded-lg text-center text-[10px] font-bold border transition duration-150 ${
                        aspectRatio === ratio
                          ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-[#25F4EE]'
                          : 'bg-[#050508] border-[#1E1E2E] text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Estilo Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#8888AA]">
                    Estilo Visual
                  </label>
                  <select
                    value={estilo}
                    onChange={(e) => setEstilo(e.target.value as any)}
                    className="w-full bg-[#050508] border border-[#1E1E2E] rounded-xl py-2 px-3 text-xs text-zinc-200 outline-none focus:border-[#25F4EE] transition cursor-pointer"
                  >
                    <option value="lifestyle">Ambientado (Lindo UGC)</option>
                    <option value="studio">Estúdio Comercial</option>
                    <option value="minimalista">Minimalismo Absoluto</option>
                    <option value="luxo">Luxo & Chiaroscuro</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#8888AA]">
                    Mecanismo Studio
                  </label>
                  <div className="bg-[#050508] border border-[#1E1E2E] rounded-xl py-2 px-3 text-xs text-[#25F4EE] font-bold select-none">
                    Gemini Prompt Enhancer
                  </div>
                </div>
              </div>
               {/* Opção de Avatar Próprio */}
              <div className="pt-2.5 border-t border-[#1E1E2E]/65 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-[#8888AA] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#25F4EE]" />
                    <span>Usar Meu Avatar Próprio</span>
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={hasOwnAvatar}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setHasOwnAvatar(checked);
                        localStorage.setItem('has_own_avatar', String(checked));
                        syncAvatarSettings(checked, avatarDetails, customAvatarImg);
                      }}
                    />
                    <span className="w-8 h-4 bg-zinc-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-[#25F4EE]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#25F4EE]"></span>
                  </label>
                </div>

                {hasOwnAvatar && (
                  <div className="space-y-3 p-3 bg-[#0A0A12] border border-[#25F4EE]/10 rounded-xl animate-fade-in text-left">
                    
                    {/* Upload local de Foto do Avatar */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-[#8888AA] uppercase block">Selecione/Anexe a foto do seu Avatar</span>
                      
                      <div className="relative border border-dashed border-[#1E1E2E] hover:border-[#25F4EE]/40 rounded-lg p-3 transition duration-150 flex flex-col items-center justify-center bg-zinc-950/50">
                        {customAvatarImg ? (
                          <div className="flex items-center gap-3 w-full">
                            <ImageWithSkeleton 
                              src={customAvatarImg} 
                              alt="Avatar Próprio" 
                              className="w-10 h-10 object-cover rounded-lg border border-zinc-700 shrink-0" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10.5px] font-bold text-white truncate">Avatar anexado com sucesso!</p>
                              <p className="text-[9px] text-[#25F4EE]">Lógica integrada para combinar foto</p>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                setCustomAvatarImg(null);
                                localStorage.removeItem('custom_avatar_preview');
                                syncAvatarSettings(hasOwnAvatar, avatarDetails, null);
                              }}
                              className="text-[10px] text-[#FE2C55] hover:underline font-bold shrink-0"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center justify-center py-1.5 w-full">
                            <Upload className="w-5 h-5 text-[#25F4EE] mb-1.5 animate-bounce" />
                            <span className="text-[10px] font-bold text-zinc-300">Anexar imagem do meu avatar (.png, .jpg)</span>
                            <span className="text-[8px] text-[#8888AA] mt-0.5">Fazer upload local para referência</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const base64 = reader.result as string;
                                    setCustomAvatarImg(base64);
                                    localStorage.setItem('custom_avatar_preview', base64);
                                    syncAvatarSettings(hasOwnAvatar, avatarDetails, base64);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Descrição física textual do Avatar */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#8888AA] uppercase block">
                        O que seu avatar veste e como ele é fisicamente? *
                      </label>
                      <textarea
                        rows={2}
                        required={hasOwnAvatar}
                        value={avatarDetails}
                        onChange={(e) => {
                          setAvatarDetails(e.target.value);
                          localStorage.setItem('custom_avatar_details', e.target.value);
                        }}
                        onBlur={(e) => {
                          syncAvatarSettings(hasOwnAvatar, e.target.value, customAvatarImg);
                        }}
                        placeholder="Ex: Jovem beirando os 28 anos, moreno, barba curta, de terno e gravata escuros modernos, sorrindo gentilmente."
                        className="w-full bg-[#050508] border border-[#1E1E2E] rounded-lg py-1.5 px-3 text-[11px] text-zinc-200 outline-none focus:border-[#25F4EE] transition resize-none placeholder-[#555577]"
                      />
                      <p className="text-[8.5px] text-[#8888AA] leading-snug">
                        Suas características físicas serão tecidas em inglês profissional para que a IA gere seu personagem exato na foto com o produto.
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {/* Destination configuration in Form */}
              <div className="pt-2 border-t border-[#1E1E2E]/80 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#25F4EE] flex justify-between">
                  <span>Selecionar seu Gerador Favorito</span>
                </label>
                <select
                  value={favGenerator}
                  onChange={(e) => savePreferredGenerator(e.target.value)}
                  className="w-full bg-[#0A0A12] border border-[#1E1E2E] rounded-xl py-2 px-3 text-xs text-emerald-400 font-extrabold outline-none focus:border-[#25F4EE] transition cursor-pointer"
                >
                  <option value="https://flux1ai.com/">Flux 1 AI (Site do "ViralSeller" Oficial)</option>
                  <option value="https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell">Hugging Face FLUX (Grátis & Ilimitado)</option>
                  <option value="https://seaart.ai">SeaArt AI (Excelente & Avançado)</option>
                  <option value="https://leonardo.ai">Leonardo AI (Profissional)</option>
                  <option value="https://www.bing.com/images/create">Bing Image Creator (Grátis Microsoft)</option>
                  <option value="custom">Outro link personalizado...</option>
                </select>

                {favGenerator === 'custom' && (
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => saveCustomUrl(e.target.value)}
                    placeholder="Digite a URL do seu gerador (ex: https://site.com)"
                    className="w-full bg-[#050508] border border-[#1E1E2E] rounded-xl py-2 px-4 text-xs text-zinc-300 outline-none focus:border-[#25F4EE] transition mt-1.5"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 transition duration-200 uppercase text-black ${
                  isGenerating 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                    : 'bg-gradient-to-r from-[#25F4EE] to-[#0DF md:to-emerald-400] bg-emerald-400 hover:brightness-110 shadow-lg shadow-emerald-500/10'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                    Otimizando Linguagem IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black animate-bounce" />
                    Criar Fórmula Premium (Grátis)
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-[#07070C] border border-[#1E1E2E] rounded-3xl min-h-[480px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#25F4EE]/5 rounded-full blur-3xl pointer-events-none" />

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center max-w-sm">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-[#25F4EE] animate-spin" />
                  <Sparkles className="w-6 h-6 text-[#25F4EE] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-[#25F4EE] text-sm font-extrabold uppercase tracking-widest mt-2">Tecendo Linguagem...</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  "Nosso modelo gratuito Gemini 3.5 Flash está expandindo sua ideia em um prompt fotográfico em inglês de alta fidelidade técnica (ângulos, iluminação, lentes fotográficas e ambientação)."
                </p>
                <div className="w-full bg-zinc-800/40 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#25F4EE] to-emerald-400 h-full rounded-full animate-[shimmer_2s_infinite] w-4/5" style={{ backgroundSize: '150% 100%' }} />
                </div>
              </div>
            ) : generatedImg ? (
              <div className="w-full flex flex-col space-y-6 animate-scale-up">
                
                {/* Visual Feedback of successful auto-copy */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-left max-w-[500px] mx-auto w-full">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-white uppercase tracking-wide">Pronto e Auto-Copiado!</h4>
                      <p className="text-[10.5px] text-zinc-400 mt-0.5">O prompt otimizado já está na área de transferência. Basta colar no site!</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                    CTRL + V
                  </span>
                </div>

                {/* Display Graphic Aesthetic Card */}
                <div className="relative group bg-[#0C0C14] rounded-2xl overflow-hidden border border-[#25F4EE]/20 mx-auto shadow-2xl flex flex-col max-w-[500px] w-full">
                  <div className="p-4 bg-zinc-950/90 border-b border-[#1E1E2E] flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-widest text-[#25F4EE] uppercase flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Estilo: {estilo} • Proporção: {aspectRatio}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">100% Grátis</span>
                  </div>

                  {/* Formatted prompt container */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black tracking-widest text-[#8888AA] uppercase">Fórmula de Imagem Comercial Gerada:</span>
                        <button 
                          onClick={() => handleCopyPrompt(generatedImg.prompt_used, generatedImg.id)}
                          className="text-xs text-[#25F4EE] hover:underline flex items-center gap-1 font-bold bg-[#25F4EE]/5 px-2.5 py-1 rounded-lg border border-[#25F4EE]/10"
                        >
                          {copiedPromptId === generatedImg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Clipboard className="w-3.5 h-3.5" />
                              Copiar Prompt
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-xl max-h-[160px] overflow-y-auto text-left scrollbar-thin">
                        <p className="text-xs text-zinc-200 leading-relaxed font-mono select-all">
                          {generatedImg.prompt_used}
                        </p>
                      </div>
                    </div>

                    {/* Glowing Redirect Button */}
                    <button
                      onClick={() => handleOpenAndCopy(generatedImg.prompt_used)}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-[#25F4EE] hover:brightness-110 active:scale-98 transition text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#25F4EE]/10"
                    >
                      <LucideImage className="w-4 h-4 text-black animate-pulse" />
                      Copiar e Ir para o {getGeneratorName()}
                    </button>
                  </div>
                </div>

                {/* Helpful Instruction Guide */}
                <div className="bg-[#11111C] border border-[#1E1E2E] p-4 rounded-2xl max-w-[500px] mx-auto w-full text-left space-y-2">
                  <span className="text-[10px] font-black text-[#25F4EE] uppercase tracking-wide">💡 Como criar no {getGeneratorName()} Sem Gastar Nada:</span>
                  <ul className="text-xs text-zinc-400 space-y-1.5 leading-relaxed font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#25F4EE] font-extrabold mt-0.5">1.</span>
                      <span>Clique no botão acima. O site oficial gratuito de criação do <strong>{getGeneratorName()}</strong> abrirá em outra janela.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#25F4EE] font-extrabold mt-0.5">2.</span>
                      <span>Lá no site, clique com o botão direito e escolha <strong>Colar</strong> (ou aperte <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px]">Ctrl+V</kbd>) na barra de criação.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#25F4EE] font-extrabold mt-0.5">3.</span>
                      <span>Aperte em <strong>"Generate" / "Criar"</strong> e sua obra realista surgirá em segundos 100% livre de cobranças!</span>
                    </li>
                  </ul>
                </div>

              </div>
            ) : (
              <div className="text-center space-y-5 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#111122] border border-[#1E1E2E] flex items-center justify-center mx-auto text-zinc-500">
                  <LucideImage className="w-8 h-8 text-[#25F4EE] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Visualização do Prompt Otimizado</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    Insira as informações do seu produto ao lado e gere uma fórmula ultra realista em inglês pronta para ser colada em qualquer IA de fotos.
                  </p>
                </div>

                {/* Default Preset platforms shown immediately */}
                <div className="pt-4 border-t border-[#1E1E2E] space-y-2 text-left">
                  <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block">Geradores Rápidos de Imagem (Seguro & Grátis):</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a 
                      href={activeGeneratorUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-3 py-2 bg-[#0C0C14] hover:bg-[#111122] border border-[#1E1E2E] text-[#25F4EE] rounded-xl flex items-center justify-between font-bold"
                    >
                      <span>Abrir {favGenerator === 'custom' ? 'Gerador' : 'ViralSeller Oficial'}</span>
                      <span className="text-[8px] text-emerald-400 uppercase font-black">Grátis</span>
                    </a>
                    <a 
                      href="https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-3 py-2 bg-[#0C0C14] hover:bg-[#111122] border border-[#1E1E2E] text-zinc-300 rounded-xl flex items-center justify-between font-bold"
                    >
                      <span>HuggingFace Flux</span>
                      <span className="text-[8px] text-emerald-400 uppercase font-black">Ilimitado</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Gallery Tab (Displays list of historical optimized prompts!) */
        <div className="space-y-6">
          {arteImages.length === 0 ? (
            <div className="py-16 text-center border border-[#1E1E2E] rounded-3xl bg-[#07070C] max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 flex items-center justify-center mx-auto text-zinc-500">
                <ImageIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Nenhum Prompt Otimizado</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  Os prompts otimizados nessa tela usando o motor do Gemini serão salvos no seu histórico pessoal aqui para fácil cópia futura.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="text-xs text-[#25F4EE] font-bold underline"
              >
                Otimizar meu primeiro prompt agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {arteImages.map((img) => (
                <div 
                  key={img.id}
                  className="bg-[#07070C] border border-[#1E1E2E] rounded-2xl overflow-hidden hover:border-zinc-700 transition duration-300 group flex flex-col justify-between"
                >
                  {/* Digital aesthetic card mockup background */}
                  <div className="relative bg-gradient-to-br from-zinc-900 to-[#12121e] aspect-[4/3] overflow-hidden flex flex-col justify-between p-4 border-b border-zinc-900">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                        {img.image_type || 'custom'}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500">
                        {new Date(img.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className="my-auto space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#25F4EE]">FÓRMULA OTIMIZADA</p>
                      <p className="text-xs text-white font-extrabold truncate w-full" title={img.product_name}>
                        {img.product_name || 'Arte Otimizada'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyPrompt(img.prompt_used, img.id)}
                        className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] rounded-lg border border-white/10 transition active:scale-95 flex items-center gap-1"
                        title="Copiar prompt profissional em inglês"
                      >
                        {copiedPromptId === img.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Clipboard className="w-3 h-3" /> Copiar Prompt
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleOpenAndCopy(img.prompt_used)}
                        className="py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[10px] rounded-lg border border-emerald-500/20 transition active:scale-95 flex items-center gap-1"
                        title={`Abrir no ${getGeneratorName()}`}
                      >
                        <LucideImage className="w-3 h-3" /> Abrir {getGeneratorName()}
                      </button>
                    </div>
                  </div>

                  {/* Prompt Text details */}
                  <div className="p-4 space-y-2">
                    <p className="text-[11px] text-zinc-300 line-clamp-3 leading-relaxed font-mono" title={img.prompt_used}>
                      "{img.prompt_used}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {zoomImg && (
        <div 
          onClick={() => setZoomImg(null)}
          className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-zinc-900/50 p-2.5 rounded-2xl border border-zinc-800 backdrop-blur-md shadow-2xl flex items-center justify-center">
            <ImageWithSkeleton
              src={zoomImg}
              alt="Zoomed art"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[80vh] object-contain rounded-xl select-none"
            />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full border border-zinc-800 text-xs font-bold text-center">
              Clique em qualquer lugar para fechar
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
