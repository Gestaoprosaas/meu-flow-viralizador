import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Gift } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planKey: 'starter' | 'pro' | 'agency') => void;
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon.trim()) {
      setCouponError('Por favor, digite um cupom.');
      setCouponApplied(false);
      return;
    }
    // Simulate a successful coupon application
    setCouponApplied(true);
    setCouponError('');
  };

  return (
    <section id="pricing-section" className="relative w-full bg-[#0A0A0F]/45 backdrop-blur-md py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E] overflow-hidden">
      
      {/* Ambient background blur */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#FE2C55]/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 font-sans text-center">
        
        {/* Title Group */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Escolha o ritmo da sua <span className="bg-gradient-to-r from-[#FE2C55] via-[#FF5F7E] to-[#69C9D0] bg-clip-text text-transparent">criação.</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-medium">
            Cancele quando quiser. Sem letras miúdas.
          </p>
        </div>

        {/* Coupon Area form landonorris style (Clean custom input element) */}
        <div className="max-w-md mx-auto pt-2 pb-6">
          <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 bg-[#0E0B13]/90 border border-white/[0.06] rounded-full p-1.5 pl-4 shadow-xl">
            <Gift className="w-4 h-4 text-gray-500 shrink-0" />
            <input 
              type="text" 
              placeholder="TEM UM CUPOM DE INDICAÇÃO?" 
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value);
                setCouponApplied(false);
                setCouponError('');
              }}
              className="bg-transparent text-white text-xs font-bold outline-none border-none placeholder-gray-600 w-full uppercase tracking-wider"
              id="coupon-input"
            />
            <button 
              type="submit"
              className="bg-[#FE2C55] hover:bg-[#E01E45] text-white text-xs font-extrabold px-6 py-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-[1.02] tracking-widest shrink-0"
              id="coupon-apply-btn"
            >
              APLICAR
            </button>
          </form>
          {couponApplied && (
            <p className="text-emerald-400 text-[11px] font-bold mt-2 animate-fade-in tracking-wide">
              ✓ CUPOM DE INDICAÇÃO ATIVADO! DESCONTO APLICADO NO CHECKOUT.
            </p>
          )}
          {couponError && (
            <p className="text-[#FE2C55] text-[11px] font-bold mt-2 animate-fade-in tracking-wide">
              ⚠ {couponError}
            </p>
          )}
        </div>

        {/* Planes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-6">
          
          {/* PLAN 1: MENSAL */}
          <div 
            id="plan-card-mensal"
            className="relative border border-white/[0.05] bg-[#0F0D15]/80 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between text-left transition-all duration-300 group hover:border-[#FE2C55]/20 hover:shadow-[0_0_40px_rgba(254,44,85,0.05)]"
          >
            <div>
              <h4 className="text-2xl font-black text-white tracking-tight">Mensal</h4>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Acesso completo ao Shopsy com flexibilidade total.
              </p>
              
              {/* Cost layout exactly like image */}
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">R$ 245,00</span>
                <span className="text-gray-500 text-xs font-extrabold tracking-widest uppercase">/MÊS</span>
              </div>

              {/* Subtitle information */}
              <span className="text-[10px] font-mono text-gray-500 block mt-2 tracking-wider">
                Cobre mensalmente recorrente.
              </span>

              {/* Features List with custom styled checkmarks */}
              <ul className="space-y-4 border-t border-white/[0.04] pt-6 mt-8">
                {[
                  'Acesso mensal à plataforma',
                  'Apenas 5 prompts de imagens por dia (Limite Diário)',
                  'Espionagem de produtos em alta',
                  'Gerador de vídeos com IA',
                  'Gerador de imagens com IA',
                  'Calendário de postagens',
                  'Tutorial completo passo a passo',
                  'Indique e Ganhe'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#FE2C55]/10 border border-[#FE2C55]/20 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#FE2C55]" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action button */}
            <div className="mt-8 pt-4 border-t border-white/[0.03]">
              <button
                type="button"
                onClick={() => onSelectPlan('starter')}
                className="w-full py-4 rounded-xl bg-white/[0.03] hover:bg-[#FE2C55] hover:text-white border border-white/[0.07] text-[#ECECFF] font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-lg hover:shadow-[#FE2C55]/15"
                id="btn-select-mensal"
              >
                ASSINAR MENSAL
              </button>
            </div>
          </div>

          {/* PLAN 2: VITALÍCIO */}
          <div 
            id="plan-card-vitalicio"
            className="relative border border-white/[0.05] bg-[#0F0D15]/80 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between text-left transition-all duration-300 group hover:border-[#69C9D0]/30 hover:shadow-[0_0_40px_rgba(105,201,208,0.05)] border-t-[#FE2C55]"
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#FE2C55] text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-[#FE2C55]/25 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-white text-white" /> MELHOR CUSTO-BENEFÍCIO
              </span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-white tracking-tight pt-2">Vitalício</h4>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Pague uma vez. Use para sempre, sem mensalidade.
              </p>
              
              {/* Cost layout exactly like image */}
              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">R$ 497,00</span>
                <span className="text-gray-500 text-xs font-extrabold tracking-widest uppercase">PAGAMENTO ÚNICO</span>
              </div>

              {/* Subtitle info */}
              <span className="text-[10px] font-mono text-[#69C9D0] font-bold block mt-2 tracking-wider">
                Acesso para sempre. Sem anuidades.
              </span>

              {/* Features List with custom styled checkmarks */}
              <ul className="space-y-4 border-t border-white/[0.04] pt-6 mt-8">
                {[
                  'Acesso Vitalício (pague uma vez, use para sempre)',
                  'Apenas 5 prompts de imagens por dia (Limite Diário)',
                  'Tudo do plano Mensal',
                  'Gerador de vídeos com IA',
                  'Gerador de imagens com IA',
                  'Suporte prioritário',
                  'Comunidade Exclusiva',
                  'Treinamento Personalizado',
                  'Indique e Ganhe',
                  'Bônus exclusivos'
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#FE2C55]/10 border border-[#FE2C55]/20 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#FE2C55]" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action button */}
            <div className="mt-8 pt-4 border-t border-white/[0.03]">
              <button
                type="button"
                onClick={() => onSelectPlan('pro')}
                className="w-full py-4 rounded-xl bg-[#FE2C55]/5 hover:bg-[#FE2C55] hover:text-white border border-[#FE2C55]/30 text-[#FE2C55] font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-lg hover:shadow-[#FE2C55]/25"
                id="btn-select-vitalicio"
              >
                GARANTIR VITALÍCIO
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
