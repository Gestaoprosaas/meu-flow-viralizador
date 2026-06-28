import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Star, MessageSquare } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function SocialProofSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const testimonials = [
    {
      name: "Daniela Souza",
      role: "Afiliada Dropshipping BR",
      niche: "Nicho: Casa & Utilidades",
      text: "Subi meu primeiro roteiro gerado de um triturador inteligente de alimentos. A estrutura do hook de 3 segundos reteve 5x mais espectadores no orgânico do TikTok. Tive R$ 34.000 faturados no primeiro mês de teste.",
      initials: "DS",
      color: "from-pink-500/20 to-rose-500/10"
    },
    {
      name: "Rafael Martins",
      role: "Sócio de E-commerce",
      niche: "Nicho: Fitness & Saúde",
      text: "Consigo criar instantaneamente fotos comerciais ambientadas excelentes do meu e-commerce de garrafas inteligentes sem gastar com estúdios caros. Meu ROI no TikTok Ads duplicou com as novas variações.",
      initials: "RM",
      color: "from-cyan-500/20 to-blue-500/10"
    },
    {
      name: "Beatriz Mello",
      role: "Afiliada Shop Master",
      niche: "Nicho: Beleza & Cosméticos",
      text: "A dublagem humanizada de vendas acelerou muito minha operação de canais dark no TikTok Shop. Os vídeos passam pela qualificação do algoritmo sem problemas e as vendas caem todos os dias no orgânico.",
      initials: "BM",
      color: "from-purple-500/20 to-violet-500/10"
    }
  ];

  return (
    <section ref={containerRef} id="social-proof-section-root" className="relative w-full bg-[#0A0A0F] py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E] overflow-hidden">
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10 font-sans text-center">
        <div className="space-y-4">
          <span className="text-xs text-[#FE2C55] font-black uppercase tracking-widest bg-[#FE2C55]/10 px-3.5 py-1.5 rounded-full border border-[#FE2C55]/20 inline-block">
            MÉTRICAS ATIVAS
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
            <AnimatedCounter target={12847} duration={2500} suffix=" campanhas" />
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">
            Geradas por afiliados e lojas brasileiras no último trimestre para alavancar feeds do TikTok Shop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 35 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-[#111118]/80 border border-white/[0.04] rounded-2xl p-8 h-full flex flex-col justify-between group hover:border-white/[0.08] transition-colors duration-300 relative overflow-hidden">
                <div className={`absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gradient-to-tr ${test.color} blur-2xl opacity-40 group-hover:opacity-60 transition duration-500`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#FE2C55]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-8 border-t border-white/[0.04] pt-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FE2C55]/20 to-[#69C9D0]/10 border border-white/[0.07] text-white font-bold flex items-center justify-center text-xs">
                    {test.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white">{test.name}</h5>
                    <span className="text-[10px] text-gray-500 font-bold block">{test.role}</span>
                    <span className="text-[9px] text-[#69C9D0] uppercase font-bold tracking-wider">{test.niche}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
