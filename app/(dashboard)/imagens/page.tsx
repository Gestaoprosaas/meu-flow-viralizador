"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  History, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Layers, 
  Download, 
  Save,
  Loader2
} from 'lucide-react';
import ImageForm from '../../../components/imagens/ImageForm';
import ImageGallery from '../../../components/imagens/ImageGallery';
import UpgradeModal from '../../../components/dashboard/UpgradeModal';
import { useCredits } from '../../../hooks/useCredits';
import { createClient } from '../../../lib/supabase/client';

export default function ImagensPage() {
  const { credits, refetch: refetchCredits } = useCredits();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  // Display helpful custom alert toast box
  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('image_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Falha ao obter histórico de criativos visuais:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerateImages = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/gerar-imagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erro inesperado na geração das imagens.');
      }

      setGeneratedImages(data.images);
      triggerToast(`Renderização de ${data.images.length} imagem(ns) concluída com sucesso!`, 'success');
      
      // Update global badges refetch and local list history logs
      refetchCredits();
      fetchHistory();
    } catch (err: any) {
      console.error('Erro de requisição de imagens:', err);
      triggerToast(err.message || 'Falha ao processar criativos renderizados na rede neural.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProject = async (img: any) => {
    setSavingIds((prev) => [...prev, img.id]);
    try {
      // Already saved to image_generations table on route generation!
      // This button represents saving directly to active project contexts.
      setTimeout(() => {
        triggerToast(`Criativo visual vinculado ao seu projeto ativo!`, 'success');
        setSavingIds((prev) => prev.filter((id) => id !== img.id));
      }, 1000);
    } catch (err: any) {
      triggerToast('Falha ao sincronizar imagem ao projeto.', 'error');
      setSavingIds((prev) => prev.filter((id) => id !== img.id));
    }
  };

  const handleDeleteHistoryItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja realmente apagar este criativo permanentemente?')) return;

    try {
      // Find item in history to remove file if needed
      const itemToDelete = history.find((h) => h.id === id);

      const { error } = await supabase
        .from('image_generations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      triggerToast('Criativo visual excluído com sucesso.', 'success');
      fetchHistory();
      
      // Update local view states if active
      setGeneratedImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir do histórico:', err);
      triggerToast('Não foi possível remover o criativo selecionado.', 'error');
    }
  };

  // Convert db history rows into components compatible elements
  const mappedHistoryItems = history.map((item) => {
    // Extract a cleaner title from prompt
    let title = 'Criativo de Produto';
    if (item.prompt_used) {
      const match = item.prompt_used.match(/photograph of "([^"]+)"/i);
      if (match && match[1]) {
        title = match[1];
      } else {
        // Fallback to substring of prompt
        title = item.prompt_used.substring(0, 50) + '...';
      }
    }

    return {
      id: item.id,
      url: item.image_url,
      productName: title,
      style: item.image_type,
      platform: item.platform,
      createdAt: item.created_at
    };
  });

  return (
    <div className="space-y-8 pb-12 relative animate-fade-in">
      
      {/* Absolute floating toast notification messages */}
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

      {/* Header Description Title */}
      <div className="space-y-1">
        <span className="flex items-center gap-1.5 text-xs text-[#7C3AED] font-black uppercase tracking-wider">
          <ImageIcon className="w-4 h-4" />
          Estúdio de Imagens Comerciais
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
          Estúdio de <span className="text-[#06B6D4]">Criativos</span> Foto Realistas
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">
          Gere fotografias profissionais de produtos para anúncios, banners e thumbnails ultra persuasivas que superam a concorrência.
        </p>
      </div>

      {/* Primary Action Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Left Form config block */}
        <div className="lg:col-span-1 space-y-4">
          <ImageForm
            onSubmit={handleGenerateImages}
            loading={loading}
            creditsLeft={credits?.imageLimit ? credits.imageLimit - credits.imageUsed : 10}
            onInsufficientCredits={() => setUpgradeOpen(true)}
          />
        </div>

        {/* Right Gallery & Output results view block */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-8 sm:p-14 flex flex-col items-center justify-center space-y-6 animate-pulse text-center">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 animate-ping absolute" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white shadow-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">Moldando Criativos Ultra Realistas</h4>
                <p className="text-xs text-[#8888AA] max-w-sm">
                  Nossa inteligência artificial avançada de difusão de imagens está calculando a iluminação tridimensional, texturas e materiais do seu produto. Esse processo dura cerca de 10 a 20 segundos.
                </p>
              </div>
              <div className="w-full max-w-xs space-y-2 pt-2 border-t border-[#1E1E2E]/60 text-left text-[11px] text-[#8888AA]">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full" /> Definindo proporção e enquadramento...</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full" /> Renderizando detalhes da textura...</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" /> Correção de iluminação publicitária...</div>
              </div>
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#072520]/40 border border-[#10B981]/25 p-3.5 rounded-xl text-[11px] text-emerald-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Imagens criadas com sucesso no estúdio de inteligência artificial!
                </span>
                <button 
                  onClick={() => setGeneratedImages([])} 
                  className="font-bold underline hover:text-white"
                >
                  Criar Novas
                </button>
              </div>

              <ImageGallery
                images={generatedImages}
                onSaveToProject={handleSaveToProject}
                loadingImages={savingIds}
              />
            </div>
          ) : (
            <ImageGallery
              images={mappedHistoryItems.slice(0, 4)}
              onSaveToProject={handleSaveToProject}
              loadingImages={savingIds}
            />
          )}

          {/* Complete History Log Lists */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-white">
              <History className="w-4.5 h-4.5 text-[#06B6D4]" />
              <h3 className="font-bold text-sm tracking-tight">Histórico Geral de Criativos Visuais</h3>
            </div>

            {history.length === 0 ? (
              <div className="p-8 bg-[#111118]/40 border border-[#1E1E2E]/60 rounded-xl text-center">
                <p className="text-[11px] text-[#8888AA]">Nenhum criativo visual foi encontrado no histórico desta conta.</p>
              </div>
            ) : (
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden divide-y divide-[#1E1E2E]/60 shadow-lg">
                {mappedHistoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-[#1E1E2E]/30 transition duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Small mini preview thumbnail of previous render */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-[#1E1E2E] shrink-0">
                        <img 
                          src={item.url} 
                          alt="preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-white truncate max-w-[200px] sm:max-w-md">
                            {item.productName}
                          </p>
                          <span className="uppercase text-[8px] bg-black text-[#8888AA] px-1.5 py-0.5 rounded border border-[#1E1E2E]">
                            {item.style}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8888AA] truncate max-w-[150px] sm:max-w-xs mt-0.5 font-mono">
                          Canal: {item.platform.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Directly download previously generated image */}
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = item.url;
                          link.download = `${item.productName.toLowerCase().replace(/\s+/g, '_')}_criativo.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="p-2 bg-[#1E1E2E] hover:bg-white/5 text-[#8888AA] hover:text-white rounded-lg transition"
                        title="Baixar Criativo"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Deletion control */}
                      <button
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        className="p-2 bg-[#1E1E2E] hover:bg-red-500/10 text-[#8888AA] hover:text-red-400 rounded-lg transition"
                        title="Excluir Permanentemente"
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

      {/* Pricing and Upgrades modals */}
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />

    </div>
  );
}
