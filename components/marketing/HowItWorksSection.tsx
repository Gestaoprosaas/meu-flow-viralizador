import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Sparkles, ArrowRight, Play, MessageSquare, Volume2, Video, CheckCircle2 } from 'lucide-react';

export default function HowItWorksSection() {
  const stepRef1 = useRef<HTMLDivElement>(null);
  const stepRef2 = useRef<HTMLDivElement>(null);
  const stepRef3 = useRef<HTMLDivElement>(null);

  const view1 = useInView(stepRef1, { once: true, amount: 0.2 });
  const view2 = useInView(stepRef2, { once: true, amount: 0.2 });
  const view3 = useInView(stepRef3, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works-section" className="relative w-full bg-[#0A0A0F] py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E] overflow-hidden">
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#69C9D0]/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#FE2C55]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-32 relative z-10 font-sans">
        <div className="text-center max-w-2xl mx-auto space-y-4 pb-12">
          <span className="text-xs text-[#69C9D0] font-black uppercase tracking-widest bg-[#69C9D0]/10 px-3.5 py-1.5 rounded-full border border-[#69C9D0]/20 inline-block">
            ETAPA POR ETAPA
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Como funciona a ViralForge AI?
          </h2>
          <p className="text-[#8888AA] text-xs sm:text-sm leading-relaxed">
            Nossa esteira foi engenheirada para converter qualquer produto físico em vídeos prontos para rodar no orgânico ou pago, eliminando todas as complexidades clássicas.
          </p>
        </div>

        {/* Step 1 */}
        <div ref={stepRef1} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={view1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <div className="text-8xl font-black text-white/5 font-mono select-none leading-none">01</div>
            <div>
              <span className="text-xs text-[#69C9D0] font-black uppercase tracking-widest block mb-2">Primeiro Passo</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Descreva seu produto ou cole o link</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Escreva detalhes rápidos do produto, cole o link comercial da Shopee ou do seu funil e selecione as características de audiência mais apropriadas. Nossa IA colhe as fotos e analisa o público imediatamente.
            </p>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#69C9D0]" /> Reconhecimento automático de links</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#69C9D0]" /> Mapeamento de dores principais da persona</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={view1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="bg-[#111118]/80 border border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#69C9D0]/45 to-transparent" />
              
              <div className="flex items-center justify-between mb-6 border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[10px] text-gray-500 font-mono ml-2">ESTEIRA_DE_ENTRADA_IA</span>
                </div>
                <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Aguardando Link</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold text-gray-400 block">Link Oficial ou Nome do Produto</label>
                  <div className="bg-[#0A0A0F] border border-white/[0.06] rounded-xl p-3 text-xs text-gray-300 flex items-center justify-between">
                    <span className="font-mono text-[#69C9D0]">shopee.com.br/produto-suplemento-termogenico...</span>
                    <Sparkles className="w-4 h-4 text-[#69C9D0]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-gray-400 block">Público-Alvo</label>
                    <div className="bg-[#0A0A0F] border border-white/[0.06] rounded-xl p-3 text-xs text-gray-400">Mulheres 25-40 Fitness</div>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-gray-400 block">Nível de Persuasão</label>
                    <div className="bg-[#0A0A0F] border border-[#69C9D0]/40 rounded-xl p-3 text-xs text-white font-bold">Ultra-Agressivo (TikTok)</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.04]">
                  <button type="button" className="w-full py-3 bg-[#69C9D0] text-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#69C9D0]/10 flex items-center justify-center gap-2">
                    Analisar Do produto à Venda <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Step 2 */}
        <div ref={stepRef2} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={view2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7 order-2 lg:order-1"
          >
            <div className="bg-[#111118]/80 border border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group text-left">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FE2C55]/45 to-transparent" />
              
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MessageSquare className="w-4 h-4 text-[#FE2C55]" /> Roteiro Psicologico Gerado
                </div>
                <span className="text-[10px] text-[#FE2C55] bg-[#FE2C55]/10 px-2.5 py-0.5 rounded font-black tracking-wider uppercase">Modelo AIDA</span>
              </div>

              <div className="space-y-3.5 max-h-[240px] overflow-y-auto">
                <div className="p-3.5 bg-[#0A0A0F] border-l-2 border-[#FE2C55] rounded-r-xl space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Ganchos de Reter (Início)</span>
                    <span className="text-[#FE2C55]">0.0s - 3.0s</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    "Você continua comprando termogênico importado caro achando que é o único jeito? Presta atenção nisso aqui..."
                  </p>
                </div>

                <div className="p-3.5 bg-[#0A0A0F] border-l-2 border-slate-500 rounded-r-xl space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Apresentação & Dores</span>
                    <span className="text-slate-400">3.0s - 15.0s</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    "Esse triturador térmico acelerador de queima nacional faz exatamente o dobro de efeito purificador, acelerando sua taxa metabólica de forma segura, natural e rápida..."
                  </p>
                </div>

                <div className="p-3.5 bg-[#0A0A0F] border-l-2 border-[#69C9D0] rounded-r-xl space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Chamada para Ação (CTA)</span>
                    <span className="text-[#69C9D0]">15.0s - 30.0s</span>
                  </div>
                  <p className="text-xs text-white font-black">
                    "Eu consegui um link com 45% de desconto de distribuidora e frete de graça apenas esta semana. Clica no link e aproveita antes que zere!"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={view2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-5 space-y-6 order-1 lg:order-2 text-left"
          >
            <div className="text-8xl font-black text-white/5 font-mono select-none leading-none">02</div>
            <div>
              <span className="text-xs text-[#FE2C55] font-black uppercase tracking-widest block mb-2">Segundo Passo</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Nossa IA cria o Roteiro e Dublagem</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              A ViralForge IA processa o seu prompt através do modelo de linguagem de ponta e gera ganchos persuasivos com tempos exatos. Na sequência, ela programa o roteiro com nossa esteira de dubladores nativos de alta fidelidade e ritmo persuasivo.
            </p>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> Roteiros estruturados no modelo psicológico de vendas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FE2C55]" /> Ganchos virais mutáveis em 1 clique</li>
            </ul>
          </motion.div>
        </div>

        {/* Step 3 */}
        <div ref={stepRef3} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={view3 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <div className="text-8xl font-black text-white/5 font-mono select-none leading-none">03</div>
            <div>
              <span className="text-xs text-purple-400 font-black uppercase tracking-widest block mb-2">Terceiro Passo</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">Gere e publique o vídeo viral pronto</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal font-sans">
              Clique para renderizar seu vídeo com fotos ambientadas inteligentes ou obtenha o prompt de imagem mais refinado do mercado. Copie o prompt 100% calibrado para feeds de redes de renderização de alto desempenho e ganhe comissão imediata no TikTok Shop!
            </p>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Prompts de imagens e b-rolls 100% automatizados</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Locuções perfeitas prontas para sobrepor ao editor</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={view3 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="bg-[#111118]/80 border border-white/[0.04] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/45 to-transparent" />
              
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Video className="w-4 h-4 text-purple-400" /> Renderizador de Video Comercial
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="relative aspect-video rounded-xl bg-slate-950 border border-white/[0.04] overflow-hidden flex flex-col justify-between p-4 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:scale-105 transition-all duration-700">
                  <div className="w-20 h-20 rounded-full border border-purple-500/30 flex items-center justify-center bg-purple-500/10">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>

                <span className="self-start text-[9px] bg-[#FE2C55] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest relative z-20">Preview HD</span>

                <div className="w-full space-y-2 pointer-events-none z-20">
                  <div className="flex justify-between items-center text-[10px] text-gray-300 font-mono">
                    <span className="font-bold">Locutor_AI_Vendas_BR.mp3</span>
                    <span>0:14 / 0:30 (Voz Ativa)</span>
                  </div>
                  <div className="flex items-center gap-1 h-6">
                    {[3, 7, 5, 8, 4, 3, 6, 8, 3, 5, 7, 2, 6, 4, 8, 3, 6, 5, 8, 2, 4, 6].map((h, i) => (
                      <span 
                        key={i} 
                        className="bg-[#69C9D0] flex-1 rounded-full" 
                        style={{ height: `${h * 11}%`, opacity: i % 3 === 0 ? 0.6 : 0.9 }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
