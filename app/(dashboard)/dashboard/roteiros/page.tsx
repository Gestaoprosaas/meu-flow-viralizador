"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  FileText, 
  History, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import ScriptForm from '../../../../components/roteiros/ScriptForm';
import GenerationLoading from '../../../../components/roteiros/GenerationLoading';
import ScriptResult from '../../../../components/roteiros/ScriptResult';
import UpgradeModal from '../../../../components/dashboard/UpgradeModal';
import { useCredits } from '../../../../hooks/useCredits';
import { createClient } from '../../../../lib/supabase/client';

export default function RoteirosPage() {
  const router = useRouter();
  const { credits, refetch: refetchCredits } = useCredits();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Load user previous generation logs
  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('script_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Falha ao buscar histórico de roteiros:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  const handleGenerateScript = async (formData: any) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erro ao gerar roteiro.');
      }

      setResult(data.script);
      triggerToast('Roteiro viral criado e registrado com sucesso!', 'success');
      refetchCredits();
      fetchHistory();

    } catch (err: any) {
      console.error('Erro na requisição de cópias:', err);
      triggerToast(err.message || 'Houve um erro de processamento na inteligência artificial.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLibrary = async () => {
    // Already saved to script_generations in the backend!
    triggerToast('Roteiro salvo na sua biblioteca principal!', 'success');
  };

  const handleUseForVideo = () => {
    // Redirection parameter to make the flow completely immersive
    triggerToast('Preparando roteiro para conversão... Redirecionando!', 'success');
    setTimeout(() => {
      router.push(`/dashboard/videos?scriptId=${result?.id || 'new'}`);
    }, 1500);
  };

  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente excluir este roteiro do seu histórico?')) return;

    try {
      const { error } = await supabase
        .from('script_generations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      triggerToast('Roteiro excluído do histórico.', 'success');
      fetchHistory();
      if (result && result.id === id) {
        setResult(null);
      }
    } catch (err: any) {
      console.error('Erro ao deletar roteiro:', err);
      triggerToast('Falha ao excluir roteiro.', 'error');
    }
  };

  const handleSelectHistoryItem = (item: any) => {
    setResult({
      id: item.id,
      productName: item.product_name,
      hook: item.hook,
      scriptBody: item.script_body,
      cta: item.cta,
      variations: {
        alternate_hook_1: item.variations?.[0]?.hook || item.variations?.alternate_hook_1 || '',
        alternate_cta_1: item.variations?.[0]?.cta || item.variations?.alternate_cta_1 || '',
        alternate_hook_2: item.variations?.[1]?.hook || item.variations?.alternate_hook_2 || ''
      },
      platform: item.platform || 'tiktok'
    });
    // Scroll smoothly to top results
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast('Roteiro carregado do histórico.', 'success');
  };

  return (
    <div className="space-y-8 pb-12 relative animate-fade-in">
      
      {/* Toast Notification Banner Popup */}
      {toast.type && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border transition-all duration-300 transform scale-100 flex items-center gap-3 max-w-sm ${
          toast.type === 'success' 
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/15 border-red-500/30 text-red-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
        </div>
      )}

      {/* Header Description */}
      <div className="space-y-1">
        <span className="flex items-center gap-1.5 text-xs text-[#7C3AED] font-black uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          Inteligência Artificial de Conversão
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
          Roteirista de Vídeos <span className="text-[#7C3AED]">Virais</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">
          Gere scripts persuasivos focados no algoritmo de recomendação do TikTok Shop utilizando a metodologia AIDA.
        </p>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Fill Form Panel */}
        <div className="lg:col-span-1 space-y-4">
          <ScriptForm
            onSubmit={handleGenerateScript}
            loading={loading}
            creditsLeft={credits?.textLimit ? credits.textLimit - credits.textUsed : 10}
            onInsufficientCredits={() => setUpgradeOpen(true)}
          />
        </div>

        {/* Results Workspace Panel */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <GenerationLoading />
          ) : result ? (
            <ScriptResult
              productName={result.productName}
              hook={result.hook}
              scriptBody={result.scriptBody}
              cta={result.cta}
              variations={result.variations}
              platform={result.platform}
              onSaveToLibrary={handleSaveToLibrary}
              onUseForVideo={handleUseForVideo}
            />
          ) : (
            <div className="bg-[#111118]/80 border border-[#1E1E2E] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[380px]">
              <div className="w-12 h-12 rounded-full bg-[#1A1A24] flex items-center justify-center border border-[#1E1E2E] text-[#8888AA]">
                <Sparkles className="w-6 h-6 text-[#7C3AED] animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-sm font-bold text-white">Pronto para começar!</h4>
                <p className="text-xs text-[#8888AA] leading-relaxed">
                  Insira o nome do seu produto ou oferta de afiliado no formulário ao lado e clique em salvar para que a IA molde sua próxima campanha viral.
                </p>
              </div>
            </div>
          )}

          {/* History List Bottom Panel */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-white">
              <History className="w-4.5 h-4.5 text-[#06B6D4]" />
              <h3 className="font-bold text-sm tracking-tight">Histórico de Roteiros Gerados</h3>
            </div>

            {history.length === 0 ? (
              <div className="p-6 bg-[#111118]/40 border border-[#1E1E2E]/60 rounded-xl text-center">
                <p className="text-[11px] text-[#8888AA]">Você ainda não gerou roteiros nesta conta.</p>
              </div>
            ) : (
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden divide-y divide-[#1E1E2E]/60 shadow-lg">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="p-4 flex items-center justify-between hover:bg-[#1E1E2E]/30 cursor-pointer transition duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8.5 h-8.5 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-white truncate max-w-[200px] sm:max-w-md group-hover:text-[#7C3AED] transition">
                          {item.product_name}
                        </p>
                        <p className="text-[10px] text-[#8888AA] truncate max-w-[180px] sm:max-w-xs mt-0.5 font-mono">
                          Gancho: &ldquo;{item.hook}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-[9px] text-[#8888AA] font-mono">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        className="p-1.5 bg-[#1E1E2E] hover:bg-red-500/10 text-[#8888AA] hover:text-red-400 rounded-lg transition"
                        title="Excluir do Histórico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <UpgradeModal 
        isOpen={upgradeOpen} 
        onClose={() => setUpgradeOpen(false)} 
      />

    </div>
  );
}
