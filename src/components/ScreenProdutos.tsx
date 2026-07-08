import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LazyVideo } from './LazyVideo';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import { 
  Target, 
  Search, 
  Plus, 
  TrendingUp, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Check, 
  ShieldAlert, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  MapPin, 
  Tv, 
  Copy, 
  RefreshCw, 
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowUpFromLine,
  Coins,
  Volume2,
  VolumeX,
  MessageSquare,
  Download,
  Image,
  Info,
  FolderOpen,
  Package,
  Flame,
  Zap,
  AlertTriangle,
  Heart,
  Award,
  Clock,
  Link2
} from 'lucide-react';
import { TrendingProduct } from '../types';
import ProductImage from './ProductImage';
import { AVATARS_PRESETS, AvatarPreset } from '../data/avatares';
import { SCENARIOS_PRESETS, CURATED_SCENARIOS_PRESETS, ScenarioPreset, CuratedScenarioPreset } from '../data/cenarios';
import { MOVEMENTS_PRESETS, MovementPreset } from '../data/prompts';
import { MODOS_GERACAO } from '../data/modosGeracao';
import { PRODUTOS_PRONTOS } from '../data/produtosProntos';
import { PRODUTOS_EM_ALTA } from '../data/produtos';
import { motion } from 'motion/react';

const getProdutosOrdenados = () => {
  const ordemSalva = localStorage.getItem('produtos_ordem_embaralhada');
  if (ordemSalva) {
    try {
      const indices = JSON.parse(ordemSalva);
      if (Array.isArray(indices)) {
        return indices
          .filter((i: number) => i < PRODUTOS_PRONTOS.length)
          .map((i: number) => PRODUTOS_PRONTOS[i]);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return PRODUTOS_PRONTOS;
};


const PROMPT_CENARIO_PRONTO_FIXO = `Use the first image ONLY as an environment + pose reference.
Use the second image as the ONLY avatar identity reference.
Use the third image as the ONLY clothing reference (if provided).

⚠️ IDENTITY ISOLATION RULE (ABSOLUTE):
The first image is used ONLY for:
- Camera angle
- Camera height
- Camera tilt
- Body orientation
- Pose
- EXACT distance to camera (CRITICAL LOCK)
- EXACT subject size in frame (CRITICAL LOCK)
- Framing
- Perspective

The first image MUST NOT influence:
- Skin tone
- Face structure
- Body type
- Ethnicity
- Hair color
- Hair texture
- Facial features
- Makeup
- Body proportions
- Weight
- Age appearance

ZERO IDENTITY TRANSFER FROM IMAGE 1.

────────────────────────
ENVIRONMENT EXTRACTION (STRICT)
────────────────────────
- Extract ONLY the background from Image 1
- Completely remove the original model
- Remove any remaining silhouette traces
- The environment must look originally empty
- Preserve exact camera framing and perspective
- Preserve exact camera-to-subject distance reference

────────────────────────
AVATAR IDENTITY LOCK (CRITICAL)
────────────────────────
The avatar from Image 2 is the ONLY identity source.
ABSOLUTE LOCK:
- Preserve exact face
- Preserve exact skin tone
- Preserve exact body proportions
- Preserve exact body weight
- Preserve exact ethnicity
- Preserve exact hair color
- Preserve exact hair texture
- Preserve realism level

DO NOT reinterpret.
DO NOT blend identities.
DO NOT adapt to Image 1 body type.

────────────────────────
POSE + DISTANCE MATCHING (CRITICAL)
────────────────────────
- Match the body angle exactly
- Match arm positioning exactly
- Match shoulder alignment
- Match hip orientation

🚨 DISTANCE RULE (HARD LOCK):
- The avatar MUST be placed at the EXACT same distance from the camera as the original model in Image 1
- The avatar MUST occupy the SAME scale in the frame (same height proportion)
- The avatar MUST NOT appear closer or further than the original reference
- DO NOT zoom in or out to fit
- DO NOT resize subject artificially

The placement must be a 1:1 spatial replacement.

────────────────────────
CLOTHING
────────────────────────
- Apply clothing from Image 3 exactly
- No redesign
- No reinterpretation

────────────────────────
LIGHTING
────────────────────────
- Match environment lighting direction only
- Do NOT recolor skin tone
- Do NOT change complexion
- Do NOT adapt tone to background

────────────────────────
STRICT PROHIBITIONS
────────────────────────
- NO background bleed into subject
- NO blending of face shapes
- NO halo effects
- NO glowing edges around subject outline`;

interface ScreenProdutosProps {
  onNavigate: (path: string, payload?: any) => void;
  trendingProducts: TrendingProduct[];
  onAddProduct: (prod: any) => void;
  onRefresh?: () => void;
  initialMovementId?: string | null;
  userRole?: string;
}

interface AvatarCardProps {
  av: AvatarPreset;
  isSelected: boolean;
  onSelect: () => void;
  key?: string;
}

function AvatarCard({ av, isSelected, onSelect }: AvatarCardProps) {
  const { isMobile, isInView, containerRef, videoRef } = useMobileAndIntersection();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [videoRef, av.videoUrl, isInView]);

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onSelect}
      className={`group text-left bg-[#0A0A0F] border rounded-2xl overflow-hidden transition-all duration-100 ease-out active:scale-95 relative ${
        isSelected 
          ? 'ring-2 ring-[#FE1E4E] border-[#FE1E4E] scale-[0.98]' 
          : 'border-[#1E1E2E] hover:border-[#FE1E4E]/40'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FE2C55] flex items-center justify-center border border-white/20">
          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[4]" />
        </div>
      )}

      <div className="relative h-40 xs:h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-zinc-900">
        {av.videoUrl ? (
          <LazyVideo
            ref={videoRef}
            src={av.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster={av.imageUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageWithSkeleton 
            src={av.imageUrl} 
            alt={av.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        )}
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-3 pt-8 flex flex-col justify-end z-10">
          <span className="text-xs sm:text-sm font-black text-white tracking-wide">{av.name}</span>
          <span className="text-[9px] font-bold text-[#8888AA] tracking-wider uppercase">{av.gender}</span>
        </div>
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-2.5 bg-[#030307] border-t border-[#1E1E2E]/60">
        <p className="text-[10px] text-[#A0A0C0] line-clamp-2 leading-relaxed h-[28px] group-hover:text-white transition">
          {av.description}
        </p>
      </div>
    </button>
  );
}

interface ScenarioCardProps {
  sc: ScenarioPreset;
  isSelected: boolean;
  onSelect: () => void;
  key?: string;
  isLarge?: boolean;
}

function ScenarioCard({ sc, isSelected, onSelect, isLarge }: ScenarioCardProps) {
  const { isMobile, isInView, containerRef, videoRef } = useMobileAndIntersection();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [videoRef, sc.videoUrl, isInView]);

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onSelect}
      className={`group text-left bg-[#0A0A0F] border rounded-2xl overflow-hidden transition-all duration-100 ease-out active:scale-95 relative w-full ${
        isSelected 
          ? 'ring-2 ring-[#FE1E4E] border-[#FE1E4E] scale-[0.98]' 
          : 'border-[#1E1E2E] hover:border-[#FE1E4E]/40'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 w-4 h-4 rounded-full bg-[#FE2C55] flex items-center justify-center border border-white/20">
          <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
        </div>
      )}

      <div className={`relative ${isLarge ? 'aspect-[2/3] min-h-[420px] sm:min-h-[480px]' : 'h-32 xs:h-36 sm:h-44'} overflow-hidden bg-zinc-900 w-full`}>
        {sc.videoUrl ? (
          <LazyVideo
            ref={videoRef}
            src={sc.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster={sc.imageUrl}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <ImageWithSkeleton 
            src={sc.imageUrl} 
            alt={sc.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        )}
        
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-2.5 pt-6 flex flex-col justify-end z-10">
          <span className="text-[11px] sm:text-xs font-black text-white tracking-wide">{sc.name}</span>
          <span className="text-[8px] font-bold text-[#8888AA] tracking-wider uppercase">{sc.type}</span>
        </div>

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      </div>
    </button>
  );
}

interface MovementCardProps {
  mv: MovementPreset;
  isSelected: boolean;
  onSelect: () => void;
  onInfo: () => void;
  key?: string;
}

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function MovementCard({ mv, isSelected, onSelect, onInfo }: MovementCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { isMobile, isInView, containerRef, videoRef } = useMobileAndIntersection();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [videoRef, mv.videoUrl, isInView]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mv.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      const element = document.createElement("a");
      const file = new Blob([mv.promptText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${mv.id}_cenario_prompt.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  const isScenario = mv.type === 'Cenário';

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl overflow-hidden border bg-[#050508] transition-all duration-100 ease-out active:scale-95 cursor-pointer select-none h-40 xs:h-44 sm:h-auto sm:aspect-[9/16] ${
        isSelected
          ? 'border-[#FE2C55] shadow-[0_0_20px_rgba(254,44,85,0.25)] scale-[0.99] ring-1 ring-[#FE2C55]'
          : 'border-[#1E1E2E] hover:border-[#FE2C55]/50 hover:scale-[1.02] shadow-lg hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Absolute top section: Badges */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap gap-1.5 items-center">
        {/* Format Badge (Video / Imagem) */}
        <span className="backdrop-blur-md bg-black/55 text-[9px] font-extrabold uppercase tracking-widest text-[#25F4EE] px-2 py-1 rounded-xl border border-[#25F4EE]/25 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${mv.format === 'Imagem' ? 'bg-amber-400' : 'bg-[#25F4EE] animate-pulse'}`} />
          {mv.format || 'Video'}
        </span>
        
        {/* Secondary Category Badge */}
        <span className="backdrop-blur-md bg-black/60 text-[9px] font-black uppercase tracking-widest text-[#F0F0FF] px-2 py-1 rounded-xl border border-white/10">
          {mv.type}
        </span>
      </div>

      {/* Selected indicator overlay */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-30 w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center border border-white/20 shadow-md">
          <Check className="w-3 h-3 text-white stroke-[3.5]" />
        </div>
      )}

      {/* Media container: Image or Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-zinc-950">
        {mv.videoUrl ? (
          (() => {
            const ytId = extractYoutubeId(mv.videoUrl);
            if (ytId) {
              return (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-[1.35]"
                  allow="autoplay; encrypted-media"
                  title={mv.name}
                  frameBorder="0"
                />
              );
            }

            return (
              <LazyVideo
                ref={videoRef}
                src={mv.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster={mv.imageUrl}
                className="w-full h-full object-cover"
              />
            );
          })()
        ) : (
          <ImageWithSkeleton
            src={mv.imageUrl}
            alt={mv.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Ambient Dark Gradient Bottom Vignette for perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/55 to-black/5 z-10 pointer-events-none" />
      </div>

      {/* Empty space to push text overlay to bottom */}
      <div className="flex-1 pointer-events-none" />

      {/* Details Box and Action Buttons */}
      <div className="relative z-20 p-2.5 sm:p-5 flex flex-col gap-1 sm:gap-3 font-sans mt-auto">
        <div className="space-y-0.5">
          <h4 className="text-[11px] sm:text-sm font-black text-white tracking-wide leading-tight group-hover:text-[#FE2C55] transition-colors">
            {mv.name}
          </h4>
          <p className="text-[9px] sm:text-xs font-medium text-[#8888AA] line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {mv.description}
          </p>
        </div>

        {/* Buttons tray */}
        {isScenario && (
          <div className="flex flex-col gap-1.5 w-full mt-1">
            {/* Secondary Action Button - Baixar Cenário (for specific scenario cards) */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-2 bg-zinc-950/95 hover:bg-zinc-900 text-[#25F4EE] border border-[#25F4EE]/30 hover:border-[#25F4EE]/60 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 select-none active:scale-95 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Baixando...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Baixar Cenário
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const INTERACTION_MEDIA_MAP: Record<string, { imageUrl: string; videoUrl: string; category: string; format: string }> = {
  'A': {
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-look-of-the-day-fashion-video-41584-large.mp4',
    category: 'VISTA',
    format: 'Video'
  },
  'B': {
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    category: 'PRODUTO',
    format: 'Video'
  },
  'C': {
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-showing-her-outfit-in-the-mirror-40283-large.mp4',
    category: 'ESPELHO',
    format: 'Video'
  },
  'D': {
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-sunset-41712-large.mp4',
    category: 'SELFIE',
    format: 'Video'
  },
  'E': {
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    category: 'POV',
    format: 'Video'
  },
  'F': {
    imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-woman-putting-on-makeup-41595-large.mp4',
    category: 'ASMR',
    format: 'Video'
  },
  'G': {
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-posing-funny-for-the-camera-39906-large.mp4',
    category: 'HOOK',
    format: 'Video'
  },
  'H': {
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-new-delivery-box-at-home-41602-large.mp4',
    category: 'UNBOXING',
    format: 'Video'
  },
  'I': {
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blowing-a-kiss-to-the-camera-40748-large.mp4',
    category: 'REAÇÃO',
    format: 'Video'
  },
  'J': {
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-showing-her-look-41587-large.mp4',
    category: 'TRANSIÇÃO',
    format: 'Video'
  },
  'K': {
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-new-delivery-box-at-home-41602-large.mp4',
    category: 'LIFESTYLE',
    format: 'Video'
  },
  'L': {
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-touching-her-long-hair-41589-large.mp4',
    category: 'UGC',
    format: 'Video'
  }
};

interface InteractionCardProps {
  inter: {
    id: string;
    name: string;
    description: string;
    englishText: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  key?: any;
}

function InteractionCard({ inter, isSelected, onSelect }: InteractionCardProps) {
  const badgeText = INTERACTION_MEDIA_MAP[inter.id]?.category || 'VIDEO';

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col justify-start rounded-2xl overflow-hidden border bg-[#050508] transition-all duration-200 ease-out active:scale-95 cursor-pointer select-none w-full p-4 space-y-3 ${
        isSelected
          ? 'border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.20)] bg-[#FE2C55]/5'
          : 'border-[#1E1E2E] hover:border-[#FE2C55]/50 bg-[#0B0B11]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="backdrop-blur-md bg-black/55 text-[9px] font-extrabold uppercase tracking-widest text-[#25F4EE] px-2 py-1 rounded-md border border-[#25F4EE]/25 flex items-center gap-1">
          {badgeText}
        </span>
        {isSelected && (
          <div className="w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center border border-white/20">
            <Check className="w-3 h-3 text-white stroke-[3.5]" />
          </div>
        )}
      </div>

      <div>
        <h4 className="text-base font-bold text-white leading-tight group-hover:text-[#FE2C55] transition-colors">{inter.name}</h4>
        <p className="text-sm text-zinc-400 mt-1.5 leading-snug">{inter.description}</p>
      </div>
    </div>
  );
}

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const enrichProduct = (p: any) => {
  if (!p) return null;
  
  const numId = hashString(p.id || p.name || p.nome || '123');
  const sales_30d = p.sales_30d || (1000 + (numId % 14000));
  const views_30d = p.views_30d || (sales_30d * (5 + (numId % 20)));

  let rawImg = p.imagem_url || p.image_url || p.imagem || '';
  if (rawImg && (rawImg.includes('tiktokcdn.com') || rawImg.includes('ibyteimg.com'))) {
    rawImg = `https://images.weserv.nl/?url=${rawImg.replace('https://', '')}`;
  }

  // If it's a local product already, return as is with added metrics and proxied image
  if (p.prompts && p.afiliado && p.tags) {
    return { 
      ...p, 
      imagem: rawImg || p.imagem, 
      imagem_url: rawImg || p.imagem_url, 
      image_url: rawImg || p.image_url, 
      sales_30d, 
      views_30d 
    };
  }

  // Fallback / generate default Portuguese properties dynamically
  const priceStr = p.preco || p.price || (p.valor ? String(p.valor).replace('R$', '').trim() : '') || (p.average_price ? p.average_price.toFixed(2).replace('.', ',') : '52,90');
  const commissionStr = p.comissao || (p.commission_percentage ? `${p.commission_percentage}%` : '15%');
  const tagsList = p.tags || [p.tendencia || p.trend || 'em_alta', p.nicho || p.niche || 'Geral'];
  const pName = p.name || p.nome || 'Produto Viral';
  const pDesc = p.description || p.trend_reason || 'Produto em alta de alta conversão.';
  
  const finalImg = rawImg || "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=300";

  return {
    ...p,
    nome: pName,
    preco: priceStr,
    imagem: finalImg,
    tags: tagsList,
    afiliado: {
      link: p.link || p.link_afiliado || p.affiliate_links?.tiktok || '',
      comissao: commissionStr
    },
    prompts: {
      ugc: `Vídeo vertical 9:16. Jovem mulher segura o ${pName} em ambiente de sala iluminado. Estilo selfie, sorriso natural. Ela diz diretamente para a câmera: "Estou amando o ${pName}! Ele facilita muito a minha rotina e tem uma qualidade impecável. Super indico!"`,
      pov: `Cena POV (primeira pessoa) em 9:16 sobre uma bancada limpa de mármore. Mãos femininas seguram o ${pName}, mostrando de perto suas texturas e acabamento. Voz em off: "O design sofisticado e os detalhes premium do ${pName} chamam a atenção à primeira vista. Altamente funcional."`,
      movimento: `Avatar masculino em estúdio moderno gesticulando e apresentando o ${pName}. A câmera realiza um movimento de zoom dinâmico e giro de 360 graus para mostrar todos os ângulos do produto sob iluminação de estúdio.`
    },
    sales_30d,
    views_30d
  };
};

function useMobileAndIntersection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { rootMargin: '100px' }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Capture the current ref value for cleanup
    const currentVideo = videoRef.current;
    
    return () => {
      observer.disconnect();
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.src = '';
        currentVideo.load();
      }
    };
  }, [isMobile]);

  return { isMobile, isInView, containerRef, videoRef };
}

export default function ScreenProdutos({
  onNavigate,
  trendingProducts,
  onAddProduct,
  onRefresh,
  initialMovementId,
  userRole
}: ScreenProdutosProps) {
  const sentinelaRef = useRef<HTMLDivElement>(null);
  const [headerColapsado, setHeaderColapsado] = useState(false);

  useEffect(() => {
    const sentinela = sentinelaRef.current;
    if (!sentinela) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Quando o sentinela sai da tela (scroll para baixo), colapsa o header
        setHeaderColapsado(!entry.isIntersecting);
      },
      {
        root: null, // observa o viewport da página inteira
        threshold: 0,
        rootMargin: '-60px 0px 0px 0px' // ajusta a altura do navbar fixo se tiver
      }
    );

    observer.observe(sentinela);
    return () => observer.disconnect();
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [items, setItems] = useState<any[]>([]);

  const [viralItems, setViralItems] = useState<any[]>([]);
  const [kalodataItems, setKalodataItems] = useState<any[]>([]);
  const [manualItems, setManualItems] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'viral' | 'kalodata' | 'manual'>(() => {
    return (sessionStorage.getItem('produtos_filtro_ativo') as 'viral' | 'kalodata' | 'manual') || 'viral';
  });

  const isKalodataMode = activeFilter === 'kalodata';

  const salvarProdutosCache = (produtos: any[], fonte: 'viral' | 'kalodata' | 'manual') => {
    sessionStorage.setItem(`produtos_cache_v3_${fonte}`, JSON.stringify(produtos));
    sessionStorage.setItem(`produtos_cache_v3_time_${fonte}`, Date.now().toString());
  };

  const salvarFiltroAtivo = (filtro: 'viral' | 'kalodata' | 'manual') => {
    sessionStorage.setItem('produtos_filtro_ativo', filtro);
  };

  const loadManualProducts = () => {
    fetch('/api/produtos-manuais')
      .then(res => res.json())
      .then(data => {
        const activeOnly = data.filter((p: any) => p.ativo !== false);
        const enriched = activeOnly.map(enrichProduct).filter(Boolean);
        setManualItems(enriched);
        salvarProdutosCache(enriched, 'manual');
      })
      .catch(err => console.error("Erro ao carregar produtos manuais:", err));
  };

  const fetchKalodataSilently = async () => {
    try {
      const res = await fetch('/api/produtos');
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }
      const data = await res.json();
      const enriched = data.map(enrichProduct).filter(Boolean);
      setKalodataItems(enriched);
      salvarProdutosCache(enriched, 'kalodata');
    } catch (e) {
      // Log as a warning instead of a critical console.error to prevent automated alerts for silent background fetches
      console.warn("Informação: busca silenciosa Kalodata indisponível no momento.", e);
    }
  };

  useEffect(() => {
    // Check if the order saved in localStorage has changed relative to what was cached in sessionStorage
    const ordemSalva = localStorage.getItem('produtos_ordem_embaralhada');
    const ultimaOrdemAplicada = sessionStorage.getItem('produtos_cache_ultima_ordem');
    if (ordemSalva !== ultimaOrdemAplicada) {
      sessionStorage.removeItem('produtos_cache_v3_viral');
      if (ordemSalva) {
        sessionStorage.setItem('produtos_cache_ultima_ordem', ordemSalva);
      } else {
        sessionStorage.removeItem('produtos_cache_ultima_ordem');
      }
    }

    // 1. Load Viral Products (PRODUTOS_PRONTOS + PRODUTOS_EM_ALTA)
    const cacheViral = sessionStorage.getItem('produtos_cache_v3_viral');
    const cacheTimeViral = sessionStorage.getItem('produtos_cache_v3_time_viral');
    if (cacheViral && cacheTimeViral && Date.now() - Number(cacheTimeViral) < 30 * 60 * 1000) {
      setViralItems(JSON.parse(cacheViral));
    } else {
      const enrichedProntos = (getProdutosOrdenados() || []).map(enrichProduct).filter(Boolean);
      const enrichedEmAlta = (PRODUTOS_EM_ALTA || []).map(enrichProduct).filter(Boolean);
      const combined = [...enrichedProntos, ...enrichedEmAlta];
      const unique: any[] = [];
      const seen = new Set();
      for (const prod of combined) {
        const uniqueKey = prod.id || prod.nome || prod.name;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          unique.push(prod);
        }
      }
      setViralItems(unique);
      salvarProdutosCache(unique, 'viral');
    }

    // 2. Load Kalodata Products
    const cacheKalodata = sessionStorage.getItem('produtos_cache_v3_kalodata');
    const cacheTimeKalodata = sessionStorage.getItem('produtos_cache_v3_time_kalodata');
    if (cacheKalodata && cacheTimeKalodata && Date.now() - Number(cacheTimeKalodata) < 30 * 60 * 1000) {
      setKalodataItems(JSON.parse(cacheKalodata));
    } else {
      fetchKalodataSilently();
    }

    // 3. Load Manual Products
    const cacheManual = sessionStorage.getItem('produtos_cache_v3_manual');
    const cacheTimeManual = sessionStorage.getItem('produtos_cache_v3_time_manual');
    if (cacheManual && cacheTimeManual && Date.now() - Number(cacheTimeManual) < 30 * 60 * 1000) {
      setManualItems(JSON.parse(cacheManual));
    } else {
      loadManualProducts();
    }
  }, []);

  // Keep items synchronized with active filter
  useEffect(() => {
    if (activeFilter === 'viral') {
      setItems(viralItems);
    } else if (activeFilter === 'kalodata') {
      setItems(kalodataItems);
    } else if (activeFilter === 'manual') {
      setItems(manualItems);
    }
  }, [activeFilter, viralItems, kalodataItems, manualItems]);



  // Kalodata Search States
  const [showKalodataOverlay, setShowKalodataOverlay] = useState<boolean>(false);
  const [kalodataSearchPhase, setKalodataSearchPhase] = useState<number>(1);
  const [kalodataCounter, setKalodataCounter] = useState<number>(0);
  const [kalodataTotal, setKalodataTotal] = useState<number>(0);

  const triggerKalodataSearch = async () => {
    setShowKalodataOverlay(true);
    setKalodataSearchPhase(1);
    setKalodataCounter(0);
    setKalodataTotal(0);

    let fetchedData: any[] = [];
    try {
      const res = await fetch('/api/produtos');
      const data = await res.json();
      fetchedData = data.map(enrichProduct).filter(Boolean);
    } catch (e) {
      console.error(e);
    }

    setKalodataTotal(fetchedData.length);

    // Phase 1 (0-1s): "🔗 Conectando ao Kalodata..."
    setTimeout(() => {
      setKalodataSearchPhase(2);
    }, 1000);

    // Phase 2 (1-2s): "📊 Analisando produtos em alta no Brasil..."
    setTimeout(() => {
      setKalodataSearchPhase(3);
    }, 2000);

    // Phase 3 (2-3s): "🔥 Identificando tendências TikTok Shop..."
    setTimeout(() => {
      setKalodataSearchPhase(4);
      const total = fetchedData.length || 12;
      let current = 0;
      const interval = setInterval(() => {
        if (current < total) {
          current += Math.ceil(total / 10) || 1;
          if (current > total) current = total;
          setKalodataCounter(current);
        } else {
          clearInterval(interval);
        }
      }, 80);
    }, 3000);

    // Phase 4 complete (4s)
    setTimeout(() => {
      setKalodataItems(fetchedData);
      salvarProdutosCache(fetchedData, 'kalodata');
      setActiveFilter('kalodata');
      salvarFiltroAtivo('kalodata');
      setShowKalodataOverlay(false);
    }, 4000);
  };

  const [now, setNow] = useState<Date>(new Date());

  // Interactive Video Generation Modal States
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoProduct, setSelectedVideoProduct] = useState<any | null>(null);
  const [videoModalMode, setVideoModalMode] = useState<'UGC' | 'POV' | 'MOVIMENTO' | null>(null);
  const [videoModalStep, setVideoModalStep] = useState<number>(1);

  // Temporário para diagnóstico - remover depois
  useEffect(() => {
    if (showVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showVideoModal]);

  // UGC Wizard States inside Modal
  const [ugcAvatarId, setUgcAvatarId] = useState<string>('giovanna');
  const [ugcScenarioId, setUgcScenarioId] = useState<string>('quarto');
  const [ugcScriptText, setUgcScriptText] = useState<string>('');

  // POV Wizard States inside Modal
  const [povScenario, setPovScenario] = useState<string>('Bancada de Mármore');
  const [povHands, setPovHands] = useState<string>('Femininas Delicadas');
  const [povStyle, setPovStyle] = useState<string>('Textura e Acabamento');

  // Movimento Wizard States inside Modal
  const [movAvatarId, setMovAvatarId] = useState<string>('rafael');
  const [movScenario, setMovScenario] = useState<string>('estudio');
  const [movInteraction, setMovInteraction] = useState<string>('Segurando o produto');
  const [movPose, setMovPose] = useState<string>('De Frente');
  const [movPreset, setMovPreset] = useState<string>('zoom_in');
  const [movCustomText, setMovCustomText] = useState<string>('');

  // Prompt Results
  const [modalGeneratedImagePrompt, setModalGeneratedImagePrompt] = useState<string>('');
  const [modalGeneratedVideoPrompt, setModalGeneratedVideoPrompt] = useState<string>('');
  const [copyModalImageStatus, setCopyModalImageStatus] = useState(false);
  const [copyModalVideoStatus, setCopyModalVideoStatus] = useState(false);
  const [isGeneratingModalPrompt, setIsGeneratingModalPrompt] = useState(false);

  // TikTok Shop Affiliate Modal States
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [affiliateProduct, setAffiliateProduct] = useState<any | null>(null);
  const [affiliateStep, setAffiliateStep] = useState<'loading' | 'success'>('loading');
  const [affiliateLinkGenerated, setAffiliateLinkGenerated] = useState<string>('');

  const compileModalPrompt = (type: 'image' | 'video') => {
    if (!selectedVideoProduct) return '';
    const pName = selectedVideoProduct.nome || selectedVideoProduct.name || 'Produto';
    
    if (videoModalMode === 'UGC') {
      if (type === 'image') {
        const scenarioPreset = allScenarios.find(s => s.id === ugcScenarioId)?.description || 'cozy room background';
        const avatarPreset = allAvatars.find(a => a.id === ugcAvatarId)?.description || 'beautiful presenter';
        return `Selfie photo of a creator avatar. Avatar description: ${avatarPreset}. Location background: ${scenarioPreset}. The avatar is smiling naturally, holding the ${pName} in their hands. 9:16 vertical aspect ratio, realistic texture, cinematic lighting.`;
      } else {
        const avatarName = allAvatars.find(a => a.id === ugcAvatarId)?.name || 'Giovanna';
        return `HighViralSeller Studies video. 9:16 vertical ratio. Animated avatar ${avatarName} speaking directly to the camera with perfect mouth synchronization, reciting the script: "${ugcScriptText}". High retention UGC review, commercial grading, detailed clothing consistency.`;
      }
    } else if (videoModalMode === 'POV') {
      return `Vídeo POV (primeira pessoa) em 9:16 sobre uma ${povScenario}. Mãos ${povHands} seguram o ${pName}, girando-o para mostrar detalhes. A iluminação é natural e limpa. Um narrador descreve o produto com estilo ${povStyle}.`;
    } else if (videoModalMode === 'MOVIMENTO') {
      const avatarName = allAvatars.find(a => a.id === movAvatarId)?.name || 'Rafael';
      const scenarioPreset = allScenarios.find(s => s.id === movScenario)?.name || 'Estúdio';
      const movementText = movPreset === 'zoom_in' ? 'aproximação lenta (zoom-in)' : movPreset === 'giro' ? 'giro de 360 graus orbital' : movPreset === 'sweep' ? 'varredura lateral panorâmica' : movCustomText || 'movimento dinâmico de câmera';
      return `Vídeo comercial premium em 9:16 vertical. O apresentador virtual ${avatarName} está no cenário de ${scenarioPreset}, em pose ${movPose}, realizando a interação: ${movInteraction} com o produto ${pName}. A câmera executa um movimento profissional de ${movementText} focado no produto para destacar todos os detalhes de textura, com iluminação limpa de estúdio.`;
    }
    return '';
  };

  useEffect(() => {
    if (initialMovementId) {
      setVideoMode('UGC');
      setWizardStep(1); 
      setSelectedMovementId(initialMovementId);
    }
  }, [initialMovementId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper to get timeline block and countdown
  const getTimelineInfo = (currentDate: Date) => {
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    let activeBlockIndex = 0; // 0: 00-06, 1: 06-12, 2: 12-18, 3: 18-00
    let endHour = 6;

    if (hours >= 0 && hours < 6) {
      activeBlockIndex = 0;
      endHour = 6;
    } else if (hours >= 6 && hours < 12) {
      activeBlockIndex = 1;
      endHour = 12;
    } else if (hours >= 12 && hours < 18) {
      activeBlockIndex = 2;
      endHour = 18;
    } else {
      activeBlockIndex = 3;
      endHour = 24;
    }

    const currentTotalSeconds = hours * 3600 + minutes * 60 + seconds;
    const targetTotalSeconds = endHour * 3600;
    
    let diffSeconds = targetTotalSeconds - currentTotalSeconds;
    if (diffSeconds < 0) {
      diffSeconds = 0;
    }

    const h = Math.floor(diffSeconds / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    const s = diffSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    const countdownStr = `${pad(h)}:${pad(m)}:${pad(s)}`;

    return {
      activeBlockIndex,
      countdownStr
    };
  };

  const { activeBlockIndex, countdownStr } = getTimelineInfo(now);

  // Sum detected revenue (safely parsed from .price or falls back with a random range)
  const totalRevenue = items.reduce((acc, item) => {
    let rawPrice = (item as any).price || item.average_price || 52.90;
    let numericPrice = 52.90;
    if (typeof rawPrice === 'number') {
      numericPrice = rawPrice;
    } else if (typeof rawPrice === 'string') {
      let strToParse = rawPrice;
      if (strToParse.includes('-')) {
        strToParse = strToParse.split('-')[0];
      }
      const cleanStr = strToParse.replace(/[^\d.,]/g, '').replace(',', '.');
      const parsed = parseFloat(cleanStr);
      if (!isNaN(parsed)) {
        numericPrice = parsed;
      }
    }
    // Estimated sales volume over the tracking cycle (e.g. 5,000 to 12,000 sales per product)
    const estimatedSalesVolume = item.sales_30d || 8500;
    return acc + (numericPrice * estimatedSalesVolume);
  }, 0);

  const formatCompactValue = (val: number) => {
    if (val >= 1_000_000) {
      return `R$ ${(val / 1_000_000).toFixed(1)}M`;
    }
    if (val >= 1_000) {
      return `R$ ${(val / 1_000).toFixed(0)}K`;
    }
    return `R$ ${val.toFixed(2)}`;
  };

  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // States for Admin Add Product Modal
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminProdName, setAdminProdName] = useState('');
  const [adminProdImgUrl, setAdminProdImgUrl] = useState('');
  const [adminProdPrice, setAdminProdPrice] = useState('');
  const [adminProdCommission, setAdminProdCommission] = useState('');
  const [adminProdAffiliateLink, setAdminProdAffiliateLink] = useState('');
  const [adminProdTrend, setAdminProdTrend] = useState('');
  const [adminProdNiche, setAdminProdNiche] = useState('Beleza e Cosméticos');
  const [adminAddLoading, setAdminAddLoading] = useState(false);

  // Form states for custom add
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [niche, setNiche] = useState('Beleza e Cosméticos');
  const [imgUrl, setImgUrl] = useState('');
  const [score, setScore] = useState(85);
  const [competition, setCompetition] = useState<'baixa' | 'média' | 'alta'>('média');
  const [reason, setReason] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('todos');

  const nichesList = ['todos', 'Saúde', 'Beleza', 'Casa', 'Tecnologia', 'Fitness', 'Pet'];

  // Link/Product Input Analyzer States
  const [linkOrName, setLinkOrName] = useState('');
  const [targetAudience, setTargetAudience] = useState('Mulheres 25-40 Fitness');
  const [persuasionLevel, setPersuasionLevel] = useState('Ultra-Agressivo (TikTok)');
  const [isAnalyzingLink, setIsAnalyzingLink] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisSuccess, setAnalysisSuccess] = useState(false);

  // States for Editing Product Image (direct photo linkage from ads)
  const [editingProductForImage, setEditingProductForImage] = useState<TrendingProduct | null>(null);
  const [imageEditUrl, setImageEditUrl] = useState('');
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const handleUpdateProductImage = async (productId: string, newImageUrl: string) => {
    setIsUpdatingImage(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newImageUrl })
      });
      if (response.ok) {
        const updatedProd = await response.json();
        
        // Update local items state
        const updateProd = (list: any[]) => list.map(item => item.id === productId ? { ...item, image_url: updatedProd.image_url } : item);
        setViralItems(prev => {
          const updated = updateProd(prev);
          salvarProdutosCache(updated, 'viral');
          return updated;
        });
        setKalodataItems(prev => {
          const updated = updateProd(prev);
          salvarProdutosCache(updated, 'kalodata');
          return updated;
        });
        setManualItems(prev => {
          const updated = updateProd(prev);
          salvarProdutosCache(updated, 'manual');
          return updated;
        });
        
        // If the active wizard product is the one being edited, update it too
        if (activeWizardProduct && activeWizardProduct.id === productId) {
          setActiveWizardProduct(prev => prev ? { ...prev, image_url: updatedProd.image_url } : null);
        }
        
        // Propagate changes to parent App state
        if (onRefresh) {
          onRefresh();
        }
        return true;
      }
    } catch (err) {
      console.error("Erro ao atualizar imagem do produto:", err);
    } finally {
      setIsUpdatingImage(false);
    }
    return false;
  };

  const handleAnalyzeLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkOrName.trim()) return;

    setIsAnalyzingLink(true);
    setAnalysisError('');
    setAnalysisSuccess(false);

    try {
      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlOrName: linkOrName,
          targetAudience,
          persuasionLevel
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao processar a análise do produto.');
      }

      const analyzedProduct = await response.json();
      
      // Update manual state list and persist in cache
      setManualItems(prev => {
        const updated = [analyzedProduct, ...prev];
        salvarProdutosCache(updated, 'manual');
        return updated;
      });
      setActiveFilter('manual');
      salvarFiltroAtivo('manual');
      
      // Callback to root component if it exists
      if (onAddProduct) {
        onAddProduct(analyzedProduct);
      }

      setAnalysisSuccess(true);
      
      // Auto-load raw properties inside the ViralSeller wizard
      setTimeout(() => {
        if (analyzedProduct.speech_script) {
          setSpeechScript(analyzedProduct.speech_script);
        }
        if (analyzedProduct.avatar_prompt) {
          setAvatarText(analyzedProduct.avatar_prompt);
        }
        if (analyzedProduct.scenario_prompt) {
          setScenarioText(analyzedProduct.scenario_prompt);
        }
        if (analyzedProduct.movement_prompt) {
          setMovementText(analyzedProduct.movement_prompt);
        }

        setActiveWizardProduct(analyzedProduct);
        setWizardStep(2);
        
        // Reset inputs
        setLinkOrName('');
        setAnalysisSuccess(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Erro inesperado.');
    } finally {
      setIsAnalyzingLink(false);
    }
  };

  // Step-by-Step Interactive Wizard State (for ViralSeller prompt generator)
  const [activeWizardProduct, setActiveWizardProduct] = useState<TrendingProduct | null>(null);
  const [wizardStep, setWizardStep] = useState<number>(1); // Start directly at Step 1 (Product selection)
  const [videoMode, setVideoMode] = useState<'UGC' | 'POV' | 'MOVIMENTO'>('UGC');

  // POV Specific State Variables
  const [povScenarioSelected, setPovScenarioSelected] = useState<string>('🛋️ Sala Moderna');
  const [povScenarioDesc, setPovScenarioDesc] = useState<string>('Ambiente sofisticado e aconchegante.');
  const [povGloveOption, setPovGloveOption] = useState<'com_luva' | 'sem_luva'>('sem_luva');
  const [povGloveType, setPovGloveType] = useState<string>('Luvas Pretas de Neoprene');
  const [povHandGender, setPovHandGender] = useState<'Feminina' | 'Masculina' | 'Sem mãos'>('Feminina');
  const [povSkinColor, setPovSkinColor] = useState<string>('Clara');
  const [povPresentationStyle, setPovPresentationStyle] = useState<string>('Textura');

  // Movimento Specific State Variables
  const [movementSelectedMode, setMovementSelectedMode] = useState<string>(MOVEMENTS_PRESETS[0]?.id || 'cta_beijo');
  const [skippingMessage, setSkippingMessage] = useState<string | null>(null);
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);
// Curated scenarios states
  const [isCuratedScenario, setIsCuratedScenario] = useState<boolean>(true);
  const [activeScenarioCategory, setActiveScenarioCategory] = useState<'standard' | 'curated'>('curated');

  // Multi-take scripts states
  const [numTakes, setNumTakes] = useState<number>(1);
  const [takeTexts, setTakeTexts] = useState<string[]>(['', '', '', '', '']);
  const [selectedGender, setSelectedGender] = useState<'FEMININO' | 'MASCULINO'>('FEMININO');
  const [voiceTonality, setVoiceTonality] = useState<string>('Vibrante');
  const [voiceEnergy, setVoiceEnergy] = useState<string>('Alta');
  const [voiceTone, setVoiceTone] = useState<string>('Amigável');
  
  // Wizards input states
  const [avatarText, setAvatarText] = useState('');
  const [interactionSelected, setInteractionSelected] = useState<string>('B'); // A, B, C, or D
  const [interactionText, setInteractionText] = useState('O avatar segura e manipula o objeto para as lentes, com foco nas texturas.');
  const [scenarioText, setScenarioText] = useState('');
  const [movementText, setMovementText] = useState('');

  // Added States for Visual presets Selection
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [allAvatars, setAllAvatars] = useState<AvatarPreset[]>(AVATARS_PRESETS);
  const [allScenarios, setAllScenarios] = useState<ScenarioPreset[]>(SCENARIOS_PRESETS);
  const [allInteractions, setAllInteractions] = useState<{ id: string; name: string; description: string; englishText: string }[]>([]);

  // Helper to merge loaded lists with default presets to prevent losing custom items or software-updated defaults
  const mergePresetsWithDefaults = <T extends { id: string; videoUrl?: string; imageUrl?: string }>(loadedList: T[] | null, defaults: T[]): T[] => {
    if (!loadedList || loadedList.length === 0) return defaults;
    const merged = loadedList.map(item => {
      const def = defaults.find(d => d.id === item.id);
      if (def) {
        return {
          ...def,
          ...item,
          videoUrl: item.videoUrl || def.videoUrl,
          imageUrl: item.imageUrl || def.imageUrl,
        };
      }
      return item;
    });
    defaults.forEach(def => {
      if (!merged.some(item => item.id === def.id)) {
        merged.push(def);
      }
    });
    return merged;
  };

  useEffect(() => {
    // Definir presets de forma estática, importando diretamente dos arquivos de dados
    setAllAvatars(AVATARS_PRESETS);
    setAllScenarios(SCENARIOS_PRESETS);

    // Carregar interações configuradas
    const savedInteractions = localStorage.getItem('local_interactions_presets');
    const defaultInteractions = [
      { id: 'A', name: "Vestindo o produto", description: "O avatar apresentador estará vestindo fisicamente o artigo de venda.", englishText: "Wearing the product, full body or half body shot, natural pose, product clearly visible as part of the outfit, soft natural lighting, realistic photography style" },
      { id: 'B', name: "Segurando o produto", description: "O avatar segura e manipula o objeto para as lentes, com foco nas texturas.", englishText: "Holding the product with both hands, close-up focus on product textures and details, hands and product in sharp focus, neutral background, studio-style lighting" },
      { id: 'C', name: "Selfie no espelho com o produto", description: "Estilo gravação íntima e carismática de unboxing rápido no reflexo do espelho.", englishText: "Taking a mirror selfie with the product, intimate and casual unboxing style, phone visible in reflection, candid expression, soft indoor lighting, vertical framing" },
      { id: 'D', name: "Selfie normal com o produto em destaque", description: "Celular em ângulo alto focado no rosto com o produto posicionado lateralmente.", englishText: "Taking a selfie with the product highlighted, high-angle phone shot focused on the face, product positioned to the side and clearly visible, natural expression, bright lighting" },
      { id: 'E', name: "POV: Mãos usando e testando", description: "Primeira pessoa (POV), apenas as mãos aparecem interagindo com o produto em câmera lenta (sem rosto/avatar).", englishText: "First-person POV tight close-up shot, only elegant hands visible interacting with and using the product in slow-motion, showing meticulous touch, weight, material texture and premium craftsmanship, clean background with high-end ambient studio lighting, no faces visible." },
      { id: 'F', name: "ASMR / Textura ultra aproximada", description: "Câmera macro extremamente próxima revelando material, tampa, brilho e detalhes em alta definição sem diálogos.", englishText: "Extreme macro close-up macro lens shot of the physical product, revealing intricate surface textures, gloss, fine lid details, metallic or matte finishes under premium glowing showroom light, serene calm atmosphere, focusing purely on aesthetic physical design with no people visible." },
      { id: 'G', name: "Problema → Solução (Gancho Rápido)", description: "Inicia mostrando um incômodo/dor real, com corte rápido e rítmico para o produto trazendo a solução perfeita.", englishText: "Dynamic multi-scene commercial sequence. Starts with a quick visual cue of daily life frustration or problem, followed immediately by a fast rhythmic sharp cut to the product smoothly solving it. High-contrast energetic video framing with perfect focus on the action." },
      { id: 'H', name: "Unboxing Estético / Unwrapping", description: "Abertura minuciosa e rítmica da caixa e do plástico, revelando o produto em câmera lenta brilhante.", englishText: "Aesthetic unboxing experience sequence, hands opening the high-end product packaging in direct focus, showcasing paper or cardboard sound rhythm, slow elegant peel action, revealing the pristine polished product layout beneath, commercial unearthing presentation." },
      { id: 'I', name: "\"TikTok made me buy\" / Reação Genuína", description: "Estilo depoimento real, mostrando o rosto se surpreendendo positivamente com a qualidade do item recebido.", englishText: "Fast-paced genuine reaction and testimonial style, lifestyle presentation, happy facial expressions, holding the product up showing off a dynamic reveal, as if expressing natural discovery, high engagement viral video vibes." },
      { id: 'J', name: "Antes e Depois (Corte Rítmico)", description: "Comparação de transição magnética e satisfatória: situação antes sem o produto versus resultado impecável com ele.", englishText: "Rhythmic split-screen or quick cut before-and-after visual presentation. First half showing the suboptimal state/setup, followed by a sudden aesthetic high-contrast transition frame showing the incredible transformation after applying the product, high conversion viral visual hook." },
      { id: 'K', name: "Lifestyle / Detalhes de Ambiente", description: "Produto repousando em mesa premium sob luz solar suave, com movimento de câmera lento e artístico (foco no ambiente).", englishText: "Premium quiet luxury ambient lifestyle shot. The product is beautifully placed on an elegant wooden table or custom decorated surface with natural soft volumetric light filtering through, gentle cinematic panning shot highlighting the surroundings with absolute zero focus on active presenters." },
      { id: 'L', name: "UGC (Criador Orgânico)", description: "📱 Celular vertical (9:16) com expressões reais, cenários domésticos e movimentos nativos virais.", englishText: "UGC (User Generated Content) style recording, 9:16 vertical video captured on a high-end smartphone camera. A natural presentation looking directly at the lens with friendly guestures and warm expressions. High-converting viral review look, showing the physical product naturally with selfie close-ups." }
    ];

    if (savedInteractions) {
      try {
        const parsed = JSON.parse(savedInteractions);
        if (parsed.length < 12) {
          setAllInteractions(defaultInteractions);
        } else {
          setAllInteractions(parsed);
        }
      } catch (err) {
        setAllInteractions(defaultInteractions);
      }
    } else {
      setAllInteractions(defaultInteractions);
    }
  }, []);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [selectedMovementId, setSelectedMovementId] = useState<string>('');
  const [poseSelected, setPoseSelected] = useState<string>('De Frente');

  // Speech options
  const [hasSpeech, setHasSpeech] = useState<boolean>(true);
  const [speechScript, setSpeechScript] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);

  useEffect(() => {
    if (videoMode === 'UGC') {
      setHasSpeech(true);
    } else if (videoMode === 'POV') {
      setHasSpeech(true);
    }
    // MOVIMENTO: não alterar
  }, [videoMode]);

  // Fictional visual badges config
  const [salesBadgesEnabled, setSalesBadgesEnabled] = useState<boolean>(true);
  const [salesBadgesProbability, setSalesBadgesProbability] = useState<number>(40);
  const [salesBadgesList, setSalesBadgesList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const enabled = localStorage.getItem('local_sales_badges_enabled') !== 'false';
      setSalesBadgesEnabled(enabled);
      
      const prob = localStorage.getItem('local_sales_badges_probability');
      if (prob) {
        const parsed = parseInt(prob);
        setSalesBadgesProbability(isNaN(parsed) ? 40 : parsed);
      } else {
        setSalesBadgesProbability(40);
      }

      const listRaw = localStorage.getItem('local_sales_badges_list');
      if (listRaw) {
        setSalesBadgesList(JSON.parse(listRaw));
      } else {
        const fallbackList = [
          { id: '1', label: '🔥 Vendendo muito', color: 'red', icon: 'Flame' },
          { id: '2', label: '⚡ Em alta', color: 'amber', icon: 'Zap' },
          { id: '3', label: '⚠️ Últimas unidades', color: 'orange', icon: 'AlertTriangle' },
          { id: '4', label: '🌟 Mais procurado', color: 'cyan', icon: 'Sparkles' }
        ];
        setSalesBadgesList(fallbackList);
        localStorage.setItem('local_sales_badges_list', JSON.stringify(fallbackList));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (wizardStep === 2) {
      const preAvatarStr = localStorage.getItem('viralseller_avatar_pre');
      if (preAvatarStr) {
        try {
          const preAvatar = JSON.parse(preAvatarStr);
          setSelectedAvatarId(preAvatar.id);
          setAvatarText(preAvatar.description || '');
          setSkippingMessage(`✅ Avatar: ${preAvatar.nome} (pré-selecionado)`);
          localStorage.removeItem('viralseller_avatar_pre');
          
          setTimeout(() => {
            setSkippingMessage(null);
            setWizardStep(3);
          }, 1000);
        } catch (e) {}
      }
    }

    if (wizardStep === 5 && videoMode === 'MOVIMENTO') {
      const preMovStr = localStorage.getItem('viralseller_movimento_pre');
      if (preMovStr) {
        try {
          const preMov = JSON.parse(preMovStr);
          setMovementSelectedMode(preMov.id);
          if (preMov.prompt) setMovementText(preMov.prompt);
          setSkippingMessage(`✅ Movimento: ${preMov.name || 'Personalizado'} (pré-selecionado)`);
          localStorage.removeItem('viralseller_movimento_pre');
          
          setTimeout(() => {
            setSkippingMessage(null);
            setShouldAutoGenerate(true);
          }, 1000);
        } catch (e) {}
      }
    }
  }, [wizardStep, videoMode]);

  // Generation status
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [copyImageStatus, setCopyImageStatus] = useState(false);
  const [copyVideoStatus, setCopyVideoStatus] = useState(false);
  const [showViralSellerModal, setShowViralSellerModal] = useState(false);
  const [copiedAvatarLink, setCopiedAvatarLink] = useState(false);
  const [copiedProductLink, setCopiedProductLink] = useState(false);
  const [copiedScenarioLink, setCopiedScenarioLink] = useState(false);
  const [copiedMovementPrompt, setCopiedMovementPrompt] = useState(false);
  const [selectedMovementForModal, setSelectedMovementForModal] = useState<MovementPreset | null>(null);

  // TikTok Live Synchronization states
  const [isSyncingTikTok, setIsSyncingTikTok] = useState(false);
  const [syncTikTokSuccess, setSyncTikTokSuccess] = useState(false);
  const [syncTikTokMessage, setSyncTikTokMessage] = useState('');

  const handleTikTokSync = async () => {
    setIsSyncingTikTok(true);
    setSyncTikTokSuccess(false);
    setSyncTikTokMessage('Buscando e analisando tendências de vendas nacionais...');

    try {
      const res = await fetch('/api/produtos');
      const data = await res.json();
      const fetchedData = data.map(enrichProduct).filter(Boolean);
      
      setKalodataItems(fetchedData);
      salvarProdutosCache(fetchedData, 'kalodata');
      setActiveFilter('kalodata');
      salvarFiltroAtivo('kalodata');
      setSyncTikTokSuccess(true);
      setSyncTikTokMessage('Sincronizado em tempo real! Os produtos de alta conversão foram carregados.');
      setTimeout(() => {
        setSyncTikTokSuccess(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setSyncTikTokMessage('Conexão instável. Usando banco estritamente otimizado de tendências.');
      setTimeout(() => {
        setIsSyncingTikTok(false);
      }, 3500);
      return;
    } finally {
      setIsSyncingTikTok(false);
    }
  };

  const handleTriggerAffiliation = (produto: any) => {
    const webLink = produto?.afiliado?.link 
      || produto?.affiliate_links?.tiktok 
      || produto?.affiliate_links?.shopee 
      || '';

    if (!webLink) return;

    // Extrai o ID do produto do link
    const match = webLink.match(/\/product\/(\d+)/);
    const productId = match ? match[1] : null;

    // Link direto da loja do TikTok Shop
    const shopLink = productId
      ? `https://shop.tiktok.com/view/product/${productId}`
      : webLink;

    window.open(shopLink, '_blank');
  };

  const handleTriggerVideoGeneration = (product: any) => {
    setSelectedVideoProduct(product);

    const preSelectedMode = localStorage.getItem('viralseller_video_mode');
    if (preSelectedMode) {
      setVideoMode(preSelectedMode as any);
      setActiveWizardProduct(product);
      setAvatarText('');
      setScenarioText('');
      setMovementText('');
      setHasSpeech(true);
      const safeDesc = (product.description || 'é sensacional').toLowerCase().replace(/\.$/, '');
      const defaultScript = `Olha esse produto incrível! O ${product.nome || product.name || 'Produto'} é perfeito porque ${safeDesc}. Garanta já o seu no link!`;
      setSpeechScript(defaultScript);
      setTakeTexts([defaultScript, '', '', '', '']);
      
      if (preSelectedMode === 'UGC') {
        setInteractionSelected('L');
        setInteractionText('📱 Celular vertical (9:16) com expressões reais, cenários domésticos e movimentos nativos virais.');
      } else if (preSelectedMode === 'POV') {
        setInteractionSelected('E');
        setInteractionText('Primeira pessoa (POV), apenas as mãos aparecem interagindo com o produto em câmera lenta (sem rosto/avatar).');
      } else if (preSelectedMode === 'MOVIMENTO') {
        setInteractionSelected('B');
        setInteractionText('O avatar segura e manipula o objeto para as lentes, com foco nas texturas.');
      }
      
      setWizardStep(2);
      setShowVideoModal(false);
      localStorage.removeItem('viralseller_video_mode');
      return;
    }

    setVideoModalMode(null); // first show choices: UGC, POV, Movimento
    setVideoModalStep(1);
    
    // Set default editable values
    setUgcScriptText(product.prompts?.ugc || '');
    setUgcAvatarId('giovanna');
    setUgcScenarioId('quarto');

    setPovScenario('Bancada de Mármore');
    setPovHands('Femininas Delicadas');
    setPovStyle('Textura e Acabamento');

    setMovAvatarId('rafael');
    setMovScenario('estudio');
    setMovInteraction('Segurando o produto');
    setMovPose('De Frente');
    setMovPreset('zoom_in');
    setMovCustomText('');

    setModalGeneratedImagePrompt('');
    setModalGeneratedVideoPrompt('');

    setTimeout(() => setShowVideoModal(true), 0);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    onAddProduct({
      name,
      description,
      niche,
      image_url: imgUrl || "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=300",
      opportunity_score: score,
      competition_level: competition,
      trend_reason: reason || "Crescendo em visualizações orgânicas no TikTok."
    });

    // Reset Form
    setName('');
    setDescription('');
    setImgUrl('');
    setReason('');
    setShowAdd(false);
  };

  const filteredItems = useMemo(() => items.filter((item) => {
    if (!item) return false;
    const itemName = String(item.name || '');
    const itemNiche = String(item.niche || '');
    const itemDesc = String(item.description || '');

    const matchesSearch = itemName.toLowerCase().includes(search.toLowerCase()) || 
      itemNiche.toLowerCase().includes(search.toLowerCase()) || 
      itemDesc.toLowerCase().includes(search.toLowerCase());

    let normalized = itemNiche;
    if (itemNiche.includes('Saúde')) normalized = 'Saúde';
    else if (itemNiche.includes('Beleza')) normalized = 'Beleza';
    else if (itemNiche.includes('Casa') || itemNiche.includes('Cozinha')) normalized = 'Casa';
    else if (itemNiche.includes('Tecnologia')) normalized = 'Tecnologia';
    else if (itemNiche.includes('Fitness')) normalized = 'Fitness';
    else if (itemNiche.includes('Pet')) normalized = 'Pet';

    const matchesNiche = selectedNiche === 'todos' || normalized === selectedNiche;

    return matchesSearch && matchesNiche;
  }), [items, search, selectedNiche]);

  // Dynamic Suggestions Helpers
  const getAvatarSuggestions = (product: TrendingProduct) => {
    const n = (product?.niche || '').toLowerCase();
    if (n.includes('beleza') || n.includes('cosmético')) {
      return [
        "Uma jovem influenciadora de beleza de 23 anos, pele radiante e impecável, maquiagem natural ultra suave, estilo casual moderno.",
        "Uma especialista estética profissional de 30 anos com jaleco branco fino, sorriso acolhedor e estilo elegante minimalista.",
        "Uma criadora de 28 anos, estilo casual esportivo, cabelos presos, pele bronzeada saudável, passando muita simpatia e carisma."
      ];
    } else if (n.includes('tecnologia') || n.includes('eletrônico')) {
      return [
        "Um criador de tecnologia masculino de 26 anos, estilo hacker geek moderno, camiseta preta fosca de algodão, óculos modernos.",
        "Um profissional de escritório dinâmico de 31 anos, blazer cinza sem gravata, estilo corporativo moderno e gestos diretos.",
        "Uma jovem de 21 anos descolada, estilo casual com jaqueta oversized, óculos de aro fino e fones de ouvido modernos no pescoço."
      ];
    } else if (n.includes('casa') || n.includes('organização') || n.includes('cozinha')) {
      return [
        "Uma dona de casa acolhedora de 34 anos com avental de algodão estético, sorriso caloroso e penteado despojado.",
        "Um jovem desenvolvedor organizado de 27 anos, suéter de tricô cinza claro, estilo minimalista escandinavo moderno.",
        "Uma personal organizer profissional de 29 anos, camisa social azul clara perfeitamente passada, fisionomia calma e focada."
      ];
    } else if (n.includes('saúde') || n.includes('fitness') || n.includes('bem-estar')) {
      return [
        "Uma personal trainer atlética de 25 anos vestindo top esportivo preto texturizado, rabo de cavalo alto e olhar motivador.",
        "Um atleta focado de 28 anos com camiseta dry-fit cinza, físico tonificado, sorriso de alta energia e postura ativa.",
        "Uma instrutora de ioga de 32 anos de expressão pacífica e serena, roupas confortáveis de linho e visual zen."
      ];
    } else if (n.includes('pet')) {
      return [
        "Uma dona de pets amigável de 24 anos com suéter felpudo azul-bebê, visual acolhedor e atencioso.",
        "Um adestrador carismático de 29 anos com camisa polo verde oliva, estilo ativo para ambientes externos e sorriso confiante."
      ];
    } else {
      return [
        "Uma apresentadora comercial carismática de 26 anos, gola alta neutra, maquiagem leve de estúdio, olhar confiante.",
        "Um jovem criador dinâmico de 23 anos de marketing viral, jaqueta de couro minimalista e gesticulação natural."
      ];
    }
  };

  const getScenarioSuggestions = (product: TrendingProduct, interactionKey: string) => {
    const n = (product?.niche || '').toLowerCase();
    const isSelfie = interactionKey === 'C' || interactionKey === 'D';

    if (n.includes('beleza') || n.includes('cosmético')) {
      return [
        isSelfie ? "Espelho luxuoso de camarim iluminado com LEDs quentes e fundo minimalista desfocado." : "Estúdio comercial moderno com luzes LED de fundo em tom neon rosa e azul pastel.",
        "Banheiro residencial requintado de alto padrão, bancada de mármore branco e frascos estéticos de vidro.",
        "Quarto aconchegante de hotel boutique com sol suave de fim de tarde entrando pelas cortinas.",
        "Penteadeira de maquiagem clean com flores de eucalipto secas e espelho redondo decorativo."
      ];
    } else if (n.includes('tecnologia') || n.includes('eletrônico')) {
      return [
        "Setup de mesa gamer tecnológica com fitas de LED RGB azul ciano escuro e monitores modernos.",
        "Estúdio fotográfico com mesa de ardósia cinza fosca minimalista e luminária articulada industrial.",
        "Sala de estar inteligente equipada com TV grande de fundo e painel ripado de carvalho clássico.",
        "Escritório executivo contemporâneo iluminado com spots focais de trilho suspensos modernos."
      ];
    } else if (n.includes('casa') || n.includes('organização') || n.includes('cozinha')) {
      return [
        "Cozinha americana integrada gourmet de luxo com armários escuros e bancada de quartzo clara.",
        "Closet residencial estético com roupas perfeitamente sequenciadas em cabides de madeira.",
        "Mesa rústica de sala de jantar decorada com tigelas de argila e luz solar difusa natural.",
        "Área de serviço altamente organizada com gavetas translúcidas rotuladas e cestos modernos."
      ];
    } else if (n.includes('saúde') || n.includes('fitness') || n.includes('bem-estar')) {
      return [
        "Sala de academia crossfit espaçosa com piso de borracha preta e luz de preenchimento concentrada.",
        "Parque urbano ensolarado com gramado impecável de fundo e céu azul limpo.",
        "Estúdio de yoga minimalista aquecido por luz amarela difusa e velas aromáticas decorativas.",
        "Varanda de condomínio moderna de frente para uma paisagem natural arborizada com iluminação de golden hour."
      ];
    } else {
      return [
        "Estúdio fotográfico comercial interno com fundo infinito cinza claro neutro de alta costura.",
        "Sala de estar moderna com poltrona de linho cinza e candelabro moderno suspenso.",
        "Espaço moderno repleto de luz natural, vasos minimalistas com costela-de-adão e espelho curvo.",
        "Frente de uma vitrine comercial moderna descolada com luzes arquitetônicas desfocadas em bokeh."
      ];
    }
  };

  const getMovementSuggestions = (product: TrendingProduct, interactionKey: string) => {
    if (interactionKey === 'A') {
      return [
        "Dar um giro lento de 360 graus exibindo o caimento do produto vestido enquanto aponta para ele.",
        "Ajustar a peça no corpo olhando para a lente com um sorriso de total satisfação comercial.",
        "Caminhar confiante em direção à câmera, tocando levemente no tecido refinado do produto.",
        "Fazer uma pose descontraída para miniatura de vídeo e acenar positivamente com a cabeça."
      ];
    } else if (interactionKey === 'B') {
      return [
        "Segurar o item firmemente na altura do peito, girando-o de um lado para o outro para mostrar texturas.",
        "Aproximar o produto devagar da lente simulando um close-up estético e focado, sorrindo de leve.",
        "Apresentar o produto repousado na palma das mãos e fazer sinal positivo de 'joiando' com a outra.",
        "Demonstrar o uso básico do produto operando-o com gestos calmos e extremamente profissionais."
      ];
    } else if (interactionKey === 'C') {
      return [
        "Posicionar o telefone acima do ombro refletido no espelho, sorrindo e inclinando a cabeça levemente.",
        "Mover o corpo em ângulos laterais alternados para mostrar em detalhe os reflexos do produto estético.",
        "Fazer uma pose despojada de selfie com um sinal de 'paz e amor' segurando o celular firme no espelho.",
        "Dar um leve zoom no espelho e sorrir com olhar expressivo demonstrando felicidade imediata."
      ];
    } else {
      return [
        "Segurar a câmera em estilo selfie na altura do rosto enquanto aponta o indicador para o produto lateral.",
        "Iniciar com o produto desfocado em close e trazê-lo para o lado do rosto abrindo o olhar de surpresa.",
        "Acenar alegremente no início do vídeo em plano médio e apontar com as duas mãos para o produto em alta.",
        "Fazer uma expressão espontânea de aprovação levantando as sobrancelhas ao acionar o item na selfie."
      ];
    }
  };
 
  const translatePose = (pose: string) => {
    const dict: Record<string, string> = {
      'De Frente': 'Front view, facing the camera directly',
      'De Lado': 'Side profile view',
      'Ângulo 3/4': 'Three-quarters 3/4 angle view',
      'Sentado(a)': 'Sitting position',
      'Andando': 'Walking slowly and naturally',
      'Personalizada': 'Custom specific pose',
      'Plano Médio': 'Medium shot',
      'Close-up': 'Close-up shot',
      'Plano Inteiro': 'Full body shot'
    };
    return dict[pose] || pose || 'Front view';
  };

  const translateInteraction = (inter: string, customText: string) => {
    const matched = allInteractions.find(i => i.name === inter || i.id === inter);
    if (matched && (matched as any).basePrompt) {
      return `${(matched as any).basePrompt} ${customText ? `(Adicional: ${customText})` : ''}`;
    }
    if (matched && matched.englishText) return `${matched.englishText} ${customText ? `(Adicional: ${customText})` : ''}`;
    const dict: Record<string, string> = {
      'Vestindo o produto': 'Wearing the product, full body or half body shot, natural pose, product clearly visible as part of the outfit, soft natural lighting, realistic photography style',
      'Segurando o produto': 'Holding the product with both hands, close-up focus on product textures and details, hands and product in sharp focus, neutral background, studio-style lighting',
      'Selfie no espelho com o produto': 'Taking a mirror selfie with the product, intimate and casual unboxing style, phone visible in reflection, candid expression, soft indoor lighting, vertical framing',
      'Selfie normal com o produto em destaque': 'Taking a selfie with the product highlighted, high-angle phone shot focused on the face, product positioned to the side and clearly visible, natural expression, bright lighting'
    };
    return (dict[inter] || inter || 'showcasing the product') + (customText ? ` - ${customText}` : '');
  };

  const translateScenario = (scenId: string, customText: string) => {
    const matched = allScenarios.find(s => s.id === scenId);
    if (matched && (matched as any).basePrompt) {
      return `${(matched as any).basePrompt} ${customText ? `(Adicional: ${customText})` : ''}`;
    }
    const dict: Record<string, string> = {
      'quarto': 'a cozy warm bedroom with fairy lights background',
      'estudio': 'a professional commercial recording studio with spot lights and neon background',
      'ar_livre': 'a gorgeous sunny outdoor natural park with green grass',
      'academia': 'a modern fitness gym facility with LED rack lights',
      'cozinha': 'a premium modern kitchen with quartz counter',
      'banheiro': 'a clean luxury modern bathroom with marbled walls',
      'shopping': 'elegant retail store windows and lit corridors with a fine bokeh background',
      'natureza': 'gorgeous distant lush mountains under a beautiful sunny summer sky',
      'minimalista': 'a minimal clean Scandinavian living room'
    };
    if (scenId && dict[scenId]) return dict[scenId];
    return customText || 'a professional showroom background';
  };

  const translateAvatar = (avatarId: string, customText: string) => {
    if (avatarId === 'CUSTOM_PHOTO') {
      return 'a realistic beautiful presenter avatar based on the uploaded reference image';
    }
    const dict: Record<string, string> = {
      'giovanna': 'a charismatic blonde influencer avatar with loose hair',
      'beatriz': 'an intelligent female presenter avatar with modern glasses and dark sweater',
      'clara': 'a radiant redhead female influencer avatar with a warm smile',
      'theresa': 'a beautiful brunette influencer avatar with long curly hair',
      'valentina': 'an elegant female presenter avatar with minimal makeup and white silk top',
      'aurora': 'a professional redhead female presenter avatar in a modern style',
      'rafael': 'a modern male presenter avatar with short styled beard and black polo shirt',
      'caio': 'a trendy young male influencer avatar wearing an urban graphic t-shirt',
      'davi': 'a charismatic black male athlete avatar wearing a sports top',
      'lucas': 'a classic looking young male presenter avatar in a clean white t-shirt',
      'aisha': 'an elegant black female presenter avatar with long curly hair',
      'felipe': 'a mature professional male presenter avatar with a greyish beard'
    };
    if (avatarId && dict[avatarId]) return dict[avatarId];
    return customText || 'a realistic beautiful presenter avatar';
  };

  const translateMovement = (mvId: string, customText: string) => {
    const dict: Record<string, string> = {
      'cta_beijo': 'slowly blowing a kiss towards the camera then pointing downward smiling',
      'tape_camera': 'covering the camera lens with their hand and pulling it away to reveal the product',
      'esperando_pacote': 'holding a sealed TikTok Shop shipping package in the foreground excitedly',
      'unbox_unhas': 'lightly tapping long beautiful nails on the product container showing textures',
      'apresentacao_direta': 'extending the product forward for a clean close-up then smiling',
      'apontando_lateralmente': 'standing on the side pointing with the index finger highlighting the product',
      'revelacao_admiracao': 'gazing at the product with wide eyes and a bright expression of pure admiration',
      'apontando_com_dedo': 'using their finger to highlight and detail the elegant parts of the product',
      'mao_na_camera': 'reaching out towards the camera screen in a warm personal gesture',
      'mostrando_no_celular': 'holding a smartphone up displaying reviews and unboxing testimonials'
    };
    if (mvId && dict[mvId]) return dict[mvId];
    return customText || 'active camera panning';
  };

  const handleGeneratePrompt = async (forcedMovementId?: string) => {
    if (!activeWizardProduct) return;
    setIsLoadingPrompt(true);
    setGeneratedPrompt('');
    setGeneratedImagePrompt('');

    const targetMovementId = forcedMovementId || (videoMode === 'MOVIMENTO' ? movementSelectedMode : selectedMovementId);
    if (forcedMovementId) {
      setMovementSelectedMode(forcedMovementId);
      setSelectedMovementId(forcedMovementId);
    }

    // Determine values depending on videoMode
    let imgPrompt = '';
    let videoPromptMain = '';
    let formatted = '';

    // Aggregated dialogue text if hasSpeech is enabled
    const activeTakesText = takeTexts.slice(0, numTakes).filter(t => t.trim() !== '');
    const aggregatedSpeech = activeTakesText.join(' ');
    const videoAudioState = hasSpeech && aggregatedSpeech
      ? `Speech is enabled. Voice settings: Gender=${selectedGender}, Tonality=${voiceTonality}, Energy=${voiceEnergy}, Tone=${voiceTone}. The avatar speaks directly to the camera with perfect mouth-to-audio synchronization, speaking natively in Brazilian Portuguese (PT-BR) and reciting exactly this spoken dialogue: "${aggregatedSpeech}"`
      : `Completely silent. The video will be silent with absolutely no spoken dialogue, speech, or vocal audio.`;

    const annexInstructions = `\n\n📌 **COMO ANEXAR SEUS RECURSOS NO VIRALSELLER:**
1. Baixe as fotos e prompts de apoio acima.
2. Primeiro, anexe a Foto do seu Produto e a Foto do seu Avatar no seu gerador de imagem na Opção de Referência para gerar 4 fotos exclusivas do avatar segurando o produto real sem nenhuma distorção fictícia.
3. Em seguida, uploade essas 4 fotos geradas na seção de Frames de Início/Referência do seu gerador de vídeo do ViralSeller.
4. Cole o prompt de vídeo abaixo no prompt do ViralSeller. A IA usará obrigatoriamente as 4 imagens anexas como guias sequenciais de keyframe real para animar com 100% de consistência!`;

    if (videoMode === 'UGC') {
      const interactionLabels: Record<string, string> = {};
      allInteractions.forEach(i => {
        interactionLabels[i.id] = i.name;
      });

      const finalAvatar = avatarText || "An elegant presenter, professional look.";
      const finalScenario = isCuratedScenario 
        ? `Curated ready-made environment: ${selectedScenarioId ? CURATED_SCENARIOS_PRESETS.find(s => s.id === selectedScenarioId)?.name || 'Studio' : 'Studio'}`
        : `${scenarioText || "Modern dynamic studio."} (Avatar posicionado: ${poseSelected})`;

      const currentAvatarPreset = allAvatars.find(a => a.id === selectedAvatarId);
      const hasEditedAvatar = currentAvatarPreset ? avatarText !== currentAvatarPreset.description : (avatarText.trim() !== '' && avatarText !== 'An elegant presenter, professional look.');

      const currentScenarioPreset = allScenarios.find(s => s.id === selectedScenarioId);
      const hasEditedScenario = currentScenarioPreset ? scenarioText !== currentScenarioPreset.description : (scenarioText.trim() !== '' && scenarioText !== 'Modern dynamic studio.');

      const engAvatar = hasEditedAvatar ? finalAvatar : translateAvatar(selectedAvatarId, finalAvatar);
      const engPose = translatePose(poseSelected);
      const engScenario = hasEditedScenario ? finalScenario : (isCuratedScenario ? finalScenario : translateScenario(selectedScenarioId, scenarioText));
      // In UGC Mode, we don't have interaction step, so it is just default or empty string
      const engInteraction = translateInteraction(interactionLabels[interactionSelected] || 'B', interactionText || '');

      if (isCuratedScenario) {
        imgPrompt = PROMPT_CENARIO_PRONTO_FIXO;
      } else {
        imgPrompt = `Generate separate individual images, each as its own standalone full-frame photo, showing the interaction between the uploaded product image and the uploaded avatar image.
These instructions are written assuming the user has uploaded their chosen product photo and avatar photo directly into ViralSeller.
- Avatar Selected: ${engAvatar}
- Scenario Selected: ${engScenario}
- Pose Selected: ${engPose}
Strictly maintain 100% visual and physical consistency utilizing the uploaded product and avatar reference images. Do not introduce any details, styles, colors, characters, clothing, or features not explicitly listed here.
IMPORTANT: Do not combine multiple images into a single collage, grid, contact sheet, or split-panel layout. Each image must be a complete, independent photo occupying the full frame — no borders, no multi-panel composition, no thumbnails arranged together.`;
      }

      videoPromptMain = `Generate a high-retention UGC review video using the images produced by Prompt 1 as starting reference keyframes.
The video must strictly and exclusively maintain fidelity to the visual details of these starting images.
- Avatar: ${engAvatar} (${engPose})
- Scenario Background: ${engScenario}
- Audio/Speech: ${videoAudioState}
Strictly maintain 100% structural and clothing consistency with the reference starting frames. Do not introduce any details, products, avatars, movements, or scenarios that were not explicitly chosen in these steps. No captions, no subtitles, no written text or overlays of any kind on screen, clean commercial video frames only.`;

      formatted = `---
✅ RESUMO DAS SUAS ESCOLHAS DO VIRALSELLER (MODO UGC):
- Produto: ${activeWizardProduct.name}
- Enquadramento / Pose: ${poseSelected}
- Avatar Escolhido: ${selectedAvatarId ? allAvatars.find(a => a.id === selectedAvatarId)?.name || 'Customizado' : 'Customizado'}
- Cenário Escolhido: ${isCuratedScenario ? (CURATED_SCENARIOS_PRESETS.find(s => s.id === selectedScenarioId)?.name || 'Pronto') : (selectedScenarioId ? allScenarios.find(s => s.id === selectedScenarioId)?.name || 'Customizado' : 'Customizado')}
- Estado de Áudio: ${hasSpeech ? `Ativado (Locução em PT-BR, ${numTakes} take(s))` : 'Silencioso (Sem Fala)'}

---
Your detailed prompt in English for HighViralSeller Studies.

${videoPromptMain}${annexInstructions}`;

    } else if (videoMode === 'POV') {
      const povScenarioTranslations: Record<string, string> = {
        '🛋️ Sala Moderna': 'Sophisticated and cozy modern living room environment with soft lighting, warm details, and elegant furniture.',
        '👨🍳 Cozinha Gourmet': 'Complete and functional gourmet kitchen environment, high-end clean countertops, modern kitchen appliances.',
        '🏋️ Academia Home': 'Energetic home gym fitness training area, barbell weights and fitness accessories in the background with glowing LED strips.',
        '🛁 Spa & Banho': 'Serene and luxurious spa-like bathroom, marble finish, beautiful candles, folded towels, and premium relaxing vibe.',
        '🚗 Garagem Estilo': 'Stylish designer garage and automotive showroom style space, clean reflections on floors, car accessories in the background.',
        '📸 Estúdio Criativo': 'Creative workspace studio for content creation, professional soft light boxes, and beautiful neon ambient glow.'
      };
      const povScenarioEnglish = povScenarioTranslations[povScenarioSelected] || 'cozy modern indoor background';

      let povHandsEnglish = '';
      if (povHandGender === 'Sem mãos') {
        povHandsEnglish = 'No hands visible, focus is entirely on a pure cinematic product closeup.';
      } else {
        const isGlove = povGloveOption === 'com_luva';
        if (isGlove) {
          povHandsEnglish = `A pair of professional ${povHandGender === 'Feminina' ? 'feminine' : 'masculine'} hands wearing premium Black Neoprene gloves are holding, showcasing, and presenting the product.`;
        } else {
          povHandsEnglish = `A pair of neat human ${povHandGender === 'Feminina' ? 'feminine' : 'masculine'} hands with ${povSkinColor === 'Clara' ? 'fair' : povSkinColor === 'Morena' ? 'tan' : 'dark'} skin tone are gently holding, rotating, and presenting the product.`;
        }
      }

      const povStyleTranslations: Record<string, string> = {
        'Textura': 'high-fidelity closeup focusing on the rich material textures, fine physical surface details, and grain.',
        'Acabamento': 'extreme closeup highlighting the edge polish, luxury finish, and precise build craftsmanship.',
        'Premium': 'luxury aesthetic close-ups with cinematic lighting, premium studio grading, and slow-motion pans.',
        'Tamanho Real': 'realistic proportional scale showing the exact product size and proportions relative to the human hands.',
        'Funcionalidade': 'functional demonstration of the product in action, showcasing how it works, clicks, or opens.'
      };
      const povStyleEnglish = povStyleTranslations[povPresentationStyle] || 'cinematic presentation focus';

      imgPrompt = `Generate separate individual close-up images, each as its own standalone full-frame photo, showing the product "${activeWizardProduct.name}" in a POV perspective.
- Background Environment: ${povScenarioEnglish}
- Hands Action: ${povHandsEnglish}
- Detail Aesthetic Focus: ${povStyleEnglish}
Strictly maintain 100% visual and material consistency. Each image must be a complete, independent photo occupying the full frame — no borders, no split-panel collage layouts.`;

      videoPromptMain = `POV (Point of View) commercial product showcase video in vertical 9:16 format. Reference Image: Prompt 1 images.
- Background Environment Scenario: ${povScenarioEnglish}
- Hands Action & Showcase: ${povHandsEnglish}
- Detail Focus Aesthetic: ${povStyleEnglish}
- Audio/Speech: ${videoAudioState}
Strictly maintain 100% structural consistency with the starting reference frames. Perfect hand interactions, high retention presentation, smooth slow-motion panning camera, clear close-up textures, zero overlays, zero text on screen, clean high-end commercial frames only.`;

      formatted = `---
✅ RESUMO DAS SUAS ESCOLHAS DO VIRALSELLER (MODO POV):
- Produto: ${activeWizardProduct.name}
- Cenário POV: ${povScenarioSelected}
- Aparência das Mãos: ${povHandGender} ${povGloveOption === 'com_luva' ? '(Com Luvas)' : `(Pele: ${povSkinColor})`}
- Estilo de Apresentação: ${povPresentationStyle}
- Estado de Áudio: ${hasSpeech ? `Ativado (Locução em PT-BR, ${numTakes} take(s))` : 'Silencioso (Sem Fala)'}

---
Your detailed prompt in English for HighViralSeller Studies.

${videoPromptMain}${annexInstructions}`;

    } else {
      // MOVIMENTO
      const interactionLabels: Record<string, string> = {};
      allInteractions.forEach(i => {
        interactionLabels[i.id] = i.name;
      });

      const finalAvatar = avatarText || "An elegant presenter, professional look.";
      const finalScenario = isCuratedScenario 
        ? `Curated ready-made environment: ${selectedScenarioId ? CURATED_SCENARIOS_PRESETS.find(s => s.id === selectedScenarioId)?.name || 'Studio' : 'Studio'}`
        : `${scenarioText || "Modern dynamic studio."} (Avatar posicionado: ${poseSelected})`;

      const currentAvatarPreset = allAvatars.find(a => a.id === selectedAvatarId);
      const hasEditedAvatar = currentAvatarPreset ? avatarText !== currentAvatarPreset.description : (avatarText.trim() !== '' && avatarText !== 'An elegant presenter, professional look.');

      const currentScenarioPreset = allScenarios.find(s => s.id === selectedScenarioId);
      const hasEditedScenario = currentScenarioPreset ? scenarioText !== currentScenarioPreset.description : (scenarioText.trim() !== '' && scenarioText !== 'Modern dynamic studio.');

      const engAvatar = hasEditedAvatar ? finalAvatar : translateAvatar(selectedAvatarId, finalAvatar);
      const engPose = translatePose(poseSelected);
      const engScenario = hasEditedScenario ? finalScenario : (isCuratedScenario ? finalScenario : translateScenario(selectedScenarioId, scenarioText));
      const engInteraction = translateInteraction(interactionLabels[interactionSelected], interactionText);

      const matchedMovement = MOVEMENTS_PRESETS.find(m => m.id === targetMovementId);
      let movementSelectedDesc = 'smooth cinematic camera panning';
      if (matchedMovement) {
        if ((matchedMovement as any).basePrompt) {
          movementSelectedDesc = (matchedMovement as any).basePrompt;
        } else if (matchedMovement.promptText) {
          movementSelectedDesc = matchedMovement.promptText;
        } else {
          movementSelectedDesc = matchedMovement.description;
        }
      }

      if (isCuratedScenario) {
        imgPrompt = PROMPT_CENARIO_PRONTO_FIXO;
      } else {
        imgPrompt = `Generate separate individual images, each as its own standalone full-frame photo, showing the interaction between the uploaded product image and the uploaded avatar image.
These instructions are written assuming the user has uploaded their chosen product photo and avatar photo directly into ViralSeller.
- Interaction Selected: ${engInteraction}
- Scenario Selected: ${engScenario}
- Pose Selected: ${engPose}
Strictly maintain 100% visual consistency. Each image must be a complete, independent photo occupying the full frame.`;
      }

      if (matchedMovement && matchedMovement.promptText) {
        formatted = matchedMovement.promptText;
      } else {
        formatted = "⚠️ Prompt para este movimento ainda não configurado. Entre em contato com o suporte.";
      }
    }

    setGeneratedImagePrompt(imgPrompt);

    // Perform background audit logging API call
    try {
      await fetch('/api/gerar-prompt-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: `${activeWizardProduct.name}: ${activeWizardProduct.description}`,
          videoMode,
          hasSpeech,
          speechScript: hasSpeech ? aggregatedSpeech : ''
        })
      });
    } catch (auditErr) {
      console.warn("Audit log ping warning:", auditErr);
    }

    setGeneratedPrompt(formatted);
    setWizardStep(6);
    setIsLoadingPrompt(false);
  };

  useEffect(() => {
    if (shouldAutoGenerate && !isLoadingPrompt) {
      setShouldAutoGenerate(false);
      handleGeneratePrompt();
    }
  }, [shouldAutoGenerate, isLoadingPrompt]);

  const handleCopyPrompt = (type: 'image' | 'video') => {
    if (type === 'image') {
      try {
        navigator.clipboard.writeText(generatedImagePrompt);
        setCopyImageStatus(true);
        setTimeout(() => setCopyImageStatus(false), 2000);
      } catch (err) {
        console.warn("Erro ao copiar prompt de imagem:", err);
      }
    } else {
      let textToCopy = generatedPrompt;
      if (videoMode !== 'MOVIMENTO' && videoMode !== 'UGC') {
        // Find "Your detailed prompt in English for HighViralSeller Studies." and copy from there down
        const splitIndex = generatedPrompt.indexOf("Your detailed prompt in English for HighViralSeller Studies.");
        if (splitIndex !== -1) {
          textToCopy = generatedPrompt.substring(splitIndex).trim();
        }
      }
      try {
        navigator.clipboard.writeText(textToCopy);
        setCopyVideoStatus(true);
        setTimeout(() => setCopyVideoStatus(false), 2000);
      } catch (err) {
        console.warn("Erro ao copiar prompt para a área de transferência:", err);
      }
    }
  };

  const handleResetWizard = () => {
    setAvatarText('');
    setInteractionSelected('B');
    setInteractionText('O avatar segura e manipula o objeto para as lentes, com foco nas texturas.');
    setScenarioText('');
    setMovementText('');
    setGeneratedPrompt('');
    setGeneratedImagePrompt('');
    setSelectedAvatarId('');
    setSelectedScenarioId('');
    setSelectedMovementId('');
    setPoseSelected('De Frente');
    setHasSpeech(true);
    setSpeechScript('');
    setIsCuratedScenario(false);
    setActiveScenarioCategory('standard');
    setNumTakes(1);
    setTakeTexts(['', '', '', '', '']);
    setWizardStep(1);
    setActiveWizardProduct(null);
  };

  const handleDownloadImagem = async (imageUrl: string, nomeProduto: string) => {
    try {
      const proxyUrl = `/api/proxy-imagem?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${nomeProduto.replace(/\s+/g, '-').toLowerCase()}`;
      if (!a.download.endsWith('.jpg') && !a.download.endsWith('.png')) {
        a.download += '.jpg';
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const handleDownloadAllAssets = async () => {
    // 1. Download Avatar
    let avatarUrl = '';
    let avatarName = 'avatar.jpg';
    if (selectedAvatarId !== 'CUSTOM_PHOTO') {
      const avPreset = allAvatars.find(a => a.id === selectedAvatarId);
      avatarUrl = avPreset?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
      avatarName = `${avPreset?.name || 'avatar'}`;
    }

    // 2. Download Product
    let productUrl = activeWizardProduct?.image_url || activeWizardProduct?.imagem || '';
    let productName = activeWizardProduct?.nome || activeWizardProduct?.name || 'produto';

    // 3. Download Scenario
    let scenarioUrl = '';
    let scenarioName = 'cenario.jpg';
    if (isCuratedScenario) {
      const scPreset = CURATED_SCENARIOS_PRESETS.find(s => s.id === selectedScenarioId);
      scenarioUrl = scPreset?.referenceImageUrl || scPreset?.imageUrl || '';
      scenarioName = `${scPreset?.name || 'cenario'}`;
    }

    // Sequentially download with small timeout to bypass popup blockers
    let delay = 0;
    if (avatarUrl) {
      setTimeout(async () => {
        await handleDownloadImagem(avatarUrl, avatarName);
      }, delay);
      delay += 800;
    }
    if (productUrl) {
      setTimeout(async () => {
        await handleDownloadImagem(productUrl, productName);
      }, delay);
      delay += 800;
    }
    if (scenarioUrl) {
      setTimeout(async () => {
        await handleDownloadImagem(scenarioUrl, scenarioName);
      }, delay);
    }
  };

  // RENDER INTERACTIVE STEP-BY-STEP WIZARD (TikTok Colored)
  const avatarSuggestions = activeWizardProduct ? getAvatarSuggestions(activeWizardProduct) : [];
  const scenarioSuggestions = activeWizardProduct ? getScenarioSuggestions(activeWizardProduct, interactionSelected) : [];
  const movementSuggestions = activeWizardProduct ? getMovementSuggestions(activeWizardProduct, interactionSelected) : [];

  const isStep3Movimento = wizardStep === 3 && videoMode === 'MOVIMENTO';
  const isMovimentoWizardStep = videoMode === 'MOVIMENTO' && wizardStep >= 3;
  const hidePanelsOnMobileMovimento = isMobile && videoMode === 'MOVIMENTO' && wizardStep === 2;

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in pb-12 select-none w-full">
      
      {/* Live Auto-Updating Trending Products TikTok Banner */}
      {!isMovimentoWizardStep && !hidePanelsOnMobileMovimento && (
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            headerColapsado ? 'max-h-0 opacity-0 mb-0 pointer-events-none' : 'max-h-[300px] opacity-100 mb-4'
          }`}
        >
          <div className="bg-[#010101] border border-[#1E1E2E] rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          {/* Glow Effects in corners */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-[#25F4EE]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FE2C55]/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Main Header Layout: Left and Right */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1E1E2E]/60">
            {/* Left Side: Title & Badge Status */}
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-7 h-7 text-[#FE2C55] animate-bounce shrink-0" />
                  Produtos Virais
                </h1>
                <p className="text-xs sm:text-sm text-[#8888AA] mt-1 font-medium">
                  Identifique tendências antes dos concorrentes
                </p>
              </div>
              
              {/* Badges/Selo */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-black tracking-wider text-emerald-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sistema Online • Minerando
                </span>
                
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#FE2C55]/10 to-[#25F4EE]/10 border border-[#FE2C55]/25 text-[10px] font-black tracking-wider text-[#F0F0FF] uppercase shadow-sm">
                  <Link2 className="w-3.5 h-3.5 text-[#25F4EE] shrink-0" />
                  Indexador de Tendências Ativo
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-black tracking-wider text-indigo-400 uppercase shadow-sm" title="Integração com Kalodata">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  Dados & Tendências: Kalodata
                </span>
              </div>
            </div>

            {/* Right Side: Big Statistics Blocks + Countdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 lg:text-right">
              {/* Stat 1: Novos Produtos */}
              <div className="flex-1 sm:flex-none">
                <span className="block text-[9px] font-black uppercase tracking-widest text-[#8888AA]">NOVOS PRODUTOS</span>
                <span className="block text-3xl sm:text-4xl font-black text-white leading-tight mt-0.5">17</span>
              </div>

              {/* Divider Line */}
              <div className="hidden sm:block w-px h-10 bg-[#1E1E2E]" />

              {/* Stat 2: Receita Detectada */}
              <div className="flex-1 sm:flex-none">
                <span className="block text-[9px] font-black uppercase tracking-widest text-[#25F4EE]">RECEITA DETECTADA</span>
                <span className="block text-3xl sm:text-4xl font-black text-[#25F4EE] leading-tight mt-0.5">
                  R$ 25.8M
                </span>
              </div>

              {/* Divider Line */}
              <div className="hidden sm:block w-px h-10 bg-[#1E1E2E]" />

              {/* Stat 3: Timer */}
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-4 py-2 flex flex-col justify-center min-w-[150px] shrink-0">
                <span className="block text-[8px] font-black uppercase tracking-widest text-[#8888AA] leading-none mb-1">
                  PRÓXIMA ATUALIZAÇÃO EM
                </span>
                <span className="block font-mono text-xl sm:text-2xl font-black text-white leading-none tracking-wider text-center">
                  {countdownStr}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline representation section */}
          <div className="pt-6 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Madrugada (00:00 - 06:00)', index: 0 },
                { label: 'Manhã (06:00 - 12:00)', index: 1 },
                { label: 'Tarde (12:00 - 18:00)', index: 2 },
                { label: 'Noite (18:00 - 00:00)', index: 3 }
              ].map((period) => {
                const isCurrent = activeBlockIndex === period.index;
                return (
                  <div key={period.index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase tracking-wider font-black ${isCurrent ? 'text-white' : 'text-[#555577]'}`}>
                        {period.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-[#FE2C55] uppercase animate-pulse">
                          ATIVO
                        </span>
                      )}
                    </div>
                    {/* Timeline Bar */}
                    <div className="h-1.5 w-full bg-[#111118] border border-[#1E1E2E] rounded-full overflow-hidden relative">
                      {isCurrent && (
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] w-full rounded-full animate-pulse shadow-[0_0_10px_rgba(254,44,85,0.4)]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer of the banner */}
          <div className="flex items-center justify-between text-[10px] text-[#8888AA] font-semibold mt-2 pt-2 border-t border-[#1E1E2E]/30">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#25F4EE]" />
              <span>↗ <strong className="text-white">{items.length}</strong> produtos validados — vitrine reorganizada a cada hora</span>
            </div>
            <div className="hidden sm:block text-[8px] text-[#555577] uppercase tracking-wider font-black">
              ViralSeller Engine v3.2
            </div>
          </div>
        </div>
        </div>
      )}
      


      {/* ACTIVE WIZARD STEP LAYOUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        {/* Main Wizard Form Column: full width (col-span-3) on Step 1, or col-span-2 on others */}
        <div 
          id="wizard-container"
          className={`${
            wizardStep === 1 || !activeWizardProduct || hidePanelsOnMobileMovimento || isStep3Movimento || (videoMode === 'MOVIMENTO' && wizardStep === 4) 
              ? 'lg:col-span-3 bg-transparent border-none p-0' 
              : 'lg:col-span-2 bg-[#111118] border border-[#1E1E2E] rounded-2xl sm:rounded-3xl p-4 sm:p-6'
          } relative overflow-visible touch-pan-y flex flex-col justify-between min-h-[400px] sm:min-h-[480px] w-full`}
        >
          
          {/* Ambient Background subtle colors */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#25F4EE]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* STEP 1: PRODUCT SELECTION */}
            {wizardStep === 1 && (
              <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans">
                
                {/* Bloco 1: Produtos Virais ou Avatar Selecionado (se existir) */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    headerColapsado ? 'max-h-0 opacity-0 mb-0 pointer-events-none' : 'max-h-[200px] opacity-100 mb-4'
                  }`}
                >
                  {(localStorage.getItem('viralseller_video_mode') || localStorage.getItem('viralseller_avatar_pre')) && (
                    <div className="bg-gradient-to-r from-[#06B6D4]/10 to-[#7C3AED]/10 border border-[#06B6D4]/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                            {localStorage.getItem('viralseller_video_mode') ? `Modo ${localStorage.getItem('viralseller_video_mode')} Pré-selecionado` : 'Avatar Pré-selecionado'}
                          </h4>
                          <p className="text-[10px] text-gray-400">Suas seleções anteriores foram carregadas automaticamente.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {headerColapsado && (
                  <button
                    onClick={() => {
                      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setHeaderColapsado(false);
                    }}
                    className="sticky top-2 z-20 ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#0D0D1A]/90 border border-[#1E1E35] hover:border-[#FE2C55]/40 text-zinc-400 hover:text-white text-[11px] font-bold rounded-full backdrop-blur-sm transition-all mb-2"
                  >
                    ↑ Mostrar painel
                  </button>
                )}
                
                {/* Bloco 2: Etapa 1 - Produto Comercial */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    headerColapsado ? 'max-h-0 opacity-0 mb-0 pointer-events-none' : 'max-h-[300px] opacity-100 mb-4'
                  }`}
                >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block">ETAPA 1 — PRODUTO COMERCIAL</span>
                    <h3 className="text-lg font-black text-white">Selecione seu Produto</h3>
                    <p className="text-xs text-[#8888AA]">Escolha um produto em alta ou cadastre um novo para gerar o prompt comercial.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isSyncingTikTok}
                      onClick={handleTikTokSync}
                      className="px-3.5 py-1.5 bg-[#1E1E2E] hover:bg-[#25253A] border border-[#2F2F4E]/60 text-[#25F4EE] hover:text-white text-[10px] font-black rounded-xl flex items-center gap-1 transition"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncingTikTok ? 'animate-spin' : ''}`} /> Sincronizar Tendências
                    </button>
                  </div>
                </div>

                {/* 3 Fontes de Produtos Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#111118]/60 p-1 rounded-2xl border border-[#1E1E2E]/60">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter('viral');
                      salvarFiltroAtivo('viral');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 transition cursor-pointer border ${
                      activeFilter === 'viral'
                        ? 'bg-[#FE2C55] border-[#FE2C55] text-white shadow-[0_0_15px_rgba(254,44,85,0.3)]'
                        : 'bg-transparent border-transparent text-[#8888AA] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🔥 Produtos Virais</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter('kalodata');
                      salvarFiltroAtivo('kalodata');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 transition cursor-pointer border ${
                      activeFilter === 'kalodata'
                        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                        : 'bg-transparent border-transparent text-[#8888AA] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>⚡ Sistema Kalodata Integrado</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter('manual');
                      salvarFiltroAtivo('manual');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 transition cursor-pointer border ${
                      activeFilter === 'manual'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.3)]'
                        : 'bg-transparent border-transparent text-[#8888AA] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>📋 Meus Produtos</span>
                  </button>
                </div>
                </div>

                {/* Special Info Card depending on Active Filter */}
                {activeFilter === 'viral' && (
                  <div className="bg-gradient-to-r from-red-950/20 via-red-900/10 to-[#030307] border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg shrink-0">
                      🔥
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">🔥 PRODUTOS MAIS VENDIDOS AGORA</h4>
                      <p className="text-[11px] text-[#8888AA] mt-0.5">
                        Selecionados com base nas tendências do TikTok Shop Brasil. <span className="text-red-400 font-bold">Atualizado semanalmente</span>.
                      </p>
                    </div>
                  </div>
                )}

                {activeFilter === 'kalodata' && (
                  <div className="bg-gradient-to-r from-blue-950/20 via-blue-900/10 to-[#030307] border border-blue-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shrink-0">
                        ⚡
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">⚡ INTEGRAÇÃO KALODATA ATIVA</h4>
                        <p className="text-[11px] text-[#8888AA] mt-0.5">
                          Dados sincronizados em tempo real com os produtos mais vendidos do TikTok Shop Brasil hoje.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={showKalodataOverlay}
                      onClick={triggerKalodataSearch}
                      className="px-3.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md self-start sm:self-auto"
                    >
                      <RefreshCw className="w-3 h-3" /> <span>🔄 Atualizar</span>
                    </button>
                  </div>
                )}

                {activeFilter === 'manual' && (
                  <div className="bg-gradient-to-r from-emerald-950/20 via-emerald-900/10 to-[#030307] border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg shrink-0">
                        📋
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">📋 SEUS PRODUTOS CADASTRADOS</h4>
                        <p className="text-[11px] text-[#8888AA] mt-0.5">
                          Produtos selecionados por você para divulgar com sua audiência.
                        </p>
                      </div>
                    </div>
                    {userRole === 'admin' && (
                      <button
                        type="button"
                        onClick={() => setShowAddAdminModal(true)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/10 self-start sm:self-auto"
                      >
                        <Plus className="w-3 h-3" /> <span>➕ Adicionar Produto</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Custom Product Prominent Block */}
                {!showAdd && (
                  <div className="bg-[#030307] border border-[#1E1E2E] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#FE2C55]" /> Não encontrou seu produto?
                      </h4>
                      <p className="text-xs text-[#8888AA]">Adicione e use qualquer produto seu no fluxo de geração.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAdd(true)}
                      className="px-4 py-2.5 bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white text-[11px] font-black rounded-xl flex items-center justify-center gap-1.5 transition whitespace-nowrap shadow-[0_0_15px_rgba(254,44,85,0.25)]"
                    >
                      <Plus className="w-4 h-4" /> Usar meu próprio produto
                    </button>
                  </div>
                )}

                {/* Collapsible Add Product Form */}
                {showAdd && (
                  <div className="bg-[#030307] border border-[#FE2C55]/30 shadow-[0_0_20px_rgba(254,44,85,0.1)] rounded-2xl p-4 sm:p-5 space-y-4 animate-fade-in relative">
                    <button
                      type="button"
                      onClick={() => setShowAdd(false)}
                      className="absolute top-4 right-4 text-[#5C5C7A] hover:text-white transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-[#1E1E2E]/60 pb-2 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#FE2C55]" /> Cadastrar Meu Produto
                    </h4>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const newItem = {
                        id: `p${Math.random().toString(36).substr(2, 9)}`,
                        name,
                        niche,
                        image_url: imgUrl || "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=300",
                        price: score.toString(),
                        product_url: reason
                      };
                      const enriched = enrichProduct(newItem);
                      setManualItems(prev => {
                        const updated = [enriched, ...prev];
                        salvarProdutosCache(updated, 'manual');
                        return updated;
                      });
                      setActiveFilter('manual');
                      salvarFiltroAtivo('manual');
                      
                      setName('');
                      setImgUrl('');
                      setScore(0);
                      setReason('');
                      setShowAdd(false);
                    }} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Nome do Produto</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Escovador de Pelos"
                            className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Link do Produto (Opcional)</label>
                          <input
                            type="url"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ex: https://meusite.com/produto"
                            className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Preço (R$)</label>
                          <input
                            type="text"
                            value={score || ''}
                            onChange={(e) => setScore(e.target.value as any)}
                            placeholder="Ex: 59,90"
                            className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">URL da Imagem</label>
                          <input
                            type="url"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            placeholder="https://sua-imagem.com/img.jpg"
                            className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Categoria</label>
                          <select
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none"
                          >
                            <option value="Beleza">Beleza e Cosméticos 💄</option>
                            <option value="Tecnologia">Tecnologia & Eletrônicos 💻</option>
                            <option value="Casa">Casa e Organização 🏠</option>
                            <option value="Saúde">Saúde e Bem-estar 🌿</option>
                            <option value="Pet care">Pet Care 🐾</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#FE2C55] hover:bg-[#FE2C55]/90 text-white text-[11px] font-black rounded-xl transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(254,44,85,0.25)]"
                        >
                          <Check className="w-4 h-4" /> Cadastrar e Usar Produto
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Sync Status Feedback */}
                {syncTikTokMessage && (
                  <div className={`text-[10px] font-bold flex items-center gap-1.5 p-2.5 rounded-xl animate-fade-in ${syncTikTokSuccess ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400' : 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-400'}`}>
                    {isSyncingTikTok ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{syncTikTokMessage}</span>
                  </div>
                )}

                {/* Interactive Filters & Search Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-[#030307]/80 p-3 rounded-2xl border border-[#1E1E2E]">
                  {/* Niche selector pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                    {[
                      { id: 'todos', label: 'Todos os Nichos' },
                      { id: 'Beleza', label: 'Beleza 💄' },
                      { id: 'Tecnologia', label: 'Tecnologia 💻' },
                      { id: 'Casa', label: 'Casa & Cozinha 🏠' },
                      { id: 'Saúde', label: 'Saúde 🌿' },
                      { id: 'Pet care', label: 'Pet Care 🐾' },
                    ].map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setSelectedNiche(n.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition whitespace-nowrap cursor-pointer border ${
                          selectedNiche === n.id
                            ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                            : 'bg-[#111118] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-[#5C5C7A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Pesquisar produto comercial..."
                      className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl py-2 pl-8 pr-4 text-xs text-white outline-none placeholder-[#5C5C7A] focus:border-[#FE2C55] transition"
                    />
                  </div>
                </div>

                {/* Sentinela de scroll - Adicione logo antes da grade de produtos */}
                <div ref={sentinelaRef} className="w-full h-1" aria-hidden="true" />

                {/* Product Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pr-1 touch-pan-y">
                  {filteredItems.length === 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center p-12 bg-[#111118] border border-[#1E1E2E] rounded-xl text-center">
    <span className="text-sm font-bold text-[#8888AA]">Nenhum produto cadastrado ainda.</span>
  </div>
) : filteredItems.map((prod, index) => {
                    const isSelected = activeWizardProduct?.id === prod.id;
                    const pId = prod.id || String(index);
                    const pHash = pId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const showsBadge = salesBadgesEnabled && ((pHash % 100) < salesBadgesProbability);
                    const selectedBadge = showsBadge && salesBadgesList.length > 0 
                      ? salesBadgesList[pHash % salesBadgesList.length] 
                      : null;

                    const getBadgeStyles = (c: string) => {
                      switch (c) {
                        case 'red': return 'bg-red-500/10 text-red-500 border border-red-500/20';
                        case 'amber': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
                        case 'orange': return 'bg-orange-500/10 text-orange-400 border border-orange-400/20';
                        case 'cyan': return 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/20';
                        case 'green': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                        case 'rose': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
                        default: return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                      }
                    };

                    const name = prod.nome || prod.name || 'Produto Viral';
                    const imageUrl = prod.imagem || prod.image_url;
                    const tags = prod.tags || [prod.niche || 'Geral'];
                    const rawPrice = prod.preco || prod.price || '52,90';
                    const price = rawPrice.trim().startsWith('R$') ? rawPrice.trim() : `R$ ${rawPrice.trim()}`;
                    const commission = prod.afiliado?.comissao || '10%';

                    return (
                      <div
                        key={prod.id}
                        className={`group bg-[#0B0B11] border rounded-2xl overflow-hidden transition-all duration-300 relative flex flex-col p-2 sm:p-3.5 ${
                          isSelected
                            ? 'border-[#FE2C55] shadow-[0_0_15px_rgba(254,44,85,0.15)] bg-[#111118]'
                            : 'border-[#1E1E2E] hover:border-[#FE2C55]/40 hover:shadow-[0_0_12px_rgba(254,44,85,0.05)]'
                        }`}
                      >
                        {/* Upper Badges Block */}
                        <div className="absolute top-2 left-2 sm:top-5 sm:left-5 z-10 flex flex-wrap gap-1">
                          <span className="text-[9px] bg-[#FE2C55]/15 border border-[#FE2C55]/25 text-[#FE2C55] font-black uppercase px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md backdrop-blur-sm shadow-md">
                            Comissão: {commission}
                          </span>
                          {activeFilter === 'viral' ? (
                            <span className="text-[9px] bg-red-500/20 border border-red-500/30 text-red-500 font-black uppercase px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md backdrop-blur-sm shadow-md flex items-center gap-1">
                              🔥 VIRAL
                            </span>
                          ) : activeFilter === 'kalodata' ? (
                            <span className="text-[9px] bg-blue-500/20 border border-blue-500/30 text-blue-400 font-black uppercase px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md backdrop-blur-sm shadow-md flex items-center gap-1">
                              ⚡ KALODATA
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black uppercase px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md backdrop-blur-sm shadow-md flex items-center gap-1">
                              📋 MANUAL
                            </span>
                          )}
                        </div>

                        {/* Image Container with Aspect Ratio */}
                        <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-xl bg-[#030307] border border-[#1E1E2E]/50 overflow-hidden flex items-center justify-center shrink-0">
                          <ProductImage
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        {/* Title, tags and details */}
                        <div className="mt-2 sm:mt-3.5 space-y-1 sm:space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="hidden sm:flex items-center justify-between gap-1 text-[9px] text-[#8888AA] font-bold">
                              <span>{prod.niche}</span>
                              {prod.is_realtime && <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55] animate-pulse" />}
                            </div>

                            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FE2C55] transition line-clamp-2 sm:line-clamp-1 mt-0.5">
                              {name}
                            </h4>

                            {/* Tags list rendering */}
                            <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                              {tags.map((tag: string, tid: number) => (
                                <span 
                                  key={tid}
                                  className="text-[8px] sm:text-[9px] font-black bg-[#161622] text-zinc-300 border border-[#2F2F4E]/30 rounded-md px-1.5 py-0.5 uppercase tracking-wider"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs font-black pt-1 sm:pt-3 border-t border-[#1E1E2E]/40 mt-1 sm:mt-3">
                            <span className="text-[#FE2C55] text-xs sm:text-sm">{price}</span>
                            <span className="text-amber-500 font-sans flex items-center gap-0.5 text-[9px] sm:text-xs">★ {prod.rating || '4.5'}</span>
                          </div>
                          
                          {/* Sales and Views counter */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[8px] sm:text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                            <div className="flex items-center gap-0.5">
                              <span className="text-orange-500 text-[9px] sm:text-xs">🔥</span>
                              <span>{prod.sales_30d?.toLocaleString('pt-BR') || 1000} Vendas</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <span className="text-blue-400 text-[9px] sm:text-xs">👀</span>
                              <span>{prod.views_30d?.toLocaleString('pt-BR') || 15000} Views</span>
                            </div>
                          </div>
                        </div>

                        {/* Horizontal Action Buttons */}
                        <div className="mt-2 sm:mt-4 pt-2 sm:pt-3.5 border-t border-[#1E1E2E]/60 flex gap-1.5 sm:gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => handleTriggerAffiliation(prod)}
                            className="flex-1 py-2 px-2 bg-[#111118] border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 font-black text-xs uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
                          >
                            <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Afiliar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTriggerVideoGeneration(prod)}
                            className="flex-1 py-2 px-2 bg-[#FE2C55] hover:bg-[#ff3d64] text-white font-black text-xs uppercase tracking-wider rounded-lg sm:rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-[#FE2C55]/20 flex items-center justify-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
                            <span>Gerar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SKIPPING MESSAGE OVERLAY */}
            {skippingMessage && (
              <div className="absolute inset-0 z-50 bg-[#0B0B11]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in rounded-3xl">
                <div className="bg-[#1E1E2E] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
                  {skippingMessage}
                </div>
              </div>
            )}

            {/* SKIPPING MESSAGE OVERLAY */}
            {skippingMessage && (
              <div className="absolute inset-0 z-50 bg-[#0B0B11]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in rounded-3xl">
                <div className="bg-[#1E1E2E] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
                  {skippingMessage}
                </div>
              </div>
            )}

            {/* SKIPPING MESSAGE OVERLAY */}
            {skippingMessage && (
              <div className="absolute inset-0 z-50 bg-[#0B0B11]/90 backdrop-blur-sm flex items-center justify-center animate-fade-in rounded-3xl">
                <div className="bg-[#1E1E2E] border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm">
                  {skippingMessage}
                </div>
              </div>
            )}

            {/* STEP 2: MULTI-MODE DELEGATOR */}
            {wizardStep === 2 && (
              <div className="space-y-6 sm:space-y-7 animate-fade-in">
                {videoMode === 'UGC' && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block">GERADOR EXPRESS — MODO UGC</span>
                      <h3 className="text-lg font-black text-white">Configure seu Vídeo UGC na mesma tela</h3>
                      <p className="text-xs text-[#8888AA]">Configure as etapas de pose, avatar, cenário e falas comerciais integrados abaixo.</p>
                    </div>

                    {/* Section 1: Pose & Avatar */}
                    <div className="bg-[#0A0A0F]/50 border border-[#1E1E2E] p-5 rounded-2xl space-y-5">
                      <h4 className="text-sm font-black text-[#FE2C55] uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-[#FE2C55]" /> 1. Pose & Seleção do Avatar
                      </h4>
                      
                      {/* Pose Selector slider */}
                      <div className="space-y-2.5">
                        <span className="text-xs text-zinc-400 font-extrabold uppercase tracking-wide block">Pose / Enquadramento:</span>
                        <div className="flex flex-wrap gap-2">
                          {['De Frente', 'De Lado', 'Ângulo 3/4', 'Sentado(a)', 'Andando'].map((pose) => (
                            <button
                              key={pose}
                              type="button"
                              onClick={() => setPoseSelected(pose)}
                              className={`px-4 py-1.5 text-xs font-black rounded-lg border transition-all ${
                                poseSelected === pose
                                  ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                                  : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA] hover:text-white hover:border-[#8888AA]'
                              }`}
                            >
                              {pose}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Avatar Grid */}
                      <div className="space-y-3 pt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-400 font-extrabold uppercase tracking-wide">Influenciador de IA:</span>
                          {/* Gender Filter */}
                          <div className="flex items-center gap-1 bg-[#030307] p-1 border border-[#1E1E2E] rounded-lg">
                            {(['TODOS', 'FEMININO', 'MASCULINO'] as const).map((filter) => (
                              <button
                                key={filter}
                                type="button"
                                onClick={() => {
                                  (window as any).avatarFilter = filter;
                                  setAvatarText(' ');
                                  setTimeout(() => setAvatarText(''), 10);
                                }}
                                className={`px-3 py-1 text-[10px] font-extrabold rounded capitalize transition-all ${
                                  ((window as any).avatarFilter || 'TODOS') === filter
                                    ? 'bg-[#FE2C55]/10 text-[#FE2C55]'
                                    : 'text-[#8888AA] hover:text-white'
                                }`}
                              >
                                {filter === 'TODOS' ? 'Todos' : filter === 'FEMININO' ? 'Fem' : 'Masc'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                          {allAvatars.filter((av) => {
                            const currentFilter = (window as any).avatarFilter || 'TODOS';
                            if (currentFilter === 'TODOS') return true;
                            return av.gender === currentFilter;
                          }).map((av) => {
                            const isSelected = selectedAvatarId === av.id;
                            return (
                              <AvatarCard
                                key={av.id}
                                av={av}
                                isSelected={isSelected}
                                onSelect={() => {
                                  setSelectedAvatarId(av.id);
                                  setAvatarText(av.description);
                                }}
                              />
                            );
                          })}
                        </div>

                        <textarea
                          required
                          value={avatarText}
                          onChange={(e) => setAvatarText(e.target.value)}
                          placeholder="Características estéticas adicionais do avatar..."
                          rows={3}
                          className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-3 text-xs text-white focus:border-[#FE2C55] outline-none resize-none transition"
                        />
                      </div>
                    </div>

                    {/* Section 2: Scenario Selection */}
                    <div className="bg-[#0A0A0F]/50 border border-[#1E1E2E] p-5 rounded-2xl space-y-5">
                      <h4 className="text-sm font-black text-[#FE2C55] uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FE2C55]" /> 2. Cenário do Vídeo
                      </h4>

                      <div className="flex gap-2 bg-[#030307] p-0.5 border border-[#1E1E2E] rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveScenarioCategory('curated');
                            setIsCuratedScenario(true);
                            setSelectedScenarioId('');
                            setScenarioText('');
                          }}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                            activeScenarioCategory === 'curated'
                              ? 'bg-[#FE2C55]/10 border-[#FE2C55]/20 text-white'
                              : 'text-[#8888AA] hover:text-white'
                          }`}
                        >
                          Cenários Prontos (Estúdio)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveScenarioCategory('standard');
                            setIsCuratedScenario(false);
                            setSelectedScenarioId('');
                            setScenarioText('');
                          }}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                            activeScenarioCategory === 'standard'
                              ? 'bg-[#FE2C55]/10 border-[#FE2C55]/20 text-white'
                              : 'text-[#8888AA] hover:text-white'
                          }`}
                        >
                          Cenários Comuns
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-1">
                        {activeScenarioCategory === 'standard' ? (
                          allScenarios.map((sc) => {
                            const isSelected = !isCuratedScenario && selectedScenarioId === sc.id;
                            return (
                              <ScenarioCard
                                key={sc.id}
                                sc={sc}
                                isSelected={isSelected}
                                onSelect={() => {
                                  setIsCuratedScenario(false);
                                  setSelectedScenarioId(sc.id);
                                  setScenarioText(sc.description);
                                }}
                              />
                            );
                          })
                        ) : (
                          CURATED_SCENARIOS_PRESETS.map((sc) => {
                            const isSelected = isCuratedScenario && selectedScenarioId === sc.id;
                            return (
                              <ScenarioCard
                                key={sc.id}
                                sc={sc}
                                isSelected={isSelected}
                                onSelect={() => {
                                  setIsCuratedScenario(true);
                                  setSelectedScenarioId(sc.id);
                                  setScenarioText(sc.description);
                                }}
                              />
                            );
                          })
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        value={scenarioText}
                        onChange={(e) => setScenarioText(e.target.value)}
                        placeholder="Escreva detalhes adicionais ou ajuste o cenário..."
                        className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-3 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                      />
                    </div>

                    {/* Section 3: Speech, Locution and Scripting */}
                    <div className="bg-[#0A0A0F]/50 border border-[#1E1E2E] p-5 rounded-2xl space-y-5">
                      <h4 className="text-sm font-black text-[#FE2C55] uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#FE2C55]" /> 3. Locução & Roteiro de Fala
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          disabled={videoMode === 'UGC'}
                          onClick={() => setHasSpeech(true)}
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-black transition-all ${
                            hasSpeech
                              ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                              : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA]'
                          } ${videoMode === 'UGC' ? 'cursor-not-allowed opacity-90' : ''}`}
                          title={videoMode === 'UGC' ? "Modo UGC sempre inclui fala do avatar" : undefined}
                        >
                          <Volume2 className="w-4 h-4" /> Com Fala (Português)
                        </button>

                        <button
                          type="button"
                          disabled={videoMode === 'UGC'}
                          onClick={() => setHasSpeech(false)}
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-black transition-all ${
                            !hasSpeech
                              ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                              : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA]'
                          } ${videoMode === 'UGC' ? 'opacity-30 cursor-not-allowed border-zinc-800' : ''}`}
                          title={videoMode === 'UGC' ? "Modo UGC sempre inclui fala do avatar" : undefined}
                        >
                          <VolumeX className="w-4 h-4" /> Sem Fala (Apenas Vídeo)
                        </button>
                      </div>

                      {videoMode === 'UGC' && (
                        <p className="text-xs text-amber-500 font-bold mt-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" /> Modo UGC sempre inclui fala do avatar
                        </p>
                      )}

                      {hasSpeech && (
                        <div className="space-y-4 pt-1 animate-fade-in text-xs text-[#8888AA]">
                          {/* Voice Configuration Slider */}
                          <div className="bg-[#030307] p-4 rounded-xl border border-[#1E1E2E] space-y-3">
                            <span className="text-[10px] font-black uppercase text-zinc-400 block tracking-widest">Ajuste da Voz</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
                              <div>
                                <label className="text-[9px] font-bold block mb-1.5">Gênero</label>
                                <div className="flex gap-1">
                                  {(['FEMININO', 'MASCULINO'] as const).map((g) => (
                                    <button
                                      key={g}
                                      type="button"
                                      onClick={() => setSelectedGender(g)}
                                      className={`flex-1 py-1 font-black rounded border text-[8.5px] ${
                                        selectedGender === g ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' : 'bg-[#111118] border-[#1E1E2E]'
                                      }`}
                                    >
                                      {g === 'FEMININO' ? 'Fem' : 'Masc'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold block mb-1.5">Tonalidade</label>
                                <div className="flex gap-1">
                                  {['Vibrante', 'Profissional'].map((t) => (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() => setVoiceTonality(t)}
                                      className={`flex-1 py-1 font-black rounded border text-[8.5px] ${
                                        voiceTonality === t ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' : 'bg-[#111118] border-[#1E1E2E]'
                                      }`}
                                    >
                                      {t.slice(0, 4)}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold block mb-1.5">Energia</label>
                                <div className="flex gap-1">
                                  {['Alta', 'Média'].map((en) => (
                                    <button
                                      key={en}
                                      type="button"
                                      onClick={() => setVoiceEnergy(en)}
                                      className={`flex-1 py-1 font-black rounded border text-[8.5px] ${
                                        voiceEnergy === en ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' : 'bg-[#111118] border-[#1E1E2E]'
                                      }`}
                                    >
                                      {en}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold block mb-1.5">Estilo de Tom</label>
                                <div className="flex gap-1">
                                  {['Amigável', 'Autoridade'].map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => setVoiceTone(st)}
                                      className={`flex-1 py-1 font-black rounded border text-[8.5px] ${
                                        voiceTone === st ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' : 'bg-[#111118] border-[#1E1E2E]'
                                      }`}
                                    >
                                      {st.slice(0, 4)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Takes and script auto-fill */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-zinc-400">Takes Ativos:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const productName = activeWizardProduct?.name || 'este produto';
                                  const takeTemplates = [
                                    `Olha o poder desse ${productName}! Ele realmente resolve aquele problemão do seu dia a dia de forma mágica.`,
                                    `E o melhor de tudo é a altíssima praticidade de uso. Você economiza tempo e tem resultados profissionais na hora.`,
                                    `Perfeito para quem quer máxima qualidade sem complicações. Testado e totalmente aprovado por milhares de clientes reais!`,
                                    `O acabamento premium e o design inteligente garantem que você tenha a melhor experiência possível sempre.`,
                                    `Garanta já o seu clicando agora mesmo no link da tela. Aproveite a oferta exclusiva de frete grátis!`
                                  ];
                                  setTakeTexts(takeTemplates);
                                }}
                                className="text-[9px] text-[#FE2C55] font-black underline hover:text-[#ff4e74]"
                              >
                                🪄 Preencher com Roteiro IA
                              </button>
                            </div>

                            <div className="grid grid-cols-5 gap-1">
                              {[1, 2, 3, 4, 5].map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setNumTakes(t)}
                                  className={`py-1 text-[9px] font-black rounded border transition ${
                                    numTakes === t
                                      ? 'bg-gradient-to-tr from-[#FE2C55] to-purple-600 border-transparent text-white'
                                      : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA]'
                                  }`}
                                >
                                  {t}T ({t * 8}s)
                                </button>
                              ))}
                            </div>

                            {/* Render active takes textarea directly in line */}
                            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                              {Array.from({ length: numTakes }).map((_, idx) => (
                                <div key={idx} className="bg-[#030307] p-3 rounded-xl border border-[#1E1E2E] space-y-2">
                                  <span className="text-[9px] font-black text-[#FE2C55] uppercase block">Take {idx + 1} ({idx * 8}s - {(idx + 1) * 8}s)</span>
                                  <textarea
                                    rows={2}
                                    value={takeTexts[idx] || ''}
                                    onChange={(e) => {
                                      const next = [...takeTexts];
                                      next[idx] = e.target.value;
                                      setTakeTexts(next);
                                    }}
                                    placeholder="Roteiro comercial curto..."
                                    className="w-full bg-[#111118] border border-[#1E1E2E] rounded-lg p-2 text-xs text-white outline-none resize-none"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {videoMode === 'POV' && (
                  <div className="space-y-5">
                    {/* POV Scenario Selection */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block">ETAPA 2 — CENÁRIO POV</span>
                      <h3 className="text-lg font-black text-white">Escolha o Cenário POV</h3>
                      <p className="text-xs text-[#8888AA]">Selecione um ambiente premium realista focado em destacar as qualidades físicas do produto.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { title: '🛋️ Sala Moderna', desc: 'Ambiente sofisticado e aconchegante.' },
                        { title: '👨🍳 Cozinha Gourmet', desc: 'Cozinha completa e funcional.' },
                        { title: '🏋️ Academia Home', desc: 'Treino com energia e foco.' },
                        { title: '🛁 Spa & Banho', desc: 'Relaxamento e cuidados pessoais.' },
                        { title: '🚗 Garagem Estilo', desc: 'Espaço para quem ama carros.' },
                        { title: '📸 Estúdio Criativo', desc: 'Iluminação perfeita para conteúdo.' }
                      ].map((sc) => {
                        const isSelected = povScenarioSelected === sc.title;
                        return (
                          <button
                            key={sc.title}
                            type="button"
                            onClick={() => {
                              setPovScenarioSelected(sc.title);
                              setPovScenarioDesc(sc.desc);
                            }}
                            className={`group p-4 text-left rounded-2xl border transition-all duration-200 ${
                              isSelected
                                ? 'border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/5'
                                : 'bg-[#0B0B11] border-[#1E1E2E] hover:border-purple-500/30'
                            }`}
                          >
                            <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition mb-1">{sc.title}</h4>
                            <p className="text-xs text-[#8888AA] leading-relaxed line-clamp-2">{sc.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {videoMode === 'MOVIMENTO' && (
                  <div className="space-y-5">
                    {/* MOVIMENTO Avatar Selection */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block">ETAPA 2 — AVATAR (MOVIMENTO)</span>
                        <h3 className="text-lg font-black text-white">Escolha seu Avatar</h3>
                        <p className="text-xs text-[#8888AA]">Selecione um apresentador premium para demonstrar as transições e movimentos do produto.</p>
                      </div>

                      {/* Gender Filters */}
                      <div className="flex items-center gap-1 bg-[#0A0A0F]/90 p-1 border border-[#1E1E2E] rounded-xl self-stretch sm:self-auto">
                        {(['TODOS', 'FEMININO', 'MASCULINO'] as const).map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => {
                              (window as any).avatarFilter = filter;
                              setAvatarText('');
                              setSelectedAvatarId('');
                              setAvatarText(' ');
                              setTimeout(() => setAvatarText(''), 10);
                            }}
                            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg capitalize transition-all text-center ${
                              ((window as any).avatarFilter || 'TODOS') === filter
                                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                                : 'text-[#8888AA] hover:text-white'
                            }`}
                          >
                            {filter === 'TODOS' ? 'Todos' : filter === 'FEMININO' ? 'Femenino' : 'Masculino'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] sm:max-h-[380px] overflow-y-auto pr-1">
                      {allAvatars.filter((av) => {
                        const currentFilter = (window as any).avatarFilter || 'TODOS';
                        if (currentFilter === 'TODOS') return true;
                        return av.gender === currentFilter;
                      }).map((av) => {
                        const isSelected = selectedAvatarId === av.id;
                        return (
                          <AvatarCard
                            key={av.id}
                            av={av}
                            isSelected={isSelected}
                            onSelect={() => {
                              setSelectedAvatarId(av.id);
                              setAvatarText(av.description);
                            }}
                          />
                        );
                      })}
                    </div>

                    <textarea
                      required
                      value={avatarText}
                      onChange={(e) => setAvatarText(e.target.value)}
                      placeholder="Características estéticas personalizadas de forma manual se desejar..."
                      rows={2}
                      className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#25F4EE] outline-none resize-none transition"
                    />
                  </div>
                )}
              </div>
            )}
              {/* STEP 3: INTERACTION OR SPECIALIZED MODE STEP */}
              {wizardStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  {videoMode === 'POV' ? (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block font-sans">ETAPA 3 — APARÊNCIA DAS MÃOS</span>
                        <h3 className="text-lg font-black text-white">Como serão apresentadas as mãos no vídeo POV?</h3>
                        <p className="text-xs text-[#8888AA]">Defina o gênero, cor da pele e presença de acessórios como luvas de estúdio.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Glove Option */}
                        <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 rounded-2xl space-y-3">
                          <label className="text-xs font-black text-white block uppercase tracking-wide">Uso de Luvas</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'Sem Luva', val: 'sem_luva' },
                              { label: 'Com Luva', val: 'com_luva' }
                            ].map((o) => (
                              <button
                                key={o.val}
                                type="button"
                                onClick={() => setPovGloveOption(o.val as any)}
                                className={`py-2 px-3 text-xs font-black rounded-xl border transition ${
                                  povGloveOption === o.val ? 'bg-purple-500/15 border-purple-500 text-white' : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA]'
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Gender / Visibility */}
                        <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 rounded-2xl space-y-3">
                          <label className="text-xs font-black text-white block uppercase tracking-wide">Gênero das Mãos</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { label: 'Feminina', val: 'Feminina' },
                              { label: 'Masculina', val: 'Masculina' },
                              { label: 'Invisível', val: 'Sem mãos' }
                            ].map((o) => (
                              <button
                                key={o.val}
                                type="button"
                                onClick={() => setPovHandGender(o.val as any)}
                                className={`py-2 px-1 text-[10px] font-black rounded-xl border transition ${
                                  povHandGender === o.val ? 'bg-purple-500/15 border-purple-500 text-white' : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA]'
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 3. Skin Tone */}
                        <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 rounded-2xl space-y-3">
                          <label className="text-xs font-black text-white block uppercase tracking-wide">Cor da Pele</label>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { label: 'Clara', val: 'Clara' },
                              { label: 'Morena', val: 'Morena' },
                              { label: 'Escura', val: 'Escura' }
                            ].map((o) => (
                              <button
                                key={o.val}
                                type="button"
                                onClick={() => setPovSkinColor(o.val)}
                                className={`py-1.5 px-3 text-[10px] font-black rounded-xl border transition ${
                                  povSkinColor === o.val ? 'bg-purple-500/15 border-purple-500 text-white' : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA]'
                                }`}
                              >
                                {o.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : videoMode === 'MOVIMENTO' ? (
                    <div className="space-y-4">
                      {/* Scenario Selection for MOVIMENTO */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block">ETAPA 3 — CENÁRIO (MOVIMENTO)</span>
                        <h3 className="text-lg font-black text-white">Escolha o Cenário</h3>
                        <p className="text-xs text-[#8888AA]">Defina o ambiente para demonstração de movimentos do avatar.</p>
                      </div>

                      <div className="flex gap-2 mb-3 bg-[#030307] p-1 rounded-xl border border-[#1E1E2E]">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveScenarioCategory('curated');
                            setIsCuratedScenario(true);
                            setSelectedScenarioId('');
                            setScenarioText('');
                          }}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                            activeScenarioCategory === 'curated'
                              ? 'bg-cyan-500/10 border-cyan-500/20 text-white'
                              : 'text-[#8888AA] hover:text-white'
                          }`}
                        >
                          Cenários Prontos (Estúdio)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveScenarioCategory('standard');
                            setIsCuratedScenario(false);
                            setSelectedScenarioId('');
                            setScenarioText('');
                          }}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                            activeScenarioCategory === 'standard'
                              ? 'bg-cyan-500/10 border-cyan-500/20 text-white'
                              : 'text-[#8888AA] hover:text-white'
                          }`}
                        >
                          Cenários Comuns
                        </button>
                      </div>

                      <div className={`grid gap-4 ${isStep3Movimento ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'} ${isStep3Movimento ? 'max-h-none' : 'max-h-[300px]'} overflow-y-auto pr-1`}>
                        {activeScenarioCategory === 'standard' ? (
                          allScenarios.map((sc) => {
                            const isSelected = !isCuratedScenario && selectedScenarioId === sc.id;
                            return (
                              <ScenarioCard
                                key={sc.id}
                                sc={sc}
                                isSelected={isSelected}
                                isLarge={isStep3Movimento}
                                onSelect={() => {
                                  setIsCuratedScenario(false);
                                  setSelectedScenarioId(sc.id);
                                  setScenarioText(sc.description);
                                }}
                              />
                            );
                          })
                        ) : (
                          CURATED_SCENARIOS_PRESETS.map((sc) => {
                            const isSelected = isCuratedScenario && selectedScenarioId === sc.id;
                            return (
                              <ScenarioCard
                                key={sc.id}
                                sc={sc}
                                isSelected={isSelected}
                                isLarge={isStep3Movimento}
                                onSelect={() => {
                                  setIsCuratedScenario(true);
                                  setSelectedScenarioId(sc.id);
                                  setScenarioText(sc.description);
                                }}
                              />
                            );
                          })
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        value={scenarioText}
                        onChange={(e) => setScenarioText(e.target.value)}
                        placeholder="Detalhes adicionais do cenário..."
                        className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-3 text-xs text-white outline-none transition"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Standard default Interaction Type screen */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block font-sans">ETAPA 3 — TIPO DE INTERAÇÃO</span>
                        <h3 className="text-lg font-black text-white">Como o avatar vai interagir com o produto?</h3>
                        <p className="text-xs text-[#8888AA]">Selecione a ação base que define focar no produto ou na proximidade visual de acordo com sua estratégia de vendas.</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[550px] sm:max-h-[680px] overflow-y-auto pr-1 pt-2">
                        {allInteractions.map((inter) => {
                          const isSelected = interactionSelected === inter.id;
                          return (
                            <InteractionCard
                              key={inter.id}
                              inter={inter}
                              isSelected={isSelected}
                              onSelect={() => {
                                setInteractionSelected(inter.id);
                                setInteractionText(inter.description);
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="space-y-1.5 bg-[#0A0A0F]/60 border border-[#1E1E2E] p-3 rounded-2xl">
                        <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5 justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#25F4EE]" /> Detalhes da Interação
                          </span>
                        </label>
                        <textarea
                          required
                          value={interactionText}
                          onChange={(e) => setInteractionText(e.target.value)}
                          placeholder="Detalhes adicionais da interação..."
                          rows={2}
                          className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none resize-none transition"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 4: SPECIALIZED VIEW CHOOSE OR DEFAULT SCENARIO */}
              {wizardStep === 4 && (
                <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans">
                  {videoMode === 'POV' ? (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block">ETAPA 4 — ESTILO DE APRESENTAÇÃO</span>
                        <h3 className="text-lg font-black text-white">Qual o estilo de apresentação do produto?</h3>
                        <p className="text-xs text-[#8888AA]">Defina o foco estético principal para destacar as melhores características físicas.</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                        {[
                          { label: '👁️ Textura', desc: 'Foco em detalhes microscópicos e relevos.', val: 'Textura' },
                          { label: '✨ Acabamento', desc: 'Foco no brilho, mate ou polimento.', val: 'Acabamento' },
                          { label: '💎 Premium', desc: 'Cenografia e iluminação cinematográfica de luxo.', val: 'Premium' },
                          { label: '📏 Tamanho Real', desc: 'Proporções e escala realista em mãos.', val: 'Tamanho Real' },
                          { label: '⚙️ Funcionalidade', desc: 'Demonstrando o produto em ação real.', val: 'Funcionalidade' }
                        ].map((style) => (
                          <button
                            key={style.val}
                            type="button"
                            onClick={() => setPovPresentationStyle(style.val)}
                            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between min-h-[110px] ${
                              povPresentationStyle === style.val
                                ? 'bg-purple-500/10 border-purple-500 text-white shadow-md'
                                : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white hover:border-zinc-700'
                            }`}
                          >
                            <span className="text-xs font-black block">{style.label}</span>
                            <span className="text-[10px] text-zinc-400 mt-2 block font-normal leading-relaxed">{style.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : videoMode === 'MOVIMENTO' ? (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block font-sans">ETAPA 4 — TIPO DE INTERAÇÃO</span>
                        <h3 className="text-lg font-black text-white">Como o avatar vai interagir com o produto?</h3>
                        <p className="text-xs text-[#8888AA]">Selecione a ação base que define focar no produto ou na proximidade visual de acordo com sua estratégia de vendas.</p>
                      </div>

                      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${videoMode === 'MOVIMENTO' ? 'max-h-none' : 'max-h-[220px] xs:max-h-[280px] sm:max-h-[350px]'} overflow-y-auto pr-1 pt-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent`}>
                        {allInteractions.map((inter) => {
                          const isSelected = interactionSelected === inter.id;
                          return (
                            <InteractionCard
                              key={inter.id}
                              inter={inter}
                              isSelected={isSelected}
                              onSelect={() => {
                                setInteractionSelected(inter.id);
                                setInteractionText(inter.description);
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="space-y-1.5 bg-[#0A0A0F]/60 border border-[#1E1E2E] p-3 rounded-2xl">
                        <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#25F4EE]" /> Detalhes da Interação
                        </label>
                        <textarea
                          required
                          value={interactionText}
                          onChange={(e) => setInteractionText(e.target.value)}
                          placeholder="Detalhes adicionais da interação..."
                          rows={2}
                          className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none resize-none transition"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Standard scenario screen */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block">ETAPA 4 — CENÁRIO</span>
                        <h3 className="text-lg font-black text-white">Escolha o Cenário</h3>
                        <p className="text-xs text-[#8888AA]">Escreva um local detalhado ou selecione um dos presets nas sub-abas abaixo.</p>
                      </div>

                      {/* Sub-tabs for Scenario Category Selection */}
                      <div className="flex gap-2 bg-[#0A0A0F] p-1 border border-[#1E1E2E] rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveScenarioCategory('curated');
                            setIsCuratedScenario(true);
                            setSelectedScenarioId('');
                            setScenarioText('');
                          }}
                          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
                            activeScenarioCategory === 'curated'
                              ? 'bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-white shadow-md'
                              : 'text-[#8888AA] hover:text-white'
                          }`}
                        >
                          <Zap className="w-4 h-4 text-[#FE2C55]" /> Cenários Prontos
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveScenarioCategory('standard');
                            setIsCuratedScenario(false);
                            setSelectedScenarioId('');
                            setScenarioText('');
                          }}
                          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all text-center flex items-center justify-center gap-2 ${
                            activeScenarioCategory === 'standard'
                              ? 'bg-[#FE2C55]/10 border border-[#FE2C55]/30 text-white shadow-md'
                              : 'text-[#8888AA] hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-4 h-4 text-cyan-400" /> Cenários Padrão
                        </button>
                      </div>

                      {/* Scenarios Grid Presets */}
                      {activeScenarioCategory === 'standard' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-h-[220px] xs:max-h-[300px] sm:max-h-[380px] overflow-y-auto pr-1">
                          {allScenarios.map((sc) => {
                            const isSelected = !isCuratedScenario && selectedScenarioId === sc.id;
                            return (
                              <ScenarioCard
                                key={sc.id}
                                sc={sc}
                                isSelected={isSelected}
                                onSelect={() => {
                                  setIsCuratedScenario(false);
                                  setSelectedScenarioId(sc.id);
                                  setScenarioText(sc.description);
                                }}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-h-[220px] xs:max-h-[300px] sm:max-h-[380px] overflow-y-auto pr-1">
                          {CURATED_SCENARIOS_PRESETS.map((sc) => {
                            const isSelected = isCuratedScenario && selectedScenarioId === sc.id;
                            return (
                              <ScenarioCard
                                key={sc.id}
                                sc={sc}
                                isSelected={isSelected}
                                onSelect={() => {
                                  setIsCuratedScenario(true);
                                  setSelectedScenarioId(sc.id);
                                  setScenarioText(sc.description);
                                }}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Pose Selection bottom slider selector mimicking photo 2 */}
                      <div className="space-y-2 bg-[#0A0A0F]/40 border border-[#1E1E2E] p-3 rounded-2xl">
                        <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block font-sans">Pose do Avatar</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['De Frente', 'De Lado', 'Ângulo 3/4', 'Sentado(a)', 'Andando', 'Personalizada'].map((pose) => (
                            <button
                              key={pose}
                              type="button"
                              onClick={() => setPoseSelected(pose)}
                              className={`px-3 py-1.5 text-[10px] font-black rounded-xl border transition-all ${
                                poseSelected === pose
                                  ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white shadow-md shadow-[#FE2255]/5'
                                  : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white hover:border-[#8888AA]'
                              }`}
                            >
                              {pose}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Manual description backup box */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5 justify-between">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500" /> Detalhes do Plano de Fundo (Scenario)
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={scenarioText}
                          onChange={(e) => setScenarioText(e.target.value)}
                          placeholder="Descrição detalhada do plano de fundo (ex: Cozinha premium iluminada por spots de luz e feno de fundo desfocado)..."
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 5: MOVEMENT */}
              {wizardStep === 5 && (
                <div className="space-y-4 sm:space-y-5 animate-fade-in font-sans">
                  {videoMode === 'POV' ? (
                    <div className="space-y-1">
                      <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest block">ETAPA 5 — LOCUÇÃO E FALAS (POV)</span>
                      <h3 className="text-lg font-black text-white">Configuração de Voz e Fala</h3>
                      <p className="text-xs text-[#8888AA]">Defina se o seu vídeo de apresentação POV terá locução nativa em português.</p>
                    </div>
                  ) : videoMode === 'MOVIMENTO' ? (
                    <div className="space-y-5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest block font-sans">ETAPA 5 — EFEITOS DE MOVIMENTO</span>
                        <h3 className="text-lg font-black text-white">Escolha o Movimento de Câmera/Produto</h3>
                        <p className="text-xs text-[#8888AA]">Selecione o movimento cinemático de destaque para a demonstração do produto. Posicione o cursor sobre o card para ver a pré-visualização.</p>
                      </div>

                      {/* Movements visual presets grid list with pre-visualization hover cards */}
                      <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 ${
                        showVoiceSettings 
                          ? 'max-h-[200px] xs:max-h-[240px] sm:max-h-[350px]' 
                          : 'max-h-[380px] xs:max-h-[460px] sm:max-h-[680px]'
                      } overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent`}>
                        {MOVEMENTS_PRESETS.map((mv) => {
                          const isSelected = movementSelectedMode === mv.id;
                          return (
                            <MovementCard
                              key={mv.id}
                              mv={mv}
                              isSelected={isSelected}
                              onSelect={() => {
                                setMovementSelectedMode(mv.id);
                              }}
                              onInfo={() => {
                                setSelectedMovementForModal(mv);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block">ETAPA 5 — MOVIMENTO</span>
                        <h3 className="text-lg font-black text-white">Escolha o Movimento</h3>
                        <p className="text-xs text-[#8888AA]">Selecione como o avatar premium do ViralSeller deve interagir e gesticular nos primeiros segundos.</p>
                      </div>

                      {/* Movements visuals grid presets list matching photo 3 */}
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-h-[260px] xs:max-h-[320px] sm:max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {MOVEMENTS_PRESETS.map((mv) => {
                          const isSelected = selectedMovementId === mv.id;
                          return (
                            <MovementCard
                              key={mv.id}
                              mv={mv}
                              isSelected={isSelected}
                              onSelect={() => {
                                setSelectedMovementId(mv.id);
                                setMovementText(mv.description);
                              }}
                              onInfo={() => {
                                setSelectedMovementForModal(mv);
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Custom backup text field */}
                      <div className="space-y-1.5 bg-[#0A0A0F]/40 border border-[#1E1E2E] p-3 rounded-2xl">
                        <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-cyan-400" /> Gesticulações e Ações Adicionais
                        </label>
                        <input
                          type="text"
                          required
                          value={movementText}
                          onChange={(e) => setMovementText(e.target.value)}
                          placeholder="Ex: Dar tapinhas de leve com as unhas segurando o bocal do produto sorrindo suave..."
                          className="w-full bg-[#030307] border border-[#1E1E2E] rounded-xl p-3 text-xs text-white focus:border-[#FE2C55] outline-none transition"
                        />
                      </div>
                    </>
                  )}

                  {/* Locução / Fala do Avatar (Com Fala vs Sem Fala) */}
                  {videoMode === 'MOVIMENTO' ? (
                    <div className="flex items-center justify-center p-4 bg-[#0A0A0F]/60 border border-[#1E1E2E] rounded-2xl">
                      <p className="text-xs text-zinc-500 font-bold tracking-wide">Modo Movimento: sem locução, apenas ação cinematográfica</p>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-[#0A0A0F]/60 border border-[#1E1E2E] p-3 sm:p-4 rounded-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 pb-2 border-b border-[#1E1E2E]/60">
                      <div>
                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-[#25F4EE]" /> Locuções e Falas do Avatar
                        </span>
                        <p className="text-[10px] text-[#8888AA]">Defina se o avatar apresentador terá falas ou se será um vídeo b-roll focado em visual.</p>
                      </div>
                    </div>

                    {videoMode === 'UGC' ? (
                      <div className="space-y-3 pt-1">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all bg-[#25F4EE]/10 border-[#25F4EE] text-white shadow-md shadow-[#25F4EE]/5 cursor-not-allowed"
                            title="Modo UGC sempre inclui fala do avatar"
                          >
                            <Volume2 className="w-4 h-4 text-[#25F4EE]" />
                            Com Fala (Português)
                          </button>

                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all bg-[#030307] border-[#1E1E2E] text-[#8888AA] opacity-30 cursor-not-allowed"
                            title="Modo UGC sempre inclui fala do avatar"
                          >
                            <VolumeX className="w-4 h-4 text-zinc-600" />
                            Sem Fala (Apenas Vídeo)
                          </button>
                        </div>
                        <p className="text-[10px] text-[#25F4EE] font-bold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#25F4EE]" /> Modo UGC sempre inclui fala do avatar
                        </p>
                      </div>
                    ) : videoMode === 'POV' ? (
                      <div className="space-y-3 pt-1">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all bg-[#25F4EE]/10 border-[#25F4EE] text-white shadow-md shadow-[#25F4EE]/5 cursor-not-allowed"
                            title="Modo POV sempre inclui narração"
                          >
                            <Volume2 className="w-4 h-4 text-[#25F4EE]" />
                            Com Fala (Português)
                          </button>

                          <button
                            type="button"
                            disabled
                            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all bg-[#030307] border-[#1E1E2E] text-[#8888AA] opacity-30 cursor-not-allowed"
                            title="Modo POV sempre inclui narração"
                          >
                            <VolumeX className="w-4 h-4 text-zinc-600" />
                            Sem Fala (Apenas Vídeo)
                          </button>
                        </div>
                        <p className="text-[10px] text-[#25F4EE] font-bold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#25F4EE]" /> Modo POV sempre inclui narração
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setHasSpeech(true)}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                            hasSpeech
                              ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-white shadow-md shadow-[#25F4EE]/5'
                              : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA] hover:text-white_90'
                          }`}
                        >
                          <Volume2 className={`w-4 h-4 ${hasSpeech ? 'text-[#25F4EE]' : ''}`} />
                          Com Fala (Português)
                        </button>

                        <button
                          type="button"
                          onClick={() => setHasSpeech(false)}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                            !hasSpeech
                              ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white shadow-md shadow-[#FE2C55]/5'
                              : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA] hover:text-white_90'
                          }`}
                        >
                          <VolumeX className={`w-4 h-4 ${!hasSpeech ? 'text-[#FE2C55]' : ''}`} />
                          Sem Fala (Apenas Vídeo)
                        </button>
                      </div>
                    )}

                    {(hasSpeech || videoMode === 'UGC') && (
                      <div className="mt-4 space-y-5 border-t border-[#1E1E2E] pt-4 animate-fade-in text-xs text-[#8888AA]">
                        {/* 1. Voice properties config bar */}
                        <div className="bg-[#030307]/80 p-3 sm:p-4 rounded-2xl border border-[#1E1E2E]/80 space-y-3.5">
                          <span className="text-[10px] font-black uppercase text-[#25F4EE] tracking-widest block">Configuração de Voz</span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                            {/* Gender */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-white uppercase tracking-wider block">Gênero da Voz</label>
                              <div className="flex gap-1.5">
                                {(['FEMININO', 'MASCULINO'] as const).map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => setSelectedGender(g)}
                                    className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition ${
                                      selectedGender === g
                                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                                        : 'bg-[#111118] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                                    }`}
                                  >
                                    {g === 'FEMININO' ? 'Feminino' : 'Masculino'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Tonality */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-white uppercase tracking-wider block">Tonalidade</label>
                              <div className="flex gap-1.5">
                                {['Vibrante', 'Profissional'].map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setVoiceTonality(t)}
                                    className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition ${
                                      voiceTonality === t
                                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                                        : 'bg-[#111118] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Energy */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-white uppercase tracking-wider block">Energia</label>
                              <div className="flex gap-1.5">
                                {['Alta', 'Média'].map((en) => (
                                  <button
                                    key={en}
                                    type="button"
                                    onClick={() => setVoiceEnergy(en)}
                                    className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition ${
                                      voiceEnergy === en
                                        ? 'bg-[#25F4EE]/10 border-[#25F4EE] text-white'
                                        : 'bg-[#111118] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                                    }`}
                                  >
                                    {en}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Tone */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-white uppercase tracking-wider block">Estilo de Tom</label>
                              <div className="flex gap-1.5">
                                {['Amigável', 'Autoridade'].map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => setVoiceTone(st)}
                                    className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition ${
                                      voiceTone === st
                                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white'
                                        : 'bg-[#111118] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Takes Selector */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white flex items-center justify-between">
                            <span>DURAÇÃO DO VÍDEO / NÚMERO DE TAKES</span>
                            <span className="text-[10px] text-[#25F4EE] font-mono">{numTakes * 8} segundos totais</span>
                          </label>
                          <div className="grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setNumTakes(t)}
                                className={`py-2 text-[10px] font-black rounded-xl border transition ${
                                  numTakes === t
                                    ? 'bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] border-transparent text-black font-black'
                                    : 'bg-[#030307] border-[#1E1E2E] text-[#8888AA] hover:text-white'
                                }`}
                              >
                                {t} {t === 1 ? 'Take' : 'Takes'} ({t * 8}s)
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* IA Auto-Fill Banner */}
                        <div className="flex items-center justify-between bg-[#11111E]/40 border border-[#FE2C55]/20 rounded-xl p-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider block">Assistência de Roteiro IA</span>
                            <p className="text-[9px] text-[#8888AA]">Gere de forma automatizada scripts comerciais curtos para os {numTakes} takes ativos.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const productName = activeWizardProduct?.name || 'este produto';
                              const descText = (activeWizardProduct?.description || 'altamente revolucionário').toLowerCase().replace(/\.$/, '');
                              
                              const takeTemplates = [
                                `Olha o poder desse ${productName}! Ele realmente resolve aquele problemão do seu dia a dia de forma mágica.`,
                                `E o melhor de tudo é a altíssima praticidade de uso. Você economiza tempo e tem resultados profissionais na hora.`,
                                `Perfeito para quem quer máxima qualidade sem complicações. Testado e totalmente aprovado por milhares de clientes reais!`,
                                `O acabamento premium e o design inteligente garantem que você tenha a melhor experiência possível sempre.`,
                                `Garanta já o seu clicando agora mesmo no link da tela. Aproveite a oferta exclusiva de frete grátis!`
                              ];
                              
                              setTakeTexts(takeTemplates);
                            }}
                            className="px-3 py-1.5 bg-[#FE2C55]/10 border border-[#FE2C55]/30 hover:bg-[#FE2C55]/20 text-[#FE2C55] text-[10px] font-black rounded-lg transition"
                          >
                            🪄 Preencher Roteiros com IA
                          </button>
                        </div>

                        {/* 3. Render takes textareas dynamically */}
                        <div className="space-y-4">
                          {Array.from({ length: numTakes }).map((_, i) => {
                            const takeText = takeTexts[i] || '';
                            const wordCount = takeText.trim() ? takeText.trim().split(/\s+/).length : 0;
                            const isOverLimit = wordCount > 20;
                            
                            const takeMeta = i === 0 
                              ? { title: 'Take 1 — GANCHO DE ATENÇÃO (HOOK)', desc: 'Prenda o espectador nos primeiros 8 segundos.', time: '0s - 8s' }
                              : i === 1
                              ? { title: 'Take 2 — APRESENTAÇÃO DO PRODUTO', desc: 'Introduza o produto físico e sua usabilidade.', time: '8s - 16s' }
                              : i === 2
                              ? { title: 'Take 3 — BENEFÍCIO CENTRAL', desc: 'Destaque o principal valor comercial e problema que resolve.', time: '16s - 24s' }
                              : i === 3
                              ? { title: 'Take 4 — DIFERENCIAL OU PROVA', desc: 'Explique por que este produto se sobressai no mercado.', time: '24s - 32s' }
                              : { title: 'Take 5 — CHAMADA PARA AÇÃO (CTA)', desc: 'Instrua o cliente a comprar agora de forma direta.', time: '32s - 40s' };

                            return (
                              <div key={i} className="bg-[#030307]/60 p-3.5 rounded-2xl border border-[#1E1E2E] space-y-2 animate-fade-in">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 bg-[#FE2C55] rounded-full" /> {takeMeta.title}
                                    </span>
                                    <p className="text-[9px] text-[#8888AA] mt-0.5">{takeMeta.desc}</p>
                                  </div>
                                  <span className="text-[9px] font-black bg-[#111118] border border-[#1E1E2E] px-2 py-0.5 rounded text-cyan-400 font-mono">
                                    {takeMeta.time}
                                  </span>
                                </div>

                                <textarea
                                  rows={2}
                                  value={takeText}
                                  onChange={(e) => {
                                    const next = [...takeTexts];
                                    next[i] = e.target.value;
                                    setTakeTexts(next);
                                  }}
                                  placeholder={`Roteiro curto de até 20 palavras faladas em português...`}
                                  className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none resize-none leading-relaxed transition"
                                />

                                <div className="flex justify-between items-center text-[9px] pt-1">
                                  <span className="text-[#666688] font-medium">Recomendado: até 20 palavras (8 segundos de fala)</span>
                                  <span className={`font-black ${isOverLimit ? 'text-rose-400' : 'text-emerald-400 font-mono'}`}>
                                    {wordCount} / 20 palavras
                                  </span>
                                </div>

                                {isOverLimit && (
                                  <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[9px] text-rose-300 leading-snug">
                                    ⚠️ <strong>Muito longo!</strong> O take de 8s limita a fala natural. Reduza o texto para não acelerar excessivamente a fisionomia facial do avatar.
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <span className="text-[9px] text-[#25F4EE] block font-semibold leading-normal pt-1">
                          💡 O prompt comercial em inglês instruirá os motores de renderização a manter as vozes e expressões 100% coordenadas com os takes acima de forma sequencial.
                        </span>
                      </div>
                    )}
                  </div>
                  )}
                </div>
              )}

              {/* STEP 6: OUTPUT PROMPT BLOCK GENERATED */}
              {wizardStep === 6 && (
                <div className="space-y-5 animate-fade-in relative">
                  {isLoadingPrompt && (
                    <div className="absolute inset-0 z-20 bg-[#07070C]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-[#06B6D4] animate-spin" />
                      <span className="text-xs font-black text-white uppercase tracking-widest animate-pulse">Recalculando Movimento do ViralSeller...</span>
                      <span className="text-[10px] text-[#8888AA]">Isso leva apenas alguns instantes</span>
                    </div>
                  )}
                  <div className="space-y-1 text-center border-b border-[#1E1E2E] pb-3">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> GERAÇÃO COMPLETA COM SUCESSO!
                    </span>
                    <h3 className="text-xl font-black text-white">Prompt Comercial Pronto para o ViralSeller</h3>
                    <p className="text-xs text-[#8888AA] mt-0.5">Baixe os arquivos de mídia associados e use os prompts abaixo para engrenar seu ViralSeller.</p>
                  </div>

                  {/* HIGHLY INTERACTIVE AND CONVENIENT BENTO RESOURCE GRID BOX FOR GOOGLE VIRALSELLER */}
                  <div className={`grid grid-cols-1 ${isCuratedScenario ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 border border-[#1E1E2E] bg-[#111118]/80 p-4 rounded-2xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FE2C55]/5 blur-2xl rounded-full" />
                    
                    {/* Header bar of assets */}
                    <div className={`${isCuratedScenario ? 'md:col-span-4' : 'md:col-span-3'} flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E1E2E] pb-2.5 gap-2`}>
                      <div className="flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-[#FE2C55]" />
                        <span className="text-xs font-black text-white uppercase tracking-wider">Recursos de Apoio do ViralSeller</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCuratedScenario && (
                          <button
                            onClick={handleDownloadAllAssets}
                            className="px-2.5 py-1 bg-gradient-to-r from-[#FE2C55] to-pink-600 hover:opacity-95 text-white text-[10px] font-black rounded-lg shadow-md hover:shadow-[#FE2C55]/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                            title="Baixar Avatar, Produto e Cenário selecionados em sequência"
                          >
                            <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
                            Baixar Combo Completo (Cenário + Produto + Avatar)
                          </button>
                        )}
                        <span className="text-[9px] text-[#8888AA] hidden sm:inline">Copie ou baixe cada suporte do vídeo comercial</span>
                      </div>
                    </div>

                    {/* Column 1: Avatar Image */}
                    <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl flex flex-col justify-between space-y-2.5">
                      <span className="text-[10px] text-[#8888AA] font-bold uppercase tracking-wider block">1. Avatar Escolhido</span>
                      
                      {selectedAvatarId === 'CUSTOM_PHOTO' ? (
                        <div className="flex flex-col items-center justify-center bg-[#111118] p-2.5 rounded-lg border border-dashed border-[#1E1E2E]/60 h-20 text-center">
                          <ArrowUpFromLine className="w-5 h-5 text-[#8888AA] mb-1" />
                          <span className="text-[10px] text-[#8888AA] font-bold leading-tight">Foto Própria do Usuário</span>
                          <span className="text-[8px] text-[#666688]">Subirá direto no ViralSeller do vídeo</span>
                        </div>
                      ) : (() => {
                        const avPreset = allAvatars.find(a => a.id === selectedAvatarId);
                        const imgUrlToUse = avPreset?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                        return (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-[#111118] p-2 rounded-lg border border-[#1E1E2E]">
                              <ImageWithSkeleton 
                                src={imgUrlToUse} 
                                alt={avPreset?.name || 'Avatar'} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-lg object-cover border border-[#1E1E2E]"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-white block truncate">{avPreset?.name || 'Avatar Customizado'}</span>
                                <span className="text-[9px] text-[#8888AA] block uppercase tracking-wider">{avPreset?.gender || 'PERSONALIZADO'}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                onClick={() => handleDownloadImagem(imgUrlToUse, `${avPreset?.name || 'avatar'}.jpg`)}
                                className="py-1 px-1.5 bg-[#1E1E2E] hover:bg-[#06B6D4]/10 hover:text-[#06B6D4] text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1"
                                title="Baixar imagem do avatar"
                              >
                                <Download className="w-3 h-3" /> Baixar
                              </button>
                              <button
                                onClick={() => {
                                  try {
                                    navigator.clipboard.writeText(imgUrlToUse);
                                    setCopiedAvatarLink(true);
                                    setTimeout(() => setCopiedAvatarLink(false), 2000);
                                  } catch (err) {}
                                }}
                                className="py-1 px-1.5 bg-[#1E1E2E] hover:bg-emerald-500/10 hover:text-emerald-400 text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1"
                                title="Copiar link da imagem"
                              >
                                {copiedAvatarLink ? "Copiado!" : "Copiar Link"}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Column 2: Product Image */}
                    <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl flex flex-col justify-between space-y-2.5">
                      <span className="text-[10px] text-[#8888AA] font-bold uppercase tracking-wider block">2. Foto do Produto</span>
                      {activeWizardProduct ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 bg-[#111118] p-2 rounded-lg border border-[#1E1E2E]">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#1E1E2E] shrink-0">
                              <ProductImage 
                                src={activeWizardProduct.imagem || activeWizardProduct.image_url} 
                                alt={activeWizardProduct.name || activeWizardProduct.nome} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-white block truncate">{activeWizardProduct.name || activeWizardProduct.nome}</span>
                              <span className="text-[9px] text-[#8888AA] block uppercase tracking-wider truncate">{activeWizardProduct.niche || activeWizardProduct.tags?.[0] || 'Produto'}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              onClick={() => handleDownloadImagem(activeWizardProduct.imagem || activeWizardProduct.image_url, 'produto.jpg')}
                              className="py-1 px-1.5 bg-[#1E1E2E] hover:bg-[#06B6D4]/10 hover:text-[#06B6D4] text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1"
                              title="Baixar foto do produto"
                            >
                              <Download className="w-3 h-3" /> Baixar
                            </button>
                            <button
                              onClick={() => {
                                  try {
                                    navigator.clipboard.writeText(activeWizardProduct.imagem || activeWizardProduct.image_url);
                                    setCopiedProductLink(true);
                                    setTimeout(() => setCopiedProductLink(false), 2000);
                                  } catch (err) {}
                                }}
                              className="py-1 px-1.5 bg-[#1E1E2E] hover:bg-emerald-500/10 hover:text-emerald-400 text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1"
                              title="Copiar link do produto"
                            >
                              {copiedProductLink ? "Copiado!" : "Copiar Link"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-20 bg-[#111118] rounded-lg border border-[#1E1E2E]">
                          <span className="text-[10px] text-[#8888AA]">Nenhum produto selecionado</span>
                        </div>
                      )}
                    </div>

                    {/* Column 2.5: Curated Scenario Image (Only shown if isCuratedScenario is active) */}
                    {isCuratedScenario && (() => {
                      const scPreset = CURATED_SCENARIOS_PRESETS.find(s => s.id === selectedScenarioId);
                      const scImgUrl = scPreset?.referenceImageUrl || scPreset?.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300';
                      return (
                        <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl flex flex-col justify-between space-y-2.5">
                          <span className="text-[10px] text-[#8888AA] font-bold uppercase tracking-wider block">3. Cenário Escolhido</span>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-[#111118] p-2 rounded-lg border border-[#1E1E2E]">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#1E1E2E] shrink-0">
                                <ImageWithSkeleton 
                                  src={scImgUrl} 
                                  alt={scPreset?.name || 'Cenário'} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-white block truncate">{scPreset?.name || 'Cenário'}</span>
                                <span className="text-[9px] text-[#8888AA] block uppercase tracking-wider truncate">{scPreset?.type || 'Pronto'}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                onClick={() => handleDownloadImagem(scImgUrl, `${scPreset?.name || 'cenario'}.jpg`)}
                                className="py-1 px-1.5 bg-[#1E1E2E] hover:bg-[#06B6D4]/10 hover:text-[#06B6D4] text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1"
                                title="Baixar foto do cenário"
                              >
                                <Download className="w-3 h-3" /> Baixar
                              </button>
                              <button
                                onClick={() => {
                                  try {
                                    navigator.clipboard.writeText(scImgUrl);
                                    setCopiedScenarioLink(true);
                                    setTimeout(() => setCopiedScenarioLink(false), 2000);
                                  } catch (err) {}
                                }}
                                className="py-1 px-1.5 bg-[#1E1E2E] hover:bg-emerald-500/10 hover:text-emerald-400 text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1"
                                title="Copiar link do cenário"
                              >
                                {copiedScenarioLink ? "Copiado!" : "Copiar Link"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Column 3: Movement Prompt */}
                    <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl flex flex-col justify-between space-y-2.5">
                      {(() => {
                        const activeMovementId = videoMode === 'MOVIMENTO' ? movementSelectedMode : selectedMovementId;
                        const mvPreset = MOVEMENTS_PRESETS.find(m => m.id === activeMovementId);
                        const mPrompt = mvPreset?.promptText || (mvPreset as any)?.prompt || movementText || "Showcasing product with engaging facial expressions.";
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[#8888AA] font-bold uppercase tracking-wider block">
                                {isCuratedScenario ? '4. Movimento Escolhido' : '3. Movimento Escolhido'}
                              </span>
                              {mvPreset && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedMovementForModal(mvPreset)}
                                  className="text-purple-400 hover:text-white transition-all flex items-center gap-0.5 text-[9px] font-black cursor-pointer"
                                  title="Ler toda a descrição do movimento"
                                >
                                  <Info className="w-3 h-3" /> Detalhes
                                </button>
                              )}
                            </div>
                            <div className="space-y-2">
                            <div className="bg-[#111118] p-2 rounded-lg border border-[#1E1E2E] h-12 flex flex-col justify-center">
                              <span className="text-[11px] font-bold text-white block truncate">{mvPreset?.name || 'Movimento'}</span>
                              <span className="text-[9px] text-emerald-400 block truncate select-all font-mono italic">{mPrompt}</span>
                            </div>
                            
                            <button
                              onClick={() => {
                                try {
                                  navigator.clipboard.writeText(mPrompt);
                                  setCopiedMovementPrompt(true);
                                  setTimeout(() => setCopiedMovementPrompt(false), 2000);
                                } catch (err) {}
                              }}
                              className="w-full py-1 px-1.5 bg-[#1E1E2E] hover:bg-[#7C3AED]/20 hover:text-[#C084FC] text-[10px] font-black rounded-lg text-[#F0F0FF] transition-all flex items-center justify-center gap-1.5"
                              title="Copiar prompt de movimento"
                            >
                              <Copy className="w-3 h-3" />
                              {copiedMovementPrompt ? "✅ Copiado!" : "Copiar Movimento"}
                            </button>
                            
                            {/* Trocar Movimento Dropdown Selector */}
                            <div className="pt-2 border-t border-[#1E1E2E]/80 space-y-1">
                              <span className="text-[9px] font-black uppercase text-[#8888AA] flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-purple-400" /> Outro Movimento:
                              </span>
                              <select
                                value={activeMovementId}
                                disabled={isLoadingPrompt}
                                onChange={(e) => handleGeneratePrompt(e.target.value)}
                                className="w-full text-[10px] font-bold text-white bg-[#030307] border border-[#1E1E2E] rounded-lg p-1 px-2 focus:border-purple-500 hover:border-[#333] transition-all outline-none cursor-pointer"
                              >
                                {MOVEMENTS_PRESETS.map((m) => (
                                  <option key={m.id} value={m.id} className="bg-[#0A0A0F] text-xs">
                                    {m.name} ({m.type})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </>
                      );
                      })()}
                    </div>

                  </div>

                  {/* TWO DISTINCT INTERACTIVE PROMPT STEPS FOR IMAGE & VIDEO SEGMENTATION */}
                  <div className="space-y-6">
                    
                    {/* STEP 1: IMAGE PROMPT CARD */}
                    {videoMode !== 'UGC' && (
                      <div className="bg-[#111118]/90 border border-[#1E1E2E] rounded-2xl p-4 space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#06B6D4]/5 blur-2xl rounded-full" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#06B6D4] text-[#0A0A0F] text-xs font-black">1</span>
                            <h4 className="text-sm font-black text-white uppercase tracking-wider">Passo 1: Prompt de Geração das 4 Fotos Reais</h4>
                          </div>
                          <span className="text-[10px] bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 p-1 px-2 rounded-lg font-black uppercase tracking-widest">Controle de Fidelidade</span>
                        </div>
                        
                        <p className="text-[11px] text-[#8888AA] leading-relaxed">
                          Baixe as fotos do seu **Avatar** e do seu **Produto** na aba "Recursos de Apoio do ViralSeller" acima. Em seguida, anexe ambas como imagens de referência no seu gerador de imagem (como Midjourney ou Stable diffusion) e use o prompt abaixo para gerar <strong className="text-emerald-400">4 Fotos Realistas</strong> do seu avatar segurando e interagindo com o seu produto real, sem inventar designs fictícios!
                        </p>

                        <div className="p-3.5 bg-[#030307]/90 border border-[#1E1E2E] rounded-xl font-mono text-[11px] text-[#A6E22E] overflow-y-auto max-h-[140px] leading-relaxed select-text">
                          <pre className="whitespace-pre-wrap font-sans text-emerald-300">
                            {generatedImagePrompt}
                          </pre>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[#666688] font-bold">Copie este prompt para gerar as 4 fotos</span>
                          <button
                            onClick={() => handleCopyPrompt('image')}
                            className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                              copyImageStatus 
                                ? 'bg-emerald-500 text-[#0A0A0F]' 
                                : 'bg-[#1E1E2E] hover:bg-[#06B6D4]/10 text-white hover:text-[#06B6D4]'
                            }`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {copyImageStatus ? 'Prompt Copiado!' : 'Copiar Prompt de Imagem'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: VIDEO PROMPT CARD */}
                    <div className="bg-[#111118]/90 border border-[#1E1E2E] rounded-2xl p-4 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/5 blur-2xl rounded-full" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-black">
                            {videoMode === 'UGC' ? '1' : '2'}
                          </span>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            {videoMode === 'UGC' ? 'Passo 1: Prompt de Vídeo Completo (HighViralSeller Studies)' : 'Passo 2: Prompt de Vídeo Completo (HighViralSeller Studies)'}
                          </h4>
                        </div>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 p-1 px-2 rounded-lg font-black uppercase tracking-widest">Sincronização & Movimento</span>
                      </div>

                      <p className="text-[11px] text-[#8888AA] leading-relaxed">
                        {videoMode === 'UGC' ? (
                          <>
                            Anexe as <strong className="text-purple-400">imagens de referência (avatar, cenário e produto)</strong> no seu gerador de vídeo. Em seguida, cole o prompt abaixo para animar o movimento, o cenário e a interação escolhidos com perfeita sincronia labial!
                          </>
                        ) : (
                          <>
                            Faça o upload das <strong className="text-purple-400">4 fotos reais geradas no Passo 1</strong> na área de referências sequenciais (frames de início) do seu gerador de vídeo. Em seguida, cole o prompt abaixo para animar o movimento, o cenário e a interação escolhidos com perfeita sincronia labial e sem bordas ou legendas fantasmas!
                          </>
                        )}
                      </p>

                      <div className="p-3.5 bg-[#030307]/90 border border-[#1E1E2E] rounded-xl font-mono text-[11px] text-purple-300 overflow-y-auto max-h-[180px] leading-relaxed select-text">
                        <pre className="whitespace-pre-wrap font-sans text-purple-200">
                          {generatedPrompt}
                        </pre>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[#666688] font-bold">
                          {videoMode === 'UGC' ? 'Copie o prompt completo abaixo para usar no gerador' : 'Copia exatamente de "Your detailed prompt..." para baixo'}
                        </span>
                        <button
                          onClick={() => handleCopyPrompt('video')}
                          className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                            copyVideoStatus 
                              ? 'bg-emerald-500 text-[#0A0A0F]' 
                              : 'bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] text-white hover:opacity-90'
                          }`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copyVideoStatus ? 'Prompt Copiado!' : 'Copiar Prompt de Vídeo'}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Form Footer Action Row (Prev / Next transitions) */}
            <div className="border-t border-[#1E1E2E] pt-3 pb-3 sm:pb-0 sm:pt-4 sm:mt-6 mt-auto flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 sticky bottom-0 bg-[#111118] z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 -mb-4 sm:-mb-6 shadow-[0_-10px_30px_rgba(17,17,24,0.9)]">
              
              {/* Back or Prev inside active wizard */}
              <div className="flex gap-2">
                {wizardStep >= 2 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="w-full sm:w-auto px-4 py-2 min-h-[48px] sm:min-h-0 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-xs font-black rounded-xl text-[#A0A0C0] hover:text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Etapa Anterior
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetWizard}
                    className="w-full sm:w-auto px-4 py-2 min-h-[48px] sm:min-h-0 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-xs font-bold rounded-xl text-[#8888AA] hover:text-white flex items-center justify-center"
                  >
                    Cancelar Assistente
                  </button>
                )}
                {wizardStep === 6 && (
                  <button
                    type="button"
                    onClick={handleResetWizard}
                    className="px-4 py-2 min-h-[48px] sm:min-h-0 bg-[#1E1E2E] hover:bg-[#26263B] text-xs font-black rounded-xl text-[#F00050] flex items-center justify-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-4 h-4" /> Novo Vídeo / Reiniciar
                  </button>
                )}
              </div>

              {/* Progress or Submit action button */}
              {videoMode === 'UGC' && wizardStep === 2 ? (
                <button
                  type="button"
                  disabled={isLoadingPrompt}
                  onClick={() => handleGeneratePrompt()}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[48px] sm:min-h-0 bg-gradient-to-r from-emerald-500 to-cyan-500 disabled:opacity-55 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 hover:opacity-95 shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                >
                  {isLoadingPrompt ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      Otimizando Roteiro no Estúdio...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      Gerar Prompt para o ViralSeller (UGC)
                    </>
                  )}
                </button>
              ) : wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    // Simple input validations before advancing
                    if (wizardStep === 2 && videoMode !== 'POV' && !avatarText.trim()) {
                      // Fallback if empty
                      setAvatarText('Avatar padrão.');
                    }
                    if (wizardStep === 2 && videoMode === 'POV' && !povScenarioSelected) {
                      setPovScenarioSelected('🛋️ Sala Moderna');
                    }
                    setWizardStep(wizardStep + 1);
                    // Scroll to top of the wizard container
                    const container = document.getElementById('wizard-container');
                    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-4 py-2 min-h-[48px] sm:min-h-0 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 transition-all shadow-md shadow-[#FE2C55]/10 active:scale-95"
                >
                  Confirmar e Avançar <ArrowRight className="w-4 h-4" />
                </button>
              ) : wizardStep === 5 ? (
                <button
                  type="button"
                  disabled={isLoadingPrompt}
                  onClick={() => handleGeneratePrompt()}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[48px] sm:min-h-0 bg-gradient-to-r from-emerald-500 to-cyan-500 disabled:opacity-55 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 hover:opacity-95 shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                >
                  {isLoadingPrompt ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      Otimizando Roteiro no Estúdio...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      Gerar Prompt para o ViralSeller
                    </>
                  )}
                </button>
              ) : (
                <a
                  href="https://labs.google/fx/pt/tools/flow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] hover:opacity-95 text-black font-black text-xs rounded-xl flex items-center gap-1.5 transition shadow-md shadow-[#FE2C55]/10 active:scale-95 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-black fill-black" />
                  Ir para o ViralSeller
                </a>
              )}

            </div>

          </div>

          {/* Right Product Spotlight Summary Panel (1/3 width) */}
          {wizardStep !== 1 && activeWizardProduct && !hidePanelsOnMobileMovimento && !isStep3Movimento && !(videoMode === 'MOVIMENTO' && wizardStep === 4) && (
            <div className="bg-[#010101] border border-[#1E1E2E] rounded-3xl p-5 flex flex-col justify-between hover:border-cyan-500/20 transition relative">
              <div className="space-y-4">
                <span className="text-[10px] text-[#A0A0C0] font-black uppercase tracking-wider block border-b border-[#1E1E2E] pb-2.5">
                  🎯 Produto Comercial Ativo
                </span>

                {/* Product Card with Thumbnail */}
                <div className="rounded-2xl overflow-hidden border border-[#1E1E2E]/80 bg-[#0A0A0F]">
                  <div className="w-full h-36">
                    <ProductImage 
                      src={activeWizardProduct.imagem || activeWizardProduct.image_url} 
                      alt={activeWizardProduct.name || activeWizardProduct.nome} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-extrabold text-[#25F4EE] bg-[#25F4EE]/10 px-2 py-0.5 rounded border border-[#25F4EE]/20 tracking-wider inline-block">
                      {activeWizardProduct.niche || activeWizardProduct.tags?.[0] || 'Produto'}
                    </span>
                    <h4 className="text-sm font-black text-white">{activeWizardProduct.name || activeWizardProduct.nome}</h4>
                    <p className="text-[11px] text-[#8888AA] line-clamp-3 leading-relaxed">{activeWizardProduct.description || activeWizardProduct.trend_reason}</p>
                  </div>
                </div>

                {/* Opportunity Metter info widget */}
                <div className="p-3.5 bg-[#0F0F16] border border-[#1E1E2E] rounded-2xl space-y-1.5 text-xs text-[#8888AA]">
                  <div className="flex justify-between items-center text-[10px]">
                    <span>Score de Tendência:</span>
                    <strong className="text-emerald-400 font-extrabold">{Number(activeWizardProduct.opportunity_score) || 75}/100</strong>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Number(activeWizardProduct.opportunity_score) || 75}%` }} />
                  </div>
                  <p className="text-[10px] text-[#666688] pt-1">{activeWizardProduct.trend_reason}</p>
                </div>

                {/* Setup diagnostics block */}
                <div className="p-3 bg-[#0C1211]/60 border border-emerald-500/15 rounded-xl flex items-start gap-2 text-[10px] text-emerald-400/80 leading-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  <span>Os prompts de avatar do assistente garantem fidelidade corporal fotorrealista de alto padrão e alinhamento cinemático.</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E1E2E] text-[10px] text-[#666688] flex items-center justify-between">
                <span>Formato do Output:</span>
                <span className="text-cyan-400">Cinematic 4K UHD</span>
              </div>
            </div>
          )}

        </div>

        {showViralSellerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-[#030307] border border-[#1E1E2E] hover:border-[#25F4EE]/20 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl shadow-[#FE2C55]/15 flex flex-col relative p-5 sm:p-6 space-y-5 my-8">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#25F4EE]" />
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide">Como Gerar seu Vídeo no ViralSeller</h3>
                </div>
                <button 
                  onClick={() => setShowViralSellerModal(false)}
                  className="w-8 h-8 rounded-full bg-[#1E1E2E] flex items-center justify-center text-[#8888AA] hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warning / Active Credits Alert Badge */}
              <div className="p-3.5 bg-[#FE2C55]/5 border border-[#FE2C55]/15 rounded-2xl flex items-start gap-2.5">
                <Coins className="w-5 h-5 text-[#FE2C55] shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300 leading-relaxed font-semibold">
                  <span className="text-[#FE2C55] font-black uppercase tracking-wider">50 Créditos Diários Disponíveis</span>
                  <p className="mt-1 font-medium">Ao criar sua conta gratuita no ViralSeller, você recebe <strong className="text-white font-black">50 créditos diários gratuitos</strong> para renderizações exclusivas sem qualquer cobrança!</p>
                </div>
              </div>

              {/* Step-by-Step Instructions Card Block */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-[#8888AA] uppercase tracking-widest block">
                  Passo a Passo de Geração do Vídeo
                </span>

                <div className="space-y-2.5 font-medium">
                  
                  {/* Step 1 */}
                  <div className="flex gap-3 bg-[#0A0A0F] border border-[#1E1E2E]/60 p-3 rounded-xl hover:border-[#25F4EE]/10 transition">
                    <div className="w-6 h-6 rounded-lg bg-[#25F4EE]/10 border border-[#25F4EE]/20 flex items-center justify-center text-xs font-black text-[#25F4EE] shrink-0">
                      1
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-white font-bold block mb-0.5">Copiar o Prompt</strong>
                      Clique no botão para copiar o bloco detalhado de prompt comercial em inglês gerado pelo assistente.
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3 bg-[#0A0A0F] border border-[#1E1E2E]/60 p-3 rounded-xl hover:border-[#25F4EE]/10 transition">
                    <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-xs font-black text-[#9333EA] shrink-0">
                      2
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-white font-bold block mb-0.5">Criar Conta no ViralSeller</strong>
                      Acesse o site oficial do ViralSeller e faça login ou crie sua conta gratuita.
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3 bg-[#0A0A0F] border border-[#1E1E2E]/60 p-3 rounded-xl hover:border-[#25F4EE]/10 transition">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-black text-emerald-400 shrink-0">
                      3
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-white font-bold block mb-0.5">Colar o Prompt</strong>
                      Na caixa de texto do estúdio do ViralSeller, cole o prompt em inglês. Se você escolheu usar sua foto própria, faça o upload de sua imagem no estúdio (Image-to-Video).
                    </div>
                  </div>

                  {/* Step-by-Step Instructions block: step 4 & 5 grouped for layout balance */}
                  <div className="flex gap-3 bg-[#0A0A0F] border border-[#1E1E2E]/60 p-3 rounded-xl hover:border-[#25F4EE]/10 transition">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-black text-amber-400 shrink-0">
                      4
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-white font-bold block mb-0.5">Gerar o Vídeo Comercial</strong>
                      Inicie a renderização da inteligência artificial para animar e gesticular o avatar.
                    </div>
                  </div>

                  <div className="flex gap-3 bg-[#0A0A0F] border border-[#1E1E2E]/60 p-3 rounded-xl hover:border-[#25F4EE]/10 transition">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xs font-black text-[#38bdf8] shrink-0">
                      5
                    </div>
                    <div className="text-xs text-zinc-300 leading-relaxed">
                      <strong className="text-white font-bold block mb-0.5">Baixar o Vídeo do ViralSeller</strong>
                      Faça o download do arquivo de vídeo renderizado da própria plataforma oficial do ViralSeller.
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-[#1E1E2E] flex flex-col gap-2.5">
                <a 
                  href="https://labs.google/fx/pt/tools/flow" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => setShowViralSellerModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#06B6D4] via-[#FE2C55] to-[#7C3AED] hover:opacity-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-[#FE2C55]/15 transition-all active:scale-[0.98] text-center"
                >
                  ACESSAR GOOGLE VIRALSELLER AGORA <ExternalLink className="w-4 h-4 text-white" />
                </a>
                <button 
                  type="button"
                  onClick={() => setShowViralSellerModal(false)}
                  className="w-full py-2 bg-[#1E1E2E] hover:bg-[#26263B] text-[#8888AA] hover:text-white font-black text-xs rounded-xl transition"
                >
                  Voltar ao Assistente
                </button>
              </div>

            </div>
          </div>
        )}

        {showAffiliateModal && affiliateProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-[#030307] border border-[#1E1E2E] hover:border-[#25F4EE]/20 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl shadow-emerald-500/10 flex flex-col relative p-6 space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide">TikTok Shop Afiliação</h3>
                </div>
                <button 
                  onClick={() => setShowAffiliateModal(false)}
                  className="w-8 h-8 rounded-full bg-[#1E1E2E] flex items-center justify-center text-[#8888AA] hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {affiliateStep === 'loading' ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                  <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin" />
                  <div className="space-y-1.5">
                    <p className="text-sm font-black text-white">Buscando Link Comercial...</p>
                    <p className="text-xs text-[#8888AA]">Conectando com o banco de afiliações para gerar seu link exclusivo.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex gap-3 bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#2F2F4E]/30 bg-[#030307] flex items-center justify-center">
                      <ProductImage 
                        src={affiliateProduct.imagem || affiliateProduct.image_url} 
                        alt={affiliateProduct.nome || affiliateProduct.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-wider uppercase inline-block">
                        Comissão: {affiliateProduct.afiliado?.comissao || '10%'}
                      </span>
                      <h4 className="text-xs font-black text-white line-clamp-2 leading-tight">
                        {affiliateProduct.nome || affiliateProduct.name}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-[#8888AA] uppercase tracking-widest block">
                      Seu Link de Afiliado Único
                    </span>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2.5 bg-[#030307] border border-[#1E1E2E] rounded-xl font-mono text-xs text-emerald-400 truncate select-all">
                        {affiliateLinkGenerated}
                      </div>
                      <button
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(affiliateLinkGenerated);
                            alert("Link de afiliado copiado!");
                          } catch (err) {}
                        }}
                        className="px-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-xl transition active:scale-95 flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-zinc-300 leading-normal font-medium">
                      <p className="font-bold text-white">Pronto para vender!</p>
                      Sempre que um usuário comprar o produto através deste link exclusivo, sua comissão de <strong className="text-emerald-400">{affiliateProduct.afiliado?.comissao || '10%'}</strong> será creditada automaticamente em sua carteira do TikTok Creator.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E1E2E] flex gap-2">
                    <a
                      href={affiliateLinkGenerated}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-[#FE2C55] hover:bg-[#ff3d64] text-white text-xs font-black rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-md shadow-[#FE2C55]/20"
                    >
                      Ir para TikTok Shop <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setShowAffiliateModal(false)}
                      className="px-4 py-2.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8888AA] hover:text-white text-xs font-black rounded-xl transition"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {showAddAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div className="bg-[#030307] border border-emerald-500/30 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl shadow-emerald-500/10 flex flex-col relative p-5 sm:p-6 space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                    Adicionar Produto (Admin)
                  </h3>
                </div>
                <button 
                  onClick={() => setShowAddAdminModal(false)}
                  className="w-8 h-8 rounded-full bg-[#1E1E2E] flex items-center justify-center text-[#8888AA] hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setAdminAddLoading(true);
                try {
                  const payload = {
                    name: adminProdName,
                    price: adminProdPrice,
                    trend: adminProdTrend,
                    tiktok_link: adminProdAffiliateLink,
                    // If backend accepts it:
                    niche: adminProdNiche,
                    image_url: adminProdImgUrl,
                    commission: adminProdCommission,
                  };
                  const res = await fetch('/api/admin/produtos-alta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  if (res.ok) {
                    if (onRefresh) onRefresh();
                    setShowAddAdminModal(false);
                    setAdminProdName('');
                    setAdminProdPrice('');
                    setAdminProdTrend('');
                    setAdminProdAffiliateLink('');
                    setAdminProdImgUrl('');
                    setAdminProdCommission('');
                  } else {
                    alert('Erro ao adicionar produto');
                  }
                } catch (err) {
                  alert('Erro de rede');
                } finally {
                  setAdminAddLoading(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Nome</label>
                    <input type="text" required value={adminProdName} onChange={e => setAdminProdName(e.target.value)} className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Preço</label>
                    <input type="text" required value={adminProdPrice} onChange={e => setAdminProdPrice(e.target.value)} placeholder="Ex: R$ 97,00" className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">URL da Foto</label>
                    <input type="url" value={adminProdImgUrl} onChange={e => setAdminProdImgUrl(e.target.value)} className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Nicho / Categoria</label>
                    <input type="text" value={adminProdNiche} onChange={e => setAdminProdNiche(e.target.value)} className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Tendência</label>
                    <input type="text" required value={adminProdTrend} onChange={e => setAdminProdTrend(e.target.value)} placeholder="Ex: +30%" className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Comissão</label>
                    <input type="text" value={adminProdCommission} onChange={e => setAdminProdCommission(e.target.value)} placeholder="Ex: 10%" className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">Link Afiliado (TikTok/etc)</label>
                    <input type="text" required value={adminProdAffiliateLink} onChange={e => setAdminProdAffiliateLink(e.target.value)} className="w-full bg-[#111118] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={adminAddLoading} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                    {adminAddLoading ? 'Adicionando...' : 'Salvar Produto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showVideoModal && createPortal(
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) setShowVideoModal(false); }}
          >
            <div className="relative w-full max-w-4xl mx-4 max-h-[95vh] overflow-y-auto bg-[#030307] border border-[#1E1E2E] hover:border-[#FE2C55]/20 rounded-3xl shadow-2xl shadow-[#FE2C55]/10 flex flex-col p-5 sm:p-6 space-y-5">
              {selectedVideoProduct ? (
                <>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FE2C55]" />
                  <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                    Gerar Vídeo para {selectedVideoProduct.nome || selectedVideoProduct.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="w-8 h-8 rounded-full bg-[#1E1E2E] flex items-center justify-center text-[#8888AA] hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Selection Screen */}
              <div className="space-y-6 py-4 animate-fade-in">
                <div className="text-center space-y-1.5 max-w-lg mx-auto">
                  <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-wider">Passo Inicial</span>
                  <h4 className="text-lg font-black text-white">Selecione o Modo de Vídeo Desejado</h4>
                  <p className="text-xs text-[#8888AA]">Cada modo utiliza uma abordagem específica de IA para maximizar a conversão e o engajamento com o seu produto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {MODOS_GERACAO.map((modo) => {
                    const isUGC = modo.id === 'ugc';
                    const isPOV = modo.id === 'pov';
                    const isMov = modo.id === 'movimento';

                    let colorTheme = isUGC ? 'text-[#FE2C55] hover:border-[#FE2C55]/30' : isPOV ? 'text-purple-400 hover:border-purple-500/30' : 'text-cyan-400 hover:border-cyan-500/30';
                    let bgTheme = isUGC ? 'bg-[#FE2C55]/10 border-[#FE2C55]/20' : isPOV ? 'bg-purple-500/10 border-purple-500/20' : 'bg-cyan-500/10 border-cyan-500/20';

                    return (
                      <div
                        key={modo.id}
                        onClick={() => {
                          const prod = selectedVideoProduct as any;
                          setVideoMode(isUGC ? 'UGC' : isPOV ? 'POV' : 'MOVIMENTO');
                          setActiveWizardProduct(prod);
                          setAvatarText('');
                          setScenarioText('');
                          setMovementText('');
                          setHasSpeech(true);
                          const safeDesc = (prod.description || 'é sensacional').toLowerCase().replace(/\.$/, '');
                          const defaultScript = `Olha esse produto incrível! O ${prod.nome || prod.name || 'Produto'} é perfeito porque ${safeDesc}. Garanta já o seu no link!`;
                          setSpeechScript(defaultScript);
                          setTakeTexts([defaultScript, '', '', '', '']);
                          
                          if (isUGC) {
                            setInteractionSelected('L');
                            setInteractionText('📱 Celular vertical (9:16) com expressões reais, cenários domésticos e movimentos nativos virais.');
                          } else if (isPOV) {
                            setInteractionSelected('E');
                            setInteractionText('Primeira pessoa (POV), apenas as mãos aparecem interagindo com o produto em câmera lenta (sem rosto/avatar).');
                          } else {
                            setInteractionSelected('B');
                            setInteractionText('O avatar segura e manipula o objeto para as lentes, com foco nas texturas.');
                          }
                          setWizardStep(2);
                          setShowVideoModal(false);
                        }}
                        className={`bg-[#0B0B11] border border-[#1E1E2E] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg cursor-pointer group ${colorTheme}`}
                      >
                        <div className="relative w-full aspect-[9/16] bg-[#030307]">
                          {modo.videoUrl ? (
                            <LazyVideo
                              src={modo.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="none"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#1E1E2E] font-bold text-[10px] uppercase tracking-wider">
                              Preview Indisponível
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                          
                          <div className="absolute bottom-0 left-0 w-full p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${bgTheme} flex items-center justify-center`}>
                                <span className="text-sm">{modo.icone}</span>
                              </div>
                              <h5 className={`text-sm font-black uppercase tracking-wider transition ${colorTheme}`}>{modo.nome}</h5>
                            </div>
                            <p className="text-xs text-[#8888AA] leading-relaxed drop-shadow-md">{modo.descricao}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </>
            ) : (
              <div className="text-white text-sm">Carregando...</div>
            )}
            </div>
          </div>,
          document.body
        )}

        {/* Fullscreen Movement Preview Modal */}
        {selectedMovementForModal && (
          <div 
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMovementForModal(null);
            }}
            ref={(node) => {
              if (node) {
                // Pause all videos behind the modal
                document.querySelectorAll('video').forEach(v => {
                  if (!node.contains(v)) {
                    v.pause();
                  }
                });
              }
            }}
          >
            <button 
              onClick={() => setSelectedMovementForModal(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-w-[320px] mx-auto px-4 sm:px-0 flex flex-col items-center z-10">
              <div className="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-[#25F4EE]/30 shadow-[0_0_40px_rgba(37,244,238,0.15)] mb-6 relative">
                {selectedMovementForModal.videoUrl ? (
                  <LazyVideo 
                    src={selectedMovementForModal.videoUrl}
                    poster={selectedMovementForModal.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    preload="none"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithSkeleton 
                    src={selectedMovementForModal.imageUrl}
                    alt={selectedMovementForModal.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="text-lg font-black text-white text-center mb-2">{selectedMovementForModal.name}</h3>
              <p className="text-sm text-zinc-400 text-center leading-relaxed mb-6 px-2">{selectedMovementForModal.description}</p>
              
              <button
                onClick={() => {
                  setSelectedMovementId(selectedMovementForModal.id);
                  setMovementText(selectedMovementForModal.description);
                  setMovementSelectedMode(selectedMovementForModal.id);
                  setSelectedMovementForModal(null);
                }}
                className="w-full min-h-[52px] bg-gradient-to-r from-[#FE2C55] to-[#FE1E4E] text-white font-black text-sm uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#FE2C55]/20 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Usar este Movimento
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen Kalodata Search Overlay */}
        {showKalodataOverlay && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center text-white font-sans p-6 animate-fade-in">
            <div className="w-full max-w-md text-center space-y-8">
              {/* Pulsing Kalodata Logo icon */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 p-0.5 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-full h-full bg-[#0B0B11] rounded-[14px] flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white tracking-tighter">Kalo</span>
                    <span className="text-[10px] font-black uppercase text-cyan-400 tracking-widest mt-0.5">data</span>
                  </div>
                </div>
              </div>

              {/* Status Message and Phase Progression */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-white tracking-wide transition-all duration-300">
                  {kalodataSearchPhase === 1 && "🔗 Conectando ao Kalodata..."}
                  {kalodataSearchPhase === 2 && "📊 Analisando produtos em alta no Brasil..."}
                  {kalodataSearchPhase === 3 && "🔥 Identificando tendências de vendas..."}
                  {kalodataSearchPhase === 4 && `✅ ${kalodataCounter} produtos sincronizados!`}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {kalodataSearchPhase === 1 && "Estabelecendo handshake seguro com servidores do Kalodata BR..."}
                  {kalodataSearchPhase === 2 && "Varrendo banco de dados de vendas para identificar produtos quentes..."}
                  {kalodataSearchPhase === 3 && "Calculando velocidade de vendas e engajamento viral..."}
                  {kalodataSearchPhase === 4 && "Tudo pronto! Carregando feed de produtos de alta conversão..."}
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2">
                <div className="w-full bg-[#1E1E2E] h-2.5 rounded-full overflow-hidden border border-zinc-800/80 p-[2px]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ 
                      width: 
                        kalodataSearchPhase === 1 ? '25%' :
                        kalodataSearchPhase === 2 ? '50%' :
                        kalodataSearchPhase === 3 ? '75%' : '100%'
                    }}
                  />
                </div>
                
                {/* Counter indicator */}
                <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500">
                  <span>Sincronizando...</span>
                  <span className="text-cyan-400 font-bold">{kalodataCounter} / {kalodataTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }
