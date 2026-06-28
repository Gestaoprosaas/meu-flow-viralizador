import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { FileText, ImageIcon, Video, BookOpen, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

export default function FeaturesGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const features = [
    {
      title: "Roteiros Virais",
      desc: "Nossa IA estrutura roteiros utilizando ganchos de alta retenção calibrados especificamente para a mente do consumidor digital brasileiro.",
      icon: FileText,
      color: "#FE2C55", // Red
      glowClass: "group-hover:shadow-[0_0_25px_rgba(254,44,85,0.15)] group-hover:border-[#FE2C55]/40"
    },
    {
      title: "Imagens IA",
      desc: "Transforme fotos amadoras em imagens com cenários comerciais dignos de estúdios luxuosos em segundos.",
      icon: ImageIcon,
      color: "#69C9D0", // Cyan
      glowClass: "group-hover:shadow-[0_0_25px_rgba(105,201,208,0.15)] group-hover:border-[#69C9D0]/40"
    },
    {
      title: "Vídeos IA",
      desc: "Gere locuções profissionais com dublagem humanizada e receba prompts de vídeo 100% calibrados para geradores de alto desempenho de b-rolls.",
      icon: Video,
      color: "#FE2C55", // Red
      glowClass: "group-hover:shadow-[0_0_25px_rgba(254,44,85,0.15)] group-hover:border-[#FE2C55]/40"
    },
    {
      title: "Biblioteca de Copias",
      desc: "Acesso total à nossa central de ganchos virais estruturados, gesticulações de vídeo sugeridas e headlines matadoras prontas para usar.",
      icon: BookOpen,
      color: "#69C9D0", // Cyan
      glowClass: "group-hover:shadow-[0_0_25px_rgba(105,201,208,0.15)] group-hover:border-[#69C9D0]/40"
    },
    {
      title: "Produtos em Alta",
      desc: "Minerador integrado que analisa o volume de comissão, vendas e engajamento dos produtos mais promissores da Shopee e TikTok Shop BR.",
      icon: TrendingUp,
      color: "#FE2C55", // Red
      glowClass: "group-hover:shadow-[0_0_25px_rgba(254,44,85,0.15)] group-hover:border-[#FE2C55]/40"
    },
    {
      title: "Programa de Afiliados",
      desc: "Código de indicação individual, link rastreável de comissão e painel de cliques em tempo real para maximizar faturamento passivo.",
      icon: Users,
      color: "#69C9D0", // Cyan
      glowClass: "group-hover:shadow-[0_0_25px_rgba(105,201,208,0.15)] group-hover:border-[#69C9D0]/40"
    }
  ];

  return (
    <section ref={containerRef} id="features-section" className="relative w-full bg-[#0A0A0F]/45 backdrop-blur-md py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E]">
      
      {/* Visual background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(254,44,85,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.04]">
          <div className="space-y-4 max-w-2xl text-left">
            <span className="text-xs text-[#FE2C55] font-black uppercase tracking-widest bg-[#FE2C55]/10 px-3.5 py-1.5 rounded-full border border-[#FE2C55]/20 inline-block">
              RECURSOS DO HUB
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Uma Máquina Completa de Criativos
            </h2>
            <p className="text-[#8888AA] text-xs sm:text-sm font-medium">
              Elimine agências caras. Resolvemos todo o seu processo de mineração, redação persuasiva, estúdios ambientados e locução profissional em uma central integrada e escalável.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-xs text-gray-500 font-mono tracking-wider">
            <span>6 MÓDULOS DE ESCALA</span>
          </div>
        </div>

        {/* 3x2 Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className="group h-full"
              >
                <div className={`relative h-full bg-[#0A0A0F]/60 backdrop-blur-sm border border-white/[0.04] rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between ${feat.glowClass}`}>
                  
                  {/* Top content */}
                  <div>
                    {/* Circle Icon Container */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border transition-all duration-300 relative bg-white/[0.02]"
                      style={{ 
                        borderColor: `${feat.color}25`,
                        color: feat.color
                      }}
                    >
                      <Icon className="w-5.5 h-5.5" />
                      <div className="absolute inset-0 rounded-xl bg-current opacity-5 pointer-events-none" />
                    </div>

                    <h4 className="text-lg font-bold text-white group-hover:text-white flex items-center justify-between">
                      {feat.title}
                      <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300" />
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-400 mt-3 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  {/* Micro metric footer */}
                  <div className="border-t border-white/[0.03] pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-gray-600">
                    <span>Módulo Integrado</span>
                    <span className="font-bold uppercase" style={{ color: feat.color }}>V{idx + 1}.0</span>
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
