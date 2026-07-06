import React, { useState, useEffect } from 'react';
import { Users, Ticket, Package, Settings, Search, Shield, ShieldAlert, CheckCircle, XCircle, Trash2, Edit2, Play, Sparkles, Copy, Share2, RefreshCw, Power, Server, Lock, ExternalLink, ChevronDown, ChevronUp, UserX, UserCheck, ArrowLeft, Flame, Plus, Bell } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { startFictitiousNotifications, stopFictitiousNotifications } from './FictitiousNotifications';

interface ScreenAdminProps {
  onNavigate: (path: string) => void;
  onRefreshProjectState?: () => void;
  profile?: any;
}

export default function ScreenAdmin({ onNavigate, profile }: ScreenAdminProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'parceiros' | 'produtos' | 'sistema'>('users');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // === SEÇÃO USUÁRIOS ===
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // === SEÇÃO PARCEIROS ===
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [parceiroForm, setParceiroForm] = useState({
    id: '', admin_nome: '', admin_email: '', cupom: '', checkout_url_mensal: '', checkout_url_vitalicio: '', limite_cupons: 2
  });
  const [isEditingParceiro, setIsEditingParceiro] = useState(false);
  
  // === SEÇÃO PARCEIROS ===
  const [produtosManuais, setProdutosManuais] = useState<any[]>([]);
  const [produtoForm, setProdutoForm] = useState({
    nome: '', imagem_url: '', preco: '', comissao: '', link_afiliado: '', nicho: 'Geral', ativo: true
  });
  const [editingProdutoId, setEditingProdutoId] = useState<string | null>(null);

  
  // === SEÇÃO NOTIFICAÇÕES ===
  const [notifIntervalo, setNotifIntervalo] = useState(60000);
  const [notifTipo, setNotifTipo] = useState<'all' | 'compra' | 'avaliacao' | 'live'>('all');
  const [notifAtiva, setNotifAtiva] = useState(false);

  
  const supabase = getSupabase();
  const isSuperAdmin = profile?.role === 'superadmin';
  const isAdmin = profile?.role === 'admin' || isSuperAdmin;

  useEffect(() => {
    if (profile && !isAdmin && !isSuperAdmin) {
       onNavigate('/dashboard');
    }
  }, [profile, isAdmin, isSuperAdmin, onNavigate]);


  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const carregarDados = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Admin] Session token:', session?.access_token ? 'presente' : 'ausente');

      if (activeTab === 'users') {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && data) setUsers(data);
      } else if (activeTab === 'parceiros') {
        const { data, error } = await supabase.from('cupons_admins').select('*').order('criado_em', { ascending: false });
        console.log('[Admin] Resultado cupons:', data, error);
        if (!error && data) setParceiros(data);
      } else if (activeTab === 'produtos') {
        const { data, error } = await supabase.from('produtos_manuais').select('*').order('created_at', { ascending: false });
        if (!error && data) setProdutosManuais(data);
      }
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  };

  const notify = (msg: string, type: 'error' | 'success') => {
    if (type === 'error') { setErrorMsg(msg); setSuccessMsg(null); }
    else { setSuccessMsg(msg); setErrorMsg(null); }
    setTimeout(() => { setErrorMsg(null); setSuccessMsg(null); }, 4000);
  };

  // === MÉTODOS USUÁRIOS ===
  const alternarRole = async (userId: string, roleAtual: string) => {
    if (!supabase) return;
    if (!isSuperAdmin) {
      notify('Apenas superadmins podem alterar permissões.', 'error');
      return;
    }
    
    // Cycle roles: client -> admin -> superadmin -> client
    let novoRole = 'client';
    if (roleAtual === 'client') novoRole = 'admin';
    else if (roleAtual === 'admin') {
      const confirmSuper = window.confirm("⚠️ Tem certeza? Superadmins têm acesso total ao sistema.");
      if (confirmSuper) novoRole = 'superadmin';
      else return; // Cancel
    } else if (roleAtual === 'superadmin') {
      novoRole = 'client';
    }

    const { error } = await supabase.from('profiles').update({ role: novoRole }).eq('id', userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: novoRole } : u));
      notify(`Permissão atualizada para ${novoRole.toUpperCase()}`, 'success');
    } else {
      notify('Erro ao atualizar permissão', 'error');
    }
  };


  const alternarStatus = async (userId: string, ativoAtual: boolean) => {
    if (!supabase) return;
    const { error } = await supabase.from('profiles').update({ ativo: !ativoAtual }).eq('id', userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, ativo: !ativoAtual } : u));
      notify(`Status atualizado para ${!ativoAtual ? 'ATIVO' : 'INATIVO'}`, 'success');
    } else {
      notify('Erro ao atualizar status', 'error');
    }
  };

  // === MÉTODOS PARCEIROS ===
  const salvarParceiro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!parceiroForm.admin_nome || !parceiroForm.admin_email || !parceiroForm.cupom || !parceiroForm.checkout_url_mensal || !parceiroForm.checkout_url_vitalicio) {
      notify('Preencha todos os campos do parceiro', 'error');
      return;
    }
    
    setLoading(true);
    const precoOriginal = 497.00;
    const descPercent = 40;
    const precoDesc = precoOriginal * (1 - (descPercent/100));
    
    const payload = {
      admin_nome: parceiroForm.admin_nome,
      admin_email: parceiroForm.admin_email,
      cupom: parceiroForm.cupom.toUpperCase().trim(),
      checkout_url_mensal: parceiroForm.checkout_url_mensal,
      checkout_url_vitalicio: parceiroForm.checkout_url_vitalicio,
      limite_cupons: Number(parceiroForm.limite_cupons || 2),
      preco_original: precoOriginal,
      desconto_percentual: descPercent,
      preco_com_desconto: precoDesc, usos: 0,
      ativo: true
    };

    if (isEditingParceiro && parceiroForm.id) {
      const { error } = await supabase.from('cupons_admins').update(payload).eq('id', parceiroForm.id);
      if (!error) notify('Parceiro atualizado!', 'success');
      else notify('Erro ao atualizar parceiro', 'error');
    } else {
      const { error } = await supabase.from('cupons_admins').insert([payload]);
      if (!error) notify('Parceiro cadastrado com sucesso!', 'success');
      else notify('Erro ao cadastrar parceiro', 'error');
    }
    
    setParceiroForm({ id: '', admin_nome: '', admin_email: '', cupom: '', checkout_url_mensal: '', checkout_url_vitalicio: '', limite_cupons: 2 });
    setIsEditingParceiro(false);
    carregarDados();
  };

  const excluirParceiro = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('cupons_admins').delete().eq('id', id);
    if (!error) notify('Parceiro excluído', 'success');
    carregarDados();
  };

  // === MÉTODOS PRODUTOS ===
  const salvarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    
    const payload = {
      ...produtoForm,
      preco: parseFloat(produtoForm.preco) || 0,
      comissao: parseFloat(produtoForm.comissao) || 0
    };

    if (editingProdutoId) {
      const { error } = await supabase.from('produtos_manuais').update(payload).eq('id', editingProdutoId);
      if (!error) notify('Produto atualizado!', 'success');
      else notify('Erro ao atualizar', 'error');
    } else {
      const { error } = await supabase.from('produtos_manuais').insert([payload]);
      if (!error) notify('Produto criado!', 'success');
      else notify('Erro ao criar', 'error');
    }
    
    setProdutoForm({ nome: '', imagem_url: '', preco: '', comissao: '', link_afiliado: '', nicho: 'Geral', ativo: true });
    setEditingProdutoId(null);
    carregarDados();
  };

  const excluirProduto = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('produtos_manuais').delete().eq('id', id);
    if (!error) notify('Produto excluído', 'success');
    carregarDados();
  };

  // Filtering
  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );
  
  const adminsCount = users.filter(u => u.role === 'admin').length;
  const clientsCount = users.filter(u => u.role !== 'admin').length;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#06060B] text-white font-sans overflow-hidden selection:bg-[#FE2C55] selection:text-white">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-[#0B0B14] border-b md:border-b-0 md:border-r border-[#1E1E35] flex flex-col z-20 shrink-0">
        <div className="p-4 md:p-6 flex justify-between items-center md:block">
          <h2 className="text-xl font-black bg-gradient-to-r from-[#FE2C55] to-[#813EF6] bg-clip-text text-transparent">Admin Panel</h2>
          <p className="text-xs text-zinc-500 mt-1 hidden md:block">{profile?.email}</p>
          <button onClick={() => onNavigate('/dashboard')} className="md:hidden flex items-center justify-center p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
        </div>
        
        <nav className="flex flex-row md:flex-col flex-1 px-4 md:space-y-2 overflow-x-auto gap-2 md:gap-0 pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'users' ? 'bg-[#FE2C55]/10 text-[#FE2C55] border border-[#FE2C55]/20' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Usuários
          </button>
          
          {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('parceiros')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'parceiros' ? 'bg-[#813EF6]/10 text-[#813EF6] border border-[#813EF6]/20' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" /> Parceiros & Cupons
          </button>
          )}
          
          {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('produtos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'produtos' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Produtos Manuais
          </button>
          )}

          {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('sistema')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'sistema' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Sistema
          </button>
          )}

          <button
            onClick={() => setActiveTab('notificacoes' as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'notificacoes' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" /> Notificações
          </button>
        </nav>
        
        <div className="p-4 border-t border-[#1E1E35] hidden md:block">
          <button onClick={() => onNavigate('/dashboard')} className="w-full flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg transition-colors">
            <ArrowLeft className="w-3 h-3" /> Voltar ao App
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FE2C55]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#813EF6]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto min-h-full">
          
          {/* Notifications */}
          <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in shadow-xl backdrop-blur-md">
                <CheckCircle className="w-4 h-4" /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in shadow-xl backdrop-blur-md">
                <ShieldAlert className="w-4 h-4" /> {errorMsg}
              </div>
            )}
          </div>

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Usuários</h1>
                  <p className="text-zinc-400 text-sm mt-1">Gerencie os acessos e permissões da plataforma.</p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="bg-[#0D0D1A] border border-[#1E1E35] rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-2xl font-black text-white">{users.length}</span>
                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Total</span>
                  </div>
                  <div className="bg-[#FE2C55]/10 border border-[#FE2C55]/20 rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-2xl font-black text-[#FE2C55]">{adminsCount}</span>
                    <span className="text-[10px] uppercase text-[#FE2C55]/70 font-bold tracking-wider">Admins</span>
                  </div>
                  <div className="bg-[#813EF6]/10 border border-[#813EF6]/20 rounded-xl p-3 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-2xl font-black text-[#813EF6]">{clientsCount}</span>
                    <span className="text-[10px] uppercase text-[#813EF6]/70 font-bold tracking-wider">Clientes</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Buscar usuário por nome ou email..." 
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-[#0D0D1A] border border-[#1E1E35] text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FE2C55]/50 transition-colors"
                />
              </div>

              {loading ? (
                <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-[#FE2C55] animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-5 hover:border-[#FE2C55]/30 transition-colors flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${user.role === 'admin' ? 'bg-gradient-to-br from-[#FE2C55] to-[#813EF6] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white truncate" title={user.name}>{user.name || 'Sem nome'}</h3>
                          <p className="text-xs text-zinc-400 truncate" title={user.email}>{user.email}</p>
                          <div className="flex gap-2 mt-2">
                            {user.role === 'superadmin' ? (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded uppercase tracking-wider">Superadmin</span>
                            ) : user.role === 'admin' ? (
                              <span className="px-2 py-0.5 bg-[#813EF6]/20 text-[#813EF6] text-[10px] font-bold rounded uppercase tracking-wider">Admin</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded uppercase tracking-wider">Cliente</span>
                            )}
                            {user.ativo !== false ? (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">Ativo</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase tracking-wider">Bloqueado</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#1E1E35] grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => alternarRole(user.id, user.role)}
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Alternar Permissão"
                        >
                          {user.role === 'admin' ? <UserX className="w-4 h-4 mb-1" /> : <UserCheck className="w-4 h-4 mb-1" />}
                          <span className="text-[9px] font-bold uppercase">{user.role === 'admin' ? 'Revogar' : 'Tornar Admin'}</span>
                        </button>
                        
                        <button 
                          onClick={() => alternarStatus(user.id, user.ativo !== false)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
                            user.ativo !== false 
                              ? 'bg-zinc-900/50 hover:bg-red-500/20 text-zinc-400 hover:text-red-400' 
                              : 'bg-red-500/10 hover:bg-emerald-500/20 text-red-400 hover:text-emerald-400'
                          }`}
                          title="Alternar Status"
                        >
                          {user.ativo !== false ? <ShieldAlert className="w-4 h-4 mb-1" /> : <CheckCircle className="w-4 h-4 mb-1" />}
                          <span className="text-[9px] font-bold uppercase">{user.ativo !== false ? 'Bloquear' : 'Desbloquear'}</span>
                        </button>
                        
                        <button 
                          onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                          {expandedUserId === user.id ? <ChevronUp className="w-4 h-4 mb-1" /> : <ChevronDown className="w-4 h-4 mb-1" />}
                          <span className="text-[9px] font-bold uppercase">Detalhes</span>
                        </button>
                      </div>

                      {expandedUserId === user.id && (
                        <div className="mt-3 p-3 bg-zinc-900/50 rounded-xl text-[11px] space-y-1 animate-fade-in border border-[#1E1E35]">
                          <p><strong className="text-zinc-500">ID:</strong> {user.id}</p>
                          <p><strong className="text-zinc-500">Plano:</strong> {user.plan || 'Nenhum'}</p>
                          <p><strong className="text-zinc-500">Criado em:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                          <p><strong className="text-zinc-500">Créditos:</strong> T:{user.credits_text} | I:{user.credits_image} | V:{user.credits_video}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500">Nenhum usuário encontrado.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: PARCEIROS */}
          {activeTab === 'parceiros' && isSuperAdmin && (
            <div className="space-y-10 animate-fade-in">
              {/* 2A - CADASTRO DE PARCEIROS (Só SuperAdmin) */}
              <section>

                <div className="mb-6">
                  <h2 className="text-2xl font-black tracking-tight">Parceiros & Embaixadores</h2>
                  <p className="text-zinc-400 text-sm mt-1">Cadastre parceiros para que tenham URLs de checkout exclusivas e cupons de 40% OFF.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Formulário */}
                  <div className="lg:col-span-4">
                    <form onSubmit={salvarParceiro} className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-6 space-y-4 sticky top-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                        {isEditingParceiro ? <Edit2 className="w-4 h-4 text-[#813EF6]" /> : <Plus className="w-4 h-4 text-[#FE2C55]" />}
                        {isEditingParceiro ? 'Editar Parceiro' : 'Novo Parceiro'}
                      </h3>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Nome do Parceiro</label>
                        <input type="text" value={parceiroForm.admin_nome} onChange={e => setParceiroForm({...parceiroForm, admin_nome: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-[#813EF6] outline-none" placeholder="Ex: Vitor Silva" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Email (deve existir na tabela profiles)</label>
                        <input type="email" value={parceiroForm.admin_email} onChange={e => setParceiroForm({...parceiroForm, admin_email: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-[#813EF6] outline-none" placeholder="vitor@email.com" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Cupom (Automático Maiúsculas)</label>
                        <input type="text" value={parceiroForm.cupom} onChange={e => setParceiroForm({...parceiroForm, cupom: e.target.value.toUpperCase()})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white font-mono focus:border-[#813EF6] outline-none" placeholder="VITOR10" />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Checkout Mensal</label>
                        <input type="url" value={parceiroForm.checkout_url_mensal} onChange={e => setParceiroForm({...parceiroForm, checkout_url_mensal: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-[#813EF6] outline-none" placeholder="https://applyfy.com.br/checkout/..." />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Checkout Vitalício</label>
                        <input type="url" value={parceiroForm.checkout_url_vitalicio} onChange={e => setParceiroForm({...parceiroForm, checkout_url_vitalicio: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-[#813EF6] outline-none" placeholder="https://applyfy.com.br/checkout/..." />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Limite de cupons na live</label>
                        <input 
                          type="number" 
                          min={1} 
                          max={10} 
                          value={parceiroForm.limite_cupons} 
                          onChange={e => setParceiroForm({...parceiroForm, limite_cupons: parseInt(e.target.value) || 1})} 
                          className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-[#813EF6] outline-none" 
                        />
                      </div>
                      
                      <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
                        <p className="flex justify-between"><span>Desconto Fixo:</span> <strong className="text-emerald-400">40%</strong></p>
                        <p className="flex justify-between"><span>Preço Original:</span> <span>R$ 497,00</span></p>
                        <p className="flex justify-between"><span>Preço Final:</span> <strong className="text-white">R$ 298,20</strong></p>
                      </div>

                      <div className="pt-2 flex gap-2">
                        {isEditingParceiro && (
                          <button type="button" onClick={() => { setIsEditingParceiro(false); setParceiroForm({ id: '', admin_nome: '', admin_email: '', cupom: '', checkout_url_mensal: '', checkout_url_vitalicio: '', limite_cupons: 2 }); }} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-xs transition">Cancelar</button>
                        )}
                        <button type="submit" disabled={loading} className="flex-[2] py-3 bg-gradient-to-r from-[#FE2C55] to-[#813EF6] hover:opacity-90 rounded-xl font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 text-white shadow-lg shadow-[#813EF6]/20">
                          {loading ? 'Salvando...' : 'Salvar Parceiro'}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  {/* Lista */}
                  <div className="lg:col-span-8">
                    {loading && parceiros.length === 0 ? (
                      <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-[#813EF6] animate-spin" /></div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {parceiros.map(p => (
                          <div key={p.id} className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-5 hover:border-[#813EF6]/30 transition-all flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setParceiroForm({ ...p, limite_cupons: p.limite_cupons ?? 2 }); setIsEditingParceiro(true); }} className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500/40 transition"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => excluirParceiro(p.id)} className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-500/40 transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white shrink-0">
                                {p.admin_nome.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-sm leading-tight">{p.admin_nome}</h4>
                                <p className="text-[10px] text-zinc-500">{p.admin_email}</p>
                              </div>
                            </div>
                            
                            <div className="bg-[#111118] border border-[#1E1E35] rounded-xl p-3 flex justify-between items-center mb-3">
                              <span className="text-xs text-zinc-400">Cupom:</span>
                              <span className="font-mono font-black text-lg text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{p.cupom}</span>
                            </div>
                            
                            <div className="mt-auto space-y-2">
                              <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <span className="font-semibold text-zinc-500">Mensal:</span>
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{p.checkout_url_mensal}</span>
                              </p>
                              <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <span className="font-semibold text-zinc-500">Vitalício:</span>
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{p.checkout_url_vitalicio}</span>
                              </p>
                              <p className="text-[10px] text-zinc-500 flex items-center gap-1"><Users className="w-3 h-3" /> {p.usos || 0} usos registrados</p>
                            </div>
                          </div>
                        ))}
                        {parceiros.length === 0 && (
                          <div className="col-span-full py-12 text-center text-zinc-500">Nenhum parceiro cadastrado.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB: PRODUTOS */}
          {activeTab === 'produtos' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Produtos Manuais</h1>
                <p className="text-zinc-400 text-sm mt-1">Gerencie os produtos extras exibidos na galeria.</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                  <form onSubmit={salvarProduto} className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-6 space-y-4 sticky top-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                      {editingProdutoId ? <Edit2 className="w-4 h-4 text-cyan-500" /> : <Plus className="w-4 h-4 text-cyan-500" />}
                      {editingProdutoId ? 'Editar Produto' : 'Novo Produto'}
                    </h3>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Nome do Produto</label>
                      <input type="text" value={produtoForm.nome} onChange={e => setProdutoForm({...produtoForm, nome: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">URL da Imagem</label>
                      <input type="url" value={produtoForm.imagem_url} onChange={e => setProdutoForm({...produtoForm, imagem_url: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Preço (R$)</label>
                        <input type="number" step="0.01" value={produtoForm.preco} onChange={e => setProdutoForm({...produtoForm, preco: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">Comissão (R$)</label>
                        <input type="number" step="0.01" value={produtoForm.comissao} onChange={e => setProdutoForm({...produtoForm, comissao: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Link de Afiliado</label>
                      <input type="url" value={produtoForm.link_afiliado} onChange={e => setProdutoForm({...produtoForm, link_afiliado: e.target.value})} className="w-full bg-[#111118] border border-[#1E1E35] rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none" required />
                    </div>

                    <div className="pt-2 flex gap-2">
                      {editingProdutoId && (
                        <button type="button" onClick={() => { setEditingProdutoId(null); setProdutoForm({ nome: '', imagem_url: '', preco: '', comissao: '', link_afiliado: '', nicho: 'Geral', ativo: true }); }} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-xs transition">Cancelar</button>
                      )}
                      <button type="submit" disabled={loading} className="flex-[2] py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 text-zinc-900 shadow-lg shadow-cyan-500/20">
                        {loading ? 'Salvando...' : 'Salvar Produto'}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="lg:col-span-8">
                  {loading && produtosManuais.length === 0 ? (
                    <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" /></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {produtosManuais.map(p => (
                        <div key={p.id} className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all group flex flex-col">
                          <div className="aspect-square w-full relative">
                            <ImageWithSkeleton src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                              <button onClick={() => { setProdutoForm(p); setEditingProdutoId(p.id); }} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs rounded-xl transition">Editar</button>
                              <button onClick={() => excluirProduto(p.id)} className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition">Excluir</button>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <h4 className="font-bold text-white text-sm line-clamp-2">{p.nome}</h4>
                            <div className="mt-auto pt-3 flex justify-between items-end">
                              <span className="text-xs text-zinc-400">Preço: <span className="text-white font-bold block">R$ {p.preco.toFixed(2)}</span></span>
                              <span className="text-xs text-emerald-400 font-bold">Com: R$ {p.comissao.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {produtosManuais.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-500">Nenhum produto cadastrado.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* TAB: NOTIFICAÇÕES FICTÍCIAS */}
          {activeTab === 'notificacoes' as any && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Notificações de Vendas</h1>
                <p className="text-zinc-400 text-sm mt-1">Configure alertas fictícios de vendas para exibir durante apresentações.</p>
              </div>

              <div className="bg-[#0D0D1A] border border-[#1E1E35] rounded-3xl p-8">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Painel de Controle
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3">Intervalo entre notificações</label>
                    <div className="flex flex-wrap gap-2">
                      {[30000, 60000, 120000, 300000].map(val => (
                        <button
                          key={val}
                          onClick={() => setNotifIntervalo(val)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                            notifIntervalo === val ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                          }`}
                        >
                          {val / 1000}s
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const val = prompt('Intervalo em segundos:');
                          if (val && !isNaN(Number(val))) setNotifIntervalo(Number(val) * 1000);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3">Estilo da notificação</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'Tudo misturado' },
                        { id: 'compra', label: '💳 Compra' },
                        { id: 'avaliacao', label: '⭐ Avaliação' },
                        { id: 'live', label: '🔥 Live' },
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setNotifTipo(type.id as any)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                            notifTipo === type.id ? 'bg-[#FE2C55] text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1E1E35] flex gap-4">
                    {!notifAtiva ? (
                      <button
                        onClick={() => {
                          startFictitiousNotifications(notifIntervalo, notifTipo);
                          setNotifAtiva(true);
                          notify('Notificações ativadas!', 'success');
                        }}
                        className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" /> INICIAR
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          stopFictitiousNotifications();
                          setNotifAtiva(false);
                          notify('Notificações paradas.', 'success');
                        }}
                        className="flex-1 py-4 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2"
                      >
                        <Power className="w-5 h-5" /> PARAR
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SISTEMA */}
          {activeTab === 'sistema' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Status do Sistema</h1>
                <p className="text-zinc-400 text-sm mt-1">Monitoramento e configurações globais.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Server className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Supabase Connection</h4>
                    <p className="text-xs text-emerald-400 font-bold mt-1">Conectado e Estável</p>
                  </div>
                </div>
                
                <div className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Power className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Kalodata API</h4>
                    <p className="text-xs text-emerald-400 font-bold mt-1">Token Válido</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D1A] border border-[#1E1E35] rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Lock className="w-4 h-4" /> Variáveis de Ambiente</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-mono">VITE_SUPABASE_URL</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${import.meta.env.VITE_SUPABASE_URL ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {import.meta.env.VITE_SUPABASE_URL ? 'PRESENTE' : 'AUSENTE'}
                    </span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-mono">VITE_SUPABASE_ANON_KEY</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'AUSENTE'}
                    </span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-mono">VITE_KALODATA_API_KEY</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${import.meta.env.VITE_KALODATA_API_KEY ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {import.meta.env.VITE_KALODATA_API_KEY ? 'PRESENTE' : 'AUSENTE'}
                    </span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-mono">VITE_GEMINI_API_KEY</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${import.meta.env.VITE_GEMINI_API_KEY ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {import.meta.env.VITE_GEMINI_API_KEY ? 'PRESENTE' : 'AUSENTE'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-center pt-8">
                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-sm transition flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Forçar Atualização de Cache
                </button>
              </div>
              <div className="text-center mt-6">
                <p className="text-zinc-600 text-xs font-mono">Versão do Sistema: v2.1.0-viral</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
