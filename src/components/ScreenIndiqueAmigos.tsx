import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle2, DollarSign } from 'lucide-react';

interface ScreenIndiqueAmigosProps {
  profile?: any;
}

export default function ScreenIndiqueAmigos({ profile }: ScreenIndiqueAmigosProps) {
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await fetch('/api/admin/coupons');
        if (res.ok) {
          const coupons = await res.json();
          // Find 'indicacao' coupon for this user
          const myCoupon = coupons.find((c: any) => c.admin_id === profile?.id && c.tipo === 'indicacao' && c.ativo);
          if (myCoupon) {
            setCouponCode(myCoupon.codigo);
          } else {
            setCouponCode(profile?.affiliate_code || 'N/A'); // Fallback
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, [profile]);

  const handleCopyLink = () => {
    const link = `https://viralseller.com/?cupom=${couponCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-20">
      
      <div className="p-6 bg-gradient-to-r from-purple-900/20 via-purple-900/5 to-transparent border border-purple-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Indique Amigos e Lucre
          </h2>
          <p className="text-sm text-[#8888AA] mt-1">
            Compartilhe seu link de indicação para que seus amigos recebam 40% de desconto na assinatura vitalícia, e você receba a sua parte direto na sua conta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Lucrar */}
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-black text-white">Modo Lucrar (40% OFF)</h3>
              <p className="text-xs text-[#8888AA] mt-1 max-w-xs mx-auto">
                Seu amigo ganha 20% de desconto e você fatura sua parte via coprodução no checkout.
              </p>
            </div>

            {loading ? (
              <div className="py-4 text-xs text-[#8888AA]">Carregando seu cupom...</div>
            ) : (
              <div className="w-full mt-4 space-y-3">
                <div className="bg-[#0C0C12] border border-[#1E1E2E] p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#666688] font-bold block uppercase mb-0.5">Seu Cupom de Indicação</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm tracking-widest">{couponCode}</span>
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500 hover:text-[#0C0C12] border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Link Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar Link de Venda
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
