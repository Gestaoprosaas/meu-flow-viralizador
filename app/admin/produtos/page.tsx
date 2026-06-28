"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Edit, Trash2, Tag, Percent, RefreshCw } from 'lucide-react';

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche: '',
    image_url: '',
    opportunity_score: 80,
    competition_level: 'média',
    trend_reason: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccessMsg(editingId ? 'Produto atualizado!' : 'Novo produto criado!');
        setEditingId(null);
        setShowForm(false);
        setFormData({
          name: '',
          description: '',
          niche: '',
          image_url: '',
          opportunity_score: 80,
          competition_level: 'média',
          trend_reason: ''
        });
        fetchProducts();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Erro ao persistir produto.');
      }
    } catch (err) {
      setErrorMsg('Erro de rede.');
    }
  };

  const handleEdit = (prod: any) => {
    setFormData({
      name: prod.name,
      description: prod.description,
      niche: prod.niche,
      image_url: prod.image_url,
      opportunity_score: prod.opportunity_score,
      competition_level: prod.competition_level,
      trend_reason: prod.trend_reason
    });
    setEditingId(prod.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este produto?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Produto removido!');
        fetchProducts();
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
            <TrendingUp className="w-6 h-6 text-red-500" />
            Produtos Recomendados (Em Alta)
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Altere o bento feed de produtos virais da shopee / mercadolivre.</p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              niche: '',
              image_url: '',
              opportunity_score: 80,
              competition_level: 'média',
              trend_reason: ''
            });
            setShowForm(!showForm);
          }}
          className="px-3 py-1.5 bg-red-650 hover:bg-red-700 bg-red-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Fechar Form' : 'Adicionar Produto'}
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg">
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
            {editingId ? 'Editar Produto' : 'Adicionar Produto em Alta'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[#8888AA]">Nome</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Nicho</label>
              <input
                type="text"
                required
                value={formData.niche}
                onChange={(e) => setFormData({...formData, niche: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[#8888AA]">Descrição</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white h-16 resize-none"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[#8888AA]">URL Imagem</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Score Oportunidade (0-100)</label>
              <input
                type="number"
                min="10"
                max="100"
                value={formData.opportunity_score}
                onChange={(e) => setFormData({...formData, opportunity_score: Number(e.target.value)})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#8888AA]">Nível Competição</label>
              <select
                value={formData.competition_level}
                onChange={(e) => setFormData({...formData, competition_level: e.target.value})}
                className="w-full bg-[#0C0C12] border border-[#1E1E2E] p-2 rounded-lg text-white"
              >
                <option value="baixa">Baixa</option>
                <option value="média">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2">
              <label className="text-[#8888AA]">Motivo da Projeção de Venda</label>
              <input
                type="text"
                value={formData.trend_reason}
                onChange={(e) => setFormData({...formData, trend_reason: e.target.value})}
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
        <div className="text-center py-12 text-xs">Carregando bento feed...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(prod => (
            <div key={prod.id} className="bg-[#111118] border border-[#1E1E2E] p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="flex gap-3">
                <img src={prod.image_url} alt={prod.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" referrerPolicy="no-referrer" />
                <div className="space-y-1">
                  <span className="text-[9px] bg-red-500/15 text-red-400 font-extrabold px-1 rounded uppercase">{prod.niche}</span>
                  <h4 className="text-xs font-bold text-white">{prod.name}</h4>
                  <p className="text-[10px] text-[#8888AA] line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="border-t border-[#1E1E2E]/60 pt-2 text-[10px] space-y-1 text-[#8888AA]">
                <p>💡 Competição: <strong className="text-white uppercase">{prod.competition_level}</strong></p>
                <p>⭐ Tendência: <span className="text-amber-400 italic">{prod.trend_reason}</span></p>
              </div>

              <div className="flex justify-between items-center border-t border-[#1E1E2E]/60 pt-2">
                <span className="text-xs font-black text-red-500">Score: {prod.opportunity_score}/100</span>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="p-1.5 bg-[#1E1E2E] hover:bg-neutral-800 text-red-400 rounded-lg"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-1.5 bg-[#1E1E2E] hover:bg-neutral-800 text-rose-500 rounded-lg"
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
