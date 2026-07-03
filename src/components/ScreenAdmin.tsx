import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  ArrowLeft,
  Tag,
  Zap,
  Plus, Flame, Trash2
} from 'lucide-react';

interface ScreenAdminProps {
  onNavigate: (path: string) => void;
  onRefreshProjectState?: () => void;
  profile?: any;
}

export default function ScreenAdmin({ onNavigate, profile }: ScreenAdminProps) {
  const [activeTab, setActiveTab] = useState<'coupons' | 'users' | 'produtos' | 'produtos_manuais'>('coupons');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data state
  const [sysAdmins, setSysAdmins] = useState<any[]>([]);
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
      const url = isEdit ? `/api/produtos-manuais/${editingManualId}` : '/api/produtos-manuais';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm)
      });
      if (res.ok) {
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
        const listRes = await adminFetch('/api/produtos-manuais');
        if (listRes.ok) setManualProdutos(await listRes.json());
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || 'Erro ao salvar produto.');
      }
    } catch (err) {
      setErrorMsg('Erro de rede ao salvar produto.');
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
      const res = await adminFetch(`/api/produtos-manuais/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Produto excluído com sucesso!');
        const listRes = await adminFetch('/api/produtos-manuais');
        if (listRes.ok) setManualProdutos(await listRes.json());
      } else {
        setErrorMsg('Erro ao excluir produto.');
      }
    } catch (err) {
      setErrorMsg('Erro de rede ao excluir produto.');
    } finally {
      setManualLoading(false);
    }
  };

    const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (activeTab === 'coupons') {
        const [admRes, coupRes] = await Promise.all([
          adminFetch('/api/admin/sys-admins'),
          adminFetch('/api/admin/coupons')
        ]);
        if (admRes.ok) setSysAdmins(await admRes.json());
        if (coupRes.ok) setCoupons(await coupRes.json());
      } else if (activeTab === 'users') {
        const res = await adminFetch('/api/admin/users');
        if (res.ok) setUsers(await res.json());
      } else if (activeTab === 'produtos') {
        const res = await adminFetch('/api/admin/produtos-alta');
        if (res.ok) setProdutosAlta(await res.json());
      } else if (activeTab === 'produtos_manuais') {
        const res = await adminFetch('/api/produtos-manuais');
        if (res.ok) setManualProdutos(await res.json());
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

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()) || u.name.toLowerCase().includes(userSearch.toLowerCase()));

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
                onClick={() => setActiveTab('coupons')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'coupons' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <ShieldAlert className="w-4 h-4" />
                Cadastros & Checkouts
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'users' ? 'bg-[#25F4EE]/10 text-[#25F4EE] border border-[#25F4EE]/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <Users className="w-4 h-4" />
                Base de Usuários
              </button>
              <button
                onClick={() => setActiveTab('produtos')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${activeTab === 'produtos' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-[#8888AA] hover:text-white hover:bg-white/5'}`}
              >
                <Flame className="w-4 h-4" />
                Produtos em Alta
              </button>
              <button
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
          
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Tag className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadastros e Checkouts</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Adicione administradores, gerencie links de checkout e vincule cupons de indicação (40% OFF) ou de presente (Kit Premium).
                  </p>
                </div>
              </div>

              {/* QUICK GENERATE PRESENTE */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Geração Rápida de Cupom Presente (Lives)
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={quickPresenteCode}
                    onChange={(e) => setQuickPresenteCode(e.target.value.toUpperCase())}
                    placeholder="DIGITE O CODIGO"
                    className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={async () => {
                      if (!quickPresenteCode) return alert('Digite um código');
                      try {
                        const res = await adminFetch('/api/admin/coupons', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            codigo: quickPresenteCode,
                            admin_id: profile?.id || 'admin-1',
                            tipo: 'presente',
                            ativo: true
                          })
                        });
                        if (res.ok) {
                          setSuccessMsg('Cupom Presente gerado com sucesso!');
                          setQuickPresenteCode('');
                          loadData();
                        } else {
                          setErrorMsg('Erro ao gerar cupom.');
                        }
                      } catch(e) {
                        setErrorMsg('Erro de rede.');
                      }
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Gerar e Ativar Agora
                  </button>
                </div>
              </div>

              {/* Admins Table */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                  <h3 className="text-sm font-bold text-white">Administradores e Associados</h3>
                  <button
                    onClick={() => {
                      setEditingAdminId(null);
                      setAdminFormData({ nome: '', email: '', checkout_url: '', is_associado: false, status: true });
                      setShowAdminForm(true);
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Novo Admin
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4 text-xs text-[#8888AA]">Buscando...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#8888AA]">
                      <thead>
                        <tr className="border-b border-[#1E1E2E] text-white">
                          <th className="pb-3 pr-2">Nome</th>
                          <th className="pb-3 pr-2">Email</th>
                          <th className="pb-3 pr-2">Checkout URL</th>
                          <th className="pb-3 pr-2">Tipo</th>
                          <th className="pb-3 pr-2">Status</th>
                          <th className="pb-3 pr-2 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E2E]/60 text-[#F0F0FF]">
                        {sysAdmins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-[#1E1E2E]/20">
                            <td className="py-2 pr-2 font-bold">{admin.nome}</td>
                            <td className="py-2 pr-2 font-mono text-purple-300">{admin.email}</td>
                            <td className="py-2 pr-2 font-mono text-[10px] text-zinc-500 truncate max-w-[150px]">{admin.checkout_url}</td>
                            <td className="py-2 pr-2">
                              {admin.is_associado ? (
                                <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Associado</span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">Fundador</span>
                              )}
                            </td>
                            <td className="py-2 pr-2">
                              {admin.status ? (
                                <span className="text-emerald-400">Ativo</span>
                              ) : (
                                <span className="text-rose-400">Inativo</span>
                              )}
                            </td>
                            <td className="py-2 pr-2 text-right">
                              <button
                                onClick={() => {
                                  setEditingAdminId(admin.id);
                                  setAdminFormData({
                                    nome: admin.nome,
                                    email: admin.email,
                                    checkout_url: admin.checkout_url || '',
                                    is_associado: admin.is_associado,
                                    status: admin.status
                                  });
                                  setShowAdminForm(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 text-[10px] underline mr-2"
                              >
                                Editar
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm("Excluir admin?")) {
                                    await adminFetch(`/api/admin/sys-admins/${admin.id}`, { method: 'DELETE' });
                                    loadData();
                                  }
                                }}
                                className="text-rose-400 hover:text-rose-300 text-[10px] underline"
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                        ))}
                        {sysAdmins.length === 0 && (
                          <tr><td colSpan={6} className="py-4 text-center text-xs">Nenhum admin cadastrado.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Coupons Table */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                  <h3 className="text-sm font-bold text-white">Cupons Vinculados</h3>
                  <button
                    onClick={() => {
                      setEditingCouponId(null);
                      setCouponFormData({ codigo: '', admin_id: sysAdmins[0]?.id || '', tipo: 'indicacao', ativo: true });
                      setShowCouponForm(true);
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Novo Cupom
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4 text-xs text-[#8888AA]">Buscando...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#8888AA]">
                      <thead>
                        <tr className="border-b border-[#1E1E2E] text-white">
                          <th className="pb-3 pr-2">Código</th>
                          <th className="pb-3 pr-2">Tipo</th>
                          <th className="pb-3 pr-2">Admin Dono</th>
                          <th className="pb-3 pr-2">Status</th>
                          <th className="pb-3 pr-2 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E2E]/60 text-[#F0F0FF]">
                        {coupons.map((coupon) => {
                          const admin = sysAdmins.find(a => a.id === coupon.admin_id);
                          return (
                            <tr key={coupon.id} className="hover:bg-[#1E1E2E]/20">
                              <td className="py-2 pr-2 font-bold font-mono text-emerald-400">{coupon.codigo}</td>
                              <td className="py-2 pr-2">
                                {coupon.tipo === 'indicacao' ? (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 uppercase font-bold">40% OFF</span>
                                ) : (
                                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 uppercase font-bold">Presente (Premium)</span>
                                )}
                              </td>
                              <td className="py-2 pr-2 font-mono text-xs">{admin?.nome || 'Desconhecido'}</td>
                              <td className="py-2 pr-2">
                                {coupon.ativo ? (
                                  <span className="text-emerald-400">Ativo</span>
                                ) : (
                                  <span className="text-rose-400">Inativo</span>
                                )}
                              </td>
                              <td className="py-2 pr-2 text-right">
                                <button
                                  onClick={async () => {
                                    if (confirm("Excluir cupom?")) {
                                      await adminFetch(`/api/admin/coupons/${coupon.id}`, { method: 'DELETE' });
                                      loadData();
                                    }
                                  }}
                                  className="text-rose-400 hover:text-rose-300 text-[10px] underline"
                                >
                                  Excluir
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {coupons.length === 0 && (
                          <tr><td colSpan={5} className="py-4 text-center text-xs">Nenhum cupom cadastrado.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
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
                      <input
                        type="url"
                        value={manualForm.imagem_url}
                        onChange={(e) => setManualForm({ ...manualForm, imagem_url: e.target.value })}
                        placeholder="Ex: https://link-da-foto.com/imagem.jpg"
                        className="bg-[#0C0C12] border border-[#1E1E2E] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
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
                        <th className="pb-3 pr-2">Usuário</th>
                        <th className="pb-3 pr-2">Email</th>
                        <th className="pb-3 pr-2">Plano</th>
                        <th className="pb-3 pr-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E2E]/60 text-[#F0F0FF]">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#1E1E2E]/20">
                          <td className="py-2 pr-2 font-bold">{user.name}</td>
                          <td className="py-2 pr-2 font-mono text-purple-300">{user.email}</td>
                          <td className="py-2 pr-2 uppercase font-bold text-[10px]">{user.plan}</td>
                          <td className="py-2 pr-2">
                            {user.role === 'admin' ? (
                              <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">Admin</span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-500/10 text-zinc-400 rounded border border-zinc-500/20">Client</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">
              {editingAdminId ? 'Editar Admin/Associado' : 'Novo Admin/Associado'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider mb-1 block">Nome</label>
                <input
                  type="text"
                  value={adminFormData.nome}
                  onChange={(e) => setAdminFormData({ ...adminFormData, nome: e.target.value })}
                  className="w-full bg-[#0C0C12] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider mb-1 block">E-mail</label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  className="w-full bg-[#0C0C12] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider mb-1 block">Checkout URL (Applyfy/Kiwify)</label>
                <input
                  type="url"
                  value={adminFormData.checkout_url}
                  onChange={(e) => setAdminFormData({ ...adminFormData, checkout_url: e.target.value })}
                  className="w-full bg-[#0C0C12] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="https://pay.kiwify.com.br/..."
                />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={adminFormData.is_associado}
                    onChange={(e) => setAdminFormData({ ...adminFormData, is_associado: e.target.checked })}
                    className="rounded bg-[#1E1E2E] border-transparent focus:ring-emerald-500 text-emerald-500"
                  />
                  É Associado?
                </label>
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={adminFormData.status}
                    onChange={(e) => setAdminFormData({ ...adminFormData, status: e.target.checked })}
                    className="rounded bg-[#1E1E2E] border-transparent focus:ring-emerald-500 text-emerald-500"
                  />
                  Ativo?
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-[#1E1E2E]">
              <button
                onClick={() => setShowAdminForm(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    const method = editingAdminId ? 'PUT' : 'POST';
                    const url = editingAdminId ? `/api/admin/sys-admins/${editingAdminId}` : '/api/admin/sys-admins';
                    const res = await adminFetch(url, {
                      method,
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(adminFormData)
                    });
                    if (res.ok) {
                      setShowAdminForm(false);
                      loadData();
                      setSuccessMsg('Admin salvo com sucesso!');
                    } else {
                      setErrorMsg('Erro ao salvar admin.');
                    }
                  } catch (e) {
                    setErrorMsg('Erro de rede.');
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Novo Cupom</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider mb-1 block">Código</label>
                <input
                  type="text"
                  value={couponFormData.codigo}
                  onChange={(e) => setCouponFormData({ ...couponFormData, codigo: e.target.value.toUpperCase() })}
                  className="w-full bg-[#0C0C12] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider mb-1 block">Admin/Associado Dono</label>
                <select
                  value={couponFormData.admin_id}
                  onChange={(e) => setCouponFormData({ ...couponFormData, admin_id: e.target.value })}
                  className="w-full bg-[#0C0C12] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="" disabled>Selecione um dono...</option>
                  {sysAdmins.map(a => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider mb-1 block">Tipo do Cupom</label>
                <select
                  value={couponFormData.tipo}
                  onChange={(e) => setCouponFormData({ ...couponFormData, tipo: e.target.value })}
                  className="w-full bg-[#0C0C12] border border-[#1E1E2E] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="indicacao">Indicação (40% OFF)</option>
                  <option value="presente">Presente (Kit Premium)</option>
                </select>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-white">
                  <input
                    type="checkbox"
                    checked={couponFormData.ativo}
                    onChange={(e) => setCouponFormData({ ...couponFormData, ativo: e.target.checked })}
                    className="rounded bg-[#1E1E2E] border-transparent focus:ring-emerald-500 text-emerald-500"
                  />
                  Ativo?
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-[#1E1E2E]">
              <button
                onClick={() => setShowCouponForm(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await adminFetch('/api/admin/coupons', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(couponFormData)
                    });
                    if (res.ok) {
                      setShowCouponForm(false);
                      loadData();
                      setSuccessMsg('Cupom criado com sucesso!');
                    } else {
                      setErrorMsg('Erro ao criar cupom.');
                    }
                  } catch (e) {
                    setErrorMsg('Erro de rede.');
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
