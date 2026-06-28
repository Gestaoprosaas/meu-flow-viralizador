import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User,
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  DollarSign, 
  Settings, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  ShieldAlert, 
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  RefreshCw,
  Globe,
  Tag,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import ProductImage from './ProductImage';

interface ScreenAdminProps {
  onNavigate: (path: string) => void;
  onRefreshProjectState?: () => void;
  profile?: any;
}

export default function ScreenAdmin({ onNavigate, onRefreshProjectState, profile }: ScreenAdminProps) {
  // Navigation tabs
  type TabType = 'users' | 'subscriptions' | 'generations' | 'products' | 'library' | 'payouts' | 'settings' | 'avatars';
  const [activeTab, setActiveTab ] = useState<TabType>('users');

  // adminFetch helper to automatically inject user session headers
  const adminFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = {
      ...(init?.headers || {}),
      'x-user-email': profile?.email || '',
      'x-user-id': profile?.id || ''
    };
    return fetch(input, {
      ...init,
      headers
    });
  };

  // Multi-tab loading/state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Users state
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('all');
  const [modifyingUserPlan, setModifyingUserPlan] = useState<string | null>(null);

  // 2. Subscriptions state
  const [mrr, setMrr] = useState(0);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // 3. Generations chart state
  const [chartData, setChartData] = useState<any[]>([]);

  // 4. Products CRUD state
  const [products, setProducts] = useState<any[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    niche: '',
    image_url: '',
    opportunity_score: 80,
    competition_level: 'média',
    trend_reason: ''
  });

  // 5. Library CRUD state
  const [libraryList, setLibraryList] = useState<any[]>([]);
  const [showLibraryForm, setShowLibraryForm] = useState(false);
  const [editingLibraryId, setEditingLibraryId] = useState<string | null>(null);
  const [libraryFormData, setLibraryFormData] = useState({
    title: '',
    content: '',
    type: 'hook',
    niche: 'geral',
    emotion: 'curiosidade',
    platform: 'tiktok',
    performance_score: 90
  });

  // 6. Payouts (withdrawing) state
  const [payouts, setPayouts] = useState<any[]>([]);

  // 7. Config state
  const [settings, setSettings] = useState<Record<string, string>>({
    openai_api_key: '',
    kling_api_key: '',
    elevenlabs_api_key: '',
    resend_api_key: '',
    supabase_url: '',
    supabase_anon_key: ''
  });

  // 8. Custom Avatars CRUD state
  const [avatars, setAvatars] = useState<any[]>([]);
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const [avatarFormData, setAvatarFormData] = useState({
    name: '',
    gender: 'FEMININO',
    description: '',
    imageUrl: ''
  });

  const handleCreateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await adminFetch('/api/admin/avatars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avatarFormData)
      });
      if (res.ok) {
        setSuccessMsg('Avatar cadastrado com sucesso!');
        setShowAvatarForm(false);
        setAvatarFormData({ name: '', gender: 'FEMININO', description: '', imageUrl: '' });
        loadTabData('avatars');
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Erro ao cadastrar avatar.');
      }
    } catch (err) {
      setErrorMsg('Erro na requisição ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async (id: string) => {
    if (!confirm('Deseja realmente remover este avatar customizado?')) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await adminFetch(`/api/admin/avatars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Avatar removido com sucesso!');
        loadTabData('avatars');
      } else {
        setErrorMsg('Erro ao remover avatar.');
      }
    } catch (err) {
      setErrorMsg('Erro na requisição ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Load active tab data
  const loadTabData = async (tab: TabType) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (tab === 'users') {
        const res = await adminFetch('/api/admin/users');
        if (res.ok) setUsers(await res.json());
      } else if (tab === 'subscriptions') {
        const res = await adminFetch('/api/admin/subscriptions');
        if (res.ok) {
          const data = await res.json();
          setMrr(data.mrrTotal || 0);
          setSubscriptions(data.subscriptions || []);
        }
      } else if (tab === 'generations') {
        const res = await adminFetch('/api/admin/generations-stats');
        if (res.ok) setChartData(await res.json());
      } else if (tab === 'products') {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
      } else if (tab === 'library') {
        const res = await fetch('/api/viral-library');
        if (res.ok) setLibraryList(await res.json());
      } else if (tab === 'payouts') {
        const res = await adminFetch('/api/admin/payouts');
        if (res.ok) setPayouts(await res.json());
      } else if (tab === 'settings') {
        const res = await adminFetch('/api/admin/settings');
        if (res.ok) setSettings(await res.json());
      } else if (tab === 'avatars') {
        const res = await adminFetch('/api/admin/avatars');
        if (res.ok) setAvatars(await res.json());
      }
    } catch (e) {
      setErrorMsg('Erro de comunicação com o servidor ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData(activeTab);

    const handleRealtimeUpdate = (event: any) => {
      loadTabData(activeTab);
    };

    window.addEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    };
  }, [activeTab]);

  // Actions handler
  // 1. Alter User Plan Manual
  const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const response = await adminFetch('/api/admin/users/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan })
      });
      if (response.ok) {
        setSuccessMsg('Plano alterado com sucesso!');
        setModifyingUserPlan(null);
        loadTabData('users');
        if (onRefreshProjectState) onRefreshProjectState();
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Erro ao alterar plano do usuário.');
      }
    } catch (e) {
      setErrorMsg('Conexão falhou ao alterar plano.');
    }
  };

  // 1b. Alter User Role Manual
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await adminFetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (response.ok) {
        setSuccessMsg('Cargo do usuário alterado com sucesso!');
        setModifyingUserPlan(null);
        loadTabData('users');
        if (onRefreshProjectState) onRefreshProjectState();
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Erro ao alterar cargo do usuário.');
      }
    } catch (e) {
      setErrorMsg('Conexão falhou ao alterar cargo.');
    }
  };

  // 1.2 Payout Approve Option
  const handleApprovePayout = async (id: string) => {
    try {
      const response = await adminFetch(`/api/admin/payouts/${id}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        setSuccessMsg('Saque aprovado e Pix enviado!');
        loadTabData('payouts');
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Erro ao aprovar saque.');
      }
    } catch (e) {
      setErrorMsg('Falha de rede ao aprovar saque.');
    }
  };

  // 2. CRUD Products
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const method = editingProductId ? 'PUT' : 'POST';
      const endpoint = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productFormData)
      });

      if (response.ok) {
        setSuccessMsg(editingProductId ? 'Produto atualizado!' : 'Novo produto adicionado com sucesso!');
        setShowProductForm(false);
        setEditingProductId(null);
        setProductFormData({
          name: '',
          description: '',
          niche: '',
          image_url: '',
          opportunity_score: 80,
          competition_level: 'média',
          trend_reason: ''
        });
        loadTabData('products');
      } else {
        const err = await response.json();
        setErrorMsg(err.error || 'Erro ao salvar produto.');
      }
    } catch (e) {
      setErrorMsg('Erro de conexão ao salvar produto.');
    }
  };

  const handleEditProduct = (prod: any) => {
    setProductFormData({
      name: prod.name,
      description: prod.description,
      niche: prod.niche,
      image_url: prod.image_url,
      opportunity_score: prod.opportunity_score,
      competition_level: prod.competition_level,
      trend_reason: prod.trend_reason
    });
    setEditingProductId(prod.id);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto em alta?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccessMsg('Produto deletado do feed de tendências.');
        loadTabData('products');
      } else {
        setErrorMsg('Erro ao deletar produto.');
      }
    } catch (e) {
      setErrorMsg('Conexão falhou para remoção.');
    }
  };

  // 3. CRUD Library Templates
  const handleSaveLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const method = editingLibraryId ? 'PUT' : 'POST';
      const endpoint = editingLibraryId ? `/api/viral-library/${editingLibraryId}` : '/api/viral-library';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(libraryFormData)
      });

      if (response.ok) {
        setSuccessMsg(editingLibraryId ? 'Fórmula atualizada!' : 'Fórmula cadastrada com sucesso!');
        setShowLibraryForm(false);
        setEditingLibraryId(null);
        setLibraryFormData({
          title: '',
          content: '',
          type: 'hook',
          niche: 'geral',
          emotion: 'curiosidade',
          platform: 'tiktok',
          performance_score: 90
        });
        loadTabData('library');
      } else {
        const err = await response.json();
        setErrorMsg(err.error || 'Erro ao salvar item.');
      }
    } catch (e) {
      setErrorMsg('Erro de conexão com o banco.');
    }
  };

  const handleEditLibrary = (item: any) => {
    setLibraryFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      niche: item.niche,
      emotion: item.emotion,
      platform: item.platform,
      performance_score: item.performance_score
    });
    setEditingLibraryId(item.id);
    setShowLibraryForm(true);
  };

  const handleDeleteLibrary = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta fórmula viral?')) return;
    try {
      const response = await fetch(`/api/viral-library/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccessMsg('Fórmula removida com sucesso!');
        loadTabData('library');
      } else {
        setErrorMsg('Erro ao excluir fórmula.');
      }
    } catch (e) {
      setErrorMsg('Falha de comunicação.');
    }
  };

  // 4. Save API keys
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await adminFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setSuccessMsg('Configurações salvas e chaves sincronizadas na tabela public.settings do Supabase!');
      } else {
        const errorData = await response.json().catch(() => null);
        const errMsg = errorData?.error || errorData?.message || 'Erro ao persistir chaves de API.';
        setErrorMsg(errMsg);
      }
    } catch (e) {
      setErrorMsg('Erro de conexão ao salvar chaves.');
    }
  };

  // User search filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesPlan = userPlanFilter === 'all' || user.plan.toLowerCase() === userPlanFilter.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  const menuItems = [
    { id: 'users', label: 'Lista de Usuários', icon: Users },
    { id: 'subscriptions', label: 'Monitor de Assinaturas', icon: CreditCard },
    { id: 'generations', label: 'Estatísticas de Criação', icon: BarChart3 },
    { id: 'products', label: 'CRUD Produtos em Alta', icon: TrendingUp },
    { id: 'library', label: 'CRUD Biblioteca de Copias', icon: BookOpen },
    { id: 'avatars', label: 'CRUD Avatares Customizados', icon: User },
    { id: 'payouts', label: 'Aprovar Saques (PIX)', icon: DollarSign },
    { id: 'settings', label: 'Chaves de API / Supabase', icon: Settings }
  ];

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in" id="admin-panel-viewport">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#1E1E2E] pb-5">
        <div>
          <span className="text-[10px] text-purple-400 font-extrabold uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
            Admin Area (Role: admin)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 mt-1">
            <ShieldAlert className="w-7 h-7 text-red-500" />
            Painel de Controle Administrador
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Gestão de planos, análise financeira de MRR, monitoramento técnico de IA, CRUDs de produtos e saques de afiliados.</p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2 bg-[#12121A] hover:bg-[#1E1E30] text-xs sm:text-sm font-bold rounded-xl transition border border-[#1E1E2E] cursor-pointer self-start sm:self-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao App
        </button>
      </div>

      {/* Main Grid Menu vs Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Sidebar Menu */}
        <div className="xl:col-span-3 bg-[#111118]/90 border border-[#1E1E2E] rounded-xl p-2.5 space-y-4 shrink-0">
          
          {/* Section 1: Usuários & Financeiro */}
          <div>
            <div className="px-3 py-1 text-[10px] font-black uppercase text-purple-400 tracking-wider border-b border-[#1E1E2E]/60 mb-1.5">
              Usuários & Financeiro
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Users className={`w-4 h-4 shrink-0 ${activeTab === 'users' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Lista de Usuários</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Gestão de acessos</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'subscriptions'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'subscriptions' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Monitor de Assinaturas</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Métricas de MRR</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('payouts')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'payouts'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <DollarSign className={`w-4 h-4 shrink-0 ${activeTab === 'payouts' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Aprovar Saques (PIX)</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Repasses de afiliados</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>
            </div>
          </div>

          {/* Section 2: Acervo do Criador */}
          <div>
            <div className="px-3 py-1 text-[10px] font-black uppercase text-cyan-400 tracking-wider border-b border-[#1E1E2E]/60 mb-1.5">
              Curadoria & Conteúdo
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <TrendingUp className={`w-4 h-4 shrink-0 ${activeTab === 'products' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Produtos em Alta</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Vitrine e preços</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'library'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'library' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Biblioteca de Cópias</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Fórmulas e roteiros</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('avatars')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'avatars'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <User className={`w-4 h-4 shrink-0 ${activeTab === 'avatars' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Avatares Customizados</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Modelos do gerador</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>
            </div>
          </div>

          {/* Section 3: Monitoramento & APIs */}
          <div>
            <div className="px-3 py-1 text-[10px] font-black uppercase text-pink-400 tracking-wider border-b border-[#1E1E2E]/60 mb-1.5">
              Monitoramento & APIs
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab('generations')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'generations'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'generations' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Estatísticas de Criação</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Histórico de vídeos</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-purple-950/40 to-purple-800/15 text-white border-l-2 border-purple-500'
                    : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-purple-500' : 'text-[#8888AA]'}`} />
                  <div>
                    <span className="block font-bold">Chaves de API / Supabase</span>
                    <span className="text-[9px] text-[#8888AA] font-normal hidden xl:block">Credenciais globais</span>
                  </div>
                </div>
                <ChevronRight className="w-3 h-3 text-[#555577] shrink-0" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Side Work Area */}
        <div className="xl:col-span-9 space-y-4">
          
          {/* Notifications logs */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-start gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Module 1: Users Page */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-900/10 via-purple-950/5 to-transparent border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Controle de Usuários Cadastrados</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Gerencie todos os perfis registrados na plataforma. Você pode buscar por nome ou email, filtrar por plano ativo, alterar manualmente os limites de plano de cada conta ou conceder privilégios de Administrador.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Base de Usuários Cadastrados ({filteredUsers.length})
                </h3>
                
                {/* Search / filter controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#666688]" />
                    <input
                      type="text"
                      placeholder="Pesquisar por nome, email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-[#0C0C12] border border-[#1E1E2E] rounded-lg text-xs focus:outline-none focus:border-purple-500 w-44"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#0C0C12] border border-[#1E1E2E] px-2 py-1.5 rounded-lg text-xs">
                    <Filter className="w-3 h-3 text-[#666688]" />
                    <select
                      value={userPlanFilter}
                      onChange={(e) => setUserPlanFilter(e.target.value)}
                      className="bg-transparent focus:outline-none text-[11px] text-[#8888AA]"
                    >
                      <option value="all">Todos Planos</option>
                      <option value="free">Grátis</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro VIP</option>
                      <option value="agency">Agência</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-xs text-[#8888AA]">Buscando perfis...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#8888AA]">
                    <thead>
                      <tr className="border-b border-[#1E1E2E] text-white">
                        <th className="pb-3 pr-2">Criado em</th>
                        <th className="pb-3 pr-2">Nome</th>
                        <th className="pb-3 pr-2">Email</th>
                        <th className="pb-3 pr-2">Plano Atual</th>
                        <th className="pb-3 pr-2">Saldos Crédito (T / I / V)</th>
                        <th className="pb-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E2E]/60 text-xs text-[#F0F0FF]">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#1E1E2E]/20 transition">
                          <td className="py-3 text-[#777799]">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 pr-2 font-bold text-white">
                            {user.name}
                          </td>
                          <td className="py-3 pr-2 font-mono text-purple-300">
                            {user.email}
                          </td>
                          <td className="py-3 pr-2">
                            <div className="flex flex-col gap-1">
                              {user.plan === 'agency' ? (
                                <span className="w-max px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">Agência</span>
                              ) : user.plan === 'pro' ? (
                                <span className="w-max px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">Pro VIP</span>
                              ) : user.plan === 'starter' ? (
                                <span className="w-max px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">Starter</span>
                              ) : (
                                <span className="w-max px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">Grátis</span>
                              )}
                              {user.role === 'admin' ? (
                                <span className="w-max px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">Administrador</span>
                              ) : (
                                <span className="w-max px-1.5 py-0.5 rounded text-[10px] bg-sky-950/45 text-sky-400 border border-sky-900/30 font-semibold">Cliente</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-2 font-mono text-[11px] text-[#A0A0C0]">
                            📝 <strong>{user.credits_text}</strong> / 🖼️ <strong>{user.credits_image}</strong> / 🎬 <strong>{user.credits_video}</strong>
                          </td>
                          <td className="py-3 text-right text-xs">
                            {modifyingUserPlan === user.id ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <div className="flex flex-col gap-1 items-end">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-[#8888AA]">Plano:</span>
                                    <select
                                      disabled={loading}
                                      onChange={(e) => handleUpdateUserPlan(user.id, e.target.value)}
                                      defaultValue={user.plan}
                                      className="bg-[#0C0C12] border border-[#1E1E2E] text-white rounded text-[10px] p-1 font-bold focus:outline-none"
                                    >
                                      <option value="free">Grátis</option>
                                      <option value="starter">Starter</option>
                                      <option value="pro">Pro VIP</option>
                                      <option value="agency">Agência</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-[#8888AA]">Cargo:</span>
                                    <select
                                      disabled={loading}
                                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                      defaultValue={user.role || 'client'}
                                      className="bg-[#0C0C12] border border-[#1E1E2E] text-white rounded text-[10px] p-1 font-bold focus:outline-none"
                                    >
                                      <option value="client">Cliente</option>
                                      <option value="admin">Administrador</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setModifyingUserPlan(null)}
                                  className="p-1 px-2 text-rose-400 hover:text-rose-300 bg-[#1E1E2E] rounded-lg text-xs"
                                >
                                  Fechar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setModifyingUserPlan(user.id)}
                                className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition rounded-lg hover:text-white font-bold text-[10px]"
                              >
                                Editar Conta manual
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
          )}

          {/* Module 2: Subscriptions Page */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-900/10 via-emerald-950/5 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Painel Financeiro & Monitor de Assinaturas</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Acompanhe a receita recorrente mensal (MRR) total estimada do sistema e visualize a lista em tempo real de todas as faturas e assinaturas ativas processadas pelos gateways.
                  </p>
                </div>
              </div>
              
              {/* MRR Top summary card */}
              <div className="bg-[#111118] border border-[#1E1E2E] p-6 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-[#8888AA] font-bold block">MRR Total da Plataforma (Mensal Recorrente)</span>
                  <strong className="text-4xl font-black text-emerald-400 block">R$ {mrr.toFixed(2)}</strong>
                  <span className="text-[10px] text-[#8888AA] block">Faturamento recorrente atual com base nas assinaturas ativas</span>
                 </div>
                 <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                   <TrendingUp className="w-7 h-7 text-emerald-400" />
                 </div>
              </div>

              {/* Subscriptions List */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-3">Histórico de Assinaturas Ativas</h3>
                
                {loading ? (
                  <div className="text-center py-12 text-xs">Aguarde...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#8888AA]">
                      <thead>
                        <tr className="border-b border-[#1E1E2E] text-white">
                          <th className="pb-3 pr-2">ID Assinatura</th>
                          <th className="pb-3 pr-2">Cliente</th>
                          <th className="pb-3 pr-2">Email</th>
                          <th className="pb-3 pr-2">Plano Contratado</th>
                          <th className="pb-3 pr-2">Cobrança Mensal</th>
                          <th className="pb-3 pr-2">Status</th>
                          <th className="pb-3 text-right">Data Início</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E2E]/60 text-xs text-[#F0F0FF]">
                        {subscriptions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-[#1E1E2E]/20 transition">
                            <td className="py-3 pr-2 text-[#777799] font-mono">
                              {sub.id}
                            </td>
                            <td className="py-3 pr-2 font-bold text-white">
                              {sub.user_name}
                            </td>
                            <td className="py-3 pr-2 font-mono text-purple-300">
                              {sub.user_email}
                            </td>
                            <td className="py-3 pr-2">
                              {sub.plan === 'agency' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">Agência</span>
                              ) : sub.plan === 'pro' ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">Pro VIP</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20">Starter</span>
                              )}
                            </td>
                            <td className="py-3 pr-2 text-emerald-400 font-extrabold">
                              R$ {sub.price_brl.toFixed(2)}
                            </td>
                            <td className="py-3 pr-2">
                              <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-extrabold">
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
          )}

          {/* Module 3: Generations chart */}
          {activeTab === 'generations' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-900/10 via-cyan-950/5 to-transparent border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Consumo de IA & Volume de Criações</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Monitore a carga e o volume de requisições de inteligência artificial geradas pelos usuários. Veja os dados de consumo de roteiros de texto, imagens estáticas e renderizações de vídeo.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Consumo e Volume de Geração Diária por Tipo</h3>
                <span className="text-[10px] uppercase text-[#8888AA] font-bold">Últimos 7 dias</span>
              </div>
              
              {loading ? (
                <div className="text-center py-20 text-xs">Carregando dados estatísticos...</div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Recharts chart structure */}
                  <div className="w-full h-80 bg-[#0A0A0F] border border-[#1E1E2E] p-2 rounded-xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#888" tickLine={false} />
                        <YAxis stroke="#888" tickLine={false} />
                        <Tooltip 
                          contentStyle={{ bgStyle: '#111118', background: '#111118', border: '1px solid #1E1E2E', borderRadius: '8px' }} 
                        />
                        <Legend />
                        <Bar dataKey="Roteiros (Texto)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Imagens" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Vídeos" fill="#10B981" radius={[4, 4, 0, 0]} stroke="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/10 text-[11px] text-[#8888AA] leading-relaxed">
                    🌟 <strong>Resumo Técnico:</strong> Os volumes são agregados dinamicamente nos endpoints `/api/roteiros`, `/api/imagens` e `/api/videos`. O pipeline de IA do PROJETO VITÃO mantém fila ativa e estável sem atrasos.
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Module 4: Products CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-rose-900/10 via-rose-950/5 to-transparent border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0">
                  <TrendingUp className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Curadoria de Produtos em Alta (CRUD)</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Gerencie a biblioteca pública de produtos recomendados. Adicione novas tendências de vendas com imagens comerciais, pontuação de oportunidade de mercado (Opportunity Score) e justificativa viral.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-[#1E1E2E] pb-3">
                <h3 className="text-sm font-bold text-white">Controle de Produtos Recomendados em Alta</h3>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setProductFormData({
                      name: '',
                      description: '',
                      niche: '',
                      image_url: '',
                      opportunity_score: 80,
                      competition_level: 'média',
                      trend_reason: ''
                    });
                    setShowProductForm(!showProductForm);
                  }}
                  className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showProductForm ? 'Filtro / Fechar' : 'Adicionar Novo Produto'}
                </button>
              </div>

              {showProductForm && (
                <form onSubmit={handleSaveProduct} className="p-4 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">
                    {editingProductId ? '✏️ Editar Produto' : '👜 Cadastrar Novo Produto Recomendado'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Nome do Produto</label>
                      <input
                        type="text"
                        required
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                        placeholder="Ex: Escovador de Silcone Shopee"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Nicho</label>
                      <input
                        type="text"
                        required
                        value={productFormData.niche}
                        onChange={(e) => setProductFormData({...productFormData, niche: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                        placeholder="Ex: Beleza / Organização"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-[#8888AA]">Descrição Sucinta</label>
                      <textarea
                        required
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white h-16 resize-none"
                        placeholder="Descreva o apelo imediato deste produto..."
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-[#8888AA]">URL Imagem Comercial</label>
                      <input
                        type="url"
                        value={productFormData.image_url}
                        onChange={(e) => setProductFormData({...productFormData, image_url: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Pontuação Oportunidade (0-100)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={productFormData.opportunity_score}
                        onChange={(e) => setProductFormData({...productFormData, opportunity_score: Number(e.target.value)})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Nível de Competição</label>
                      <select
                        value={productFormData.competition_level}
                        onChange={(e) => setProductFormData({...productFormData, competition_level: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                      >
                        <option value="baixa">Baixa</option>
                        <option value="média">Média</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-[#8888AA]">Motivo da Tendência / Projeção Viral</label>
                      <input
                        type="text"
                        value={productFormData.trend_reason}
                        onChange={(e) => setProductFormData({...productFormData, trend_reason: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                        placeholder="Ex: Viralizou no TikTok no Reino Unido hoje"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProductId(null);
                      }}
                      className="px-4 py-2 bg-[#12121A] text-[#8888AA] hover:text-white rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#06B6D4] hover:bg-[#0891B2] text-white rounded-lg font-bold"
                    >
                      Salvar Produto
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <div className="text-center py-12 text-xs">Consultando produtos...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl overflow-hidden flex flex-col justify-between p-4 space-y-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#1E1E2E]">
                          <ProductImage 
                            src={prod.image_url} 
                            alt={prod.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] bg-cyan-500/10 text-cyan-400 font-bold px-1 rounded uppercase">{prod.niche}</span>
                          <h4 className="text-xs font-extrabold text-white">{prod.name}</h4>
                          <p className="text-[10px] text-[#8888AA] line-clamp-2">{prod.description}</p>
                        </div>
                      </div>

                      <div className="border-t border-[#1E1E2E]/60 pt-2 text-[10px] space-y-1.5 text-[#8888AA]">
                        <p>💡 Competição: <strong className="text-white uppercase">{prod.competition_level}</strong></p>
                        <p>🔥 Trend: <span className="text-amber-300 italic">{prod.trend_reason}</span></p>
                      </div>

                      <div className="flex justify-between items-center border-t border-[#1E1E2E]/60 pt-2.5">
                        <span className="text-xs font-extrabold text-cyan-400">Score: {prod.opportunity_score}/100</span>
                        
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="p-1.5 bg-[#1E1E2E] hover:bg-purple-950/40 text-purple-400 rounded-lg transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 bg-[#1E1E2E] hover:bg-rose-950/40 text-rose-400 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Module 5: Library CRUD */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-900/10 via-amber-955/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Biblioteca de Fórmulas de Copywriting (CRUD)</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Customize a biblioteca de roteiros prontos e ganchos de alta performance (Hooks). Modifique nichos, emoções-gatilho principais, pontuação de eficácia histórica e plataformas de destino.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-[#1E1E2E] pb-3">
                <h3 className="text-sm font-bold text-white">Gerenciamento da Biblioteca de Copias (Modelos Virais)</h3>
                <button
                  onClick={() => {
                    setEditingLibraryId(null);
                    setLibraryFormData({
                      title: '',
                      content: '',
                      type: 'hook',
                      niche: 'geral',
                      emotion: 'curiosidade',
                      platform: 'tiktok',
                      performance_score: 90
                    });
                    setShowLibraryForm(!showLibraryForm);
                  }}
                  className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showLibraryForm ? 'Filtro / Fechar' : 'Cadastrar Nova Fórmula'}
                </button>
              </div>

              {showLibraryForm && (
                <form onSubmit={handleSaveLibrary} className="p-4 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">
                    {editingLibraryId ? '✏️ Editar Fórmula' : '📚 Adicionar Nova Fórmula Viral'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Título Principal</label>
                      <input
                        type="text"
                        required
                        value={libraryFormData.title}
                        onChange={(e) => setLibraryFormData({...libraryFormData, title: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                        placeholder="Ex: Gancho da curiosidade absoluta"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Tipo de Fórmula</label>
                      <select
                        value={libraryFormData.type}
                        onChange={(e) => setLibraryFormData({...libraryFormData, type: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                      >
                        <option value="hook">Hook (Gancho de 3s)</option>
                        <option value="script">Roteiro Completo / Corpo</option>
                        <option value="cta">CTA (Chamada para Ação)</option>
                        <option value="caption">Caption (Legenda)</option>
                      </select>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-[#8888AA]">Corpo Literário / Conteúdo da Copy</label>
                      <textarea
                        required
                        value={libraryFormData.content}
                        onChange={(e) => setLibraryFormData({...libraryFormData, content: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white h-24 resize-none"
                        placeholder="Digite os gatilhos, blocos e sugestões de frames..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Nicho focado</label>
                      <select
                        value={libraryFormData.niche}
                        onChange={(e) => setLibraryFormData({...libraryFormData, niche: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                      >
                        <option value="geral">Geral / Amplo</option>
                        <option value="beleza">Beleza & Estética</option>
                        <option value="tecnologia">Infoprodutos & Tecnologia</option>
                        <option value="casa">Casa, Decoração & Cozinha</option>
                        <option value="saude">Saúde, Bem Estar & Treino</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Plataforma Destinada</label>
                      <select
                        value={libraryFormData.platform}
                        onChange={(e) => setLibraryFormData({...libraryFormData, platform: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                      >
                        <option value="tiktok">TikTok</option>
                        <option value="reels">Instagram Reels</option>
                        <option value="youtube_shorts">YouTube Shorts</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-[#8888AA]">Emoção Despertada</label>
                      <input
                        type="text"
                        value={libraryFormData.emotion}
                        onChange={(e) => setLibraryFormData({...libraryFormData, emotion: e.target.value})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                        placeholder="Ex: Medo / Curiosidade / Gananciosa"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA]">Pontuação de Conversão (Score)</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={libraryFormData.performance_score}
                        onChange={(e) => setLibraryFormData({...libraryFormData, performance_score: Number(e.target.value)})}
                        className="w-full bg-[#111118] border border-[#1E1E2E] p-2 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLibraryForm(false);
                        setEditingLibraryId(null);
                      }}
                      className="px-4 py-2 bg-[#12121A] text-[#8888AA] hover:text-white rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-bold"
                    >
                      Salvar Fórmula
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <div className="text-center py-12 text-xs">Aguarde...</div>
              ) : (
                <div className="space-y-2">
                  {libraryList.map(item => (
                    <div key={item.id} className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-lg flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1 select-all">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="bg-purple-500/15 text-purple-400 font-extrabold px-1.5 py-0.5 rounded uppercase">{item.type}</span>
                          <span className="bg-zinc-800 text-[#8888AA] px-1 py-0.2 rounded font-semibold">{item.niche}</span>
                          <span className="text-[#06B6D4] font-bold">🎯 {item.emotion}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[11px] text-[#A0A0B0] bg-[#111118]/60 p-2 rounded font-mono leading-relaxed">{item.content}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                        <span className="text-[10px] font-black text-emerald-400">Score: {item.performance_score}%</span>
                        
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() => handleEditLibrary(item)}
                            className="p-1 bg-[#1E1E2E] hover:bg-purple-950/40 text-purple-400 rounded transition"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteLibrary(item.id)}
                            className="p-1 bg-[#1E1E2E] hover:bg-rose-950/40 text-rose-400 rounded transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Module 6: Approve Payouts */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-900/10 via-emerald-950/5 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Controle Financeiro de Afiliados (PIX Saques)</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Monitore e aprove as solicitações de saques de saldos de comissões acumuladas por afiliados do sistema. Aprove, verifique chaves Pix e confirme envios de transferências manuais ou automatizadas.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Saques Pendentes e Aprovados (Afiliados Parcerias)
              </h3>

              {loading ? (
                <div className="text-center py-12 text-xs">Buscando saques...</div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#8888AA]">Nenhum histórico de saques.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#8888AA]">
                    <thead>
                      <tr className="border-b border-[#1E1E2E] text-white">
                        <th className="pb-3 pr-2">Criado em</th>
                        <th className="pb-3 pr-2">Afiliado</th>
                        <th className="pb-3 pr-2">Chave PIX</th>
                        <th className="pb-3 pr-2">Valor</th>
                        <th className="pb-3 pr-2">Status</th>
                        <th className="pb-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E1E2E]/60 text-xs text-[#F0F0FF]">
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-[#1E1E2E]/10 transition">
                          <td className="py-3 text-[#777799]">
                            {new Date(payout.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 pr-2 font-bold text-white">
                            {payout.user_name}
                            <span className="text-[9px] text-[#8888AA] block">{payout.user_email}</span>
                          </td>
                          <td className="py-3 pr-2 font-mono text-cyan-400">
                            {payout.pix_key}
                          </td>
                          <td className="py-3 pr-2 text-emerald-400 font-extrabold">
                            R$ {payout.amount.toFixed(2)}
                          </td>
                          <td className="py-3 pr-2">
                            {payout.status === 'approved' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Pago (PIX)</span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pendente</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {payout.status === 'pending' ? (
                              <button
                                onClick={() => handleApprovePayout(payout.id)}
                                className="px-3 py-1 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] transition shadow"
                              >
                                Aprovar & Enviar PIX
                              </button>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-bold">Liquidado</span>
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
          )}

          {/* Module 7: Settings Setup */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-900/10 via-purple-950/5 to-transparent border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                  <Key className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Integração de APIs de Produção (Credentials)</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Gerencie as credenciais globais e chaves secretas de produção utilizadas nos canais de IA (OpenAI, ElevenLabs, Kling, Resend, e Supabase). Mantenha as chaves devidamente protegidas e criptografadas.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="border-b border-[#1E1E2E] pb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Configuração de Chaves de API Globais (Sincronizado via Supabase public.settings)</h3>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <p className="text-[11px] text-[#8888AA] leading-relaxed">
                  Estas chaves são criptografadas e persistidas no banco. O servidor as carrega como variáveis de ambiente para fazer requisições seguras para fornecedores descritos na arquitetura (elevenlabs, openai, kling, resend).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">OpenAI API Key</label>
                    <input
                      type="password"
                      value={settings.openai_api_key || ''}
                      onChange={(e) => setSettings({...settings, openai_api_key: e.target.value})}
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">Resend Email API Key</label>
                    <input
                      type="password"
                      value={settings.resend_api_key || ''}
                      onChange={(e) => setSettings({...settings, resend_api_key: e.target.value})}
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">Kling AI Video API Key</label>
                    <input
                      type="password"
                      value={settings.kling_api_key || ''}
                      onChange={(e) => setSettings({...settings, kling_api_key: e.target.value})}
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">ElevenLabs Audio Voice API Key</label>
                    <input
                      type="password"
                      value={settings.elevenlabs_api_key || ''}
                      onChange={(e) => setSettings({...settings, elevenlabs_api_key: e.target.value})}
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 col-span-2 border-t border-[#1E1E2E]/50 pt-3">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Conexão Supabase Postgres</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">Supabase Endpoint URL</label>
                    <input
                      type="text"
                      value={settings.supabase_url || ''}
                      onChange={(e) => setSettings({...settings, supabase_url: e.target.value})}
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 text-slate-200">
                    <label className="text-[#8888AA] block font-semibold">Supabase Anon Public Key</label>
                    <input
                      type="text"
                      value={settings.supabase_anon_key || ''}
                      onChange={(e) => setSettings({...settings, supabase_anon_key: e.target.value})}
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none text-[11px]"
                    />
                  </div>

                  <div className="space-y-1 col-span-2 border-t border-[#1E1E2E]/50 pt-3">
                    <div className="flex items-center gap-1.5 text-pink-400 font-bold mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Configurações Integ. Checkout Gateway AppFly</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">AppFly Monthly Plan URL</label>
                    <input
                      type="text"
                      value={(settings as any).appfly_monthly_url || ''}
                      onChange={(e) => setSettings({...settings, appfly_monthly_url: e.target.value})}
                      placeholder="Ex: https://appfly.com/checkout/monthly"
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#8888AA] block font-semibold">AppFly Lifetime Plan URL</label>
                    <input
                      type="text"
                      value={(settings as any).appfly_lifetime_url || ''}
                      onChange={(e) => setSettings({...settings, appfly_lifetime_url: e.target.value})}
                      placeholder="Ex: https://appfly.com/checkout/lifetime"
                      className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-[#1E1E2E]/40">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 transition rounded-xl font-bold text-white flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    Salvar Chaves no Banco (tabela public.settings)
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}

          {/* Module 8: Manage Custom Avatars */}
          {activeTab === 'avatars' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-pink-900/10 via-pink-950/5 to-transparent border border-pink-500/20 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
                  <User className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Banco de Avatares Customizados (CRUD)</h3>
                  <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                    Insira novos modelos ou avatares humanos personalizados para uso global no gerador de criativos. Defina gêneros (Masculino/Feminino), links de imagens ou retratos comerciais realistas.
                  </p>
                </div>
              </div>

              <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#1E1E2E] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  Gerenciar Avatares Customizados ({avatars.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAvatarForm(!showAvatarForm)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  {showAvatarForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {showAvatarForm ? 'Cancelar' : 'Novo Avatar'}
                </button>
              </div>

              {showAvatarForm && (
                <form onSubmit={handleCreateAvatar} className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 rounded-xl space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[#8888AA] block font-semibold">Nome do Avatar</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Novo Avatar"
                        value={avatarFormData.name}
                        onChange={(e) => setAvatarFormData({ ...avatarFormData, name: e.target.value })}
                        className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#8888AA] block font-semibold">Gênero</label>
                      <select
                        value={avatarFormData.gender}
                        onChange={(e) => setAvatarFormData({ ...avatarFormData, gender: e.target.value })}
                        className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white focus:border-purple-500 pr-8 outline-none animate-none"
                      >
                        <option value="FEMININO" className="bg-[#111118]">FEMININO</option>
                        <option value="MASCULINO" className="bg-[#111118]">MASCULINO</option>
                      </select>
                    </div>

                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[#8888AA] block font-semibold">URL da Imagem de Rosto / Avatar</label>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/photo-... ou URL customizada"
                        value={avatarFormData.imageUrl}
                        onChange={(e) => setAvatarFormData({ ...avatarFormData, imageUrl: e.target.value })}
                        className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white font-mono focus:border-purple-500 focus:outline-none text-[11px]"
                      />
                    </div>

                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="text-[#8888AA] block font-semibold">Descrição / Prompt para Gerador da IA (Em Português)</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Descreva as características físicas e vestuário em detalhes (ex: Loira de casaco branco, olhar para a câmera, fundo de closet desfocado)..."
                        value={avatarFormData.description}
                        onChange={(e) => setAvatarFormData({ ...avatarFormData, description: e.target.value })}
                        className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2.5 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#1E1E2E]/40">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FE2C55] hover:opacity-90 text-white font-black rounded-xl transition flex items-center gap-1 scale-95 hover:scale-100 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar Avatar Customizado
                    </button>
                  </div>
                </form>
              )}

              {loading ? (
                <div className="text-center py-12 text-xs text-[#8888AA] flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
                  <span>Carregando avatares do servidor...</span>
                </div>
              ) : avatars.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#8888AA] bg-[#0A0A0F]/50 border border-[#1E1E2E] rounded-xl p-4">
                  Nenhum avatar customizado cadastrado ainda. Use o botão acima para cadastrar novos modelos livres!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {avatars.map((av) => (
                    <div key={av.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all duration-300">
                      <div>
                        {/* Upper image and metadata */}
                        <div className="relative h-44 bg-zinc-900">
                          <img
                            src={av.imageUrl}
                            alt={av.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                          />
                          <div className="absolute top-2 left-2 bg-black/80 text-[8px] font-black uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${av.gender === 'FEMININO' ? 'bg-pink-500' : 'bg-blue-500'}`} />
                            {av.gender}
                          </div>
                          <span className="absolute bottom-2 right-2 text-[8px] font-mono text-[#666688] bg-black/60 px-1.5 py-0.5 rounded">
                            {av.id}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="p-3.5 text-left space-y-1">
                          <h4 className="text-xs font-black text-white">{av.name}</h4>
                          <p className="text-[10px] text-[#8888AA] leading-relaxed line-clamp-3">
                            {av.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-2.5 bg-[#030307]/50 border-t border-[#1E1E2E]/60 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAvatar(av.id)}
                          className="p-1 px-2 hover:bg-rose-950/20 hover:text-rose-400 text-zinc-500 rounded-lg transition-all text-[10px] flex items-center gap-1 font-bold cursor-pointer"
                          title="Excluir avatar permanentemente"
                        >
                          <Trash2 className="w-3 h-3" /> Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

        </div>

      </div>

    </div>
  );
}
