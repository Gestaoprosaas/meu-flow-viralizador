import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onLogin: () => void;
}

const PHRASES = [
  { text: "Comece agora.", highlight: "agora" },
  { text: "Mude sua vida com IA.", highlight: "IA" }
];

export default function HeroSection({ onStart, onLogin }: HeroSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle phrases every 2.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PHRASES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const [activeLogo, setActiveLogo] = useState(0); // 0: TikTok, 1: FB Marketplace, 2: Shopee S-Shop

  // Auto-cycle logo every 6 seconds to match the full 3D rotation duration
  useEffect(() => {
    const logoTimer = setInterval(() => {
      setActiveLogo((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(logoTimer);
  }, []);

  // Format the phrase with highlight style
  const renderFormattedPhrase = (phraseObj: typeof PHRASES[0]) => {
    const parts = phraseObj.text.split(phraseObj.highlight);
    return (
      <span className="text-white">
        {parts[0]}
        <span className="text-[#FE2C55] drop-shadow-[0_0_20px_rgba(254,44,85,0.4)] font-black">
          {phraseObj.highlight}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <section className="relative h-screen w-full bg-transparent overflow-hidden flex flex-col justify-between font-sans">
      
      {/* 4-Corner Viewport Borders (Style Frame from landonorris.com) */}
      <div className="absolute inset-4 border border-white/[0.04] rounded-2xl pointer-events-none z-40 hidden md:block" />

      {/* Futuristic Glowing Particles backdrop (CSS powered) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-[25%] left-[20%] w-96 h-96 bg-[#FE2C55]/8 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[25%] right-[20%] w-96 h-96 bg-[#69C9D0]/8 rounded-full blur-[110px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Top Navbar Header */}
      <header className="relative w-full px-6 md:px-12 py-6 flex items-center justify-between z-30">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0] flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(254,44,85,0.3)]">
            V
          </div>
          <span className="font-extrabold text-white text-sm sm:text-base tracking-wider uppercase">
            Viral<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#69C9D0] to-cyan-300">Seller</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition border border-white/10 hover:border-white/25 rounded-full cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={onStart}
            className="px-5 py-2.5 bg-[#FE2C55] hover:bg-[#E01E45] text-white text-xs font-extrabold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(254,44,85,0.35)] cursor-pointer"
          >
            Conheça nossos planos
          </button>
        </div>
      </header>

      {/* Center Absolute Interactive Core */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 z-10 max-w-lg mx-auto w-full">
        
        {/* Alternating Phrases Stack (Urgency, IA transformation, price accessibility) */}
        <div className="h-16 flex items-center justify-center text-center select-none z-20 mb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="font-black text-center text-glow px-4"
              style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", lineHeight: 1.2 }}
            >
              {renderFormattedPhrase(PHRASES[currentIdx])}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Double-Animation: Slow floating wrapper + Continuous infinite rotating core */}
        <motion.div
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
              scale: [0.98, 1.02, 0.98]
            }}
            transition={{
              rotateY: {
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="relative cursor-pointer select-none flex items-center justify-center p-6 group z-10"
            onClick={onStart}
          >
            {/* Pulsing ambient glow back layer */}
            {activeLogo === 0 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0] filter blur-[50px] opacity-20 group-hover:opacity-45 transition-opacity duration-500 scale-90 animate-pulse" />
            )}
            {activeLogo === 1 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1877F2] to-[#00C6FF] filter blur-[50px] opacity-20 group-hover:opacity-45 transition-opacity duration-500 scale-90 animate-pulse" />
            )}
            {activeLogo === 2 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#ec4899] filter blur-[50px] opacity-20 group-hover:opacity-45 transition-opacity duration-500 scale-90 animate-pulse" />
            )}

            {/* Alternating SVG Symbols with high visual contrast */}
            {activeLogo === 0 && (
              /* Símbolo do TikTok: Elegant high-contrast music note custom path */
              <svg
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 transition duration-500 text-white drop-shadow-[0_0_35px_rgba(254,44,85,0.22)]"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="tiktok-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FE2C55" />
                    <stop offset="50%" stopColor="#813EF6" />
                    <stop offset="100%" stopColor="#69C9D0" />
                  </linearGradient>
                </defs>

                {/* Cyan Offset Path */}
                <path
                  d="M52 14c-1 0-2 0.5-2 1.5v48c0 7.7-6.3 14-14 14s-14-6.3-14-14s6.3-14 14-14c1.2 0 2.4 0.2 3.5 0.5V36.2C38 36.1 36.5 36 35 36 21.7 36 11 46.7 11 60s10.7 24 24 24s24-10.7 24-24V32c5.5 4 12.3 6.3 19.6 6.5v-11C72 27 62.5 19.5 52 14z"
                  fill="#69C9D0"
                  opacity="0.8"
                  transform="translate(-1.5, 1.5)"
                />

                {/* Red Offset Path */}
                <path
                  d="M52 14c-1 0-2 0.5-2 1.5v48c0 7.7-6.3 14-14 14s-14-6.3-14-14s6.3-14 14-14c1.2 0 2.4 0.2 3.5 0.5V36.2C38 36.1 36.5 36 35 36 21.7 36 11 46.7 11 60s10.7 24 24 24s24-10.7 24-24V32c5.5 4 12.3 6.3 19.6 6.5v-11C72 27 62.5 19.5 52 14z"
                  fill="#FE2C55"
                  opacity="0.8"
                  transform="translate(1.5, -1.5)"
                />

                {/* Pure Solid Premium Top Path */}
                <path
                  d="M52 14c-1 0-2 0.5-2 1.5v48c0 7.7-6.3 14-14 14s-14-6.3-14-14s6.3-14 14-14c1.2 0 2.4 0.2 3.5 0.5V36.2C38 36.1 36.5 36 35 36 21.7 36 11 46.7 11 60s10.7 24 24 24s24-10.7 24-24V32c5.5 4 12.3 6.3 19.6 6.5v-11C72 27 62.5 19.5 52 14z"
                  fill="url(#tiktok-grad)"
                  className="group-hover:brightness-110 transition-all duration-300"
                />
              </svg>
            )}

            {activeLogo === 1 && (
              /* Símbolo do Facebook Marketplace: Modern interactive store canopy layout */
              <svg
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 transition duration-500 text-white drop-shadow-[0_0_35px_rgba(24,119,242,0.32)]"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="fb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1877F2" />
                    <stop offset="100%" stopColor="#00C6FF" />
                  </linearGradient>
                </defs>

                {/* Back offset glow / shadow */}
                <path
                  d="M20 44l6-18h48l6 16H20z"
                  fill="#1877F2"
                  opacity="0.5"
                  transform="translate(-1.5, 1.5)"
                />

                {/* Canopy body */}
                <path
                  d="M20 44l6-18h48l6 16H20z"
                  fill="url(#fb-grad)"
                />

                {/* Canopy vertical outline stripes */}
                <path d="M33 44V26M45 44V26M57 44V26M69 44V26" stroke="#111118" strokeWidth="4.5" opacity="0.8" />

                {/* Bottom storefront wall */}
                <rect x="25" y="44" width="50" height="32" rx="4" fill="none" stroke="url(#fb-grad)" strokeWidth="5.5" />

                {/* Inside archway */}
                <path
                  d="M38 76V60c0-2 2-4 4-4h16c2 0 4 2 4 4v16"
                  stroke="url(#fb-grad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}

            {activeLogo === 2 && (
              /* Símbolo do Shopee / S-Shop: Beautiful vector bag with white 'S' inside */
              <svg
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 transition duration-500 text-white drop-shadow-[0_0_35px_rgba(139,92,246,0.32)]"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="shopee-bag-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                  <linearGradient id="shopee-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C6FF" />
                    <stop offset="100%" stopColor="#FE2C55" />
                  </linearGradient>
                </defs>

                {/* Shadow/glow behind */}
                <path
                  d="M32 26C32 12 68 12 68 26 M20 26h60a4 4 0 0 1 4 4v52a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V30a4 4 0 0 1 4-4z"
                  stroke="#8B5CF6"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.25"
                  transform="translate(-1, 1.5)"
                />

                {/* Handle (Alça) */}
                <path
                  d="M34 27C34 11 66 11 66 27"
                  stroke="url(#shopee-border-grad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Bag Body */}
                <path
                  d="M20 27h60a4 4 0 0 1 4 4v51a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V31a4 4 0 0 1 4-4z"
                  fill="url(#shopee-bag-grad)"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Glowing Outer Gradient outline of bag body */}
                <path
                  d="M20 27h60a4 4 0 0 1 4 4v51a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V31a4 4 0 0 1 4-4z"
                  stroke="url(#shopee-border-grad)"
                  strokeWidth="4"
                  fill="none"
                />

                {/* Bold white letter'S' inside */}
                <text
                  x="50"
                  y="71"
                  fill="white"
                  fontSize="40"
                  fontWeight="950"
                  textAnchor="middle"
                  fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
                  style={{ userSelect: "none" }}
                >
                  S
                </text>
              </svg>
            )}

          </motion.div>
        </motion.div>

        {/* Indução de Cliques: Fixed stable CTA button directly below the rotating symbol */}
        <div className="mt-8 flex flex-col items-center gap-2.5 text-center z-20 w-full px-4">
          <button
            onClick={onStart}
            className="group w-full max-w-sm py-4 bg-gradient-to-r from-[#FE2C55] via-[#813EF6] to-[#69C9D0] text-white text-sm sm:text-base font-extrabold uppercase tracking-widest rounded-2xl hover:scale-[1.02] duration-200 transition-all shadow-[0_0_25px_rgba(254,44,85,0.35)] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Conheça nossos planos</span>
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 text-white stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* Bottom Footer Information HUD */}
      <footer className="relative w-full px-8 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-30">
        
        {/* Left Side Info */}
        <div className="text-gray-500 text-[10px] tracking-wider uppercase font-semibold text-center sm:text-left transition-all duration-300">
          Plataforma de IA para {activeLogo === 0 ? "TikTok" : activeLogo === 1 ? "Facebook Marketplace" : "Shopee & Social Commerce"} · 2026
        </div>

        {/* Center Hover Prompt trigger buttons on small layouts */}
        <div className="sm:hidden">
          <button 
            onClick={onStart}
            className="text-xs text-white bg-[#0A0A0F] border border-white/10 px-4 py-2 rounded-full font-bold flex items-center gap-1 hover:border-[#FE2C55]/50 transition"
          >
            Ver Plataforma <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Side Indicator (Scroll down pointer) */}
        <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold tracking-wider animate-bounce uppercase">
          <span>Role para descobrir</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

      </footer>

    </section>
  );
}
