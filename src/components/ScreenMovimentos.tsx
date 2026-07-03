import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Sparkles, Copy, Check } from 'lucide-react';
import { MOVEMENTS_PRESETS, MovementPreset } from '../data/prompts';

function extractYoutubeId(url: string | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

interface MovimentoCardItemProps {
  movement: MovementPreset;
  onSelect: (id: string) => void;
  key?: string | number;
}

function MovimentoCardItem({ movement, onSelect }: MovimentoCardItemProps) {
  const [copied, setCopied] = useState(false);

  const videoSrc = movement.videoUrl;
  const isVideo = movement.format === 'Video' || !!videoSrc;
  const ytId = isVideo ? extractYoutubeId(videoSrc) : null;

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = movement.promptText || '';

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <div
      className="group relative bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl overflow-hidden hover:border-[#FE2C55]/50 transition-all cursor-pointer flex flex-col h-full"
      onClick={() => onSelect(movement.id)}
    >
      {/* Media Preview */}
      <div className="aspect-[9/16] relative bg-black overflow-hidden w-full">
        {isVideo && videoSrc ? (
          ytId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.35]"
              allow="autoplay; encrypted-media"
              title={movement.name}
              frameBorder="0"
            />
          ) : (
            <>
              <img
                src={movement.imageUrl}
                alt={movement.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
                referrerPolicy="no-referrer"
              />
              <video
                key={movement.id}
                src={videoSrc}
                className="absolute inset-0 w-full h-full object-cover z-10"
                style={{ objectFit: 'cover' }}
                autoPlay
                loop
                muted
                playsInline
              />
            </>
          )
        ) : (
          <img
            src={movement.imageUrl}
            alt={movement.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        
        {isVideo && videoSrc && (
          <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
            <Play className="w-3 h-3 text-[#25F4EE]" /> Vídeo
          </div>
        )}

        <div className="absolute top-3 left-3 z-20 bg-[#FE2C55] px-2 py-1 rounded text-[10px] font-bold text-white shadow-lg uppercase">
          {movement.type}
        </div>

        {/* Gradient Overlay for Text */}
        <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
          <h3 className="text-sm font-black text-white mb-1 group-hover:text-[#FE2C55] transition-colors leading-tight">
            {movement.name}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between border-t border-[#1E1E2E]/50">
        <p className="text-xs text-[#8888AA] line-clamp-2 leading-relaxed">
          {movement.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-[#1E1E2E] flex items-center justify-between gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(movement.id);
            }}
            className="text-xs font-bold text-white hover:text-[#FE2C55] transition-colors flex items-center gap-1.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            Usar Movimento <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </button>

          <button
            onClick={handleCopyPrompt}
            className="text-xs font-bold text-[#8888AA] hover:text-white transition-colors flex items-center gap-1.5 bg-[#12121A] hover:bg-[#1E1E2E] border border-[#1E1E2E] px-3 py-1.5 rounded-lg shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copiar Prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScreenMovimentosProps {
  onNavigate: (path: string, payload?: any) => void;
}

export default function ScreenMovimentos({ onNavigate }: ScreenMovimentosProps) {
  const movementsList = MOVEMENTS_PRESETS;

  const handleSelectMovement = (id: string) => {
    // Find the movement to save
    const movement = movementsList.find(m => m.id === id);
    if (movement) {
      localStorage.setItem('viralseller_movimento_pre', JSON.stringify(movement));
      localStorage.setItem('viralseller_video_mode', 'MOVIMENTO'); // ensure mode is set
    }
    onNavigate('/produtos');
  };

  return (
    <div className="flex flex-col h-full bg-[#030303] text-white w-full">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-[#1E1E2E] bg-[#0A0A0F] w-full">
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

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-[#1E1E2E] scrollbar-track-transparent w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {movementsList.map((movement) => (
              <MovimentoCardItem
                key={movement.id}
                movement={movement}
                onSelect={handleSelectMovement}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
