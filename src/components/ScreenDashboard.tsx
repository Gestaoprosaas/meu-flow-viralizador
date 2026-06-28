import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  Calendar,
  Filter,
  Share2,
  CheckCircle,
  PlusCircle,
  RefreshCw,
  Users,
  DollarSign,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  Settings,
  Flame,
  ShieldCheck,
  Power,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Project, TrendingProduct, ScriptGeneration, ImageGeneration, VideoGeneration } from '../types';

interface ScreenDashboardProps {
  profile: any;
  projects: Project[];
  trendingProducts: TrendingProduct[];
  scripts: ScriptGeneration[];
  images: ImageGeneration[];
  videos: VideoGeneration[];
  onNavigate: (path: string, payload?: any) => void;
  onUpgradeClick: () => void;
  onNewCampaignClick: () => void;
}

// Sparkline Mock Data for Top Metrics
const sparklineDataRevenue = [
  { name: '1', value: 32000 },
  { name: '2', value: 41000 },
  { name: '3', value: 38000 },
  { name: '4', value: 49000 },
  { name: '5', value: 45000 },
  { name: '6', value: 54200 }
];

const sparklineDataConversion = [
  { name: '1', value: 12 },
  { name: '2', value: 15 },
  { name: '3', value: 14 },
  { name: '4', value: 19 },
  { name: '5', value: 18 },
  { name: '6', value: 21.5 }
];

export default function ScreenDashboard({
  profile,
  projects,
  trendingProducts,
  scripts,
  images,
  videos,
  onNavigate,
  onUpgradeClick,
  onNewCampaignClick
}: ScreenDashboardProps) {

  // Flow pathway highlights
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);

  // Connection integrations state
  const [integrations, setIntegrations] = useState([
    { id: 'tiktok-shop', name: 'TikTok Shop Premium', status: 'connected', type: 'Vendas Direct', speed: 'Sincronização Ativa', enabled: true },
    { id: 'shopee-api', name: 'Shopee Affiliate Engine', status: 'connected', type: 'Afiliados', speed: 'Alta Velocidade (Webhook)', enabled: true },
    { id: 'mercado-livre', name: 'Mercado Livre Store', status: 'disconnected', type: 'Vendas Direct', speed: 'Não Vinculado', enabled: false },
    { id: 'flowy-media', name: 'Flowy AI Cloud Sync', status: 'connected', type: 'Mídia e Renders', speed: 'Catálogo de Fotos', enabled: true }
  ]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => (item.id === id ? { ...item, enabled: !item.enabled, status: !item.enabled ? 'connected' : 'disconnected' } : item))
    );
  };

  const totalGenerations = scripts.length + images.length + videos.length;

  // Pie Chart Sources (Revenue source mix matching mockup theme)
  const revenueSources = [
    { name: 'TikTok Shop', value: 55, color: '#FE2C55' }, // Red-rose
    { name: 'Shopee Promo', value: 25, color: '#25F4EE' }, // Cyan
    { name: 'Mercado Livre', value: 12, color: '#7C3AED' }, // Purple
    { name: 'Outros Links', value: 8, color: '#3B82F6' } // Soft blue
  ];

  // Cohort Retention data with corresponding mockup days
  const cohortData = [
    { day: 'Dom', rate: 70, progressColor: 'from-[#FE2C55] to-[#7C3AED]', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
    { day: 'Seg', rate: 85, progressColor: 'from-[#25F4EE] to-[#3B82F6]', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
    { day: 'Ter', rate: 64, progressColor: 'from-[#FFC107] to-[#FE2C55]', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' },
    { day: 'Qua', rate: 92, progressColor: 'from-[#25F4EE] to-[#FE2C55]', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
    { day: 'Qui', rate: 78, progressColor: 'from-[#7C3AED] to-[#25F4EE]', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120' },
    { day: 'Sex', rate: 88, progressColor: 'from-[#FE2C55] to-[#25F4EE]', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120' },
    { day: 'Sáb', rate: 95, progressColor: 'from-[#7C3AED] to-[#FF0050]', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120' },
  ];

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in pb-12 select-none">

      {/* Modern Mockup Header (TikTok Inspired) */}
      <div className="bg-[#010101] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Ambient neon backdrop light glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3.xl font-black tracking-tight text-white flex items-center gap-2">
              Dashboard
            </h1>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5" /> TikTok Trending Pro
            </span>
          </div>
          <p className="text-xs text-[#8888AA]">Gere roteiros, acompanhe inteligência de funil de vendas e impulsione suas conversões comerciais.</p>
        </div>

        {/* Dashboard filter & control row (Matching mockup visually) */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Calendar pill */}
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] px-3 py-1.5 rounded-xl text-[11px] text-[#A0A0C0] font-semibold flex items-center gap-1.5 hover:border-[#FE2C55]/30 transition">
            <Calendar className="w-3.5 h-3.5" />
            <span>11 Jun - 11 Jul</span>
          </div>

          {/* Time range selection select */}
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] px-2.5 py-1.5 rounded-xl text-[11px] text-[#A0A0C0] font-semibold flex items-center cursor-pointer hover:border-cyan-500/30 transition">
            <span>Mensal</span>
          </div>

          {/* Filter button */}
          <button className="bg-[#111118] border border-[#1E1E2E] hover:border-[#FE2C55]/20 hover:text-white px-3 py-1.5 rounded-xl text-[11px] text-[#8888AA] font-bold flex items-center gap-1 transition">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar</span>
          </button>

          {/* Export button */}
          <button className="bg-[#111118] border border-[#1E1E2E] hover:border-cyan-500/20 hover:text-white px-3 py-1.5 rounded-xl text-[11px] text-[#8888AA] font-bold flex items-center gap-1 transition">
            <Share2 className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Top pill bar (Mockup Status: "Data streaming" / "Live system health") */}
      <div className="flex items-center justify-between bg-[#111118]/60 p-3 rounded-xl border border-[#1E1E2E] text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#fff]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 block animate-pulse shadow-md shadow-cyan-400" />
            Conectado com Flowy & TikTok API
          </span>
          <span className="text-[#8888AA] hidden sm:inline">|</span>
          <span className="text-[#8888AA] hidden sm:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-500 animate-bounce" /> Streaming de dados de vendas real-time ativado
          </span>
        </div>
        <div className="flex items-center gap-2 font-bold select-text text-yellow-400 text-[10px] uppercase tracking-wide bg-[#1E1E2E] px-2 py-0.5 rounded-full">
          {profile.plan === 'free' ? 'Plano Grátis' : `Plano ${profile.plan}`}
        </div>
      </div>

      {/* Three high-fidelity mockup KPI widgets (Row 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* KPI 1: Global Growth Score (Retention / Conversion Core) */}
        <div className="bg-[#010101] border border-[#1E1E2E] rounded-2xl p-5 hover:border-cyan-500/30 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-300" />
          
          <div className="flex items-center justify-between mb-3 border-b border-[#1E1E2E] pb-2">
            <span className="text-xs text-[#8888AA] font-bold uppercase tracking-wider block">Score de Viralização Geral</span>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg">+12.4%</span>
          </div>

          <div className="flex items-center gap-6 py-1">
            {/* Minimal Circular Progress bar */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1E1E2E]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 filter drop-shadow-[0_0_6px_rgba(37,244,238,0.5)] transition-all duration-1000"
                  strokeDasharray="82, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-white">82%</span>
                <span className="text-[7px] text-[#8888AA] font-extrabold uppercase tracking-wide">Excelente</span>
              </div>
            </div>

            {/* Micro Sparkline next to it */}
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold text-[#A0A0C0]">Fator Retenção</h4>
              <p className="text-[11px] text-[#8888AA] leading-normal font-medium">As campanhas criadas ultrapassam a média comercial em ganchos iniciais de 3s.</p>
              <div className="pt-1">
                <span className="text-[9px] text-[#A0A0C0]">Generations: <strong>{totalGenerations} criativos</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: Recurring Net Revenue (Faturamento Estimado) */}
        <div className="bg-[#010101] border border-[#1E1E2E] rounded-2xl p-5 hover:border-[#FE2C55]/30 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-300" />
          
          <div className="flex items-center justify-between mb-3 border-b border-[#1E1E2E] pb-2">
            <span className="text-xs text-[#8888AA] font-bold uppercase tracking-wider block">Vendas Atribuídas</span>
            <span className="text-xs font-bold text-[#FE2C55] flex items-center"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 18.5%</span>
          </div>

          <div className="flex items-center justify-between gap-2 py-1">
            <div className="space-y-1">
              <span className="text-[10px] text-[#8888AA] block">Faturamento Estimado (GMV)</span>
              <span className="text-2xl font-black text-white tracking-tight">R$ 54.200</span>
              <span className="text-[8px] text-[#FE2C55] font-black uppercase tracking-wider block bg-[#FE2C55]/10 px-2 py-0.5 rounded-full w-max">Alta Escala</span>
            </div>

            {/* Sparkline visualization */}
            <div className="w-36 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineDataRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FE2C55" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FE2C55" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ background: '#010101', borderColor: '#1E1E2E', fontSize: 10 }} />
                  <Area type="monotone" dataKey="value" stroke="#FE2C55" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI 3: Active Campaign Conversion (Conversão) */}
        <div className="bg-[#010101] border border-[#1E1E2E] rounded-2xl p-5 hover:border-indigo-500/30 transition relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-300" />
          
          <div className="flex items-center justify-between mb-3 border-b border-[#1E1E2E] pb-2">
            <span className="text-xs text-[#8888AA] font-bold uppercase tracking-wider block">Conversão das Copias</span>
            <span className="text-xs font-bold text-cyan-400 flex items-center"><ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +4.2%</span>
          </div>

          <div className="flex items-center justify-between gap-2 py-1">
            <div className="space-y-1">
              <span className="text-[10px] text-[#8888AA] block">Cliques em Links</span>
              <span className="text-2xl font-black text-white tracking-tight">21.5%</span>
              <span className="text-[9px] text-cyan-400 font-extrabold flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> {profile.affiliate_clicks} clicks registrados
              </span>
            </div>

            {/* Sparkline visualization */}
            <div className="w-36 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineDataConversion}>
                  <defs>
                    <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#25F4EE" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#25F4EE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ background: '#010101', borderColor: '#1E1E2E', fontSize: 10 }} />
                  <Area type="monotone" dataKey="value" stroke="#25F4EE" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConversion)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Middle interactive visual flow + retention cohort */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Middle Left (2/3 Column): Audiência & Tráfego Funnel Flow */}
        <div className="lg:col-span-2 bg-[#010101] border border-[#1E1E2E] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-[#FE2C55]/20 transition relative">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FE2C55]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E1E2E] pb-3 gap-2">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wide">
                <Layers className="w-4 h-4 text-cyan-400" /> Fluxo de Tráfego Comercial Organizado
              </h3>
              <p className="text-[11px] text-[#8888AA]">Navegue nas vias de conversão. Siga as vias de público abaixo para ver o impacto no funil.</p>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-bold bg-[#111118] px-2.5 py-1 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
              <span>Alta Conversão em 2026</span>
            </div>
          </div>

          {/* Interactive flow connector diagram with glowing animations (mockup inspired) */}
          <div className="p-4 bg-[#0A0A0F] rounded-2xl border border-[#1E1E2E] relative overflow-hidden flex flex-col justify-between min-h-[260px] space-y-6">
            
            {/* Visual flow header metrics */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8888AA] px-1 pb-2 border-b border-[#1D1D2C]/40">
              <span>CANAIS DE RETENÇÃO</span>
              <span className="text-yellow-400 font-extrabold">IMPACTO DE CLIQUES: R$ 9.257,51 GERADOS ESTA SEMANA</span>
              <span>CONVERSÃO DE COMPRAS</span>
            </div>

            {/* Direct Flow Diagram mapping SVG ribbons */}
            <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <div className="grid grid-cols-3 items-center relative z-10 gap-2 min-w-[650px] md:min-w-0">
              
              {/* Traffic Sources column */}
              <div className="space-y-4">
                <button
                  onMouseEnter={() => setHighlightedPath('organic')}
                  onMouseLeave={() => setHighlightedPath(null)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    highlightedPath === 'organic'
                      ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white shadow-lg shadow-[#FE2C55]/10'
                      : 'bg-[#111118]/80 border-[#1E1E2E] text-[#A0A0C0] hover:border-[#FE2C55]/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>TikTok Organico</span>
                    <span className="text-emerald-400">45%</span>
                  </div>
                  <div className="font-extrabold text-sm text-white">R$ 4.165,80</div>
                  <p className="text-[9px] text-[#666688] mt-0.5">Audiência viral de vídeos curtos</p>
                </button>

                <button
                  onMouseEnter={() => setHighlightedPath('ads')}
                  onMouseLeave={() => setHighlightedPath(null)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    highlightedPath === 'ads'
                      ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-400/10'
                      : 'bg-[#111118]/80 border-[#1E1E2E] text-[#A0A0C0] hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>TikTok Ads / Oferta</span>
                    <span className="text-cyan-400">35%</span>
                  </div>
                  <div className="font-extrabold text-sm text-white">R$ 3.240,15</div>
                  <p className="text-[9px] text-[#666688] mt-0.5">Campanhas e criativos patrocinados</p>
                </button>

                <button
                  onMouseEnter={() => setHighlightedPath('influencers')}
                  onMouseLeave={() => setHighlightedPath(null)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    highlightedPath === 'influencers'
                      ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/10'
                      : 'bg-[#111118]/80 border-[#1E1E2E] text-[#A0A0C0] hover:border-[#7C3AED]/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>Afiliados Direct</span>
                    <span className="text-indigo-400">20%</span>
                  </div>
                  <div className="font-extrabold text-sm text-white">R$ 1.851,56</div>
                  <p className="text-[9px] text-[#666688] mt-0.5">Parcerias e cupons de influência</p>
                </button>
              </div>

              {/* Center Flow lanes via customized animated glowing ribbon lines */}
              <div className="relative h-44 flex items-center justify-center">
                <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Pathway 1: Organic */}
                  <path
                    d="M 0 15 C 50 15, 50 50, 100 20"
                    fill="none"
                    stroke={highlightedPath === 'organic' ? '#FE2C55' : '#FE2C55'}
                    strokeWidth={highlightedPath === 'organic' ? 3.5 : 1.5}
                    strokeDasharray={highlightedPath === 'organic' ? "4, 2" : "none"}
                    className={`transition-all duration-300 ${highlightedPath === 'organic' ? 'animate-[dash_1s_linear_infinite]' : 'opacity-45'}`}
                  />
                  <path
                    d="M 0 15 C 50 15, 50 50, 100 50"
                    fill="none"
                    stroke="#FE2C55"
                    strokeWidth={highlightedPath === 'organic' ? 2 : 0.8}
                    className="opacity-25"
                  />

                  {/* Pathway 2: Ads */}
                  <path
                    d="M 0 50 C 50 50, 50 20, 100 20"
                    fill="none"
                    stroke={highlightedPath === 'ads' ? '#25F4EE' : '#25F4EE'}
                    strokeWidth={highlightedPath === 'ads' ? 3.5 : 1.5}
                    strokeDasharray={highlightedPath === 'ads' ? "4, 2" : "none"}
                    className={`transition-all duration-300 ${highlightedPath === 'ads' ? 'animate-[dash_1s_linear_infinite]' : 'opacity-45'}`}
                  />
                  <path
                    d="M 0 50 C 50 50, 50 80, 100 80"
                    fill="none"
                    stroke="#25F4EE"
                    strokeWidth={highlightedPath === 'ads' ? 2 : 0.8}
                    className="opacity-25"
                  />

                  {/* Pathway 3: Influencers */}
                  <path
                    d="M 0 85 C 50 85, 50 50, 100 50"
                    fill="none"
                    stroke={highlightedPath === 'influencers' ? '#7C3AED' : '#7C3AED'}
                    strokeWidth={highlightedPath === 'influencers' ? 3.5 : 1.5}
                    strokeDasharray={highlightedPath === 'influencers' ? "4, 2" : "none"}
                    className={`transition-all duration-300 ${highlightedPath === 'influencers' ? 'animate-[dash_1s_linear_infinite]' : 'opacity-45'}`}
                  />
                  <path
                    d="M 0 85 C 50 85, 50 80, 100 80"
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth={highlightedPath === 'influencers' ? 2 : 0.8}
                    className="opacity-25"
                  />
                </svg>

                {/* Flow center glowing Core */}
                <div className="px-3 py-1 bg-black/90 border border-white/10 rounded-lg text-[9px] font-black uppercase text-white shadow-xl z-10 animate-pulse">
                  CONECTOR IA
                </div>
              </div>

              {/* Traffic Destination Column */}
              <div className="space-y-4">
                <div className="p-3 bg-[#111118]/80 border border-[#1E1E2E] rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#A0A0C0] uppercase tracking-wider mb-0.5">
                    <span>Shopee Store</span>
                    <span className="text-[#FE2C55]">R$ 4.814,20</span>
                  </div>
                  <div className="font-extrabold text-xs text-white">52% do Volume</div>
                  <div className="w-full bg-[#1E1E2E] h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#FE2C55] h-full" style={{ width: '52%' }} />
                  </div>
                </div>

                <div className="p-3 bg-[#111118]/80 border border-[#1E1E2E] rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#A0A0C0] uppercase tracking-wider mb-0.5">
                    <span>Mercado Livre</span>
                    <span className="text-cyan-400">R$ 2.592,10</span>
                  </div>
                  <div className="font-extrabold text-xs text-white">28% do Volume</div>
                  <div className="w-full bg-[#1E1E2E] h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-cyan-400 h-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div className="p-3 bg-[#111118]/80 border border-[#1E1E2E] rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#A0A0C0] uppercase tracking-wider mb-0.5">
                    <span>Flowy Checkout / Direto</span>
                    <span className="text-indigo-400">R$ 1.851,21</span>
                  </div>
                  <div className="font-extrabold text-xs text-white">20% do Volume</div>
                  <div className="w-full bg-[#1E1E2E] h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="text-[10px] text-[#8888AA] text-center pt-2 italic border-t border-[#1D1D2C]/40">
              Dica: Posicione o mouse sobre TikTok Organico, TikTok Ads ou Afiliados Direct para isolar o caminho de faturamento correspondente!
            </div>
          </div>
        </div>

        {/* Middle Right (1/3 Column): User attention cohort (Cohort Retention mockup component with portrait tags above) */}
        <div className="bg-[#010101] border border-[#1E1E2E] rounded-3xl p-5 flex flex-col justify-between hover:border-cyan-500/20 transition relative">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="border-b border-[#1E1E2E] pb-3 mb-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FE2C55]" /> Retenção de Vídeo em Dias
              </h3>
              <p className="text-[11px] text-[#8888AA]">Percentual de retenção de público no dia</p>
            </div>
            
            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-extrabold rounded">
              HOVER ACTIVE
            </span>
          </div>

          {/* High-Fidelity Custom Cohort visual bars (with stacked portrait circular avatars floating above just like in mockup mockup) */}
          <div className="flex items-end justify-between gap-2.5 bg-[#0A0A0F] p-4 rounded-2xl border border-[#1E1E2E] min-h-[235px]">
            {cohortData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                
                {/* Tooltip on Hover showing precise retention */}
                <div className="absolute bottom-full mb-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-[#1E1E2E] text-[10px] text-white px-2 py-1 rounded shadow-xl whitespace-nowrap z-20 pointer-events-none">
                  {item.rate}% Retenção
                </div>

                {/* Floating Avatar Face (Matches mockup beautifully!) */}
                <div className="w-6 h-6 rounded-full border border-[#1E1E2E] overflow-hidden group-hover:scale-125 group-hover:border-white transition-all shadow-md">
                  <img src={item.avatar} alt="User mask" className="w-full h-full object-cover" />
                </div>

                {/* Custom Gradient Rounded Vertical Bar Progress */}
                <div className="w-5 bg-[#161623] rounded-full h-28 relative overflow-hidden flex items-end">
                  <div
                    className={`w-full rounded-full bg-gradient-to-t ${item.progressColor} group-hover:brightness-110 transition`}
                    style={{ height: `${item.rate}%` }}
                  />
                </div>

                {/* Day label */}
                <span className="text-[10px] text-[#A0A0C0] group-hover:text-white font-bold transition">
                  {item.day}
                </span>

              </div>
            ))}
          </div>

          <div className="pt-4 text-[10px] text-[#8888AA] flex items-center justify-between border-t border-[#1E1E2E] mt-3">
            <span>Pontuação Máxima Sáb: <strong className="text-[#FE2C55]">95%</strong></span>
            <span className="text-cyan-400 font-extrabold cursor-pointer hover:underline" onClick={() => onNavigate('/roteiros')}>Otimizar ganchos</span>
          </div>

        </div>

      </div>

      {/* Row 3: Bottom Left Donut chart Revenue Source + Bottom Right Connections active listing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Source Mix (Donut chart 1/3) */}
        <div className="bg-[#010101] border border-[#1E1E2E] rounded-3xl p-5 hover:border-indigo-500/20 transition relative">
          
          <div className="border-b border-[#1E1E2E] pb-3 mb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Vendas por Origem do Link
            </h3>
            <p className="text-[11px] text-[#8888AA]">Gráfico de conversão por canal de checkout</p>
          </div>

          <div className="bg-[#0A0A0F] p-4 rounded-2xl border border-[#1E1E2E]/60 flex flex-col items-center justify-center min-h-[220px]">
            {/* Recharts Pie Chart in High fidelity */}
            <div className="w-full h-36 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={54}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#010101', borderColor: '#1E1E2E', fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-bold text-[#8888AA]">Shopee + shop</span>
                <span className="text-base font-black text-white">R$ 9.257</span>
              </div>
            </div>

            {/* Custom Interactive Legend Row */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4 border-t border-[#1D1D2C]/40 pt-3">
              {revenueSources.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: item.color }} />
                  <div className="text-[10px] leading-tight min-w-0">
                    <span className="text-[#8888AA] block truncate">{item.name}</span>
                    <strong className="text-white font-bold">{item.value}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* System Connections table (Mockup Layout 2/3) */}
        <div className="lg:col-span-2 bg-[#010101] border border-[#1E1E2E] rounded-3xl p-6 hover:border-cyan-400/25 transition flex flex-col justify-between">
          
          <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3 mb-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-emerald-400" /> Sincronização Inteligente de Ofertas
              </h3>
              <p className="text-[11px] text-[#8888AA]">Integre campanhas, fotos do Flowy e inventários diretamente do seu centro operacional.</p>
            </div>
            
            <button
              onClick={() => onNavigate('/configuracoes')}
              className="text-xs text-cyan-400 font-extrabold flex items-center gap-1.5 hover:underline"
            >
              Conectar Mais APIs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* List of high-fidelity sync tables (Mockup Visual) */}
          <div className="space-y-3">
            {integrations.map((item) => (
              <div key={item.id} className="p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl flex items-center justify-between gap-4 group hover:border-[#1E1E2E]/80 transition">
                <div className="flex items-center gap-3">
                  {/* Status Indicator circle light */}
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${item.enabled ? 'bg-emerald-400/20 text-emerald-400' : 'bg-rose-400/20 text-rose-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full block ${item.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      {item.name}
                      <span className="text-[9px] font-bold px-2 py-0.2 bg-[#1A1A2A] text-[#8888AA] rounded">{item.type}</span>
                    </h4>
                    <p className="text-[10px] text-[#8888AA] mt-0.5">{item.speed}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Additional diagnostic text */}
                  {item.enabled && (
                    <span className="text-[8px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-2 py-0.5 rounded font-black hidden sm:inline-block uppercase tracking-wider">
                      AUTOMAÇÃO ONLINE
                    </span>
                  )}

                  {/* Toggle Switch Pill */}
                  <button
                    onClick={() => handleToggleIntegration(item.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors relative duration-200 focus:outline-none ${
                      item.enabled ? 'bg-emerald-500' : 'bg-[#1E1E2E]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-all transform pointer-events-none shadow-sm ${
                        item.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-[#666688] pt-4 mt-2 border-t border-[#1C1C2C]/50 text-center">
            Precisa de chaves personalizadas? Acesse Configurações para gerir tokens de webhook e chaves para MercadoLivre/TikTok Shop.
          </p>

        </div>

      </div>

    </div>
  );
}
