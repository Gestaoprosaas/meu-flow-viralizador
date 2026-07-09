import React, { useState, useEffect } from 'react';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Flame, 
  Check, 
  X,
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';

interface AdminViralManagerProps {
  onRefresh?: () => void;
}

export default function AdminViralManager({ onRefresh }: AdminViralManagerProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [hooks, setHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal templates state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [tempEditingId, setTempEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [tempCategory, setTempCategory] = useState('Novelinha Viral');
  const [tempThumbnail, setTempThumbnail] = useState('');
  const [tempIsActive, setTempIsActive] = useState(true);

  // Modal hooks state
  const [showHookModal, setShowHookModal] = useState(false);
  const [hookEditingId, setHookEditingId] = useState<string | null>(null);
  const [hookCategory, setHookCategory] = useState('Novelinha Viral');
  const [hookText, setHookText] = useState('');
  const [hookExample, setHookExample] = useState('');
  const [hookIsActive, setHookIsActive] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resTemp, resHook] = await Promise.all([
        fetch('/api/viral-templates'),
        fetch('/api/viral-hooks')
      ]);

      if (!resTemp.ok || !resHook.ok) {
        throw new Error("Erro ao obter dados do servidor.");
      }

      const templatesData = await resTemp.json();
      const hooksData = await resHook.json();

      setTemplates(templatesData);
      setHooks(hooksData);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido de sincronia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const handleRealtimeUpdate = (event: any) => {
      fetchAllData();
    };

    window.addEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    };
  }, []);

  // Category list derived from templates to use as options in hook categories
  const categoriesList = Array.from(new Set([
    'Novelinha Viral', 
    'Objetos Falantes', 
    'Polêmicas / Curiosidades', 
    'Menina da Roça', 
    'Dancinhas',
    ...templates.map((t: any) => t.category)
  ])).filter(Boolean);

  // Template Handlers
  const handleOpenTemplateModal = (editingTemplate?: any) => {
    if (editingTemplate) {
      setTempEditingId(editingTemplate.id);
      setTempTitle(editingTemplate.title);
      setTempDescription(editingTemplate.description);
      setTempCategory(editingTemplate.category);
      setTempThumbnail(editingTemplate.thumbnail_url);
      setTempIsActive(editingTemplate.is_active);
    } else {
      setTempEditingId(null);
      setTempTitle('');
      setTempDescription('');
      setTempCategory('Novelinha Viral');
      setTempThumbnail('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600');
      setTempIsActive(true);
    }
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTitle || !tempDescription || !tempCategory || !tempThumbnail) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const url = tempEditingId ? `/api/viral-templates/${tempEditingId}` : '/api/viral-templates';
      const method = tempEditingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tempTitle,
          description: tempDescription,
          category: tempCategory,
          thumbnail_url: tempThumbnail,
          is_active: tempIsActive
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar o template viral.");
      }

      setShowTemplateModal(false);
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || "Erro ao salvar informações");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este template? Isso também removerá ganchos interconectados por categoria.")) {
      return;
    }

    try {
      const response = await fetch(`/api/viral-templates/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error("Erro ao apagar template.");
      }
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || "Não foi possível remover.");
    }
  };

  const handleReorderTemplate = async (id: string, direction: 'up' | 'down') => {
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === templates.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedList = [...templates];
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = temp;

    // Resave orders
    const payload = reorderedList.map((item, idx) => ({
      id: item.id,
      order_position: idx + 1
    }));

    try {
      const res = await fetch('/api/viral-templates/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: payload })
      });

      if (!res.ok) {
        throw new Error("Erro de ordenação");
      }
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("Não foi possível reordenar");
    }
  };

  // Hook Handlers
  const handleOpenHookModal = (editingHook?: any) => {
    if (editingHook) {
      setHookEditingId(editingHook.id);
      setHookCategory(editingHook.template_category);
      setHookText(editingHook.hook_text);
      setHookExample(editingHook.example_line);
      setHookIsActive(editingHook.is_active);
    } else {
      setHookEditingId(null);
      setHookCategory(tempCategory || 'Novelinha Viral');
      setHookText('');
      setHookExample('');
      setHookIsActive(true);
    }
    setShowHookModal(true);
  };

  const handleSaveHook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookCategory || !hookText || !hookExample) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const url = hookEditingId ? `/api/viral-hooks/${hookEditingId}` : '/api/viral-hooks';
      const method = hookEditingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_category: hookCategory,
          hook_text: hookText,
          example_line: hookExample,
          is_active: hookIsActive
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar o gancho viral.");
      }

      setShowHookModal(false);
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || "Erro de gravação do gancho.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHook = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar este gancho de perfil?")) return;

    try {
      const res = await fetch(`/api/viral-hooks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Erro ao remover");
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || "Erro de conexão.");
    }
  };

  const toggleTemplateActive = async (editingTemplate: any) => {
    try {
      await fetch(`/api/viral-templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !editingTemplate.is_active })
      });
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHookActive = async (editingHook: any) => {
    try {
      await fetch(`/api/viral-hooks/${editingHook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !editingHook.is_active })
      });
      fetchAllData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FE2C55]" />
            Gerenciador da Biblioteca Viralizante ("Viralizar Perfil")
          </h2>
          <p className="text-xs text-[#8888AA] mt-1">
            Controle e configure os formatos de vídeo, categorias, e os ganchos (Hooks) falantes do simulador de crescimento de seguidores.
          </p>
        </div>
        <button 
          onClick={fetchAllData}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 border border-[#1E1E2E] rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#25F4EE] ${loading ? 'animate-spin' : ''}`} />
          Sincronizar Dados
        </button>
      </div>

      {error && (
        <div className="bg-red-950/25 border border-red-800 text-red-300 p-4 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Grid of Templates & Hooks panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* TEMPLATES LIST COLUMN */}
        <div className="xl:col-span-7 bg-[#0A0A0F]/60 border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#25F4EE]" />
              <h3 className="text-sm font-extrabold text-white">Formatos / Templates</h3>
            </div>
            <button
              onClick={() => handleOpenTemplateModal()}
              className="px-3 py-1.5 bg-[#FE2C55] hover:bg-[#FE1E4E] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Formato
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {templates.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#666688] font-bold">
                Nenhum template cadastrado no momento.
              </div>
            ) : (
              templates.map((temp, index) => (
                <div 
                  key={temp.id}
                  className={`p-3 bg-[#030307] border rounded-xl flex items-center justify-between gap-4 transition ${
                    temp.is_active ? 'border-[#1E1E2E]' : 'border-zinc-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageWithSkeleton 
                      src={temp.thumbnail_url} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded-lg border border-[#1E1E2E]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{temp.title}</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-black text-[#8888AA]">
                          {temp.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8888AA] line-clamp-2 mt-1 leading-normal max-w-sm">
                        {temp.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#0A0A0F] border border-[#1E1E2E] p-1.5 rounded-xl">
                    <button
                      onClick={() => handleReorderTemplate(temp.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorderTemplate(temp.id, 'down')}
                      disabled={index === templates.length - 1}
                      className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-[#1E1E2E]" />
                    <button
                      onClick={() => toggleTemplateActive(temp)}
                      className={`p-1 rounded ${temp.is_active ? 'text-[#25F4EE]' : 'text-zinc-600'}`}
                      title={temp.is_active ? "Desativar" : "Ativar"}
                    >
                      {temp.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenTemplateModal(temp)}
                      className="p-1 hover:bg-zinc-800 text-amber-500 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(temp.id)}
                      className="p-1 hover:bg-zinc-800 text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HOOK LINES LIST COLUMN */}
        <div className="xl:col-span-5 bg-[#0A0A0F]/60 border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FE2C55]" />
              <h3 className="text-sm font-extrabold text-white">Ganchos (Hooks)</h3>
            </div>
            <button
              onClick={() => handleOpenHookModal()}
              className="px-3 py-1.5 bg-[#25F4EE]/10 hover:bg-[#25F4EE]/20 border border-[#25F4EE]/30 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#25F4EE]" />
              Adicionar Gancho
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {hooks.length === 0 ? (
              <div className="p-10 text-center text-xs text-[#666688] font-bold">
                Nenhum gancho configurado ainda.
              </div>
            ) : (
              hooks.map((hk) => (
                <div 
                  key={hk.id}
                  className={`p-3 bg-[#030307] border rounded-xl flex flex-col gap-2.5 transition ${
                    hk.is_active ? 'border-[#1E1E2E]' : 'border-zinc-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-[#1E1E2E] pb-1.5">
                    <div>
                      <span className="text-xs font-extrabold text-white">{hk.hook_text}</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-black text-[#FE2C55]">
                        {hk.template_category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleHookActive(hk)}
                        className={`p-1 rounded ${hk.is_active ? 'text-[#25F4EE]' : 'text-zinc-600'}`}
                      >
                        {hk.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleOpenHookModal(hk)}
                        className="p-1 hover:bg-zinc-800 text-amber-500 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHook(hk.id)}
                        className="p-1 hover:bg-zinc-800 text-red-500 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-zinc-500 block uppercase mb-0.5">Texto Falado (PT-BR)</span>
                    <p className="text-[10px] text-emerald-400 italic font-mono leading-relaxed bg-zinc-950 p-2 border border-zinc-900 rounded-lg">
                      "{hk.example_line}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* TEMPLATE EDIT MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-[#1E1E2E] flex justify-between items-center">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FE2C55]" />
                {tempEditingId ? 'Editar Formato Viral' : 'Criar Novo Formato Viral'}
              </h4>
              <button onClick={() => setShowTemplateModal(false)} className="text-[#8888AA] hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">Título do Formato *</label>
                <input 
                  type="text" 
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Ex: Menina da Roça, Polêmicas, etc"
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">Categoria de Correspondência *</label>
                <select
                  value={tempCategory}
                  onChange={(e) => setTempCategory(e.target.value)}
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                >
                  <option value="Novelinha Viral">Novelinha Viral</option>
                  <option value="Objetos Falantes">Objetos Falantes</option>
                  <option value="Polêmicas / Curiosidades">Polêmicas / Curiosidades</option>
                  <option value="Menina da Roça">Menina da Roça</option>
                  <option value="Dancinhas">Dancinhas</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">URL da Thumbnail do Layout *</label>
                <input 
                  type="text" 
                  value={tempThumbnail}
                  onChange={(e) => setTempThumbnail(e.target.value)}
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">Breve Descrição do Formato * (Até 2 linhas)</label>
                <textarea 
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  placeholder="Instruções para chamar atenção e reter..."
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE] h-16 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="chk-temp-active"
                  checked={tempIsActive}
                  onChange={(e) => setTempIsActive(e.target.checked)}
                  className="rounded border-[#1E1E2E] bg-[#030307] text-[#FE2C55] focus:ring-0"
                />
                <label htmlFor="chk-temp-active" className="text-xs text-[#8888AA] font-bold cursor-pointer">
                  Disponibilizar este formato imediatamente para os usuários
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#1E1E2E] pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 hover:bg-zinc-900 border border-[#1E1E2E] text-white rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#FE2C55] hover:bg-[#FE1E4E] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5"
                >
                  {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Salvar Formato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HOOK EDIT MODAL */}
      {showHookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-[#1E1E2E] flex justify-between items-center">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#25F4EE]" />
                {hookEditingId ? 'Editar Gancho de Roteiro' : 'Adicionar Novo Gancho de Roteiro'}
              </h4>
              <button onClick={() => setShowHookModal(false)} className="text-[#8888AA] hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHook} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">Formato / Categoria correspondente *</label>
                <select
                  value={hookCategory}
                  onChange={(e) => setHookCategory(e.target.value)}
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                >
                  {categoriesList.map((catOpt) => (
                    <option key={catOpt} value={catOpt}>{catOpt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">Título/Tipo do Gancho *</label>
                <input 
                  type="text" 
                  value={hookText}
                  onChange={(e) => setHookText(e.target.value)}
                  placeholder="Ex: Provocação e Segredo, Cliffhanger de Suspense..."
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#25F4EE]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8888AA] font-black uppercase block mb-1">Fala / Roteiro Completo (Em PT-BR) *</label>
                <textarea 
                  value={hookExample}
                  onChange={(e) => setHookExample(e.target.value)}
                  placeholder="Ex: Se você curtir e me seguir nos próximos 2 segundos..."
                  className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#25F4EE] h-20 resize-none"
                  required
                />
                <span className="text-[9px] text-[#666688] font-bold block mt-1">Este diálogo será acoplado diretamente na fala dublada do Avatar de IA no ViralSeller.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="chk-hook-active"
                  checked={hookIsActive}
                  onChange={(e) => setHookIsActive(e.target.checked)}
                  className="rounded border-[#1E1E2E] bg-[#030307] text-[#25F4EE] focus:ring-0"
                />
                <label htmlFor="chk-hook-active" className="text-xs text-[#8888AA] font-bold cursor-pointer">
                  Disponibilizar este gancho imediatamente para uso no wizard
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#1E1E2E] pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowHookModal(false)}
                  className="px-4 py-2 hover:bg-zinc-900 border border-[#1E1E2E] text-white rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#25F4EE] hover:bg-[#25F4EE]/80 text-[#050510] rounded-xl text-xs font-black transition flex items-center gap-1.5"
                >
                  {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  Salvar Gancho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
