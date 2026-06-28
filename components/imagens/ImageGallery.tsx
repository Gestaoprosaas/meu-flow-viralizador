"use client";

import React, { useState } from 'react';
import { Download, Save, Image as ImageIcon, Eye, Check, Loader2, Sparkles } from 'lucide-react';

interface ImageItem {
  id: string;
  url: string;
  productName: string;
  style: string;
  platform: string;
  createdAt: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onSaveToProject?: (image: ImageItem) => void;
  loadingImages?: string[]; // IDs of images currently being saved/processed
}

export default function ImageGallery({ images, onSaveToProject, loadingImages = [] }: ImageGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${filename.toLowerCase().replace(/\s+/g, '_')}_criativo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: open link in new tab if blob fetch gets blocked by cors
      window.open(url, '_blank');
    }
  };

  const handleSave = (img: ImageItem) => {
    if (onSaveToProject) {
      onSaveToProject(img);
    }
    setSavedIds((prev) => [...prev, img.id]);
    setTimeout(() => {
      setSavedIds((prev) => prev.filter((id) => id !== img.id));
    }, 3000);
  };

  if (images.length === 0) {
    return (
      <div className="bg-[#111118]/60 border border-[#1E1E2E] rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-[#1A1A24] flex items-center justify-center border border-[#1E1E2E] text-[#8888AA]">
          <ImageIcon className="w-6 h-6 text-[#7C3AED] animate-pulse" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h4 className="text-sm font-bold text-white">Nenhum criativo visual gerado ainda</h4>
          <p className="text-xs text-[#8888AA] leading-relaxed">
            Configure seu produto no formulário ao lado de nossa IA para renderizar criativos de estúdio ou estilo de vida ultra realistas de alta conversão.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Sparkles className="w-4.5 h-4.5 text-yellow-400 animate-pulse" />
        <h3 className="font-bold text-sm tracking-tight">Imagens e Criativos Renderizados</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {images.map((img) => {
          const isSaving = loadingImages.includes(img.id);
          const isSaved = savedIds.includes(img.id);

          return (
            <div
              key={img.id}
              className="group relative bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden aspect-square flex flex-col transition-all duration-350 hover:border-[#7C3AED] hover:shadow-2xl hover:shadow-[#7C3AED]/5"
              onMouseEnter={() => setHoveredId(img.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Product and style details badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 opacity-90 transition group-hover:opacity-100">
                <span className="text-[9px] font-extrabold uppercase bg-black/75 text-white px-2 py-0.5 rounded-lg border border-white/10 tracking-wider">
                  {img.style}
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-[#7C3AED]/80 text-white px-2 py-0.5 rounded-lg border border-[#7C3AED]/20 tracking-wider">
                  {img.platform}
                </span>
              </div>

              {/* Main render image display */}
              <div className="relative w-full flex-grow bg-[#050508] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.productName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Glassmorphic hover details controller overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-white font-extrabold text-xs sm:text-sm line-clamp-1">
                      {img.productName}
                    </p>
                    <p className="text-[10px] text-[#8888AA] font-mono">
                      {new Date(img.createdAt).toLocaleDateString('pt-BR')} às {new Date(img.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Operational Hover action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Trigger download */}
                    <button
                      onClick={() => handleDownload(img.url, img.productName)}
                      className="px-3 py-2 bg-white hover:bg-neutral-100 text-black rounded-xl text-[11px] font-extrabold transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Baixar PNG
                    </button>

                    {/* Trigger save to project */}
                    <button
                      onClick={() => handleSave(img)}
                      disabled={isSaving || isSaved}
                      className={`px-3 py-2 border rounded-xl text-[11px] font-extrabold transition flex items-center justify-center gap-1.5 shadow-md ${
                        isSaved
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-[#10B981]'
                          : 'bg-black/60 border-white/10 hover:border-white/30 text-white hover:bg-black/80'
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C3AED]" />
                      ) : isSaved ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      {isSaved ? 'Salvo!' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
