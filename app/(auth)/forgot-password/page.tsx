"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { createClient } from '../../../lib/supabase/client';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setErrorMSG(err.message || 'Falha ao processar solicitação. Redefina seus dados novamente.');
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
        
        {/* Back Link Button */}
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#8888AA] hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          Voltar para o login
        </Link>

        {/* Brand Banner */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-2">Esqueceu sua senha?</h2>
          <p className="text-xs text-[#8888AA]">Digite seu endereço de e-mail e enviaremos um link para você redefinir sua senha com segurança.</p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center gap-2 text-center text-emerald-400">
            <CheckCircle className="w-8 h-8 text-emerald-400 mb-1" />
            <h4 className="font-bold text-sm">E-mail de redefinição enviado!</h4>
            <p className="text-xs text-[#8888AA]">
              Enviamos as instruções para o seu e-mail <strong>{email}</strong>. Verifique também sua pasta de spam.
            </p>
          </div>
        ) : (
          <>
            {/* Error banner */}
            {errorMSG && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMSG}</p>
              </div>
            )}

            {/* Recovery input form */}
            <form onSubmit={handlePasswordRecovery} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8888AA]">E-mail Registrado</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#8888AA]/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail de acesso"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED]/60 rounded-xl text-xs sm:text-sm text-white placeholder-[#8888AA]/40 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-extrabold transition disabled:opacity-50"
              >
                {loading ? 'Enviando link...' : 'Enviar link de redefinição'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
