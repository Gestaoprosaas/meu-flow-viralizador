"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, Check, Shield, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminAfiliadosPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payouts');
      if (res.ok) setPayouts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleApprove = async (id: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/admin/payouts/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        setSuccessMsg('Solicitação de transferência via PIX aprovada!');
        fetchPayouts();
      } else {
        setErrorMsg('Falha ao autorizar pagamento.');
      }
    } catch (e) {
      setErrorMsg('Erro de conexão.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-red-500" />
          Aprovação de Saque de Afiliados
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Valide e pague solicitações de comissão pendentes de afiliados cadastrados.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Solicitações de Transferência em Fila</h3>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#8888AA]">Consultando comissão em aberto...</div>
        ) : payouts.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#8888AA]">Nenhum saque cadastrado no sistema.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#8888AA] whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-white">
                  <th className="pb-3 pr-2">Abertura</th>
                  <th className="pb-3 pr-2">Afiliado Beneficiário</th>
                  <th className="pb-3 pr-2">Chave Pix cadastrada</th>
                  <th className="pb-3 pr-2">Valor</th>
                  <th className="pb-3 pr-2">Estado</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]/60 text-xs text-[#F0F0FF]">
                {payouts.map(payout => (
                  <tr key={payout.id} className="hover:bg-[#1E1E2E]/10 transition">
                    <td className="py-3 pr-2 text-[#777799]">{new Date(payout.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 pr-2 font-bold text-white">
                      {payout.user_name}
                      <span className="text-[10px] text-[#8888AA] font-normal block">{payout.user_email}</span>
                    </td>
                    <td className="py-3 pr-2 font-mono text-cyan-400">{payout.pix_key}</td>
                    <td className="py-3 pr-2 text-emerald-400 font-black">R$ {payout.amount.toFixed(2)}</td>
                    <td className="py-3 pr-2">
                      {payout.status === 'approved' ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pago via Pix</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">Pendente</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {payout.status === 'pending' ? (
                        <button
                          onClick={() => handleApprove(payout.id)}
                          className="px-3 py-1 bg-red-650 hover:bg-emerald-600 bg-emerald-500 text-white font-bold rounded-lg transition text-[10px]"
                        >
                          Concluir PIX agora
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-bold">Pago</span>
                      )}
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
