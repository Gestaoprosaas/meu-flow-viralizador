import React, { useState } from 'react';
import { Target, FileText, Plus, Folder, Calendar, ArrowRight, Layers, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ScreenProjetosProps {
  projects: Project[];
  onAddProject: (proj: any) => void;
  onNavigate: (path: string, payload?: any) => void;
}

export default function ScreenProjetos({
  projects,
  onAddProject,
  onNavigate
}: ScreenProjetosProps) {
  // Modal toggle
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [prodName, setProdName] = useState('');
  const [desc, setDesc] = useState('');
  const [audience, setAudience] = useState('');
  const [niche, setNiche] = useState('Geral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prodName) return;

    onAddProject({
      name,
      product_name: prodName,
      product_description: desc,
      target_audience: audience,
      niche
    });

    // Reset fields
    setName('');
    setProdName('');
    setDesc('');
    setAudience('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Folder className="w-6 h-6 text-[#7C3AED]" />
            Campanhas e Projetos
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Gerencie pastas organizadas para cada produto com seus roteiros, imagens e vídeos agregados.</p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto de Produto
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-1.5">Estruturar Novo Projeto</h3>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Escala de São Paulo"
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-white focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Nome Comercial do Produto</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ex: Mini Fita LED Inteligente"
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-white focus:border-[#7C3AED] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#8888AA]">Descrição do Produto</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                placeholder="Ex: Fita led sincronizável via app de celular para decorar TV ou cama..."
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-white focus:border-[#7C3AED] outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Público-Alvo</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex: Jovens universitários, Gamers"
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-white focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#8888AA]">Nicho</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-white focus:border-[#7C3AED]"
                >
                  <option value="Geral">Geral</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Beleza">Beleza & Cosméticos</option>
                  <option value="Casa">Casa & Organização</option>
                  <option value="Saúde">Saúde & Fitness</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-1.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8888AA] text-xs font-semibold rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg"
              >
                Confirmar Criação
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4 hover:border-[#7C3AED]/40 transition group relative"
          >
            <div className="flex justify-between items-start">
              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] border border-[#7C3AED]/20">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-extrabold uppercase bg-black px-2 py-0.5 rounded border border-white/10 text-white">
                {proj.niche}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white group-hover:text-[#7C3AED] transition truncate">{proj.name}</h3>
              <span className="text-[10px] text-[#06B6D4] font-semibold block">{proj.product_name}</span>
            </div>

            <p className="text-xs text-[#8888AA] line-clamp-2 h-8 text-justify">{proj.product_description || 'Sem descrição cadastrada do produto.'}</p>

            <div className="pt-3 border-t border-[#1E1E2E] flex justify-between items-center text-[10px] text-[#8888AA]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(proj.created_at).toLocaleDateString('pt-BR')}
              </span>
              
              <button
                onClick={() => onNavigate('/roteiros', proj)}
                className="text-white hover:text-[#7C3AED] font-bold flex items-center gap-1 transition"
              >
                Gerar Copa AI
                <ArrowRight className="w-3 h-3 animate-pulse" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
