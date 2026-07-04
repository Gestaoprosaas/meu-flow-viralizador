import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Ticket, Copy, Share2, Check } from 'lucide-react';

export function ScreenIndique() {
  const [cupom, setCupom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [animPhase, setAnimPhase] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/meu-cupom')
      .then(res => res.json())
      .then(data => {
        setCupom(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateAnimation = () => {
    setAnimating(true);
    setAnimPhase(1);
    
    setTimeout(() => setAnimPhase(2), 1000);
    setTimeout(() => setAnimPhase(3), 2000);
    setTimeout(() => {
      setAnimPhase(4);
      setTimeout(() => {
        setAnimating(false);
        setAnimPhase(0);
      }, 2000);
    }, 3000);
  };

  const handleCopy = () => {
    if (cupom) {
      navigator.clipboard.writeText(cupom.cupom);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (cupom && navigator.share) {
      navigator.share({
        title: 'Meu Cupom de Desconto',
        text: `Use meu cupom ${cupom.cupom} e ganhe 40% de desconto na assinatura!`
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return <div className="flex-1 p-8 text-center text-[#8888AA]">Carregando...</div>;
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-4xl mx-auto w-full relative">
      <AnimatePresence>
        {animating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <div className="text-center space-y-6">
              {animPhase === 1 && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                  <div className="text-5xl animate-bounce">🔮</div>
                  <h2 className="text-xl font-bold text-white tracking-wide">Gerando seu cupom exclusivo...</h2>
                </motion.div>
              )}
              {animPhase === 2 && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                  <div className="text-5xl animate-pulse">💎</div>
                  <h2 className="text-xl font-bold text-amber-400 tracking-wide">Aplicando desconto de 40%...</h2>
                  <div className="w-64 h-2 bg-[#1E1E2E] rounded-full mx-auto overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "100%" }} 
                      transition={{ duration: 1 }}
                      className="h-full bg-amber-400" 
                    />
                  </div>
                </motion.div>
              )}
              {animPhase === 3 && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                  <div className="text-5xl">🔗</div>
                  <h2 className="text-xl font-bold text-[#25F4EE] tracking-wide">Vinculando ao seu checkout...</h2>
                </motion.div>
              )}
              {animPhase === 4 && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-black text-emerald-400 tracking-wide">Cupom criado com sucesso!</h2>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 mt-12 sm:mt-24">
        {!cupom ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
              <Ticket className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Programa de Indicação</h2>
            <p className="text-[#8888AA] max-w-md mx-auto">
              Peça ao superadministrador para gerar o seu cupom exclusivo de 40% de desconto.
            </p>
          </div>
        ) : (
          <div className="space-y-8 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="text-amber-400 w-6 h-6" />
              Indique Amigos
            </h2>

            <button 
              onClick={handleCreateAnimation}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              ✨ Criar Meu Cupom
            </button>

            <div className="relative mt-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl rounded-3xl opacity-50 transition-opacity group-hover:opacity-100" />
              <div className="relative bg-[#0A0A0F] border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                
                <span className="inline-block bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
                  🎟️ SEU CUPOM EXCLUSIVO
                </span>

                <div className="py-4">
                  <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-600 tracking-tight">
                    {cupom.cupom}
                  </h3>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-bold text-white">
                    De <span className="line-through text-[#8888AA]">R${Number(cupom.preco_original).toFixed(2)}</span> por <span className="text-emerald-400">R${Number(cupom.preco_com_desconto).toFixed(2)}</span>
                  </div>
                  <div className="text-sm font-bold text-amber-400">
                    {cupom.desconto_percentual}% de desconto
                  </div>
                </div>

                <div className="pt-6 border-t border-[#1E1E2E]/60 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    className="py-3 bg-[#111118] border border-[#1E1E2E] hover:border-amber-500/50 hover:bg-amber-500/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar Cupom'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8888AA] leading-relaxed">
              Compartilhe este cupom com seus clientes. Quando colarem na página de vendas, o desconto será aplicado automaticamente e eles serão direcionados para o seu checkout exclusivo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
