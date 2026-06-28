import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageSquare } from 'lucide-react';

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'O que faz a plataforma de IA do Projeto Vitão?',
      a: 'Nossa inteligência artificial mapeia as mecânicas de retenção mais bem-sucedidas no feed brasileiro e instantaneamente gera um funil completo de vendas: roteiros psicológicos de alta persuasão, fotos ambientadas em HD com estúdios virtuais de luxo, e locuções rítmicas super realistas em português para seus b-rolls.'
    },
    {
      q: 'Como funciona o limite de créditos mensais?',
      a: 'Sua cota se renova mensalmente no dia de sua assinatura. Cada geração de roteiro ou gancho persuasivo consome 1 crédito de texto, cada imagem ambientada gerada consome 1 crédito de imagem e cada renderização de locução comercial com voz de alta humanização consome 1 crédito de vídeo.'
    },
    {
      q: 'Não sei nada sobre edição. Consigo criar anúncios virais?',
      a: 'Absolutamente! Desenhamos uma plataforma intuitiva para qualquer afiliado ou seller de TikTok Shop. Nós entregamos a psicologia de gravação e os designs estéticos prontos, eliminando qualquer mistério sobre a montagem técnica de criativos.'
    },
    {
      q: 'Os vídeos gerados são qualificados no TikTok Shop brasileiro?',
      a: 'Sim! Nossos roteiros e locuções contêm as marcações de ritmo, as chamadas para ação (CTA) e as modulações que evitam shadowbans, garantindo a qualificação necessária de conteúdo original.'
    },
    {
      q: 'Preciso pagar licenças adicionais para as vozes reais de IA?',
      a: 'Não. Todas as vozes e dubladores realistas de IA disponíveis no painel de controle são licenciados comercialmente para que você publique em quantas lojas e perfis desejar, sem custos extras de royalties.'
    },
    {
      q: 'Como funciona o integrador de fotos de produtos?',
      a: 'Basta carregar uma foto simples do produto sobre uma mesa ou fundo liso. Nossa IA remove o fundo e o reposiciona de forma coerente em cenários comerciais requintados, aplicando profundidade de campo e iluminação profissional.'
    },
    {
      q: 'E se eu precisar de suporte ou tiver dúvidas de tráfego pago?',
      a: 'De acordo com o plano contratado (Pro e superiores), você terá acesso direto ao nosso canal VIP de mentores via WhatsApp, além dos nossos treinamentos em vídeo que explicam como minerar produtos e anunciar no TikTok Shop.'
    },
    {
      q: 'É seguro assinar? Tenho garantia se não me adaptar?',
      a: 'Sim, o processamento de pagamentos é totalmente criptografado. Oferecemos garantia incondicional de 7 dias úteis. Caso sinta que a plataforma não é para você, basta solicitar o reembolso na central de configurações de forma transparente.'
    }
  ];

  const handleToggle = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section id="faq-section" className="relative w-full bg-[#0A0A0F]/45 backdrop-blur-md py-24 sm:py-32 px-6 md:px-12 border-b border-[#1E1E2E]">
      
      {/* Visual top grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(105,201,208,0.01)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10 font-sans">
        
        {/* Title */}
        <div className="text-center space-y-4">
          <span className="text-xs text-[#69C9D0] font-black uppercase tracking-widest bg-[#69C9D0]/10 px-3.5 py-1.5 rounded-full border border-[#69C9D0]/20 inline-block">
            SUPORTE E PERGUNTAS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Tire suas dúvidas rápidas sobre crédito, originalidade e como bombar suas comissões de afiliado.
          </p>
        </div>

        {/* Accordions list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                id={`faq-item-${idx}`}
                className="bg-[#111118]/80 border border-white/[0.04] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.08]"
              >
                
                {/* Trigger Row */}
                <button
                  type="button"
                  onClick={() => handleToggle(idx)}
                  className="w-full px-6 py-5 sm:py-6 flex items-center justify-between gap-4 text-left transition duration-300 relative group cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white group-hover:text-[#69C9D0] transition duration-300 flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#FE2C55] shrink-0" />
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white/[0.06]' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </button>

                {/* Animated Inner Drawer with Framer Motion height transition */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 sm:pb-7 text-xs sm:text-sm text-gray-400 leading-relaxed font-normal border-t border-white/[0.02]/30 pt-2 border-dashed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
