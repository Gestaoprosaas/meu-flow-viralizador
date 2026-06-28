"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Flame, 
  HelpCircle,
  TrendingUp,
  Award,
  Video,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export default function UpgradePricingPage() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error("Erro ao carregar perfil para upgrade:", e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSelectPlan = async (planKey: string, price: number) => {
    setLoadingPlan(planKey);
    setSuccessMsg("");
    try {
      // Synchronize with API to trigger profile activation & credit allocation
      const res = await fetch('/api/profile/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey })
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        
        // Also fire off a simulated Asaas payment/webhook to simulate real gateway confirmations!
        await fetch('/api/webhook/asaas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'PAYMENT_CONFIRMED',
            value: price,
            customerEmail: updatedProfile.email || 'gestaoprosaas@gmail.com',
            customerName: updatedProfile.name || 'Gestão Pro SaaS'
          })
        });

        setSuccessMsg(`Parabéns! Sua assinatura do plano ${planKey.toUpperCase()} foi confirmada. Seus créditos e recursos já estão liberados!`);
        
        // Auto-scroll to top to see notification
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Falha ao processar assinatura:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const getMonthlyPrice = (planKey: string) => {
    if (planKey === 'free') return 0;
    if (planKey === 'starter') return isAnnual ? 77 : 97;
    if (planKey === 'pro') return isAnnual ? 157 : 197;
    if (planKey === 'agency') return isAnnual ? 397 : 497;
    return 0;
  };

  const plans = [
    {
      key: 'free',
      name: 'Plano Grátis',
      description: 'Ideal para experimentar o criador de ganchos virais.',
      badge: 'Básico',
      accent: 'border-[#1E1E2E] hover:border-[#8888AA]/30 bg-[#0A0A0F]',
      priceDesc: 'R$ 0 para sempre',
      limits: { text: 10, image: 5, video: 0 },
      features: [
        '10 Roteiros de ganchos do Tiktok/mês',
        '5 Imagens comerciais ultra-realistas',
        'Acesso básico à Biblioteca Viral',
        'Suporte comunitário'
      ]
    },
    {
      key: 'starter',
      name: 'Plano Starter',
      description: 'Perfeito para afiliados que desejam iniciar na escala.',
      badge: 'Melhor Custo x Benefício',
      accent: 'border-[#1E1E2E] hover:border-[#7C3AED]/30 bg-[#111118]',
      priceDesc: isAnnual ? 'Cobrado anualmente (R$ 924)' : 'Cancelamento sem multas',
      limits: { text: 50, image: 30, video: 3 },
      features: [
        '50 Roteiros de alta conversão/mês',
        '30 Imagens realistas com mockups',
        '3 Vídeos virais auto-gerados/mês',
        'Editor de texto e ganchos inteligentes',
        'Suporte por email prioritário'
      ]
    },
    {
      key: 'pro',
      name: 'Plano Pro AI',
      description: 'O segredo de produtores para dominar canais virais.',
      badge: 'Mais Recomendado ⚡',
      popular: true,
      accent: 'border-[#7C3AED] shadow-xl shadow-[#7C3AED]/10 bg-[#16132D]/45',
      priceDesc: isAnnual ? 'Cobrado anualmente (R$ 1.884)' : 'Cancelamento sem burocracias',
      limits: { text: 200, image: 100, video: 15 },
      features: [
        '200 Roteiros de alta conversão/mês',
        '100 Imagens para anúncios realistas',
        '15 Vídeos de alta retenção no Kling/mês',
        'Prioridade máxima na fila do modelo',
        'Suporte premium pelo WhatsApp',
        'Acesso completo a novos lançamentos'
      ]
    },
    {
      key: 'agency',
      name: 'Plano Agência',
      description: 'Infraestrutura robusta de mineração e automação em lote.',
      badge: 'Escala Extrema 🏆',
      accent: 'border-[#1E1E2E] hover:border-[#06B6D4]/30 bg-[#111118]',
      priceDesc: isAnnual ? 'Cobrado anualmente (R$ 4.764)' : 'Vagas limitadas mensais',
      limits: { text: 999, image: 500, video: 60 },
      features: [
        '999 Roteiros premium otimizados/mês',
        '500 Imagens comerciais ilimitadas/mês',
        '60 Vídeos renders ultra-HD/mês',
        'Ganchos e CTAs exclusivos de agência',
        'Gerente de conta individual',
        'Consultoria mensal de tráfego pago'
      ]
    }
  ];

  const currentPlan = profile?.plan || 'free';

  return (
    <div className="space-y-8 animate-fade-in text-[#F0F0FF] pb-12">
      {/* Header Page Title */}
      <div className="text-center py-6 bg-gradient-to-b from-[#181530] to-transparent border border-[#7C3AED]/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
        
        <span className="flex items-center gap-1.5 text-xs text-yellow-400 font-extrabold uppercase bg-yellow-400/10 px-3.5 py-1 rounded-full border border-yellow-400/20 w-fit mx-auto mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Acesso Completo e Ilimitado
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
          Escolha o Plano Ideal para a sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">Escala de Vendas</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA] max-w-xl mx-auto mt-2">
          Gere roteiros hipnotizantes, renderize em ultra alto realismo e multiplique visualizações em minutos.
        </p>

        {/* Annual / Monthly Billing Switcher Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-xs font-bold ${!isAnnual ? 'text-white' : 'text-[#8888AA]'}`}>Mensal</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-[#1A1A26] border border-[#2B2B3D] p-1 flex items-center transition relative"
            id="toggle-plan-interval"
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1 ${isAnnual ? 'text-white' : 'text-[#8888AA]'}`}>
            Anual
            <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
              Economize 20%
            </span>
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Plans Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((p) => {
          const mPrice = getMonthlyPrice(p.key);
          const isSelected = currentPlan.toLowerCase() === p.key.toLowerCase();

          return (
            <div 
              key={p.key}
              className={`border rounded-2xl p-5 md:p-6 flex flex-col justify-between relative transition duration-300 ${p.accent} ${p.popular ? 'border-t-4 border-t-[#7C3AED]' : ''}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-[9px] font-extrabold uppercase text-white shadow-md whitespace-nowrap">
                  {p.badge}
                </div>
              )}

              {!p.popular && p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#1E1E2E] border border-[#1E1E2E] text-[9px] font-bold uppercase text-[#8888AA] whitespace-nowrap">
                  {p.badge}
                </div>
              )}

              <div className="space-y-4">
                {/* Title and price */}
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#8888AA]">{p.name}</h3>
                  <p className="text-[10px] text-[#666688] mt-0.5 leading-snug">{p.description}</p>
                  
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">R$ {mPrice}</span>
                    <span className="text-[10px] text-[#8888AA]">/mês</span>
                  </div>
                  <span className="text-[10px] text-[#555577] block mt-0.5">{p.priceDesc}</span>
                </div>

                {/* Quotas allocations cards */}
                <div className="grid grid-cols-3 gap-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-center text-[10px] items-center">
                  <div>
                    <div className="font-extrabold text-white flex items-center justify-center gap-0.5">
                      <FileText className="w-2.5 h-2.5 text-[#7C3AED]" />
                      {p.limits.text}
                    </div>
                    <div className="text-[8px] text-[#8888AA]">Roteiros</div>
                  </div>
                  <div className="border-x border-[#1E1E2E]">
                    <div className="font-extrabold text-white flex items-center justify-center gap-0.5">
                      <ImageIcon className="w-2.5 h-2.5 text-[#06B6D4]" />
                      {p.limits.image}
                    </div>
                    <div className="text-[8px] text-[#8888AA]">Imagens</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-white flex items-center justify-center gap-0.5">
                      <Video className="w-2.5 h-2.5 text-red-400" />
                      {p.limits.video}
                    </div>
                    <div className="text-[8px] text-[#8888AA]">Vídeos</div>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 pt-2 border-t border-[#1E1E2E]">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[11px] text-[#A0A0C0] leading-snug">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  disabled={isSelected || loadingPlan !== null}
                  onClick={() => handleSelectPlan(p.key, mPrice)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition ${
                    isSelected
                      ? 'bg-[#1E1E2E] text-[#8888AA]/50 border border-transparent cursor-not-allowed'
                      : p.popular
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 text-white shadow-lg shadow-[#7C3AED]/15'
                      : 'bg-[#1A1A26] border border-[#1E1E2E] hover:bg-[#20202F] text-white'
                  }`}
                >
                  {loadingPlan === p.key ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verificando Pix seguro...
                    </span>
                  ) : isSelected ? (
                    'Plano Ativo'
                  ) : (
                    'Adquirir com Asaas FastPass'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Policy Info Banner */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-3 items-start">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Transações Criptografadas com Garantia Asaas</h4>
            <p className="text-[11px] text-[#8888AA]">Toda a nossa infraestrutura de checkout é intermediada pela Asaas IP S/A, com certificação PCI-DSS e pagamentos compensados via PIX ou cartão de crédito em menos de 3 segundos.</p>
          </div>
        </div>
        
        <button 
          onClick={() => router.push('/dashboard/configuracoes')} 
          className="text-white hover:underline text-xs font-bold shrink-0 py-2 bg-[#1A1A26] border border-[#1E1E2E] px-4 rounded-xl"
        >
          Minha Conta e Cobranças
        </button>
      </div>
    </div>
  );
}
