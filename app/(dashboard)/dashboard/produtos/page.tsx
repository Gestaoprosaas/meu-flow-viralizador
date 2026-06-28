"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Search, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Check, 
  PlusCircle, 
  Info,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  Grid
} from 'lucide-react';
import { createClient } from '../../../../lib/supabase/client';

// Standard fallback if the database has not finished seeding or is offline
const INITIAL_PRODUCTS_SEED = [
  {
    id: "prod-1",
    name: "Massageador Elétrico Portátil Pro",
    description: "Mini pistola de massagem muscular com 6 velocidades recarregável via USB-C. Alivia dores no pescoço, ombros e lombar com percussão profunda.",
    niche: "Saúde",
    image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 87,
    competition_level: "baixa" as "baixa" | "média" | "alta",
    trend_reason: "Altas buscas pós vídeos estéticos de react e alívio de dor muscular viralizarem no TikTok Brasil.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=massageador+portatil",
      mercadolivre: "https://lista.mercadolivre.com.br/massageador-portatil"
    }
  },
  {
    id: "prod-2",
    name: "Mini Projetor Portátil Smart 4K",
    description: "Projetor ultra-compacto com suporte articulado de 180°, Wi-Fi integrado e apps como Netflix e YouTube pré-instalados nativamente.",
    niche: "Tecnologia",
    image_url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 94,
    competition_level: "média" as "baixa" | "média" | "alta",
    trend_reason: "Desejo de consumo e unboxing estético no TikTok liderados por layouts de quarto aconchegantes e sessões cinema.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=mini+projetor+smart",
      mercadolivre: "https://lista.mercadolivre.com.br/mini-projetor-smart"
    }
  },
  {
    id: "prod-3",
    name: "Umidificador Difusor Efeito Fogo",
    description: "Aromatizador de ambientes ultra-sônico que emite uma névoa iluminada por LED inteligente simulando o efeito de chamas de fogo reais.",
    niche: "Casa",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 79,
    competition_level: "média" as "baixa" | "média" | "alta",
    trend_reason: "Aparência altamente visual de ASMR e chamas escuras que prendem a retenção total nos primeiros 3 segundos do vídeo.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=difusor+fogo",
      mercadolivre: "https://lista.mercadolivre.com.br/difusor-fogo"
    }
  },
  {
    id: "prod-4",
    name: "Mini Selador de Embalagem Magnético",
    description: "Gadget compacto imantado que veda saquinhos de plástico rapidamente usando calor suave, preservando alimentos crocantes.",
    niche: "Casa",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 65,
    competition_level: "baixa" as "baixa" | "média" | "alta",
    trend_reason: "Altíssimo apelo de necessidade diária com conversão rápida pelo preço ultra-baixo na Shopee.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=mini+selador+cozinha",
      mercadolivre: "https://lista.mercadolivre.com.br/mini-selador-cozinha"
    }
  },
  {
    id: "prod-5",
    name: "Fixador de Maquiagem em Névoa Fina",
    description: "Spray fixador ultra-hidratante enriquecido feito para peles sensíveis, lacrando a maquiagem resistente à água e suor por 24 horas.",
    niche: "Beleza",
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 82,
    competition_level: "alta" as "baixa" | "média" | "alta",
    trend_reason: "Desafio viral de 'pele blindada' de maquiadoras testando spray com jatos de água no rosto.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=spray+fixador+maquiagem",
      mercadolivre: "https://lista.mercadolivre.com.br/spray-fixador-maquiagem"
    }
  },
  {
    id: "prod-6",
    name: "Escova Pet de Autolimpeza a Vapor",
    description: "Escova com lançamento de névoa ultrassônica de vapor morno que desembaraça os fios e remove pelos de estimação em segundos.",
    niche: "Pet",
    image_url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 96,
    competition_level: "baixa" as "baixa" | "média" | "alta",
    trend_reason: "Vídeos satisfatórios mostrando nuvens de vapor retirando mantas inteiras de pelo solto de gatos e cachorros irritados.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=escova+vapor+pet",
      mercadolivre: "https://lista.mercadolivre.com.br/escova-vapor-pet"
    }
  },
  {
    id: "prod-7",
    name: "Organizador de Maquiagem Giratório 360°",
    description: "Torre organizadora de maquiagens cosméticas com bandejas modulares removíveis reguladas em altura do carrossel.",
    niche: "Beleza",
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 88,
    competition_level: "média" as "baixa" | "média" | "alta",
    trend_reason: "Vlogs estéticos de arrumação de penteadeira com sons de ASMR limpos e organização impecável.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=organizador+maquiagem+giratorio",
      mercadolivre: "https://lista.mercadolivre.com.br/organizador-maquiagem-giratorio"
    }
  },
  {
    id: "prod-8",
    name: "Fone de Ouvido Condução Óssea",
    description: "Fone de arco flexível para atividades físicas, deixando os ouvidos livres para escutar o tráfego enquanto escuta músicas de treino.",
    niche: "Fitness",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 74,
    competition_level: "média" as "baixa" | "média" | "alta",
    trend_reason: "Lançamento em alta após ciclistas e corredores postarem vídeos motivacionais de maratonas.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=fone+conducao+ossea",
      mercadolivre: "https://lista.mercadolivre.com.br/fone-conducao-ossea"
    }
  },
  {
    id: "prod-9",
    name: "Mop Triangular com Torção Automática",
    description: "Esfregão de microfibra multiangular que rotaciona em 360 graus e possui escoador em X de torção de água integrado no cabo.",
    niche: "Casa",
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 92,
    competition_level: "baixa" as "baixa" | "média" | "alta",
    trend_reason: "Vídeos hipnotizantes de limpeza pesada com remoção instantânea de sujeira de teto e paredes encardidas.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=mop+triangular",
      mercadolivre: "https://lista.mercadolivre.com.br/mop-triangular"
    }
  },
  {
    id: "prod-10",
    name: "Aparador Vintage Recarregável Sem Fio",
    description: "Máquina de barbear e cortar cabelos de corpo metálico maciço com entalhes de dragão retrô e potente motor recarregável USB.",
    niche: "Beleza",
    image_url: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 58,
    competition_level: "alta" as "baixa" | "média" | "alta",
    trend_reason: "Comerciais humorísticos de aparo de barba zero e depilação que rodam em canais de anúncio massivos.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=aparador+pelos+vintage",
      mercadolivre: "https://lista.mercadolivre.com.br/aparador-pelos-vintage"
    }
  },
  {
    id: "prod-11",
    name: "Roda Abdominal com Rebote Automático",
    description: "Rolo largo de treino integrado com mola de aço de recuperação ativa e apoio estofado duplo para os antebraços e ombros.",
    niche: "Fitness",
    image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 85,
    competition_level: "baixa" as "baixa" | "média" | "alta",
    trend_reason: "Promete facilidade para trincar o abdômen sem risco de machucar a região lombar, estimulando compras de impulso.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=roda+abdominal+rebote",
      mercadolivre: "https://lista.mercadolivre.com.br/roda-abdominal-rebote"
    }
  },
  {
    id: "prod-12",
    name: "Bebedouro Fonte Inteligente para Gatos",
    description: "Bacia de água fluida em corrente constante com filtro multicamada de carvão ativado atrativo para aumentar a hidratação felina.",
    niche: "Pet",
    image_url: "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 91,
    competition_level: "média" as "baixa" | "média" | "alta",
    trend_reason: "Alerta de veterinários sobre baixa ingestão hídrica em animais cria forte apelo de dor preventiva em tutores.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=bebedouro+fonte+gatos",
      mercadolivre: "https://lista.mercadolivre.com.br/bebedouro-fonte-gatos"
    }
  },
  {
    id: "prod-13",
    name: "Suporte Celular com Rastreador Facial",
    description: "Tripé robótico com sensor inteligente capaz de girar 360° autonomamente acompanhando o rosto sem necessidade de aplicativo.",
    niche: "Tecnologia",
    image_url: "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 81,
    competition_level: "média" as "baixa" | "média" | "alta",
    trend_reason: "A febre de auto-vlogs de 'Arrume-se Comigo' gravados dinamicamente em quartos e provadores.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=suporte+celular+rastreador+facial",
      mercadolivre: "https://lista.mercadolivre.com.br/suporte-celular-rastreador+facial"
    }
  },
  {
    id: "prod-14",
    name: "Colar Cervical Confort Alívio de Tensão",
    description: "Almofada cervical ergonômica de tração e ajuste inflável para alinhamento postural da coluna e reabilitação de dores.",
    niche: "Saúde",
    image_url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 78,
    competition_level: "baixa" as "baixa" | "média" | "alta",
    trend_reason: "Audiência de home office que reclama de dor de cabeça e cansaço gerando demanda por alívio físico imediato.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=colar+cervical+tracao",
      mercadolivre: "https://lista.mercadolivre.com.br/colar+cervical+tracao"
    }
  },
  {
    id: "prod-15",
    name: "Mini Liquidificador USB Pro 6 Lâminas",
    description: "Copo liquidificador portátil recarregável para batidas e vitaminas, tritura gelo e frutas congeladas em poucos segundos.",
    niche: "Fitness",
    image_url: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=600",
    opportunity_score: 89,
    competition_level: "alta" as "baixa" | "média" | "alta",
    trend_reason: "Misturas estéticas matinais de smoothies com frutas congeladas e pó de whey coloridos em escritórios.",
    affiliate_links: {
      shopee: "https://shopee.com.br/search?keyword=mini+liquidificador+portatil",
      mercadolivre: "https://lista.mercadolivre.com.br/mini-liquidificador+portatil"
    }
  }
];

export default function TrendingProductsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNiche, setSelectedNiche] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states to add custom product
  const [newProductName, setNewProductName] = useState('');
  const [newNiche, setNewNiche] = useState('Saúde');
  const [newDescription, setNewDescription] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newScore, setNewScore] = useState(85);
  const [newCompetition, setNewCompetition] = useState<'baixa' | 'média' | 'alta'>('média');
  const [newReason, setNewReason] = useState('');
  const [newShopee, setNewShopee] = useState('');
  const [newMercadoLivre, setNewMercadoLivre] = useState('');

  const nichesList = ['todos', 'Saúde', 'Beleza', 'Casa', 'Tecnologia', 'Fitness', 'Pet'];

  const fetchTrendingProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trending_products')
        .select('*')
        .order('opportunity_score', { ascending: false });

      if (data && data.length > 0 && !error) {
        // Map database niches to normalized niches if named differently
        const mapped = data.map(item => {
          let normalizedNiche = item.niche;
          if (item.niche === 'Saúde e Bem-estar' || item.niche === 'Saúde e Fitness') normalizedNiche = 'Saúde';
          if (item.niche === 'Cozinha e Lar' || item.niche === 'Casa e Organização' || item.niche === 'Casa e Decoração' || item.niche === 'Segurança e Casa') normalizedNiche = 'Casa';
          if (item.niche === 'Beleza e Cosméticos') normalizedNiche = 'Beleza';
          if (item.niche === 'Pet care') normalizedNiche = 'Pet';
          
          let affiliateObj = { shopee: '', mercadolivre: '' };
          if (typeof item.affiliate_links === 'string') {
            try {
              affiliateObj = JSON.parse(item.affiliate_links);
            } catch (e) {
              affiliateObj = { shopee: item.affiliate_links, mercadolivre: '' };
            }
          } else if (item.affiliate_links) {
            affiliateObj = item.affiliate_links;
          }

          return {
            ...item,
            niche: normalizedNiche,
            affiliate_links: affiliateObj
          };
        });
        setProducts(mapped);
      } else {
        // If empty or error, use beautiful seed with 15 initial products
        setProducts(INITIAL_PRODUCTS_SEED);
      }
    } catch (err) {
      console.error('Falha ao sincronizar produtos com Supabase:', err);
      setProducts(INITIAL_PRODUCTS_SEED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const handleCreateCampaign = (prod: any) => {
    // Encodes the fields into URL search parameters for pre-filling the generation form
    const queryParams = new URLSearchParams({
      product_name: prod.name,
      product_description: prod.description,
      trend_reason: prod.trend_reason,
      reason: prod.trend_reason,
      niche: prod.niche
    });
    router.push(`/dashboard/roteiros?${queryParams.toString()}`);
  };

  const handleCreateCustomProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newDescription) return;

    const formattedProduct = {
      name: newProductName,
      description: newDescription,
      niche: newNiche,
      image_url: newImgUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      opportunity_score: Number(newScore),
      competition_level: newCompetition,
      trend_reason: newReason || 'Alta retenção de visualizações rápidas de unboxing estético no TikTok Shop.',
      affiliate_links: {
        shopee: newShopee || `https://shopee.com.br/search?keyword=${encodeURIComponent(newProductName)}`,
        mercadolivre: newMercadoLivre || `https://lista.mercadolivre.com.br/${encodeURIComponent(newProductName)}`
      },
      is_featured: true
    };

    try {
      // Opt-in DB insert
      const { data, error } = await supabase
        .from('trending_products')
        .insert([{
          ...formattedProduct,
          affiliate_links: formattedProduct.affiliate_links
        }])
        .select();

      if (data && !error) {
        setProducts(prev => [data[0], ...prev]);
      } else {
        // Fallback to local state append if offline
        setProducts(prev => [{ ...formattedProduct, id: `custom-${Date.now()}` }, ...prev]);
      }
    } catch (err) {
      setProducts(prev => [{ ...formattedProduct, id: `custom-${Date.now()}` }, ...prev]);
    }

    // Reset Form
    setNewProductName('');
    setNewDescription('');
    setNewImgUrl('');
    setNewReason('');
    setNewShopee('');
    setNewMercadoLivre('');
    setShowAddModal(false);
  };

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.trend_reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNiche = selectedNiche === 'todos' || prod.niche === selectedNiche;

    return matchesSearch && matchesNiche;
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#F0F0FF] pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-[#17152F] to-[#111118] border border-[#7C3AED]/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="space-y-1 z-10">
          <span className="flex items-center gap-1.5 text-xs text-[#06B6D4] font-black uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
            Mineração de Alto Giro
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Produtos em Alta (TikTok Shop & Shopee)
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA] max-w-2xl">
            Encontre os produtos de maior giro e probabilidade de viralização no ecossistema de e-commerce e afiliados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-90 font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition shadow-lg shadow-[#7C3AED]/15 z-10 self-start sm:self-center"
          id="btn-mapear-produto"
        >
          <PlusCircle className="w-4 h-4" />
          Mapear Novo Produto
        </button>
      </div>

      {/* Filters & Control Panel */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Text Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#8888AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtre por nome do artigo ou gatilho de tendência..."
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 pl-10 text-xs text-white focus:border-[#06B6D4]/50 outline-none transition"
              id="input-procurar-produtos"
            />
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 px-4 rounded-xl flex items-center gap-3 text-xs">
            <ShoppingBag className="w-4 h-4 text-[#06B6D4]" />
            <span className="text-[#8888AA] font-semibold">Exibindo:</span>
            <strong className="text-white text-sm font-bold">{filteredProducts.length} itens mapeados</strong>
          </div>
        </div>

        {/* Niche Badges Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5 uppercase tracking-wider">
            <Filter className="w-3 h-3 text-[#7C3AED]" />
            Nicho do E-commerce
          </label>
          <div className="flex flex-wrap gap-2">
            {nichesList.map((niche) => {
              const active = selectedNiche === niche;
              return (
                <button
                  key={niche}
                  onClick={() => setSelectedNiche(niche)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    active 
                      ? 'bg-[#7C3AED] text-white' 
                      : 'bg-[#181825] text-[#8888AA] hover:text-white hover:bg-[#1E1E2E]'
                  }`}
                  id={`filter-niche-${niche.toLowerCase()}`}
                >
                  {niche === 'todos' ? '🌐 Todos os Segmentos' : niche}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-10 h-10 border-4 border-t-[#7C3AED] border-[#1E1E2E] rounded-full animate-spin" />
          <p className="text-xs text-[#8888AA]">Carregando produtos minerados pela nossa inteligência...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8 space-y-3">
              <Info className="w-8 h-8 text-[#8888AA] mx-auto block" />
              <h3 className="text-sm font-bold text-white">Nenhum produto correspondente</h3>
              <p className="text-xs text-[#8888AA] max-w-sm mx-auto">
                Tente redefinir seus filtros ou cadastrar um novo produto personalizado para analisar.
              </p>
            </div>
          ) : (
            /* Products Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                // Opportunity score color rules: green >70, yellow 40-70, red <40
                const score = prod.opportunity_score;
                let scoreColor = 'bg-[#10B981]'; // Green default
                let scoreText = 'text-[#10B981]';
                let scoreBg = 'bg-[#10B981]/10 border-[#10B981]/20';
                
                if (score < 40) {
                  scoreColor = 'bg-red-500';
                  scoreText = 'text-red-400';
                  scoreBg = 'bg-red-500/10 border-red-500/20';
                } else if (score <= 70) {
                  scoreColor = 'bg-yellow-500';
                  scoreText = 'text-yellow-400';
                  scoreBg = 'bg-yellow-500/10 border-yellow-500/20';
                }

                return (
                  <div 
                    key={prod.id || prod.name}
                    className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden hover:border-[#06B6D4]/30 hover:shadow-xl hover:shadow-[#06B6D4]/5 transition-all duration-300 flex flex-col h-full"
                    id={`card-product-${prod.id}`}
                  >
                    {/* Cover Photo */}
                    <div className="relative h-48 w-full bg-[#1A1A26] overflow-hidden group">
                      <img 
                        src={prod.image_url} 
                        alt={prod.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="text-[10px] font-black uppercase text-white bg-[#7C3AED] px-2.5 py-1 rounded-md shadow">
                          {prod.niche}
                        </span>
                        <span className={`text-[10px] font-bold uppercase ${
                          prod.competition_level === 'baixa' 
                            ? 'bg-[#10B981] text-white' 
                            : prod.competition_level === 'média' 
                            ? 'bg-yellow-500 text-black' 
                            : 'bg-red-500 text-white'
                        } px-2.5 py-1 rounded-md shadow`}>
                          Concorrência: {prod.competition_level}
                        </span>
                      </div>
                    </div>

                    {/* Card Content body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-base font-extrabold text-white leading-tight hover:text-[#06B6D4] transition duration-200">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-[#8888AA] line-clamp-3 text-justify leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      {/* Opportunity Score Indicator */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#8888AA] font-semibold flex items-center gap-1">
                            Score de Oportunidade
                          </span>
                          <span className={`font-black ${scoreText}`}>
                            {score}/100
                          </span>
                        </div>
                        {/* Colored horizontal score bar */}
                        <div className="h-2 bg-[#1A1A26] rounded-full overflow-hidden border border-[#232332]">
                          <div 
                            className={`h-full ${scoreColor} rounded-full transition-all duration-500`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      {/* Bullet reasons and tags */}
                      <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#06B6D4] flex items-center gap-1">
                          ⚡ Gatilho da Tendência:
                        </span>
                        <p className="text-[11px] text-[#A0A0C0] leading-snug">
                          {prod.trend_reason ?? "Grande volume de views espontâneas e desejo visual estético."}
                        </p>
                      </div>

                      {/* Action Affiliate / Create buttons row */}
                      <div className="pt-3 border-t border-[#1E1E2E] space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <a 
                            href={prod.affiliate_links?.shopee || 'https://shopee.com.br'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#181825] hover:bg-[#EE4D2D]/10 hover:text-[#EE4D2D] hover:border-[#EE4D2D]/30 border border-[#1E1E2E] text-xs font-bold rounded-lg text-[#8888AA] transition duration-200"
                          >
                            <span>Shopee</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a 
                            href={prod.affiliate_links?.mercadolivre || 'https://mercadolivre.com.br'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-[#181825] hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30 border border-[#1E1E2E] text-xs font-bold rounded-lg text-[#8888AA] transition duration-200"
                          >
                            <span>M. Livre</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <button
                          onClick={() => handleCreateCampaign(prod)}
                          className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition"
                          id={`btn-criar-campanha-${prod.id}`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                          Criar Campanha
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* modal block for creation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-xl bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[#1E1E2E] bg-gradient-to-r from-[#17152F] to-[#111118] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#06B6D4]" />
                Mapear Novo Artigo Viral
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#8888AA] hover:text-white transition text-sm font-black p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Nome do Produto <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Ex: Escova Elétrica Ultra Sonic"
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Categoria / Nicho</label>
                  <select
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Saúde">Saúde 🌿</option>
                    <option value="Beleza">Beleza 💄</option>
                    <option value="Casa">Casa e Decoração 🏠</option>
                    <option value="Tecnologia">Tecnologia 💻</option>
                    <option value="Fitness">Fitness 💪</option>
                    <option value="Pet">Pet Care 🐾</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Descrição Comercial <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Escreva os diferenciais, utilidade ou por que as pessoas compram de impulso na internet."
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Nível de Competição</label>
                  <select
                    value={newCompetition}
                    onChange={(e: any) => setNewCompetition(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                  >
                    <option value="baixa">Baixa (Menos concorrência)</option>
                    <option value="média">Média (Giro estável)</option>
                    <option value="alta">Alta (Mais anúncios rodando)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Pontuação de Oportunidade (0-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Link da Foto (Ex: Unsplash)</label>
                <input
                  type="url"
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Por que está como tendência agora?</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Ex: Trend de ASMR mostrando unboxing e limpeza estonteante."
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Link de Afiliado - Shopee</label>
                  <input
                    type="url"
                    value={newShopee}
                    onChange={(e) => setNewShopee(e.target.value)}
                    placeholder="https://shopee.com.br/product-link"
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Link de Afiliado - Mercado Livre</label>
                  <input
                    type="url"
                    value={newMercadoLivre}
                    onChange={(e) => setNewMercadoLivre(e.target.value)}
                    placeholder="https://mercadolivre.com.br/link"
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E1E2E]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#181825] border border-[#1E1E2E] hover:bg-[#20202F] text-xs font-bold rounded-xl text-[#8888AA] transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-black text-xs font-black rounded-xl transition duration-200"
                >
                  Adicionar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
