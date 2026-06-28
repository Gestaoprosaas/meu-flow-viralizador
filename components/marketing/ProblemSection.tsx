import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Clock, Users, ShieldAlert, Sparkles } from 'lucide-react';

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const cards = [
    {
      title: "Sem tempo",
      subtitle: "Gargalo Crônico de Operação",
      desc: "Pesquisar tendências diárias, escrever roteiros do zero e produzir b-rolls do seu produto físico consome horas que deveriam ser usadas fechando novas parcerias.",
      icon: Clock,
      borderColor: "hover:border-[#FE2C55]/30",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(254,44,85,0.1)]",
      iconColor: "text-[#FE2C55]"
    },
    {
      title: "Sem equipe",
      subtitle: "Escalar Sozinho é Impossível",
      desc: "Linguagem persuasiva exige copywriters. Vídeos exigem apresentadores corajosos e editores seniores para reter atenção. Nossa IA unifica todos estes talentos em segundos.",
      icon: Users,
      borderColor: "hover:border-[#69C9D0]/30",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(105,201,208,0.1)]",
      iconColor: "text-[#69C9D0]"
    },
    {
      title: "Sem resultado",
      subtitle: "O Pesadelo da Retenção Zero",
      desc: "Vídeos sem ganchos pensados psicologicamente são ignorados instantaneamente no feed. Criamos estruturas específicas calibradas para as taxas de retenção brasileiras.",
      icon: ShieldAlert,
      borderColor: "hover:border-purple-500/30",
      glowColor: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]",
      iconColor: "text-purple-400"
    }
  ];

  return (
    <section ref={containerRef} id="problem-section-root" className="relative w-full bg-[#111118] py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-white/[0.04] pb-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-xs text-[#FE2C55] font-bold uppercase tracking-wider block mb-3">
              BARREIRAS DE MERCADO
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Criar conteúdo bom <br className="hidden sm:block" />
              dá muito trabalho.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="md:text-right"
          >
            <span className="text-xs text-[#69C9D0] font-bold uppercase tracking-wider block mb-3 md:hidden">
              SOLUÇÃO INTELIGENTE
            </span>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#69C9D0] tracking-tight leading-[1.1]">
              A gente resolve isso <br className="hidden sm:block" />
              inteiro pra você.
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-4 max-w-md md:ml-auto leading-relaxed">
              Substitua toda a esteira complexa de roteirização, contratação de avatares caros e gravações cansativas por comandos simples dirigidos por inteligência artificial focada em vendas.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full"
              >
                <div className={`relative h-full bg-[#0A0A0F]/60 backdrop-blur-md border border-white/[0.04] p-8 rounded-2xl transition-all duration-300 ${card.borderColor} ${card.glowColor} flex flex-col justify-between`}>
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/[0.02]/10 border border-white/[0.05] relative ${card.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h4 className="text-xl font-black text-white group-hover:text-[#69C9D0] transition duration-300">
                      {card.title}
                    </h4>

                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block mt-1.5 mb-4">
                      {card.subtitle}
                    </span>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <div className="border-t border-white/[0.03] pt-4 mt-6 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-600 uppercase font-bold">Estágio Solucionado</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#69C9D0]/50" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
