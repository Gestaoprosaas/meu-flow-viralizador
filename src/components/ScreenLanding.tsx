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
  const [appflyMonthly, setAppflyMonthly] = useState<string>('https://appfly.com/checkout/monthly-placeholder');
  const [appflyLifetime, setAppflyLifetime] = useState<string>('https://appfly.com/checkout/lifetime-placeholder');

  // Modals state
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [signupPlan, setSignupPlan] = useState<'starter' | 'pro' | 'agency'>('pro');

  // Form inputs
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');

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

  // Helper simulating purchase return
  const handleSimulateReturn = (plan: 'starter' | 'pro' | 'agency') => {
    setSignupPlan(plan);
    setErrorMsg('');
    setSuccessMsg('');
    setShowSignup(true);
  };

  // 2. Realize Sign Up (Auth & Profile persistence)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Preencha nome completo, e-mail de acesso e senha.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('A senha precisa conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Cliente Supabase não inicializado. Verifique a Endpoint e Anon Key nas configurações.");
      }

      // Create login credential
      const { data, error } = await client.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            name: regName
          }
        }
      });

      if (error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Falha de conexão com o Supabase. Verifique se a URL e Anon Key estão corretas nas Configurações.');
        } else {
          throw new Error(`Erro Supabase Auth: ${error.message}`);
        }
      }

      const userObj = data.user;
      if (!userObj) {
        throw new Error("Erro no retorno de credencial de usuário.");
      }

      let finalPlan = signupPlan;
      let finalCredits = {
        text: signupPlan === 'pro' ? 200 : signupPlan === 'starter' ? 50 : 10,
        image: signupPlan === 'pro' ? 100 : signupPlan === 'starter' ? 30 : 5,
        video: signupPlan === 'pro' ? 15 : signupPlan === 'starter' ? 3 : 0,
      };

      // Supabase table operations bypassed. Local-first session is established and synchronized.
      const syncResponse = await fetch('/api/profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userObj.id,
          name: regName,
          email: regEmail,
          plan: finalPlan,
          role: 'client',
          credits_text: finalCredits.text,
          credits_image: finalCredits.image,
          credits_video: finalCredits.video
        })
      });
      if (!syncResponse.ok) {
        const syncText = await syncResponse.text();
        console.warn("Back-end synchronization warning:", syncText);
      }

      setSuccessMsg('Sua conta foi criada e vinculada com sucesso!');
      
      // Proceed into dashboard
      setTimeout(() => {
        onEnter({
          name: regName,
          email: regEmail,
          plan: signupPlan,
          supabaseUrl,
          supabaseKey
        });
        setShowSignup(false);
      }, 1500);

    } catch (err: any) {
      console.error("Critical Signup Error:", err);
      setErrorMsg(err.message || 'Houve um erro para criar a conta. Contate o suporte.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Realize Log In for existing accounts
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

      {/* Developer helper floating HUD for checkout simulation */}
      <div className="fixed bottom-4 left-4 z-40 bg-slate-950/95 border border-[#813EF6]/30 p-4 rounded-2xl shadow-2xl max-w-sm text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-[#69C9D0] font-bold mb-1.5 font-display">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Atalho de Configuração / Modo Desenvolvedor</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-normal mb-3">
          Clique abaixo para entrar diretamente no painel administrativo sem precisar de autenticação inicial para que você possa configurar suas chaves do Supabase e APIs reais no menu de <strong>Configurações/Administração</strong>.
        </p>

        <button 
          onClick={() => {
            onEnter({
              name: 'Administrador Pro',
              email: 'admin@gestaoprosaas.com',
              plan: 'agency',
              role: 'admin',
              supabaseUrl,
              supabaseKey
            });
          }}
          className="w-full mb-3 py-2 px-3 bg-[#813EF6] hover:bg-[#9055ff] text-white font-bold rounded-xl active:scale-95 duration-150 text-[10px] cursor-pointer flex items-center justify-center gap-1.5 transition shadow-[0_0_15px_rgba(129,62,246,0.5)]"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Ignorar Autenticação & Acessar Painel</span>
        </button>

        <div className="border-t border-slate-800 pt-2.5">
          <p className="text-[9px] text-[#8888AA] mb-1.5">Ou simule o fluxo de checkout da plataforma:</p>
          <div className="flex gap-2">
            <button 
              onClick={() => handleSimulateReturn('starter')}
              className="flex-1 py-1.5 px-2 bg-gradient-to-r from-purple-600/30 to-purple-600/60 border border-purple-500/40 text-[9px] text-white rounded-lg hover:scale-105 active:scale-95 duration-150 font-semibold cursor-pointer"
            >
              Plano Mensal
            </button>
            <button 
              onClick={() => handleSimulateReturn('pro')}
              className="flex-1 py-1.5 px-2 bg-gradient-to-r from-teal-600/30 to-teal-600/60 border border-teal-500/40 text-[9px] text-white rounded-lg hover:scale-105 active:scale-95 duration-150 font-semibold cursor-pointer"
            >
              Plano Vitalício
            </button>
          </div>
        </div>
      </div>

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

        {/* MODAL 1: ACCOUNT CREATION (POST-CHECKOUT SETUP SCREEN) */}
        <AnimatePresence>
          {showSignup && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#09090F]/95 border border-white/[0.08] w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-left"
              >
                <button
                  onClick={() => setShowSignup(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Banner alert showing purchase recognition */}
                <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-xs text-white uppercase tracking-wider">Pagamento Confirmado no AppFly!</h5>
                    <p className="text-[10px] text-emerald-300 leading-normal">
                      Sua compra do plano <strong className="text-white uppercase font-black">{signupPlan}</strong> foi validada. Complete os dados abaixo para configurar sua conta e liberar o acesso instantaneamente.
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white font-display">Configure Seu Acesso</h3>
                  <p className="text-xs text-slate-400">Insira suas credenciais válidas do sistema.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
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
                    <label className="text-slate-400 text-xs font-semibold">Nome Completo</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950/80 border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-[#FE2C55]/60 transition"
                      placeholder="Seu nome"
                      value={regName}
                      disabled={loading}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Seu melhor E-mail</label>
                    <input
                      type="email"
                      className="w-full bg-slate-950/80 border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-[#FE2C55]/60 transition font-mono"
                      placeholder="nome@dominio.com"
                      value={regEmail}
                      disabled={loading}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-semibold">Defina uma Senha segura</label>
                    <input
                      type="password"
                      className="w-full bg-slate-950/80 border border-white/[0.06] rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-[#FE2C55]/60 transition font-mono"
                      placeholder="Mínimo 6 caracteres"
                      value={regPassword}
                      disabled={loading}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4.5 bg-gradient-to-r from-[#FE2C55] to-purple-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition shadow-xl"
                  >
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Criar Conta & Ativar Painel</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-[10px] text-gray-500">
                    Ao prosseguir, você aceita nossos termos de uso e faturamento eletrônico.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
