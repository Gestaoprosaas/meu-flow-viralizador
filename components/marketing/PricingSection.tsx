import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planKey: 'starter' | 'pro' | 'agency') => void;
  onSelectFree: () => void;
}

export default function PricingSection({ onSelectPlan, onSelectFree }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      key: 'free' as const,
      name: 'Free / Grátis',
      price: 0,
      desc: 'Ideal para experimentar o painel',
      credits: '10 créditos de texto • 5 de imagem • 0 de vídeo',
      features: [
        'Modelos de roteamento básico',
        'Imagens comerciais em baixa resolução',
        'Central de mineração limitada',
        'Copys de vendas calibradas de entrada',
        'Sem suporte prioritário'
      ],
      popular: false,
      btnText: 'Começar Gratuitamente',
      highlightColor: 'border-white/10 hover:border-white/20'
    },
    {
      key: 'starter' as const,
      name: 'Starter',
      price: isAnnual ? 77 : 97,
      desc: 'Para afiliados e sellers acelerados',
      credits: '50 créditos de texto • 30 de imagem • 3 de vídeo',
      features: [
        'Modelos de roteamento completos',
        'Imagens ambientadas em HD',
        '3 dublagens realistas de voz por mês',
        'Exportação direta de criativos',
        'Acesso completo a Central de Hooks',
        'Suporte prioritário via e-mail'
      ],
      popular: false,
      btnText: 'Adquirir Starter',
      highlightColor: 'border-white/10 hover:border-[#69C9D0]/30'
    },
    {
      key: 'pro' as const,
      name: 'Pro',
      price: isAnnual ? 147 : 197,
      desc: 'O motor preferido dos Top Sellers BR',
      credits: '200 créditos de texto • 100 de imagem • 15 de vídeo',
      features: [
        'Tudo do plano Starter incluso',
        '15 dublagens realistas de IA premium',
        'Copys persuasivas com modelo de ponta',
        'Acesso total prioritário a tendências diárias',
        'Acesso ao treinamento de tráfego pago',
        'Suporte VIP individualizado via WhatsApp'
      ],
      popular: true,
      btnText: 'Garantir PRO (Com Desconto)',
      highlightColor: 'border-[#FE2C55] shadow-[0_0_30px_rgba(254,44,85,0.15)] bg-gradient-to-b from-[#111118] to-[#0D0D14]'
    },
    {
      key: 'agency' as const,
      name: 'Agency',
      price: isAnnual ? 397 : 497,
      desc: 'Para agências que operam múltiplas contas',
      credits: '999 créditos de texto • 500 de imagem • 60 de vídeo',
      features: [
        'Tudo do plano Pro incluso',
        'Acesso para até 5 colaboradores',
        '60 dublagens comerciais exclusivas',
        'Processamento VIP prioritário instantâneo',
        'Consultoria estratégica individual de criativos',
        'Suporte de contingência para páginas de vendas'
      ],
      popular: false,
      btnText: 'Dominar Mercado',
      highlightColor: 'border-white/10 hover:border-purple-500/30'
    }
  ];

  return (
    <section id="pricing-section-root" className="relative w-full bg-[#111118] py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E] overflow-hidden">
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#FE2C55]/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10 font-sans text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-xs text-[#69C9D0] font-black uppercase tracking-widest bg-[#69C9D0]/10 px-3.5 py-1.5 rounded-full border border-[#69C9D0]/20 inline-block">
            INVESTIMENTO SEGURO
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Planos Justos para Qualquer Operação
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Seja você um iniciante buscando as primeiras comissões ou uma agência estruturada faturando múltiplos dígitos no TikTok Shop.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 pb-4">
          <span className={`text-xs font-bold transition-all ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>COBRANÇA MENSAL</span>
          
          <button 
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-white/[0.05] border border-white/10 rounded-full p-1 flex items-center justify-start transition duration-300 relative"
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0] shadow-md transition duration-300 transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>

          <span className={`text-xs font-bold transition-all flex items-center gap-1.5 ${isAnnual ? 'text-[#69C9D0]' : 'text-gray-500'}`}>
            COBRANÇA ANUAL
            <span className="bg-[#69C9D0]/10 text-[#69C9D0] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-[#69C9D0]/20 font-mono">
              -20% OFF
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((p) => (
            <div 
              key={p.key} 
              className={`relative border rounded-2.5xl p-6 sm:p-7 flex flex-col justify-between text-left transition-all duration-300 group overflow-hidden ${p.highlightColor}`}
            >
              {p.popular && (
                <div className="absolute top-4 right-4 bg-[#FE2C55] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest flex items-center gap-1 shadow-lg shadow-[#FE2C55]/25">
                  <Sparkles className="w-3" /> MAIS POPULAR
                </div>
              )}

              <div>
                <span className="text-xs uppercase font-mono text-gray-500 tracking-wider block font-bold mb-2 font-sans">PROJETO VITÃO</span>
                <h4 className="text-xl font-black text-white font-sans">{p.name}</h4>
                <p className="text-xs text-gray-400 mt-2 min-h-[32px] font-sans">{p.desc}</p>
                
                <div className="mt-6 flex items-baseline gap-1 font-sans">
                  <span className="text-slate-400 text-xs font-bold">R$</span>
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">{p.price}</span>
                  <span className="text-slate-500 text-xs">/mês</span>
                </div>
                <span className="text-[10px] font-mono text-[#69C9D0] font-semibold block mt-1.5 italic min-h-[15px]">
                  {isAnnual ? `R$ ${(p.price * 12).toLocaleString('pt-BR')} cobrados anualmente` : 'Cobrado mensalmente'}
                </span>

                <span className="text-[11px] font-mono tracking-wide block bg-white/[0.03] border border-white/[0.04] p-2.5 rounded-xl text-[#69C9D0] font-bold mt-5 mb-6 text-center leading-relaxed">
                  {p.credits}
                </span>

                <ul className="space-y-3.5 border-t border-white/[0.04] pt-5">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 font-medium">
                      <Check className="w-4.5 h-4.5 text-[#69C9D0] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.03]">
                <button
                  type="button"
                  onClick={() => {
                    if (p.key === 'free') {
                      onSelectFree();
                    } else {
                      onSelectPlan(p.key);
                    }
                  }}
                  className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                    p.popular
                      ? 'bg-[#FE2C55] hover:bg-[#E01E45] text-white fill-white shadow-lg shadow-[#FE2C55]/25 hover:scale-103'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-[#ECECFF]'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${p.popular ? 'fill-yellow-300 text-yellow-300' : 'text-gray-400'}`} />
                  {p.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
