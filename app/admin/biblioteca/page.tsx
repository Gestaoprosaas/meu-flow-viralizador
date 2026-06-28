"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Shield, Heart } from 'lucide-react';

export default function AdminBibliotecaPage() {
  const [libraryList, setLibraryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'hook',
    niche: 'geral',
    emotion: 'curiosidade',
    platform: 'tiktok',
    performance_score: 90
  });

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/viral-library');
      if (res.ok) setLibraryList(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/viral-library/${editingId}` : '/api/viral-library';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccessMsg(editingId ? 'Fórmula de copy editada com sucesso!' : 'Fórmula integrada na biblioteca!');
        setEditingId(null);
        setShowForm(false);
        setFormData({
          title: '',
          content: '',
          type: 'hook',
          niche: 'geral',
          emotion: 'curiosidade',
          platform: 'tiktok',
          performance_score: 90
        });
        fetchLibrary();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Erro ao salvar item.');
      }
    } catch (e) {
      setErrorMsg('Erro de rede.');
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      niche: item.niche,
      emotion: item.emotion,
      platform: item.platform,
      performance_score: item.performance_score
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta fórmula de copy?')) return;
    try {
      const res = await fetch(`/api/viral-library/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Fórmula removida da lista publicamente!');
        fetchLibrary();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-500" />
            Fórmulas de Copias Virais (CRUD)
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Adicione, edite ou remova ganchos e blocos aceleradores de inteligência artificial.</p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: '',
              content: '',
              type: 'hook',
              niche: 'geral',
              emotion: 'curiosidade',
              platform: 'tiktok',
              performance_score: 90
            });
            setShowForm(!showForm);
          }}
          className="px-3 py-1.5 bg-red-650 hover:bg-red-700 bg-red-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Fechar Form' : 'Adicionar Fórmula'}
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 text-emerald-400 text-xs font-semibold rounded-lg">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg">
          {errorMsg}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-[#111118] border border-[#1E1E2E] rounded-xl space-y-3">
          <h3 className="text-xs font-extrabold uppercase text-white tracking-wider">
            {editingId ? 'Editar Fórmula de Copy' : 'Criar Fórmula de Copy do Zero'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[#8888AA]">Título da Fórmula</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Tipo de Bloco</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              >
                <option value="hook">Hook (Gancho de 3s)</option>
                <option value="script">Roteiro Completo / Corpo</option>
                <option value="cta">CTA (Chamada para Ação)</option>
                <option value="caption">Caption (Legenda)</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[#8888AA]">Conteúdo Literário da Copy</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white h-20 resize-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Nicho focado</label>
              <select
                value={formData.niche}
                onChange={(e) => setFormData({...formData, niche: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              >
                <option value="geral">Geral / Amplo</option>
                <option value="beleza">Beleza & Estética</option>
                <option value="tecnologia">Infoprodutos & Tecnologia</option>
                <option value="casa">Casa & Organização</option>
                <option value="saude">Saúde & Bem Estar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Rede Social</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              >
                <option value="tiktok">TikTok</option>
                <option value="reels">Instagram Reels</option>
                <option value="youtube_shorts">YouTube Shorts</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Emoção Principal</label>
              <input
                type="text"
                value={formData.emotion}
                onChange={(e) => setFormData({...formData, emotion: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Score de Performance (10-100)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.performance_score}
                onChange={(e) => setFormData({...formData, performance_score: Number(e.target.value)})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 bg-[#12121A] text-[#8888AA] rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-650 hover:bg-red-700 bg-red-600 text-white rounded-lg font-bold"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-xs">Aguarde...</div>
      ) : (
        <div className="space-y-3">
          {libraryList.map(item => (
            <div key={item.id} className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-1 text-[9px] uppercase font-bold text-gray-400">
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.2 rounded">{item.type}</span>
                  <span className="bg-zinc-800 px-1 py-0.2 rounded">{item.niche}</span>
                  <span className="text-[#06B6D4]">💖 {item.emotion}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-xs leading-relaxed text-[#A0A0B0] bg-[#0A0A0F]/65 p-2.5 rounded font-mono select-all">
                  {item.content}
                </p>
              </div>

              <div className="flex flex-col items-end self-stretch justify-between flex-shrink-0">
                <span className="text-[10px] font-black text-emerald-400">Conversão: {item.performance_score}%</span>

                <div className="flex gap-1.5 mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1 bg-[#1E1E2E] hover:bg-neutral-800 text-red-400 rounded transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 bg-[#1E1E2E] hover:bg-neutral-800 text-rose-500 rounded transition"
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
  );
}
