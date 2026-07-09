import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { AVATARS_PRESETS } from '../data/avatares';

export interface Avatar {
  id: string;
  nome: string;
  genero: 'Feminino' | 'Masculino';
  imagemUrl: string;
  descricao: string;
}

// Convert AVATARS_PRESETS to Avatar format
const avataresProntos: Avatar[] = AVATARS_PRESETS.map(av => ({
  id: av.id,
  nome: av.name,
  genero: av.gender === 'FEMININO' ? 'Feminino' : 'Masculino',
  imagemUrl: av.imageUrl,
  descricao: av.description
}));

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

  const avataresFiltrados = avataresProntos.filter(
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

      <style>{`
        @media (max-width: 768px) {
          .avatar-grid-mobile {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
            padding: 0 4px !important;
            width: 100% !important;
          }
          .avatar-card-mobile {
            position: relative !important;
            width: 100% !important;
            aspect-ratio: 3 / 4 !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            cursor: pointer !important;
            background: #111118 !important;
            border: 2px solid transparent !important;
            transition: border-color 0.2s ease !important;
            transform: none !important;
          }
          .avatar-card-mobile.selected {
            border-color: #FE2C55 !important;
          }
          .avatar-image-mobile {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center top !important;
            display: block !important;
          }
          .avatar-overlay-mobile {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            padding: 24px 8px 8px !important;
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%) !important;
          }
          .avatar-nome-mobile {
            font-size: 12px !important;
            font-weight: 700 !important;
            color: #ffffff !important;
            line-height: 1.2 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
          .avatar-genero-mobile {
            font-size: 10px !important;
            color: rgba(255,255,255,0.6) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            margin-top: 2px !important;
            display: block !important;
          }
          .avatar-check-mobile {
            position: absolute !important;
            top: 6px !important;
            right: 6px !important;
            width: 22px !important;
            height: 22px !important;
            border-radius: 50% !important;
            background: #FE2C55 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 20 !important;
          }
        }
      `}</style>

      {/* Grid de Avatares */}
      <div 
        className="grid gap-3 overflow-y-auto pr-2 max-h-[500px] avatar-grid-mobile" 
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}
      >
        {avataresFiltrados.map((avatar) => {
          const isSelected = avatarSelecionado?.id === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onAvatarSelect(avatar)}
              className={`relative group flex flex-col items-center justify-end rounded-[10px] overflow-hidden transition-all duration-200 aspect-[3/4] bg-[#111118] border outline-none avatar-card-mobile ${
                isSelected 
                  ? 'border-2 border-[#FE2C55] scale-[1.02] selected' 
                  : 'border-[#2a2a3a] hover:border-[#FE2C55] hover:scale-[1.03]'
              }`}
            >
              <img 
                src={avatar.imagemUrl} 
                alt={avatar.nome}
                className="absolute inset-0 w-full h-full object-cover avatar-image-mobile"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay inferior */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-left avatar-overlay-mobile">
                <div className="font-semibold text-[13px] text-white truncate drop-shadow-md avatar-nome-mobile">
                  {avatar.nome}
                </div>
                <div className="text-[10px] text-gray-300 uppercase tracking-wider font-medium mt-0.5 avatar-genero-mobile">
                  {avatar.genero === 'Feminino' ? 'FEM' : 'MASC'}
                </div>
              </div>

              {/* Ícone de Selecionado */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#FE2C55] text-white rounded-full p-1 shadow-lg avatar-check-mobile">
                  <Check className="w-3 h-3 stroke-[3]" style={{ width: '12px', height: '12px', color: '#ffffff' }} />
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
