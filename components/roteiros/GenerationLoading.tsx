"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  duration: number; // Ms for mock duration simulation transitions
}

export default function GenerationLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    { id: 0, label: 'Minerando ganchos de alta conversão para o nicho...', duration: 2500 },
    { id: 1, label: 'Estruturando roteiro AIDA (Atenção, Interesse, Desejo, Ação)...', duration: 3000 },
    { id: 2, label: 'Aplicando tom de comunicação desejado e gatilhos mentais...', duration: 2500 },
    { id: 3, label: 'Gerando variações de ganchos e CTAs focados no TikTok Shop...', duration: 2000 },
    { id: 4, label: 'Finalizando formatação criativa...', duration: 1000 },
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < steps.length - 1) {
        index++;
        setCurrentStep(index);
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center space-y-6 animate-pulse max-w-xl mx-auto">
      
      {/* Huge central loading engine icon */}
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 animate-ping absolute" />
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white shadow-xl shadow-[#7C3AED]/25">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-bold text-white text-base">Moldando Roteiro de Alta Conversão</h3>
        <p className="text-xs text-[#8888AA]">Nossa inteligência está refinando a sua oferta para performar nos feeds orgânicos do TikTok.</p>
      </div>

      {/* Generation checklist timeline */}
      <div className="w-full space-y-3 pt-4 border-t border-[#1E1E2E]/60">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 text-xs transition duration-300 ${
                isDone ? 'text-[#10B981]' : isActive ? 'text-white font-bold' : 'text-[#8888AA]/40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-[#10B981] fill-[#10B981]/10" />
              ) : isActive ? (
                <Loader2 className="w-4.5 h-4.5 shrink-0 animate-spin text-[#06B6D4]" />
              ) : (
                <Circle className="w-4.5 h-4.5 shrink-0 text-[#1E1E2E]" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
