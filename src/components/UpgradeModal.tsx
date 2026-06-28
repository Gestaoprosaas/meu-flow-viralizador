import React, { useState } from 'react';
import { X, Check, Zap, Flame, ShieldCheck } from 'lucide-react';

interface UpgradeModalProps {
  currentPlan: string;
  onUpgradeComplete: (newPlan: 'free' | 'starter' | 'pro' | 'agency') => void;
  onClose: () => void;
}

export default function UpgradeModal({
  currentPlan,
  onUpgradeComplete,
  onClose
}: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Grátis",
      price_monthly: 0,
      price_yearly: 0,
      credits: { text: 10, image: 5, video: 0 },
      features: ["10 roteiros/mês", "5 fotos comerciais/mês", "Acesso à biblioteca viral limitada", "Produtos em alta limitados"]
    },
    {
      id: "starter",
      name: "Starter",
      price_monthly: 97,
      price_yearly: 797,
      credits: { text: 50, image: 30, video: 3 },
      features: ["50 roteiros/mês", "30 fotos comerciais/mês", "3 vídeos IA por mês", "Suporte prioritário por email", "Parceria de afiliados (30%)"],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price_monthly: 197,
      price_yearly: 1597,
      credits: { text: 200, image: 100, video: 15 },
      features: ["200 roteiros/mês", "100 fotos comerciais/mês", "15 vídeos IA por mês", "Suporte prioritário por chat", "Acesso total à biblioteca real-time", "Parceria de afiliados (30%)"],
      popular: true
    },
    {
      id: "agency",
      name: "Agência",
      price_monthly: 497,
      price_yearly: 3997,
      credits: { text: 999, image: 500, video: 60 },
      features: ["Ilimitado (999 roteiros)", "500 fotos comerciais/mês", "60 vídeos IA por mês", "Multi-usuário (até 5 assentos)", "Gerente dedicado WhatsApp", "Parceria especial de afiliados (40%)"]
    }
  ];

  const handleSelectPlan = async (planId: 'free' | 'starter' | 'pro' | 'agency') => {
    setLoadingPlan(planId);
    try {
      const response = await fetch('/api/profile/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      });
      if (response.ok) {
        onUpgradeComplete(planId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0F]/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl shadow-[#7C3AED]/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E1E2E]">
          <div>
            <h2 className="text-xl font-extrabold text-[#F0F0FF] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#7C3AED] fill-[#7C3AED]" />
              Escolha seu plano PROJETO VITÃO
            </h2>
            <p className="text-xs sm:text-sm text-[#8888AA]">Multiplique suas vendas no TikTok Shop com recursos ilimitados</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8888AA] hover:text-[#F0F0FF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Billing */}
        <div className="flex justify-center my-6">
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-1.5 rounded-full flex items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                billingCycle === 'monthly' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-[#F0F0FF]'
              }`}
            >
              Cobrança Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-[#F0F0FF]'
              }`}
            >
              Cobrança Anual
              <span className="text-[9px] bg-[#06B6D4] text-black font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 overflow-y-auto flex-1">
          {plans.map((pl) => {
            const isCurrent = currentPlan === pl.id;
            const price = billingCycle === 'monthly' ? pl.price_monthly : pl.price_yearly;
            const isFree = pl.id === 'free';

            return (
              <div
                key={pl.id}
                className={`flex flex-col relative rounded-xl p-5 border transition-all ${
                  pl.popular
                    ? 'bg-[#151522] border-[#7C3AED] shadow-md shadow-[#7C3AED]/15'
                    : 'bg-[#111118] border-[#1E1E2E]'
                }`}
              >
                {pl.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    Mais Vendido
                  </span>
                )}

                <h3 className="text-base font-bold text-[#F0F0FF] mb-1">{pl.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-extrabold text-white">R$ {price}</span>
                  <span className="text-xs text-[#8888AA]">/{billingCycle === 'monthly' ? 'mês' : 'ano'}</span>
                </div>

                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 mb-4 text-xs">
                  <div className="font-semibold text-white mb-1">Créditos incluídos:</div>
                  <ul className="space-y-1 text-[#8888AA]">
                    <li className="flex justify-between">
                      <span>Roteiro (Texto):</span>
                      <strong className="text-[#F0F0FF]">{pl.credits.text}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Imagem (Fotos):</span>
                      <strong className="text-[#F0F0FF]">{pl.credits.image}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Vídeos IA:</span>
                      <strong className="text-[#F0F0FF]">{pl.credits.video}</strong>
                    </li>
                  </ul>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {pl.features.map((ft, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-[#8888AA]">
                      <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span>{ft}</span>
                    </li>
                  ))}
                </ul>

                {/* Select button */}
                <button
                  disabled={isCurrent || loadingPlan !== null}
                  onClick={() => handleSelectPlan(pl.id as any)}
                  className={`w-full py-2 rounded-lg font-bold text-xs transition duration-200 active:scale-95 ${
                    isCurrent
                      ? 'bg-[#1E1E2E] text-[#8888AA] cursor-default'
                      : pl.popular
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95'
                      : 'bg-white text-black hover:bg-gray-150'
                  }`}
                >
                  {loadingPlan === pl.id ? (
                    <span className="flex items-center justify-center gap-1">
                      <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processando...
                    </span>
                  ) : isCurrent ? (
                    'Ativo atualmente'
                  ) : (
                    'Assinar plano'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#1E1E2E] bg-[#0A0A0F] rounded-b-2xl flex flex-wrap justify-between items-center text-[10px] text-[#8888AA] gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            Processamento de cartão e Pix via Asaas S.A. com RLS ativo. Cancelamento a qualquer momento.
          </div>
          <div>Suporte premium: suporte@projetovitao.com.br</div>
        </div>

      </div>
    </div>
  );
}
