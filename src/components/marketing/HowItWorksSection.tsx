import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  TrendingUp, 
  Heart, 
  Search, 
  Zap, 
  Play, 
  Volume2, 
  VolumeX,
  MessageSquare, 
  Video, 
  Layers, 
  Type, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [favoritesActive, setFavoritesActive] = useState<Record<string, boolean>>({
    'legging': true,
    'cinta': true,
    'bermuda': true,
    'vestido': true
  });
  const [selectedAvatar, setSelectedAvatar] = useState<string>('giovana');
  const [selectedVoice, setSelectedVoice] = useState<string>('vitao');
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [captionStyle, setCaptionStyle] = useState<'yellow' | 'green' | 'white'>('yellow');
  const [progressValue, setProgressValue] = useState<number>(45);

  // Auto tick progression for progress effects
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => (prev >= 100 ? 5 : prev + 1));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const tabsData = [
    {
      id: 'vitrine',
      number: '01 / 05',
      tag: 'VITRINE',
      heading: 'Descubra os campeões antes da concorrência.',
      description: 'Uma vitrine viva, atualizada a cada hora, com os produtos que estão bombando no momento. Salve seus favoritos e dispare a criação de conteúdo direto do card.',
      highlights: [
        'Curadoria atualizada de hora em hora',
        'Filtros por nicho e tendência',
        'Geração de UGC com um clique'
      ]
    },
    {
      id: 'avatares',
      number: '02 / 05',
      tag: 'AVATARES',
      heading: 'Um elenco de criadores sempre à sua disposição.',
      description: 'Escolha entre dezenas de personagens prontos ou clone seu próprio estilo. Avatares profissionais para gravar quantos vídeos quiser, sem câmera e sem estúdio.',
      highlights: [
        'Biblioteca diversa de personagens',
        'Crie seu avatar do zero com IA',
        'Estilos casual, lifestyle e premium'
      ]
    },
    {
      id: 'revolucao',
      number: '03 / 05',
      tag: 'REVOLUÇÃO',
      heading: 'Dublagens e vozes ultra-realistas de alta retenção.',
      description: 'Converta texto em áudio impecável utilizando as vozes sintéticas mais avançadas e expressivas do mercado, com sotaques brasileiros autênticos e cadência vendedora.',
      highlights: [
        'Vozes humanas autênticas',
        'Modelagem emocional integrada',
        'Sincronização labial sob medida'
      ]
    },
    {
      id: 'fluxo',
      number: '04 / 05',
      tag: 'FLUXO',
      heading: 'Pipeline automatizado de roteiro a vídeo completo.',
      description: 'Gere o roteiro vencedor baseado no modelo de vendas AIDA, integre a narração realista e combine com os clipes visuais ideais sem trabalho manual.',
      highlights: [
        'Redação persuasiva de copy',
        'Templates de alta retenção',
        'Renderização acelerada'
      ]
    },
    {
      id: 'tokeditor',
      number: '05 / 05',
      tag: 'TOKEDITOR',
      heading: 'Editor ágil de alto impacto para TikTok e Reels.',
      description: 'Customize legendas coloridas dinâmicas, adicione stickers de engajamento, barras de progresso e efeitos sonoros focados em explodir a retenção média.',
      highlights: [
        'Legendas neon automáticas',
        'Barra de progresso viva',
        'Música de fundo inteligente'
      ]
    }
  ];

  const toggleFavorite = (id: string) => {
    setFavoritesActive(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePlayVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setIsPlayingVoice(true);
    setTimeout(() => {
      setIsPlayingVoice(false);
    }, 4000);
  };

  return (
    <div id="interactive-features-section" className="relative w-full py-24 sm:py-32 px-4 sm:px-6 md:px-12 border-b border-[#1E1E2E] overflow-hidden bg-transparent">
      
      {/* Background Visual Accents */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#69C9D0]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#FE2C55]/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Split Container Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Explanations and Steps */}
          <div className="lg:col-span-5 space-y-8 text-left">
            
            {/* Animated Title Group based on Active Tab */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-sm font-black text-[#FE2C55]/95 tracking-wide">
                    {tabsData[activeTab].number}
                  </span>
                  <span className="text-gray-600">—</span>
                  <span className="text-xs text-[#69C9D0] font-black uppercase tracking-widest bg-[#69C9D0]/10 px-3 py-1 rounded-full border border-[#69C9D0]/15">
                    {tabsData[activeTab].tag}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {tabsData[activeTab].heading.split(' ').map((word, i) => (
                    <span key={i} className={word.toLowerCase() === 'antes' || word.toLowerCase() === 'sempre' || word.toLowerCase() === 'vozes' || word.toLowerCase() === 'completo' || word.toLowerCase() === 'alto' ? 'text-[#FE2C55]' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h3>

                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {tabsData[activeTab].description}
                </p>

                {/* Checked features list */}
                <ul className="space-y-3 pt-4">
                  {tabsData[activeTab].highlights.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                      <div className="w-5 h-5 rounded-full bg-[#FE2C55]/10 border border-[#FE2C55]/25 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#FE2C55]" strokeWidth={3} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: High Fidelity Mockups Container */}
          <div className="lg:col-span-7 w-full">
            <div className="relative bg-[#09080F]/80 border border-white/[0.05] rounded-[32px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden aspect-auto min-h-[500px] flex flex-col justify-between">
              
              <div className="absolute inset-0 bg-radial-gradient(circle_at_top,rgba(105,201,208,0.03)_0%,transparent_70%) pointer-events-none" />
              
              {/* Active Slide Renderer */}
              <AnimatePresence mode="wait">
                
                {/* TAB 0: VITRINE */}
                {activeTab === 0 && (
                  <motion.div
                    key="tab-vitrine"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="space-y-5 text-left h-full flex flex-col justify-between"
                  >
                    {/* Header mockup block */}
                    <div className="space-y-4">
                      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-3 border-b border-white/[0.04] pb-4">
                        <div>
                          <h4 className="text-lg font-black text-white flex items-center gap-2">
                            Produtos Virais 
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SISTEMA ONLINE • MINERANDO
                            </span>
                          </h4>
                          <p className="text-[10px] text-gray-500 font-medium">Identifique tendências de dropshipping antes dos concorrentes</p>
                        </div>

                        {/* Counts block */}
                        <div className="flex gap-2">
                          <div className="bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-xl text-center">
                            <span className="block text-[9px] text-gray-500 uppercase font-black">Novos Produtos</span>
                            <span className="text-xs font-black text-white">91</span>
                          </div>
                          <div className="bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-xl text-center">
                            <span className="block text-[9px] text-gray-500 uppercase font-black">Receita Detectada</span>
                            <span className="text-xs font-black text-[#69C9D0]">R$ 3.5M</span>
                          </div>
                        </div>
                      </div>

                      {/* Filter pills carousel & Search */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#050409] border border-white/[0.05] rounded-xl px-2.5 py-1.5 flex-1">
                          <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="text-xs text-gray-650 font-medium">leg</span>
                        </div>
                        <div className="flex gap-1 overflow-x-auto no-scrollbar py-0.5">
                          {['Favoritos', 'Beleza', 'Fitness', 'Moda & Estilo'].map((cat, i) => (
                            <span 
                              key={i} 
                              className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border tracking-wider shrink-0 select-none ${
                                cat === 'Moda & Estilo' 
                                  ? 'bg-[#FE2C55] text-white border-[#FE2C55]' 
                                  : 'bg-white/[0.02] text-gray-400 border-white/[0.05]'
                              }`}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Products list visual cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 overflow-y-auto max-h-[290px] pr-1">
                      
                      {/* Product Item 1 */}
                      <div className="bg-[#121019] border border-white/[0.04] rounded-2xl flex overflow-hidden">
                        <div className="relative w-24 h-24 shrink-0 bg-[#07050A]">
                          <img 
                            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=150" 
                            alt="Legging" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 text-[8px] bg-[#FE2C55] text-white px-1 py-0.5 rounded font-black font-mono">Moda</span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <h5 className="text-[11px] font-black text-white hover:text-[#FE2C55] transition truncate max-w-[100px]">Calças Legging Fitness</h5>
                              <button onClick={() => toggleFavorite('legging')} className="text-gray-500 hover:text-red-500 transition shrink-0">
                                <Heart className={`w-3.5 h-3.5 ${favoritesActive['legging'] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                              </button>
                            </div>
                            <p className="text-[9px] text-[#A09FB1] font-mono">200 vendas  •  1.25M views</p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-white/[0.03]">
                            <span className="text-[11px] font-black text-[#69C9D0]">R$ 43,28</span>
                            <span className="text-[9px] font-bold text-[#FE2C55] hover:underline cursor-pointer flex items-center gap-0.5">Gerar UGC <ArrowRight className="w-2 h-2" /></span>
                          </div>
                        </div>
                      </div>

                      {/* Product Item 2 */}
                      <div className="bg-[#121019] border border-white/[0.04] rounded-2xl flex overflow-hidden">
                        <div className="relative w-24 h-24 shrink-0 bg-[#07050A]">
                          <img 
                            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=150" 
                            alt="Cinta" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 text-[8px] bg-[#FE2C55] text-white px-1 py-0.5 rounded font-black font-mono">Moda</span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <h5 className="text-[11px] font-black text-white hover:text-[#FE2C55] transition truncate max-w-[100px]">Short Cinta Modeladora</h5>
                              <button onClick={() => toggleFavorite('cinta')} className="text-gray-500 hover:text-red-500 transition shrink-0">
                                <Heart className={`w-3.5 h-3.5 ${favoritesActive['cinta'] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                              </button>
                            </div>
                            <p className="text-[9px] text-[#A09FB1] font-mono">200 vendas  •  1.1M views</p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-white/[0.03]">
                            <span className="text-[11px] font-black text-[#69C9D0]">R$ 28,99</span>
                            <span className="text-[9px] font-bold text-[#FE2C55] hover:underline cursor-pointer flex items-center gap-0.5">Gerar UGC <ArrowRight className="w-2 h-2" /></span>
                          </div>
                        </div>
                      </div>

                      {/* Product Item 3 */}
                      <div className="bg-[#121019] border border-white/[0.04] rounded-2xl flex overflow-hidden">
                        <div className="relative w-24 h-24 shrink-0 bg-[#07050A]">
                          <img 
                            src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=150" 
                            alt="Bermuda" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 text-[8px] bg-[#FE2C55] text-white px-1 py-0.5 rounded font-black font-mono">Moda</span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <h5 className="text-[11px] font-black text-white hover:text-[#FE2C55] transition truncate max-w-[100px]">Bermudas 3 Dry Fit</h5>
                              <button onClick={() => toggleFavorite('bermuda')} className="text-gray-500 hover:text-red-500 transition shrink-0">
                                <Heart className={`w-3.5 h-3.5 ${favoritesActive['bermuda'] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                              </button>
                            </div>
                            <p className="text-[9px] text-[#A09FB1] font-mono">120 vendas  •  640K views</p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-white/[0.03]">
                            <span className="text-[11px] font-black text-[#69C9D0]">R$ 41,50</span>
                            <span className="text-[9px] font-bold text-[#FE2C55] hover:underline cursor-pointer flex items-center gap-0.5">Gerar UGC <ArrowRight className="w-2 h-2" /></span>
                          </div>
                        </div>
                      </div>

                      {/* Product Item 4 */}
                      <div className="bg-[#121019] border border-white/[0.04] rounded-2xl flex overflow-hidden">
                        <div className="relative w-24 h-24 shrink-0 bg-[#07050A]">
                          <img 
                            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=150" 
                            alt="Vestido" 
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 text-[8px] bg-[#FE2C55] text-white px-1 py-0.5 rounded font-black font-mono">Moda</span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5">
                            <div className="flex justify-between items-start gap-1">
                              <h5 className="text-[11px] font-black text-white hover:text-[#FE2C55] transition truncate max-w-[100px]">Kit 2 Vestidos Shorts</h5>
                              <button onClick={() => toggleFavorite('vestido')} className="text-gray-500 hover:text-red-500 transition shrink-0">
                                <Heart className={`w-3.5 h-3.5 ${favoritesActive['vestido'] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                              </button>
                            </div>
                            <p className="text-[9px] text-[#A09FB1] font-mono">165 vendas  •  990K views</p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-white/[0.03]">
                            <span className="text-[11px] font-black text-[#69C9D0]">R$ 31,90</span>
                            <span className="text-[9px] font-bold text-[#FE2C55] hover:underline cursor-pointer flex items-center gap-0.5">Gerar UGC <ArrowRight className="w-2 h-2" /></span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Meta sync information */}
                    <div className="bg-[#050409] p-3 text-center border-t border-white/[0.03] rounded-xl flex items-center justify-between text-[10px]">
                      <span className="text-gray-500 font-mono">PRÓXIMA ATUALIZAÇÃO REORGANIZADA DE HORA EM HORA EM:</span>
                      <strong className="text-[#FE2C55] font-mono font-bold tracking-wider animate-pulse">05:32:02</strong>
                    </div>
                  </motion.div>
                )}

                {/* TAB 1: AVATARES */}
                {activeTab === 1 && (
                  <motion.div
                    key="tab-avatares"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="space-y-4 text-left h-full flex flex-col justify-between"
                  >
                    {/* Header mockup block */}
                    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
                      <div>
                        <h4 className="text-lg font-black text-white">Influencer Studio</h4>
                        <p className="text-[10px] text-gray-500">Escolha um avatar profissional ou use foto própria IA</p>
                      </div>

                      {/* Count badges / CTAs */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-black bg-[#9945FF]/10 text-[#9945FF] px-2.5 py-1 rounded-full border border-[#9945FF]/20">
                          Meus Avatares (1)
                        </span>
                        <button className="bg-[#FE2C55] hover:bg-[#E01E45] text-white text-[9px] font-black px-2.5 py-1 rounded-full border-none cursor-pointer">
                          Criar do Zero
                        </button>
                      </div>
                    </div>

                    {/* Filter categories tags */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {['Todos', 'Feminino', 'Masculino'].map((cat, i) => (
                        <span 
                          key={i} 
                          className={`text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border tracking-wider shrink-0 cursor-pointer select-none ${
                            cat === 'Todos' 
                              ? 'bg-[#FE2C55]/10 text-[#FE2C55] border-[#FE2C55]/25' 
                              : 'bg-white/[0.01] text-gray-400 border-white/[0.04]'
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Avatars Cards Grid (6 items) exactly matches the screenshot style */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-2 overflow-y-auto max-h-[300px]">
                      
                      {[
                        { id: 'giovana', name: 'Giovana', desc: 'Casual / Lifestyle', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' },
                        { id: 'beatriz', name: 'Beatriz', desc: 'Casual (Óculos de Grau)', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
                        { id: 'clara', name: 'Clara', desc: 'Casual / Lifestyle', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
                        { id: 'yasmin', name: 'Yasmin', desc: 'Elegante / Estilo', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
                        { id: 'valentina', name: 'Valentina', desc: 'Premium / Clean', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
                        { id: 'aurora', name: 'Aurora', desc: 'Executivo / Social', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150' }
                      ].map((av) => (
                        <div 
                          key={av.id}
                          onClick={() => setSelectedAvatar(av.id)}
                          className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 border shadow ${
                            selectedAvatar === av.id 
                              ? 'border-[#FE2C55] ring-2 ring-[#FE2C55]/25 scale-[1.02]' 
                              : 'border-white/[0.04]'
                          }`}
                        >
                          <img 
                            src={av.img} 
                            alt={av.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                            <span className="block text-[11px] font-black text-white">{av.name}</span>
                            <span className="block text-[8px] text-gray-400 font-medium">{av.desc}</span>
                          </div>
                          
                          {selectedAvatar === av.id && (
                            <span className="absolute top-2 right-2 bg-[#FE2C55] text-white p-1 rounded-full">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                            </span>
                          )}
                        </div>
                      ))}

                    </div>
                  </motion.div>
                )}

                {/* TAB 2: REVOLUÇÃO */}
                {activeTab === 2 && (
                  <motion.div
                    key="tab-revolucao"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="space-y-4 text-left h-full flex flex-col justify-between"
                  >
                    {/* Header mockup block */}
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                      <div>
                        <h4 className="text-lg font-black text-white">Voice & Dubbing Studio</h4>
                        <p className="text-[10px] text-gray-500">Gere locuções com timbres ultra realistas de conversão</p>
                      </div>
                      <span className="text-[9px] font-mono text-[#69C9D0] bg-[#69C9D0]/10 border border-[#69C9D0]/20 px-2.5 py-0.5 rounded uppercase font-black">
                        ElevenLabs V2 Act
                      </span>
                    </div>

                    {/* Interactive Selector voice catalog list */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {[
                        { id: 'vitor', name: 'Vítor - Vendedor Premium', lang: 'Português (BR)', type: 'Entonação Comercial Agressiva', quote: 'Mano, olha o resultado desse produto depois de 3 dias de uso diário!' },
                        { id: 'ju', name: 'Ju - Afiliada Expressiva', lang: 'Português (BR)', type: 'Estilo Recomendação Realista', quote: 'Amiga, eu já testei todas as cintas da vida, mas essa aqui mudou meu look.' },
                        { id: 'renan', name: 'Renan - Urgência Orgânico', lang: 'Português (BR)', type: 'Estilo Entusiasta do TikTok', quote: 'Não compre antes de assistir esse vídeo! O estoque da distribuidora tá zerando!' },
                        { id: 'clara-voz', name: 'Clara - Locutora Soft Clean', lang: 'Português (BR)', type: 'Estilo Comercial Amigável', quote: 'Sua rotina de treinos nunca mais será a mesma com esse kit legging.' }
                      ].map((vc) => (
                        <div 
                          key={vc.id}
                          onClick={() => setSelectedVoice(vc.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                            selectedVoice === vc.id 
                              ? 'bg-[#FE2C55]/10 border-[#FE2C55]/30' 
                              : 'bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{vc.name}</span>
                              <span className="text-[8px] bg-white/[0.05] text-gray-400 px-1.5 py-0.5 rounded font-mono">{vc.lang}</span>
                            </div>
                            <span className="block text-[9px] text-[#69C9D0] font-bold">{vc.type}</span>
                            <span className="block text-[10px] italic text-gray-450 truncate max-w-[280px]">"{vc.quote}"</span>
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayVoice(vc.id);
                            }}
                            className={`p-2.5 rounded-full flex items-center justify-center shrink-0 border transition ${
                              selectedVoice === vc.id && isPlayingVoice 
                                ? 'bg-emerald-500 scale-105 border-emerald-400 text-white' 
                                : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-gray-300'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Active waveform simulator */}
                    <div className="bg-[#050409] p-4 text-left border-t border-white/[0.03] rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Volume2 className="w-3.5 h-3.5 text-[#FE2C55]" />
                          {isPlayingVoice ? 'REPRODUZINDO TIMBRE IA...' : 'SELECIONE E CLIQUE NO PLAY PARA ESCUTAR'}
                        </span>
                        <span>0:03 / 0:30</span>
                      </div>
                      <div className="flex items-end gap-1 h-8 pt-2">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const isHighlighted = isPlayingVoice;
                          const heightValue = isPlayingVoice 
                            ? Math.sin(i * 0.5 + Date.now() * 0.1) * 14 + 16 
                            : Math.sin(i * 0.3) * 5 + 8;
                          return (
                            <span 
                              key={i}
                              className={`flex-1 rounded-sm transition-all duration-200 ${isHighlighted ? 'bg-gradient-to-t from-[#FE2C55] to-[#69C9D0]' : 'bg-white/[0.1]'}`}
                              style={{ height: `${Math.max(4, heightValue)}px` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: FLUXO */}
                {activeTab === 3 && (
                  <motion.div
                    key="tab-fluxo"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="space-y-5 text-left h-full flex flex-col justify-between"
                  >
                    {/* Header mockup block */}
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                      <div>
                        <h4 className="text-lg font-black text-white">Pipeline de Criação Express</h4>
                        <p className="text-[10px] text-gray-500">Unificação inteligente de roteiro, avatar e narração em 1-Clique</p>
                      </div>
                      <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded uppercase font-black">Esteira Ativa</div>
                    </div>

                    {/* Progress Stages timeline */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-300">
                        <span>Status da Renderização:</span>
                        <span className="text-[#FE2C55] font-mono">{progressValue}% Concluído</span>
                      </div>
                      
                      {/* Interactive Progress Bar */}
                      <div className="h-4 bg-[#050409] border border-white/[0.04] p-0.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[#FE2C55] via-[#FF5F7E] to-[#69C9D0] transition-all duration-300"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>

                      {/* Video clips tracks visual list mockup */}
                      <div className="space-y-2">
                        {[
                          { step: '01', title: 'Hook / Gancho Psicológico', status: 'Concluído', time: '0.0s - 3.0s', color: 'border-l-[#FE2C55]' },
                          { step: '02', title: 'Apresentação & Dores do Cliente', status: progressValue > 40 ? 'Concluído' : 'Sincronizando', time: '3.0s - 15.0s', color: 'border-l-[#69C9D0]' },
                          { step: '03', title: 'Chamada Pró-Ação (CTA)', status: 'Fila de Processamento', time: '15.0s - 30.0s', color: 'border-l-slate-600' }
                        ].map((trk, i) => (
                          <div 
                            key={i}
                            className={`p-3 bg-white/[0.01] border border-white/[0.03] border-l-4 ${trk.color} rounded-r-xl flex items-center justify-between`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-gray-500">Parte {trk.step} • {trk.time}</span>
                              <h5 className="text-xs font-black text-white">{trk.title}</h5>
                            </div>

                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              trk.status === 'Concluído' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : trk.status === 'Sincronizando' 
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse' 
                                : 'bg-white/[0.03] text-gray-550 border border-white/[0.05]'
                            }`}>
                              {trk.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: TOKEDITOR */}
                {activeTab === 4 && (
                  <motion.div
                    key="tab-tokeditor"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="space-y-4 text-left h-full flex flex-col justify-between"
                  >
                    {/* Header mockup block */}
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                      <div>
                        <h4 className="text-lg font-black text-white">TokEditor Pro</h4>
                        <p className="text-[10px] text-gray-500">Insira legendas de alta conversão neon e progresso</p>
                      </div>
                      <span className="text-[9px] font-mono text-[#FE2C55] bg-[#FE2C55]/10 border border-[#FE2C55]/20 px-2.5 py-0.5 rounded uppercase font-black">
                        Preset Tik-Tok
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-1 select-none">
                      
                      {/* Left: Video Player Mockup */}
                      <div className="relative aspect-[9/16] h-[250px] bg-slate-950 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl mx-auto flex flex-col justify-between p-3.5 group">
                        
                        {/* Gradient backdrop background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 z-0" />
                        <img 
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200" 
                          alt="Model Video" 
                          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
                        />

                        {/* Top indicators */}
                        <div className="relative z-10 flex justify-between items-center w-full">
                          <span className="text-[7px] bg-[#FE2C55] text-white px-2 py-0.5 rounded uppercase font-black">Ao Vivo</span>
                          <span className="text-[8px] font-mono text-gray-300">0:14</span>
                        </div>

                        {/* Massive Glowing Caption Overlay exactly like screenshot style */}
                        <div className="relative z-10 text-center space-y-1">
                          <span className={`text-base font-black px-2 pb-0.5 tracking-wider rounded uppercase flex items-center justify-center font-sans shadow-lg inline-block ${
                            captionStyle === 'yellow' 
                              ? 'bg-yellow-400 text-black border border-yellow-500 shadow-yellow-400/20' 
                              : captionStyle === 'green' 
                              ? 'bg-[#69C9D0] text-black border border-[#69C9D0] shadow-[#69C9D0]/20' 
                              : 'bg-white text-black border border-white shadow-white/10'
                          }`}>
                            MUDE SEU ESTILO!
                          </span>
                        </div>

                        {/* Bottom neon progress bar indicator and profile marker */}
                        <div className="relative z-10 space-y-1">
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-[#FE2C55] border-white/20 flex items-center justify-center text-[7px] font-bold text-white shrink-0">@</div>
                            <span className="text-[8px] font-bold text-white truncate max-w-[100px]">@projetovitao</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-1 bg-white/25 rounded-full overflow-hidden">
                            <div className="h-full bg-[#FE2C55] rounded-full w-2/3 shadow-[0_0_8px_#FE2C55]" />
                          </div>
                        </div>
                      </div>

                      {/* Right: Captions preset selectors and features */}
                      <div className="space-y-3.5">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Estilos de Legendas</span>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={() => setCaptionStyle('yellow')}
                            className={`p-2 rounded-xl text-left border flex items-center justify-between text-xs font-black transition cursor-pointer ${
                              captionStyle === 'yellow' ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-[#0E0B13]/30 border-white/[0.04] text-gray-450 hover:border-white/10'
                            }`}
                          >
                            <span>Estilo Amarelo Neon</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          </button>

                          <button 
                            onClick={() => setCaptionStyle('green')}
                            className={`p-2 rounded-xl text-left border flex items-center justify-between text-xs font-black transition cursor-pointer ${
                              captionStyle === 'green' ? 'bg-[#69C9D0]/10 border-[#69C9D0] text-[#69C9D0]' : 'bg-[#0E0B13]/30 border-white/[0.04] text-gray-450 hover:border-white/10'
                            }`}
                          >
                            <span>Estilo Verde Elétrico</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#69C9D0]" />
                          </button>

                          <button 
                            onClick={() => setCaptionStyle('white')}
                            className={`p-2 rounded-xl text-left border flex items-center justify-between text-xs font-black transition cursor-pointer ${
                              captionStyle === 'white' ? 'bg-white/10 border-white text-white' : 'bg-[#0E0B13]/30 border-white/[0.04] text-gray-450 hover:border-white/10'
                            }`}
                          >
                            <span>Estilo Branco Sólido</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-white" />
                          </button>
                        </div>

                        {/* Interactive sound track toggle list */}
                        <div className="p-3 bg-[#050409] border border-white/[0.04] rounded-xl flex items-center justify-between text-[10px] text-gray-400">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-450 font-bold">♪ Som de Fundo Ativo</span>
                          </div>
                          <span className="text-white hover:underline cursor-pointer">Trocar trilha</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Bottom Custom Navigation Dock menu shown in user first image */}
              <div className="border-t border-white/[0.04] pt-5 mt-4">
                <div className="flex flex-wrap items-center justify-center gap-2 bg-[#050409]/95 border border-white/[0.05] p-2 rounded-2xl max-w-xl mx-auto shadow-2xl">
                  
                  {['VITRINE', 'AVATARES', 'REVOLUÇÃO', 'FLUXO', 'TOKEDITOR'].map((tb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-350 cursor-pointer select-none border flex items-center gap-1.5 ${
                        activeTab === idx 
                          ? 'bg-[#FE2C55] text-white border-[#FE2C55] font-black shadow-lg shadow-[#FE2C55]/20 scale-103' 
                          : 'bg-white/[0.01] text-gray-400 border-transparent hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{tb}</span>
                    </button>
                  ))}

                </div>
              </div>

            </div>
          </div>

        </div>

        {/* -------------------- DYNAMIC SHOWCASE SECTION (Image 3) -------------------- */}
        <div className="pt-20 border-t border-white/[0.04] text-center space-y-12">
          
          {/* Title group */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest bg-[#FE2C55]/10 px-3 py-1 rounded-full border border-[#FE2C55]/20">
              SHOWCASE
            </span>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Vídeos que <span className="bg-gradient-to-r from-[#FE2C55] to-[#FF5F7E] bg-clip-text text-transparent">convertem.</span>
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Conteúdo gerado por criadores que usam a plataforma para escalar resultados.
            </p>
          </div>

          {/* Horizontal reels/tiktok grid mimicking image 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {[
              { 
                id: 1, 
                title: 'Gancho Vestuário Brasil', 
                views: '1.2M views', 
                imgUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Beijo%20+%20CTA.mp4',
                videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Beijo%20+%20CTA.mp4',
                tag: 'Moda' 
              },
              { 
                id: 2, 
                title: 'Lifestyle Fit Selfie', 
                views: '984K views', 
                imgUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Girl_stepping_forward_with_clothing_202606281557.mp4',
                videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Girl_stepping_forward_with_clothing_202606281557.mp4',
                tag: 'Academia' 
              },
              { 
                id: 3, 
                title: 'Checked Dress Review', 
                views: '1.4M views', 
                imgUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Person_presenting_clothing_POV_202606281521.mp4',
                videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Person_presenting_clothing_POV_202606281521.mp4',
                tag: 'Dicas' 
              },
              { 
                id: 4, 
                title: 'Estilo Premium OOTD', 
                views: '870K views', 
                imgUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Tapar%20Camera.mp4',
                videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Tapar%20Camera.mp4',
                tag: 'Review' 
              }
            ].map((rc) => (
              <div 
                key={rc.id}
                className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-slate-900 border border-white/[0.04] transition duration-500 hover:border-[#FE2C55]/40 hover:scale-[1.02] shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between p-5"
              >
                {/* Background image/video cover */}
                <div className="absolute inset-0 z-0">
                  {rc.videoUrl ? (
                    <video 
                      src={rc.videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <img 
                      src={rc.imgUrl} 
                      alt={rc.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/25 z-10" />
                </div>

                {/* Top header on card */}
                <div className="relative z-20 flex justify-between items-center">
                  <span className="text-[8px] bg-black/40 backdrop-blur-md text-white font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10">
                    {rc.tag}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-[#FE2C55]/20 backdrop-blur-md flex items-center justify-center text-[#FE2C55] border border-[#FE2C55]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55] animate-ping" />
                  </div>
                </div>

                {/* Simulated center Play button */}
                <div className="relative z-20 self-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <div className="w-12 h-12 rounded-full bg-[#FE2C55] text-white flex items-center justify-center shadow-lg shadow-[#FE2C55]/30">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom stats overlay */}
                <div className="relative z-20 space-y-1 text-left">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-[#69C9D0]">{rc.views}</span>
                  <h4 className="text-xs font-black text-white leading-tight truncate group-hover:text-[#FE2C55] transition">{rc.title}</h4>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
