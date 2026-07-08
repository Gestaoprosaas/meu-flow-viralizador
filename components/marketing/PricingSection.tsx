import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Gift } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planKey: 'starter' | 'pro' | 'agency', customUrl?: string) => void;
  cupomCode: string;
  setCupomCode: (val: string) => void;
  cupomAplicado: any;
  cupomError: string;
  setCupomError: (val: string) => void;
  cupomLoading: boolean;
  aplicarCupom: () => Promise<void>;
  appflyMonthly: string;
  appflyLifetime: string;
}

export default function PricingSection({
  onSelectPlan,
  cupomCode,
  setCupomCode,
  cupomAplicado,
  cupomError,
  setCupomError,
  cupomLoading,
  aplicarCupom,
  appflyMonthly,
  appflyLifetime
}: PricingSectionProps) {

  const formatPrice = (value: any) => {
    const parsed = parseFloat(value) || 0;
    return `R$ ${parsed.toFixed(2).replace('.', ',')}`;
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
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              aplicarCupom();
            }} 
            className="flex items-center gap-2 bg-[#0E0B13]/90 border border-white/[0.06] rounded-full p-1.5 pl-4 shadow-xl"
          >
            <Gift className="w-4 h-4 text-gray-500 shrink-0" />
            <input 
              type="text" 
              placeholder="TEM UM CUPOM DE INDICAÇÃO?" 
              value={cupomCode}
              onChange={(e) => {
                setCupomCode(e.target.value);
                setCupomError('');
              }}
              disabled={cupomLoading}
              className="bg-transparent text-white text-xs font-bold outline-none border-none placeholder-gray-600 w-full uppercase tracking-wider"
              id="coupon-input"
            />
            <button 
              type="submit"
              disabled={cupomLoading}
              className="bg-[#FE2C55] hover:bg-[#E01E45] disabled:opacity-50 text-white text-xs font-extrabold px-6 py-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-[1.02] tracking-widest shrink-0 flex items-center gap-1.5"
              id="coupon-apply-btn"
            >
              {cupomLoading ? (
                <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" />
              ) : null}
              <span>{cupomLoading ? 'APLICANDO...' : 'APLICAR'}</span>
            </button>
          </form>
          {cupomAplicado && (
            <p className="text-emerald-400 text-sm font-bold mt-2 animate-fade-in tracking-wide bg-emerald-500/10 py-2 px-4 rounded-lg border border-emerald-500/20 inline-block">
              ✅ Cupom {cupomAplicado.cupom} aplicado!
            </p>
          )}
          {cupomError && (
            <p className="text-[#FE2C55] text-sm font-bold mt-2 animate-fade-in tracking-wide inline-block">
              {cupomError}
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
              <p className="text-sm text-gray-400 mt-2 font-medium">
                Acesso completo com flexibilidade total.
              </p>
              
              {/* Cost layout exactly like image */}
              {cupomAplicado ? (
                <div className="mt-8">
                  <span className="line-through text-zinc-500 text-sm font-bold">R$ 245,00</span>
                  <div className="text-4xl font-black text-emerald-400">R$ 147,00</div>
                  <span className="text-xs text-zinc-400 mt-1 block font-bold tracking-wider">À VISTA — SEM PARCELAMENTO</span>
                </div>
              ) : (
                <>
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">R$ 245,00</span>
                    <span className="text-gray-500 text-xs font-extrabold tracking-widest uppercase">/MÊS</span>
                  </div>

                  {/* Subtitle information */}
                  <span className="text-[10px] font-mono text-gray-500 block mt-2 tracking-wider">
                    Cobre mensalmente recorrente.
                  </span>
                </>
              )}

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
                onClick={() => onSelectPlan('starter', appflyMonthly)}
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
              {cupomAplicado ? (
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black uppercase px-5 py-2 rounded-full tracking-widest shadow-lg shadow-red-500/25 flex items-center gap-1 animate-pulse">
                  🔥 {cupomAplicado.desconto_percentual || 40}% OFF
                </span>
              ) : (
                <span className="bg-[#FE2C55] text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-[#FE2C55]/25 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-white text-white" /> MELHOR CUSTO-BENEFÍCIO
                </span>
              )}
            </div>

            <div>
              <h4 className="text-2xl font-black text-white tracking-tight pt-2">Vitalício</h4>
              <p className="text-sm text-gray-400 mt-2 font-medium">
                Pague uma vez. Use para sempre, sem mensalidade.
              </p>
              
              {/* Cost layout exactly like image */}
              {cupomAplicado ? (
                <div className="mt-8 space-y-2 bg-[#120F1D]/50 border border-white/[0.03] p-4 rounded-2xl">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-sm font-bold text-zinc-500 line-through">
                      {formatPrice(cupomAplicado.preco_original || 497.00)}
                    </span>
                    <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                      {formatPrice(cupomAplicado.preco_com_desconto || 297.00)}
                    </span>
                  </div>
                  
                  <div className="text-base sm:text-lg font-black text-amber-300">
                    ou 12x R$31,75
                  </div>
                  
                  <div className="text-xs text-zinc-400 font-medium">
                    Economize R$ {((cupomAplicado.preco_original || 497.00) - (cupomAplicado.preco_com_desconto || 297.00)).toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">R$ 497,00</span>
                  <span className="text-gray-500 text-xs font-extrabold tracking-widest uppercase">PAGAMENTO ÚNICO</span>
                </div>
              )}

              {/* Subtitle info */}
              <span className="text-[10px] font-mono text-[#69C9D0] font-bold block mt-2 tracking-wider">
                Acesso para sempre. Sem anuidades.
              </span>
              
              {cupomAplicado?.tipo === 'presente' && (
                <div className="mt-3 bg-gradient-to-r from-amber-500/20 to-orange-500/5 border border-amber-500/30 rounded-lg p-2 flex items-center justify-center gap-2">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">+ Kit Viral Premium (EM BREVE)</span>
                </div>
              )}

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
                onClick={() => onSelectPlan('pro', appflyLifetime)}
                className="w-full py-4 rounded-xl bg-[#FE2C55]/5 hover:bg-[#FE2C55] hover:text-white border border-[#FE2C55]/30 text-[#FE2C55] font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:shadow-lg hover:shadow-[#FE2C55]/25"
                id="btn-select-vitalicio"
              >
                GARANTIR VITALÍCIO
              </button>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center max-w-lg mx-auto">
          <p className="text-[#8888AA] text-sm">
            Após o pagamento você receberá um email para criar sua senha e acessar a plataforma.
          </p>
        </div>

      </div>

    </section>
  );
}
