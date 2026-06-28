"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';

export default function RegisterWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] flex justify-center items-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#7C3AED] animate-spin" />
      </div>
    }>
      <RegisterPage />
    </Suspense>
  );
}

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Capture referral code if present (?ref=val)
  const refCode = searchParams.get('ref');
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);

  // Parse referrer if code is supplied
  useEffect(() => {
    async function checkReferrer() {
      if (!refCode) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('affiliate_code', refCode)
          .single();

        if (data && !error) {
          setReferrerId(data.id);
          setReferrerName(data.name || 'Afiliado');
        }
      } catch (err) {
        console.error('Error looking up referrer code:', err);
      }
    }
    checkReferrer();
  }, [refCode, supabase]);

  // Generate a randomized unique affiliate code for the registrant
  const generateAffiliateCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 7; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `viral${code}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG(null);

    try {
      // 1. Supabase auth registration
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha no cadastro da conta.');
      }

      const generatedCode = generateAffiliateCode();

      // 2. Create profile row matching user ID
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            name: name,
            email: email,
            plan: 'free',
            credits_text: 10,
            credits_image: 5,
            credits_video: 0,
            affiliate_code: generatedCode,
            referred_by: referrerId, // Links dynamically to the referrer profile id
          }
        ]);

      if (profileError) {
        console.error('Error creating profile entry, going to upsert route:', profileError);
        // Fallback upsert
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          name: name,
          email: email,
          plan: 'free',
          credits_text: 10,
          credits_image: 5,
          credits_video: 0,
          affiliate_code: generatedCode,
          referred_by: referrerId,
        });
      }

      // 3. Register standard lead commission structure if referrerId exists
      if (referrerId) {
        await supabase
          .from('affiliate_referrals')
          .insert([
            {
              referrer_id: referrerId,
              referred_id: authData.user.id,
              commission_amount: 0.0, // Initial free, converted when sub happens
              status: 'pending'
            }
          ]);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2500);

    } catch (err: any) {
      console.error('Registration processing error:', err);
      setErrorMSG(err.message || 'Houve um erro ao efetuar o cadastro.');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-4">Criar sua Conta</h2>
          <p className="text-xs text-[#8888AA]">Ganhe 10 créditos grátis de Roteiro e 5 de Imagem de imediato!</p>
        </div>

        {/* Invited banner indicator */}
        {referrerName && (
          <div className="p-2 sm:p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2 text-[10px] sm:text-xs text-indigo-400">
            <Users className="w-4 h-4 text-indigo-300" />
            <span>Você foi convidado por <strong>{referrerName}</strong></span>
          </div>
        )}

        {/* Success alert */}
        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center gap-2 text-center text-emerald-400 animate-pulse">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-1" />
            <h4 className="font-bold text-sm">Conta criada com sucesso!</h4>
            <p className="text-xs text-[#8888AA]">Aguarde, redirecionando você ao Painel Geral...</p>
          </div>
        ) : (
          <>
            {/* Error notifications */}
            {errorMSG && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMSG}</p>
              </div>
            )}

            {/* Action Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8888AA]">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#8888AA]/60" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/40 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8888AA]">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8888AA]/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/40 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8888AA]">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#8888AA]/60" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/40 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Criar Conta Grátis'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-xs text-[#8888AA]">
              Já possui uma conta?{' '}
              <Link
                href={refCode ? `/login?ref=${refCode}` : '/login'}
                className="text-[#06B6D4] hover:underline font-bold"
              >
                Faça login
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
