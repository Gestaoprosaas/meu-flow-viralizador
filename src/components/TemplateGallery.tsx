import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  CheckCircle2, 
  X,
  AlertCircle,
  User,
  Palette,
  Eye,
  Shirt,
  Video,
  Shuffle,
  Camera,
  Check,
  Copy,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { influencerTemplates, InfluencerTemplate } from '../data/influencerTemplates';
import InfluencerCard from './InfluencerCard';
import { useCopyPrompt } from '../hooks/useCopyPrompt';

interface TemplateGalleryProps {
  onNavigate?: (path: string) => void;
}

export default function TemplateGallery({ onNavigate }: TemplateGalleryProps) {
  // Navigation tabs for predefined vs custom manual creator
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'custom'>('library');

  const [allTemplates, setAllTemplates] = useState<InfluencerTemplate[]>(influencerTemplates);

  useEffect(() => {
    const getUnsplashId = (url: string) => {
      if (!url) return '';
      const match = url.match(/photo-([a-zA-Z0-9-]+)/);
      return match ? match[1] : '';
    };

    const loadCustomAvatars = async () => {
      let customList: any[] = [];
      
      // 1. Try to load from localStorage first for instant responsiveness
      try {
        const saved = localStorage.getItem('local_avatars_presets');
        if (saved) {
          customList = JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Error parsing local avatars:", e);
      }

      // 2. Try to fetch from server
      try {
        const res = await fetch('/api/avatars');
        if (res.ok) {
          const serverList = await res.json();
          if (serverList && serverList.length > 0) {
            customList = serverList;
          }
        }
      } catch (err) {
        console.warn("Could not fetch custom avatars:", err);
      }

      if (!customList || customList.length === 0) {
        setAllTemplates(influencerTemplates);
        return;
      }

      // Default avatars definition to match Unsplash IDs
      const DEFAULT_MAP = [
        { id: 'giovanna', name: 'Giovanna', defaultUnsplash: '1524504388940-b1c1722653e1' },
        { id: 'beatriz', name: 'Beatriz', defaultUnsplash: '1544005313-94ddf0286df2' },
        { id: 'clara', name: 'Clara', defaultUnsplash: '1517841905240-472988babdf9' },
        { id: 'theresa', name: 'Theresa', defaultUnsplash: '1494790108377-be9c29b29330' },
        { id: 'valentina', name: 'Valentina', defaultUnsplash: '1534528741775-53994a69daeb' },
        { id: 'aurora', name: 'Aurora', defaultUnsplash: '1508214751196-bcfd4ca60f91' },
        { id: 'rafael', name: 'Rafael', defaultUnsplash: '1500648767791-00dcc994a43e' },
        { id: 'caio', name: 'Caio', defaultUnsplash: '1539571696357-5a69c17a67c6' },
        { id: 'davi', name: 'Davi', defaultUnsplash: '1507003211169-0a1dd7228f2d' },
        { id: 'lucas', name: 'Lucas', defaultUnsplash: '1506794778202-cad84cf45f1d' },
        { id: 'aisha', name: 'Aisha', defaultUnsplash: '1531123897727-8f129e1688ce' }
      ];

      // Map influencerTemplates, replacing image and details if matched
      const updated = influencerTemplates.map(template => {
        const templateUnsplash = getUnsplashId(template.image);
        const matchedPersona = DEFAULT_MAP.find(p => p.defaultUnsplash === templateUnsplash || template.name.toLowerCase().includes(p.name.toLowerCase()));
        
        if (matchedPersona) {
          const customAvatar = customList.find(c => c.id === matchedPersona.id || c.name.toLowerCase() === matchedPersona.name.toLowerCase());
          if (customAvatar) {
            return {
              ...template,
              name: template.name.replace(matchedPersona.name, customAvatar.name),
              description: customAvatar.description || template.description,
              image: customAvatar.imageUrl || template.image,
              prompt: template.prompt.replace(new RegExp(matchedPersona.name, 'g'), customAvatar.name)
            };
          }
        }
        return template;
      });

      // Check if there are completely custom avatars to append
      customList.forEach(custom => {
        const isDefault = DEFAULT_MAP.some(p => p.id === custom.id || p.name.toLowerCase() === custom.name.toLowerCase());
        if (!isDefault) {
          const isMale = custom.gender === 'MASCULINO';
          updated.push({
            id: custom.id,
            name: `${custom.name} - Customizado 🎨`,
            category: isMale ? 'Masculino Lifestyle' : 'Feminino Lifestyle',
            description: custom.description || 'Avatar customizado na aba Configurações.',
            image: custom.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
            tags: [isMale ? 'Masculino' : 'Feminino', 'Customizado', 'Configurações'],
            prompt: custom.promptText || `Professional 8K lifestyle portrait photography of ${custom.name}. ${custom.description || 'Stunning presentation, photorealistic skin rendering, soft natural light.'}`
          });
        }
      });

      setAllTemplates(updated);
    };

    loadCustomAvatars();

    const handleSettingsUpdate = () => {
      loadCustomAvatars();
    };
    window.addEventListener('realtime-db-update' as any, handleSettingsUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleSettingsUpdate);
    };
  }, []);

  // Predefined Library State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { copiedId, copyPrompt } = useCopyPrompt();

  // Custom Manual Creator State
  const [customGender, setCustomGender] = useState('Feminino');
  const [customAge, setCustomAge] = useState('24 anos');
  const [customSkin, setCustomSkin] = useState('Bronzeada');
  const [customHair, setCustomHair] = useState('Castanho escuro');
  const [customHairStyle, setCustomHairStyle] = useState('Longo ondulado com volume natural');
  const [customEyes, setCustomEyes] = useState('Castanhos mel');
  const [customClothing, setCustomClothing] = useState('Blazer minimalista preto de alfaiataria com colar fino');
  const [customScenario, setCustomScenario] = useState('Cobertura de luxo moderna com vista para o horizonte ao pôr do sol');
  const [customMood, setCustomMood] = useState('Fotografia editorial de moda, luz solar dourada natural de fim de tarde');
  const [customPose, setCustomPose] = useState('Sorriso sutil e confiante, olhando de lado para o cenário');

  // Predefined library filter options
  const filterOptions = [
    'Todos',
    'Feminino Lifestyle',
    'Masculino Lifestyle',
    'Premium',
    'Loira',
    'Morena',
    'Ruiva'
  ];

  // Manual Creator predefined choices arrays for simple clicks
  const optionSkin = [
    { label: 'Clara / Branca', color: '#FFE0C4' },
    { label: 'Bronzeada', color: '#D49B74' },
    { label: 'Negra / Escura', color: '#5C3826' },
    { label: 'Parda', color: '#A06B4C' },
    { label: 'Amarela / Asiática', color: '#F1D4AF' },
    { label: 'Retinta', color: '#2B1710' }
  ];
  const optionHair = [
    { label: 'Loira', color: '#E8C56A' },
    { label: 'Morena / Castanho', color: '#4A3123' },
    { label: 'Preta', color: '#1A1A1A' },
    { label: 'Ruiva', color: '#B03A1E' },
    { label: 'Platinada', color: '#E8E8E8' },
    { label: 'Grisalha', color: '#A8A8A8' }
  ];
  const optionEyes = [
    { label: 'Castanhos mel', color: '#B38B40' },
    { label: 'Castanhos escuros', color: '#3E2723' },
    { label: 'Verdes', color: '#385F47' },
    { label: 'Azuis', color: '#4B7B9C' },
    { label: 'Pretos intensos', color: '#111111' }
  ];
  const optionHairStyle = [
    { label: 'Longo ondulado com volume natural', icon: '〰️' },
    { label: 'Curto moderno estilo Bob desfiado', icon: '✂️' },
    { label: 'Crespo volumoso e poderoso', icon: '✨' },
    { label: 'Cacheado longo brilhante', icon: '➰' },
    { label: 'Coque despojado elegante', icon: '🎀' },
    { label: 'Liso escorrido e brilhante', icon: '➖' }
  ];
  const optionClothing = [
    { label: 'Blazer minimalista preto de alfaiataria com colar fino', icon: '👔' },
    { label: 'Terno de linho azul marinho impecável', icon: '🕴️' },
    { label: 'Vestido de seda vermelha sofisticado', icon: '👗' },
    { label: 'Camiseta branca premium com colar dourado', icon: '👕' },
    { label: 'Jaqueta de couro moderna com joias de prata', icon: '🧥' },
    { label: 'Suéter aconchegante de cashmere off-white', icon: '🧣' }
  ];
  const optionScenario = [
    { label: 'Cobertura de luxo moderna com vista para o horizonte ao pôr do sol', icon: '🌆' },
    { label: 'Interior em couro de carro esportivo importado de luxo', icon: '🏎️' },
    { label: 'Cafeteria italiana rústica e sofisticada com vasos floridos', icon: '☕' },
    { label: 'Escritório presidencial moderno com vidro panorâmico', icon: '💼' },
    { label: 'Estúdio minimalista com fundo neutro bege estético', icon: '🎬' },
    { label: 'Praia tropical paradisíaca ao entardecer com coqueiros ao fundo', icon: '🏝️' }
  ];
  const optionMood = [
    { label: 'Fotografia editorial de moda, luz solar dourada natural de fim de tarde', icon: '🌅' },
    { label: 'Luz de estúdio profissional extremamente suave e difusa', icon: '💡' },
    { label: 'Iluminação neon cyberpunk dramática com tons de rosa e azul', icon: '🌃' },
    { label: 'Luz de janela suave lateral com sombras suaves e poéticas', icon: '🪟' }
  ];
  const optionPose = [
    { label: 'Sorriso sutil e confiante, olhando de lado para o cenário', icon: '😏' },
    { label: 'Olhar focado e penetrante diretamente para a câmera', icon: '📸' },
    { label: 'Expressão séria e decidida com pose executiva', icon: '🧐' },
    { label: 'Sorriso espontâneo descontraído com pose de selfie casual', icon: '🤳' }
  ];

  // Predefined lists for easy generation template trigger
  const handleRandomize = () => {
    const genders = ['Feminino', 'Masculino'];
    const ages = ['21 anos', '24 anos', '28 anos', '32 anos'];
    
    setCustomGender(genders[Math.floor(Math.random() * genders.length)]);
    setCustomAge(ages[Math.floor(Math.random() * ages.length)]);
    setCustomSkin(optionSkin[Math.floor(Math.random() * optionSkin.length)].label);
    setCustomHair(optionHair[Math.floor(Math.random() * optionHair.length)].label);
    setCustomHairStyle(optionHairStyle[Math.floor(Math.random() * optionHairStyle.length)].label);
    setCustomEyes(optionEyes[Math.floor(Math.random() * optionEyes.length)].label);
    setCustomClothing(optionClothing[Math.floor(Math.random() * optionClothing.length)].label);
    setCustomScenario(optionScenario[Math.floor(Math.random() * optionScenario.length)].label);
    setCustomMood(optionMood[Math.floor(Math.random() * optionMood.length)].label);
    setCustomPose(optionPose[Math.floor(Math.random() * optionPose.length)].label);
  };

  // Dynamic filter and search logic for templates library
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((template) => {
      // 1. Category Filter Match
      let matchesFilter = true;
      if (selectedFilter !== 'Todos') {
        const lowerFilter = selectedFilter.toLowerCase();
        
        if (lowerFilter === 'premium') {
          matchesFilter = template.tags.some(t => t.toLowerCase() === 'premium') || 
                          template.category.toLowerCase().includes('premium');
        } else if (['loira', 'morena', 'ruiva'].includes(lowerFilter)) {
          matchesFilter = template.tags.some(t => t.toLowerCase() === lowerFilter);
        } else {
          matchesFilter = template.category.toLowerCase() === lowerFilter;
        }
      }

      // 2. Search Query Match
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const inName = template.name.toLowerCase().includes(query);
        const inDesc = template.description.toLowerCase().includes(query);
        const inCategory = template.category.toLowerCase().includes(query);
        const inTags = template.tags.some(tag => tag.toLowerCase().includes(query));
        
        matchesSearch = inName || inDesc || inCategory || inTags;
      }

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery, allTemplates]);

  // Dynamically constructed custom prompt based on state options selected
  const generatedCustomPrompt = useMemo(() => {
    const isFemale = customGender.toLowerCase() === 'feminino';
    const genderTerm = isFemale ? 'female Brazilian influencer' : 'male Brazilian influencer';
    const subjectPrefix = isFemale ? 'An attractive' : 'A handsome';
    
    return `Ultra-realistic 8K photorealistic portrait of ${subjectPrefix.toLowerCase()} ${customAge} ${genderTerm}. 

Physical appearance details:
- Skin tone: ${customSkin} skin texture, highly detailed with realistic skin pores, micro-creases, and natural daylight reflections.
- Hair: ${customHair} hair color, styled beautifully as ${customHairStyle}.
- Eyes: Incredibly detailed ${customEyes} eyes with natural catchlights and realistic reflections.
- Pose & Expression: ${customPose}.

Clothing and fashion:
- Outfit style: Wearing a ${customClothing}.

Setting and composition:
- Location/Scenario: Perfectly integrated into a ${customScenario}.
- Lighting & Camera parameters: ${customMood}. Impeccable depth of field, circular background bokeh, captured on high-end 85mm portrait lens, f/1.4 aperture, warm professional color grading, cinematic shadows, authentic non-filtered photo quality.`;
  }, [customGender, customAge, customSkin, customHair, customHairStyle, customEyes, customClothing, customScenario, customMood, customPose]);

  const handleCopyPredefined = (template: InfluencerTemplate) => {
    copyPrompt(template.id, template.prompt, () => {
      setToastMessage(`Prompt do avatar "${template.name}" copiado com sucesso!`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });
  };

  const handleCopyCustom = () => {
    // ID 999 used as a pseudo ID for Custom Creator
    copyPrompt(999, generatedCustomPrompt, () => {
      setToastMessage('✓ Prompt customizado copiado com sucesso para a área de transferência!');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    });
  };

  return (
    <div className="space-y-8 pb-12" id="premium-influencers-gallery">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#10B981] border border-[#10B981]/30 text-black px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)} 
              className="ml-3 hover:opacity-80 transition"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section with TikTok-inspired dark premium aesthetics */}
      <div className="relative bg-[#010101] border border-[#1E1E2E] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE2C55]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#25F4EE]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-[#FE2C55] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Novidade Premium
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Avatar Studio Premium
            </h1>
            <p className="text-sm text-[#8888AA] leading-relaxed">
              Crie influenciadores virtuais em cenários premium com prompts calibrados e cópia em um clique, ou configure os traços faciais, cabelos, olhos e cenários manualmente.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto bg-[#0A0A0F]/80 p-3 border border-[#1E1E2E] rounded-2xl">
            <Users className="w-8 h-8 text-[#25F4EE] animate-pulse" />
            <div className="text-left">
              <span className="block text-xs text-[#8888AA] font-bold uppercase tracking-wide">Acervo Atual</span>
              <span className="block text-lg font-black text-white leading-none">
                {allTemplates.length} Modelos + Criador Manual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-TABS TO SELECT PREDEFINED VS MANUAL CUSTOM CREATOR */}
      <div className="flex flex-wrap bg-[#050508] border border-[#1E1E2E] p-1.5 rounded-2xl max-w-lg">
        <button
          onClick={() => setActiveSubTab('library')}
          className={`flex-1 py-3 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2.5 ${
            activeSubTab === 'library'
              ? 'bg-gradient-to-tr from-[#FE2C55] to-[#813EF6] text-white shadow-lg shadow-[#FE2C55]/15'
              : 'text-[#8888AA] hover:text-white'
          }`}
        >
          <Sparkle className="w-4 h-4" />
          Biblioteca de Modelos Prontos
        </button>
        <button
          onClick={() => setActiveSubTab('custom')}
          className={`flex-1 py-3 px-5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2.5 ${
            activeSubTab === 'custom'
              ? 'bg-gradient-to-tr from-[#FE2C55] to-[#813EF6] text-white shadow-lg shadow-[#FE2C55]/15'
              : 'text-[#8888AA] hover:text-white'
          }`}
          id="tab-custom-creator"
        >
          <Users className="w-4 h-4" />
          Criador Manual Customizado 🎨
        </button>
      </div>

      {/* TAB CONTENT RENDERING */}
      {activeSubTab === 'library' ? (
        <>
          {/* Filters and search container */}
          <div className="bg-[#050508] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Active Search bar */}
              <div className="relative flex-1 max-w-lg">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555577]">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por nome, tag ou estilo de cenário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-[#555577] focus:outline-none focus:border-[#FE2C55]/50 focus:ring-1 focus:ring-[#FE2C55]/20 transition"
                  id="search-influencer-templates"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555577] hover:text-white transition"
                    title="Limpar busca"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Helper feedback statistics */}
              <div className="text-xs text-[#8888AA] font-mono flex items-center gap-2 self-start lg:self-auto">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#25F4EE]" />
                Filtrados: <span className="text-white font-bold">{filteredTemplates.length}</span> de <span className="text-[#8888AA]">{allTemplates.length}</span> templates
              </div>
            </div>

            {/* Dynamic Horizontal Filters */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {filterOptions.map((filter) => {
                const isActive = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-gradient-to-tr from-[#FE2C55] to-[#813EF6] text-white shadow-lg shadow-[#FE2C55]/15 font-black'
                        : 'bg-[#0A0A0F] text-[#8888AA] border border-[#1E1E2E] hover:border-zinc-700 hover:text-white'
                    }`}
                    id={`filter-btn-${filter.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of cards with AnimatePresence */}
          {filteredTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0A0F]/60 border border-[#1E1E2E] p-16 text-center rounded-2xl flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Nenhum template encontrado</h3>
                <p className="text-xs text-[#8888AA] max-w-sm">
                  Tente redefinir seus filtros ou mudar os termos digitados na barra de pesquisa.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('Todos');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white hover:bg-zinc-850 transition"
              >
                Limpar Filtros e Busca
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id}>
                  <InfluencerCard
                    template={template}
                    isCopied={copiedId === template.id}
                    onCopy={() => handleCopyPredefined(template)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* MANUAL CUSTOM CREATOR VIEW */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          id="custom-manual-creator-section"
        >
          {/* LEFT SIDE: Interactive configuration options (span 7) */}
          <div className="lg:col-span-7 bg-[#050508] border border-[#1E1E2E] rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FE2C55]" /> Configurar Atributos do Avatar
                </h2>
                <p className="text-xs text-[#8888AA]">Clique nos traços abaixo para desenhar o prompt sob medida do seu avatar.</p>
              </div>
              <button
                onClick={handleRandomize}
                className="bg-[#111118] border border-[#1E1E2E] hover:border-[#FE2C55]/40 text-[#8888AA] hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="Sorteia atributos de forma randômica"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#25F4EE]" /> Randomizar
              </button>
            </div>

            {/* Demographics row: Gender and Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FE2C55]" /> Gênero do Avatar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Feminino', 'Masculino'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setCustomGender(g)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        customGender === g
                          ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                          : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#25F4EE]" /> Idade Estimada
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['21 anos', '24 anos', '28 anos'].map((a) => (
                    <button
                      key={a}
                      onClick={() => setCustomAge(a)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                        customAge === a
                          ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-white'
                          : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Traço 1: Cor da Pele (Skin Color) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-500" /> Cor da Pele / Etnia
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {optionSkin.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setCustomSkin(s.label)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customSkin === s.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: s.color }} />
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traço 2: Cor do Cabelo (Hair Color) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" /> Cor do Cabelo
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {optionHair.map((h) => (
                  <button
                    key={h.label}
                    onClick={() => setCustomHair(h.label)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customHair === h.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: h.color }} />
                    <span className="truncate">{h.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traço 3: Cor dos Olhos (Eye Color) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" /> Cor dos Olhos
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {optionEyes.map((e) => (
                  <button
                    key={e.label}
                    onClick={() => setCustomEyes(e.label)}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customEyes === e.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0 shadow-inner" style={{ backgroundColor: e.color }} />
                    <span className="truncate">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo e Volume do Cabelo (Hair style) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" /> Estilo de Corte de Cabelo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {optionHairStyle.map((hs) => (
                  <button
                    key={hs.label}
                    onClick={() => setCustomHairStyle(hs.label)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customHairStyle === hs.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                    title={hs.label}
                  >
                    <span className="text-base">{hs.icon}</span>
                    <span className="truncate">{hs.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traço 4: Roupa do Avatar (Clothing Type) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#25F4EE]" /> Estilo de Roupa & Acessórios
              </label>
              <div className="grid grid-cols-1 gap-2">
                {optionClothing.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setCustomClothing(c.label)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customClothing === c.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traço 5: Cenário / Localização (Scenario Style) */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#FE2C55]" /> Cenário Premium de Fundo
              </label>
              <div className="grid grid-cols-1 gap-2">
                {optionScenario.map((sc) => (
                  <button
                    key={sc.label}
                    onClick={() => setCustomScenario(sc.label)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customScenario === sc.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{sc.icon}</span>
                    <span className="truncate">{sc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traço 6: Iluminação e Enquadramento Camera Style */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Iluminação & Estilo de Câmera
              </label>
              <div className="grid grid-cols-1 gap-2">
                {optionMood.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setCustomMood(m.label)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customMood === m.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traço 7: Expressão & Pose */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-white uppercase tracking-wider block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" /> Expressão Facial & Pose
              </label>
              <div className="grid grid-cols-1 gap-2">
                {optionPose.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setCustomPose(p.label)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition flex items-center gap-2 ${
                      customPose === p.label
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                        : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Realtime rendered card preview and dynamic prompt box (span 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            
            {/* Visual Dynamic Card */}
            <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FE2C55]/5 to-[#813EF6]/5 pointer-events-none" />
              
              {/* Dynamic Mock Avatar Image Area */}
              <div className="aspect-[4/3] relative w-full bg-gradient-to-br from-zinc-900 to-black overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fe2c55_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated high-quality visual representation avatar */}
                <div className="text-center space-y-3 z-10 p-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#813EF6] mx-auto flex items-center justify-center shadow-lg shadow-[#FE2C55]/20">
                    <User className="w-8 h-8 text-white stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-black text-sm">Preview do Avatar Customizado</h4>
                    <p className="text-xs text-[#8888AA] max-w-xs mx-auto">
                      Gênero {customGender} • {customAge} • {customHair} • Cabelo {customHairStyle}
                    </p>
                  </div>
                </div>

                {/* Tags preview inside image */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[90%]">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-white uppercase tracking-wider">
                    {customGender}
                  </span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/80 border border-white/10 text-white uppercase tracking-wider">
                    {customSkin}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-[#25F4EE]/10 border border-[#25F4EE]/30 text-[#25F4EE] uppercase tracking-wider">
                    Gerador Customizado
                  </span>
                </div>
              </div>

              {/* Attributes Chips summary */}
              <div className="p-5 border-t border-[#1E1E2E]/60 bg-[#06060A]/80 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest text-[#8888AA]">Traços Ativos</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      👁️ Olhos: {customEyes}
                    </span>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      👔 Roupa: {customClothing.split(' ')[0]}
                    </span>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                      🎬 Fundo: {customScenario.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Prompt full string content area */}
                <div className="bg-[#020204] border border-[#161622] rounded-xl p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2 mb-2">
                    <span className="text-[10px] font-mono text-[#555577] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#25F4EE] animate-pulse" /> Prompt Customizado Gerado
                    </span>
                    <span className="text-[9px] font-mono text-[#444455]">
                      {generatedCustomPrompt.length} caracteres
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#A0A0C0] leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto select-all scrollbar-thin">
                    {generatedCustomPrompt}
                  </p>
                </div>

                {/* Action button to copy customizable generated prompt */}
                <button
                  onClick={handleCopyCustom}
                  className={`w-full py-3 px-5 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2.5 ${
                    copiedId === 999
                      ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/25'
                      : 'bg-white text-black hover:bg-[#FE2C55] hover:text-white shadow-xl hover:shadow-[#FE2C55]/15'
                  }`}
                  id="btn-copy-custom-generated-prompt"
                >
                  {copiedId === 999 ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3px]" />
                      Prompt de Geração Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Prompt Customizado
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Banner Card */}
            <div className="bg-[#0A0A0F]/50 border border-[#1E1E2E]/60 p-5 rounded-2xl space-y-2 text-left">
              <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                💡 Dica de Utilização
              </h5>
              <p className="text-xs text-[#8888AA] leading-relaxed">
                Você pode colar este prompt em ferramentas de geração de imagem de IA avançadas como Midjourney, Leonardo AI ou Stable Diffusion para obter avatares fotorrealistas de alta fidelidade e consistência!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preparação para o futuro info footer */}
      <div className="bg-[#050508]/40 border border-[#1E1E2E]/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="block text-xs font-extrabold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FE2C55]" /> Conector de Banco de Dados de Prompts
          </span>
          <span className="block text-[11px] text-[#8888AA]">
            Este módulo consome uma lista padronizada. Futuramente, você poderá vincular à tabela correspondente do Supabase sem alterar os cartões.
          </span>
        </div>
        <div className="text-xs font-mono text-[#555577] bg-black/40 px-3 py-1.5 border border-[#1E1E2E] rounded-lg">
          Data Model: InfluencerTemplate[]
        </div>
      </div>
    </div>
  );
}
