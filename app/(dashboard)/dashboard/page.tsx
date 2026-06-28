import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  FileText, 
  ImageIcon, 
  Video, 
  Sparkles, 
  TrendingUp, 
  ChevronRight, 
  Layers, 
  PlusCircle, 
  ShoppingBag,
  HelpCircle,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { createClient } from '../../../lib/supabase/server';
import StatsCard from '../../../components/dashboard/StatsCard';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Obtain logged user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 1. Fetch user profile limits & plans
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch counts for stats cards
  const { count: countScripts } = await supabase
    .from('script_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: countImages } = await supabase
    .from('image_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: countVideos } = await supabase
    .from('video_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Calculate remaining credit metrics
  let textLimit = 10;
  let imageLimit = 5;
  let videoLimit = 0;

  if (profile?.plan === 'starter') {
    textLimit = 50;
    imageLimit = 25;
    videoLimit = 5;
  } else if (profile?.plan === 'pro') {
    textLimit = 250;
    imageLimit = 100;
    videoLimit = 20;
  } else if (profile?.plan === 'agency') {
    textLimit = 1000;
    imageLimit = 500;
    videoLimit = 100;
  }

  const textCreditsLeft = Math.max(0, (profile?.credits_text ?? 0));
  const imageCreditsLeft = Math.max(0, (profile?.credits_image ?? 0));
  const videoCreditsLeft = Math.max(0, (profile?.credits_video ?? 0));

  const totalCreditsLeft = textCreditsLeft + imageCreditsLeft + videoCreditsLeft;
  const totalCreditsLimit = textLimit + imageLimit + videoLimit;

  // 3. Fetch latest generations (Last 5 copies/generations)
  // Fetch scripts
  const { data: latestScripts } = await supabase
    .from('script_generations')
    .select('id, product_name, platform, created_at, hook')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch images
  const { data: latestImages } = await supabase
    .from('image_generations')
    .select('id, image_type, platform, created_at, image_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Merge, normalize and sort by date descending
  type NormalizedItem = {
    id: string;
    type: 'roteiro' | 'imagem';
    title: string;
    subtitle: string;
    platform: string;
    date: string;
    extra?: string;
  };

  const combinedGenerations: NormalizedItem[] = [];

  if (latestScripts) {
    latestScripts.forEach(s => {
      combinedGenerations.push({
        id: s.id,
        type: 'roteiro',
        title: s.product_name,
        subtitle: s.hook.substring(0, 80) + (s.hook.length > 80 ? '...' : ''),
        platform: s.platform,
        date: s.created_at
      });
    });
  }

  if (latestImages) {
    latestImages.forEach(img => {
      combinedGenerations.push({
        id: img.id,
        type: 'imagem',
        title: `Foto ${img.image_type}`,
        subtitle: 'Imagem comercial pronta para campanha',
        platform: img.platform,
        date: img.created_at,
        extra: img.image_url
      });
    });
  }

  const sortedRecentGenerations = combinedGenerations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // 4. Fetch trending products (Mini limit to 3)
  const { data: trendingProducts } = await supabase
    .from('trending_products')
    .select('*')
    .order('opportunity_score', { ascending: false })
    .limit(3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#17152F] to-[#111118] border border-[#7C3AED]/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="flex items-center gap-1.5 text-xs text-[#06B6D4] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            TikTok Shop Inteligência Viral
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Olá, <span className="text-[#7C3AED]">{profile?.name || 'Vendedor'}</span> 🚀
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA] max-w-xl">
            Sua conta está ativa no plano <strong className="text-yellow-400 uppercase">{profile?.plan || 'Free'}</strong>. Pronto para minerar produtos em alta e gerar campanhas lucrativas?
          </p>
        </div>

        {/* Quick CTA */}
        <Link 
          href="/dashboard/roteiros"
          className="shrink-0 relative z-10 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-[#7C3AED]/20"
        >
          <PlusCircle className="w-4 h-4" />
          Criar Nova Campanha
        </Link>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Roteiros Gerados"
          value={countScripts ?? 0}
          icon={FileText}
          subtext="Modelos estruturados criados"
          color="purple"
        />
        <StatsCard
          title="Imagens Comerciais"
          value={countImages ?? 0}
          icon={ImageIcon}
          subtext="Fotos convertidas criadas"
          color="cyan"
        />
        <StatsCard
          title="Vídeos Gerados"
          value={countVideos ?? 0}
          icon={Video}
          subtext="Renderizações completas"
          color="emerald"
        />
        <StatsCard
          title="Créditos Disponíveis"
          value={`${totalCreditsLeft}/${totalCreditsLimit}`}
          icon={Zap}
          subtext="Clique para subir de plano"
          color="amber"
          trend={{ value: `${Math.round((totalCreditsLeft / (totalCreditsLimit || 1)) * 100)}%`, isPositive: true }}
        />
      </div>

      {/* Grid: Generations List & Trending sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left column: Recent Generations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold font-display text-white">Últimas Criações</h2>
              <p className="text-xs text-[#8888AA]">Gerações de roteiros e fotos mais recentes</p>
            </div>
            <Link 
              href="/dashboard/projects" 
              className="text-xs text-[#7C3AED] hover:underline flex items-center gap-1 font-semibold"
            >
              Ver todas as pastas
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Table list or empty state */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
            {sortedRecentGenerations.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A24] flex items-center justify-center border border-[#1E1E2E] text-[#8888AA]">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Nenhuma geração ainda</h4>
                  <p className="text-xs text-[#8888AA] max-w-sm mx-auto">
                    Você ainda não gerou criativos de vendas. Comece a criar seu primeiro roteiro para o TikTok!
                  </p>
                </div>
                <Link
                  href="/dashboard/roteiros"
                  className="px-4 py-2 bg-[#1E1E2E] border border-[#1E1E2E] hover:border-[#7C3AED]/40 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                  Criar primeiro roteiro
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#1E1E2E]/60">
                {sortedRecentGenerations.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#151522]/30 transition group">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.type === 'roteiro' ? (
                        <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center shrink-0 text-[#7C3AED]">
                          <FileText className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {item.extra ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.extra} alt="Foto comercial" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#06B6D4]" />
                          )}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[150px] sm:max-w-[240px]">
                            {item.title}
                          </span>
                          <span className="uppercase text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded bg-[#1E1E2E]/80 text-[#8888AA]">
                            {item.platform}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-[#8888AA] truncate max-w-[200px] sm:max-w-md mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] sm:text-xs text-[#8888AA] whitespace-nowrap font-mono">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <Link 
                        href={item.type === 'roteiro' ? '/dashboard/roteiros' : '/dashboard/imagens'}
                        className="p-1.5 bg-[#1E1E2E] hover:bg-[#7C3AED]/20 text-[#8888AA] hover:text-white rounded-lg transition"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Highlights Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold font-display text-white text-gradient bg-gradient-to-r from-white to-[#06B6D4]">Produtos Importados</h2>
              <p className="text-xs text-[#8888AA]">Nicho comercial em alta demanda</p>
            </div>
            <Link 
              href="/dashboard/produtos" 
              className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1 font-semibold"
            >
              Minerar todos
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {!trendingProducts || trendingProducts.length === 0 ? (
              <div className="p-6 bg-[#111118] border border-[#1E1E2E] rounded-2xl text-center">
                <p className="text-xs text-[#8888AA]">Nenhum produto viral em destaque hoje.</p>
              </div>
            ) : (
              trendingProducts.map((prod) => (
                <div key={prod.id} className="bg-[#111118]/90 border border-[#1E1E2E] rounded-2xl p-4 flex gap-3 hover:border-[#06B6D4]/30 transition relative overflow-hidden group">
                  <div className="w-14 h-14 rounded-xl bg-[#1E1E2E] shrink-0 overflow-hidden relative border border-[#1E1E2E]/80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="space-y-1 relative min-w-0 flex-1">
                    <span className="text-[9px] font-extrabold uppercase text-[#06B6D4]">
                      {prod.niche}
                    </span>
                    <h4 className="text-xs sm:text-xs font-bold text-white truncate leading-tight group-hover:text-[#06B6D4] transition">
                      {prod.name}
                    </h4>
                    <p className="text-[10px] text-[#8888AA] line-clamp-2 leading-snug">
                      {prod.description}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E1E2E]/60 text-[10px]">
                      <span className="text-emerald-400 font-extrabold">Score: {prod.opportunity_score}/100</span>
                      <span className="text-[#8888AA]">Competição: <strong>{prod.competition_level}</strong></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
