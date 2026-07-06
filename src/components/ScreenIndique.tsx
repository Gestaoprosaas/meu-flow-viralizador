import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, Share2, Check, DollarSign, Gift, ArrowLeft, Flame, XCircle } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';

export function ScreenIndique({ profile }: { profile?: any }) {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [modo, setModo] = useState<'lucrar' | 'presentear' | null>(null);
  const [cupom, setCupom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [animating, setAnimating] = useState(false);
  const [animPhase, setAnimPhase] = useState<0|1|2|3|4>(0);
  const [count, setCount] = useState(3);
  const [showCupomResult, setShowCupomResult] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (animPhase === 3) {
      setCount(3);
      const t = setInterval(() => setCount(c => c > 1 ? c - 1 : 1), 300);
      return () => clearInterval(t);
    }
  }, [animPhase]);

  useEffect(() => {
    const fetchCupom = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      // se não passar profile, tentamos pegar o user atual (mas vamos usar api/admin/meu-cupom tb)
      try {
        let userEmail = profile?.email;
        if (!userEmail) {
          const { data: { session } } = await supabase.auth.getSession();
          userEmail = session?.user?.email;
        }

        if (userEmail) {
          const { data, error } = await supabase
            .from('cupons_admins')
            .select('*')
            .eq('admin_email', userEmail)
            .single();
            
          if (data && !error) {
            setCupom(data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCupom();
  }, [profile]);

  const handleCreateAnimation = () => {
    if (!cupom) return;
    setAnimating(true);
    setAnimPhase(1);
    setTimeout(() => setAnimPhase(2), 800);
    setTimeout(() => setAnimPhase(3), 1800);
    setTimeout(() => setAnimPhase(4), 2800);
    setTimeout(() => { 
      setAnimPhase(0); 
      setAnimating(false);
      setShowCupomResult(true); 
    }, 4000);
  };

  const selectModo = (m: 'lucrar' | 'presentear') => {
    setModo(m);
    setEtapa(2);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center p-8 text-[#8888AA]">Carregando...</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-5xl mx-auto w-full relative">
      
      {/* ETAPA 1 */}
      {etapa === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              PROGRAMA VIP EXCLUSIVO
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">INDIQUE AMIGOS</h1>
            <p className="text-[#8888AA] text-sm sm:text-base">Você decide se quer lucrar ou presentear.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Card LUCRAR */}
            <div 
              onClick={() => selectModo('lucrar')}
              className="bg-[#111118] border border-[#1E1E2E] hover:border-amber-500/30 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)]"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">LUCRAR</span>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-amber-500" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3">Você recebe 50% do valor da compra e seu amigo ganha 20% de desconto.</h3>
              
              <ul className="space-y-2.5 mb-8 flex-1">
                {["50% direto no seu bolso", "20% de desconto pro amigo", "Sem limite de indicações"].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#8888AA]">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-[#1E1E2E]">
                <p className="text-sm font-bold text-emerald-400 text-center">R$ 497 = R$ 248,50 pra você</p>
              </div>
            </div>

            {/* Card PRESENTEAR */}
            <div 
              onClick={() => selectModo('presentear')}
              className="bg-[#111118] border border-[#1E1E2E] hover:border-[#813EF6]/30 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(129,62,246,0.15)]"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-gradient-to-r from-[#813EF6] to-[#FE2C55] text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg shadow-purple-500/20">PRESENTEAR</span>
              </div>
              <div className="w-12 h-12 bg-[#813EF6]/10 border border-[#813EF6]/20 rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-6 h-6 text-[#813EF6]" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-3">Seu amigo recebe o Kit Viral Premium + 40% de desconto na assinatura. Você abre mão da comissão.</h3>
              
              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  "Prompts UGC prontos para copiar", 
                  "50 Ganchos Virais para TikTok Shop", 
                  "Acesso à biblioteca de anúncios vencedores", 
                  "Flow desbloqueado com condição especial", 
                  "40% de desconto na assinatura", 
                  "Você abre mão da comissão"
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#8888AA]">
                    <Check className="w-4 h-4 text-[#813EF6] mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-[#1E1E2E]">
                <p className="text-sm font-bold text-zinc-400 text-center">Gere até {cupom?.limite_cupons || 2} cupons por vez</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 2 */}
      {etapa === 2 && (
        <div className="animate-fade-in flex flex-col items-center">
          <div className="w-full max-w-2xl flex justify-start mb-6">
            <button onClick={() => setEtapa(1)} className="flex items-center gap-2 text-sm text-[#8888AA] hover:text-white transition">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          </div>

          {!cupom ? (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl p-10 text-center max-w-md w-full">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Flame className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Nenhum cupom configurado pelo administrador ainda.</h3>
              <p className="text-sm text-[#8888AA] mt-2">Peça ao admin para cadastrar o seu parceiro na aba de cupons.</p>
            </div>
          ) : (
            <div className="w-full max-w-3xl space-y-8">
              {/* BANNER DE ESCASSEZ */}
              <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-4 shadow-lg shadow-red-500/20 text-center animate-[pulse_2s_infinite]">
                <p className="text-white font-black text-lg sm:text-xl tracking-wide uppercase drop-shadow-md">
                  ⚡ ATENÇÃO: Apenas {cupom.limite_cupons || 2} cupons disponíveis agora!
                </p>
              </div>

              {/* GERADOR CUPOM LIVE */}
              <div className="bg-gradient-to-br from-[#111118] to-[#0A0A10] border border-[#1E1E35] rounded-3xl p-6 lg:p-10 shadow-2xl relative overflow-hidden group w-full">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  
                  {/* DETALHES DO PARCEIRO */}
                  <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl p-5 w-full text-left space-y-4 mb-2 shadow-inner">
                    <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-[#1E1E2E] pb-2">Detalhes da sua Oferta</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Nome do Parceiro</p>
                        <p className="text-sm text-white font-medium">{cupom.admin_nome}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Código do Cupom</p>
                        <p className="text-sm text-emerald-400 font-mono font-bold bg-emerald-500/10 inline-block px-2 py-0.5 rounded">{cupom.cupom}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Desconto</p>
                        <p className="text-sm text-amber-400 font-bold">{cupom.desconto_percentual}% OFF</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">De / Por</p>
                        <p className="text-sm text-white">R$ {Number(cupom.preco_original).toFixed(2)} / R$ {Number(cupom.preco_com_desconto).toFixed(2)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Checkout Vitalício</p>
                        <p className="text-xs text-[#8888AA] truncate bg-black/30 p-2 rounded border border-white/5 mt-1">{cupom.checkout_url_vitalicio}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-2 group-hover:scale-110 transition-transform duration-500">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">🎬 Gerador de Cupons </h2>
                    <p className="text-zinc-400 mt-2 max-w-lg mx-auto text-sm">Crie escassez real e aumente conversões. Durante sua live, ative seu cupom exclusivo com uma animação impactante.</p>
                  </div>
                  
                  <button 
                    onClick={handleCreateAnimation}
                    className="mt-4 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white font-black text-sm lg:text-base uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all active:scale-95 flex items-center gap-3"
                  >
                    <Sparkles className="w-5 h-5 fill-white" /> GERAR MEU CUPOM EXCLUSIVO
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN ANIMATION OVERLAY FOR LIVE COUPON */}
      {animPhase > 0 && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
          {animPhase === 1 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white animate-ping opacity-50" />
          )}
          {animPhase === 2 && (
            <div className="text-center space-y-6 animate-fade-in z-10">
              <div className="relative w-64 h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-[pulse_1s_infinite] w-full origin-left scale-x-0 transition-transform duration-[1000ms]" style={{ transform: 'scaleX(1)' }} />
              </div>
              <h2 className="text-xl font-black text-white tracking-widest uppercase animate-pulse">Gerando Cupom Exclusivo...</h2>
            </div>
          )}
          {animPhase === 3 && (
            <div className="z-10 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-amber-500 border-t-transparent animate-spin absolute" />
              <div className="text-8xl font-black text-white animate-ping">
                {count}
              </div>
            </div>
          )}
          {animPhase === 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-500/20">
              <div className="text-6xl font-black text-white animate-bounce scale-150">BOOM!</div>
            </div>
          )}
        </div>
      )}

      {/* RESULT MODAL FOR LIVE COUPON */}
      {showCupomResult && cupom && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] border-2 border-amber-500/50 rounded-3xl p-8 max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.2)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-6 py-1 rounded-b-xl uppercase tracking-widest">
              Oferta Exclusiva de Live
            </div>
            
            <Flame className="w-16 h-16 text-amber-500 mx-auto mt-4 mb-6 animate-pulse" />
            
            <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-6 mb-6">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Seu Código Promocional</p>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 tracking-wider font-mono select-all">
                {cupom.cupom}
              </h2>
            </div>
            
            <div className="space-y-1 mb-8">
              <p className="text-zinc-400 line-through">De R$ {Number(cupom.preco_original).toFixed(2)}</p>
              <p className="text-3xl font-black text-white">Por R$ {Number(cupom.preco_com_desconto).toFixed(2)}</p>
              <p className="text-emerald-400 font-bold text-sm bg-emerald-500/10 inline-block px-3 py-1 rounded-full mt-2">40% DE DESCONTO</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-8 animate-pulse">
              <p className="text-red-500 font-black tracking-widest uppercase">⚠️ Apenas {cupom.limite_cupons || 2} Cupons Disponíveis ⚠️</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { 
                  navigator.clipboard.writeText(cupom.cupom); 
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }} 
                className="py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} 
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <button onClick={() => setShowCupomResult(false)} className="py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-amber-500/20">
                <XCircle className="w-4 h-4" /> Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
