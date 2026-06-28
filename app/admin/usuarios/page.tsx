"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminUsuariosPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        setProfiles(await res.json());
      } else {
        setErrorMsg('Erro ao carregar usuários.');
      }
    } catch (err) {
      setErrorMsg('Falha na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/users/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan })
      });
      if (res.ok) {
        setSuccessMsg('Plano do usuário atualizado com sucesso!');
        setEditingUserId(null);
        fetchUsers();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Erro ao atualizar plano.');
      }
    } catch (e) {
      setErrorMsg('Erro de conexão ao alterar plano.');
    }
  };

  const filtered = profiles.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const emailMatch = (p.email || '').toLowerCase().includes(term);
    const planMatch = planFilter === 'all' || p.plan === planFilter;
    return (nameMatch || emailMatch) && planMatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-red-500" />
          Gerência e Controle de Usuários
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Altere limites de crédito e níveis de permissão da base.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
        
        {/* Search controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-[#666688]" />
            <input
              type="text"
              placeholder="Filtre por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 bg-[#0C0C12] border border-[#1E1E2E] rounded-lg text-xs text-white focus:outline-none focus:border-red-500 w-full"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#0C0C12] border border-[#1E1E2E] px-3 py-2 rounded-lg text-xs text-[#8888AA]">
            <Filter className="w-3.5 h-3.5 text-[#555577]" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-[11px] text-[#A0A0C0] font-semibold"
            >
              <option value="all">Filtro: Todos os Planos</option>
              <option value="free">Grátis</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro VIP</option>
              <option value="agency">Agência</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#8888AA]">Carregando base de dados de usuários...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#8888AA] whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-white">
                  <th className="pb-3 pr-2">Nome</th>
                  <th className="pb-3 pr-2">Email</th>
                  <th className="pb-3 pr-2">Plano</th>
                  <th className="pb-3 pr-2">Créditos de Roteiros</th>
                  <th className="pb-3 pr-2">Créditos de Imagens</th>
                  <th className="pb-3 pr-2">Créditos de Vídeos</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]/60 text-xs text-[#F0F0FF]">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-[#1E1E2E]/10 transition">
                    <td className="py-3.5 pr-2 font-bold text-white">{user.name}</td>
                    <td className="py-3.5 pr-2 font-mono text-purple-300">{user.email}</td>
                    <td className="py-3.5 pr-2 uppercase text-[10px]">
                      {user.plan === 'pro' ? (
                        <span className="px-1.5 py-0.5 rounded font-black bg-red-500/10 text-red-400 border border-red-500/20">Pro VIP</span>
                      ) : user.plan === 'agency' ? (
                        <span className="px-1.5 py-0.5 rounded font-black bg-cyan-600/10 text-cyan-400 border border-cyan-600/20">Agência</span>
                      ) : user.plan === 'starter' ? (
                        <span className="px-1.5 py-0.5 rounded font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">Starter</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded font-black bg-zinc-800 text-zinc-400">Grátis</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-2 font-mono text-white">{user.credits_text || 0}</td>
                    <td className="py-3.5 pr-2 font-mono text-white">{user.credits_image || 0}</td>
                    <td className="py-3.5 pr-2 font-mono text-white">{user.credits_video || 0}</td>
                    <td className="py-3.5 text-right">
                      {editingUserId === user.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <select
                            onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                            defaultValue={user.plan}
                            className="bg-[#0C0C12] border border-[#1E1E2E] rounded text-xs p-1 focus:outline-none"
                          >
                            <option value="">-- Escolher --</option>
                            <option value="free">Grátis</option>
                            <option value="starter">Starter</option>
                            <option value="pro">Pro VIP</option>
                            <option value="agency">Agência</option>
                          </select>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 bg-[#1E1E2E] hover:bg-[#252538] rounded text-rose-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingUserId(user.id)}
                          className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg transition text-[10px]"
                        >
                          Alterar Plano
                        </button>
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
