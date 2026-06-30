import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ArrowRight, Zap, ShieldCheck, Copy, Sparkles, LogIn, Mail, UserPlus, Info } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';

import HeroSection from './marketing/HeroSection';
import ProblemSection from './marketing/ProblemSection';
import HowItWorksSection from './marketing/HowItWorksSection';
import FeaturesGrid from './marketing/FeaturesGrid';
import SocialProofSection from './marketing/SocialProofSection';
import PricingSection from './marketing/PricingSection';
import FaqSection from './marketing/FaqSection';
import MarketingFooter from './marketing/MarketingFooter';
import GlassmorphicLens from './GlassmorphicLens';

// @ts-ignore
import landingBg from '../assets/images/landing_bg_night_1781408204004.jpg';

interface ScreenLandingProps {
  onEnter: (userData: {
    name: string;
    email: string;
    plan: 'free' | 'starter' | 'pro' | 'agency';
    role?: 'admin' | 'client';
    ativo?: boolean;
    creditos?: number;
    credits_text?: number;
    credits_image?: number;
    credits_video?: number;
    supabaseUrl: string;
    supabaseKey: string;
  }) => void;
}

export default function ScreenLanding({ onEnter }: ScreenLandingProps) {
  // Configured gateway urls from public-settings
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');
  const [appflyMonthly, setAppflyMonthly] = useState<string>(process.env.NEXT_PUBLIC_APPLYFY_URL_STARTER || 'https://applyfy.com.br/checkout/SEU_PRODUTO_STARTER');
  const [appflyLifetime, setAppflyLifetime] = useState<string>(process.env.NEXT_PUBLIC_APPLYFY_URL_PRO || 'https://applyfy.com.br/checkout/SEU_PRODUTO_PRO');

  // Modals state
  const [showLogin, setShowLogin] = useState<boolean>(false);

  // Form inputs
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Status and feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Check URL query parameters and load keys on launch
  useEffect(() => {
    // 2. Parse URL for checkout success landing
    const query = new URLSearchParams(window.location.search);
    const planParam = query.get('plan');
    if (planParam === 'starter' || planParam === 'pro' || planParam === 'agency') {
      setSignupPlan(planParam as any);
      setShowSignup(true);
      // Clean query parameters so the view is pristine
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Initialize client when we perform registration or login
  const getSupabaseClient = () => {
    return getSupabase();
  };

  // 1. Redirect to AppFly gateway URL
  const handleSelectPlan = (plan: 'starter' | 'pro' | 'agency') => {
    const checkoutUrl = plan === 'starter' ? appflyMonthly : appflyLifetime;
    setSuccessMsg(`Redirecionando de forma blindada para o gateway AppFly...`);
    
    setTimeout(() => {
      // Exit iframe to prevent frame restriction bypass
      if (window.top) {
        window.top.location.href = checkoutUrl;
      } else {
        window.location.href = checkoutUrl;
      }
    }, 700);
  };

  // 2. Realize Log In for existing accounts
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Por favor, informe seu e-mail e senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Cliente Supabase não inicializado. Verifique a conexão.");
      }

      // Log in in Supabase Auth
      const { data, error } = await client.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Falha de conexão com o Supabase. Verifique se a URL e Anon Key estão corretas nas Configurações.');
        } else {
          throw new Error(`Erro de autenticação: ${error.message}`);
        }
      }

      const userObj = data.user;
      if (!userObj) {
        throw new Error("Credencial inválida.");
      }

      let profileRow: any = null;
      try {
        const { data: profData, error: profErr } = await client
          .from('profiles')
          .select('*')
          .eq('id', userObj.id)
          .maybeSingle();
        if (profData) {
          profileRow = profData;
          console.log("[Client Supabase] Perfil recuperado com sucesso:", profileRow);
        } else {
          console.log("[Client Supabase] Perfil não encontrado, usando padrões...");
        }
      } catch (err) {
        console.warn("[Client Supabase] Erro ao carregar tabela profiles:", err);
      }

      const verifiedPlan = profileRow?.plano || profileRow?.plan || 'free';
      const verifiedRole = profileRow?.role || (loginEmail === "gestaoprosaas@gmail.com" ? "admin" : "client");
      const verifiedName = profileRow?.name || loginEmail.split('@')[0];
      const verifiedAtivo = profileRow?.ativo !== undefined ? profileRow.ativo : true;
      const verifiedCreditos = typeof profileRow?.creditos === 'number' ? profileRow.creditos : undefined;

      const creditsText = typeof profileRow?.credits_text === 'number' 
        ? profileRow.credits_text 
        : (verifiedPlan === 'pro' ? 200 : verifiedPlan === 'starter' ? 50 : 10);
      const creditsImage = typeof profileRow?.credits_image === 'number' 
        ? profileRow.credits_image 
        : (verifiedPlan === 'pro' ? 100 : verifiedPlan === 'starter' ? 30 : 5);
      const creditsVideo = typeof profileRow?.credits_video === 'number' 
        ? profileRow.credits_video 
        : (verifiedPlan === 'pro' ? 15 : verifiedPlan === 'starter' ? 3 : 0);

      // Sync active session with express server
      const syncResponse = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userObj.id,
          name: verifiedName,
          email: loginEmail,
          plan: verifiedPlan,
          role: verifiedRole,
          credits_text: creditsText,
          credits_image: creditsImage,
          credits_video: creditsVideo,
          ativo: verifiedAtivo,
          plano: verifiedPlan,
          creditos: verifiedCreditos
        })
      });

      if (!syncResponse.ok) {
        console.warn("Back-end sync warn on login");
      }

      setSuccessMsg('Login realizado com sucesso! Acessando painel...');

      setTimeout(() => {
        onEnter({
          name: verifiedName,
          email: loginEmail,
          plan: verifiedPlan as any,
          ativo: verifiedAtivo,
          creditos: verifiedCreditos,
          credits_text: creditsText,
          credits_image: creditsImage,
          credits_video: creditsVideo,
          supabaseUrl,
          supabaseKey
        });
        setShowLogin(false);
      }, 1200);

    } catch (err: any) {
      console.error("Critical Login Error:", err);
      setErrorMsg(err.message || 'Senha incorreta ou usuário não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-[#F0F0FF] min-h-screen font-sans selection:bg-[#FE2C55] selection:text-white pb-0 overflow-x-hidden relative">
      {/* Cinematic Ambient Backdrop Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${landingBg})`,
        }}
      />
      {/* Premium Dark Glass Frost Overlay for perfect legibility */}
      <div className="fixed inset-0 z-0 bg-[#06060B]/85 backdrop-blur-[2px] pointer-events-none" />

      {/* Main content layer */}
      <div className="relative z-10">
      
        {/* 1. Cinematic Fullscreen Hero Section */}
        <HeroSection 
          onStart={() => {
            const el = document.getElementById('pricing-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
          onLogin={() => {
            setErrorMsg('');
            setSuccessMsg('');
            setShowLogin(true);
          }} 
        />

        {/* 2. Problem Analyser Section */}
        <ProblemSection />

        {/* 3. Steps Pipeline storytelling */}
        <HowItWorksSection />

        {/* 4. Complete Features Grid */}
        <FeaturesGrid />

        {/* 5. Metrics campaign counter */}
        <SocialProofSection />

        {/* 6. Pricing Layout */}
        <PricingSection 
          onSelectPlan={(plan) => handleSelectPlan(plan)} 
        />

        {/* 7. Faq Accordions */}
        <FaqSection />

        {/* 8. Split Column footer with CTA */}
        <MarketingFooter 
          onStart={() => {
            const el = document.getElementById('pricing-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
        />

        {/* MODAL 2: USER LOGIN (ENTRAR) */}
        <AnimatePresence>
          {showLogin && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#09090F]/95 border border-white/[0.08] w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left"
              >
                <button
                  onClick={() => setShowLogin(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-white font-display">Acesso de Clientes</h3>
                  <p className="text-xs text-slate-400">Acesse sua conta para entrar na suite AI Flow.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-[11px] font-bold text-red-400 rounded-xl leading-normal">
                      ⚠ {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 rounded-xl leading-normal">
                      ✓ {successMsg}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">E-mail de Login</label>
                    <input
                      type="email"
                      className="w-full bg-slate-950/80 border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-purple-500 transition font-mono"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      disabled={loading}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Sua Senha</label>
                    <input
                      type="password"
                      className="w-full bg-slate-950/80 border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-purple-500 transition font-mono"
                      placeholder="Digite sua senha"
                      value={loginPassword}
                      disabled={loading}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-[#69C9D0] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition shadow-xl"
                  >
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Entrar na Plataforma</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2 space-y-3">
                  <p className="text-[11px] text-[#8888AA]">
                    Ainda não possui login? Adquira um plano acima para registrar sua chave ou use um atalho rápido:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setSignupPlan('pro');
                        setShowSignup(true);
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-extrabold underline cursor-pointer bg-transparent border-none"
                    >
                      Criar Conta (Simular Checkout)
                    </button>
                    <span className="hidden sm:inline text-[11px] text-gray-700">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        onEnter({
                          name: 'Gestão Pro Admin',
                          email: 'gestaoprosaas@gmail.com',
                          plan: 'agency',
                          role: 'admin',
                          supabaseUrl,
                          supabaseKey
                        });
                        setShowLogin(false);
                      }}
                      className="text-xs text-[#69C9D0] hover:text-teal-300 font-extrabold underline cursor-pointer bg-transparent border-none"
                    >
                      Acesso Direto gestaoprosaas@gmail.com
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating high-performance Glassmorphic Lens scanning effect */}
        <GlassmorphicLens />

      </div>
    </div>
  );
}
