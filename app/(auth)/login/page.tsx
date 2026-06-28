"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Chrome } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  // Preserve any ref codes in query parameters
  const refCode = searchParams.get('ref');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMSG(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth sign-in flow
  const handleGoogleLogin = async () => {
    setErrorMSG(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('OAuth error:', err);
      setErrorMSG(err.message || 'Falha ao conectar com o Google.');
    }
  };

  // Pre-seed mock user for simple showcase
  const handleTestDrive = () => {
    setEmail('creator@viralforge.ai');
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute -left-40 top-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -right-40 bottom-0 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-md bg-[#111118]/80 backdrop-blur-md border border-[#1E1E2E] rounded-2xl p-6 sm:p-8 space-y-6 relative z-10 shadow-2xl shadow-[#7C3AED]/5">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-black shadow-[#7C3AED]/20 shadow-md">
              V
            </div>
            <span className="font-display font-extrabold text-lg tracking-wide text-white">
              ViralForge <span className="text-[#06B6D4]">AI</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-4">Bem-vindo de volta!</h2>
          <p className="text-xs text-[#8888AA]">Gere roteiros, fotos e vídeos comerciais virais para o TikTok Shop</p>
        </div>

        {/* Error notification */}
        {errorMSG && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMSG}</p>
          </div>
        )}

        {/* Action form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8888AA]">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8888AA]/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/40 outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[#8888AA]">Senha</label>
              <Link href="/forgot-password" className="text-xs text-[#7C3AED] hover:underline font-medium">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8888AA]/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/40 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar na Conta'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Credentials Seeder CTA */}
        <button
          onClick={handleTestDrive}
          className="w-full py-2 bg-[#1E1E2E]/40 hover:bg-[#1E1E2E]/80 border border-[#1E1E2E] text-[#8888AA] rounded-xl text-[11px] font-semibold transition"
        >
          🔑 Preencher credenciais de teste para demonstração
        </button>

        {/* Secondary SSO Providers split */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#1E1E2E]" />
          <span className="flex-shrink mx-4 text-[10px] text-[#8888AA] font-bold uppercase tracking-wider">ou continue com</span>
          <div className="flex-grow border-t border-[#1E1E2E]" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 bg-[#111118] hover:bg-[#1E1E2E] border border-[#1E1E2E] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <Chrome className="w-4 h-4 text-[#06B6D4]" />
          Entrar com o Google
        </button>

        <p className="text-center text-xs text-[#8888AA]">
          Não tem cadastro ainda?{' '}
          <Link
            href={refCode ? `/register?ref=${refCode}` : '/register'}
            className="text-[#06B6D4] hover:underline font-bold"
          >
            Criar conta grátis
          </Link>
        </p>

      </div>
    </div>
  );
}
