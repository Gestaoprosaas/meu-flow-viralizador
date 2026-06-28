"use client";

import React from 'react';
import { X, Sparkles, Check, Flame, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export default function UpgradeModal({ isOpen, onClose, currentPlan = 'free' }: UpgradeModalProps) {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Starter',
      price: 'R$ 49/mês',
      badge: 'Básico',
      accent: 'border-[#1E1E2E] hover:border-[#7C3AED]/30',
      credits: { text: 50, image: 25, video: 5 },
      features: [
        '50 Roteiros IA validando ganchos',
        '25 Imagens Comerciais Ultra Realistas',
        '5 Vídeos Virais Inteligentes/mês',
        'Acesso ao Editor de Vídeos Completo',
        'Suporte por email padrão'
      ]
    },
    {
      name: 'Pro',
      price: 'R$ 97/mês',
      popular: true,
      badge: 'O Mais Vendido 🚀',
      accent: 'border-[#7C3AED] shadow-lg shadow-[#7C3AED]/20 bg-[#16132D]/40',
      credits: { text: 250, image: 100, video: 20 },
      features: [
        '250 Roteiros IA ganchos ilimitados',
        '100 Imagens Comerciais Ultra Realistas',
        '20 Vídeos Virais Inteligentes/mês',
        'Acesso prioritário a novos modelos',
        'Suporte prioritário via WhatsApp'
      ]
    },
    {
      name: 'Agency',
      price: 'R$ 297/mês',
      badge: 'Escala Máxima',
      accent: 'border-[#1E1E2E] hover:border-[#06B6D4]/30',
      credits: { text: 1000, image: 500, video: 100 },
      features: [
        '1000 Roteiros IA com ganchos virais',
        '500 Imagens Comerciais Ultra Realistas',
        '100 Vídeos Virais Inteligentes/mês',
        'Selo de agência de conteúdo',
        'Gerente de conta individual'
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000000]/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-[#0A0A0F] border border-[#1E1E2E] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] md:max-h-none overflow-y-auto"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1E1E2E]/60 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-white transition duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Hero header */}
          <div className="p-6 md:p-8 text-center space-y-2 border-b border-[#1E1E2E]/60 bg-gradient-to-b from-[#181530] to-[#0A0A0F]">
            <span className="flex items-center gap-1.5 text-xs text-yellow-400 font-extrabold uppercase bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 w-fit mx-auto animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Upgrade de Limites e Créditos
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
              Faça o Upgrade e continue multiplicando suas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">Vendas Virais</span>
            </h2>
            <p className="text-xs md:text-sm text-[#8888AA] max-w-sm sm:max-w-xl mx-auto">
              Ganhe acesso instantâneo ao nosso motor completo de inteligência artificial de alta retenção.
            </p>
          </div>

          {/* Pricing Planes lists */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((planItem) => {
              const isActivePlan = currentPlan.toLowerCase() === planItem.name.toLowerCase();

              return (
                <div
                  key={planItem.name}
                  className={`border rounded-2xl p-5 flex flex-col justify-between relative transition duration-300 ${planItem.accent}`}
                >
                  {planItem.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-[9px] font-extrabold uppercase text-white shadow-md whitespace-nowrap">
                      {planItem.badge}
                    </div>
                  )}

                  {!planItem.popular && planItem.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#1E1E2E] border border-[#1E1E2E] text-[9px] font-bold uppercase text-[#8888AA] whitespace-nowrap">
                      {planItem.badge}
                    </div>
                  )}

                  {/* Header info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Plano {planItem.name}</h4>
                      <div className="mt-1 text-xl md:text-2xl font-black text-white font-sans">{planItem.price}</div>
                    </div>

                    {/* Quick Quotas info cards */}
                    <div className="grid grid-cols-3 gap-1 bg-[#111118]/80 border border-[#1E1E2E]/60 rounded-xl p-2 text-center text-[10px]">
                      <div>
                        <div className="font-bold text-white">{planItem.credits.text}</div>
                        <div className="text-[8px] text-[#8888AA]">Roteiros</div>
                      </div>
                      <div className="border-x border-[#1E1E2E]/60">
                        <div className="font-bold text-white">{planItem.credits.image}</div>
                        <div className="text-[8px] text-[#8888AA]">Imagens</div>
                      </div>
                      <div>
                        <div className="font-bold text-white">{planItem.credits.video}</div>
                        <div className="text-[8px] text-[#8888AA]">Vídeos</div>
                      </div>
                    </div>

                    {/* Features checklist */}
                    <ul className="space-y-1.5 pt-1">
                      {planItem.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-[10px] sm:text-xs text-[#8888AA] leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA billing subscription button mock trigger */}
                  <div className="mt-6">
                    <button
                      disabled={isActivePlan}
                      onClick={() => {
                        alert(`Instanciando checkout seguro para contratação do plano ${planItem.name}...`);
                        onClose();
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-black transition ${
                        isActivePlan
                          ? 'bg-[#1E1E2E] text-[#8888AA]/60 border border-transparent cursor-not-allowed'
                          : planItem.popular
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 text-white shadow-md shadow-[#7C3AED]/15'
                          : 'bg-[#1E1E2E] hover:bg-[#2A2A3E]/80 text-white border border-[#1E1E2E]'
                      }`}
                    >
                      {isActivePlan ? 'Plano Ativo' : 'Adquirir Plano'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-6 md:px-8 py-4 bg-[#111118]/60 border-t border-[#1E1E2E]/50 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#8888AA]">
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Garantia de 7 dias protegida. Desbloqueio imediato na sua conta.</span>
            </div>
            <button onClick={onClose} className="hover:underline font-bold text-white">Prefiro continuar grátis</button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
