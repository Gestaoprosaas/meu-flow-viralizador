import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onLogin: () => void;
}

const PHRASES = [
  { text: "Use IA. Crie vídeos virais.", highlight: "IA" },
  { text: "Ganhe dinheiro no TikTok Shop.", highlight: "TikTok Shop" },
  { text: "Do produto à venda em minutos.", highlight: "venda" },
  { text: "Sem gravar. Sem editar. Sem complicação.", highlight: "Sem complicação" }
];

export default function HeroSection({ onStart, onLogin }: HeroSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle phrases
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PHRASES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const renderFormattedPhrase = (phraseObj: typeof PHRASES[0]) => {
    const parts = phraseObj.text.split(phraseObj.highlight);
    return (
      <span className="text-white">
        {parts[0]}
        <span className="text-[#FE2C55] drop-shadow-[0_0_20px_rgba(254,44,85,0.4)] font-black animate-pulse">
          {phraseObj.highlight}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <section className="relative h-screen w-full bg-[#0A0A0F] overflow-hidden flex flex-col justify-between font-sans">
      <div className="absolute inset-4 border border-white/[0.04] rounded-2xl pointer-events-none z-40 hidden md:block" />

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[25%] left-[20%] w-96 h-96 bg-[#FE2C55]/8 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[25%] right-[20%] w-96 h-96 bg-[#69C9D0]/8 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <header className="relative w-full px-6 md:px-12 py-6 flex items-center justify-between z-30 font-bold">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0] flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(254,44,85,0.3)]">
            V
          </div>
          <span className="font-extrabold text-white text-sm sm:text-base tracking-wider uppercase">
            ViralForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69C9D0] to-cyan-300">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-xs text-gray-300 hover:text-white transition border border-white/10 hover:border-white/25 rounded-full cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={onStart}
            className="px-5 py-2.5 bg-[#FE2C55] hover:bg-[#E01E45] text-white text-xs font-extrabold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(254,44,85,0.35)] cursor-pointer"
          >
            Começar Grátis
          </button>
        </div>
      </header>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 z-10">
        <div className="absolute pointer-events-none text-center select-none z-20 w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-center text-glow"
                style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)", lineHeight: 1.1 }}
              >
                {renderFormattedPhrase(PHRASES[currentIdx])}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            y: [0, -18, 0],
            scale: isHovered ? 1.08 : 1,
            rotate: isHovered ? 1 : 0
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            scale: { duration: 0.35 },
            rotate: { duration: 0.3 }
          }}
          className="relative cursor-pointer transition-all duration-300 select-none flex items-center justify-center p-8 group z-10"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0] filter blur-[60px] opacity-15 group-hover:opacity-40 transition-opacity duration-500 scale-90" />

          <svg
            className="w-48 h-48 sm:w-64 sm:h-64 md:w-[320px] md:h-[320px] transition duration-500 text-white drop-shadow-[0_0_35px_rgba(254,44,85,0.2)]"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="tiktok-grad-alt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FE2C55" />
                <stop offset="50%" stopColor="#813EF6" />
                <stop offset="100%" stopColor="#69C9D0" />
              </linearGradient>
            </defs>

            <path
              d="M52 14c-1 0-2 0.5-2 1.5v48c0 7.7-6.3 14-14 14s-14-6.3-14-14s6.3-14 14-14c1.2 0 2.4 0.2 3.5 0.5V36.2C38 36.1 36.5 36 35 36 21.7 36 11 46.7 11 60s10.7 24 24 24s24-10.7 24-24V32c5.5 4 12.3 6.3 19.6 6.5v-11C72 27 62.5 19.5 52 14z"
              fill="#69C9D0"
              opacity="0.8"
              transform="translate(-1.5, 1.5)"
            />

            <path
              d="M52 14c-1 0-2 0.5-2 1.5v48c0 7.7-6.3 14-14 14s-14-6.3-14-14s6.3-14 14-14c1.2 0 2.4 0.2 3.5 0.5V36.2C38 36.1 36.5 36 35 36 21.7 36 11 46.7 11 60s10.7 24 24 24s24-10.7 24-24V32c5.5 4 12.3 6.3 19.6 6.5v-11C72 27 62.5 19.5 52 14z"
              fill="#FE2C55"
              opacity="0.8"
              transform="translate(1.5, -1.5)"
            />

            <path
              d="M52 14c-1 0-2 0.5-2 1.5v48c0 7.7-6.3 14-14 14s-14-6.3-14-14s6.3-14 14-14c1.2 0 2.4 0.2 3.5 0.5V36.2C38 36.1 36.5 36 35 36 21.7 36 11 46.7 11 60s10.7 24 24 24s24-10.7 24-24V32c5.5 4 12.3 6.3 19.6 6.5v-11C72 27 62.5 19.5 52 14z"
              fill="url(#tiktok-grad-alt)"
              className="group-hover:brightness-110 transition-all duration-300"
            />
          </svg>
        </motion.div>

        <p className={`text-xs text-slate-500 font-mono tracking-widest transition-opacity duration-300 uppercase ${isHovered ? 'opacity-0' : 'opacity-70 animate-pulse'}`}>
          Passe o mouse no símbolo para ativar
        </p>
      </div>

      <footer className="relative w-full px-8 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-30">
        <div className="text-gray-500 text-[10px] tracking-wider uppercase font-semibold text-center sm:text-left">
          Plataforma de IA para TikTok Shop · 2026
        </div>

        <div className="sm:hidden">
          <button 
            onClick={onStart}
            className="text-xs text-white bg-[#0A0A0F] border border-white/10 px-4 py-2 rounded-full font-bold flex items-center gap-1 hover:border-[#FE2C55]/50 transition"
          >
            Ver Plataforma <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold tracking-wider animate-bounce uppercase">
          <span>Role para descobrir</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </footer>
    </section>
  );
}
