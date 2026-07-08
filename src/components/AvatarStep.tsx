import React, { useState } from 'react';
import { Check } from 'lucide-react';

export interface Avatar {
  id: string;
  nome: string;
  genero: 'Feminino' | 'Masculino';
  imagemUrl: string;
  descricao: string;
}

// Mock de avatares caso não exista avataresProntos
const MOCK_AVATARES: Avatar[] = [
  { id: '1', nome: 'Giovana', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Giovana', descricao: 'Avatar feminino' },
  { id: '2', nome: 'Beatriz', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Beatriz', descricao: 'Avatar feminino' },
  { id: '3', nome: 'Clara', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Clara', descricao: 'Avatar feminino' },
  { id: '4', nome: 'Yasmin', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Yasmin', descricao: 'Avatar feminino' },
  { id: '5', nome: 'Valentina', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Valentina', descricao: 'Avatar feminino' },
  { id: '6', nome: 'Aurora', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Aurora', descricao: 'Avatar feminino' },
  { id: '7', nome: 'Rafael', genero: 'Masculino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Rafael', descricao: 'Avatar masculino' },
  { id: '8', nome: 'Caio', genero: 'Masculino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Caio', descricao: 'Avatar masculino' },
  { id: '9', nome: 'Davi', genero: 'Masculino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Davi', descricao: 'Avatar masculino' },
  { id: '10', nome: 'Lucas', genero: 'Masculino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Lucas', descricao: 'Avatar masculino' },
  { id: '11', nome: 'Aisha', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Aisha', descricao: 'Avatar feminino' },
  { id: '12', nome: 'Thiago', genero: 'Masculino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Thiago', descricao: 'Avatar masculino' },
  { id: '13', nome: 'Enzo', genero: 'Masculino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Enzo', descricao: 'Avatar masculino' },
  { id: '14', nome: 'Leticia', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Leticia', descricao: 'Avatar feminino' },
  { id: '15', nome: 'Giovannaa', genero: 'Feminino', imagemUrl: 'https://placehold.co/130x160/1a1a2e/white?text=Giovannaa', descricao: 'Avatar feminino' },
];

export interface AvatarStepProps {
  avatarSelecionado: Avatar | null;
  onAvatarSelect: (avatar: Avatar) => void;
  onVoltar: () => void;
  onAvancar: () => void;
  caracteristicasCustom?: string;
  onCaracteristicasChange?: (texto: string) => void;
}

export default function AvatarStep({
  avatarSelecionado,
  onAvatarSelect,
  onVoltar,
  onAvancar,
  caracteristicasCustom = '',
  onCaracteristicasChange
}: AvatarStepProps) {
  const [filtro, setFiltro] = useState<'Todos' | 'Feminino' | 'Masculino'>('Todos');

  const avataresFiltrados = MOCK_AVATARES.filter(
    (avatar) => filtro === 'Todos' || avatar.genero === filtro
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-white p-6 rounded-2xl w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1E1E2E] pb-4">
        <div className="space-y-1">
          <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block">
            ETAPA 2 — AVATAR (MOVIMENTO)
          </span>
          <h2 className="text-xl font-black text-white">Escolha seu Avatar</h2>
          <p className="text-xs text-[#8888AA]">Selecione um influenciador para o seu vídeo.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-[#FE2C55] hover:bg-[#ff4e74] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
            ✦ Influencer Studio
          </button>
        </div>
      </div>

      {/* Gender Filters */}
      <div className="flex items-center gap-2">
        {(['Todos', 'Feminino', 'Masculino'] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setFiltro(g)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filtro === g 
                ? 'bg-[#FE2C55]/10 border border-[#FE2C55] text-[#FE2C55]' 
                : 'bg-[#111118] border border-[#2a2a3a] text-zinc-400 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid de Avatares */}
      <div className="grid gap-3 overflow-y-auto pr-2 max-h-[500px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
        {avataresFiltrados.map((avatar) => {
          const isSelected = avatarSelecionado?.id === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onAvatarSelect(avatar)}
              className={`relative group flex flex-col items-center justify-end rounded-[10px] overflow-hidden transition-all duration-200 aspect-[3/4] bg-[#111118] border outline-none ${
                isSelected 
                  ? 'border-2 border-[#FE2C55] scale-[1.02]' 
                  : 'border-[#2a2a3a] hover:border-[#FE2C55] hover:scale-[1.03]'
              }`}
            >
              <img 
                src={avatar.imagemUrl} 
                alt={avatar.nome}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Overlay inferior */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-left">
                <div className="font-semibold text-[13px] text-white truncate drop-shadow-md">
                  {avatar.nome}
                </div>
                <div className="text-[10px] text-gray-300 uppercase tracking-wider font-medium mt-0.5">
                  {avatar.genero === 'Feminino' ? 'FEM' : 'MASC'}
                </div>
              </div>

              {/* Ícone de Selecionado */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#FE2C55] text-white rounded-full p-1 shadow-lg">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Textarea Opcional */}
      {onCaracteristicasChange && (
        <div className="pt-2">
          <textarea
            value={caracteristicasCustom}
            onChange={(e) => onCaracteristicasChange(e.target.value)}
            placeholder="Características estéticas personalizadas de forma manual se desejar..."
            rows={2}
            maxLength={300}
            className="w-full bg-[#111118] border border-[#2a2a3a] rounded-xl p-3 text-xs text-white focus:border-[#FE2C55] outline-none resize-none transition"
          />
        </div>
      )}

      {/* Rodapé */}
      <div className="flex justify-between items-center pt-4 border-t border-[#1E1E2E] mt-auto">
        <button
          type="button"
          onClick={onVoltar}
          className="text-xs font-semibold text-zinc-400 hover:text-white px-4 py-2 transition-colors"
        >
          ← Etapa Anterior
        </button>
        
        <button
          type="button"
          disabled={!avatarSelecionado}
          onClick={onAvancar}
          className={`text-xs font-bold py-2.5 px-6 rounded-lg transition-all ${
            avatarSelecionado 
              ? 'bg-[#FE2C55] hover:bg-[#ff4e74] text-white shadow-lg shadow-[#FE2C55]/20' 
              : 'bg-[#FE2C55]/50 text-white/50 cursor-not-allowed'
          }`}
        >
          Confirmar e Avançar →
        </button>
      </div>
    </div>
  );
}
