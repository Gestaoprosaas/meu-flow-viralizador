import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { MOVEMENTS_PRESETS, MovementPreset } from '../data/prompts';

interface ScreenMovimentosProps {
  onNavigate: (path: string, payload?: any) => void;
}

export default function ScreenMovimentos({ onNavigate }: ScreenMovimentosProps) {
  const [hoveredMovement, setHoveredMovement] = useState<string | null>(null);
  const [movementsList, setMovementsList] = useState<MovementPreset[]>(MOVEMENTS_PRESETS);

  useEffect(() => {
    const loadCustomMovements = async () => {
      let customList: any[] = [];
      
      // 1. Try to load from localStorage first
      try {
        const saved = localStorage.getItem('local_movements_presets');
        if (saved) {
          customList = JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Error parsing local movements:", e);
      }

      // 2. Try to fetch from server
      try {
        const res = await fetch('/api/movements');
        if (res.ok) {
          const serverList = await res.json();
          if (serverList && serverList.length > 0) {
            customList = serverList;
          }
        }
      } catch (err) {
        console.warn("Could not fetch custom movements:", err);
      }

      if (!customList || customList.length === 0) {
        setMovementsList(MOVEMENTS_PRESETS);
        return;
      }

      // Merge customList with MOVEMENTS_PRESETS.
      // If a custom list item shares an ID with a default preset, use the custom item's edited values.
      // If a custom item is completely new, append it.
      const merged = [...customList];
      MOVEMENTS_PRESETS.forEach(def => {
        if (!merged.some(item => item.id === def.id)) {
          merged.push(def);
        }
      });

      // Map properly to ensure fields are valid and properly cast
      const mapped = merged.map(mv => ({
        id: mv.id,
        name: mv.name,
        type: mv.type || 'Movimentos',
        description: mv.description,
        imageUrl: mv.imageUrl || 'https://images.unsplash.com/photo-1627163430004-c7c3c9504018?auto=format&fit=crop&q=80&w=400',
        videoUrl: mv.videoUrl,
        format: mv.videoUrl ? 'Video' : 'Image',
        promptText: mv.promptText || mv.description
      }));

      setMovementsList(mapped);
    };

    loadCustomMovements();

    const handleSettingsUpdate = () => {
      loadCustomMovements();
    };
    window.addEventListener('realtime-db-update' as any, handleSettingsUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleSettingsUpdate);
    };
  }, []);

  const handleSelectMovement = (id: string) => {
    // Navigate to produtos passing the initial movement ID
    onNavigate('/produtos', { initialMovementId: id });
  };

  return (
    <div className="flex flex-col h-full bg-[#030303] text-white">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-[#1E1E2E] bg-[#0A0A0F]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="p-2 hover:bg-[#1E1E2E] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#8888AA]" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#FE2C55]" />
              <span className="text-[10px] font-black text-[#FE2C55] uppercase tracking-widest">
                Biblioteca de Movimentos
              </span>
            </div>
            <h1 className="text-xl font-black text-white">Movimentos de Câmera e Avatar</h1>
            <p className="text-xs text-[#8888AA]">
              Explore movimentos cinemáticos, HOOKs virais e interações exclusivas para seus vídeos UGC.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-[#1E1E2E] scrollbar-track-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movementsList.map((movement) => (
              <div
                key={movement.id}
                className="group relative bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl overflow-hidden hover:border-[#FE2C55]/50 transition-all cursor-pointer flex flex-col"
                onMouseEnter={() => setHoveredMovement(movement.id)}
                onMouseLeave={() => setHoveredMovement(null)}
                onClick={() => handleSelectMovement(movement.id)}
              >
                {/* Media Preview */}
                <div className="aspect-[9/16] relative bg-black overflow-hidden">
                  {movement.format === 'Video' && movement.videoUrl ? (
                    <video
                      src={movement.videoUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      autoPlay={hoveredMovement === movement.id}
                    />
                  ) : (
                    <img
                      src={movement.imageUrl}
                      alt={movement.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  {movement.format === 'Video' && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
                      <Play className="w-3 h-3" /> Vídeo
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-[#FE2C55] px-2 py-1 rounded text-[10px] font-bold text-white shadow-lg uppercase">
                    {movement.type}
                  </div>

                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-sm font-black text-white mb-1 group-hover:text-[#FE2C55] transition-colors leading-tight">
                      {movement.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#1E1E2E]/50">
                  <p className="text-xs text-[#8888AA] line-clamp-2 leading-relaxed">
                    {movement.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-[#1E1E2E] flex justify-center">
                    <button className="text-xs font-bold text-white group-hover:text-[#FE2C55] transition-colors flex items-center gap-1.5">
                      Usar Movimento <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
