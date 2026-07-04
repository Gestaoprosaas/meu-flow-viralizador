import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  ArrowLeft,
  Tag,
  Zap,
  Plus, Flame, Trash2, Ticket
} from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient';

interface ScreenAdminProps {
  onNavigate: (path: string) => void;
  onRefreshProjectState?: () => void;
  profile?: any;
}

export default function ScreenAdmin({ onNavigate, profile }: ScreenAdminProps) {
  const [activeTab, setActiveTab] = useState<'parceiros' | 'users' | 'produtos' | 'produtos_manuais'>('parceiros');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);


  // Data state
  const [sysAdmins, setSysAdmins] = useState<any[]>([]);
  const [cuponsIndicacao, setCuponsIndicacao] = useState<any[]>([]);
  const [cuponsIndicacaoForm, setCuponsIndicacaoForm] = useState({ 
    admin_email: '', 
    admin_nome: '', 
    cupom: '', 
    checkout_url: '', 
    desconto_percentual: 40, 
    preco_original: 497.00, 
    preco_com_desconto: 298.20 
  });

  const [coupons, setCoupons] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [produtosAlta, setProdutosAlta] = useState<any[]>([]);
  const [produtoFormData, setProdutoFormData] = useState({ name: '', price: '', trend: '', tiktok_link: '' });
  const [userSearch, setUserSearch] = useState('');

  // Produtos Manuais state
  const [manualProdutos, setManualProdutos] = useState<any[]>([]);
  const [manualForm, setManualForm] = useState({
    nome: '',
    imagem_url: '',
    preco: '',
    comissao: '',
    link_afiliado: '',
    tendencia: 'em_alta',
    nicho: 'Geral',
    ativo: true
  });
  const [editingManualId, setEditingManualId] = useState<string | null>(null);
  const [manualLoading, setManualLoading] = useState(false);

  // Form states
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [adminFormData, setAdminFormData] = useState({
    nome: '', email: '', checkout_url: '', is_associado: false, status: true
  });

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponFormData, setCouponFormData] = useState({
    codigo: '', admin_id: '', tipo: 'indicacao', ativo: true
  });
  const [quickPresenteCode, setQuickPresenteCode] = useState('');

  const adminFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        'x-user-email': profile?.email || '',
        'x-user-id': profile?.id || ''
      }
    });
  };

  const updateCuponsForm = (field: string, value: any) => {
    setCuponsIndicacaoForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'desconto_percentual' || field === 'preco_original') {
        const desc = parseFloat(next.desconto_percentual as any) || 0;
        const orig = parseFloat(next.preco_original as any) || 0;
        next.preco_com_desconto = parseFloat((orig * (1 - desc / 100)).toFixed(2)) || 0;
      }
      return next;
    });
  };

  const handleToggleUserRole = async (user: any) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const newRole = user.role === 'admin' ? 'client' : 'admin';
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);
      
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Role do usuário atualizado!');
        const { data, error: listError } = await supabase
          .from('profiles')
          .select('id, name, email, plan, role, ativo, created_at')
          .order('created_at', { ascending: false });
        if (!listError && data) setUsers(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de rede ao alternar role.');
    }
  };

  const handleToggleUserAtivo = async (user: any) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { error } = await supabase
        .from('profiles')
        .update({ ativo: !user.ativo })
        .eq('id', user.id);
      
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Status de atividade do usuário atualizado!');
        const { data, error: listError } = await supabase
          .from('profiles')
          .select('id, name, email, plan, role, ativo, created_at')
          .order('created_at', { ascending: false });
        if (!listError && data) setUsers(data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de rede ao alternar status ativo.');
    }
  };

  const handleSaveManualProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.nome || !manualForm.preco || !manualForm.comissao) {
      setErrorMsg('Nome, preço e comissão são obrigatórios.');
      return;
    }
    setManualLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const isEdit = !!editingManualId;
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase não configurado.");

      let resError;
      if (isEdit) {
        const { error } = await supabase
          .from('produtos_manuais')
          .update({ ...manualForm })
          .eq('id', editingManualId)
          .select();
        resError = error;
      } else {
        const { error } = await supabase
          .from('produtos_manuais')
          .insert([{ ...manualForm, preco: parseFloat(manualForm.preco) || 0, comissao: parseFloat(manualForm.comissao) || 0 }])
          .select();
        resError = error;
      }

      if (!resError) {
        setSuccessMsg(isEdit ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        setManualForm({
          nome: '',
          imagem_url: '',
          preco: '',
          comissao: '',
          link_afiliado: '',
          tendencia: 'em_alta',
          nicho: 'Geral',
          ativo: true
        });
        setEditingManualId(null);
        const { data: listData, error: listError } = await supabase
          .from('produtos_manuais')
          .select('*')
          .order('created_at', { ascending: false });
        if (!listError && listData) setManualProdutos(listData);
      } else {
        setErrorMsg(resError.message || 'Erro ao salvar produto.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de rede ao salvar produto.');
    } finally {
      setManualLoading(false);
    }
  };

  const handleEditManualProduct = (p: any) => {
    setEditingManualId(p.id);
    setManualForm({
      nome: p.nome || '',
      imagem_url: p.imagem_url || '',
      preco: p.preco || '',
      comissao: p.comissao || '',
      link_afiliado: p.link_afiliado || '',
      tendencia: p.tendencia || 'em_alta',
      nicho: p.nicho || 'Geral',
      ativo: p.ativo !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteManualProduct = async (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    setManualLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase não configurado.");

      const { error } = await supabase
        .from('produtos_manuais')
        .delete()
        .eq('id', id);

      if (!error) {
        setSuccessMsg('Produto excluído com sucesso!');
        const { data: listData, error: listError } = await supabase
          .from('produtos_manuais')
          .select('*')
          .order('created_at', { ascending: false });
        if (!listError && listData) setManualProdutos(listData);
      } else {
        setErrorMsg(error.message || 'Erro ao excluir produto.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de rede ao excluir produto.');
    } finally {
      setManualLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (activeTab === 'parceiros') {
        const res = await adminFetch('/api/admin/cupons');
        if (res.ok) setCuponsIndicacao(await res.json());
      } else if (activeTab === 'users') {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, name, email, plan, role, ativo, created_at')
            .order('created_at', { ascending: false });
          if (!error && data) setUsers(data);
        }
      } else if (activeTab === 'produtos') {
        const res = await adminFetch('/api/admin/produtos-alta');
        if (res.ok) setProdutosAlta(await res.json());
      } else if (activeTab === 'produtos_manuais') {
        const supabase = getSupabase();
        if (supabase) {
          const { data, error } = await supabase
            .from('produtos_manuais')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data) setManualProdutos(data);
        }
      }
    } catch (err) {
      setErrorMsg('Erro de rede ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const filteredUsers = users.filter(u => ((u.email || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.name || '').toLowerCase().includes(userSearch.toLowerCase())));

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in pb-20">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#1E1E2E] pb-5">
        <div>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
            Admin Area
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 mt-1">
            <ShieldAlert className="w-7 h-7 text-emerald-500" />
            Painel Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Gestão de checkouts, administradores e base de usuários.</p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2 bg-[#12121A] hover:bg-[#1E1E30] text-xs sm:text-sm font-bold rounded-xl transition border border-[#1E1E2E] cursor-pointer self-start sm:self-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao App
        </button>
      </div>

      {(errorMsg || successMsg) && (
        <div className="flex flex-col gap-2">
          {errorMsg && <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold">{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">{successMsg}</div>}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="xl:col-span-3 bg-[#111118]/90 border border-[#1E1E2E] rounded-xl p-2.5 space-y-4 shrink-0">
          <div>
            <div className="px-3 py-1 text-[10px] font-black uppercase text-emerald-400 tracking-wider border-b border-[#1E1E2E]/60 mb-1.5 mt-2">
              Administração Geral
            </div>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('parceiros')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'parceiros' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <Ticket className="w-4 h-4 text-emerald-400" />
                Parceiros e Cupons
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'users' ? 'bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <Users className="w-4 h-4" />
                Base de Usuários
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('produtos')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'produtos' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <Flame className="w-4 h-4" />
                Produtos em Alta
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('produtos_manuais')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'produtos_manuais' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <Flame className="w-4 h-4 text-indigo-400" />
                Produtos Manuais
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="xl:col-span-9 space-y-6">
          
          {activeTab === 'parceiros' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-transparent border border-pink-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
                  <Ticket className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Gerenciar Parceiros e Cupons</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Cadastre parceiros, defina o desconto, o preço original, e a URL de checkout personalizada. O preço com desconto é calculado automaticamente.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2">Cadastrar Novo Parceiro / Cupom</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">Nome do Parceiro *</label>
                    <input
                      type="text"
                      placeholder="Nome do Parceiro"
                      value={cuponsIndicacaoForm.admin_nome}
                      onChange={(e) => updateCuponsForm('admin_nome', e.target.value)}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">E-mail *</label>
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={cuponsIndicacaoForm.admin_email}
                      onChange={(e) => updateCuponsForm('admin_email', e.target.value)}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">Código do Cupom *</label>
                    <input
                      type="text"
                      placeholder="Código do Cupom (Ex: JOAO40)"
                      value={cuponsIndicacaoForm.cupom}
                      onChange={(e) => updateCuponsForm('cupom', e.target.value.toUpperCase())}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">URL de checkout (Applyfy/Kiwify) *</label>
                    <input
                      type="text"
                      placeholder="URL do Checkout Applyfy/Kiwify"
                      value={cuponsIndicacaoForm.checkout_url}
                      onChange={(e) => updateCuponsForm('checkout_url', e.target.value)}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">Desconto % *</label>
                    <input
                      type="number"
                      placeholder="Desconto % (padrão 40)"
                      value={cuponsIndicacaoForm.desconto_percentual}
                      onChange={(e) => updateCuponsForm('desconto_percentual', parseInt(e.target.value) || 0)}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">Preço Original *</label>
                    <input
                      type="number"
                      placeholder="Preço original (padrão 497.00)"
                      value={cuponsIndicacaoForm.preco_original}
                      onChange={(e) => updateCuponsForm('preco_original', parseFloat(e.target.value) || 0)}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-[#8888AA]">Preço Com Desconto *</label>
                    <input
                      type="number"
                      placeholder="Preço com desconto"
                      value={cuponsIndicacaoForm.preco_com_desconto}
                      onChange={(e) => updateCuponsForm('preco_com_desconto', parseFloat(e.target.value) || 0)}
                      className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await adminFetch('/api/admin/cupons', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cuponsIndicacaoForm)
                      });
                      if (res.ok) {
                        setSuccessMsg('Cupom e parceiro criados com sucesso!');
                        loadData();
                        setCuponsIndicacaoForm({ admin_email: '', admin_nome: '', cupom: '', checkout_url: '', desconto_percentual: 40, preco_original: 497.00, preco_com_desconto: 298.20 });
                      } else {
                        const d = await res.json();
                        setErrorMsg(d.error || 'Erro ao criar cupom');
                      }
                    } catch (e) {
                      setErrorMsg('Erro de rede');
                    }
                  }}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg text-xs transition"
                >
                  Salvar Cupom
                </button>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">Parceiros / Cupons Cadastrados</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#8888AA]">
                    <thead>
                      <tr className="border-b border-[#1E1E2E] text-white">
                        <th className="pb-3 pr-2">Cupom</th>
                        <th className="pb-3 px-2">Parceiro</th>
                        <th className="pb-3 px-2">Checkout URL</th>
                        <th className="pb-3 px-2">Desconto</th>
                        <th className="pb-3 px-2 text-center">Usos</th>
                        <th className="pb-3 pl-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cuponsIndicacao.map((c: any) => (
                        <tr key={c.id} className="border-b border-[#1E1E2E]/50 hover:bg-white/5">
                          <td className="py-3 pr-2 font-mono text-pink-400 font-bold">{c.cupom}</td>
                          <td className="py-3 px-2">
                            <span className="text-white font-bold">{c.admin_nome}</span>
                            <br />
                            <span className="text-[10px] text-[#8888AA]">{c.admin_email}</span>
                          </td>
                          <td className="py-3 px-2 truncate max-w-[150px] font-mono text-[10px]">{c.checkout_url}</td>
                          <td className="py-3 px-2">{c.desconto_percentual || 40}%</td>
                          <td className="py-3 px-2 text-center text-white">{c.usos || 0}</td>
                          <td className="py-3 pl-2 text-right">
                            <button
                              type="button"
                              onClick={async () => {
                                await adminFetch(`/api/admin/cupons/${c.id}/toggle`, { method: 'PUT' });
                                loadData();
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.ativo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                            >
                              {c.ativo ? 'Ativo' : 'Inativo'}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {cuponsIndicacao.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-xs">Nenhum cupom cadastrado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          
          {activeTab === 'produtos' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Produtos em Alta</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Adicione produtos que estão em alta para aparecerem no Dashboard dos usuários.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  Adicionar Produto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={produtoFormData.name}
                    onChange={(e) => setProdutoFormData({ ...produtoFormData, name: e.target.value })}
                    placeholder="Nome do Produto"
                    className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={produtoFormData.price}
                    onChange={(e) => setProdutoFormData({ ...produtoFormData, price: e.target.value })}
                    placeholder="Valor (ex: R$ 97,00)"
                    className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={produtoFormData.trend}
                    onChange={(e) => setProdutoFormData({ ...produtoFormData, trend: e.target.value })}
                    placeholder="Tendência (ex: +30%)"
                    className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={produtoFormData.tiktok_link}
                    onChange={(e) => setProdutoFormData({ ...produtoFormData, tiktok_link: e.target.value })}
                    placeholder="Link do TikTok"
                    className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!produtoFormData.name || !produtoFormData.tiktok_link) return alert('Preencha nome e link');
                    try {
                      const res = await adminFetch('/api/admin/produtos-alta', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(produtoFormData)
                      });
                      if (res.ok) {
                        setSuccessMsg('Produto adicionado!');
                        setProdutoFormData({ name: '', price: '', trend: '', tiktok_link: '' });
                        loadData();
                      } else {
                        setErrorMsg('Erro ao adicionar produto.');
                      }
                    } catch(e) {
                      setErrorMsg('Erro de rede.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition"
                >
                  Adicionar Produto
                </button>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0C0C12] border-b border-[#1E1E2E]">
                        <th className="p-4 text-[10px] font-black uppercase text-[#8888AA] tracking-wider">Produto</th>
                        <th className="p-4 text-[10px] font-black uppercase text-[#8888AA] tracking-wider">Valor</th>
                        <th className="p-4 text-[10px] font-black uppercase text-[#8888AA] tracking-wider">Tendência</th>
                        <th className="p-4 text-[10px] font-black uppercase text-[#8888AA] tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E2E]">
                      {produtosAlta.map((p: any) => (
                        <tr key={p.id} className="hover:bg-white/5 transition group">
                          <td className="p-4">
                            <div className="text-xs font-bold text-white">{p.name}</div>
                            <a href={p.tiktok_link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">
                              Ver no TikTok
                            </a>
                          </td>
                          <td className="p-4 text-xs text-[#8888AA]">{p.price}</td>
                          <td className="p-4 text-xs text-emerald-400 font-bold">{p.trend}</td>
                          <td className="p-4">
                            <button
                              onClick={async () => {
                                if (!confirm('Remover produto?')) return;
                                try {
                                  await adminFetch(`/api/admin/produtos-alta/${p.id}`, { method: 'DELETE' });
                                  loadData();
                                } catch (e) {
                                  setErrorMsg('Erro ao deletar');
                                }
                              }}
                              className="text-red-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {produtosAlta.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-[#8888AA] text-xs">
                            Nenhum produto cadastrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'produtos_manuais' && (
            <div className="space-y-6 font-sans">
              <div className="bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                  <Flame className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Produtos Manuais (Supabase)</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Cadastre, edite e ative os produtos manuais persistidos diretamente no Supabase.
                  </p>
                </div>
              </div>

              {/* SUCCESS & ERROR FEEDBACK */}
              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs rounded-xl font-bold flex items-center justify-between">
                  <span>{successMsg}</span>
                  <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-400/70 hover:text-white">✕</button>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs rounded-xl font-bold flex items-center justify-between">
                  <span>{errorMsg}</span>
                  <button type="button" onClick={() => setErrorMsg(null)} className="text-rose-400/70 hover:text-white">✕</button>
                </div>
              )}

              {/* FORM */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  {editingManualId ? 'Editar Produto Manual' : 'Cadastrar Novo Produto Manual'}
                </h3>
                <form onSubmit={handleSaveManualProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">Nome do Produto *</label>
                      <input
                        type="text"
                        required
                        value={manualForm.nome}
                        onChange={(e) => setManualForm({ ...manualForm, nome: e.target.value })}
                        placeholder="Ex: Escova Alisadora 3 em 1"
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">URL da Imagem</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={manualForm.imagem_url}
                          onChange={(e) => setManualForm({ ...manualForm, imagem_url: e.target.value })}
                          placeholder="Ex: https://link-da-foto.com/imagem.jpg"
                          className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 flex-1"
                        />
                        {manualForm.imagem_url && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#1E1E2E] shrink-0 bg-[#0C0C12]">
                            <img src={manualForm.imagem_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">Preço (R$ 89,90) *</label>
                      <input
                        type="text"
                        required
                        value={manualForm.preco}
                        onChange={(e) => setManualForm({ ...manualForm, preco: e.target.value })}
                        placeholder="Ex: R$ 89,90"
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">Comissão (%) *</label>
                      <input
                        type="text"
                        required
                        value={manualForm.comissao}
                        onChange={(e) => setManualForm({ ...manualForm, comissao: e.target.value })}
                        placeholder="Ex: 25%"
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">Link de Afiliado</label>
                      <input
                        type="url"
                        value={manualForm.link_afiliado}
                        onChange={(e) => setManualForm({ ...manualForm, link_afiliado: e.target.value })}
                        placeholder="Ex: https://shopee.com.br/afiliado..."
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">Tendência</label>
                      <select
                        value={manualForm.tendencia}
                        onChange={(e) => setManualForm({ ...manualForm, tendencia: e.target.value })}
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="em_alta">🔥 Em Alta</option>
                        <option value="muito_quente">🔥🔥 Muito Quente</option>
                        <option value="viral">🔥🔥🔥 Viral</option>
                        <option value="destaque">⭐ Destaque</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase text-[#8888AA]">Nicho</label>
                      <select
                        value={manualForm.nicho}
                        onChange={(e) => setManualForm({ ...manualForm, nicho: e.target.value })}
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Beleza">Beleza</option>
                        <option value="Moda">Moda</option>
                        <option value="Casa">Casa</option>
                        <option value="Tecnologia">Tecnologia</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Geral">Geral</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3.5 mt-2">
                      <span className="text-[10px] font-black uppercase text-[#8888AA]">Produto Ativo?</span>
                      <button
                        type="button"
                        onClick={() => setManualForm({ ...manualForm, ativo: !manualForm.ativo })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${manualForm.ativo ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${manualForm.ativo ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2.5 justify-end">
                    {editingManualId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingManualId(null);
                          setManualForm({
                            nome: '',
                            imagem_url: '',
                            preco: '',
                            comissao: '',
                            link_afiliado: '',
                            tendencia: 'em_alta',
                            nicho: 'Geral',
                            ativo: true
                          });
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition"
                      >
                        Cancelar Edição
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={manualLoading}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-2"
                    >
                      {manualLoading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      {editingManualId ? 'Atualizar Produto' : 'Adicionar Produto'}
                    </button>
                  </div>
                </form>
              </div>

              {/* PRODUCTS LIST */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0C0C12] border-b border-[#1E1E2E]">
                        <th className="p-4 font-black uppercase text-[#8888AA] tracking-wider">Produto</th>
                        <th className="p-4 font-black uppercase text-[#8888AA] tracking-wider">Nicho</th>
                        <th className="p-4 font-black uppercase text-[#8888AA] tracking-wider">Preço / Comis.</th>
                        <th className="p-4 font-black uppercase text-[#8888AA] tracking-wider">Status</th>
                        <th className="p-4 font-black uppercase text-[#8888AA] tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E2E]">
                      {manualProdutos.map((p: any) => (
                        <tr key={p.id} className="hover:bg-white/5 transition group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {p.imagem_url && (
                                <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 object-cover rounded-lg bg-zinc-800 shrink-0" />
                              )}
                              <div>
                                <div className="font-bold text-white">{p.nome}</div>
                                <div className="text-[10px] text-[#8888AA] flex items-center gap-1.5 mt-0.5">
                                  <span>Tendência: {
                                    p.tendencia === 'em_alta' ? '🔥 Em Alta' :
                                    p.tendencia === 'muito_quente' ? '🔥🔥 Muito Quente' :
                                    p.tendencia === 'viral' ? '🔥🔥🔥 Viral' : '⭐ Destaque'
                                  }</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-zinc-300">{p.nicho}</td>
                          <td className="p-4">
                            <div className="text-white font-bold">{p.preco}</div>
                            <div className="text-[10px] text-emerald-400 mt-0.5">Comissão: {p.comissao}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${p.ativo !== false ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                              {p.ativo !== false ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditManualProduct(p)}
                                className="text-indigo-400 hover:text-indigo-300 p-1"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteManualProduct(p.id)}
                                className="text-red-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {manualProdutos.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#8888AA] text-xs">
                            Nenhum produto manual cadastrado no Supabase
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Base de Usuários</h3>
                <div className="w-full max-w-xs relative">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    placeholder="Buscar e-mail ou nome..."
                    className="w-full bg-[#111118] border border-[#1E1E2E] rounded-lg pl-3 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#8888AA]">
                    <thead>
                      <tr className="border-b border-[#1E1E2E] text-white">
                        <th className="pb-3 pr-2">Nome</th>
                        <th className="pb-3 pr-2">Email</th>
                        <th className="pb-3 pr-2">Plano</th>
                        <th className="pb-3 pr-2">Role</th>
                        <th className="pb-3 pr-2">Ativo</th>
                        <th className="pb-3 pr-2">Criado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E2E]/60 text-[#F0F0FF]">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#1E1E2E]/20">
                          <td className="py-2.5 pr-2 font-bold">{user.name || 'Sem nome'}</td>
                          <td className="py-2.5 pr-2 font-mono text-purple-300">{user.email}</td>
                          <td className="py-2.5 pr-2 uppercase font-bold text-[10px]">{user.plan || 'Free'}</td>
                          <td className="py-2.5 pr-2">
                            <button
                              type="button"
                              onClick={() => handleToggleUserRole(user)}
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded cursor-pointer transition ${
                                user.role === 'admin'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              }`}
                            >
                              {user.role === 'admin' ? 'Admin' : 'Client'}
                            </button>
                          </td>
                          <td className="py-2.5 pr-2">
                            <button
                              type="button"
                              onClick={() => handleToggleUserAtivo(user)}
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded cursor-pointer transition ${
                                user.ativo !== false
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {user.ativo !== false ? 'Ativo' : 'Inativo'}
                            </button>
                          </td>
                          <td className="py-2.5 pr-2 text-zinc-500">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-4 text-center">Nenhum usuário encontrado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
