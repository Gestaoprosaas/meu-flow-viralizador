"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';

export default function AdminAssinaturasPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [mrr, setMrr] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch('/api/admin/subscriptions');
        if (res.ok) {
          const data = await res.json();
          setMrr(data.mrrTotal || 0);
          setSubscriptions(data.subscriptions || []);
        }
      } catch (err) {
        console.error('Error fetching admin subscriptions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-red-500" />
          Faturamento e Assinaturas
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Volume de MRR (Mensalidade Recorrente) e histórico de planos e faturamentos.</p>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#111118] border border-[#1E1E2E] p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8888AA]">MRR Ativo</span>
            <strong className="text-3xl font-black text-emerald-400 block">R$ {mrr.toFixed(2)}</strong>
            <span className="text-[9px] text-[#555577] block">Cálculo cumulativo mensal</span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8888AA]">Assinantes Ativos</span>
            <strong className="text-3xl font-black text-white block">{subscriptions.length}</strong>
            <span className="text-[9px] text-[#555577] block">Starter, Pro VIP, Agência</span>
          </div>
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="bg-[#111118] border border-[#1E1E2E] p-5 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8888AA]">Margem Sandbox</span>
            <strong className="text-3xl font-black text-amber-400 block">100%</strong>
            <span className="text-[9px] text-[#555577] block">GatewaysAsaas simulador</span>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-amber-400" />
          </div>
        </div>

      </div>

      {/* List Subscriptions Table */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Relação de Clientes Pagantes</h3>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#8888AA]">Carregando faturamento recorrente...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#8888AA] whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-white">
                  <th className="pb-3 pr-2">ID Assinatura</th>
                  <th className="pb-3 pr-2">Cliente</th>
                  <th className="pb-3 pr-2">Email</th>
                  <th className="pb-3 pr-2">Plano</th>
                  <th className="pb-3 pr-2">Cobrança Mensal</th>
                  <th className="pb-3 pr-2">Status</th>
                  <th className="pb-3 text-right">Cadastrada em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]/60 text-xs text-[#F0F0FF]">
                {subscriptions.map(sub => (
                  <tr key={sub.id} className="hover:bg-[#1E1E2E]/10 transition">
                    <td className="py-3 pr-2 text-[#777799] font-mono">{sub.id}</td>
                    <td className="py-3 pr-2 font-bold text-white">{sub.user_name}</td>
                    <td className="py-3 pr-2 font-mono text-purple-300">{sub.user_email}</td>
                    <td className="py-3 pr-2 uppercase text-[10px]">
                      {sub.plan === 'pro' ? (
                        <span className="px-1.5 py-0.5 rounded font-black bg-red-500/10 text-red-400 border border-red-500/20">Pro VIP</span>
                      ) : sub.plan === 'agency' ? (
                        <span className="px-1.5 py-0.5 rounded font-black bg-cyan-600/10 text-cyan-400 border border-cyan-600/20">Agência</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">Starter</span>
                      )}
                    </td>
                    <td className="py-3 pr-2 font-black text-emerald-400">R$ {sub.price_brl.toFixed(2)}</td>
                    <td className="py-3 pr-2">
                      <span className="px-2 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-black">
                        Ativa
                      </span>
                    </td>
                    <td className="py-3 text-right text-[#777799]">
                      {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
