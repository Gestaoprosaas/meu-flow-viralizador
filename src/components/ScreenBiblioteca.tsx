import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Copy, 
  Check, 
  Star, 
  Smile, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Zap, 
  Sparkles,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { ViralTemplate } from '../types';

interface ScreenBibliotecaProps {
  onNavigate?: (path: string, payload?: any) => void;
}

export default function ScreenBiblioteca({ onNavigate }: ScreenBibliotecaProps) {
  const [items, setItems] = useState<ViralTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [nicheFilter, setNicheFilter] = useState<string>('all');
  const [emotionFilter, setEmotionFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Search Debouce 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch preseeded items from backend server on initial load
  const fetchLibrary = () => {
    setLoading(true);
    fetch('/api/viral-library')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar a biblioteca viral:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLibrary();

    const handleRealtimeUpdate = (event: any) => {
      fetch('/api/viral-library')
        .then(res => res.json())
        .then(data => {
          setItems(data);
        })
        .catch(err => {
          console.error("Erro no realtime-db-update da biblioteca viral:", err);
        });
    };

    window.addEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter, nicheFilter, emotionFilter, platformFilter]);

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn("Erro ao copiar para a área de transferência:", err);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUseContent = (item: ViralTemplate) => {
    // Save to localStorage for robust prefilling (works on Next.js routes and refresh)
    const prefillData = {
      productName: item.title,
      description: item.content,
      targetAudience: `Público interessado em: ${item.niche ? item.niche.toUpperCase() : 'Geral'}`,
      tone: item.emotion === 'urgência' ? 'urgente' : (item.emotion === 'curiosidade' ? 'curioso' : 'empolgante'),
      platform: item.platform === 'youtube_shorts' ? 'youtube_shorts' : (item.platform === 'reels' ? 'reels' : 'tiktok')
    };
    
    localStorage.setItem('viral_library_prefill', JSON.stringify(prefillData));

    // Call onNavigate to instantly route to forms page
    if (onNavigate) {
      onNavigate('/roteiros', {
        product_name: item.title,
        product_description: item.content,
        target_audience: `Público interessado em: ${item.niche ? item.niche.toUpperCase() : 'Geral'}`
      });
    } else {
      // Fallback
      window.location.hash = '#/roteiros';
    }
  };

  // Perform filtration logic completely
  const filteredItems = items.filter((item) => {
    const searchLower = debouncedSearch.toLowerCase();
    const matchSearch = !debouncedSearch || 
      item.title.toLowerCase().includes(searchLower) || 
      item.content.toLowerCase().includes(searchLower);
    
    const matchType = typeFilter === 'all' || item.type === typeFilter;
    const matchNiche = nicheFilter === 'all' || item.niche === nicheFilter;
    const matchEmotion = emotionFilter === 'all' || item.emotion === emotionFilter;
    
    // Normalize platform comparison in case of subtle naming variants
    const itemPlatform = item.platform?.toLowerCase() || '';
    const filterPlatform = platformFilter.toLowerCase();
    const matchPlatform = platformFilter === 'all' || 
      itemPlatform === filterPlatform || 
      (filterPlatform === 'instagram' && itemPlatform === 'reels') || 
      (filterPlatform === 'reels' && itemPlatform === 'instagram');

    return matchSearch && matchType && matchNiche && matchEmotion && matchPlatform;
  });

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.abs(Math.ceil(totalItems / ITEMS_PER_PAGE)) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Helper icons / emojis definitions
  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'hook': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'script': return 'bg-[#7C3AED]/10 text-[#A78BFA] border-[#7C3AED]/20';
      case 'cta': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'caption': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getEmotionBadge = (emotion: string) => {
    switch (emotion) {
      case 'curiosidade': return '👀 Curiosidade';
      case 'medo': return '😰 Medo/Alerta';
      case 'desejo': return '✨ Desejo';
      case 'alegria': return '🥳 Alegria';
      case 'urgência': return '🔥 Urgência';
      default: return `🧠 ${emotion}`;
    }
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#1E1E2E] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#7C3AED]" />
            Hooks/Ganchos
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA] mt-1">
            Navegue por um acervo personalizado de ganchos magnéticos de 3 segundos, estruturas virais e CTAs configurados diretamente no seu painel de administração.
          </p>
        </div>
        <button 
          onClick={fetchLibrary}
          className="self-start sm:self-center bg-[#111118] border border-[#1E1E2E] hover:border-[#7C3AED]/50 p-2.5 rounded-xl text-xs text-[#8888AA] hover:text-white transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Atualizar Lista
        </button>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 space-y-4 shadow-xl">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#8888AA] block">Filtros Avançados de Conversão</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#8888AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar termo (ganchos, segredos, marcas...)"
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-[#8888AA] outline-none focus:border-[#7C3AED] transition font-medium"
            />
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs text-white outline-none focus:border-[#7C3AED] transition"
            >
              <option value="all">Categorias (Todas)</option>
              <option value="hook">🪝 Ganchos </option>
              <option value="script">📑 Roteiros Completos</option>
              <option value="cta">📢 CTAs de Conversão</option>
              <option value="caption">🛒 Legendas e Tags</option>
            </select>
          </div>

          {/* Niche Filter */}
          <div className="lg:col-span-2">
            <select
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs text-[#F0F0FF] outline-none focus:border-[#7C3AED] transition"
            >
              <option value="all">Nichos (Todos)</option>
              <option value="geral">Geral / Amplo</option>
              <option value="beleza">Beleza & Estética 💄</option>
              <option value="tecnologia">Tecnologia & Gadgets 💻</option>
              <option value="casa">Casa & Organização 🏠</option>
              <option value="saude">Saúde & Fitness 🌿</option>
              <option value="esportes">Esportes & Acessórios 🏃</option>
            </select>
          </div>

          {/* Emotion Filter */}
          <div className="lg:col-span-2">
            <select
              value={emotionFilter}
              onChange={(e) => setEmotionFilter(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs text-[#F0F0FF] outline-none focus:border-[#7C3AED] transition"
            >
              <option value="all">Emoções (Todas)</option>
              <option value="curiosidade">👀 Curiosidade</option>
              <option value="medo">😰 Medo / Alerta</option>
              <option value="desejo">✨ Desejo / Luxo</option>
              <option value="alegria">🥳 Alegria / Humor</option>
              <option value="urgência">🔥 Urgência</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="lg:col-span-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs text-[#F0F0FF] outline-none focus:border-[#7C3AED] transition"
            >
              <option value="all">Plataformas (Todas)</option>
              <option value="tiktok">🎵 TikTok Shop</option>
              <option value="reels">📱 Instagram Reels</option>
              <option value="youtube_shorts">🎥 YouTube Shorts</option>
            </select>
          </div>

        </div>

        {/* Counter of metrics */}
        <div className="flex items-center justify-between text-[11px] text-[#8888AA] pt-1">
          <span>Encontrados: <strong className="text-white">{filteredItems.length} copiados</strong></span>
          <span>Exibindo página <strong className="text-white">{currentPage}</strong> de {totalPages}</span>
        </div>
      </div>

      {/* Copywriting Templates Grid */}
      {loading ? (
        <div className="py-24 text-center bg-[#111118]/40 border border-[#1E1E2E] rounded-2xl flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-10 h-10 text-[#7C3AED] animate-spin" />
          <p className="text-xs text-[#8888AA]">Consultando rede neural do acervo...</p>
        </div>
      ) : paginatedItems.length === 0 ? (
        <div className="text-center py-20 bg-[#111118]/40 border border-[#1E1E2E] rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
          <BookOpen className="w-12 h-12 text-[#1E1E2E]" />
          <p className="text-xs text-[#8888AA] max-w-sm leading-relaxed">
            Nenhum modelo estético de cópia se encaixa com as filtragens selecionadas. Redefina os filtros ou limpe os campos de pesquisa para reiniciar.
          </p>
          <button 
            type="button" 
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
              setNicheFilter('all');
              setEmotionFilter('all');
              setPlatformFilter('all');
            }}
            className="px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white text-xs font-semibold rounded-xl transition"
          >
            Limpar Filtros e Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#111118] border border-[#1E1E2E]/80 hover:border-[#7C3AED]/40 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-[#7C3AED]/2 transition-all duration-300 group space-y-4"
            >
              <div className="space-y-4">
                
                {/* Header Labels */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border ${getTypeBadgeStyle(item.type)}`}>
                      {item.type === 'caption' ? 'Legenda' : item.type}
                    </span>
                    <span className="bg-[#0A0A0F] text-[#8888AA] px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border border-[#1E1E2E]">
                      {item.niche || 'Geral'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#10B981]/15 border border-[#10B981]/25 px-2 py-0.5 rounded-lg text-[9px] text-[#10B981] font-extrabold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{item.performance_score}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#A78BFA] transition truncate">
                    {item.title}
                  </h3>
                  <div className="flex gap-2 text-[10px] text-[#8888AA]">
                    <span className="capitalize">📱 {item.platform === 'youtube_shorts' ? 'Shorts' : item.platform}</span>
                    <span>•</span>
                    <span>{getEmotionBadge(item.emotion)}</span>
                  </div>
                </div>
                
                {/* Rich Content Box */}
                <div className="p-4 bg-[#0A0A0F] border border-[#1E1E2E]/80 rounded-xl">
                  <p className="text-xs text-[#8888AA] leading-relaxed italic line-clamp-6 min-h-[100px] select-all whitespace-pre-line">
                    "{item.content}"
                  </p>
                </div>

              </div>

              {/* Action layout operations */}
              <div className="pt-3 border-t border-[#1E1E2E] flex items-center justify-between gap-2.5">
                
                <button
                  onClick={() => handleCopy(item.id, item.content)}
                  className="px-3 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8888AA] hover:text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 transition active:scale-95"
                  title="Copiar texto puro para colar"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleUseContent(item)}
                  className="flex-1 py-2 bg-[#7C3AED]/10 hover:bg-[#7C3AED] border border-[#7C3AED]/25 text-[#A78BFA] hover:text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1 transition-all hover:shadow-md hover:shadow-[#7C3AED]/15"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Usar Hook
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Component */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 px-3 bg-[#111118] border border-[#1E1E2E] hover:border-[#7C3AED]/50 rounded-xl text-xs text-[#8888AA] hover:text-white font-bold disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {/* Numbers list */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8.5 h-8.5 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                    isActive 
                      ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20' 
                      : 'bg-[#111118] border-[#1E1E2E] hover:border-[#7C3AED]/40 text-[#8888AA] hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-2 px-3 bg-[#111118] border border-[#1E1E2E] hover:border-[#7C3AED]/50 rounded-xl text-xs text-[#8888AA] hover:text-white font-bold disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clube de Clientes Fiéis Section */}
      <div className="mt-20 -mx-6 md:-mx-12 border-t border-transparent bg-[#0A0A14] relative overflow-hidden" id="clube-fidelidade-section">
        {/* Border Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#FE2C55] to-[#813EF6]" />
        
        <div className="max-w-7xl mx-auto py-16 px-6 md:px-12">
          {/* Header */}
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-widest flex items-center justify-center gap-2">
              🏆 CLUBE DE CLIENTES FIÉIS
            </h2>
            <p className="text-sm text-[#8888AA] font-semibold max-w-lg mx-auto leading-relaxed">
              Benefícios exclusivos para quem está com a gente há mais tempo
            </p>
          </div>

          {/* Grid of 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <div className="bg-[#111118] border border-[#1E1E35] rounded-2xl p-6 hover:border-[#FE2C55]/30 transition duration-300 flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FE2C55] to-[#813EF6] p-[1px]">
                  <div className="w-full h-full bg-[#111118] rounded-[11px] flex items-center justify-center">
                    <span className="text-lg">🔐</span>
                  </div>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Aba Exclusiva</h3>
              </div>
              <p className="text-xs text-[#8888AA] leading-relaxed">
                Esta biblioteca é reservada para clientes que demonstram comprometimento com a plataforma. Conteúdo premium selecionado a dedo pela nossa equipe.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111118] border border-[#1E1E35] rounded-2xl p-6 hover:border-[#813EF6]/30 transition duration-300 flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FE2C55] to-[#813EF6] p-[1px]">
                  <div className="w-full h-full bg-[#111118] rounded-[11px] flex items-center justify-center">
                    <span className="text-lg">⏳</span>
                  </div>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Como Liberar</h3>
              </div>
              <p className="text-xs text-[#8888AA] leading-relaxed">
                Após 30 dias como cliente ativo, você receberá acesso automático a todo o conteúdo desta biblioteca. Fique atento ao seu email!
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111118] border border-[#1E1E35] rounded-2xl p-6 hover:border-[#FE2C55]/30 transition duration-300 flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FE2C55] to-[#813EF6] p-[1px]">
                  <div className="w-full h-full bg-[#111118] rounded-[11px] flex items-center justify-center">
                    <span className="text-lg">🎁</span>
                  </div>
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Benefícios Exclusivos</h3>
              </div>
              <ul className="text-xs text-[#8888AA] leading-relaxed space-y-2">
                <li className="flex items-start gap-1.5">• Templates premium de alta conversão</li>
                <li className="flex items-start gap-1.5">• Prompts avançados testados e validados</li>
                <li className="flex items-start gap-1.5">• Estratégias secretas de afiliados top</li>
                <li className="flex items-start gap-1.5">• Atualizações semanais de conteúdo</li>
              </ul>
            </div>
          </div>

          {/* Progress Section */}
          <div className="max-w-xl mx-auto text-center space-y-4 bg-[#111118]/60 border border-[#1E1E35]/50 p-6 rounded-2xl">
            <span className="text-xs font-black text-[#8888AA] uppercase tracking-widest block">
              Seu progresso para desbloquear:
            </span>
            
            {/* Visual ASCII representation block from prompt */}
            <div className="font-mono text-xs text-[#8888AA] tracking-wider py-1.5 px-3 bg-[#0A0A0F] rounded-lg border border-[#1E1E2E] inline-block">
              [<span className="text-[#FE2C55]">████████</span><span className="opacity-25">░░░░░░░░░░░░</span>] 30 dias necessários
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden border border-white/[0.03]">
              <motion.div 
                className="bg-gradient-to-r from-[#FE2C55] via-[#813EF6] to-[#FE2C55] h-full rounded-full"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ width: '40%', backgroundSize: '200% 100%' }}
              />
            </div>

            <p className="text-xs font-bold text-white/75 italic">
              "Continue usando a plataforma para desbloquear"
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
